from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from enum import Enum


class OutcomeStatus(str, Enum):
    success = "success"
    partial = "partial"
    failure = "failure"
    pending = "pending"


class EntryBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    crop: str = Field(..., min_length=2, max_length=60)
    region: str = Field(..., min_length=2, max_length=60)
    season: str = Field(..., min_length=2, max_length=40)
    decision: str = Field(..., min_length=5)
    reason: str = Field(..., min_length=5)
    outcome: Optional[str] = Field(None)
    status: OutcomeStatus = Field(default=OutcomeStatus.pending)


class EntryCreate(EntryBase):
    user_id: Optional[str] = Field(None)


class EntryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=120)
    crop: Optional[str] = Field(None, min_length=2, max_length=60)
    region: Optional[str] = Field(None, min_length=2, max_length=60)
    season: Optional[str] = Field(None, min_length=2, max_length=40)
    decision: Optional[str] = Field(None, min_length=5)
    reason: Optional[str] = Field(None, min_length=5)
    outcome: Optional[str] = None
    status: Optional[OutcomeStatus] = None


class Entry(EntryBase):
    model_config = ConfigDict(populate_by_name=True)
    id: str = Field(..., alias="_id")
    user_id: Optional[str] = None
    created_at: str
