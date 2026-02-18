import mongoose, { HydratedDocument } from 'mongoose';
import type { RefreshToken } from '../../types/auth.js';
const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  }
});

export const RefreshTokenModel = mongoose.model<RefreshToken>('RefreshToken', refreshTokenSchema);
export type RefreshTokenDoc = HydratedDocument<RefreshToken>
