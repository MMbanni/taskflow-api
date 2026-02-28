import * as taskRepo from '@/modules/tasks/task.repository.js';
import * as factory from '@/tests/helpers/factories.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';


import { CreateTaskRequestDTO, QueryTaskRequestDTO, UpdateTaskRequestDTO } from '@/modules/tasks/task.dto.js';
import * as taskService from '@/modules/tasks/task.service.js';


describe('createTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should call save task with input & user id, and return the task from db', async () => {
    const task = factory.makeTask();
    const userId = 'userId';

    const createTaskRequest: CreateTaskRequestDTO = {
      title: 'title',
      description: 'description',
      priority: 'medium',
      status: 'todo'
    }

    vi.spyOn(taskRepo, 'saveTask')
      .mockResolvedValue(task);

    const result = await taskService.createTask(userId, createTaskRequest);

    expect(result).toEqual(task);
    expect(taskRepo.saveTask).toHaveBeenCalledWith({userId, ...createTaskRequest});
  })
})

describe('getTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should map queries and call listTasks with mapped queries', async () => {
    const task = factory.makeTask();
    const userId = 'userId';

    const queries: QueryTaskRequestDTO = { 
      priority: 'medium',
      status: 'todo',
      page: 1,
      limit: 10
    };

    vi.spyOn(taskRepo, 'listTasks')
      .mockResolvedValue([task]);

    const result = await taskService.getTasks(userId, queries);

    expect(result).toEqual([task]);
    expect(taskRepo.listTasks).toHaveBeenCalledWith({userId, ...queries});
  })
})

describe('getTaskById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should call findTaskById and return the result if successful', async () => {
    const task = factory.makeTask();

    vi.spyOn(taskRepo, 'findTaskById')
      .mockResolvedValue(task);

    const result = await taskService.getTaskById('userId', 'taskId');

    expect(result).toEqual(task);
  })

  it('should throw if task is not found', async () => {
    vi.spyOn(taskRepo, 'findTaskById')
      .mockResolvedValue(null);

    await expect (taskService.getTaskById('userId', 'taskId')).rejects.toThrow();    
  })
})

describe('updateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should call updateTaskById and return the result if successful', async () => {
    const updates: UpdateTaskRequestDTO = {priority: 'high'};

    vi.spyOn(taskRepo, 'updateTaskById')
      .mockResolvedValue(factory.makeTaskOutput(updates));

    const result = await taskService.updateTask('userId', 'taskId', updates);
    console.log(result);
    

    expect(result).toEqual(factory.makeTaskOutput(updates));
    expect(taskRepo.updateTaskById).toHaveBeenCalledWith({userId: 'userId',taskId: 'taskId', ...updates})
  })

  it('should throw if task is not found', async () => {
    const updates: UpdateTaskRequestDTO = {priority: 'high'};
    vi.spyOn(taskRepo, 'updateTaskById')
      .mockResolvedValue(null);

    await expect (taskService.updateTask('userId', 'taskId', updates )).rejects.toThrow();    
  })
})