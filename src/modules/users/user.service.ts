import bcrypt from 'bcrypt';

import { BCRYPT_SALT_ROUNDS } from '../../config/config.js';

import { getUsers, saveUser } from './user.repository.js';

import type { RegisterBody, User, UserFilters } from "../../types/user.js";


export async function registerUser(body: RegisterBody) {
  const {email, password, username } = body

  // Hash password
  const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // Create user in db
  return saveUser({
    username,
    email,
    password: hash
  });
}
export async function adminGetUsers(query: UserFilters): Promise<User[]> {
  const { username, role } = query;

  const filter = {
    ...(username && { username }),
    ...(role && { role })
  };

  const users = await getUsers(filter);
  return users;
}
