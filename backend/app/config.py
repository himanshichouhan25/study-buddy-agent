"""
app/config.py
─────────────
Centralised configuration loaded once at startup.
All values can be overridden via environment variables or a .env file.
"""

from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Gemini ──────────────────────────────────────────────────────────
    gemini_api_key: str
    gemini_model: str = "gemini-2.5-flash"

    # ── CORS ─────────────────────────────────────────────────────────────
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # ── App ──────────────────────────────────────────────────────────────
    app_env: str = "development"
    app_title: str = "Study Buddy Agent API"
    app_version: str = "1.0.0"

    @field_validator("gemini_api_key")
    @classmethod
    def api_key_must_not_be_empty(cls, v: str) -> str:
        if not v or v.strip() == "":
            raise ValueError("GEMINI_API_KEY must be set in your .env file")
        return v.strip()

    def get_allowed_origins(self) -> List[str]:
        """Parse the comma-separated ALLOWED_ORIGINS string into a list."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings singleton — safe to call anywhere."""
    return Settings()
