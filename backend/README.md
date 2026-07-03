# FarmDNA — Backend

## Week 5: Database Design & Management

The backend now persists data in MongoDB Atlas instead of an in-memory
list. Data survives server restarts, and the schema is designed to support
user accounts (added properly in Week 6 — Authentication).

### Stack
- Python 3 + FastAPI
- Uvicorn (ASGI server)
- Pydantic (request/response validation)
- **MongoDB Atlas** (cloud-hosted database, M0 free tier)
- **Motor** (async MongoDB driver, used as the ODM layer)

### Database choice: MongoDB (over PostgreSQL)

MongoDB was chosen for two reasons specific to this project. First, it was
the database selected at internship registration, so deliverables this
week build on that existing setup rather than switching mid-program.
Second, even independent of that, a document database fits a journal-style
app well — Decision Journal entries are self-contained records that don't
need complex joins for most operations (list, search, create, update,
delete), which is exactly what a document store is good at. The one real
relationship in the schema — an entry optionally belonging to a user — is
modeled with a simple reference field (`user_id`) rather than a foreign key
constraint, which MongoDB supports without needing a relational engine.

### Schema diagram

![FarmDNA database schema](./W5_SchemaDiagram_TBI-26100949.png)

Two collections: `users` and `entries`. Each entry has an optional
`user_id` field referencing a `users._id` — a one-to-many relationship
(one user can have many entries). The `user_id` field is optional for now
since login/signup isn't implemented yet (Week 6); once it is, every new
entry will require a valid `user_id`.

### Set up the database

1. Create a free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas).
2. Create a new project, then build a free **M0** cluster.
3. Under **Database Access**, create a database user with a username and
   password (save the password — you'll need it for the connection string).
4. Under **Network Access**, whitelist your IP address (or allow access
   from anywhere for development).
5. Once the cluster is active, click **Connect → Drivers → Python**, and
   copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@your-cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual database user
   credentials, and paste the result into your `.env` file as `MONGO_URI`
   (see below).

### How to run backend locally

```bash
# 1. Move into the backend folder
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate it
source venv/bin/activate          # macOS/Linux
source venv/Scripts/activate      # Windows, Git Bash
venv\Scripts\Activate.ps1         # Windows, PowerShell
venv\Scripts\activate.bat         # Windows, Command Prompt

# 4. Copy the example environment file and fill in your real MONGO_URI
cp .env.example .env              # macOS/Linux/Git Bash
copy .env.example .env            # Windows Command Prompt

# 5. Install dependencies
pip install -r requirements.txt

# 6. (Optional but recommended) seed the database with sample entries
python -m app.seed

# 7. Start the server
uvicorn app.main:app --reload --port 8000
```

If PowerShell blocks the activation script with an execution policy error, run this once:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Server runs at `http://localhost:8000`.
Interactive API docs (Swagger UI): `http://localhost:8000/docs`

On startup, the app pings the database and will fail immediately with a
clear error if `MONGO_URI` is missing or invalid — check your `.env` file
first if the server won't start.

### Environment variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `8000` |
| `FRONTEND_ORIGIN` | Frontend URL allowed by CORS | `http://localhost:5173` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `DB_NAME` | Database name within the cluster | `farmdna` |

Copy `.env.example` to `.env` and fill in real values. The real `.env`
file is gitignored and never committed.

### Project structure
```
backend/
  app/
    main.py              — FastAPI app, CORS, error handlers, DB startup check
    db/
      connection.py        — Motor client setup, exposes entries_collection, users_collection
    models/
      entry.py             — Pydantic models (EntryCreate, EntryUpdate, Entry)
      user.py               — Pydantic models (UserCreate, User) — full auth in Week 6
    routes/
      entries.py            — All 6+ REST endpoints, now reading/writing MongoDB
    seed.py               — One-time script to populate the entries collection
  requirements.txt
  .env                  — real credentials (gitignored, not committed)
  .env.example          — shows required variable names without real values
  W5_SchemaDiagram_TBI-26100949.png  — schema diagram (also embedded above)
  W4_APICollection_TBI-26100949.json — Postman collection with saved example responses
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

All endpoints now read from and write to MongoDB — no in-memory data
remains. A health check is also available at `GET /api/health`.

### Notes
- Entry IDs are now MongoDB ObjectIds (24-character hex strings), not
  sequential integers like in Weeks 3–4. The frontend has been updated to
  handle string IDs instead of numbers.
- Data persists across server restarts — this is the key change from
  previous weeks.
- `user_id` on entries is optional until Week 6 implements real login.
