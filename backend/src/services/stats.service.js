// =============================================================================
// SentinelOps AI – Stats / Dashboard Service
// Aggregates cross-entity statistics for the dashboard endpoint.
// =============================================================================

import prisma from '../database/prisma.js';

export async function getDashboardStats() {
  const now        = new Date();
  const last24h    = new Date(now - 24 * 60 * 60 * 1000);
  const last7days  = new Date(now - 7  * 24 * 60 * 60 * 1000);
  const last30days = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    totalIncidents,
    openIncidents,
    incidentsByStatus,
    incidentsBySeverity,
    totalAlerts,
    firingAlerts,
    alertsLast24h,
    totalRecoveries,
    successfulRecoveries,
    failedRecoveries,
    recoveriesLast7days,
    incidentsLast30days,
  ] = await Promise.all([
    prisma.incident.count(),
    prisma.incident.count({ where: { status: 'OPEN' } }),

    prisma.incident.groupBy({ by: ['status'],   _count: { status:   true } }),
    prisma.incident.groupBy({ by: ['severity'], _count: { severity: true } }),

    prisma.alert.count(),
    prisma.alert.count({ where: { status: 'FIRING' } }),
    prisma.alert.count({ where: { createdAt: { gte: last24h } } }),

    prisma.recovery.count(),
    prisma.recovery.count({ where: { status: 'SUCCESS' } }),
    prisma.recovery.count({ where: { status: 'FAILED' } }),
    prisma.recovery.count({ where: { startedAt: { gte: last7days } } }),

    prisma.incident.count({ where: { detectedAt: { gte: last30days } } }),
  ]);

  const recoverySuccessRate =
    totalRecoveries > 0
      ? Math.round((successfulRecoveries / totalRecoveries) * 100)
      : 0;

  return {
    incidents: {
      total:            totalIncidents,
      open:             openIncidents,
      last30Days:       incidentsLast30days,
      byStatus:         incidentsByStatus.map((r) => ({ status:   r.status,   count: r._count.status   })),
      bySeverity:       incidentsBySeverity.map((r) => ({ severity: r.severity, count: r._count.severity })),
    },
    alerts: {
      total:    totalAlerts,
      firing:   firingAlerts,
      last24h:  alertsLast24h,
    },
    recovery: {
      total:           totalRecoveries,
      successful:      successfulRecoveries,
      failed:          failedRecoveries,
      last7Days:       recoveriesLast7days,
      successRatePct:  recoverySuccessRate,
    },
  };
}
