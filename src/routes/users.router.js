const express = require('express');
const {
  registerValidator,
  loginValidator,
  emailValidator,
  passwordValidator,
  validate
} = require('../validators/validators');

const requireAuth = require('../middleware/auth.middleware');
const {
    httpAdminGetUser,
    httpCreateUser,
    httpLogin,
    httpRefreshAccessToken,
    httpSendResetPasswordCode,
    httpCheckPasswordResetCode,
    httpResetPassword
} = require('../controllers/users.controller');

const {messageMe} = require('../models/users.model');

const userRouter = express.Router();
userRouter.get('/', requireAuth,httpAdminGetUser);

userRouter.post('/register', registerValidator, validate,httpCreateUser);

userRouter.post('/login', loginValidator,  validate, httpLogin);

userRouter.post('/auth/reset', httpSendResetPasswordCode);

userRouter.post('/auth/reset/validate', emailValidator, validate, httpCheckPasswordResetCode);

userRouter.post('/auth/reset/password-reset', emailValidator, passwordValidator,validate, httpResetPassword);

userRouter.post('/auth/refresh', httpRefreshAccessToken);



module.exports = userRouter