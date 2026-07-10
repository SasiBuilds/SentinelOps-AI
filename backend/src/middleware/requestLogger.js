// =============================================================================
// SentinelOps AI – Morgan HTTP request logger middleware
// =============================================================================

import morgan from 'morgan';
import logger from '../logger/index.js';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Use concise `dev` format in development (colourised status codes),
 * and structured `combined` format in production (Apache-style log line
 * forwarded to the Winston stream for JSON serialisation).
 */
export const requestLogger = morgan(isDev ? 'dev' : 'combined', {
  stream: logger.stream,
  // Skip health-check polls from cluttering the logs
  skip: (req) => req.path === '/health' || req.path === '/api/v1/health',
});
