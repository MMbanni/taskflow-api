// src/modules/tasks/task.dto.ts

import type mongoose from "mongoose";
import type { Status, Priority, PopulatedUser } from "../../types/task.js";
import type { UserDoc } from "../users/user.schema.js";

/* ========== REQUEST DTOs ========== */

export interface CreateTaskRequestDTO {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
}

export interface UpdateTaskRequestDTO {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
}
export interface QueryTaskRequestDTO {
  status?: Status;
  priority?: Priority;
  page?: number;
  limit?: number;
  sort?: string;
}


/* ========== SERVICE INPUT DTOs ========== */

export interface CreateTaskInputDTO {
  userId: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
}

export interface QueryTaskInputDTO {
  userId: string;
  status?: Status;
  priority?: Priority;
  page: number;
  limit: number;
  sort?: 'asc' | 'desc' ;
}

export interface UpdateTaskInputDTO {
  userId: string;
  taskId: string;
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
}

/* ========== RESPONSE DTOs ========== */

export type TaskOutputDTO = {
  id: string;
  title: string;
  user?: PopulatedUser;
  description?: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
};
