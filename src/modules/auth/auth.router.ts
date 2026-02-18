// Lib
import express from 'express';

import { loginValidator } from './auth.validator.js';
import validate from '../../core/validation/expressValidator.js';

import {
    httpCheckPasswordResetCode,
    httpLoginUser,
    httpRefreshAccessToken,
    httpResetPassword,
    httpSendResetPasswordCode
} from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/login', loginValidator, validate, httpLoginUser);

authRouter.post('/reset', httpSendResetPasswordCode);

authRouter.post('/reset/validate', validate, httpCheckPasswordResetCode);

authRouter.post('/reset/password-reset', validate, httpResetPassword);

authRouter.post('/refresh', httpRefreshAccessToken);

export { authRouter }