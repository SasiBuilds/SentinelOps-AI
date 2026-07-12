// =============================================================================
// SentinelOps AI – HTTP server entry point
//
// Responsibilities:
//   1. Load environment variables from .env BEFORE any other import
//   2. Connect to the database
//   3. Create the Express app
//   4. Start the HTTP server
//   5. Register graceful-shutdown handlers
// =============================================================================

import 'dotenv/config'; // must be first – populates process.env before config reads it

import http from 'http';
import { createApp } from './src/app.js';
import { connectDatabase, disconnectDatabase } from './src/database/index.js';
import config from './src/config/index.js';
import logger from './src/logger/index.js';

// ── Bootstrap ────────────────────────────────────────────────────────────────

async function bootstrap() {
  try {
    // 1. Verify database is reachable before accepting traffic
    await connectDatabase();

    // 2. Create the Express application
    const app = createApp();

    // 3. Wrap in a native HTTP server so we can manage connections during shutdown
    const server = http.createServer(app);

    // 4. Start listening
    server.listen(config.port, () => {
      logger.info('═══════════════════════════════════════════════════');
      logger.info(`  ${config.appName} – Backend API`);
      logger.info(`  Environment : ${config.env}`);
      logger.info(`  Port        : ${config.port}`);
      logger.info(`  API Base    : http://localhost:${config.port}/api/${config.apiVersion}`);
      logger.info(`  Health      : http://localhost:${config.port}/api/${config.apiVersion}/health`);
      if (config.swagger.enabled) {
        logger.info(`  Swagger UI  : http://localhost:${config.port}/api-docs`);
      }
      logger.info('═══════════════════════════════════════════════════');
    });

    // ── Graceful shutdown ──────────────────────────────────────────────────

    /**
     * Close the HTTP server and database connection cleanly.
     * Gives in-flight requests up to 10 s to complete before forcing exit.
     */
    async function shutdown(signal) {
      logger.info(`Received ${signal}. Shutting down gracefully…`);

      server.close(async () => {
        logger.info('HTTP server closed. No longer accepting connections.');
        await disconnectDatabase();
        logger.info('Shutdown complete. Goodbye.');
        process.exit(0);
      });

      // Force-exit if clean shutdown takes too long
      setTimeout(() => {
        logger.error('Graceful shutdown timed out. Forcing exit.');
        process.exit(1);
      }, 10_000);
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // ── Unhandled rejection / uncaught exception guards ───────────────────

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection', { reason });
      // Let the process manager (PM2 / k8s) restart the pod
      process.exit(1);
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception', { message: err.message, stack: err.stack });
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to start the server', { message: err.message, stack: err.stack });
    process.exit(1);
  }
}

bootstrap();
