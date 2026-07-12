// =============================================================================
// SentinelOps AI – JWT Authentication & RBAC Authorization middleware
// =============================================================================

import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import prisma from '../database/prisma.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';

/**
 * authenticate – validates the Bearer JWT in the Authorization header.
 * On success, attaches `req.user = { id, role }` for downstream use.
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header missing or malformed.');
    }

    const token = authHeader.slice(7);

    let payload;
    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token has expired.');
      }
      throw new UnauthorizedError('Invalid access token.');
    }

    // Ensure user still exists and is active (prevents use of tokens after deactivation)
    const user = await prisma.user.findUnique({
      where:  { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Account not found or deactivated.');
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * authorize – factory that returns a middleware accepting only the listed roles.
 * Must be used AFTER authenticate.
 *
 * @param {...string} roles  e.g. authorize('ADMIN', 'OPERATOR')
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}.`,
        ),
      );
    }
    next();
  };
}
