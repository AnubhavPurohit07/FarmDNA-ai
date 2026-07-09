/**
 * AuthCallback — handles the redirect from Google OAuth.
 * Reads the JWT token from the URL query parameter,
 * stores it, and redirects to the journal page.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/ui";
import { Loader } from "../components/ui";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AuthCallback() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const error = params.get("error");

      if (error || !token) {
        showToast.error("Google sign-in failed. Please try again.");
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile using the token
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to get user info");

        const user = await res.json();
        loginWithToken(token, user);
        showToast.success(`Welcome, ${user.name}!`);
        navigate("/journal");
      } catch {
        showToast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-canvas)">
      <div className="flex flex-col items-center gap-3">
        <Loader variant="spinner" size="lg" />
        <p className="text-sm text-(--color-muted) font-mono">
          Completing sign-in...
        </p>
      </div>
    </div>
  );
}
