// =============================================================================
// SentinelOps AI – express-validator result middleware
// Place after validation chain arrays in route definitions.
// =============================================================================

import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants/index.js';
import { sendError } from '../utils/response.js';

/**
 * Reads the express-validator result from the request and, if there are
 * validation errors, responds immediately with 422 Unprocessable Entity.
 * Otherwise it calls next() to continue to the controller.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'Validation failed.',
      'VALIDATION_ERROR',
      errors.array(),
    );
  }
  next();
}
