// Lib
import express from 'express';

import {
  emailValidator,
  loginValidator,
  registerValidator,
} from './user.validator.js';

import validate from '../../core/validation/expressValidator.js';

import requireAuth from '../../core/middleware/auth.middleware.js';

import {
  httpAdminGetUser,
  httpRefreshAccessToken,
  httpSendResetPasswordCode,
  httpCheckPasswordResetCode,
  httpResetPassword,
  httpRegisterUser,
  httpLoginUser
} from './user.controller.js';

const userRouter = express.Router();
userRouter.get('/', requireAuth, httpAdminGetUser);

userRouter.post('/register', registerValidator, validate, httpRegisterUser);

userRouter.post('/login', loginValidator, validate, httpLoginUser);

userRouter.post('/auth/reset', httpSendResetPasswordCode);

userRouter.post('/auth/reset/validate', emailValidator, validate, httpCheckPasswordResetCode);

userRouter.post('/auth/reset/password-reset', emailValidator, validate, httpResetPassword);

userRouter.post('/auth/refresh', httpRefreshAccessToken);

export { userRouter };