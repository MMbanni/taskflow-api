import mongoose from'mongoose';
import type { HydratedDocument } from'mongoose';
import type { User } from '../../types/user.js';
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

export type UserDoc = HydratedDocument<User>;
export const UserModel = mongoose.model<UserDoc>('User', usersSchema);
 