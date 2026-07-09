"""
FarmDNA Backend — main FastAPI application.
Week 6: Authentication & Security added.

Run locally:
    uvicorn app.main:app --reload --port 8000

Docs: http://localhost:8000/docs
"""

import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.routes import entries, auth
from app.db.connection import ping_database

# ── Rate limiter setup ────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="FarmDNA API",
    description="Backend API for FarmDNA — agricultural knowledge preservation platform.",
    version="0.3.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://farm-dna-ai.vercel.app",
    "https://farm-dna-ai-git-main-anubhavpurohit2005-8347s-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Error handlers ────────────────────────────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Validation error", "errors": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred."},
    )

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_db_check():
    try:
        await ping_database()
        print("✓ Connected to MongoDB Atlas successfully.")
    except Exception as e:
        print(f"⚠ Database ping failed on startup: {e}")
        print("Server will still start — connection will be retried on first request.")

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(entries.router)

@app.get("/", tags=["health"])
def root():
    return {"message": "FarmDNA API is running.", "docs": "/docs", "version": "0.3.0"}

@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok"}
