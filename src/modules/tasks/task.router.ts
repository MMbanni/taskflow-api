import express from 'express';

import {
  httpCreateTask,
  httpDeleteTask,
  httpGetTasks,
  httpGetTaskById,
  httpUpdateTask
} from './task.controller.js';



import { createTaskValidator, queryTaskValidator} from "./task.validator.js";
import validate from "../../core/validation/expressValidator.js";

import requireAuth from '../../core/middleware/auth.middleware.js';

const taskRouter = express.Router();

taskRouter.post('/',  requireAuth,createTaskValidator, validate, httpCreateTask);

taskRouter.get('/', requireAuth, queryTaskValidator, validate, httpGetTasks);
taskRouter.get('/:taskId', requireAuth, httpGetTaskById);


taskRouter.patch('/:taskId', requireAuth, httpUpdateTask);

taskRouter.delete('/:taskId', requireAuth, httpDeleteTask);

export { taskRouter };