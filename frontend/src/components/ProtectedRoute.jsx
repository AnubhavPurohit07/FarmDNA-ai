/**
 * ProtectedRoute — wraps pages that require authentication.
 * Redirects unauthenticated users to /login.
 *
 * Usage:
 *   <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./ui";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show spinner while verifying token on first load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-canvas)">
        <div className="flex flex-col items-center gap-3">
          <Loader variant="spinner" size="lg" />
          <p className="text-sm text-(--color-muted) font-mono">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
