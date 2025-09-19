# API Changes Summary

## Latest Updates
- Added `GET /policy/products` (group/q/limit) for 금융 상품 카드 데이터.
- Hybrid RAG context builder aggregates metrics, reviews, policy products, and documents with dynamic system prompts.
- Finance screen now consumes `/policy/products` API with loading/empty states and removes 하드코딩된 상품 데이터.

## New / Updated Endpoints

### `POST /rag/query`
- **Request Body**
  ```json
  {
    "query": "매출 추이 알려줘",
    "business_id": "11111111-1111-1111-1111-111111111111",
    "date_from": "2025-08-15",
    "date_to": "2025-09-13"
  }
  ```
- **Response (SQL route)**
  ```json
  {
    "answer": "최근 30일 매출은 완만한 하락세입니다. 7일 이동평균은 412,300원 수준이며 7일 전 대비 3.5% 감소했습니다.",
    "sources": [
      {
        "type": "sql",
        "name": "public.metrics_daily",
        "meta": {
          "business_id": "11111111-1111-1111-1111-111111111111",
          "from": "2025-08-15",
          "to": "2025-09-13"
        }
      },
      {
        "type": "sql",
        "name": "public.reviews",
        "meta": {
          "review_count": "42",
          "average_rating": "4.3"
        }
      },
      {
        "type": "sql",
        "name": "public.policy_products",
        "meta": {
          "recommendations": "우리 사잇돌 중금리대출, 위비 SOHO 모바일 신용대출"
        }
      }
    ],
    "charts": [
      {
        "type": "timeseries",
        "series": [
          {
            "name": "매출",
            "data": [
              { "x": "2025-09-01", "y": 413200 },
              { "x": "2025-09-02", "y": 398100 }
            ]
          }
        ]
      }
    ],
    "calculations": {
      "moving_avg_7": 412300.0,
      "pct_change_7d": -0.035
    }
  }
  ```

### `POST /rag/query` (vector search path)
- **Request Body**
  ```json
  {
    "query": "정책자금 자격 요건?"
  }
  ```
- **Response (Document route)**
  ```json
  {
    "answer": "신용보증기금 정책자금은 최근 3년 매출이 유지되고 세금 체납이 없어야 신청 가능합니다.",
    "sources": [
      {
        "type": "doc",
        "name": "docs/policies/policy_eligibility.md",
        "meta": {
          "uploaded_at": "2025-09-10T03:21:00"
        }
      },
      {
        "type": "sql",
        "name": "public.metrics_daily",
        "meta": {
          "suggested_range": "최근 30일"
        }
      }
    ],
    "charts": [],
    "calculations": {}
  }
  ```

### `POST /rag/index`
- **Description**: Rebuilds the local Chroma index from `docs/policies` (or provided path).
- **Request Body**
  ```json
  { "docs_dir": "docs/policies", "persist_dir": "data/chroma" }
  ```
- **Response**
  ```json
  { "indexed_chunks": 128, "persist_directory": "data/chroma" }
  ```

### `GET /metrics/timeseries`
- **Query Parameters**: `business_id`, optional `from`, `to` (ISO dates). Defaults to 최근 30일.
- **Response Schema**: Same as `POST /rag/query` (SQL route) with charts/calculations populated.

### `GET /policy/products`
- **Query Parameters**: `group` (optional), `q` (검색어 optional), `limit` (기본 20)
- **Response Sample**
  ```json
  {
    "groups": [
      {
        "group_name": "loan",
        "products": [
          {
            "id": "9c5c41b8-53ab-4281-a56d-e7d9bde4b001",
            "name": "우리 사잇돌 중금리대출",
            "limit_amount": "최대 2천만원",
            "interest_rate": "연 6.0% ~ 9.0%",
            "term": "최장 5년",
            "eligibility": "연소득 1,500만원 이상, NICE 475점 이상",
            "features": ["신분증", "소득금액증명", "4대보험 가입내역"],
            "application_method": "영업점 상담 → SGI 보증 연계"
          }
        ]
      }
    ]
  }
  ```

## Response Envelope
All endpoints above return the unified payload:
```json
{
  "answer": "한국어 설명",
  "sources": [{"type": "sql|doc", "name": "...", "meta": {...}}],
  "charts": [{"type": "timeseries", "series": [{"name": "매출", "data": [{"x": "ISO date", "y": number}]}]}],
  "calculations": {"moving_avg_7": number|null, "pct_change_7d": number|null}
}
```

## Structured Logging
- `router_decision`
- `top_k`
- `sql_range`
- `latency_ms`
- `biz_id_hash`
- `error_code`

Logs are JSON strings flushed via Python `logging` (no PII, business id hashed SHA-256 → 12자).

## Sample Curl Commands
```bash
curl -X POST http://localhost:8000/rag/index -H 'Content-Type: application/json' \
  -d '{"docs_dir": "docs/policies", "persist_dir": "data/chroma"}'

curl -X POST http://localhost:8000/rag/query -H 'Content-Type: application/json' \
  -d '{"query": "매출 추이 알려줘", "business_id": "1111..."}'

curl "http://localhost:8000/metrics/timeseries?business_id=1111...&from=2025-08-01&to=2025-08-31"
```
