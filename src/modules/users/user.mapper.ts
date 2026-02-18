import { SafeUser, User, UserAuth } from "../../types/user.js";
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

export function mapUserDocToUserAuth(doc: UserDoc): UserAuth {
  return {
    id: doc._id.toString(),
    email: doc.email,
    username: doc.username,
    role: doc.role,
    password: doc.password
  };
}
