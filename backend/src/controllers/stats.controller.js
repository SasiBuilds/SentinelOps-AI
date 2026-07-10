// =============================================================================
// SentinelOps AI – Stats / Dashboard Controller
// =============================================================================

import { getDashboardStats } from '../services/stats.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** GET /api/v1/stats */
export const getDashboardStatsHandler = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  return sendSuccess(res, stats, 'Dashboard statistics retrieved successfully.');
});
