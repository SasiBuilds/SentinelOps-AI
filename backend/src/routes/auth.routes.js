// =============================================================================
// SentinelOps AI – Auth routes
// =============================================================================

import { Router } from 'express';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  getMeHandler,
} from '../controllers/auth.controller.js';
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} from '../validations/index.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route  POST /api/v1/auth/register
 * @desc   Create a new user account
 * @access Public
 */
router.post('/register', validateRegister, validate, registerHandler);

/**
 * @route  POST /api/v1/auth/login
 * @desc   Login and receive access + refresh tokens
 * @access Public
 */
router.post('/login', validateLogin, validate, loginHandler);

/**
 * @route  POST /api/v1/auth/refresh
 * @desc   Exchange a valid refresh token for a new token pair
 * @access Public
 */
router.post('/refresh', validateRefreshToken, validate, refreshHandler);

/**
 * @route  POST /api/v1/auth/logout
 * @desc   Revoke the refresh token (logout)
 * @access Public (token is optional – no-op if missing)
 */
router.post('/logout', logoutHandler);

/**
 * @route  GET /api/v1/auth/me
 * @desc   Get the authenticated user's profile
 * @access Private
 */
router.get('/me', authenticate, getMeHandler);

export default router;
