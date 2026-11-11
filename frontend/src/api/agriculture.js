const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/agriculture`
  : "https://farmdna-backend.onrender.com/api/agriculture";

function authHeaders() {
  const token = sessionStorage.getItem("farmdna-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(typeof data?.detail === "string" ? data.detail : "Agriculture service request failed.");
  }
  return data;
}

export const getAgricultureStatus = () => request("/status", { headers: {} });
export const getAgricultureHistory = () => request("/history", { headers: {} });
export const predictCrop = (payload) => request("/crop-recommendation", { method: "POST", body: JSON.stringify(payload) });
export const getFertilizerAdvice = (payload) => request("/fertilizer-advice", { method: "POST", body: JSON.stringify(payload) });
export const getIrrigationPlan = (payload) => request("/irrigation-plan", { method: "POST", body: JSON.stringify(payload) });
