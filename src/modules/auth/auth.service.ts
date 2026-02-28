import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { DomainErrors } from '@/core/errors/DomainError.js';
import { verifyExists, verifyTrue } from '@/core/utils/verifyCondition.js';
import { AuthResult } from '@/types/auth.js';
import { CheckResetBody, LoginBody, ResetPasswordBody, SendResetCodeBody } from '@/types/user.js';
import { mapToSafeUser } from '@/modules/users/user.mapper.js';
import { getUserByEmail, getUserById, getUserForAuthByUsername, getUserForResetByEmail, savePassword, saveResetPasswordCode } from '@/modules/users/user.repository.js';
import { deleteAllUserTokens, deleteRefreshToken, findRefreshToken, saveRefreshToken } from '@/modules/auth/refreshToken.repository.js';
import { createAccessToken, generateRefreshToken } from '@/modules/auth/token.service.js';
import { BCRYPT_SALT_ROUNDS } from '@/config/config.js';
import { sendResetPasswordMessage } from '@/infrastructure/mail/email.service.js';
import { verifyCode } from '@/modules/users/user.utils.js';

export async function loginUser(body: LoginBody): Promise<AuthResult> {
  const { username, password } = body;
  
  // Verify login information
  const user = await getUserForAuthByUsername(username);
  verifyExists(user, DomainErrors.authFailure('Incorrect username or password'));

  const match = await bcrypt.compare(password, user.password);
  verifyTrue(match, DomainErrors.authFailure('Incorrect username or password'));

  // Issue new access and refresh tokens
  const accessToken = createAccessToken(user);
  const refreshToken = generateRefreshToken();

  // Save refresh token to db
  await saveRefreshToken(user.id, refreshToken);

  const safeUser = mapToSafeUser(user);

  return {
    safeUser,
    refreshToken: refreshToken.token,
    accessToken
  }
}

export async function refreshAccessToken(incommingRefreshToken: string): Promise<AuthResult> {
  // Search db for token
  const tokenLookup = await findRefreshToken(incommingRefreshToken);
  verifyExists(tokenLookup, DomainErrors.authFailure('Invalid or missing token'));

  // End session & delete token if expired
  if (Date.now() >= tokenLookup.expiresAt.getTime()) {
    await deleteRefreshToken(incommingRefreshToken);
    throw DomainErrors.authFailure('Session expired');
  }

  const user = await getUserById(tokenLookup.userId);
  verifyExists(user, DomainErrors.authFailure('Invalid or missing token'));

  // Delete refresh token after use, issue new refresh and access tokens
  await deleteRefreshToken(incommingRefreshToken);
  const accessToken = createAccessToken(user);
  const newRefreshToken = generateRefreshToken();
  await saveRefreshToken(user.id, newRefreshToken);

  const safeUser = mapToSafeUser(user);
  return {
    safeUser,
    refreshToken: newRefreshToken.token,
    accessToken
  }
}

export async function revokeAllSessions(userId: string) {
  await deleteAllUserTokens(userId);
}


export async function sendResetPasswordCode(body: SendResetCodeBody): Promise<void> {
  const resetCode = generateCode()

  const user = await getUserByEmail(body.email);  

  // Send email with reset code, save reset code in db
  if(user) {
    await saveResetPasswordCode(body.email, resetCode);
    await sendResetPasswordMessage(body.email, resetCode);
  }  
}

export async function checkPasswordResetCode(body: CheckResetBody): Promise<void> {
  const { email, resetCode } = body;

  const userInfo = await getUserForResetByEmail(email);
  verifyExists(userInfo, DomainErrors.invalid('Invalid'));

  // Verify code is correct and not expired
  verifyCode(userInfo, resetCode);
}

export async function resetPassword(body: ResetPasswordBody): Promise<void> {
  const { email, resetCode, password } = body;
  
  // Hash and reset password
  const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const success = await savePassword(email, resetCode, hash);

  verifyTrue(success, DomainErrors.invalid('Invalid'));

  const user = await getUserByEmail(email);
  if (user) {
    await revokeAllSessions(user.id);
  }
}

// Random 6 digit code
function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

