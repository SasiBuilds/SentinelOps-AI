// =============================================================================
// SentinelOps AI – Standardised API response helpers
// All controllers use these to guarantee a consistent response envelope.
// =============================================================================

import { HTTP_STATUS, RESPONSE_STATUS } from '../constants/index.js';

/**
 * Send a successful response.
 *
 * @param {import('express').Response} res
 * @param {*}      data        Payload to include under the `data` key
 * @param {string} [message]   Optional human-readable message
 * @param {number} [statusCode=200]
 */
export function sendSuccess(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
  return res.status(statusCode).json({
    status: RESPONSE_STATUS.SUCCESS,
    message,
    data,
  });
}

/**
 * Send a 201 Created response.
 *
 * @param {import('express').Response} res
 * @param {*}      data
 * @param {string} [message]
 */
export function sendCreated(res, data = null, message = 'Resource created successfully') {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
}

/**
 * Send a 204 No Content response (no body).
 *
 * @param {import('express').Response} res
 */
export function sendNoContent(res) {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
}

/**
 * Send a paginated list response.
 *
 * @param {import('express').Response} res
 * @param {Array}  items
 * @param {object} pagination  { page, limit, total, totalPages }
 * @param {string} [message]
 */
export function sendPaginated(res, items, pagination, message = 'Success') {
  return res.status(HTTP_STATUS.OK).json({
    status: RESPONSE_STATUS.SUCCESS,
    message,
    data: items,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
    },
  });
}

/**
 * Send an error response (used by the global error handler).
 *
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {string} [code]
 * @param {*}      [errors]
 */
export function sendError(res, statusCode, message, code = null, errors = null) {
  const body = {
    status: statusCode >= 500 ? RESPONSE_STATUS.ERROR : RESPONSE_STATUS.FAIL,
    message,
    ...(code && { code }),
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(body);
}
