export const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export function backendUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
}

export function backendWsUrl(path, params = {}) {
  const apiUrl = new URL(BACKEND_URL);
  apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
  apiUrl.pathname = path.startsWith("/") ? path : `/${path}`;
  apiUrl.search = new URLSearchParams(params).toString();
  return apiUrl.toString();
}

export const storage = {
  get() {
    try {
      return JSON.parse(localStorage.getItem("pomodoro.auth") || "null");
    } catch {
      return null;
    }
  },
  set(auth) {
    localStorage.setItem("pomodoro.auth", JSON.stringify(auth));
  },
  clear() {
    localStorage.removeItem("pomodoro.auth");
  },
};

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = data?.detail || data?.error || (typeof data === "string" ? data : JSON.stringify(data)) || response.statusText;
    throw new Error(message);
  }

  return data;
}

export async function apiRequest(path, options = {}, token) {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(backendUrl(path), {
    ...options,
    headers,
  });

  return parseResponse(response);
}

export function roomSocketUrl(roomId, token) {
  return backendWsUrl(`/ws/rooms/${roomId}/`, { token });
}
