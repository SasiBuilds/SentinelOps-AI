// =============================================================================
// SentinelOps AI – API v1 Router
// All feature routers are mounted here and exported to app.js.
// =============================================================================

import { Router } from 'express';
import healthRoutes   from './health.routes.js';
import authRoutes     from './auth.routes.js';
import incidentRoutes from './incident.routes.js';
import alertRoutes    from './alert.routes.js';
import recoveryRoutes from './recovery.routes.js';
import statsRoutes    from './stats.routes.js';

const router = Router();

// ── Health (public) ──────────────────────────────────────────────────────────
router.use('/health', healthRoutes);

// ── Authentication (public) ──────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── Domain resources (protected – JWT required in individual routers) ────────
router.use('/incidents', incidentRoutes);
router.use('/alerts',    alertRoutes);
router.use('/recovery',  recoveryRoutes);
router.use('/stats',     statsRoutes);

export default router;
