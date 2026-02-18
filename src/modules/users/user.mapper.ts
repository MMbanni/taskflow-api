import { SafeUser, User, UserWithPassword, UserWithReset } from "../../types/user.js";
import { UserDoc } from "./user.schema.js";


export function mapToSafeUser(user: User): SafeUser {
  const safeUser = {
    username: user.username,
    role: user.role
  };
  return safeUser;
}

export function mapUserDocToDomain(doc: UserDoc): User {
  return {
    id: doc._id.toString(),
    email: doc.email,
    username: doc.username,
    role: doc.role
  };
}

export function mapUserDocToUserWithPassword(doc: UserDoc): UserWithPassword {
  return {
    id: doc._id.toString(),
    email: doc.email,
    username: doc.username,
    role: doc.role,
    password: doc.password
  };
}

export function mapUserDocToUserWithReset(doc: UserDoc): UserWithReset {
  return {
    id: doc._id.toString(),
    email: doc.email,
    username: doc.username,
    role: doc.role,
    ...(doc.reset !== undefined && {reset: doc.reset})
  };
}