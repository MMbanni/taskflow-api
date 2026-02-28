import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { config } from '@/config/config.js';
import { User } from '@/types/user.js';

export function createAccessToken(user: Pick<User, 'id' | 'role'>): string {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtAccessExpiry }
  );
}

export function generateRefreshToken() {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(
    Date.now() + ms(config.jwtRefreshExpiry)
  );

  return { token, expiresAt };
}