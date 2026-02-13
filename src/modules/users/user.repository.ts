import type { RegisterBody, User, UserFilters } from '../../types/user.js';
import type { UserDoc } from './user.schema.js';
import { UserModel } from './user.schema.js';
import { DomainError } from '../../core/errors/DomainError.js';


export async function saveUser(userInfo: RegisterBody): Promise <UserDoc> {

  try {
    const user = await UserModel.create(userInfo);
    return user;
    
  } catch (err: any) {
    if (err?.code === 11000) {
      throw new DomainError('ACCOUNT_ALREADY_EXISTS', parseDuplicateError(err,userInfo));
    }
    throw err;
  }
}

export async function getUserByUsername(username: string) : Promise<UserDoc | null> {
  // Case insensitive
  return UserModel.findOne({
    username: { $regex: `^${username}$`, $options: 'i' }
  });
}

export async function getUserByEmail(email: string) : Promise<UserDoc | null> {

  return UserModel.findOne({ email });
}

export async function getUserById(id: string) : Promise<UserDoc | null> {

  return UserModel.findOne({ _id: id });
}

export async function getUsers(filters: UserFilters | undefined) : Promise<UserDoc[]> {

  return UserModel.find(filters);
}


export async function saveResetPasswordCode(email: string, code: string) : Promise<void> {

  await UserModel.findOneAndUpdate({ email }, {
    resetCode: code,
    resetCodeExpiresAt: new Date(Date.now() + 2 * 60 * 1000)
  });
}

export async function savePassword(email: string, password: string) : Promise<void> {

  await UserModel.findOneAndUpdate({ email }, {
    $set: { password },
    $unset: {
      resetCode: "",
      resetCodeExpiresAt: ""
    }
  }
  );
}

function parseDuplicateError(err: Error, userInfo: RegisterBody) : string[]{

  const {email, username} = userInfo;

  if (err.message.includes("email")) {
    return [`${email} is already registered`];
  }
  if (err.message.includes("username")) {
    return [`Username ${username} is not available`];
  }
  return ['Duplicate key'];
}

