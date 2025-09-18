from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

import json
import asyncio
from datetime import date
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
from services import rag_service
from services.metrics_service import get_metrics_summary, list_metrics_daily, DATA_DELAY_NOTICE
from services.reviews_service import (
    get_review_summary,
    list_recent_reviews,
    list_all_reviews,
    review_source_breakdown,
)
from services.policy_service import list_policy_recommendations, list_policy_workflows
from services.business_service import upsert_business

app = FastAPI(
    title="FoodBiz AI API",
    description="API for the Small Business Symbiotic AI Financial Service Web App",
    version="0.1.0",
)

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
from datetime import datetime, timedelta


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


def _build_business_context(business_id: str | None) -> list[str]:
    if not business_id:
        return []

    try:
        metrics_summary = get_metrics_summary(business_id)
        review_summary = get_review_summary(business_id)
        recent_reviews = list_recent_reviews(business_id, limit=5)
    except Exception as error:
        print(f"Failed to build business context for {business_id}: {error}")
        return []

    additional_context = "\n\n[사장님 가게 데이터]\n"
    additional_context += (
        f"- 최신 매출 요약: {json.dumps(metrics_summary, ensure_ascii=False)}\n"
    )
    additional_context += (
        f"- 리뷰 요약: {json.dumps(review_summary, ensure_ascii=False)}\n"
    )

    if recent_reviews:
        additional_context += "- 최신 리뷰 5건:\n"
        for review in recent_reviews:
            reviewed_at = review.get("reviewed_at", "")
            date_text = reviewed_at[:10] if isinstance(reviewed_at, str) else str(reviewed_at)
            additional_context += (
                f"  - {date_text}: {review.get('content', '')} (평점: {review.get('rating')})\n"
            )

    return [additional_context]


@app.post("/rag/query", response_model=models.RagQueryResponse, tags=["AI"])
async def rag_query(payload: models.RagQueryRequest, business_id: str | None = Query(None)):
    """Submits a query to the chat model."""
    print(f"Query: {payload.query}")

    try:
        # Use business_id from query param or request body if provided
        biz_id = business_id or getattr(payload, "business_id", None)
        extra_context = _build_business_context(biz_id)

        final_result = None
        async for result in rag_service.stream_chat_response(
            payload.query,
            extra_context=extra_context,
        ):
            if result["type"] == "final":
                final_result = result
                break

        if not final_result:
            raise HTTPException(
                status_code=500, detail="Failed to get a final response from the chat model."
            )

        return models.RagQueryResponse(
            response=final_result["response"], sources=final_result["sources"]
        )
    except Exception as e:
        print(f"Error during chat query: {e}")
        raise HTTPException(
            status_code=500, detail="Error processing your query in the chat pipeline."
        )


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
    print("WebSocket connection established.")

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

            print(f"Received query via WebSocket: {query}")

            # Determine business_id from WS query param or message payload
            biz_id = websocket.query_params.get("business_id") or payload.get("business_id")
            
            extra_context = _build_business_context(biz_id)

            async for result in rag_service.stream_chat_response(
                query,
                extra_context=extra_context,
            ):
                if result["type"] == "chunk":
                    await websocket.send_json(
                        {"type": "chunk", "content": result["content"]}
                    )
                elif result["type"] == "final":
                    await websocket.send_json(
                        {
                            "type": "final",
                            "response": result["response"],
                            "sources": [s.dict() for s in result["sources"]],
                        }
                    )

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket Error: {e}")
        try:
            await websocket.send_json({"type": "error", "detail": str(e)})
        except RuntimeError:
            pass  # Client likely disconnected
    finally:
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()
        print("WebSocket connection closed.")


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
            print("SSE connection closed")
            raise

    return StreamingResponse(event_generator(), media_type="text/event-stream")
