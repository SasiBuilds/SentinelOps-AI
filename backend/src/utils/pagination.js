// =============================================================================
// SentinelOps AI – Pagination utilities
// =============================================================================

import { PAGINATION } from '../constants/index.js';

/**
 * Parse and sanitise page / limit query parameters from an Express request.
 *
 * @param {import('express').Request} req
 * @returns {{ page: number, limit: number, skip: number }}
 */
export function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Build the pagination metadata object returned to the client.
 *
 * @param {number} total   Total number of records (from COUNT query)
 * @param {number} page    Current page
 * @param {number} limit   Page size
 * @returns {{ page: number, limit: number, total: number, totalPages: number }}
 */
export function buildPaginationMeta(total, page, limit) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
