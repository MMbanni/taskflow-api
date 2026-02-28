import type { PopulatedUser } from '../../types/task.js';
import type { CreateTaskInputDTO, QueryTaskInputDTO, TaskOutputDTO, UpdateTaskInputDTO } from './task.dto.js';
import { mapToPopulatedTaskOutput, mapToTaskOutput } from './task.mapper.js';
import { TaskModel } from './task.schema.js';


export async function saveTask(data: CreateTaskInputDTO): Promise<TaskOutputDTO> {
  const task = await TaskModel.create(data);
  return mapToTaskOutput(task);
}

export async function listTasks(queries: QueryTaskInputDTO): Promise<TaskOutputDTO[]> {
  const { page, limit, ...filters } = queries;

  const task = await TaskModel.find(filters)
    .skip((page-1) * limit)
    .limit(limit)
    .populate<{ userId: PopulatedUser }>('userId', 'username email');
  
  return task.map(mapToPopulatedTaskOutput);
}

export async function findTaskById(userId: string, taskId: string): Promise<TaskOutputDTO | null> {
  const task = await TaskModel.findOne({
    userId: userId,
    _id: taskId
  })
    .populate<{ userId: PopulatedUser }>('userId', 'username email');
  if (!task) return null;
  return mapToPopulatedTaskOutput(task);
}

export async function updateTaskById(data: UpdateTaskInputDTO): Promise<TaskOutputDTO | null> {
  const { userId, taskId, ...updates } = data;

  const task = await TaskModel.findOneAndUpdate(
    { userId, _id: taskId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if(!task) return null;
  return mapToTaskOutput(task);
}

export async function deleteTaskById(userId: string, taskId: string): Promise<TaskOutputDTO | null> {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    userId
  });
  if(!task) return null;
  return mapToTaskOutput(task);
}