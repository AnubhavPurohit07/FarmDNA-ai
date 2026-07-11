import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem("farmdna-token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          sessionStorage.removeItem("farmdna-token");
          setToken(null);
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    verifyToken();
  }, [token]);

  function loginWithToken(jwt, userData) {
    sessionStorage.setItem("farmdna-token", jwt);
    setToken(jwt);
    setUser(userData);
  }

  function logout() {
    sessionStorage.removeItem("farmdna-token");
    setToken(null);
    setUser(null);
  }

  function getAuthHeader() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithToken, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
