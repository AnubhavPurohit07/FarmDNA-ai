/**
 * AuthContext — manages authentication state across the app.
 * Stores JWT token in localStorage and provides login/logout helpers.
 */

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("farmdna-token"));
  const [loading, setLoading] = useState(true);

  // On mount, verify token is still valid
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
          // Token invalid/expired — clear it
          localStorage.removeItem("farmdna-token");
          setToken(null);
          setUser(null);
        }
      } catch {
        // Network error — keep token but clear user
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    verifyToken();
  }, [token]);

  function loginWithToken(jwt, userData) {
    localStorage.setItem("farmdna-token", jwt);
    setToken(jwt);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("farmdna-token");
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
