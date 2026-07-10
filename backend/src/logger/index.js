// =============================================================================
// SentinelOps AI – Winston logger
// =============================================================================

import { fileURLToPath } from 'url';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import winston from 'winston';

const { combine, timestamp, errors, json, colorize, printf, splat } = winston.format;

// Resolve __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure log directory exists
const LOG_DIR = process.env.LOG_DIR || 'logs';
const logDir = path.resolve(process.cwd(), LOG_DIR);
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Pretty format for the development console
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
  return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

const isDev = process.env.NODE_ENV !== 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    errors({ stack: true }), // capture stack traces on Error instances
    splat(),
  ),
  defaultMeta: { service: 'sentinelops-backend' },
  transports: [
    // Human-readable console output in development; structured JSON in production
    new winston.transports.Console({
      format: isDev
        ? combine(colorize({ all: true }), devFormat)
        : combine(json()),
    }),
    // Persistent JSON logs for all levels >= info
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: json(),
    }),
    // Dedicated error log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: json(),
    }),
  ],
  // Do not crash on uncaught exceptions; the process manager handles that
  exitOnError: false,
});

// Stream interface for Morgan HTTP request logging
logger.stream = {
  write: (message) => logger.http(message.trimEnd()),
};

export default logger;
