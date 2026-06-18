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

const SOCIAL_ICONS = [
  {
    label: "Twitter",
    path: "M22 5.92a8.2 8.2 0 0 1-2.36.65 4.1 4.1 0 0 0 1.8-2.27 8.2 8.2 0 0 1-2.6 1 4.1 4.1 0 0 0-7 3.74A11.65 11.65 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.27 5.47A4.07 4.07 0 0 1 2.8 9.5v.05a4.1 4.1 0 0 0 3.29 4.02 4.1 4.1 0 0 1-1.85.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.07a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.53A8.35 8.35 0 0 0 22 5.92Z",
  },
  {
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.75-3.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  },
  {
    label: "LinkedIn",
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
            {SOCIAL_ICONS.map((icon) => (
              <a
                key={icon.label}
                href="#"
                aria-label={icon.label}
                className="text-(--color-muted) hover:text-(--color-accent) transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5"
                >
                  <path d={icon.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
