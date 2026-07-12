// =============================================================================
// SentinelOps AI – Health Service
// Aggregates liveness / readiness across all dependencies.
// =============================================================================

import prisma from '../database/prisma.js';
import config from '../config/index.js';
import { checkAiHealth } from './ai.service.js';

/**
 * Check whether the PostgreSQL database is reachable.
 * @returns {Promise<'connected'|'disconnected'>}
 */
async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'connected';
  } catch {
    return 'disconnected';
  }
}

/**
 * Collect and return the full system health report.
 *
 * @returns {Promise<{
 *   uptime:       number,
 *   environment:  string,
 *   timestamp:    string,
 *   database:     string,
 *   aiService:    string,
 *   version:      string,
 *   healthy:      boolean,
 * }>}
 */
export async function getHealthStatus() {
  const [database, aiResult] = await Promise.all([
    checkDatabase(),
    checkAiHealth(),
  ]);

  const aiService = aiResult?.status === 'healthy' ? 'connected' : 'unavailable';

  return {
    uptime:      parseFloat(process.uptime().toFixed(2)),
    environment: config.env,
    timestamp:   new Date().toISOString(),
    database,
    aiService,
    version:     '1.0.0',
    healthy:     database === 'connected', // AI service down is degraded, not critical
  };
}
