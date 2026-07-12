// =============================================================================
// SentinelOps AI – Stats / Dashboard routes
// =============================================================================

import { Router } from 'express';
import { getDashboardStatsHandler } from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

/** GET /api/v1/stats */
router.get('/', getDashboardStatsHandler);

export default router;
