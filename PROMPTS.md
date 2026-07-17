# PROMPTS.md — AI Pattern Discovery Feature

This document logs the prompt variations tested for FarmDNA's AI Insights
feature (`POST /api/ai/insights`), which analyzes a farmer's own Decision
Journal entries and surfaces patterns + one recommendation.

**Model used:** `gemini-2.0-flash` (via the `google-genai` SDK)
**System instruction used in all 3 variations:**
```
You are an agricultural data analyst working inside FarmDNA, a platform
where farmers record their farming decisions and outcomes. You analyze
a single farmer's own recorded entries and surface honest, specific,
and useful patterns — not generic farming advice. You only use
information present in the entries provided. If there isn't enough
data to find a pattern, say so plainly rather than inventing one.
```

---

## Variation 1 — Open-ended, no output format specified

**Prompt:**
```
Here are this farmer's recorded decisions: [entries list]

Look at these entries and tell me what patterns you notice, and give
the farmer one recommendation for next time.
```

**Example output (using 2 sample entries — drip irrigation success,
delayed sowing success):**
```
Looking at your records, it seems like both of your successful decisions
involved being proactive about weather risk — you switched irrigation
methods ahead of a dry spell, and delayed sowing to avoid an unstable
monsoon. This suggests you do well when you act on forecasts rather than
sticking to a fixed schedule. For your next decision, I'd recommend
continuing to monitor weather forecasts closely and being willing to
adjust your timing accordingly.
```

**Problems:** The response was well-written but returned as free-form
prose. Parsing this reliably into a frontend UI (separate "patterns"
list vs. a single "recommendation") would require a second AI call or
fragile string-splitting. Not usable as-is for a structured UI.

---

## Variation 2 — Structured output requested, but no strict format instruction

**Prompt:**
```
Here are this farmer's recorded decisions: [entries list]

Based on these entries, list the patterns you notice and give one
recommendation. Format your answer with clear sections.
```

**Example output:**
```
**Patterns:**
1. Weather-responsive decisions tend to succeed
2. Both entries are in different regions but share a "reacted to
   forecast" theme

**Recommendation:**
Keep monitoring weather forecasts and be willing to adjust timing.
```

**Problems:** Better — sections are visually distinguishable — but the
model chose Markdown headers and numbered lists inconsistently across
different runs (sometimes bold text, sometimes headers, sometimes
inconsistent list markers). This is not reliable enough to parse
programmatically without brittle regex, and any change in phrasing
risks breaking extraction.

---

## Variation 3 — Explicit JSON schema requested (final, selected)

**Prompt:**
```
Here are this farmer's recorded decisions: [entries list]

Based only on these entries, respond with a JSON object with exactly
these keys:
- "patterns": an array of 2-3 short strings, each describing a specific
  pattern you notice across these entries. If there's not enough data
  for a pattern, return an array with one string explaining that more
  entries are needed.
- "recommendation": one specific, actionable sentence recommending what
  this farmer should consider for their next decision, grounded in
  their own data.

Respond with ONLY the JSON object, no markdown formatting, no code
fences, no extra text.
```

**Example output:**
```json
{
  "patterns": [
    "Both recorded successes involved reacting to a weather forecast rather than following a fixed schedule",
    "Entries span two different crops and regions, but share the same weather-responsive decision style"
  ],
  "recommendation": "Continue monitoring seasonal forecasts closely and stay willing to adjust irrigation or sowing timing rather than sticking to a fixed calendar date."
}
```

**Why this one was selected:** This is the only variation that reliably
returns machine-parseable output. The backend (`app/services/ai_insights.py`)
calls `json.loads()` directly on the response text, with a defensive
fallback that strips markdown code fences if the model adds them despite
instructions (which happens occasionally, especially on the first call
of a session). This lets the frontend render `patterns` as a list and
`recommendation` as a distinct highlighted block — exactly matching the
Dashboard UI — without any fragile string-parsing logic. The tradeoff is
a slightly more rigid prompt, but for a feature whose whole purpose is
structured data going into a UI, correctness and parseability matter more
than prose elegance.

---

## Notes on temperature and token limits

`temperature=0.4` was chosen over the default (~1.0) to keep pattern
descriptions grounded and consistent rather than creatively varied —
this is a data-analysis task, not creative writing, so lower temperature
produces more reliable, repeatable output across multiple runs on the
same entry set.

`max_output_tokens=500` is enough for 2-3 patterns plus one
recommendation sentence, while capping cost and latency.

---

## SDK note

This feature uses the current `google-genai` package (`from google import
genai`), not the older `google-generativeai` package. The older package
is deprecated and emits a `FutureWarning` on import directing users to
migrate. The async client (`client.aio.models.generate_content`) is used
throughout since FastAPI's route handlers are async.
