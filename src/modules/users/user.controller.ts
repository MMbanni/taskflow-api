// Types
import type { CheckResetBody, LoginBody, RegisterBody, ResetPasswordBody, SendResetCodeBody, UserFilters } from '../../types/user.js';

import { asyncHandler } from '../../core/utils/asyncHandler.js';

import { welcomeMessage } from '../../infrastructure/mail/email.service.js';

import { verifyExists, verifyTrue } from '../../core/utils/verifyCondition.js';
import { mapToSafeUser } from './user.utils.js';
import type { CookieOptions } from 'express';
import { adminGetUser, checkPasswordResetCode, loginUser, refreshAccessToken, registerUser, resetPassword, sendResetPasswordCode } from './user.service.js';
import { ApiErrors } from '../../core/errors/ApiError.js';


const TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
};

export const httpRegisterUser = asyncHandler<{}, {}, RegisterBody>(async (req, res) => {

  const { username, email } = req.body;
  const user = await registerUser(req.body);

  // Map to user object without sensitive info
  const safeUser = mapToSafeUser(user);

  // Send welcome email
  welcomeMessage(username, email).catch(console.error);

  res.status(201).json({
    success: true,
    data: safeUser
  });
})


export const httpLoginUser = asyncHandler<{}, {}, LoginBody>(async (req, res) => {
  const { username, password } = req.body;
  const { safeUser, accessToken, refreshToken} = await loginUser({username, password});

  res.status(200)
    .cookie(
      'refreshToken',
      refreshToken,
      TOKEN_OPTIONS)
    .json({
      success: true,
      data: safeUser, accessToken
    });
})


export const httpRefreshAccessToken = asyncHandler(async (req, res) => {
  // Verify there is a token and it's a string
  const incommingRefreshToken = req.cookies?.refreshToken;
  verifyExists(incommingRefreshToken, ApiErrors.authError('Invalid or missing token'));
  verifyTrue(typeof incommingRefreshToken === 'string', ApiErrors.authError('Invalid token'));

  const { safeUser, accessToken, refreshToken } = await refreshAccessToken(incommingRefreshToken)

  res.status(200)
    .cookie(
      'refreshToken',
      refreshToken,
      TOKEN_OPTIONS)
    .json({
      success: true,
      data: safeUser, accessToken
    });
})

/* ========== PASSWORD RESET ========== */

// Send and save reset code
export const httpSendResetPasswordCode = asyncHandler<{}, {}, SendResetCodeBody>(async (req, res) => {

  await sendResetPasswordCode(req.body);
  
  res.status(200).json({
    success: true,
    message: ['Password reset code sent']
  });
})

// Verify password reset code
export const httpCheckPasswordResetCode = asyncHandler<{}, {}, CheckResetBody>(async (req, res) => {
  await checkPasswordResetCode(req.body);

  res.status(200).json({
    success: true,
    message: ['Please enter a new password']
  });
})


// Reset password
export const httpResetPassword = asyncHandler<{}, {}, ResetPasswordBody>(async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    success: true,
    message: ['Password reset successful']
  });
})


/* ========== ADMIN ========== */

export const httpAdminGetUser = asyncHandler<{}, {}, {}, UserFilters>(async (req, res) => {

  // Admin privilege check
  verifyTrue((req.user.role === 'admin'), ApiErrors.unauthorized('Access denied'));

  const safeUsers = await adminGetUser(req.query);

  res.status(200).json({
    success: true,
    data: safeUsers
  });

})


