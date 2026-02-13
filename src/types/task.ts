import type mongoose from "mongoose";
import type { TaskDoc } from "../modules/tasks/task.schema.js";

export type Status = 'todo' | 'in-process' | 'complete';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date
};

export interface TaskParams {
  taskId: string;
}

export interface TaskQuery {
  status?: string;
  priority?: string;
  search?: string;
}

export type CreateTaskBody =
    Pick<Task, 'title'>
    & Partial<Pick<Task, 'status' | 'priority' | 'description'>>
;

export type PopulatedUser = {
  username: string;
  email: string;
};

export type PopulatedTaskDoc = Omit<TaskDoc, 'userId'> & {
  userId: PopulatedUser;
};

export type UpdateTask = Partial<Pick<Task, 'description' | 'priority' | 'status' | 'title'>>;

export type TaskFilters = {
    userId: mongoose.Types.ObjectId;
    title?: string;
    description?: string;
    status?: Status;
    priority?: Priority
}

