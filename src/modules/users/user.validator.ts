import { body } from "express-validator";

const USERNAME_MIN = 4;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 20;

export const registerValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: USERNAME_MIN, max: USERNAME_MAX }).withMessage(`Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters long`),
  body('email')
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: PASSWORD_MIN, max: PASSWORD_MAX }).withMessage(`Password must be ${PASSWORD_MIN}-${PASSWORD_MAX} characters long`)
];

export const loginValidator = [
  body('username')
    .notEmpty().withMessage('Username is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
];
export const emailValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
];


