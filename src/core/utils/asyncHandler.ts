import type { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler<P = any, ResBody = any, ReqBody = any, ReqQuery = any>(fn: (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
}
