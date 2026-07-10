// =============================================================================
// SentinelOps AI – Recovery validation chains
// =============================================================================

import { body, query } from 'express-validator';
import { RECOVERY_ACTION } from '../constants/index.js';

const ACTION_VALUES        = Object.values(RECOVERY_ACTION);
const RECOVERY_STATUS_VALS = ['PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'SKIPPED'];

export const validateTriggerRecovery = [
  body('incidentId')
    .trim()
    .notEmpty().withMessage('incidentId is required.')
    .isUUID(4).withMessage('incidentId must be a valid UUID v4.'),

  body('action')
    .isIn(ACTION_VALUES).withMessage(`action must be one of: ${ACTION_VALUES.join(', ')}.`),

  body('targetService')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('targetService must not exceed 255 characters.'),

  body('automated')
    .optional()
    .isBoolean().withMessage('automated must be a boolean.'),
];

export const validateListRecoveries = [
  query('incidentId')
    .optional()
    .isUUID(4).withMessage('incidentId must be a valid UUID v4.'),

  query('status')
    .optional()
    .isIn(RECOVERY_STATUS_VALS).withMessage(`status must be one of: ${RECOVERY_STATUS_VALS.join(', ')}.`),
];
