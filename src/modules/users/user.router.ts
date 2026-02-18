// Lib
import express from 'express';
import requireAuth from '../../core/middleware/auth.middleware.js';
import validate from '../../core/validation/expressValidator.js';
import { httpAdminGetUser, httpRegisterUser } from './user.controller.js';
import { registerValidator } from './user.validator.js';

const userRouter = express.Router();

userRouter.get('/', requireAuth, httpAdminGetUser);

userRouter.post('/register', registerValidator, validate, httpRegisterUser);

export { userRouter };
