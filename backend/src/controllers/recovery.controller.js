// =============================================================================
// SentinelOps AI – Recovery Controller
// =============================================================================

import {
  listRecoveries,
  getRecoveryById,
  triggerRecoveryAction,
  getRecoveryStats,
} from '../services/recovery.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** GET /api/v1/recovery */
export const listRecoveriesHandler = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req);
  const { incidentId, status } = req.query;

  const { items, pagination } = await listRecoveries({ page, limit, skip, incidentId, status });
  return sendPaginated(res, items, pagination, 'Recovery records retrieved successfully.');
});

/** GET /api/v1/recovery/stats */
export const getRecoveryStatsHandler = asyncHandler(async (req, res) => {
  const stats = await getRecoveryStats();
  return sendSuccess(res, stats, 'Recovery statistics retrieved.');
});

/** GET /api/v1/recovery/:id */
export const getRecoveryHandler = asyncHandler(async (req, res) => {
  const recovery = await getRecoveryById(req.params.id);
  return sendSuccess(res, recovery, 'Recovery record retrieved successfully.');
});

/** POST /api/v1/recovery */
export const triggerRecoveryHandler = asyncHandler(async (req, res) => {
  const { incidentId, action, targetService, automated } = req.body;
  const recovery = await triggerRecoveryAction({ incidentId, action, targetService, automated });
  return sendCreated(res, recovery, 'Recovery action triggered successfully.');
});
