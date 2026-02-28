import { CookieOptions } from 'express';
import { ApiErrors } from '@/core/errors/ApiError.js';
import { asyncHandler } from '@/core/utils/asyncHandler.js';
import { verifyExists, verifyTrue } from '@/core/utils/verifyCondition.js';
import { CheckResetBody, LoginBody, ResetPasswordBody, SendResetCodeBody } from '@/types/user.js';
import { checkPasswordResetCode, loginUser, refreshAccessToken, resetPassword, sendResetPasswordCode } from '@/modules/auth/auth.service.js'



const TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
};


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