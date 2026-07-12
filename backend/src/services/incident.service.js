// =============================================================================
// SentinelOps AI – Incident Service
// Business logic for creating, reading, updating, and closing incidents.
// =============================================================================

import prisma from '../database/prisma.js';
import { NotFoundError, ConflictError } from '../errors/index.js';
import { buildPaginationMeta } from '../utils/pagination.js';

// ---------------------------------------------------------------------------
// List incidents with pagination and optional filters
// ---------------------------------------------------------------------------
export async function listIncidents({ page, limit, skip, status, severity, service }) {
  const where = {};
  if (status)   where.status   = status;
  if (severity) where.severity = severity;
  if (service)  where.service  = { contains: service, mode: 'insensitive' };

  const [total, items] = await Promise.all([
    prisma.incident.count({ where }),
    prisma.incident.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
      skip,
      take: limit,
      include: {
        assignee:   { select: { id: true, name: true, email: true } },
        _count:     { select: { recoveries: true, alerts: true } },
      },
    }),
  ]);

  return { items, pagination: buildPaginationMeta(total, page, limit) };
}

// ---------------------------------------------------------------------------
// Get a single incident by ID
// ---------------------------------------------------------------------------
export async function getIncidentById(id) {
  const incident = await prisma.incident.findUnique({
    where: { id },
    include: {
      assignee:   { select: { id: true, name: true, email: true } },
      recoveries: { orderBy: { startedAt: 'desc' } },
      alerts:     { orderBy: { startsAt: 'desc' } },
    },
  });

  if (!incident) throw new NotFoundError(`Incident ${id} not found.`);
  return incident;
}

// ---------------------------------------------------------------------------
// Create a new incident
// ---------------------------------------------------------------------------
export async function createIncident(data) {
  const { title, description, severity, service, source, region, rootCause } = data;

  return prisma.incident.create({
    data: {
      title,
      description,
      severity:  severity  || 'MEDIUM',
      source,
      service,
      region,
      rootCause,
      status:    'OPEN',
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}

// ---------------------------------------------------------------------------
// Update an incident (partial update)
// ---------------------------------------------------------------------------
export async function updateIncident(id, data) {
  await getIncidentById(id); // ensures it exists

  const { title, description, severity, status, service, region, rootCause, assigneeId } = data;

  const updateData = {};
  if (title       !== undefined) updateData.title       = title;
  if (description !== undefined) updateData.description = description;
  if (severity    !== undefined) updateData.severity    = severity;
  if (status      !== undefined) updateData.status      = status;
  if (service     !== undefined) updateData.service     = service;
  if (region      !== undefined) updateData.region      = region;
  if (rootCause   !== undefined) updateData.rootCause   = rootCause;
  if (assigneeId  !== undefined) updateData.assigneeId  = assigneeId;

  // Auto-set resolvedAt when transitioning to RESOLVED or CLOSED
  if (status === 'RESOLVED' || status === 'CLOSED') {
    updateData.resolvedAt = updateData.resolvedAt || new Date();
  }

  return prisma.incident.update({
    where: { id },
    data: updateData,
    include: {
      assignee:   { select: { id: true, name: true, email: true } },
      _count:     { select: { recoveries: true, alerts: true } },
    },
  });
}

// ---------------------------------------------------------------------------
// Delete an incident (and cascade recoveries/alerts via DB)
// ---------------------------------------------------------------------------
export async function deleteIncident(id) {
  await getIncidentById(id); // ensures it exists
  return prisma.incident.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Get incident statistics (for the dashboard)
// ---------------------------------------------------------------------------
export async function getIncidentStats() {
  const [total, bySeverity, byStatus, recentResolved] = await Promise.all([
    prisma.incident.count(),

    prisma.incident.groupBy({
      by: ['severity'],
      _count: { severity: true },
    }),

    prisma.incident.groupBy({
      by: ['status'],
      _count: { status: true },
    }),

    prisma.incident.count({
      where: {
        status:     { in: ['RESOLVED', 'CLOSED'] },
        resolvedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    total,
    bySeverity: bySeverity.map((r) => ({ severity: r.severity, count: r._count.severity })),
    byStatus:   byStatus.map((r)   => ({ status:   r.status,   count: r._count.status   })),
    resolvedLast7Days: recentResolved,
  };
}
