// =============================================================================
// SentinelOps AI – Async route handler wrapper
// Eliminates try/catch boilerplate in every controller.
// =============================================================================

/**
 * Wraps an async Express route handler and forwards any rejected promise
 * or thrown error to the next() error middleware.
 *
 * @param {Function} fn  Async (req, res, next) handler
 * @returns {Function}   Express middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
