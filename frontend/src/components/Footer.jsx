const FOOTER_LINKS = [
  {
    heading: "Platform",
    links: ["Decision Journal", "Knowledge Archive", "How it works"],
  },
  {
    heading: "Community",
    links: ["Browse stories", "Contribute", "Guidelines"],
  },
  {
    heading: "Company",
    links: ["About", "Contact", "Privacy"],
  },
];

// Real links — GitHub is the source repo, LinkedIn is the developer's profile.
const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/AnubhavPurohit07",
    path: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12c0-5.52-4.48-10-10-10z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anubhav-purohit-9718ba213/",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.78 2.66 4.78 6.12V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-(--color-line) bg-(--color-surface)">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <span className="font-display text-lg font-medium text-(--color-ink)">
              FarmDNA
            </span>
            <p className="mt-3 text-sm text-(--color-muted) leading-relaxed max-w-xs">
              A living record of farming decisions and outcomes, so experience
              earned in one season isn't lost before the next.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="font-mono text-[11px] tracking-widest text-(--color-ink) uppercase mb-3">
                {group.heading}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-(--color-muted) hover:text-(--color-accent) transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-(--color-line) flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-(--color-muted) font-mono">
            © {new Date().getFullYear()} FarmDNA. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-(--color-muted) hover:text-(--color-accent) transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
