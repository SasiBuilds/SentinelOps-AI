# =============================================================================
# SentinelOps AI – Backend Dockerfile
# Multi-stage build: install deps → generate Prisma client → run as non-root
# =============================================================================

# ── Stage 1: dependency install ───────────────────────────────────────────────
FROM node:20-bookworm AS deps

WORKDIR /app

# Copy only the manifests first (layer-cache friendly)
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Install all dependencies so Prisma CLI is available for generation
RUN npm ci

# Generate Prisma client inside the deps stage
RUN npx prisma generate

# Keep only production dependencies for the final image
RUN npm prune --production

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:20-bookworm AS production
ENV NODE_ENV=production

WORKDIR /app

# Create a non-root user
RUN groupadd -r sentinelops && useradd -r -g sentinelops sentinelops

# Copy installed modules + generated Prisma client from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma       ./prisma

# Copy application source
COPY . .

# Ensure log directory exists and is owned by the app user
RUN mkdir -p logs && chown -R sentinelops:sentinelops /app

USER sentinelops

EXPOSE 5000

# Healthcheck – ping the health endpoint every 30 s
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
