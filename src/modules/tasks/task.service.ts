import { DomainErrors } from "../../core/errors/DomainError.js";
import { verifyExists } from "../../core/utils/verifyCondition.js";
import type { CreateTaskRequestDTO, QueryTaskRequestDTO, TaskOutputDTO, UpdateTaskRequestDTO } from "./task.dto.js";
import { mapToCreateTaskInput, mapToPopulatedTaskOutput, mapToQueryTaskInput, mapToTaskOutput, mapToUpdateTaskInput } from "./task.mapper.js";
import { deleteTaskById, findTaskById, listTasks, saveTask, updateTaskById } from "./task.repository.js";


// Create task
export async function createTask(
  userId: string,
  incomingRequest: CreateTaskRequestDTO
): Promise<TaskOutputDTO> {  

  const task = mapToCreateTaskInput(userId, incomingRequest);
  const createdTask = await saveTask(task);
  
  return mapToTaskOutput(createdTask); 
}

export async function getTasks(
  userId: string,
  incomingRequest: QueryTaskRequestDTO
): Promise<TaskOutputDTO[]> {

  const queries = mapToQueryTaskInput(userId, incomingRequest);  
  
  const tasks = await listTasks(queries);

  return tasks.map(mapToPopulatedTaskOutput);
}

export async function getTaskById(
  userId: string,
  incomingRequest: string
): Promise<TaskOutputDTO> {  
  
  const task = await findTaskById( userId, incomingRequest );
  verifyExists(task, DomainErrors.notFound('Task not found'));

  return mapToPopulatedTaskOutput(task);
}

export async function updateTask(
  userId: string,
  taskId: string,
  incomingRequest: UpdateTaskRequestDTO
): Promise<TaskOutputDTO> { 

  const updates = mapToUpdateTaskInput( userId, taskId, incomingRequest);
  
  const updatedTask = await updateTaskById(updates);
  verifyExists(updatedTask, DomainErrors.notFound('Task not found'));

  return mapToTaskOutput(updatedTask);
}

export async function deleteTask(userId: string, taskId: string) {
  const deletedTask = await deleteTaskById(userId, taskId);

  verifyExists(deletedTask, DomainErrors.notFound('Task not found'));
}
