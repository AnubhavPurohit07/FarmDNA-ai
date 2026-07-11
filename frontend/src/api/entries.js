/**
 * API client for FarmDNA Decision Journal entries.
 * Public GET endpoints need no auth.
 * Write endpoints (POST, PUT, DELETE) require JWT token.
 */

const BASE_URL = import.meta.env.VITE_API_URL
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

export async function getEntries() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function searchEntries(query) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  return handleResponse(res);
}

export async function getEntry(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(res);
}

export async function createEntry(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateEntry(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteEntry(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}
