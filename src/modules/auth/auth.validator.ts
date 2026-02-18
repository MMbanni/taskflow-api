import { body } from 'express-validator';

const PASSWORD_MIN = 6;
const PASSWORD_MAX = 20;

export const loginValidator = [
  body('username')
    .notEmpty().withMessage('Username is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

export const resetCodeValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required'),
  body('resetCode')
    .notEmpty().withMessage('Reset code is required')
];

export const resetPasswordValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required'),
  body('resetCode')
    .notEmpty().withMessage('Reset code is required'),
  body('password')
    .isLength({ min: PASSWORD_MIN, max: PASSWORD_MAX }).withMessage(`Password must be ${PASSWORD_MIN}-${PASSWORD_MAX} characters long`)
];
