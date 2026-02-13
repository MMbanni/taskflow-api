const API_ERROR_CODE = [400, 401, 403, 404, 409, 500, 503] as const;
export type ApiErrorCode = typeof API_ERROR_CODE[number];

export class ApiError extends Error {

  name = 'ApiError';
  statusCode: ApiErrorCode;
  errors: string[];

  constructor(statusCode: ApiErrorCode, errors: string | string[]) {
    super( Array.isArray(errors)? errors[0] : errors );

    this.statusCode = statusCode;
    this.errors = Array.isArray(errors)?errors : [errors];

    Error.captureStackTrace(this, this.constructor)
  }
}

export const ApiErrors = {
  invalidInput: (message: string) => 
    new ApiError (400, message),

  authError: (message:string) =>
    new ApiError (401, message),

  unauthorized: (message:string) =>
    new ApiError (403, message),
}