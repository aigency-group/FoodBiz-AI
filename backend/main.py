from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

import asyncio
import hashlib
import json
import logging
import time
from datetime import date, datetime
from typing import Optional, List, Dict
from fastapi import (
    FastAPI,
    WebSocket,
    Depends,
    HTTPException,
    status,
    WebSocketDisconnect,
    Query,
)
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from pydantic import BaseModel

import models

from services.supabase_client import supabase
from services import rag_service, conversation_service
from app.services.hybrid_router import route as hybrid_route
from app.services.metrics_service import fetch_timeseries, llm_explain_timeseries
from app.services.context_builder import build_context
from app.prompts.system_prompt import build_system_prompt
from services.metrics_service import get_metrics_summary, list_metrics_daily, DATA_DELAY_NOTICE
from services.reviews_service import (
    get_review_summary,
    list_recent_reviews,
    list_all_reviews,
    review_source_breakdown,
)
from services.policy_service import list_policy_recommendations, list_policy_workflows, list_policy_products
from services.business_service import upsert_business

app = FastAPI(
    title="FoodBiz AI API",
    description="API for the Small Business Symbiotic AI Financial Service Web App",
    version="0.1.0",
)

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("foodbiz.ai")


def _hash_business_id(biz_id: Optional[str]) -> Optional[str]:
    if not biz_id:
        return None
    digest = hashlib.sha256(biz_id.encode("utf-8")).hexdigest()
    return digest[:12]


def _parse_iso_date(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value).date()
    except ValueError:
        return None


def _resolve_range(date_from: Optional[date], date_to: Optional[date]) -> tuple[date, date]:
    end = date_to or date.today()
    start = date_from or (end - timedelta(days=30))
    if start > end:
        start, end = end, start
    return start, end


async def _generate_llm_answer(
    query: str,
    system_prompt: str,
    contexts: Optional[list[str]] = None,
) -> str:
    final_response = ""
    async for event in rag_service.stream_chat_response(
        query,
        system_prompt=system_prompt,
        extra_context=contexts,
    ):
        if event["type"] == "final":
            final_response = event["response"]
    return final_response


def _format_calculations(stats: Dict[str, Optional[float]]) -> Dict[str, Optional[float]]:
    formatted: Dict[str, Optional[float]] = {}
    for key, value in stats.items():
        if isinstance(value, (int, float)):
            formatted[key] = round(float(value), 4)
        else:
            formatted[key] = None
    return formatted


def _gather_business_context(biz_id: Optional[str]) -> tuple[List[str], List[Dict[str, Optional[str]]]]:
    if not biz_id:
        return [], []

    contexts: List[str] = []
    sources: List[Dict[str, Optional[str]]] = []

    try:
        review_summary = get_review_summary(biz_id)
        if review_summary:
            contexts.append(
                (
                    f"[리뷰 요약] 총 {review_summary['review_count']}건, 평균 {review_summary['average_rating']:.2f}점, "
                    f"부정 {review_summary['negative_count']}건"
                )
            )
            recent_reviews = list_recent_reviews(biz_id, limit=3)
            for review in recent_reviews:
                content = (review.get("content") or "").strip()
                rating = review.get("rating")
                if content:
                    contexts.append(f"리뷰 ({rating}점): {content[:160]}")
            sources.append(
                {
                    "type": "sql",
                    "name": "public.reviews",
                    "meta": {
                        "business_id": biz_id,
                        "review_count": str(review_summary.get("review_count")),
                        "average_rating": f"{review_summary.get('average_rating', 0):.2f}",
                    },
                }
            )
    except Exception as error:  # pragma: no cover - Supabase access may fail in tests
        logger.warning("Failed to build review context: %s", error)

    try:
        recommendations = list_policy_recommendations(biz_id)
        if recommendations:
            top_names = [rec.get("name") for rec in recommendations[:3] if rec.get("name")]
            if top_names:
                contexts.append(f"[추천 정책 상품] {', '.join(top_names)}")
                sources.append(
                    {
                        "type": "sql",
                        "name": "public.policy_products",
                        "meta": {
                            "business_id": biz_id,
                            "recommendations": ", ".join(top_names),
                        },
                    }
                )
    except Exception as error:  # pragma: no cover
        logger.warning("Failed to build policy context: %s", error)

    if not any(source.get("name") == "public.policy_products" for source in sources):
        try:
            product_groups = list_policy_products()
            top_products: List[str] = []
            for group in product_groups:
                for product in group.get("products", []):
                    if product.get("name"):
                        top_products.append(product["name"])
                    if len(top_products) >= 3:
                        break
                if len(top_products) >= 3:
                    break

            if top_products:
                contexts.append(f"[주요 금융 상품] {', '.join(top_products)}")
                sources.append(
                    {
                        "type": "sql",
                        "name": "public.policy_products",
                        "meta": {
                            "top_products": ", ".join(top_products),
                        },
                    }
                )
        except Exception as error:  # pragma: no cover
            logger.warning("Failed to build fallback policy context: %s", error)

    return contexts, sources

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin 허용 (개발용)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================================
# Authentication
# =======================================


