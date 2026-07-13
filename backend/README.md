# SentinelOps AI – Backend API

> Autonomous Disaster Detection & Recovery Platform – REST API

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js 4 |
| Database | PostgreSQL 15+ |
| ORM | Prisma 5 |
| Logging | Winston + Morgan |
| Validation | express-validator |
| Auth | JWT + bcryptjs |
| API Docs | Swagger UI (OpenAPI 3.0) |
| Containerisation | Docker (node:20-alpine) |

---

## Important – ES Module / dotenv behaviour

This project uses **ES Modules** (`"type": "module"`). In ES Modules all `import`
statements are hoisted and evaluated **before** any code in the entry file runs.
That means a plain `import 'dotenv/config'` at the top of `server.js` still
executes *after* every other imported module has already been initialised —
including `src/config/index.js`, which validates required environment variables
at module-load time.

**The npm scripts therefore use Node 20's built-in `--env-file` flag**, which
instructs the Node process itself to load the `.env` file before evaluating any
JavaScript:

```
node --env-file=.env server.js
```

This means **you must have a `.env` file** in the `backend/` directory before
running any npm script. Follow the setup steps below.

---

## Prerequisites

| Requirement | Minimum version |
|---|---|
| Node.js | 20.6.0+ (required for `--env-file`) |
| npm | 10+ |
| PostgreSQL | 15+ |

---

## Step-by-step Setup

### 1. Install PostgreSQL

**Windows** – download the installer from https://www.postgresql.org/download/windows/ and run it.
During setup, note the:
- Port (default: `5432`)
- Superuser password you set for the `postgres` account

