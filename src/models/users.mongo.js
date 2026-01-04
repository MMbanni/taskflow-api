const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetCode: {
    type: Number
  },
  resetCodeExpiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', usersSchema);