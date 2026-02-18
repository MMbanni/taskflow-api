import express from 'express';
import { taskRouter } from '../modules/tasks/task.router.js';
import { userRouter } from '../modules/users/user.router.js';
import { authRouter } from '../modules/auth/auth.router.js';

const api = express.Router();
api.use('/tasks',taskRouter);
api.use('/users', userRouter);
api.use('/auth', authRouter);


export default api;