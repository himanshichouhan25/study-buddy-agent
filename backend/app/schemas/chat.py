"""
app/schemas/chat.py
───────────────────
Pydantic v2 request / response contracts for the chat endpoint.
"""

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


# ── Enums ────────────────────────────────────────────────────────────────────

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


# ── Sub-models ───────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    """A single turn in a conversation."""
    role: MessageRole
    content: str = Field(..., min_length=1)


# ── Request ───────────────────────────────────────────────────────────────────

class ChatQueryRequest(BaseModel):
    """
    Body sent by the frontend to POST /api/v1/chat/query.

    `history`  – previous turns so the agent can maintain context.
    `message`  – the latest user message.
    """
    message: str = Field(..., min_length=1, max_length=8_000, description="Latest user message")
    history: List[ChatMessage] = Field(default_factory=list, description="Prior conversation turns")

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("message cannot be blank")
        return v.strip()


# ── Response ──────────────────────────────────────────────────────────────────

class ChatQueryResponse(BaseModel):
    """
    Response returned by the agent for a single query.
    """
    reply: str = Field(..., description="The assistant's markdown-formatted reply")
    model: str = Field(..., description="Gemini model that generated the reply")
    tokens_used: Optional[int] = Field(None, description="Total tokens consumed (if available)")


# ── Error ─────────────────────────────────────────────────────────────────────

class ErrorDetail(BaseModel):
    detail: str
