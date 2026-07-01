/**
 * services/api.js
 * ───────────────
 * Axios base instance pre-configured to talk to the FastAPI backend.
 * Import `apiClient` wherever you need to make HTTP requests.
 */

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60_000, // Gemini can take a moment on first cold start
});

// ── Request interceptor (logging / auth tokens in future) ─────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor (normalise errors) ───────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ??
      error.message ??
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

// ── Chat ──────────────────────────────────────────────────────────────────

/**
 * @param {string} message  - The user's latest message.
 * @param {Array<{role: string, content: string}>} history - Prior turns.
 * @returns {Promise<{reply: string, model: string, tokens_used: number|null}>}
 */
export async function sendChatMessage(message, history = []) {
  const { data } = await apiClient.post("/chat/query", { message, history });
  return data;
}

export default apiClient;
