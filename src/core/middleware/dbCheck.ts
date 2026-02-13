import { isDbConnected } from '../../infrastructure/database/mongo.js';
import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError.js';

export const dbCheck = ( req: Request, res: Response, next: NextFunction ) => {
  if (!isDbConnected()) {
    throw new ApiError(503, 'Service temporarily unavailable');
  }
  next();
}
