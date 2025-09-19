from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Dict, List, Optional

# --- Profile & User Models ---

class ProfileData(BaseModel):
    owner_name: str
    store_name: str
    business_code: Optional[str] = None
    industry: Optional[str] = None
    phone_number: Optional[str] = None
    business_type: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[str] = None
    store_description: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    profile: ProfileData


class User(BaseModel):
    email: EmailStr

# --- Auth Models ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# --- RAG Models ---

class RagQueryRequest(BaseModel):
    query: str
    business_id: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None


class RagSource(BaseModel):
    type: str
    name: str
    meta: Dict[str, Optional[str]] = Field(default_factory=dict)


class ChartPoint(BaseModel):
    x: str
    y: float


class ChartSeries(BaseModel):
    name: str
    data: List[ChartPoint] = Field(default_factory=list)


class ChartPayload(BaseModel):
    type: str
    series: List[ChartSeries] = Field(default_factory=list)


class RagQueryResponse(BaseModel):
    answer: str
    sources: List[RagSource]
    charts: List[ChartPayload]
    calculations: Dict[str, Optional[float]] = Field(default_factory=dict)


# --- Chat History Models ---


class ChatMessage(BaseModel):
    id: str
    business_id: str
    role: str
    message: str
    created_at: datetime
    user_id: Optional[str] = None


class ChatHistoryResponse(BaseModel):
    items: List[ChatMessage]


class PolicyProduct(BaseModel):
    id: str
    name: str
    group_name: str
    limit_amount: Optional[str] = None
    interest_rate: Optional[str] = None
    term: Optional[str] = None
    eligibility: Optional[str] = None
    application_method: Optional[str] = None
    documents: Optional[str] = None
    features: List[str] = Field(default_factory=list)


class PolicyProductGroup(BaseModel):
    group_name: str
    products: List[PolicyProduct]


class PolicyProductsResponse(BaseModel):
    groups: List[PolicyProductGroup]
