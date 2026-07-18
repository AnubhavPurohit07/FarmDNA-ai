"""
Gemini AI service for FarmDNA.

Analyzes a user's recorded Decision Journal entries and generates
pattern-discovery insights: what's working, what isn't, and one
actionable recommendation for their next decision.

Model history (for anyone debugging this later):
  - gemini-2.0-flash: used originally, shut down by Google on June 1, 2026.
  - gemini-2.5-flash: tried as a replacement, but returns 404 — restricted
    to existing users only as of this API key's creation date.
  - gemini-3.1-flash-lite: current choice. Documented by Google as "a
    stable, long-term model optimized for efficiency" — a good fit for
    this structured, low-latency synthesis task.

Uses the current `google-genai` SDK (the older `google-generativeai`
package is deprecated). Response is constrained to a JSON schema natively
via response_mime_type + response_json_schema, rather than relying on
prompt instructions alone — this is more reliable than asking the model
to "return only JSON" in plain text.
"""

import os
import json
from google import genai
from google.genai import types

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_NAME = "gemini-3.1-flash-lite"

SYSTEM_INSTRUCTION = """You are an agricultural data analyst working inside FarmDNA, \
a platform where farmers record their farming decisions and outcomes. \
You analyze a single farmer's own recorded entries and surface honest, \
specific, and useful patterns — not generic farming advice. \
You only use information present in the entries provided. \
If there isn't enough data to find a pattern, say so plainly rather than inventing one."""

# Native JSON schema — Gemini enforces this shape directly rather than us
# hoping the model follows a text instruction to "return only JSON".
INSIGHTS_SCHEMA = {
    "type": "object",
    "properties": {
        "patterns": {
            "type": "array",
            "items": {"type": "string"},
            "description": "2-3 short strings describing specific patterns noticed across the entries.",
        },
        "recommendation": {
            "type": "string",
            "description": "One specific, actionable sentence recommending what to consider next.",
        },
    },
    "required": ["patterns", "recommendation"],
}


def get_client() -> genai.Client:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured on the server.")
    return genai.Client(api_key=GEMINI_API_KEY)


def build_prompt(entries: list[dict]) -> str:
    """
    Construct the user-facing prompt from a farmer's journal entries.
    Formats entries as a compact, readable list the model can reason over.
    """
    if not entries:
        return "The farmer has no recorded entries yet."

    lines = []
    for i, e in enumerate(entries, 1):
        lines.append(
            f"{i}. Crop: {e.get('crop')} | Region: {e.get('region')} | "
            f"Season: {e.get('season')} | Status: {e.get('status')}\n"
            f"   Decision: {e.get('decision')}\n"
            f"   Reason: {e.get('reason')}\n"
            f"   Outcome: {e.get('outcome') or 'Not yet recorded'}"
        )
    entries_text = "\n".join(lines)

    return f"""Here are this farmer's recorded decisions:

{entries_text}

Based only on these entries, identify patterns and one recommendation.
If there's not enough data for a real pattern, say so plainly in the
patterns array instead of inventing one."""


async def generate_insights(entries: list[dict]) -> dict:
    """
    Call Gemini with the farmer's entries and return structured insights.
    Raises an exception on API failure — caller is responsible for
    converting this into an appropriate HTTP error response.
    """
    client = get_client()
    prompt = build_prompt(entries)

    response = await client.aio.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_json_schema=INSIGHTS_SCHEMA,
            max_output_tokens=500,
            # Note: temperature/top_p/top_k intentionally left at defaults —
            # Gemini 3.x models are tuned for default sampling settings.
        ),
    )

    raw_text = (response.text or "").strip()

    # Defensive parsing kept as a safety net even with schema enforcement,
    # in case of an empty response or an unexpected wrapper.
    if raw_text.startswith("```"):
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError:
        parsed = {
            "patterns": [raw_text] if raw_text else ["The AI did not return a usable response."],
            "recommendation": "Unable to parse a structured recommendation this time — try again.",
        }

    return parsed