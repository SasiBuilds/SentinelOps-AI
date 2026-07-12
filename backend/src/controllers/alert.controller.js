// =============================================================================
// SentinelOps AI – Alert Controller
// =============================================================================

import {
  listAlerts,
  getAlertById,
  ingestAlert,
  resolveAlert,
} from '../services/alert.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** GET /api/v1/alerts */
export const listAlertsHandler = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req);
  const { status, severity, alertname } = req.query;

  const { items, pagination } = await listAlerts({ page, limit, skip, status, severity, alertname });
  return sendPaginated(res, items, pagination, 'Alerts retrieved successfully.');
});

/** GET /api/v1/alerts/:id */
export const getAlertHandler = asyncHandler(async (req, res) => {
  const alert = await getAlertById(req.params.id);
  return sendSuccess(res, alert, 'Alert retrieved successfully.');
});

/** POST /api/v1/alerts */
export const ingestAlertHandler = asyncHandler(async (req, res) => {
  const alert = await ingestAlert(req.body);
  return sendCreated(res, alert, 'Alert ingested and incident linked successfully.');
});

/** PATCH /api/v1/alerts/:id/resolve */
export const resolveAlertHandler = asyncHandler(async (req, res) => {
  const alert = await resolveAlert(req.params.id);
  return sendSuccess(res, alert, 'Alert resolved successfully.');
});
