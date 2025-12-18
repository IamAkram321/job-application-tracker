import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Init auth ONCE
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const setSession = (user, token) => {
    localStorage.setItem("token", token);
    setUser(user);
    navigate("/dashboard", { replace: true });
  };

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    setSession(res.data.user, res.data.token);
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    setSession(res.data.user, res.data.token);
  };

  const googleLogin = async (credential) => {
    const res = await authAPI.googleLogin(credential);
    setSession(res.data.user, res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
