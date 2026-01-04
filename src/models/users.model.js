const Users = require('./users.mongo');

async function createUser(userInfo) {

  const user = await Users.create(userInfo);
  return user;
}

async function getUserByUsername(username) {
  // Case insensitive
  return await Users.findOne({
    username: { $regex: `^${username}$`, $options: 'i' }
  });
}

async function getUserByEmail(email) {

  return await Users.findOne({ email });
}

async function getUserById(id) {

  return await Users.findOne(id);
}

async function getUsers(filter = {}) {

  return await Users.find(filter);
}


async function saveResetPasswordCode(email, code) {

  await Users.findOneAndUpdate({ email }, {
    resetCode: code,
    resetCodeExpiresAt: new Date(Date.now() + 2 * 60 * 1000)
  });
}

async function resetPassword(email, password) {

  await Users.findOneAndUpdate({ email }, {
    $set: { password },
    $unset: {
      resetCode: "",
      resetCodeExpiresAt: ""
    }
  }
  );
}

module.exports = {
  createUser,
  getUsers,
  getUserByUsername,
  getUserByEmail,
  getUserById, saveResetPasswordCode,
  resetPassword
};