import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';
const usersSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  usernameNormalized: {
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
  reset: {
    code: String,
    expiresAt: Date
  },
}, {
  timestamps: true
});


type ResetInfo = {
  code: string;
  expiresAt: Date
}

export interface UserDb {
  id: string;
  username: string;
  usernameNormalized: string;
  password: string;
  email: string;
  role: string;
  reset?: ResetInfo
}

export const UserModel = mongoose.model<UserDb>('User', usersSchema);
export type UserDoc = HydratedDocument<UserDb>;
