"""
app/api/v1/chat.py
──────────────────
Chat endpoint: POST /api/v1/chat/query
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.agent import StudyBuddyAgent, get_agent
from app.schemas.chat import ChatQueryRequest, ChatQueryResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post(
    "/query",
    response_model=ChatQueryResponse,
    status_code=status.HTTP_200_OK,
    summary="Send a message to Study Buddy",
    description=(
        "Accepts a user message and optional conversation history. "
        "Returns a markdown-formatted reply from the Gemini-powered Study Buddy agent."
    ),
)
async def chat_query(
    body: ChatQueryRequest,
    agent: StudyBuddyAgent = Depends(get_agent),
) -> ChatQueryResponse:
    """
    Main chat endpoint.

    - Validates the request body via Pydantic (handled automatically).
    - Delegates to the StudyBuddyAgent for Gemini API interaction.
    - Maps agent output to the response schema.
    """
    logger.info(
        "Chat query received. message_length=%d history_turns=%d",
        len(body.message),
        len(body.history),
    )

    try:
        reply, model_name, tokens_used = await agent.query(
            message=body.message,
            history=body.history,
        )
    except Exception as exc:
        logger.exception("Gemini API call failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Upstream AI service error: {exc}",
        ) from exc

    logger.info("Reply generated. model=%s tokens=%s", model_name, tokens_used)

    return ChatQueryResponse(
        reply=reply,
        model=model_name,
        tokens_used=tokens_used,
    )
