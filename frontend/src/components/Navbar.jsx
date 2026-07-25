import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { showToast } from "./ui";

const PUBLIC_NAV = [
  { label: "Home", to: "/" },
  { label: "Knowledge Archive", to: "/archive" },
  { label: "About", to: "/about" },
];

const AUTH_NAV = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Decision Journal", to: "/journal" },
  { label: "Knowledge Archive", to: "/archive" },
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

function MenuIcon({ open }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      )}
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = user ? AUTH_NAV : PUBLIC_NAV;

  function handleLogout() {
    logout();
    showToast.success("Logged out successfully.");
    setMobileOpen(false);
    navigate("/");
  }

  function handleMobileNavClick() {
    setMobileOpen(false);
  }

  return (
    <header className="border-b border-(--color-line) bg-(--color-surface)/90 backdrop-blur-sm sticky top-0 z-50 transition-colors">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={handleMobileNavClick}>
          <span className="font-display text-xl font-medium text-(--color-ink) tracking-tight">
            FarmDNA
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-(--color-accent)" : "text-(--color-muted) hover:text-(--color-ink)"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-(--color-line) text-(--color-muted) hover:text-(--color-accent) hover:border-(--color-accent) transition-colors"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-(--color-muted)">{user.name?.split(" ")[0]}</span>
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
              <Link to="/login" className="text-sm font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="text-sm font-medium bg-(--color-accent) text-white px-3 py-1.5 rounded-md hover:bg-(--color-accent-dark) transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls — hamburger + theme toggle, nav collapses into a panel */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-(--color-line) text-(--color-muted)"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-(--color-line) text-(--color-ink)"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-(--color-line) bg-(--color-surface) px-6 py-4">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={handleMobileNavClick}
                  className={({ isActive }) =>
                    `block py-2.5 text-base font-medium transition-colors ${
                      isActive ? "text-(--color-accent)" : "text-(--color-ink)"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-3 pt-3 border-t border-(--color-line)">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--color-muted)">Signed in as {user.name?.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-(--color-accent) px-3 py-1.5 border border-(--color-line) rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" onClick={handleMobileNavClick} className="text-sm font-medium text-(--color-ink)">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={handleMobileNavClick}
                  className="text-sm font-medium bg-(--color-accent) text-white px-3 py-1.5 rounded-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
