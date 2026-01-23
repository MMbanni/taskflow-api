const { body } = require('express-validator');
const { validationResult } = require('express-validator');


const registerValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidator = [
  body('username')
    .notEmpty().withMessage('Username is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
];
const emailValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
];
const passwordValidator = [
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg);
    return res.status(400).json({
      success: false,
      errors: messages
    });
  }
  next();
};


module.exports = {
  registerValidator,
  loginValidator,
  emailValidator,
  passwordValidator,
  validate
};
