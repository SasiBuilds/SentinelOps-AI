// =============================================================================
// SentinelOps AI – Incident validation chains
// =============================================================================

import { body, query } from 'express-validator';
import { SEVERITY, INCIDENT_STATUS } from '../constants/index.js';

const SEVERITY_VALUES   = Object.values(SEVERITY);
const STATUS_VALUES     = Object.values(INCIDENT_STATUS);

export const validateCreateIncident = [
  body('title')
    .trim()
    .notEmpty().withMessage('title is required.')
    .isLength({ max: 255 }).withMessage('title must not exceed 255 characters.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('description must not exceed 5000 characters.'),

  body('severity')
    .optional()
    .isIn(SEVERITY_VALUES).withMessage(`severity must be one of: ${SEVERITY_VALUES.join(', ')}.`),

  body('service')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('service must not exceed 255 characters.'),

  body('source')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('source must not exceed 255 characters.'),

  body('region')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('region must not exceed 255 characters.'),

  body('rootCause')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('rootCause must not exceed 5000 characters.'),
];

export const validateUpdateIncident = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('title must be 1–255 characters.'),

  body('severity')
    .optional()
    .isIn(SEVERITY_VALUES).withMessage(`severity must be one of: ${SEVERITY_VALUES.join(', ')}.`),

  body('status')
    .optional()
    .isIn(STATUS_VALUES).withMessage(`status must be one of: ${STATUS_VALUES.join(', ')}.`),

  body('assigneeId')
    .optional()
    .isUUID(4).withMessage('assigneeId must be a valid UUID v4.'),
];

export const validateListIncidents = [
  query('status')
    .optional()
    .isIn(STATUS_VALUES).withMessage(`status must be one of: ${STATUS_VALUES.join(', ')}.`),

  query('severity')
    .optional()
    .isIn(SEVERITY_VALUES).withMessage(`severity must be one of: ${SEVERITY_VALUES.join(', ')}.`),
];
