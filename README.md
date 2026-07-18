# FarmDNA

**AI-powered agricultural knowledge preservation and decision intelligence platform.**

FarmDNA helps farmers record their farming decisions — what they chose, why,
and what happened at harvest — and turns that experience into a searchable,
learnable record. AI analysis (powered by Google Gemini) surfaces successful
practices, recurring mistakes, and region-specific insights from each
farmer's own recorded data, so valuable farming knowledge isn't lost between
generations.

**Sector:** Agri-Allied
**Role:** AI Assigned Full Stack Intern
**Intern ID:** TBI-26100949

**Live app:** https://farm-dna-ai.vercel.app
**Live API docs:** https://farmdna-backend.onrender.com/docs

---

## Project Structure

```
FarmDNA/
├── frontend/          React + Vite + Tailwind CSS frontend
├── backend/           FastAPI backend (REST API, auth, AI service)
├── PROMPTS.md          AI prompt iteration log (Week 7)
├── README.md           This file
└── .gitignore
```

See `frontend/README.md` and `backend/README.md` for setup instructions
specific to each part of the app.

## Core Features

- **Decision Journal** — log farming decisions, reasoning, and outcomes (user-specific, requires login)
- **Outcome Tracking** — record yield data and harvest results
- **AI Pattern Discovery** — Gemini-powered analysis of a farmer's own recorded decisions, surfacing patterns and one actionable recommendation
- **Knowledge Archive** — public community view of all farmers' shared decisions; personal view of your own entries when logged in
- **Authentication** — email/password with bcrypt hashing, plus Google OAuth one-click sign-in
- **Dashboard** — stats overview, recent entries, and on-demand AI insights

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router |
| Backend | FastAPI (Python), Uvicorn |
| Database | MongoDB Atlas (via Motor async driver) |
| Auth | JWT (python-jose) + bcrypt (passlib) + Google OAuth (Authlib) |
| AI | Google Gemini (`gemini-3.1-flash-lite`, via `google-genai` SDK) |
| Rate limiting | slowapi |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## Weekly Progress

| Week | Focus | Status | Key Deliverables |
|---|---|---|---|
| 1 | Frontend Foundations | ✅ Done | Vite + React + Tailwind setup, 4 core components, 4 routed page shells |
| 2 | UX/UI & Component Design | ✅ Done | Figma wireframes, 5-component UI library, dark/light mode, responsive testing |
| 3 | Backend & API Development | ✅ Done | FastAPI backend, 6+ REST endpoints for Decision Journal, Postman collection, frontend connected to live data |
| 4 | API Documentation & Verification | ✅ Done | `.env.example`, backend README, Postman collection with saved examples, frontend-backend connection verified |
| 5 | Database Design & Management | ✅ Done | Migrated from in-memory storage to MongoDB Atlas, `users` + `entries` collections with relationship, schema diagram |
| 6 | Authentication & Security | ✅ Done | JWT auth, bcrypt password hashing, Google OAuth, protected routes (frontend + backend), rate limiting on auth endpoints |
| 7 | AI API Integration | ✅ Done | Gemini AI Insights feature — analyzes a user's journal entries, surfaces patterns + a recommendation, with loading/error states |
| 8 | App Deployment & Go-Live | ✅ Done | Frontend live on Vercel, backend live on Render, MongoDB Atlas in production |
| 9 | Capstone & Portfolio | ⏳ Upcoming | — |

*Note: actual weekly briefs from the platform didn't always match the
original 9-week roadmap topic-for-topic (e.g., what was originally slated
as "Week 5: Auth" arrived as the Week 6 brief, and deployment happened
earlier than Week 8's original slot once the backend and frontend were both
functional). The table above reflects what was actually built under each
week's real assignment brief, not the original syllabus order.*

## Key Design Decisions

- **Visual identity:** a "field journal / ledger" aesthetic rather than
  generic SaaS — Fraunces serif for headlines, Inter for body text,
  monospace for metadata (dates, season tags), deep moss green accent.
  Reflects the product's core unit: a recorded decision.
- **Database:** MongoDB was chosen at internship registration and fits the
  data well — Decision Journal entries are self-contained documents with one
  simple relationship (`entries.user_id → users._id`) rather than complex
  joins, which plays to MongoDB's strengths.
- **AI feature:** rather than a generic chatbot, the AI analyzes a specific
  user's own recorded entries and returns structured pattern + recommendation
  data — directly fulfilling the original Week 1 project brief's promise of
  "AI Pattern Discovery," and giving the feature a clear, testable purpose
  instead of open-ended chat.
- **Auth model:** entries are private per-user (filtered by `user_id`) when
  logged in, but the Knowledge Archive shows all community entries publicly
  when logged out — balancing personal record-keeping with the platform's
  goal of shared agricultural knowledge.

## Running the Project Locally

**Backend:**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows Git Bash; see backend/README.md for other shells
pip install -r requirements.txt
cp .env.example .env           # then fill in your real values
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

## AI Feature Notes

See `PROMPTS.md` at the repo root for the full prompt-iteration log,
including the three prompt format variations tested for the AI Insights
feature and why the strict JSON-schema version was selected. It also
documents a real mid-project model migration (Gemini deprecated the
original model this was built on partway through development) — kept as
an honest record of what integrating a fast-moving third-party AI API
actually looks like in practice.

## License

Educational project — built as part of an internship program.
