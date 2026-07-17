"""
AI routes for FarmDNA.

Endpoint:
  POST /api/ai/insights — analyzes the logged-in user's journal entries
                           and returns AI-generated patterns + a recommendation.

Protected: requires a valid JWT, since insights are generated from the
specific user's own entries only.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from app.middleware.auth_middleware import require_auth
from app.db.connection import entries_collection
from app.services.ai_insights import generate_insights

router = APIRouter(prefix="/api/ai", tags=["ai"])


class InsightsResponse(BaseModel):
    patterns: list[str]
    recommendation: str
    entries_analyzed: int


@router.post("/insights", response_model=InsightsResponse, status_code=status.HTTP_200_OK)
async def get_ai_insights(current_user: dict = Depends(require_auth)):
    """
    Analyze the logged-in user's journal entries with Gemini and return
    pattern-discovery insights plus one actionable recommendation.
    """
    cursor = entries_collection.find(
        {"user_id": current_user["user_id"]}
    ).sort("created_at", -1)
    docs = await cursor.to_list(length=None)

    entries = [
        {
            "crop": d.get("crop"),
            "region": d.get("region"),
            "season": d.get("season"),
            "decision": d.get("decision"),
            "reason": d.get("reason"),
            "outcome": d.get("outcome"),
            "status": d.get("status"),
        }
        for d in docs
    ]

    if not entries:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No journal entries found. Add at least one entry before generating insights.",
        )

    try:
        result = await generate_insights(entries)
    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI service is not configured. Please contact support.",
        )
    except Exception as e:
        error_str = str(e).lower()

        if "quota" in error_str or "rate" in error_str or "429" in error_str:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI service rate limit reached. Please try again in a moment.",
            )
        if "timeout" in error_str or "deadline" in error_str:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="AI service took too long to respond. Please try again.",
            )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach the AI service right now. Please try again shortly.",
        )

    return InsightsResponse(
        patterns=result.get("patterns", []),
        recommendation=result.get("recommendation", ""),
        entries_analyzed=len(entries),
    )
