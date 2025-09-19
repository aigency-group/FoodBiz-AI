# Hybrid RAG Architecture (v2)

## 1. Overview
The FoodBiz AI assistant now combines two retrieval strategies:

1. **Document Vector Search** — for policy, 가이드, 리뷰 요약 등 텍스트 기반 질문.
2. **Real-time SQL Timeseries** — for 매출/추이 등 수치형 의도. Supabase `public.metrics_daily` 테이블을 직접 조회합니다.

A lightweight router inspects the 사용자 쿼리. 키워드(매출·추이·전주 등)가 감지되면 SQL 경로, 그렇지 않으면 벡터 검색이 선택됩니다. 모든 응답은 공통 스키마를 준수합니다.

```mermaid
graph TD
    Q[사용자 질의] --> R{Hybrid Router}
    R -->|SQL_TIME_SERIES| S[Supabase metrics_daily]
    S --> M[Timeseries 계산 & LLM 해설]
    R -->|VECTOR_SEARCH| V[Chroma Vector Store]
    V --> P[LLM 문서 요약]
    M --> E[Unified Response]
    P --> E
    E --> C[answer + sources + charts + calculations]
```

## 2. Document Indexing
```
File location: docs/policies/**/*.{md,txt,pdf}
Persist directory: data/chroma
Splitter: RecursiveCharacterTextSplitter (chunk 1000 / overlap 150)
Embeddings: OpenAI (model configurable via RAG_EMBEDDING_MODEL)
Vector store: Chroma (disk persistence)
```
`POST /rag/index` rebuilds the index. Each Document chunk stores `source` 경로와 `uploaded_at` ISO timestamp.

## 3. Context Builder
- `build_context(query, business_id, date_from, date_to)`가 한 번의 호출로 아래 데이터를 수집합니다.
  1. `metrics_daily` 시계열 + 통계
  2. `reviews` 요약 + 최근 3건
  3. `policy_products` 추천/검색 Top-N
  4. 벡터 문서 상위 K개 (`rag_indexer.vector_search`)
- 반환 결과는 `contexts`, `sources`, `metrics`, `reviews`, `policies`, `documents`, `meta` 구조이며, RAG 파이프라인은 이를 그대로 재사용합니다.

## 4. Vector Retrieval & Generation
1. Context builder가 제공한 문서 컨텍스트(`bundle.documents`)를 기반으로 `ChatOpenAI` 호출.
2. 시스템 프롬프트는 `app/prompts/system_prompt.py` 템플릿에 `bundle.meta`를 주입하여 동적으로 생성.
3. 최종 답변은 한국어로 요약되고, 문서 출처(`type: doc`)가 함께 반환됩니다.

## 5. SQL Timeseries Path
1. Context builder가 전달한 `metrics.series`와 `stats`를 사용해 차트+계산을 구성합니다.
2. `llm_explain_timeseries`가 수치형 데이터를 요약하며, 리뷰/정책 컨텍스트 문자열도 함께 제공됩니다.
3. 차트(`type: timeseries`), 계산 결과, SQL 출처(`metrics_daily`, `reviews`, `policy_products`)를 응답에 포함합니다.

## 6. Unified Response Schema
```jsonc
{
  "answer": "…LLM 해설…",
  "sources": [
    { "type": "sql", "name": "public.metrics_daily", "meta": {"from": "2025-01-01", "to": "2025-01-30"} },
    { "type": "sql", "name": "public.reviews", "meta": {"review_count": "42", "average_rating": "4.3"} },
    { "type": "sql", "name": "public.policy_products", "meta": {"top_products": "우리 사잇돌 중금리대출, 위비 SOHO 모바일 신용대출"} },
    { "type": "doc", "name": "docs/policies/eligibility.md", "meta": {"uploaded_at": "2025-02-01T02:13:00"} }
  ],
  "charts": [
    { "type": "timeseries", "series": [{ "name": "매출", "data": [{"x": "2025-01-01", "y": 432100 }, … ] }] }
  ],
  "calculations": { "moving_avg_7": 418400.0, "pct_change_7d": -0.12 }
}
```
모든 경로에서 동일한 스키마가 유지되므로 프런트엔드와 WebSocket은 단일 렌더러로 처리할 수 있습니다.

## 7. Logging & Monitoring
- JSON 로그 필드: `router_decision`, `top_k`, `sql_range`, `latency_ms`, `biz_id_hash`, `error_code`.
- WebSocket 연결/해제 이벤트, SSE 종료 이벤트도 구조화 로그로 기록합니다.
- 로그에는 PII와 원문 카드번호 등은 포함되지 않습니다 (business id는 SHA-256 hash 12자 사용).

## 8. Fallbacks
- 벡터 검색에서 문서를 찾지 못하면 LLM이 일반 답변을 제공하고 SQL 제안 메타(`suggested_range`)를 첨부합니다.
- SQL 경로에서 데이터가 비어 있으면 차트는 생략되고 안내 문구가 반환됩니다.
