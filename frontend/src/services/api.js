const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

//  AUTH API
export const authAPI = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  googleLogin: (credential) =>
    apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    }),

  getCurrentUser: () => apiRequest("/auth/me"),
};

// APPLICATIONS API 
export const applicationsAPI = {
  getAll: () => apiRequest("/applications").then((r) => r.data || []),
  getStats: () =>
    apiRequest("/applications/stats/summary").then((r) => r.data),
};
