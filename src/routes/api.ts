import express from 'express';
import { taskRouter } from '../modules/tasks/task.router.js';
import { userRouter } from '../modules/users/user.router.js';

const api = express.Router();
api.use('/tasks',taskRouter);
api.use('/users', userRouter);

export default api;