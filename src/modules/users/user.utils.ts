import { DomainError } from "../../core/errors/DomainError.js";
import { verifyExists, verifyTrue } from "../../core/utils/verifyCondition.js";
import type { SafeUser } from "../../types/user.js";
import type { UserDoc } from "./user.schema.js";

export function mapToSafeUser(user: UserDoc): SafeUser {
  const safeUser = {
    username: user.username,
    role: user.role
  };
  return safeUser;
}

export function verifyCode( user: UserDoc, code: string ) {
  const authError = new DomainError('AUTH_FAILURE', 'Incorrect code');
  verifyExists(user.reset, authError);

  verifyTrue(
    Number(code) === user.reset.code, authError);

  if (Date.now() >= user.reset.expiresAt.getTime()) {
    throw new DomainError('AUTH_FAILURE', 'Reset code expired');
  }
}
