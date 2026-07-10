"""
SentinelOps AI – FastAPI Service
Receives alert webhooks, analyses them, triggers recovery actions,
and exposes incident history and statistics.
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Resolve the recovery-engine directory at import time.
# Priority order:
#   1. /recovery-engine  – Docker container path (Dockerfile copies it there)
#   2. ../recovery-engine – local development (sibling directory in repo root)
# ---------------------------------------------------------------------------
_DOCKER_PATH = Path("/recovery-engine")
_LOCAL_PATH  = Path(__file__).resolve().parent.parent / "recovery-engine"

_RECOVERY_ENGINE = _DOCKER_PATH if _DOCKER_PATH.is_dir() else _LOCAL_PATH

if str(_RECOVERY_ENGINE) not in sys.path:
    sys.path.insert(0, str(_RECOVERY_ENGINE))

from dotenv import load_dotenv

load_dotenv()  # loads .env if present (no-op if file is missing)

from analyzer import analyze
from logger import save_incident, load_incidents
from recovery import recover

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger("sentinel-ai")


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class AlertPayload(BaseModel):
    alertname: str
    severity: str | None = "medium"
    service: str | None = None
    namespace: str | None = None
    source: str | None = None
    labels: dict | None = None
    annotations: dict | None = None


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


# ---------------------------------------------------------------------------
# App lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("SentinelOps AI service starting up.")
    yield
    log.info("SentinelOps AI service shutting down.")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SentinelOps AI",
    description="Autonomous alert analysis and recovery service.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow the Node.js backend and dashboard to call this service
_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5000,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors_origins],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Exception handler – return JSON for all unhandled exceptions
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    log.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error.", "type": type(exc).__name__},
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/", tags=["Root"])
def home():
    return {
        "service": "SentinelOps AI",
        "version": "1.0.0",
        "status":  "running",
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    return HealthResponse(
        status="healthy",
        service="SentinelOps AI",
        version="1.0.0",
    )


@app.post("/alert", status_code=status.HTTP_201_CREATED, tags=["Alerts"])
def receive_alert(payload: AlertPayload):
    """
    Receive an alert, analyse the root cause, trigger recovery, and
    persist the incident to the incident log.
    """
    log.info("Received alert: %s (service=%s)", payload.alertname, payload.service)

    analysis = analyze(payload.alertname)

    recovery_result = recover(
        action=analysis["action"],
        service=payload.service,
    )

    incident = {
        "alert":           payload.alertname,
        "severity":        payload.severity,
        "service":         payload.service,
        "root_cause":      analysis["cause"],
        "recovery_action": analysis["action"],
        "recovery_status": recovery_result,
    }

    try:
        save_incident(incident)
    except Exception as exc:
        log.error("Failed to persist incident: %s", exc)
        # Don't fail the request because of a logging error

    log.info(
        "Alert processed: action=%s result=%s",
        analysis["action"],
        recovery_result,
    )

    return incident


@app.get("/incidents", tags=["Incidents"])
def get_incidents():
    """Return all persisted incident records."""
    try:
        return load_incidents()
    except Exception as exc:
        log.error("Failed to load incidents: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load incidents.",
        ) from exc


@app.get("/stats", tags=["Stats"])
def get_stats():
    """Return incident count statistics."""
    try:
        incidents = load_incidents()
        total = len(incidents)

        severity_counts: dict[str, int] = {}
        action_counts:   dict[str, int] = {}

        for inc in incidents:
            sev = inc.get("severity", "unknown") or "unknown"
            act = inc.get("recovery_action", "unknown") or "unknown"
            severity_counts[sev] = severity_counts.get(sev, 0) + 1
            action_counts[act]   = action_counts.get(act,   0) + 1

        return {
            "service":          "SentinelOps AI",
            "total_incidents":  total,
            "by_severity":      severity_counts,
            "by_action":        action_counts,
        }
    except Exception as exc:
        log.error("Failed to compute stats: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to compute statistics.",
        ) from exc