**macOS** (Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu / Debian**:
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create the database and user

Connect to PostgreSQL as the superuser:

```bash
# Windows (use pgAdmin or psql from the Start menu)
psql -U postgres

# macOS / Linux
sudo -u postgres psql
```

Run these SQL commands (replace `yourpassword` with a strong password):

```sql
CREATE USER sentinelops WITH PASSWORD 'yourpassword';
CREATE DATABASE sentinelops OWNER sentinelops;
GRANT ALL PRIVILEGES ON DATABASE sentinelops TO sentinelops;
\q
```

### 3. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set the `DATABASE_URL` to match the credentials you
created above:

```dotenv
DATABASE_URL="postgresql://sentinelops:yourpassword@localhost:5432/sentinelops?schema=public"
```

**If your password contains special characters** (e.g. `@`, `#`, `!`), URL-encode
them. For example `@` becomes `%40`:

```dotenv
# Password is "p@ss!" → encoded as "p%40ss%21"
DATABASE_URL="postgresql://sentinelops:p%40ss%21@localhost:5432/sentinelops?schema=public"
```

All other variables in `.env.example` have safe defaults for local development.
You only need to change `DATABASE_URL` to get the server running.

### 4. Install Node.js dependencies

```bash
npm install
```

### 5. Generate Prisma client

```bash
npm run db:generate
```

This generates the TypeScript/JavaScript client from `prisma/schema.prisma`.
You must run this once after installation, and again any time the schema changes.

### 6. Run database migrations

```bash
npm run db:migrate
```

Prisma will create all tables (`users`, `refresh_tokens`, `alerts`, `incidents`,
`recoveries`) and apply the initial migration. You will be prompted to name the
migration — enter something like `init`.

### 7. Start the development server

```bash
npm run dev
```

The server starts with `node --env-file=.env --watch server.js`. The `--env-file`
flag ensures the `.env` is loaded by Node before any module is evaluated, and
`--watch` restarts the process automatically when source files change.

Expected output:
```
[INFO] Database connection established successfully.
[INFO] ═══════════════════════════════════════════════════
[INFO]   SentinelOps-AI – Backend API
[INFO]   Environment : development
[INFO]   Port        : 5000
[INFO]   API Base    : http://localhost:5000/api/v1
[INFO]   Health      : http://localhost:5000/api/v1/health
[INFO]   Swagger UI  : http://localhost:5000/api-docs
[INFO] ═══════════════════════════════════════════════════
```

### 8. Verify the server is running

```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "status": "success",
  "message": "SentinelOps AI is healthy",
  "data": {
    "uptime": 1.23,
    "environment": "development",
    "database": "connected",
    "aiService": "unavailable",
    "version": "1.0.0"
  }
}
```

(`aiService` will be `unavailable` until the Python sentinel-ai service is also running.)

### 9. Create your first admin user

```bash
curl -s -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "name": "Admin",
    "password": "Admin1234",
    "role": "ADMIN"
  }' | npx --yes json
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with `--env-file` + `--watch` (auto-restart) |
| `npm start` | Start in production mode (reads `.env` via `--env-file`) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate` | Create and apply a new migration (development) |
| `npm run db:migrate:prod` | Apply pending migrations without prompts (CI/production) |
| `npm run db:reset` | Drop all tables and re-run all migrations (dev only) |
| `npm run db:studio` | Open Prisma Studio GUI at http://localhost:5555 |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. The table below marks
which variables are required before the server will start.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | – | Full PostgreSQL connection string |
| `NODE_ENV` | No | `development` | `development` \| `production` \| `test` |
| `PORT` | No | `5000` | HTTP listen port |
| `JWT_SECRET` | **Yes (production)** | insecure default | Access token signing secret (≥32 chars) |
| `JWT_REFRESH_SECRET` | **Yes (production)** | insecure default | Refresh token signing secret (≥32 chars) |
| `JWT_EXPIRES_IN` | No | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifetime |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Comma-separated allowed origins |
| `AI_SERVICE_URL` | No | `http://localhost:8000` | sentinel-ai FastAPI base URL |
| `AI_SERVICE_TIMEOUT_MS` | No | `10000` | Request timeout to AI service (ms) |
| `LOG_LEVEL` | No | `debug` | `error` \| `warn` \| `info` \| `debug` |
| `SWAGGER_ENABLED` | No | `true` | Set `false` to disable Swagger UI |

---

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

Interactive docs: `http://localhost:5000/api-docs`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Liveness & readiness probe |
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login → tokens |
| POST | `/auth/refresh` | Public | Rotate token pair |
| POST | `/auth/logout` | Public | Revoke refresh token |
| GET | `/auth/me` | JWT | Current user profile |
| GET | `/incidents` | JWT | List incidents (paginated) |
| POST | `/incidents` | OPERATOR+ | Create incident |
| GET | `/incidents/stats` | JWT | Incident statistics |
| GET | `/incidents/:id` | JWT | Get incident |
| PATCH | `/incidents/:id` | OPERATOR+ | Update incident |
| DELETE | `/incidents/:id` | ADMIN | Delete incident |
| GET | `/alerts` | JWT | List alerts |
| POST | `/alerts` | Public | Ingest alert (webhook) |
| GET | `/alerts/:id` | JWT | Get alert |
| PATCH | `/alerts/:id/resolve` | OPERATOR+ | Resolve alert |
| GET | `/recovery` | JWT | List recovery records |
| POST | `/recovery` | OPERATOR+ | Trigger recovery action |
| GET | `/recovery/stats` | JWT | Recovery statistics |
| GET | `/recovery/:id` | JWT | Get recovery record |
| GET | `/stats` | JWT | Dashboard statistics |

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `Missing required environment variables: DATABASE_URL` | `.env` file not found or `DATABASE_URL` not set | Copy `.env.example` to `.env` and set `DATABASE_URL` |
| `Can't reach database server at localhost:5432` | PostgreSQL not running | Start PostgreSQL service |
| `database "sentinelops" does not exist` | Database not created | Run the SQL commands in Step 2 |
| `password authentication failed` | Wrong password in `DATABASE_URL` | Check your credentials in `.env` |
| `P1001: Can't reach database server` | Network or firewall issue | Verify `localhost:5432` is accessible |

---

## Docker

```bash
# Build the image
docker build -t sentinelops/backend .

# Run (pass your .env file)
docker run -p 5000:5000 --env-file .env sentinelops/backend
```

Inside Docker, `--env-file` is handled by `docker run`, not the npm script.
The `import 'dotenv/config'` line in `server.js` acts as a fallback and is a no-op
when variables are already present in the environment.

---

## Architecture Notes

- **MVC pattern** – routes → controllers → services → database
- **ES Modules** throughout (`"type": "module"` in `package.json`)
- **`--env-file` flag** – loads `.env` at the Node process level, before ES module evaluation
- **Centralised error handling** – all errors funnel through `src/middleware/errorHandler.js`
- **Structured logging** – JSON in production, human-readable in development
- **Prisma singleton** – single client instance reused across hot-reloads
- **Graceful shutdown** – SIGTERM/SIGINT drain connections before exit
- **RBAC** – three roles: `ADMIN`, `OPERATOR`, `VIEWER`
