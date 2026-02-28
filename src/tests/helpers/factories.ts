import { TaskOutputDTO } from "@/modules/tasks/task.dto.js";
import { RefreshToken } from "@/types/auth.js";
import { Task } from "@/types/task.js";
import { ResetPasswordBody, User, UserWithPassword, UserWithReset } from "@/types/user.js";

const mockDate = new Date('2025-01-01T00:00:00Z');


export function makeUser(overrides = {}): User {
  return {
    id: 'userId',
    username: 'username',
    email: 'email',
    role: 'user',
    ...overrides
  };
}
export function makeUserWithPassword(overrides = {}): UserWithPassword {
  return {
    id: 'userId',
    username: 'username',
    password: 'hashedPassword',
    email: 'email',
    role: 'user',
    ...overrides
  };
}
export function makeUserWithReset(overrides = {}): UserWithReset {
  return {
    id: 'userId',
    username: 'username',
    email: 'email',
    role: 'user',
    reset: {
      code: 'resetCode',
      expiresAt: new Date(Date.now() + 10000)
    },
    ...overrides
  };
}
export function makeRefreshToken(overrides = {}): RefreshToken {
  return {
    userId: 'userId',
    token: 'token',
    expiresAt: new Date(Date.now() + 10000),
    ...overrides
  };
}
export function makeResetPasswordBody(overrides = {}): ResetPasswordBody {
  return {
    email: 'email',
    resetCode: 'resetCode',
    password: 'password',
    ...overrides
  }
}

export function makeTask(overrides = {}): Task {
  return {
    id: 'taskId',
    userId: 'userId',
    title: 'title',
    description:'description',
    status: 'todo',
    priority: 'medium',
    createdAt: mockDate,
    updatedAt: mockDate,
    ...overrides
  };
}

export function makeTaskOutput(overrides = {}): TaskOutputDTO {
  return {
    id: 'taskId',
    user: {
      username: 'username',
      email: 'email'
    },
    title: 'title',
    description:'description',
    status: 'todo',
    priority: 'medium',
    createdAt: mockDate,
    updatedAt: mockDate,
    ...overrides
  };
}