/**
 * API client for FarmDNA AI insights.
 * Calls the backend, which calls Gemini, analyzing the logged-in
 * user's own journal entries.
 */

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/ai`
  : "https://farmdna-backend.onrender.com/api/ai";

function authHeaders() {
  const token = sessionStorage.getItem("farmdna-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.detail && typeof data.detail === "string"
        ? data.detail
        : "Something went wrong generating insights.";
    throw new Error(message);
  }
  return data;
}

/**
 * POST /api/ai/insights
 * Returns { patterns: string[], recommendation: string, entries_analyzed: number }
 */
export async function generateAIInsights() {
  const res = await fetch(`${BASE}/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(res);
}
