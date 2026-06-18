import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Decision Journal", to: "/journal" },
  { label: "Knowledge Archive", to: "/archive" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  return (
    <header className="border-b border-(--color-line) bg-(--color-surface)/90 backdrop-blur-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo / app name */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-mono text-xs tracking-widest text-(--color-accent) border border-(--color-accent) rounded px-1.5 py-0.5">
            01
          </span>
          <span className="font-display text-xl font-medium text-(--color-ink) tracking-tight">
            FarmDNA
          </span>
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-8">
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

        {/* Profile / menu icon */}
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-(--color-canvas) border border-(--color-line) text-(--color-ink) hover:border-(--color-accent) transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.93 17.93 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}
