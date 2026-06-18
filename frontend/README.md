# FarmDNA — Frontend

## Week 1: Frontend Foundations

Static, routed React skeleton for FarmDNA. No backend or AI calls yet —
this week is the visible shell only.

### Stack
- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router (`react-router-dom`)

### Setup
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`.

### Structure
```
src/
  components/
    Navbar.jsx     — logo, 4 nav links, profile icon
    Hero.jsx       — headline, subheadline, CTA, image (with placeholder)
    Card.jsx       — reusable card: title, description, image, tag, action
    Footer.jsx     — link groups, social icons, copyright
  pages/
    Home.jsx       — Hero + preview card grid
    Journal.jsx    — Decision Journal placeholder
    Archive.jsx    — Knowledge Archive placeholder
    About.jsx      — About placeholder
  App.jsx          — route definitions
  main.jsx         — BrowserRouter + app mount
  index.css        — Tailwind import + design tokens (@theme)
```

### Design notes
Visual identity is a "field journal / ledger" feel rather than a generic
SaaS look — entries are the core content unit of the product, so the
hero and cards are framed like recorded entries (eyebrow tags, corner
"ENTRY" tag, monospace metadata) rather than generic marketing copy.

Tokens are defined in `src/index.css` under `@theme` and consumed via
Tailwind v4's `bg-(--color-x)` shorthand, so colors/fonts can be changed
in one place.

### What's NOT done yet (by design)
- No real data, forms, or API calls
- No auth
- Routing is static — no protected routes
- These come in later weeks per the program schedule
