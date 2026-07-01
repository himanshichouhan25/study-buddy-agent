"""
app/api/v1/router.py
────────────────────
Aggregates every v1 sub-router into a single APIRouter that main.py mounts
under the /api/v1 prefix.

To add a new resource (e.g. documents), import its router here and call
`v1_router.include_router(documents.router)`.
"""

from fastapi import APIRouter

from app.api.v1 import chat

v1_router = APIRouter()

v1_router.include_router(chat.router)
