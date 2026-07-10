// =============================================================================
// SentinelOps AI – Database connection helpers
// =============================================================================

import prisma from './prisma.js';
import logger from '../logger/index.js';

/**
 * Verify the database is reachable by running a lightweight query.
 * Called during application startup and from the health-check endpoint.
 *
 * @returns {Promise<boolean>} true if connection is healthy
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established successfully.');
    return true;
  } catch (error) {
    logger.error('Failed to connect to the database.', { error: error.message });
    throw error;
  }
}

/**
 * Gracefully disconnect Prisma on application shutdown.
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed.');
  } catch (error) {
    logger.error('Error disconnecting from the database.', { error: error.message });
  }
}

export { prisma };
export default prisma;
