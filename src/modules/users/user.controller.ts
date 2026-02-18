// Types
import type { RegisterBody, UserFilters } from '../../types/user.js';

import { ApiErrors } from '../../core/errors/ApiError.js';
import { asyncHandler } from '../../core/utils/asyncHandler.js';
import { verifyTrue } from '../../core/utils/verifyCondition.js';
import { welcomeMessage } from '../../infrastructure/mail/email.service.js';
import { mapToSafeUser } from './user.mapper.js';
import { adminGetUsers, registerUser } from './user.service.js';


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


/* ========== ADMIN ========== */

export const httpAdminGetUser = asyncHandler<{}, {}, {}, UserFilters>(async (req, res) => {

  // Admin privilege check
  verifyTrue((req.user.role === 'admin'), ApiErrors.unauthorized('Access denied'));

  const safeUsers = await adminGetUsers(req.query);

  res.status(200).json({
    success: true,
    data: safeUsers
  });

})


