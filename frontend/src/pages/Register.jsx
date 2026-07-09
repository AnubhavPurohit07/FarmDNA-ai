import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input, showToast } from "../components/ui";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Register() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    region: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    return errs;
  }

  async function handleRegister() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed.");
      loginWithToken(data.access_token, data.user);
      showToast.success(`Welcome to FarmDNA, ${data.user.name}!`);
      navigate("/journal");
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/google`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-canvas) px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-mono text-xs tracking-widest text-(--color-accent) border border-(--color-accent) rounded px-1.5 py-0.5">
            FARMDNA
          </span>
          <h1 className="font-display text-2xl font-medium text-(--color-ink) mt-4 tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-(--color-muted) mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-(--color-accent) hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-(--color-surface) dark:bg-zinc-900 border border-(--color-line) dark:border-zinc-700 rounded-lg p-6 space-y-4">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-(--color-line) dark:border-zinc-700 rounded-md text-sm font-medium text-(--color-ink) dark:text-zinc-100 hover:bg-(--color-canvas) dark:hover:bg-zinc-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-(--color-line) dark:border-zinc-700" />
            <span className="text-xs text-(--color-muted) font-mono">OR</span>
            <hr className="flex-1 border-(--color-line) dark:border-zinc-700" />
          </div>

          <Input
            label="Full name"
            placeholder="e.g. Anubhav Purohit"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="farmer@example.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            error={errors.password}
          />
          <Input
            label="Region (optional)"
            placeholder="e.g. Punjab, Maharashtra"
            value={form.region}
            onChange={(e) => updateField("region", e.target.value)}
          />

          <Button
            variant="primary"
            onClick={handleRegister}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating account..." : "Create account →"}
          </Button>

          <p className="text-xs text-(--color-muted) text-center">
            By signing up you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
