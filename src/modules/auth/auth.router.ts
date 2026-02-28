// Lib
import express from 'express';

import { loginValidator, resetCodeValidator, resetPasswordValidator } from '@/modules/auth/auth.validator.js';
import validate from '@/core/validation/expressValidator.js';

import {
    httpCheckPasswordResetCode,
    httpLoginUser,
    httpRefreshAccessToken,
    httpResetPassword,
    httpSendResetPasswordCode
} from '@/modules/auth/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/login', loginValidator, validate, httpLoginUser);

authRouter.post('/reset', httpSendResetPasswordCode);

authRouter.post('/reset/validate', resetCodeValidator, validate, httpCheckPasswordResetCode);

authRouter.post('/reset/password-reset', resetPasswordValidator,validate, httpResetPassword);

authRouter.post('/refresh', httpRefreshAccessToken);

export { authRouter }