import type { RegisterBody, User, UserFilters, UserWithPassword, UserWithReset } from '../../types/user.js';
import { UserModel } from './user.schema.js';
import { DomainError } from '../../core/errors/DomainError.js';
import { mapUserDocToDomain, mapUserDocToUserWithPassword, mapUserDocToUserWithReset,  } from './user.mapper.js';


export async function saveUser(userInfo: RegisterBody): Promise<User> {

  try {
    const doc = await UserModel.create({
      ...userInfo,
      usernameNormalized: userInfo.username.toLowerCase()
    });
    return mapUserDocToDomain(doc);

  } catch (err: any) {
    if (err?.code === 11000) {
      throw new DomainError('ACCOUNT_ALREADY_EXISTS', parseDuplicateError(err, userInfo));
    }
    throw err;
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const doc = await UserModel.findOne({
    usernameNormalized: username.toLowerCase()
  });
  return doc ? mapUserDocToDomain(doc) : null
}

export async function getUserForAuthByUsername(username: string): Promise<UserWithPassword | null> {
  const doc = await UserModel.findOne({
    usernameNormalized: username.toLowerCase()
  });
  return doc ? mapUserDocToUserWithPassword(doc) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const doc = await UserModel.findOne({ email });
  return doc ? mapUserDocToDomain(doc) : null;
}

export async function getUserForResetByEmail(email: string): Promise<UserWithReset | null> {
  const doc = await UserModel.findOne({email
  });
  return doc ? mapUserDocToUserWithReset(doc) : null
}

export async function getUserById(id: string): Promise<User | null> {
  const doc = await UserModel.findById(id);
  return doc ? mapUserDocToDomain(doc) : null;
}

export async function getUsers(filters?: UserFilters): Promise<User[]> {
  const query = {
    ...(filters?.role !== undefined && { role: filters.role }),
    ...(filters?.email && { email: filters.email }),
    ...(filters?.username && { usernameNormalized: filters.username.toLowerCase() })
  }

  const doc = await UserModel.find(query);
  return doc.map(mapUserDocToDomain)
}


export async function saveResetPasswordCode(email: string, code: string): Promise<void> {

  await UserModel.findOneAndUpdate({ email }, {
    $set: {
      reset: {
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    }
  });
}

export async function savePassword(email: string, resetCode: string, password: string): Promise<boolean> {

  const result = await UserModel.findOneAndUpdate({
    email,
    "reset.code": resetCode,
    "reset.expiresAt": { $gt: new Date() }
  }, {
    $set: { password },
    $unset: {
      reset: ""
    }
  }
  );
  
  return !!result;
}

function parseDuplicateError(err: Error, userInfo: RegisterBody): string[] {

  const { email, username } = userInfo;

  if (err.message.includes("email")) {
    return [`${email} is already registered`];
  }
  if (err.message.includes("username")) {
    return [`Username ${username} is not available`];
  }
  return ['Duplicate key'];
}

