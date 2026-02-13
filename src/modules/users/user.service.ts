import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { getUserByEmail, getUserById, getUserByUsername, getUsers, saveResetPasswordCode, savePassword, saveUser } from './user.repository.js';
import { createAccessToken, generateRefreshToken } from '../auth/token.service.js';
import { deleteAllUserTokens, deleteRefreshToken, findRefreshToken, saveRefreshToken } from '../auth/refreshToken.repository.js';
import { mapToSafeUser, verifyCode } from './user.utils.js';

import type { CheckResetBody, LoginBody, RegisterBody, ResetPasswordBody, SendResetCodeBody, UserFilters } from "../../types/user.js";
import type { AuthResult } from '../../types/auth.js';

import { verifyExists, verifyTrue } from '../../core/utils/verifyCondition.js';
import { sendResetPasswordMessage } from '../../infrastructure/mail/email.service.js';
import { DomainError, DomainErrors } from '../../core/errors/DomainError.js';



export async function registerUser(body: RegisterBody) {

  // Normalize for db search
  const normalizedEmail = body.email.toLowerCase();

  // Hash password
  const hash = await bcrypt.hash(body.password, 10);

  // Create user in db
  return saveUser({
    username: body.username,
    email: normalizedEmail,
    password: hash
  });
}

export async function loginUser(body: LoginBody): Promise<AuthResult> {

  const { username, password } = body;
  // Verify login information
  const user = await getUserByUsername(username);
  verifyExists(user, DomainErrors.notFound('User not found'));

  const match = await bcrypt.compare(password, user.password);
  verifyTrue(match, DomainErrors.authFailure('Incorrect password'));

  // Issue new access and refresh tokens
  const accessToken = createAccessToken(user);
  const refreshToken = generateRefreshToken();

  // Save refresh token to db
  await saveRefreshToken(user._id.toString(), refreshToken);

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
    throw new DomainError('AUTH_FAILURE','Session expired');
  }

  const user = await getUserById(tokenLookup.userId.toString());
  verifyExists(user, DomainErrors.authFailure('Invalid token'));

  // Delete refresh token after use, issue new refresh and access tokens
  await deleteRefreshToken(incommingRefreshToken);
  const accessToken = createAccessToken(user);
  const newRefreshToken = generateRefreshToken();
  await saveRefreshToken(user._id.toString(), newRefreshToken);

  const safeUser = mapToSafeUser(user);
  return {
    safeUser,
    refreshToken: newRefreshToken.token,
    accessToken
  }
}

export async function sendResetPasswordCode(body: SendResetCodeBody) {

  const { email } = body;
  const normalizedEmail = email.toLowerCase();

  const resetCode = generateCode()

  const user = await getUserByEmail(normalizedEmail);
  verifyExists(user, DomainErrors.notFound('User not found'));

  // Send email with reset code, save reset code in db
  await saveResetPasswordCode(normalizedEmail, resetCode);
  await sendResetPasswordMessage(normalizedEmail, resetCode);
}

export async function checkPasswordResetCode(body: CheckResetBody): Promise<void> {

  const { email, resetCode } = body;
  const normalizedEmail = email.toLowerCase();

  // Verify user exist
  const userInfo = await getUserByEmail(normalizedEmail);
  verifyExists(userInfo, DomainErrors.notFound('User not found'));

  // Verify code is correct and not expired
  verifyCode(userInfo, resetCode);
}


export async function resetPassword(body: ResetPasswordBody): Promise<void> {

  const { email, resetCode, password } = body;
  const normalizedEmail = email.toLowerCase();

  const userInfo = await getUserByEmail(normalizedEmail);
  verifyExists(userInfo, DomainErrors.notFound('User not found'));
  verifyCode(userInfo, resetCode);

  // Hash and reset password
  const hash = await bcrypt.hash(password, 10);
  await savePassword(normalizedEmail, hash);

  const userId = userInfo._id.toString();
  await deleteAllUserTokens(userId);
}

export async function adminGetUser(query: UserFilters) {

  const { username, role } = query;

  const filter = {
    ...(username && { username }),
    ...(role && { role })
  };

  const users = await getUsers(filter);

  const safeUsers = users.map(u => ({
    username: u.username,
    role: u.role
  }));

  return safeUsers;
}

// Random 6 digit code
function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

