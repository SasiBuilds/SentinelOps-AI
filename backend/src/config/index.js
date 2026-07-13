// =============================================================================
// SentinelOps AI – Centralised configuration
// Reads from process.env (populated by dotenv in server.js before any import).
// All consumers import from here – NEVER read process.env directly.
// =============================================================================

import { ENVIRONMENTS } from '../constants/index.js';

// Variables that MUST be present in production
const REQUIRED_IN_PROD = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

// Variables that must always exist (regardless of environment)
const ALWAYS_REQUIRED = ['DATABASE_URL'];

function validateEnv() {
  const env     = process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;
  const required = env === ENVIRONMENTS.PRODUCTION
    ? [...new Set([...ALWAYS_REQUIRED, ...REQUIRED_IN_PROD])]
    : ALWAYS_REQUIRED;

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[Config] Missing required environment variables: ${missing.join(', ')}\n` +
        'Copy .env.example to .env and fill in the values.',
    );
  }

  // Warn (don't crash) if insecure defaults are active in production
  if (env === ENVIRONMENTS.PRODUCTION) {
    const insecure = [];
    if (process.env.JWT_SECRET === 'change_me_in_production')         insecure.push('JWT_SECRET');
    if (process.env.JWT_REFRESH_SECRET === 'change_refresh_in_production') insecure.push('JWT_REFRESH_SECRET');
    if (insecure.length > 0) {
      throw new Error(
        `[Config] FATAL – insecure default values detected for: ${insecure.join(', ')}. ` +
          'Set strong secrets before deploying to production.',
      );
    }
  }
}

if (process.env.NODE_ENV !== ENVIRONMENTS.TEST) {
  validateEnv();
}

// ---------------------------------------------------------------------------
// CORS origin – supports a comma-separated list of origins in the env var
// ---------------------------------------------------------------------------
function parseCorsOrigin(raw) {
  if (!raw) return 'http://localhost:5173';
  const origins = raw.split(',').map((o) => o.trim()).filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
}

const config = Object.freeze({
  // ── Application ───────────────────────────────────────────────────────────
  env:        process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,
  port:       parseInt(process.env.PORT, 10) || 5000,
  apiVersion: process.env.API_VERSION || 'v1',
  appName:    process.env.APP_NAME   || 'SentinelOps-AI',

  isDev:  (process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT) === ENVIRONMENTS.DEVELOPMENT,
  isProd: process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION,
  isTest: process.env.NODE_ENV === ENVIRONMENTS.TEST,

  // ── Database ──────────────────────────────────────────────────────────────
  databaseUrl: process.env.DATABASE_URL,

  // ── JWT ───────────────────────────────────────────────────────────────────
  jwt: {
    secret:           process.env.JWT_SECRET           || 'change_me_in_production',
    expiresIn:        process.env.JWT_EXPIRES_IN        || '15m',
    refreshSecret:    process.env.JWT_REFRESH_SECRET    || 'change_refresh_in_production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // ── CORS – accepts single origin or comma-separated list ──────────────────
  cors: {
    origin: parseCorsOrigin(process.env.CORS_ORIGIN),
  },

  // ── Rate limiting ─────────────────────────────────────────────────────────
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
    max:      parseInt(process.env.RATE_LIMIT_MAX,       10) || 100,
  },

  // ── Logging ───────────────────────────────────────────────────────────────
  log: {
    level: process.env.LOG_LEVEL || 'debug',
    dir:   process.env.LOG_DIR   || 'logs',
  },

  // ── Swagger ───────────────────────────────────────────────────────────────
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
  },

  // ── External services ─────────────────────────────────────────────────────
  aiService: {
    url:     process.env.AI_SERVICE_URL     || 'http://localhost:8000',
    timeout: parseInt(process.env.AI_SERVICE_TIMEOUT_MS, 10) || 10_000,
    apiKey:  process.env.AI_SERVICE_API_KEY || '',
  },
});

export default config;
