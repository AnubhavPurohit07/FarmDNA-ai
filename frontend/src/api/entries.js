/**
 * API client for FarmDNA Decision Journal entries.
 * Wraps fetch calls to the FastAPI backend at BASE_URL.
 *
 * All functions throw an Error with a readable message on failure,
 * so callers can catch and show a Toast.
 */

const BASE_URL = "http://localhost:8000/api/entries";

async function handleResponse(res) {
  if (res.status === 204) return null; // DELETE has no body

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

/** GET /api/entries — list all entries */
export async function getEntries() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

/** GET /api/entries/search?q=... — search entries */
export async function searchEntries(query) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  return handleResponse(res);
}

/** GET /api/entries/:id — get a single entry */
export async function getEntry(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(res);
}

/** POST /api/entries — create a new entry */
export async function createEntry(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** PUT /api/entries/:id — update an entry */
export async function updateEntry(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** DELETE /api/entries/:id — delete an entry */
export async function deleteEntry(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
