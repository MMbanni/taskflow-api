import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userRepo from '@/modules/users/user.repository.js';
import * as factory from '@/tests/helpers/factories.js';
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn()
  }
}))
import bcrypt from 'bcrypt';
import { adminGetUsers, registerUser } from '@/modules/users/user.service.js';
import { BCRYPT_SALT_ROUNDS } from '@/config/config.js';

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should hash password and call saveUser using hashed password', async () => {
    const user = {
      username: 'username',
      email: 'test@test.com',
      password: '999999'
    };

    (bcrypt.hash as any).mockResolvedValue('hashedPassword');

    vi.spyOn(userRepo, 'saveUser')
      .mockResolvedValue({
        username: 'username',
        email: 'test@test.com',
        role: 'user',
        id: '123'
      });

    const result = await registerUser(user);

    expect(result).toEqual({
      username: 'username',
      email: 'test@test.com',
      role: 'user',
      id: '123'
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(user.password, BCRYPT_SALT_ROUNDS);

    expect(userRepo.saveUser)
      .toHaveBeenCalledWith({
        username: 'username',
        email: 'test@test.com',
        password: 'hashedPassword'
      });
  })
})

describe('adminGetUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should call getUsers with a username and role', async () => {
    vi.spyOn(userRepo, 'getUsers')
      .mockResolvedValue([factory.makeUser()]);

    const result = await adminGetUsers({
      username: 'username',
      role: 'user'
    });

    expect(userRepo.getUsers).toHaveBeenCalledWith({
      username: 'username',
      role: 'user'
    });
  })

  it('should call getUsers with a username', async () => {
    vi.spyOn(userRepo, 'getUsers')
      .mockResolvedValue([factory.makeUser()]);

    const result = await adminGetUsers({
      username: 'username'
    });

    expect(userRepo.getUsers).toHaveBeenCalledWith({
      username: 'username'
    });
  })

  it('should call getUsers with a username and role', async () => {
    vi.spyOn(userRepo, 'getUsers')
      .mockResolvedValue([factory.makeUser()]);

    const result = await adminGetUsers({
      role: 'user'
    });

    expect(userRepo.getUsers).toHaveBeenCalledWith({
      role: 'user'
    });
  })
})
