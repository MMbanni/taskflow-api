import type { RefreshToken } from '../../types/auth.js';
import { RefreshTokenModel } from './refreshToken.schema.js';
import type { RefreshTokenDoc } from './refreshToken.schema.js';


export async function saveRefreshToken(userId: string, refreshToken: Pick<RefreshToken, 'token' | 'expiresAt'>) : Promise<RefreshToken> {
  const {token, expiresAt} = refreshToken;
  return RefreshTokenModel.create({ userId, token, expiresAt });
}

export async function findRefreshToken(token: string) : Promise<RefreshTokenDoc | null> {
  return RefreshTokenModel.findOne({ token });
}

export async function deleteRefreshToken(token: string) : Promise<void> {
  await RefreshTokenModel.deleteOne({ token });
}

export async function deleteAllUserTokens(userId: string) {
  return RefreshTokenModel.deleteMany({ userId });
}

