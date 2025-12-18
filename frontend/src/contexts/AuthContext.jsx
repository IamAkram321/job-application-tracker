import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //  Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const isGuest = localStorage.getItem("isGuest") === "true";
      const storedUser = localStorage.getItem("user");

      if (isGuest && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const setAuthenticatedSession = (sessionUser, token = null, extra = {}) => {
    setUser(sessionUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(sessionUser));
    if (token) {
      localStorage.setItem("token", token);
      localStorage.removeItem("isGuest");
    } else {
      localStorage.removeItem("token");
    }
    Object.entries(extra).forEach(([key, value]) => {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    });
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;

      setAuthenticatedSession(user, token, { isGuest: null });

      navigate("/dashboard", { replace: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Invalid credentials" };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      const { user, token } = response.data;

      setAuthenticatedSession(user, token, { isGuest: null });

      navigate("/dashboard", { replace: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleUser = {
        name: "Google User",
        email: "google.user@example.com",
        avatar: "",
        provider: "google",
      };

      setAuthenticatedSession(googleUser, "demo-google-token", { isGuest: null });
      navigate("/dashboard", { replace: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Google sign-in failed" };
    }
  };

  const continueAsGuest = () => {
    const guestUser = {
      name: "Guest Explorer",
      email: "guest@jobtrackr.com",
      guest: true,
    };

    setAuthenticatedSession(guestUser, null, { isGuest: "true" });
    navigate("/dashboard", { replace: true });
  };

  // Logout (Instant redirect + clear)
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isGuest");
    sessionStorage.clear();

    // Redirect to login instantly
    navigate("/login", { replace: true });
  };

  // Sync logout between browser tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    continueAsGuest,
    logout,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
