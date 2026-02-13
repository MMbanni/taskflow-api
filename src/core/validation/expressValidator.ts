import { validationResult } from 'express-validator';
import  { ApiError } from '../errors/ApiError.js';
import type { Request, Response, NextFunction } from 'express';

function validate (req: Request, res: Response, next: NextFunction){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg);
    throw new ApiError(400, messages)
  }
  next();
};


export default validate;