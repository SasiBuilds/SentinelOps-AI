// =============================================================================
// SentinelOps AI – Alert validation chains
// =============================================================================

import { body, query } from 'express-validator';
import { SEVERITY } from '../constants/index.js';

const SEVERITY_VALUES = Object.values(SEVERITY);
const ALERT_STATUS    = ['FIRING', 'RESOLVED', 'SILENCED'];

export const validateIngestAlert = [
  body('alertname')
    .trim()
    .notEmpty().withMessage('alertname is required.')
    .isLength({ max: 255 }).withMessage('alertname must not exceed 255 characters.'),

  body('severity')
    .optional()
    .isIn([...SEVERITY_VALUES, 'warning', 'critical', 'info', 'none'])
    .withMessage(`severity must be a valid value.`),

  body('source')
    .optional()
    .trim()
    .isLength({ max: 255 }),

  body('service')
    .optional()
    .trim()
    .isLength({ max: 255 }),

  body('namespace')
    .optional()
    .trim()
    .isLength({ max: 255 }),

  body('labels')
    .optional()
    .isObject().withMessage('labels must be an object.'),

  body('annotations')
    .optional()
    .isObject().withMessage('annotations must be an object.'),
];

export const validateListAlerts = [
  query('status')
    .optional()
    .isIn(ALERT_STATUS).withMessage(`status must be one of: ${ALERT_STATUS.join(', ')}.`),

  query('severity')
    .optional()
    .isIn(SEVERITY_VALUES).withMessage(`severity must be one of: ${SEVERITY_VALUES.join(', ')}.`),
];