from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from datetime import timedelta


@app.post("/auth/signup", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def signup(user: models.UserCreate):
    """Registers a new user and their profile information using Supabase Auth options."""
    try:
        profile_data = user.profile
        response = supabase.auth.sign_up(
            {
                "email": user.email,
                "password": user.password,
                "options": {
                    "data": profile_data.dict(exclude_none=True)
                }
            }
        )

        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not create user. The user may already exist or the password may be too weak.",
            )

        user_id = response.user.id

        try:
            supabase.auth.admin.update_user_by_id(user_id, {"email_confirm": True})
        except Exception:
            # If update fails, continue without blocking signup
            pass

        business_code = profile_data.business_code or f"AUTO-{user_id[:8]}"
        business_record = upsert_business(
            owner_id=user_id,
            store_name=profile_data.store_name,
            business_code=business_code,
            industry=profile_data.industry,
        )

        profile_payload = {
            "id": user_id,
            "owner_name": profile_data.owner_name,
            "store_name": profile_data.store_name,
            "business_code": business_code,
            "industry": profile_data.industry,
            "business_id": business_record.get("id"),
        }
        profile_payload = {k: v for k, v in profile_payload.items() if v is not None}
        supabase.table("profiles").upsert(profile_payload, on_conflict="id").execute()

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Signup failed: {str(e)}")

    return {"message": "User created successfully."}


# JWT 설정
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for JWT encoding. Please set it in your .env file.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

