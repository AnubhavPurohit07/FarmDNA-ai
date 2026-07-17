"""
Gemini AI service for FarmDNA.

Analyzes a user's recorded Decision Journal entries and generates
pattern-discovery insights: what's working, what isn't, and one
actionable recommendation for their next decision.

Uses the current `google-genai` SDK (the older `google-generativeai`
package is deprecated). Model: gemini-2.0-flash — chosen for speed and
generous free tier, since this is a synthesis/summarization task rather
than open-ended chat, where flash-tier quality is more than sufficient.
"""

import os
import json
from google import genai
from google.genai import types

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_NAME = "gemini-2.0-flash"

# Final prompt template — see PROMPTS.md for the 3 variations tested
# and why this one was selected.
SYSTEM_INSTRUCTION = """You are an agricultural data analyst working inside FarmDNA, \
a platform where farmers record their farming decisions and outcomes. \
You analyze a single farmer's own recorded entries and surface honest, \
specific, and useful patterns — not generic farming advice. \
You only use information present in the entries provided. \
If there isn't enough data to find a pattern, say so plainly rather than inventing one."""


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

Based only on these entries, respond with a JSON object with exactly these keys:
- "patterns": an array of 2-3 short strings, each describing a specific pattern you notice across these entries (e.g. what correlates with success or failure). If there's not enough data for a pattern, return an array with one string explaining that more entries are needed.
- "recommendation": one specific, actionable sentence recommending what this farmer should consider for their next decision, grounded in their own data.

Respond with ONLY the JSON object, no markdown formatting, no code fences, no extra text."""


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
            temperature=0.4,
            max_output_tokens=500,
        ),
    )

    raw_text = (response.text or "").strip()

    # Defensive parsing: strip markdown code fences if the model adds them
    # despite instructions not to, since this happens occasionally.
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
