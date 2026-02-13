import type { ErrorRequestHandler } from 'express';
import { ApiError } from '../errors/ApiError.js';
import { DomainError, DomainErrorCode } from '../errors/DomainError.js';

const statusMap: Record<DomainErrorCode, number> = {
    ACCOUNT_ALREADY_EXISTS: 409,
    AUTH_FAILURE: 401,
    NOT_FOUND: 404
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            errors: err.errors
        });
    }
    if (err instanceof DomainError) {
        const status = statusMap[err.code];

        return res.status(status).json({
            success: false,
            errors: err.errors
        });

    }
    console.error(err);

    return res.status(500).json({
        success: false,
        errors: ["Server error"]
    });

}

