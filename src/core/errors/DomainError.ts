/**
 * Since types don't exist at runtime, we define a whitelist of
 * allowed values and derive the union type from it, keeping
 * runtime validation and compile-time typing in sync.
 */
const DOMAIN_ERROR_CODES = ['ACCOUNT_ALREADY_EXISTS', 'AUTH_FAILURE', 'NOT_FOUND'] as const; // without as const typeof == string[]
export type DomainErrorCode = typeof DOMAIN_ERROR_CODES[number];

export class DomainError extends Error {

  name = 'DomainError';
  errors: string[];
  code: DomainErrorCode;
  constructor(code: DomainErrorCode, errors: string | string[]) {
    super(Array.isArray(errors) ? errors[0] : errors);
    this.code = code;
    this.errors = Array.isArray(errors) ? errors : [errors];
    Error.captureStackTrace(this, this.constructor)
  }
}

export const DomainErrors = {
  notFound: (message: string) =>
    new DomainError('NOT_FOUND', message),

  authFailure: (message: string) =>
    new DomainError('AUTH_FAILURE', message),

  duplicate: (message: string) =>
    new DomainError('ACCOUNT_ALREADY_EXISTS', message),
};