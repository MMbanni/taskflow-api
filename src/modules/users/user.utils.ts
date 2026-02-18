import { DomainError } from "../../core/errors/DomainError.js";
import { verifyExists, verifyTrue } from "../../core/utils/verifyCondition.js";
import { User } from "../../types/user.js";

export function verifyCode( user: User, code: string ) {
  const authError = new DomainError('INVALID_REQUEST', 'Invalid');
  verifyExists(user.reset, authError);

  verifyTrue(
    code === user.reset.code, authError);

  if (Date.now() >= user.reset.expiresAt.getTime()) {
    throw new DomainError('INVALID_REQUEST', 'Invalid');
  }
}
