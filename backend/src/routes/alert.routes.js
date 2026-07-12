// =============================================================================
// SentinelOps AI – Alert routes
// =============================================================================

import { Router } from 'express';
import {
  listAlertsHandler,
  getAlertHandler,
  ingestAlertHandler,
  resolveAlertHandler,
} from '../controllers/alert.controller.js';
import {
  validateIngestAlert,
  validateListAlerts,
  validateUuidParam,
  validatePagination,
} from '../validations/index.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * POST /alerts  – the Alertmanager webhook endpoint.
 * Authenticated by a shared API key header rather than JWT in production.
 * For this platform, we accept both JWT-authenticated users and the
 * AI service (which posts with its own service-account token).
 */
router.post('/', validateIngestAlert, validate, ingestAlertHandler);

// All read / management routes require authentication
router.use(authenticate);

router.get(
  '/',
  [...validateListAlerts, ...validatePagination()],
  validate,
  listAlertsHandler,
);

router.get(
  '/:id',
  ...validateUuidParam('id'),
  validate,
  getAlertHandler,
);

router.patch(
  '/:id/resolve',
  authorize('ADMIN', 'OPERATOR'),
  ...validateUuidParam('id'),
  validate,
  resolveAlertHandler,
);

export default router;
