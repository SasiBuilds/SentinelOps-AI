// =============================================================================
// SentinelOps AI – Recovery routes
// =============================================================================

import { Router } from 'express';
import {
  listRecoveriesHandler,
  getRecoveryStatsHandler,
  getRecoveryHandler,
  triggerRecoveryHandler,
} from '../controllers/recovery.controller.js';
import {
  validateTriggerRecovery,
  validateListRecoveries,
  validateUuidParam,
  validatePagination,
} from '../validations/index.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/stats', getRecoveryStatsHandler);

router.get(
  '/',
  [...validateListRecoveries, ...validatePagination()],
  validate,
  listRecoveriesHandler,
);

router.get(
  '/:id',
  ...validateUuidParam('id'),
  validate,
  getRecoveryHandler,
);

router.post(
  '/',
  authorize('ADMIN', 'OPERATOR'),
  validateTriggerRecovery,
  validate,
  triggerRecoveryHandler,
);

export default router;
