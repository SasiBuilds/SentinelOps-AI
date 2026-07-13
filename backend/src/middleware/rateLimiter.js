// =============================================================================
// SentinelOps AI – Rate limiter middleware
// Uses a simple in-process store (suitable for single-instance deployments).
// Swap the store for Redis when scaling horizontally.
// =============================================================================

import { HTTP_STATUS } from '../constants/index.js';
import { sendError } from '../utils/response.js';
import config from '../config/index.js';

/**
 * Minimal in-memory rate limiter that doesn't require extra packages.
 *
 * For production scale, replace with `express-rate-limit` + a Redis store:
 *   npm install express-rate-limit rate-limit-redis
 */

const clients = new Map(); // ip -> { count, resetAt }

/**
 * @param {{ windowMs?: number, max?: number }} [options]
 * @returns {import('express').RequestHandler}
 */
export function rateLimiter(options = {}) {
  const windowMs = options.windowMs ?? config.rateLimit.windowMs;
  const max = options.max ?? config.rateLimit.max;

  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let client = clients.get(ip);

    if (!client || now > client.resetAt) {
      client = { count: 1, resetAt: now + windowMs };
      clients.set(ip, client);
      return next();
    }

    client.count += 1;

    if (client.count > max) {
      const retryAfter = Math.ceil((client.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', new Date(client.resetAt).toISOString());
      return sendError(
        res,
        HTTP_STATUS.TOO_MANY_REQUESTS,
        `Too many requests. Please try again in ${retryAfter} seconds.`,
        'RATE_LIMIT_EXCEEDED',
      );
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - client.count);
    res.setHeader('X-RateLimit-Reset', new Date(client.resetAt).toISOString());
    next();
  };
}
