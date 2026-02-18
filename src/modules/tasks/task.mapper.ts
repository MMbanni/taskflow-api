import type {
  CreateTaskInputDTO,
  CreateTaskRequestDTO,
  QueryTaskInputDTO,
  QueryTaskRequestDTO,
  TaskOutputDTO,
  UpdateTaskInputDTO,
  UpdateTaskRequestDTO
} from "./task.dto.js";

import type { PopulatedTaskDoc } from "../../types/task.js";
import type { TaskDoc } from "./task.schema.js";

export function mapToCreateTaskInput(
  userId: string,
  body: CreateTaskRequestDTO,
): CreateTaskInputDTO {

  return {
    userId,
    title: body.title.trim(),

    ...body.description!==undefined&& {
      description:body.description
    },

    status: body.status ?? "todo",
    priority: body.priority ?? "medium"
  };
}

export function mapToQueryTaskInput(
  userId: string,
  query: QueryTaskRequestDTO
): QueryTaskInputDTO {

  return {
    userId,

    ...(query.status !== undefined && {
      status: query.status
    }),

    ...(query.priority !== undefined && {
      priority: query.priority
    }),
    page: query.page ?? 1,
    limit: query.limit ?? 10
  }
}

export function mapToUpdateTaskInput(  
  userId: string,
  taskId: string,
  body: UpdateTaskRequestDTO
): UpdateTaskInputDTO {

  return {
    userId,
    taskId,

    ...(body.title !== undefined && {
       title: body.title 
    }),
    ...(body.description !== undefined && {
      description: body.description
    }),

    ...(body.status !== undefined && {
      status: body.status
    }),

    ...(body.priority !== undefined && {
      priority: body.priority
    })
  }
}

export function mapToTaskOutput(task: TaskDoc): TaskOutputDTO {
  return {
    id: task._id.toString(),
    title: task.title,
    

    ...(task.description !== undefined && {
      description: task.description
    }),

    status: task.status,
    priority: task.priority,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function mapToPopulatedTaskOutput(task: PopulatedTaskDoc): TaskOutputDTO {
  return {
    id: task._id.toString(),
    title: task.title,
    user: {
      username: task.userId.username,
      email: task.userId.email
    },

    ...(task.description !== undefined && {
      description: task.description
    }),

    status: task.status,
    priority: task.priority,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}