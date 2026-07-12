// =============================================================================
// SentinelOps AI – Incident Controller
// =============================================================================

import {
  listIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentStats,
} from '../services/incident.service.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** GET /api/v1/incidents */
export const listIncidentsHandler = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req);
  const { status, severity, service } = req.query;

  const { items, pagination } = await listIncidents({ page, limit, skip, status, severity, service });
  return sendPaginated(res, items, pagination, 'Incidents retrieved successfully.');
});

/** GET /api/v1/incidents/stats */
export const getIncidentStatsHandler = asyncHandler(async (req, res) => {
  const stats = await getIncidentStats();
  return sendSuccess(res, stats, 'Incident statistics retrieved.');
});

/** GET /api/v1/incidents/:id */
export const getIncidentHandler = asyncHandler(async (req, res) => {
  const incident = await getIncidentById(req.params.id);
  return sendSuccess(res, incident, 'Incident retrieved successfully.');
});

/** POST /api/v1/incidents */
export const createIncidentHandler = asyncHandler(async (req, res) => {
  const incident = await createIncident(req.body);
  return sendCreated(res, incident, 'Incident created successfully.');
});

/** PATCH /api/v1/incidents/:id */
export const updateIncidentHandler = asyncHandler(async (req, res) => {
  const incident = await updateIncident(req.params.id, req.body);
  return sendSuccess(res, incident, 'Incident updated successfully.');
});

/** DELETE /api/v1/incidents/:id */
export const deleteIncidentHandler = asyncHandler(async (req, res) => {
  await deleteIncident(req.params.id);
  return sendNoContent(res);
});
