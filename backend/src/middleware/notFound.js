// =============================================================================
// SentinelOps AI – 404 Not Found catch-all middleware
// Register this AFTER all routes and BEFORE the error handler.
// =============================================================================

import { NotFoundError } from '../errors/index.js';

/**
 * Converts any request that falls through all defined routes into a
 * structured NotFoundError so the global error handler can format it.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function notFound(req, res, next) {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}
