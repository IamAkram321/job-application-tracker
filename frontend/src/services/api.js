const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async () => {
    const response = await apiRequest('/applications');
    return response.data || [];
  },

  getById: async (id) => {
    const response = await apiRequest(`/applications/${id}`);
    return response.data;
  },

  create: async (application) => {
    const response = await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    });
    return response.data;
  },

  update: async (id, application) => {
    const response = await apiRequest(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(application),
    });
    return response.data;
  },

  delete: async (id) => {
    return apiRequest(`/applications/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    const response = await apiRequest('/applications/stats/summary');
    return response.data || {
      total: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};




