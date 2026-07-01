"""
app/core/agent.py
─────────────────
Encapsulates all Gemini API interactions.
The StudyBuddyAgent class is instantiated once (singleton) and reused
across requests — keeping the SDK client alive avoids repeated cold-starts.
"""

from __future__ import annotations

import logging
from typing import List

import google.generativeai as genai
from google.generativeai.types import GenerationConfig

from app.config import get_settings
from app.schemas.chat import ChatMessage, MessageRole

logger = logging.getLogger(__name__)

# ── System Prompt ─────────────────────────────────────────────────────────────

SYSTEM_INSTRUCTION = """
You are Study Buddy, a knowledgeable, friendly, and enthusiastic Computer Science peer tutor.

Your mission is to make complex CS concepts accessible and enjoyable. Follow these rules strictly:

1. **Tone:** Conversational, encouraging, never condescending. Treat the learner as a peer.
2. **Clarity:** Explain concepts using plain language first, then layer in technical vocabulary.
3. **Examples:** ALWAYS include at least one concrete, real-world example or a short code snippet
   when illustrating a concept. Make examples practical and relatable.
4. **Structure:** Use markdown for readability — headings, bullet points, and code blocks where
   appropriate. Keep explanations concise but complete.
5. **Engagement:** End EVERY response with exactly ONE thoughtful conceptual question to keep
   the learner thinking. Format it like:
   ---
   💡 **Think about this:** [your question here]
6. **Honesty:** If you are uncertain about something, say so explicitly and suggest how the
   learner might verify it (documentation, further reading, etc.).
7. **Scope:** Focus on Computer Science topics — algorithms, data structures, system design,
   programming languages, databases, networking, AI/ML, and software engineering principles.
   For off-topic questions, gently redirect.
""".strip()

# ── Agent ─────────────────────────────────────────────────────────────────────

class StudyBuddyAgent:
    """Thin, stateless wrapper around the Gemini generative model."""

    def __init__(self) -> None:
        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)

        generation_config = GenerationConfig(
            temperature=0.7,
            top_p=0.95,
            top_k=40,
            max_output_tokens=2048,
        )

        self._model = genai.GenerativeModel(
            model_name=settings.gemini_model,
            generation_config=generation_config,
            system_instruction=SYSTEM_INSTRUCTION,
        )
        self._model_name = settings.gemini_model
        logger.info("StudyBuddyAgent initialised with model=%s", settings.gemini_model)

    # ── Public API ────────────────────────────────────────────────────────────

    async def query(
        self,
        message: str,
        history: List[ChatMessage],
    ) -> tuple[str, str, int | None]:
        """
        Send a user message (plus prior history) to Gemini and return
        ``(reply_text, model_name, tokens_used)``.

        History is converted from our internal schema into the format
        expected by the Gemini SDK's `ChatSession`.
        """
        gemini_history = self._build_gemini_history(history)

        chat_session = self._model.start_chat(history=gemini_history)

        logger.debug("Sending message to Gemini. history_turns=%d", len(gemini_history))

        response = await chat_session.send_message_async(message)

        reply_text = response.text
        tokens_used: int | None = None

        try:
            tokens_used = response.usage_metadata.total_token_count
        except AttributeError:
            pass  # Not all response types expose usage metadata

        return reply_text, self._model_name, tokens_used

    # ── Private helpers ───────────────────────────────────────────────────────

    @staticmethod
    def _build_gemini_history(history: List[ChatMessage]) -> list[dict]:
        """
        Convert our ChatMessage list into the dict format Gemini SDK expects:
        ``[{"role": "user" | "model", "parts": ["text"]}]``
        """
        gemini_history = []
        for msg in history:
            # Gemini uses "model" for assistant turns, not "assistant"
            gemini_role = "model" if msg.role == MessageRole.ASSISTANT else "user"
            gemini_history.append({
                "role": gemini_role,
                "parts": [msg.content],
            })
        return gemini_history


# ── Singleton factory ─────────────────────────────────────────────────────────

_agent_instance: StudyBuddyAgent | None = None


def get_agent() -> StudyBuddyAgent:
    """
    FastAPI dependency that returns the shared StudyBuddyAgent instance.
    Instantiated lazily on first call; re-used on subsequent calls.
    """
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = StudyBuddyAgent()
    return _agent_instance
