/**
 * api.js — Central API client for Mockstar frontend.
 * All requests go through the Vite proxy to http://localhost:8000.
 * JWT token is stored in localStorage and attached automatically.
 */

const BASE_URL = "/api";

// --- Token helpers ---
export const getToken = () => localStorage.getItem("mockstar_token");
export const setToken = (token) => localStorage.setItem("mockstar_token", token);
export const clearToken = () => localStorage.removeItem("mockstar_token");

// --- Base request helper ---
async function request(method, path, body = null) {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    let errDetail = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      errDetail = err.detail || JSON.stringify(err);
    } catch (_) {}
    throw new Error(errDetail);
  }

  // Some endpoints return 204 No Content
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// --- Auth ---
export const authApi = {
  signup: (email, password) =>
    request("POST", "/auth/signup", { email, password }),

  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),

  me: () => request("GET", "/auth/me"),
};

// --- Profile ---
export const profileApi = {
  get: () => request("GET", "/profile"),

  update: (username, focus_domain, core_skills) =>
    request("PUT", "/profile", { username, focus_domain, core_skills }),
};

// --- Resumes ---
export const resumeApi = {
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("POST", "/resumes/upload", form);
  },

  list: () => request("GET", "/resumes"),
};

// --- Interview Sessions ---
export const sessionApi = {
  start: (config) =>
    request("POST", "/sessions/start", {
      interview_type: config.interviewType,
      difficulty: config.difficulty,
      question_count: config.questionCount,
      focus_areas: config.focusAreas?.length ? config.focusAreas : null,
      custom_role: config.customRole || null,
    }),

  submit: (sessionId, transcript) =>
    request("POST", `/sessions/${sessionId}/submit`, transcript),

  list: () => request("GET", "/sessions"),
};
