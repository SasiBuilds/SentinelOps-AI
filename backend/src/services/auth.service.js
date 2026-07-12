// =============================================================================
// SentinelOps AI – Auth Service
// Handles registration, login, token refresh, and logout.
// =============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma.js';
import config from '../config/index.js';
import { UnauthorizedError, ConflictError, ForbiddenError } from '../errors/index.js';
import logger from '../logger/index.js';

const SALT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// Generate access + refresh token pair
// ---------------------------------------------------------------------------
function generateTokens(userId, role) {
  const accessToken = jwt.sign(
    { sub: userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn },
  );

  return { accessToken, refreshToken };
}

// ---------------------------------------------------------------------------
// Register a new user
// ---------------------------------------------------------------------------
export async function register({ email, name, password, role = 'VIEWER' }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, name, passwordHash, role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  logger.info('New user registered', { userId: user.id, email: user.email });
  return user;
}

// ---------------------------------------------------------------------------
// Login – validate credentials and issue tokens
// ---------------------------------------------------------------------------
export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Constant-time failure to prevent user enumeration
  const dummyHash = '$2a$12$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const isValid   = user
    ? await bcrypt.compare(password, user.passwordHash)
    : await bcrypt.compare(password, dummyHash);

  if (!user || !isValid) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ForbiddenError('Your account has been deactivated. Contact an administrator.');
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  // Persist refresh token
  const expiresAt = new Date(Date.now() + _parseDuration(config.jwt.refreshExpiresIn));
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt },
  });

  // Update lastLoginAt
  await prisma.user.update({
    where: { id: user.id },
    data:  { lastLoginAt: new Date() },
  });

  logger.info('User logged in', { userId: user.id });

  return {
    accessToken,
    refreshToken,
    user: {
      id:    user.id,
      email: user.email,
      name:  user.name,
      role:  user.role,
    },
  };
}

// ---------------------------------------------------------------------------
// Refresh access token using a valid refresh token
// ---------------------------------------------------------------------------
export async function refresh(tokenStr) {
  let payload;
  try {
    payload = jwt.verify(tokenStr, config.jwt.refreshSecret);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token.');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: tokenStr } });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token has been revoked or expired.');
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user || !user.isActive) {
    throw new ForbiddenError('Account is no longer active.');
  }

  // Token rotation: revoke the old token and issue a new pair
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: stored.id },
      data:  { revokedAt: new Date() },
    }),
    prisma.refreshToken.create({
      data: {
        userId:    user.id,
        token:     newRefreshToken,
        expiresAt: new Date(Date.now() + _parseDuration(config.jwt.refreshExpiresIn)),
      },
    }),
  ]);

  return { accessToken, refreshToken: newRefreshToken };
}

// ---------------------------------------------------------------------------
// Logout – revoke the refresh token
// ---------------------------------------------------------------------------
export async function logout(tokenStr) {
  if (!tokenStr) return;

  const stored = await prisma.refreshToken.findUnique({ where: { token: tokenStr } });
  if (stored && !stored.revokedAt) {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data:  { revokedAt: new Date() },
    });
  }
}

// ---------------------------------------------------------------------------
// Get current user profile
// ---------------------------------------------------------------------------
export async function getProfile(userId) {
  return prisma.user.findUnique({
    where:  { id: userId },
    select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
  });
}

// ---------------------------------------------------------------------------
// Private: parse simple duration strings like "7d", "24h", "30m" → ms
// ---------------------------------------------------------------------------
function _parseDuration(str) {
  const units = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) return 7 * 86_400_000; // default 7 days
  return parseInt(match[1], 10) * units[match[2]];
}
