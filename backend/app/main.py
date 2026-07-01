"""
FarmDNA Backend — main FastAPI application.

Run locally with:
    uvicorn app.main:app --reload --port 8000

Interactive API docs available at:
    http://localhost:8000/docs   (Swagger UI)
    http://localhost:8000/redoc  (ReDoc)
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.routes import entries
from app.db.connection import ping_database

app = FastAPI(
    title="FarmDNA API",
    description="Backend API for FarmDNA — an agricultural knowledge preservation platform.",
    version="0.2.0",
)


@app.on_event("startup")
async def startup_db_check():
    """Verify the MongoDB connection works before the app starts serving requests."""
    await ping_database()
    print("✓ Connected to MongoDB Atlas successfully.")

# ─── CORS ────────────────────────────────────────────────────────────────
# Allows the React frontend (running on Vite's dev server) to call this API.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Error handling ──────────────────────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Returns a clean 400 response for invalid request bodies/query params,
    instead of FastAPI's default 422 with a verbose error shape.
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Validation error", "errors": exc.errors()},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catch-all handler so unexpected errors return a clean 500 instead of leaking a stack trace."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred."},
    )


# ─── Routes ──────────────────────────────────────────────────────────────
app.include_router(entries.router)


@app.get("/", tags=["health"])
def root():
    """Simple health check / welcome route."""
    return {"message": "FarmDNA API is running.", "docs": "/docs"}


@app.get("/api/health", tags=["health"])
def health_check():
    """Health check endpoint — useful for uptime checks and quick verification."""
    return {"status": "ok"}
