"""
app/main.py
───────────
FastAPI application factory.

Responsibilities:
  - Instantiate the FastAPI app with metadata.
  - Configure CORS (origins sourced from config, never hard-coded).
  - Mount the versioned API router.
  - Expose a lightweight health-check endpoint.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import v1_router
from app.config import get_settings

# ── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger(__name__)

# ── Settings (loaded once) ────────────────────────────────────────────────────

settings = get_settings()

# ── App factory ───────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "Backend for Study Buddy Agent — a Gemini-powered CS tutor. "
        "All AI interactions go through /api/v1/chat/query."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────

allowed_origins = settings.get_allowed_origins()
logger.info("CORS allowed origins: %s", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(v1_router, prefix="/api/v1")

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"], summary="Health check")
async def health() -> dict:
    return {"status": "ok", "env": settings.app_env, "version": settings.app_version}
