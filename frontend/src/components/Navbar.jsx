import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { showToast } from "./ui";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Decision Journal", to: "/journal" },
  { label: "Knowledge Archive", to: "/archive" },
  { label: "UI Showcase", to: "/showcase" },
  { label: "About", to: "/about" },
];

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast.success("Logged out successfully.");
    navigate("/");
  }

  return (
    <header className="border-b border-(--color-line) bg-(--color-surface)/90 backdrop-blur-sm sticky top-0 z-50 transition-colors">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-widest text-(--color-accent) border border-(--color-accent) rounded px-1.5 py-0.5">
            01
          </span>
          <span className="font-display text-xl font-medium text-(--color-ink) tracking-tight">
            FarmDNA
          </span>
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-(--color-accent)"
                      : "text-(--color-muted) hover:text-(--color-ink)"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark/Light toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-(--color-line) text-(--color-muted) hover:text-(--color-accent) hover:border-(--color-accent) transition-colors"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Auth state */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-(--color-muted) hidden md:block">
                {user.name?.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-(--color-muted) hover:text-(--color-accent) transition-colors px-3 py-1.5 border border-(--color-line) rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-(--color-accent) text-white px-3 py-1.5 rounded-md hover:bg-(--color-accent-dark) transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
