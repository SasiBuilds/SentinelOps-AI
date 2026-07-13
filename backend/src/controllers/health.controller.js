// =============================================================================
// SentinelOps AI – Health controller
// =============================================================================

import { getHealthStatus } from '../services/health.service.js';
import { HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/health
 * Liveness & readiness probe.
 * Returns 200 when healthy, 503 when any critical dependency is down.
 */
export const getHealth = asyncHandler(async (req, res) => {
  const health = await getHealthStatus();

  const statusCode = health.healthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
  const message = health.healthy
    ? 'SentinelOps AI is healthy'
    : 'SentinelOps AI is degraded – one or more dependencies are unavailable';

  return res.status(statusCode).json({
    status: health.healthy ? 'success' : 'error',
    message,
    data: health,
  });
});
