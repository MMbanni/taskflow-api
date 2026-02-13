import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors/ApiError.js';
import type { AuthPayload } from '../../types/auth.js';
import { config } from '../../config/config.js';

function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): asserts req is Request & { user: AuthPayload }{

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, ['Invalid or missing token']);
  }

  const [, accessToken] = authHeader.split(' ');
  if (!accessToken){
    throw new ApiError(401, ['Unauthorized']);
  }

  try {
    const payload = jwt.verify(
      accessToken,
      config.jwtSecret
    ) as AuthPayload;

    req.user = payload;
    
    next();
  } catch (err) {
    throw new ApiError(401, ['Invalid or missing token']);
  }
}

export default requireAuth;