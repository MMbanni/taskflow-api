import type { CreateTaskRequestDTO, QueryTaskRequestDTO, UpdateTaskRequestDTO } from './task.dto.js';

import { asyncHandler } from '../../core/utils/asyncHandler.js';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from './task.service.js';
import { ApiErrors } from '../../core/errors/ApiError.js';


// Create task
export const httpCreateTask = asyncHandler<{}, {}, CreateTaskRequestDTO>(async (req, res) => {
  const { id: userId } = req.user;

  const createdTask = await createTask(userId, req.body);

  res.status(201).json({
    success: true,
    data: createdTask
  });
})


// Get user tasks
export const httpGetTasks = asyncHandler<{}, {}, {}, QueryTaskRequestDTO>(async (req, res) => {
  const { id: userId } = req.user;

  const tasks = await getTasks(userId, req.query);

  res.status(200).json({
    success: true,
    data: tasks
  });
})

// Get task by ID
export const httpGetTaskById = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const task = await getTaskById(userId, req.params.taskId);

  res.status(200).json({
    success: true,
    data: task
  });
})

// Update task
export const httpUpdateTask = asyncHandler<{ taskId: string }, {}, UpdateTaskRequestDTO>(async (req, res) => {
  const { id: userId } = req.user;
  const taskId = req.params.taskId;
  const body = req.body;

  // Validate input length
  if ((Object.keys(body).length) === 0) {
    throw ApiErrors.invalidInput('No updates submitted');
  }

  const updatedTask = await updateTask(userId, taskId, body)

  res.status(200).json({
    success: true,
    data: updatedTask
  });
})

// Delete task
export const httpDeleteTask = asyncHandler<{ taskId: string }>(async (req, res) => {
  const { id: userId } = req.user;
  const { taskId } = req.params;

  await deleteTask(userId, taskId);

  res.status(200).json({
    success: true,
    message: 'Task deleted'
  });
});
