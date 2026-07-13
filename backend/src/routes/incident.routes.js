// =============================================================================
// SentinelOps AI – Incident routes
// =============================================================================

import { Router } from 'express';
import {
  listIncidentsHandler,
  getIncidentStatsHandler,
  getIncidentHandler,
  createIncidentHandler,
  updateIncidentHandler,
  deleteIncidentHandler,
} from '../controllers/incident.controller.js';
import {
  validateCreateIncident,
  validateUpdateIncident,
  validateListIncidents,
  validateUuidParam,
  validatePagination,
} from '../validations/index.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All incident routes require authentication
router.use(authenticate);

router.get('/stats', getIncidentStatsHandler);

router.get(
  '/',
  [...validateListIncidents, ...validatePagination()],
  validate,
  listIncidentsHandler,
);

router.get(
  '/:id',
  ...validateUuidParam('id'),
  validate,
  getIncidentHandler,
);

router.post(
  '/',
  authorize('ADMIN', 'OPERATOR'),
  validateCreateIncident,
  validate,
  createIncidentHandler,
);

router.patch(
  '/:id',
  authorize('ADMIN', 'OPERATOR'),
  [...validateUuidParam('id'), ...validateUpdateIncident],
  validate,
  updateIncidentHandler,
);

router.delete(
  '/:id',
  authorize('ADMIN'),
  ...validateUuidParam('id'),
  validate,
  deleteIncidentHandler,
);

export default router;
