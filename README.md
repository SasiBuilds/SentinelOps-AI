# SentinelOps AI

**Autonomous Disaster Detection & Recovery Platform**

SentinelOps AI is a production-ready internship team project that ingests Prometheus alerts, performs AI-driven root-cause analysis, triggers automated Kubernetes recovery actions, and exposes a real-time operations dashboard.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SentinelOps AI Platform                         │
│                                                                         │
│  ┌─────────────┐   Alerts    ┌──────────────┐   Recover   ┌──────────┐ │
│  │  Prometheus │────────────▶│  sentinel-ai │────────────▶│ recovery │ │
│  │ Alertmanager│  webhook    │  (FastAPI)   │  dispatch   │  engine  │ │
│  └─────────────┘             └──────┬───────┘             └──────────┘ │
│                                     │ REST                              │
│  ┌─────────────┐             ┌──────▼───────┐             ┌──────────┐ │
│  │  Dashboard  │◀────────────│   Backend    │────────────▶│PostgreSQL│ │
│  │  (nginx)    │   REST/JWT  │  (Node.js)   │   Prisma    │          │ │
│  └─────────────┘             └──────────────┘             └──────────┘ │
│                                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │ Grafana  │  │ Alertmanager │  │  Prometheus  │  Observability stack  │
│  └──────────┘  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
```

| Component | Technology | Port |
|---|---|---|
| Backend API | Node.js 20, Express, Prisma, PostgreSQL | 5000 |
| AI Engine | Python 3.12, FastAPI, uvicorn | 8000 |
| Dashboard | nginx, vanilla ES-module JS | 3000 |
| Database | PostgreSQL 16 | 5432 |
| Metrics | Prometheus | 9090 |
| Alerting | Alertmanager | 9093 |
| Dashboards | Grafana | 3001 |

---

## Quick Start (Docker Compose)

### Prerequisites
- Docker Engine 24+ and Docker Compose v2
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-org/SentinelOps-AI.git
cd SentinelOps-AI
```

### 2. Configure environment (backend)

```bash
cp backend/.env.example backend/.env
# Edit backend/.env – the defaults work for local Docker Compose
# For production you MUST set strong JWT_SECRET and JWT_REFRESH_SECRET values
```

### 3. Start the full stack

```bash
docker compose up --build
```

The first run:
1. Builds all three service images
2. Starts PostgreSQL and waits for it to be healthy
3. Runs Prisma migrations automatically
4. Starts all services

### 4. Access the services

| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger UI | http://localhost:5000/api-docs |
| AI Engine | http://localhost:8000/docs |
| Grafana | http://localhost:3001 (admin / sentinelops_grafana) |
| Prometheus | http://localhost:9090 |
| Alertmanager | http://localhost:9093 |

### 5. Create your first user

```bash
curl -s -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","name":"Admin","password":"Admin1234","role":"ADMIN"}' \
  | jq .
```

### 6. Send a test alert to the AI engine

```bash
curl -s -X POST http://localhost:8000/alert \
  -H "Content-Type: application/json" \
  -d '{"alertname":"PodCrashLooping","severity":"critical","service":"frontend"}' \
  | jq .
```

---

## Local Development (without Docker)

### Backend

```bash
cd backend
cp .env.example .env          # configure DATABASE_URL etc.
npm ci
npm run db:generate            # generate Prisma client
npm run db:migrate             # apply migrations
npm run dev                    # node --watch server.js → :5000
```

### Sentinel-AI

