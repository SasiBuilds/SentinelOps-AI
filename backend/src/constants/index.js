// =============================================================================
// SentinelOps AI – Application-wide constants
// =============================================================================

// HTTP Status Codes
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});

// API response status strings
export const RESPONSE_STATUS = Object.freeze({
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
});

// Environment names
export const ENVIRONMENTS = Object.freeze({
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
});

// Pagination defaults
export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

// SentinelOps domain – incident severity levels
export const SEVERITY = Object.freeze({
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO',
});

// SentinelOps domain – incident status values
export const INCIDENT_STATUS = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
});

// SentinelOps domain – recovery action types
export const RECOVERY_ACTION = Object.freeze({
  RESTART: 'RESTART',
  SCALE_UP: 'SCALE_UP',
  SCALE_DOWN: 'SCALE_DOWN',
  FAILOVER: 'FAILOVER',
  ROLLBACK: 'ROLLBACK',
  NOTIFY: 'NOTIFY',
  MANUAL: 'MANUAL',
});
