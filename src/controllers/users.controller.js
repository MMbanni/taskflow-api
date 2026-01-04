const bcrypt = require('bcrypt');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const {
  resetPasswordMessage,
  welcomeMessage,
} = require('../services/email.service');

const {
  createUser,
  getUsers,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  saveResetPasswordCode,
  resetPassword,
} = require('../models/users.model');

const {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllUserTokens
} = require('../models/refreshToken.model');

const asyncHandler = require('../utils/asyncHandler');

// Register
async function httpCreateUser(req, res) {

  const { username, password } = req.body;
  const email = req.body.email.toLowerCase(); // Normalize for db search
  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await createUser({
      username,
      email,
      password: hash
    });

    const safeUser = getSafeUser(user); // User object without sensitive info

    await welcomeMessage(username, email);

    return res.status(201).json({ success: true, data: safeUser })
  }
  catch (err) {
    if (err.message.includes("duplicate")) {
      const conflictErrors = parseDuplicateError(err, username, email);

      return res.status(409).json({
        success: false,
        errors: conflictErrors
      });
    } else {
      return res.status(500).json({
        success: false,
        errors: ['Server error']
      });
    }


  }
}

// Login
const httpLogin = asyncHandler(async (req, res) => {

  const { username, password } = req.body;

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(404).send({
      success: false,
      errors: ['User does not exist']
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send({
      success: false,
      errors: ['Wrong password']
    });
  }

  const safeUser = getSafeUser(user);

  // Issue new access and refresh tokens
  const accessToken = createAccessToken(user);
  const refreshToken = await issueRefreshToken(res, user);

  return res.status(200).send({
    success: true,
    data: safeUser, accessToken
  });

})

const httpRefreshAccessToken = asyncHandler(async (req, res) => {

  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(401).json({
      success: false,
      errors: ['Invalid headers']
    });
  }
  const refreshToken = cookies
    .split('; ')
    .find(c => c.startsWith('refreshToken='))
    ?.split('=')[1];

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      errors: ['Invalid or missing token']
    });
  }

  // Search db for token
  const tokenLookup = await findRefreshToken(refreshToken);
  if (!tokenLookup) {
    return res.status(401).json({
      success: false,
      errors: ['Invalid or missing token']
    });
  }
  // Expire session & delete token
  if (tokenLookup.expiresAt.getTime() < new Date()) {
    await deleteRefreshToken(refreshToken);
    return res.status(401).json({
      success: false,
      errors: ['Session expired']
    });
  }

  const user = await getUserById(tokenLookup.userId);
  const safeUser = getSafeUser(user);

  // Delete refresh token after use, issue new refresh and access tokens
  await deleteRefreshToken(refreshToken);
  const accessToken = createAccessToken(user);
  const newRefreshToken = await issueRefreshToken(res, user);

  return res.status(200).send({
    success: true,
    data: safeUser, accessToken
  });

})

/* -------------------- Password Reset -------------------- */


// Send and save reset code
const httpSendResetPasswordCode = asyncHandler(async (req, res) => {

  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();

  const resetCode = generateCode();

  const user = await getUserByEmail(normalizedEmail);
  if (!user) {
    return res.status(404).json({
      success: false,
      errors: ['User not found']
    });
  }

  // Send email with reset code, save reset code in db
  await resetPasswordMessage(normalizedEmail, resetCode);
  await saveResetPasswordCode(normalizedEmail, resetCode);

  return res.status(200).json({
    success: true,
    message: ['Password reset code sent']
  });
})

// Verify password reset code
const httpCheckPasswordResetCode = asyncHandler(async (req, res) => {

  const { email, resetCode } = req.body;
  const normalizedEmail = email.toLowerCase();

  const userInfo = await getUserByEmail(normalizedEmail);
  if (!(Number(resetCode) === userInfo.resetCode)) {
    return res.status(401).json({
      success: false,
      errors: ['Incorrect code']
    });
  }
  if (Date.now() > userInfo.resetCodeExpiresAt.getTime()) {
    return res.status(400).json({
      success: false,
      errors: ['Reset code expired']
    });
  }

  return res.status(200).json({ success: true, message: ['Please enter a new password'] });
})

// Reset password
const httpResetPassword = asyncHandler(async (req, res) => {

  const { email, resetCode, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const userInfo = await getUserByEmail(normalizedEmail);


  if (!(Number(resetCode) === userInfo.resetCode)) {
    return res.status(401).json({
      success: false,
      errors: ['Incorrect code']
    });
  }
  if (Date.now() > userInfo.resetCodeExpiresAt.getTime()) {
    return res.status(400).json({
      success: false,
      errors: ['Reset code expired']
    });
  }

  const hash = await bcrypt.hash(password, 10);
  await resetPassword(normalizedEmail, hash);

  const userId = userInfo.id;
  await deleteAllUserTokens(userId);

  return res.status(200).json({
    success: true,
    message: ['Password reset successful']
  });

})


// Admin only
const httpAdminGetUser = asyncHandler(async (req, res) => {

  // Admin privilege check
  if (!(req.user.role === "admin")) {
    return res.status(400).json({
      success: false,
      errors: ['Access denied']
    });
  }

  const filter = {};
  if (req.query.username) filter.username = req.query.username;
  if (req.query.role) filter.role = req.query.role;

  const users = await getUsers(filter);

  // Remove sensitive info
  const safeUsers = users.map(u => ({
    username: u.username,
    role: u.role
  }));

  return res.status(200).json({
    success: true,
    data: safeUsers
  });

})

/* -------------------- Helper functions -------------------- */

// Random 6 digit code
function generateCode() {
  codeArray = [];
  for (let i = 0; i < 6; i++) {
    let randomNumber = Math.floor(Math.random() * 10);
    codeArray.push(randomNumber);
  }

  const code = codeArray.join('');
  return code;
}

function getSafeUser(user) {
  const safeUser = {
    username: user.username,
    email: user.email
  };
  return safeUser;
}

function createAccessToken(user) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '100m' }

  );
  return accessToken;
}

// Parse duplicate email/username
function parseDuplicateError(err, username, email) {
  const errors = []

  if (err.message.includes("email")) {
    errors.push(`${email} is already registered`);
  }
  if (err.message.includes("username")) {
    errors.push(`Username ${username} is not available`);
  }

  return errors;

}

const issueRefreshToken = asyncHandler(async (res, user) => {

  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await createRefreshToken(user.id, refreshToken, expiresAt);

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 })
  return refreshToken;
})



module.exports = {
  httpCreateUser,
  httpSendResetPasswordCode,
  httpCheckPasswordResetCode,
  httpResetPassword,
  httpAdminGetUser,
  httpLogin,
  httpRefreshAccessToken
}