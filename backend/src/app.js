// =============================================================================
// SentinelOps AI – Express application factory
// Configures all middleware, routes, and error handling.
// Exported as a factory so server.js can call createApp() and attach the
// result to an HTTP server, keeping the app testable in isolation.
// =============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import config from './config/index.js';
import logger from './logger/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { swaggerSpec } from './utils/swagger.js';
import apiRoutes from './routes/index.js';
import metricsMiddleware from './middleware/prometheus.js';
import { register } from './config/metrics.js';

/**
 * Build and return a configured Express application instance.
 *
 * @returns {import('express').Application}
 */
export function createApp() {
  const app = express();

  // ── Trust proxy (required when running behind nginx / ALB / k8s ingress) ──
  app.set('trust proxy', 1);

  // ── Security headers ───────────────────────────────────────────────────────
  app.use(
    helmet({
      // Allow Swagger UI to load its own CSS/JS assets
      contentSecurityPolicy: config.swagger.enabled ? false : undefined,
    }),
  );

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: config.cors.origin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      credentials: true,
    }),
  );

  // ── Response compression ───────────────────────────────────────────────────
  app.use(compression());

  // ── Body parsers ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── HTTP request logging (Morgan → Winston) ────────────────────────────────
  app.use(requestLogger);
  app.use(metricsMiddleware);

  // ── Rate limiting ──────────────────────────────────────────────────────────
  app.use(rateLimiter());

  // ── Root redirect → API docs ───────────────────────────────────────────────
  app.get('/', (req, res) => {
    res.redirect(`/api/${config.apiVersion}/health`);
  });

  // ── Swagger UI (disabled in production by default) ────────────────────────
  if (config.swagger.enabled) {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'SentinelOps AI – API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: { persistAuthorization: true },
      }),
    );
    logger.info(`Swagger UI available at http://localhost:${config.port}/api-docs`);
  }
  app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

  // ── API routes ─────────────────────────────────────────────────────────────
  app.use(`/api/${config.apiVersion}`, apiRoutes);

  // ── 404 catch-all ─────────────────────────────────────────────────────────
  app.use(notFound);

  // ── Global error handler (must be last) ───────────────────────────────────
  app.use(errorHandler);

  return app;
}
