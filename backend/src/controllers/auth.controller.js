// =============================================================================
// SentinelOps AI – Auth Controller
// =============================================================================

import {
  register,
  login,
  refresh,
  logout,
  getProfile,
} from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** POST /api/v1/auth/register */
export const registerHandler = asyncHandler(async (req, res) => {
  const user = await register(req.body);
  return sendCreated(res, user, 'Account created successfully. Please log in.');
});

/** POST /api/v1/auth/login */
export const loginHandler = asyncHandler(async (req, res) => {
  const result = await login(req.body);
  return sendSuccess(res, result, 'Login successful.');
});

/** POST /api/v1/auth/refresh */
export const refreshHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await refresh(refreshToken);
  return sendSuccess(res, tokens, 'Tokens refreshed successfully.');
});

/** POST /api/v1/auth/logout */
export const logoutHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await logout(refreshToken);
  return sendSuccess(res, null, 'Logged out successfully.');
});

/** GET /api/v1/auth/me */
export const getMeHandler = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);
  return sendSuccess(res, user, 'Profile retrieved successfully.');
});
