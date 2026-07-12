// =============================================================================
// SentinelOps AI – Global error handling middleware
// Must be registered LAST in app.js (after all routes).
// =============================================================================

import { AppError } from '../errors/AppError.js';
import { sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';
import logger from '../logger/index.js';

/**
 * Handle Prisma known request errors (unique constraint, not found, etc.)
 * and translate them into AppErrors so the client gets a clean response.
 */
function handlePrismaError(err) {
  // P2002 – Unique constraint failed
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field';
    return new AppError(`A record with this ${field} already exists.`, HTTP_STATUS.CONFLICT, 'DUPLICATE_ENTRY');
  }

  // P2025 – Record not found (e.g. update/delete on non-existent id)
  if (err.code === 'P2025') {
    return new AppError('Record not found.', HTTP_STATUS.NOT_FOUND, 'RESOURCE_NOT_FOUND');
  }

  // P2003 – Foreign key constraint failed
  if (err.code === 'P2003') {
    return new AppError('Related resource not found.', HTTP_STATUS.BAD_REQUEST, 'FOREIGN_KEY_VIOLATION');
  }

  return null;
}

/**
 * Express 4-argument error middleware.
 *
 * @param {Error}                       err
 * @param {import('express').Request}   req
 * @param {import('express').Response}  res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // ----- Prisma errors -------------------------------------------------------
  if (err.constructor?.name?.startsWith('Prisma') || err.code?.startsWith?.('P')) {
    const converted = handlePrismaError(err);
    if (converted) {
      logger.warn('Prisma operational error', { code: converted.code, message: converted.message });
      return sendError(res, converted.statusCode, converted.message, converted.code);
    }
  }

  // ----- Known operational AppErrors ----------------------------------------
  if (err instanceof AppError && err.isOperational) {
    logger.warn('Operational error', {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      path: req.path,
      method: req.method,
    });
    return sendError(res, err.statusCode, err.message, err.code);
  }

  // ----- JWT errors ----------------------------------------------------------
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token.', 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token has expired.', 'TOKEN_EXPIRED');
  }

  // ----- express-validator ValidationError -----------------------------------
  if (err.type === 'validation') {
    return sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, err.message, 'VALIDATION_ERROR', err.errors);
  }

  // ----- Unexpected / programmer errors -------------------------------------
  logger.error('Unhandled server error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const isProd = process.env.NODE_ENV === 'production';
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isProd ? 'An unexpected error occurred. Please try again later.' : err.message,
    'INTERNAL_SERVER_ERROR',
  );
}
