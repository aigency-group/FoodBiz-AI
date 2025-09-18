from pydantic import BaseModel, EmailStr
from typing import List, Optional

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


class RagSource(BaseModel):
    source_name: str
    page_number: Optional[int] = None
    snippet: str


class RagQueryResponse(BaseModel):
    response: str
    sources: List[RagSource]
