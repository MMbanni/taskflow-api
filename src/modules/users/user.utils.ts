import { DomainError } from "../../core/errors/DomainError.js";
import { verifyExists, verifyTrue } from "../../core/utils/verifyCondition.js";
import { User, UserWithReset } from "../../types/user.js";

export function verifyCode( user: UserWithReset, code: string ) {
  const authError = new DomainError('INVALID_REQUEST', 'Invalid');
  console.log('exists?');
  console.log(user);
  
  console.log(code);
  
  
  verifyExists(user.reset, authError);
  console.log('true?');
  

  verifyTrue(
    code === user.reset.code, authError);

  if (Date.now() >= user.reset.expiresAt.getTime()) {
    throw new DomainError('INVALID_REQUEST', 'Invalid');
  }
}