@app.post("/token", response_model=models.Token, tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Logs in a user and returns a JWT access token."""
    try:
        # 1. Authenticate user with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })
        
        if not response.user or not response.session:
            raise HTTPException(status_code=401, detail="Incorrect email or password")

        user_id = response.user.id

        # 2. Fetch all profile info from our public.profiles table
        user_profile_response = supabase.table('profiles').select('*').eq('id', user_id).single().execute()
        
        if not user_profile_response.data:
             raise HTTPException(status_code=404, detail="User profile not found.")

        user_profile = user_profile_response.data

        # 3. Create JWT with all profile data
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {
            "sub": response.user.email,
            "exp": datetime.utcnow() + access_token_expires,
            **user_profile # Unpack all profile fields into the token
        }
        access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        # Catch Supabase GoTrue-specific auth errors if possible
        error_message = str(e)
        if "Invalid login credentials" in error_message or "Email not confirmed" in error_message:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password" if "Invalid" in error_message else "Email not confirmed",
                headers={"WWW-Authenticate": "Bearer"},
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {error_message}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# =======================================
# Core Services
# =======================================


@app.get("/health", tags=["Monitoring"])
def read_root():
    """Checks the operational status of the service."""
    return {"status": "ok"}


class MetricsSummaryResponse(BaseModel):
    business_id: str
    latest_date: date | None
    gross_sales: float
    net_sales: float
    cost_of_goods: float
    profit: float
    settlement_delay: int
    data_delay_notice: str = DATA_DELAY_NOTICE


class MetricsDailyResponse(BaseModel):
    items: list[dict]
    data_delay_notice: str = DATA_DELAY_NOTICE


class RAGIndexRequest(BaseModel):
    docs_dir: Optional[str] = None
    persist_dir: Optional[str] = None


class RAGIndexResponse(BaseModel):
    indexed_chunks: int
    persist_directory: str


class ReviewSummaryResponse(BaseModel):
    business_id: str
    review_count: int
    average_rating: float
    positive_count: int
    neutral_count: int
    negative_count: int


class ReviewsListResponse(BaseModel):
    items: list[dict]


class ReviewsAllResponse(BaseModel):
    items: list[dict]


class ReviewSourceBreakdownResponse(BaseModel):
    sources: list[dict]


class PolicyRecommendationResponse(BaseModel):
    recommendations: list[dict]


class PolicyWorkflowResponse(BaseModel):
    workflows: list[dict]


class BusinessSetupRequest(BaseModel):
    owner_id: str
    store_name: str
    business_code: str
    industry: str | None = None


@app.post("/rag/query", response_model=models.RagQueryResponse, tags=["AI"])
async def rag_query(payload: models.RagQueryRequest, business_id: str | None = Query(None)):
    start_ts = time.perf_counter()
    biz_id = business_id or getattr(payload, "business_id", None)
    router_decision = hybrid_route(payload.query)
    hashed_biz = _hash_business_id(biz_id)

    sources: List[dict] = []
    charts: List[dict] = []
    calculations: Dict[str, Optional[float]] = {}
    sql_range_meta = None
    top_k = 0
    error_code = None

    if biz_id:
        conversation_service.log_message(
            business_id=biz_id,
            role="user",
            message=payload.query,
        )
    try:
        raw_from = _parse_iso_date(payload.date_from)
        raw_to = _parse_iso_date(payload.date_to)
        start_date, end_date = _resolve_range(raw_from, raw_to)

        bundle = build_context(
            payload.query,
            biz_id,
            date_from=start_date,
            date_to=end_date,
        )

        sources = list(bundle.sources)
        system_prompt = build_system_prompt(bundle.meta)

        metrics_series = bundle.metrics.get("series", []) if bundle.metrics else []
        metrics_stats = bundle.metrics.get("stats", {}) if bundle.metrics else {}
        if metrics_series:
            sql_range_meta = {"from": metrics_series[0]["x"], "to": metrics_series[-1]["x"]}

        if metrics_series:
            calculations = _format_calculations(metrics_stats)

        if router_decision == "SQL_TIME_SERIES":
            
            if metrics_series:
                charts = [
                    {
                        "type": "timeseries",
                        "series": [
                            {
                                "name": "매출",
                                "data": metrics_series,
                            }
                        ],
                    }
                ]
                context_str = "\n".join(bundle.contexts) if bundle.contexts else None
                answer = await llm_explain_timeseries(metrics_series, metrics_stats, context=context_str)
            else:
                answer = "요청하신 기간에 매출 데이터가 없어 추이를 보여드릴 수 없습니다. 데이터가 수집되면 다시 안내드릴게요."
                if bundle.contexts:
                    answer += "\n" + "\n".join(bundle.contexts)
        else:
            top_k = len(bundle.documents)
            answer = await _generate_llm_answer(
                payload.query,
                system_prompt,
                bundle.contexts or None,
            )

        if biz_id:
            conversation_service.log_message(
                business_id=biz_id,
                role="assistant",
                message=answer,
            )

        latency_ms = round((time.perf_counter() - start_ts) * 1000, 2)
        log_payload = {
            "event": "rag_query",
            "router_decision": router_decision,
            "top_k": top_k,
            "sql_range": sql_range_meta,
            "latency_ms": latency_ms,
            "biz_id_hash": hashed_biz,
            "error_code": error_code,
        }
        logger.info(json.dumps(log_payload, ensure_ascii=False))

        return models.RagQueryResponse(
            answer=answer,
            sources=[models.RagSource(**source) for source in sources],
            charts=[models.ChartPayload(**chart) for chart in charts],
            calculations=calculations,
        )
    except Exception as error:
        error_code = "rag_failure"
        latency_ms = round((time.perf_counter() - start_ts) * 1000, 2)
        log_payload = {
            "event": "rag_query",
            "router_decision": router_decision,
            "top_k": top_k,
            "sql_range": sql_range_meta,
            "latency_ms": latency_ms,
            "biz_id_hash": hashed_biz,
            "error_code": error_code,
        }
        logger.error(json.dumps(log_payload, ensure_ascii=False))
        raise HTTPException(status_code=500, detail="Error processing your query in the chat pipeline.") from error


@app.post("/rag/index", response_model=RAGIndexResponse, tags=["AI"])
def rebuild_index(request: RAGIndexRequest):
    docs_dir = request.docs_dir or rag_indexer.DEFAULT_DOCS_DIR
    persist_dir = request.persist_dir or rag_indexer.DEFAULT_PERSIST_DIR
    indexed = rag_indexer.build_index(docs_dir=docs_dir, persist_dir=persist_dir)
    logger.info(
        json.dumps(
            {
                "event": "rag_index",
                "docs_dir": docs_dir,
                "persist_dir": persist_dir,
                "indexed_chunks": indexed,
            },
            ensure_ascii=False,
        )
    )
    return RAGIndexResponse(indexed_chunks=indexed, persist_directory=persist_dir)


@app.get("/metrics/timeseries", response_model=models.RagQueryResponse, tags=["Metrics"])
async def metrics_timeseries(
    business_id: str,
    from_: Optional[str] = Query(None, alias="from"),
    to_: Optional[str] = Query(None, alias="to"),
):
    date_from = _parse_iso_date(from_)
    date_to = _parse_iso_date(to_)
    start_date, end_date = _resolve_range(date_from, date_to)
    series, stats = fetch_timeseries(business_id, start_date, end_date)

    if series:
        answer = await llm_explain_timeseries(series, stats)
        charts = [
            {
                "type": "timeseries",
                "series": [
                    {
                        "name": "매출",
                        "data": series,
                    }
                ],
            }
        ]
    else:
        answer = "요청 기간에 매출 데이터가 없습니다. 기간을 다시 지정하거나 내일 다시 시도해주세요."
        charts = []

    sources = [
        {
            "type": "sql",
            "name": "public.metrics_daily",
            "meta": {
                "business_id": business_id,
                "from": start_date.isoformat(),
                "to": end_date.isoformat(),
            },
        }
    ]

    return models.RagQueryResponse(
        answer=answer,
        sources=[models.RagSource(**source) for source in sources],
        charts=[models.ChartPayload(**chart) for chart in charts],
        calculations=_format_calculations(stats),
    )


@app.get("/chat/history", response_model=models.ChatHistoryResponse, tags=["Chat"])
async def chat_history(business_id: str, limit: int = Query(50, ge=1, le=200)):
    """Return recent chat messages for the specified business."""
    items = conversation_service.list_messages(business_id, limit)
    return {"items": items}


@app.get("/metrics/{business_id}/summary", response_model=MetricsSummaryResponse, tags=["Metrics"])
async def metrics_summary(business_id: str):
    """Return the 30-day aggregated metrics for a business."""
    return get_metrics_summary(business_id)


@app.get("/metrics/{business_id}/daily", response_model=MetricsDailyResponse, tags=["Metrics"])
async def metrics_daily(business_id: str, limit: int = Query(30, ge=1, le=90)):
    """Return recent daily metrics rows for charts."""
    return list_metrics_daily(business_id, limit)


@app.get("/reviews/{business_id}/summary", response_model=ReviewSummaryResponse, tags=["Reviews"])
async def review_summary(business_id: str):
    return get_review_summary(business_id)


@app.get("/reviews/{business_id}/recent", response_model=ReviewsListResponse, tags=["Reviews"])
async def review_recent(business_id: str, limit: int = Query(5, ge=1, le=20)):
    return {"items": list_recent_reviews(business_id, limit)}


@app.get("/reviews/{business_id}/all", response_model=ReviewsAllResponse, tags=["Reviews"])
async def review_all(business_id: str, limit: int = Query(100, ge=1, le=200)):
    return {"items": list_all_reviews(business_id, limit)}


@app.get("/reviews/{business_id}/sources", response_model=ReviewSourceBreakdownResponse, tags=["Reviews"])
async def review_sources(business_id: str):
    return {"sources": review_source_breakdown(business_id)}


@app.get("/policy/{business_id}/recommendations", response_model=PolicyRecommendationResponse, tags=["Policy"])
async def policy_recommendations(business_id: str):
    return {"recommendations": list_policy_recommendations(business_id)}


@app.get("/policy/{business_id}/applications", response_model=PolicyWorkflowResponse, tags=["Policy"])
async def policy_applications(business_id: str):
    return {"workflows": list_policy_workflows(business_id)}


@app.get("/policy/products", response_model=models.PolicyProductsResponse, tags=["Policy"])
async def policy_products(
    group: str | None = Query(None),
    q: str | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
):
    groups = list_policy_products(group, q, limit)
    return {"groups": groups}


@app.post("/business/setup", tags=["Business"])
async def business_setup(payload: BusinessSetupRequest):
    try:
        record = upsert_business(
            owner_id=payload.owner_id,
            store_name=payload.store_name,
            business_code=payload.business_code,
            industry=payload.industry,
        )
        return {"business": record}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    """Initiates a WebSocket connection for real-time chat streaming."""
    await websocket.accept()
    logger.info(json.dumps({"event": "ws_open"}, ensure_ascii=False))

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            query = payload.get("query")

            if not query:
                await websocket.send_json(
                    {"type": "error", "detail": "Query not provided."}
                )
                continue

            biz_id = websocket.query_params.get("business_id") or payload.get("business_id")
            logger.info(
                json.dumps(
                    {"event": "ws_query", "biz_id_hash": _hash_business_id(biz_id), "query": query[:50]},
                    ensure_ascii=False,
                )
            )
            request_model = models.RagQueryRequest(
                query=query,
                business_id=biz_id,
                date_from=payload.get("date_from"),
                date_to=payload.get("date_to"),
            )

            try:
                response = await rag_query(request_model, business_id=biz_id)
                await websocket.send_json(
                    {
                        "type": "final",
                        "payload": response.dict(),
                    }
                )
            except HTTPException as http_error:
                await websocket.send_json(
                    {"type": "error", "detail": http_error.detail}
                )

    except WebSocketDisconnect:
        logger.info(json.dumps({"event": "ws_disconnect"}, ensure_ascii=False))
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        try:
            await websocket.send_json({"type": "error", "detail": str(e)})
        except RuntimeError:
            pass  # Client likely disconnected
    finally:
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()
        logger.info(json.dumps({"event": "ws_closed"}, ensure_ascii=False))


@app.get("/alerts/sse")
async def sse_alerts():
    """Server-Sent Events endpoint for real-time alerts."""

    async def event_generator():
        i = 0
        try:
            while True:
                # In a real application, you would check for new alerts from a database or message queue.
                # For this example, we'll just send a dummy alert every few seconds.
                await asyncio.sleep(5)
                i += 1
                yield f"data: {json.dumps({'id': f'alert-{i}', 'message': f'This is alert number {i}'})}" + "\n\n"
        except asyncio.CancelledError:
            logger.info(json.dumps({"event": "sse_closed"}, ensure_ascii=False))
            raise

    return StreamingResponse(event_generator(), media_type="text/event-stream")
