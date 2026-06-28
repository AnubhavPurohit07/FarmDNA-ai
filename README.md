# FarmDNA

**AI-powered agricultural knowledge preservation and decision intelligence platform.**

FarmDNA helps farmers record their farming decisions — what they chose, why,
and what happened at harvest — and turns that experience into a searchable,
learnable record. Over time, AI analysis (Gemini API, coming in Week 6)
will surface successful practices, recurring mistakes, and region-specific
insights from the collective data, so valuable farming knowledge isn't lost
between generations.

**Sector:** Agri-Allied
**Role:** AI Assigned Full Stack Intern
**Intern ID:** TBI-26100949

---

## Project Structure

```
FarmDNA/
├── frontend/          React + Vite + Tailwind CSS frontend
├── backend/           FastAPI backend (REST API + data layer)
├── README.md          This file
└── .gitignore
```

See `frontend/README.md` and `backend/README.md` for setup instructions
specific to each part of the app.

## Core Features (per original project brief)

- **Decision Journal** — log farming decisions, reasoning, and outcomes
- **Outcome Tracking** — record yield data and harvest results
- **AI Pattern Discovery** — Gemini-powered analysis of recorded decisions
- **Community Knowledge Search** — find similar experiences from other farmers
- **Agricultural Wisdom Archive** — a searchable, permanent knowledge repository

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router |
| Backend | FastAPI (Python), Uvicorn |
| Data | In-memory store (Weeks 1–4) → real database (Week 5 onward) |
| AI | Gemini API (planned, Week 6) |
| Auth | Planned, Week 5/6 |

## Weekly Progress

| Week | Focus | Status | Key Deliverables |
|---|---|---|---|
| 1 | Frontend Foundations | ✅ Done | Vite + React + Tailwind setup, 4 core components (Navbar, Hero, Card, Footer), 4 routed page shells |
| 2 | UX/UI & Component Design | ✅ Done | Figma lo-fi wireframes (6 screens), 5-component UI library (Button, Input, Modal, Toast, Loader), dark/light mode with localStorage, responsive testing across 3 breakpoints |
| 3 | Backend & API Development | ✅ Done | FastAPI backend, 6+ REST endpoints (CRUD + search) for Decision Journal entries, Postman collection, frontend connected to live backend data |
| 4 | Database Design & Management | ✅ Done | `.env.example`, backend README with local run instructions, Postman collection with saved example responses, frontend-backend connection verified via DevTools |
| 5 | Authentication & Security | ⏳ Upcoming | — |
| 6 | AI API Integration | ⏳ Upcoming | Gemini API integration for pattern discovery |
| 7 | Frontend Integration & Polish | ⏳ Upcoming | — |
| 8 | App Deployment & Go-Live | ⏳ Upcoming | — |
| 9 | Capstone & Portfolio | ⏳ Upcoming | — |

*Note: Week 4 in this program's roadmap originally covered "Database Design,"
but the in-memory data store from Week 3 is still in active use as of this
update — see `backend/app/data/store.py`. The progress table above reflects
deliverables actually submitted under each week's assignment brief.*

## Running the Project Locally

**Backend:**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows Git Bash; see backend/README.md for other shells
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. Full setup details, environment variables,
and API documentation are in `frontend/README.md` and `backend/README.md`.

## License

Educational project — built as part of an internship program.
