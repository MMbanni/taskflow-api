const RefreshToken = require('./refreshToken.mongo');

async function createRefreshToken(userId, token, expiresAt) {
  return RefreshToken.create({ userId, token, expiresAt });
}

async function findRefreshToken(token) {
  return RefreshToken.findOne({ token });
}

async function deleteRefreshToken(token) {
  return RefreshToken.deleteOne({ token });
}

async function deleteAllUserTokens(userId) {
  return RefreshToken.deleteMany({ userId });
}

module.exports = {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllUserTokens
};
