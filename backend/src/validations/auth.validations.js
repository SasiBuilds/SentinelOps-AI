// =============================================================================
// SentinelOps AI – Auth validation chains
// =============================================================================

import { body } from 'express-validator';

export const validateRegister = [
  body('email')
    .trim()
    .notEmpty().withMessage('email is required.')
    .isEmail().withMessage('email must be a valid email address.')
    .normalizeEmail(),

  body('name')
    .trim()
    .notEmpty().withMessage('name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters.'),

  body('password')
    .notEmpty().withMessage('password is required.')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('password must contain at least one number.'),

  body('role')
    .optional()
    .isIn(['ADMIN', 'OPERATOR', 'VIEWER']).withMessage('role must be ADMIN, OPERATOR, or VIEWER.'),
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('email is required.')
    .isEmail().withMessage('email must be a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('password is required.'),
];

export const validateRefreshToken = [
  body('refreshToken')
    .trim()
    .notEmpty().withMessage('refreshToken is required.'),
];
