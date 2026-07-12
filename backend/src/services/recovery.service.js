// =============================================================================
// SentinelOps AI – Recovery Service
// Creates and tracks recovery actions for incidents.
// Delegates actual execution to the sentinel-ai service via aiClient.
// =============================================================================

import prisma from '../database/prisma.js';
import { NotFoundError } from '../errors/index.js';
import { buildPaginationMeta } from '../utils/pagination.js';
import { triggerRecovery } from './ai.service.js';
import logger from '../logger/index.js';

// ---------------------------------------------------------------------------
// List recoveries (optionally filtered by incidentId)
// ---------------------------------------------------------------------------
export async function listRecoveries({ page, limit, skip, incidentId, status }) {
  const where = {};
  if (incidentId) where.incidentId = incidentId;
  if (status)     where.status     = status;

  const [total, items] = await Promise.all([
    prisma.recovery.count({ where }),
    prisma.recovery.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      skip,
      take:    limit,
      include: {
        incident: { select: { id: true, title: true, status: true } },
      },
    }),
  ]);

  return { items, pagination: buildPaginationMeta(total, page, limit) };
}

// ---------------------------------------------------------------------------
// Get a single recovery record by ID
// ---------------------------------------------------------------------------
export async function getRecoveryById(id) {
  const recovery = await prisma.recovery.findUnique({
    where: { id },
    include: {
      incident: { select: { id: true, title: true, severity: true, status: true } },
    },
  });
  if (!recovery) throw new NotFoundError(`Recovery ${id} not found.`);
  return recovery;
}

// ---------------------------------------------------------------------------
// Trigger a recovery action for an incident
// ---------------------------------------------------------------------------
export async function triggerRecoveryAction({ incidentId, action, targetService, automated = true }) {
  // Verify incident exists
  const incident = await prisma.incident.findUnique({ where: { id: incidentId } });
  if (!incident) throw new NotFoundError(`Incident ${incidentId} not found.`);

  // Create the recovery record in PENDING state
  const recovery = await prisma.recovery.create({
    data: {
      incidentId,
      action,
      status:        'IN_PROGRESS',
      automated,
      targetService: targetService || incident.service,
    },
  });

  // Async: delegate to AI / recovery-engine and update the record
  _executeRecovery(recovery.id, action, targetService || incident.service).catch((err) => {
    logger.error('Background recovery execution failed', { recoveryId: recovery.id, error: err.message });
  });

  return recovery;
}

// ---------------------------------------------------------------------------
// Private: call the AI service and update the recovery record
// ---------------------------------------------------------------------------
async function _executeRecovery(recoveryId, action, targetService) {
  try {
    const result = await triggerRecovery({ action, targetService });

    await prisma.recovery.update({
      where: { id: recoveryId },
      data:  {
        status:      'SUCCESS',
        output:      result.output || JSON.stringify(result),
        completedAt: new Date(),
      },
    });
  } catch (err) {
    await prisma.recovery.update({
      where: { id: recoveryId },
      data:  {
        status:       'FAILED',
        errorMessage: err.message,
        completedAt:  new Date(),
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Get recovery statistics
// ---------------------------------------------------------------------------
export async function getRecoveryStats() {
  const [total, byStatus, byAction] = await Promise.all([
    prisma.recovery.count(),

    prisma.recovery.groupBy({
      by:     ['status'],
      _count: { status: true },
    }),

    prisma.recovery.groupBy({
      by:     ['action'],
      _count: { action: true },
    }),
  ]);

  return {
    total,
    byStatus: byStatus.map((r) => ({ status: r.status, count: r._count.status })),
    byAction: byAction.map((r) => ({ action: r.action, count: r._count.action })),
  };
}
