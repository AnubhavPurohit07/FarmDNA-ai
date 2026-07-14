/**
 * API client for FarmDNA entries.
 *
 * Public endpoints (/public) — no auth needed, returns all community entries.
 * Protected endpoints — require JWT, returns only the logged-in user's entries.
 */

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/entries`
  : "https://farmdna-backend.onrender.com/api/entries";

function authHeaders() {
  const token = sessionStorage.getItem("farmdna-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.detail && typeof data.detail === "string"
        ? data.detail
        : "Something went wrong talking to the server.";
    throw new Error(message);
  }
  return data;
}

// ── Public (community) ────────────────────────────────────────────────────────

export async function getPublicEntries() {
  const res = await fetch(`${BASE}/public`);
  return handleResponse(res);
}

export async function searchPublicEntries(query) {
  const res = await fetch(`${BASE}/public/search?q=${encodeURIComponent(query)}`);
  return handleResponse(res);
}

// ── Protected (user-specific) ─────────────────────────────────────────────────

export async function getEntries() {
  const res = await fetch(BASE, { headers: authHeaders() });
  return handleResponse(res);
}

export async function searchEntries(query) {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getEntry(id) {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function createEntry(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateEntry(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteEntry(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}
