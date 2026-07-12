// =============================================================================
// SentinelOps AI – Alert Service
// Handles alert ingestion, deduplication, and incident linkage.
// =============================================================================

import prisma from '../database/prisma.js';
import { NotFoundError } from '../errors/index.js';
import { buildPaginationMeta } from '../utils/pagination.js';

// ---------------------------------------------------------------------------
// List alerts with pagination and filters
// ---------------------------------------------------------------------------
export async function listAlerts({ page, limit, skip, status, severity, alertname }) {
  const where = {};
  if (status)    where.status    = status;
  if (severity)  where.severity  = severity;
  if (alertname) where.alertname = { contains: alertname, mode: 'insensitive' };

  const [total, items] = await Promise.all([
    prisma.alert.count({ where }),
    prisma.alert.findMany({
      where,
      orderBy: { startsAt: 'desc' },
      skip,
      take: limit,
      include: {
        incident: { select: { id: true, title: true, status: true } },
      },
    }),
  ]);

  return { items, pagination: buildPaginationMeta(total, page, limit) };
}

// ---------------------------------------------------------------------------
// Get a single alert by ID
// ---------------------------------------------------------------------------
export async function getAlertById(id) {
  const alert = await prisma.alert.findUnique({
    where: { id },
    include: {
      incident: { select: { id: true, title: true, status: true, severity: true } },
    },
  });

  if (!alert) throw new NotFoundError(`Alert ${id} not found.`);
  return alert;
}

// ---------------------------------------------------------------------------
// Ingest an alert (from Prometheus Alertmanager webhook or direct POST)
// Creates or reuses an open incident for deduplication.
// ---------------------------------------------------------------------------
export async function ingestAlert(payload) {
  const {
    alertname,
    severity   = 'MEDIUM',
    source,
    service,
    namespace,
    labels     = {},
    annotations = {},
  } = payload;

  // Deduplication: find an existing FIRING alert for the same alertname+service
  // that is not yet linked to a resolved incident
  let existingAlert = await prisma.alert.findFirst({
    where: {
      alertname,
      service: service || null,
      status:  'FIRING',
    },
    orderBy: { startsAt: 'desc' },
    include: { incident: true },
  });

  // Reuse the existing incident if there is one and it is still open
  let incidentId = null;
  if (existingAlert?.incident && ['OPEN', 'IN_PROGRESS'].includes(existingAlert.incident.status)) {
    incidentId = existingAlert.incident.id;
  } else {
    // Create a new incident for this alert
    const newIncident = await prisma.incident.create({
      data: {
        title:       `${alertname}${service ? ` – ${service}` : ''}`,
        description: annotations?.description || annotations?.summary || null,
        severity:    _normaliseSeverity(severity),
        source,
        service,
        region:      namespace,
        status:      'OPEN',
      },
    });
    incidentId = newIncident.id;
  }

  // Persist the raw alert
  const alert = await prisma.alert.create({
    data: {
      alertname,
      severity:   _normaliseSeverity(severity),
      status:     'FIRING',
      source,
      service,
      namespace,
      labels,
      annotations,
      incidentId,
    },
    include: {
      incident: { select: { id: true, title: true, status: true } },
    },
  });

  return alert;
}

// ---------------------------------------------------------------------------
// Resolve an alert (mark as RESOLVED, optionally close linked incident)
// ---------------------------------------------------------------------------
export async function resolveAlert(id) {
  const alert = await getAlertById(id);

  const updated = await prisma.alert.update({
    where:  { id },
    data:   { status: 'RESOLVED', endsAt: new Date() },
    include: { incident: true },
  });

  // If all alerts for the linked incident are resolved, auto-close the incident
  if (updated.incidentId) {
    const firingCount = await prisma.alert.count({
      where: { incidentId: updated.incidentId, status: 'FIRING' },
    });
    if (firingCount === 0) {
      await prisma.incident.update({
        where: { id: updated.incidentId },
        data:  { status: 'RESOLVED', resolvedAt: new Date() },
      });
    }
  }

  return updated;
}

// ---------------------------------------------------------------------------
// Private helper – normalise Prometheus severity labels to our enum
// ---------------------------------------------------------------------------
function _normaliseSeverity(severity) {
  const map = {
    critical: 'CRITICAL',
    high:     'HIGH',
    warning:  'MEDIUM',
    medium:   'MEDIUM',
    low:      'LOW',
    info:     'INFO',
    none:     'INFO',
  };
  return map[String(severity).toLowerCase()] || 'MEDIUM';
}
