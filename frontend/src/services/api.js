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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

// ================= AUTH API =================
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

// ================= APPLICATIONS API =================
export const applicationsAPI = {
  getAll: async () => {
    const res = await apiRequest("/applications");
    return res.data;
  },

  create: async (application) => {
    const res = await apiRequest("/applications", {
      method: "POST",
      body: JSON.stringify(application),
    });
    return res.data;
  },

  update: async (id, updates) => {
    const res = await apiRequest(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  delete: async (id) => {
    await apiRequest(`/applications/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    const res = await apiRequest("/applications/stats/summary");
    return res.data;
  },
};