```bash
cd sentinel-ai
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Recovery Engine tests

```bash
cd recovery-engine
python test_recovery.py
python healthcheck.py
```

### Frontend

Open `frontend/index.html` directly in a browser, or serve with any static file server:

```bash
cd frontend
npx serve .                    # → http://localhost:3000
```

---

## Project Structure

```
SentinelOps-AI/
├── backend/                   Node.js/Express REST API
│   ├── prisma/
│   │   └── schema.prisma      Database schema (single source of truth)
│   ├── src/
│   │   ├── app.js             Express app factory
│   │   ├── config/            Centralised env config
│   │   ├── constants/         HTTP codes, domain enums
│   │   ├── controllers/       Thin request/response handlers
│   │   ├── database/          Prisma client + connection helpers
│   │   ├── errors/            AppError hierarchy
│   │   ├── logger/            Winston (dev colorized, prod JSON)
│   │   ├── middleware/        errorHandler, auth, rateLimiter, validate…
│   │   ├── models/            DTO helpers
│   │   ├── routes/            Express routers
│   │   ├── services/          Business logic (auth, incident, alert…)
│   │   ├── utils/             response, pagination, asyncHandler, swagger
│   │   └── validations/       express-validator chains
│   ├── server.js              Entry point – DB connect → listen
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── sentinel-ai/               Python FastAPI AI analysis service
│   ├── main.py                FastAPI app (alerts, incidents, stats)
│   ├── analyzer.py            Alert → root-cause mapping
│   ├── logger.py              File-locked incident persistence
│   ├── requirements.txt       Pinned Python deps
│   ├── .env.example
│   └── Dockerfile
│
├── recovery-engine/           Kubernetes recovery dispatcher
│   ├── kubernetes_recovery.py restart / scale / rollback (real + stub)
│   ├── recovery.py            Action dispatcher (no hardcoded targets)
│   ├── healthcheck.py         Exit-code health script
│   └── test_recovery.py       11 unit tests
│
├── frontend/                  Static dashboard (no build step)
│   ├── index.html             Dashboard HTML
│   ├── style.css              Dark design system (CSS vars + BEM)
│   ├── app.js                 Vanilla ES module (ApiClient, Auth, UI)
│   ├── nginx.conf             nginx SPA config
│   └── Dockerfile             nginx:1.27-alpine, non-root
│
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml     Scrape config
│   │   └── prometheus-rules.yaml  17 alerting rules
│   ├── alertmanager/
│   │   └── alertmanager.yaml  Routing: webhook + PagerDuty + Slack
│   └── grafana/
│       ├── dashboard.json     Platform observability dashboard
│       └── provisioning/      Auto-provision datasource + dashboard
│
├── k8s/
│   ├── deployments/           backend, frontend, postgres StatefulSet
│   ├── services/              ClusterIP services, HPA, PDB, NetworkPolicy
│   └── ingress/               TLS ingress with cert-manager
│
├── .github/workflows/
│   └── ci-cd.yml              6-job pipeline: lint→test→build→deploy
│
├── docs/
│   └── incidents.json         AI incident log
│
├── docker-compose.yml         Full local stack (7 services)
└── README.md
```

---

## API Reference

Full interactive docs at **http://localhost:5000/api-docs** (Swagger UI).

### Authentication

```
POST /api/v1/auth/register    Create account
POST /api/v1/auth/login       Login → access + refresh tokens
POST /api/v1/auth/refresh     Rotate token pair
POST /api/v1/auth/logout      Revoke refresh token
GET  /api/v1/auth/me          Get profile (JWT required)
```

### Incidents

```
GET    /api/v1/incidents          List (paginated, filterable)
GET    /api/v1/incidents/stats    Aggregated statistics
GET    /api/v1/incidents/:id      Get by ID
POST   /api/v1/incidents          Create (OPERATOR+)
PATCH  /api/v1/incidents/:id      Update (OPERATOR+)
DELETE /api/v1/incidents/:id      Delete (ADMIN)
```

### Alerts

```
GET   /api/v1/alerts              List (paginated, filterable)
GET   /api/v1/alerts/:id          Get by ID
POST  /api/v1/alerts              Ingest alert (Alertmanager webhook)
PATCH /api/v1/alerts/:id/resolve  Resolve alert (OPERATOR+)
```

### Recovery

```
GET  /api/v1/recovery             List recovery records
GET  /api/v1/recovery/stats       Statistics
GET  /api/v1/recovery/:id         Get by ID
POST /api/v1/recovery             Trigger action (OPERATOR+)
```

### Stats & Health

```
GET /api/v1/stats    Dashboard statistics (aggregated)
GET /api/v1/health   Liveness/readiness probe
```

---

## Environment Variables

See `backend/.env.example` for the complete reference.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | – | PostgreSQL connection string |
| `JWT_SECRET` | **Yes (prod)** | insecure default | Access token signing key (≥32 chars) |
| `JWT_REFRESH_SECRET` | **Yes (prod)** | insecure default | Refresh token signing key (≥32 chars) |
| `PORT` | No | 5000 | HTTP port |
| `CORS_ORIGIN` | No | localhost:3000 | Comma-separated allowed origins |
| `AI_SERVICE_URL` | No | localhost:8000 | sentinel-ai base URL |
| `SWAGGER_ENABLED` | No | true | Set false in production |

---

## Security Notes

- **JWT secrets**: Generate strong secrets before any real deployment:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **Non-root containers**: All Docker images run as non-root users.
- **Database isolation**: Kubernetes NetworkPolicy allows only the backend to reach PostgreSQL.
- **RBAC**: Three roles — `ADMIN`, `OPERATOR`, `VIEWER`. Destructive operations require ADMIN.
- **Rate limiting**: 100 req / 15 min per IP (configurable).
- **Helmet**: Security headers on all API responses.

---

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci-cd.yml`):

```
PR / push develop   → lint-backend → test-backend (postgres service)
                    → lint-python  → test-python
push main           → + build Docker images (multi-arch, layer cache)
                    → + deploy to Kubernetes (kubectl set image)
                    → + smoke test → notify on failure
```

Required secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `KUBECONFIG_BASE64`, `DATABASE_URL`, `JWT_SECRET`.

---

## Database Schema

Managed by Prisma. Models: `User`, `RefreshToken`, `Alert`, `Incident`, `Recovery`.

```bash
cd backend
npm run db:generate    # regenerate client after schema changes
npm run db:migrate     # create + apply migration (dev)
npm run db:studio      # open Prisma Studio GUI
```

---

## License

MIT – SentinelOps AI Team
