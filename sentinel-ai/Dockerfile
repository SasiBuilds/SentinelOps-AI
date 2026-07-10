# =============================================================================
# SentinelOps AI – sentinel-ai Dockerfile
# Build context MUST be the repo root so recovery-engine is accessible:
#   docker build -t sentinelops/sentinel-ai -f sentinel-ai/Dockerfile .
# docker-compose already sets context: . which satisfies this requirement.
# =============================================================================

FROM python:3.12-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN groupadd -r sentinel && useradd -r -g sentinel sentinel

# Copy and install Python dependencies first (layer-cache friendly)
COPY sentinel-ai/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the recovery-engine (sibling directory in the repo root context)
COPY recovery-engine/ /recovery-engine/

# Copy the sentinel-ai application source
COPY sentinel-ai/ .

# Ensure the docs/incidents directory is writable by the app user
# INCIDENTS_FILE env var should point to /data/incidents.json in production
# (mounted as a volume). The /app/docs path is the local dev fallback.
RUN mkdir -p /data && chown -R sentinel:sentinel /app /data

USER sentinel

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
