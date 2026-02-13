import { Types } from 'mongoose';
import { TaskModel } from './task.schema.js';
import type { TaskDoc } from './task.schema.js';
import type { CreateTaskInputDTO, QueryTaskInputDTO, UpdateTaskInputDTO } from './task.dto.js';
import type { PopulatedTaskDoc, PopulatedUser } from '../../types/task.js';


export async function saveTask(data: CreateTaskInputDTO): Promise<TaskDoc> {
  return TaskModel.create(data);
}

export async function listTasks(queries: QueryTaskInputDTO): Promise<PopulatedTaskDoc[]> {
  const { page, limit, ...filters } = queries;

  return TaskModel.find(filters)
    .skip((page-1) * limit)
    .limit(limit)
    .populate<{ userId: PopulatedUser }>('userId', 'username email');
}

export async function findTaskById(userId: string, taskId: string): Promise<TaskDoc | null> {
  return TaskModel.findOne({
    userId: userId,
    _id: taskId
  })
    .populate('userId', 'username email');
}

export async function updateTaskById(data: UpdateTaskInputDTO): Promise<TaskDoc | null> {
  const { userId, taskId, ...updates } = data;

  const updatedTask = await TaskModel.findOneAndUpdate(
    { userId, _id: taskId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  return updatedTask;
}

export async function deleteTaskById(userId: string, taskId: string): Promise<TaskDoc | null> {
  return TaskModel.findOneAndDelete({
    _id: taskId,
    userId
  });
}