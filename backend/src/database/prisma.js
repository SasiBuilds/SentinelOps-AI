// =============================================================================
// SentinelOps AI – Prisma client singleton
// Reuses a single PrismaClient instance across hot-reloads in development.
// =============================================================================

import { PrismaClient } from '@prisma/client';
import logger from '../logger/index.js';

// In development, attach the singleton to the global object so that
// `node --watch` restarts don't create multiple connections.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__sentinelPrisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' },
    ],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__sentinelPrisma = prisma;
}

// Forward Prisma log events to Winston
prisma.$on('query', (e) => {
  logger.debug('Prisma Query', { query: e.query, duration: `${e.duration}ms` });
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning', { message: e.message });
});

prisma.$on('error', (e) => {
  logger.error('Prisma Error', { message: e.message });
});

export default prisma;
