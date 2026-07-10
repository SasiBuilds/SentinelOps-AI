// =============================================================================
// SentinelOps AI – Base application error class
// =============================================================================

/**
 * Operational error thrown intentionally by the application.
 * Distinguishes predictable failures (404, validation) from
 * unexpected programmer errors so the global handler can respond correctly.
 */
export class AppError extends Error {
  /**
   * @param {string} message   Human-readable error message
   * @param {number} statusCode HTTP status code to send to the client
   * @param {string} [code]    Optional machine-readable error code (e.g. 'RESOURCE_NOT_FOUND')
   */
  constructor(message, statusCode, code = null) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // signals the error is safe to expose to the client

    // Preserve the original stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}
