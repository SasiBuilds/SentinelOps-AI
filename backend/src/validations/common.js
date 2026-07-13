// =============================================================================
// SentinelOps AI – Shared validation rules (express-validator)
// Domain-specific rule files will be added per feature module.
// =============================================================================

import { param, query } from 'express-validator';
import { PAGINATION } from '../constants/index.js';

/**
 * Validate a UUID path parameter.
 * Usage: router.get('/:id', ...validateUuidParam('id'), validate, controller)
 *
 * @param {string} [paramName='id']
 * @returns {import('express-validator').ValidationChain[]}
 */
export function validateUuidParam(paramName = 'id') {
  return [
    param(paramName)
      .isUUID(4)
      .withMessage(`${paramName} must be a valid UUID v4.`),
  ];
}

/**
 * Validate standard pagination query parameters: page and limit.
 *
 * @returns {import('express-validator').ValidationChain[]}
 */
export function validatePagination() {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page must be a positive integer.')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: PAGINATION.MAX_LIMIT })
      .withMessage(`limit must be between 1 and ${PAGINATION.MAX_LIMIT}.`)
      .toInt(),
  ];
}
