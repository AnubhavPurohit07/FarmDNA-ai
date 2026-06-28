# FarmDNA — Backend

## Week 3: Backend and API Development

FastAPI backend serving the Decision Journal data. Uses in-memory data for
now — a real database (Week 5) will replace this.

### Stack
- Python 3 + FastAPI
- Uvicorn (ASGI server)
- Pydantic (request/response validation)

### How to run backend locally

```bash
# 1. Move into the backend folder
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate it
venv\Scripts\Activate.ps1

# 4. Copy the example environment file and adjust if needed
copy .env.example .env

# 5. Install dependencies
pip install -r requirements.txt

# 6. Start the server
uvicorn app.main:app --reload --port 8000
```

If PowerShell blocks the activation script with an execution policy error, run this once:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Server runs at `http://localhost:8000`.
Interactive API docs (Swagger UI): `http://localhost:8000/docs`

### Environment variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `8000` |
| `FRONTEND_ORIGIN` | Frontend URL allowed by CORS | `http://localhost:5173` |

Copy `.env.example` to `.env` and adjust values if your setup differs.
The real `.env` file is gitignored and never committed.

### Project structure
```
backend/
  app/
    main.py            — FastAPI app, CORS, error handlers
    models/
      entry.py          — Pydantic models (EntryCreate, EntryUpdate, Entry)
    routes/
      entries.py         — All 6+ REST endpoints
    data/
      store.py           — In-memory data store + seed data
  requirements.txt
  .env                  — PORT and FRONTEND_ORIGIN config (gitignored, not committed)
  .env.example          — shows required variable names without real values
  W4_APICollection_TBI-26100949.json  — Postman collection with saved example responses
```

### Endpoints

| Method | Endpoint | Description | Success | Errors |
|---|---|---|---|---|
| GET | `/api/entries` | List all entries | 200 | — |
| GET | `/api/entries/search?q=` | Search by keyword | 200 | — |
| GET | `/api/entries/{id}` | Get one entry | 200 | 404 |
| POST | `/api/entries` | Create an entry | 201 | 400 |
| PUT | `/api/entries/{id}` | Update an entry | 200 | 400, 404 |
| DELETE | `/api/entries/{id}` | Delete an entry | 204 | 404 |

A health check is also available at `GET /api/health`.

### Testing with Postman

Import `W4_APICollection_TBI-26100949.json` into Postman (File → Import).
It includes 10 requests covering all endpoints, each with a saved example
response captured from a real run of this server — including the
error-case responses (404 and 400) to demonstrate error handling.

### CORS

Configured to allow requests from `http://localhost:5173` (the Vite dev
server). Update `origins` in `app/main.py` if your frontend runs elsewhere.

### Notes
- Data resets every time the server restarts (in-memory only).
- IDs are assigned incrementally starting from 6 (seed data uses 1–5).
