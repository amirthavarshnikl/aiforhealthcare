from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Models
class UserCreate(BaseModel):
    """User creation model"""
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    """User response model"""
    id: str = Field(alias="_id")
    name: str
    email: str
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True


# Report Models
class ReportCreate(BaseModel):
    """Report creation model"""
    user_id: str
    file_name: str
    original_text: str
    simplified_text: Optional[str] = None
    translated_text: Optional[str] = None
    language: Optional[str] = "en"
    metadata: Optional[Dict[str, Any]] = {}


class ReportUpdate(BaseModel):
    """Report update model"""
    simplified_text: Optional[str] = None
    translated_text: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class ReportResponse(BaseModel):
    """Report response model"""
    id: str = Field(alias="_id")
    user_id: str
    file_name: str
    original_text: str
    simplified_text: Optional[str] = None
    translated_text: Optional[str] = None
    language: Optional[str] = "en"
    metadata: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True


# Vector/RAG Models
class EmbeddingRequest(BaseModel):
    """Embedding request model"""
    text: str
    metadata: Optional[Dict[str, Any]] = {}


class RagQuery(BaseModel):
    """RAG query model"""
    query: str
    top_k: Optional[int] = 5
    filters: Optional[Dict[str, Any]] = None


class RagResult(BaseModel):
    """RAG result model"""
    id: str
    distance: float
    document: str
    metadata: Dict[str, Any]


class RagResponse(BaseModel):
    """RAG response model"""
    results: List[RagResult]
    query: str
    count: int


# Health Models
class HealthStatus(BaseModel):
    """Health status model"""
    status: str
    mongodb: bool
    vectordb: bool
    embeddings: bool
    timestamp: datetime
