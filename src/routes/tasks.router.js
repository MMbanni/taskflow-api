const express = require('express');
const {
  httpCreateTask,
  httpDeleteTask,
  httpGetTasks,
  httpGetTaskById,
  httpIncrementPriority,
  httpDecrementPriority,
  httpUpdateTask
} = require('../controllers/tasks.controller');
const requireAuth = require('../middleware/auth.middleware');

const taskRouter = express.Router();

taskRouter.get('/', requireAuth, httpGetTasks);
taskRouter.get('/:taskId', requireAuth, httpGetTaskById);

taskRouter.post('/', requireAuth, httpCreateTask);

taskRouter.patch('/:taskId', requireAuth, httpUpdateTask);
taskRouter.patch('/:taskId/priority/increment', requireAuth, httpIncrementPriority);
taskRouter.patch('/:taskId/priority/decrement', requireAuth, httpDecrementPriority);


taskRouter.delete('/:taskId', requireAuth, httpDeleteTask);

module.exports = taskRouter;