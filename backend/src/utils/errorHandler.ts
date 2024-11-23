import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (error: any, res: Response): Response => {
    console.error('Error details:', error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
            details: error.details
        });
    }

    if (error instanceof EntityNotFoundError) {
        return res.status(404).json({
            status: 'error',
            message: 'Resource not found',
            details: error.message
        });
    }

    if (error instanceof QueryFailedError) {
        return res.status(400).json({
            status: 'error',
            message: 'Database operation failed',
            details: {
                code: (error as any).code,
                detail: (error as any).detail,
                constraint: (error as any).constraint
            }
        });
    }

    if (Array.isArray(error) && error[0] instanceof ValidationError) {
        const validationErrors = error.map((err: ValidationError) => ({
            property: err.property,
            constraints: err.constraints,
            value: err.value
        }));

        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            details: validationErrors
        });
    }

    // Default error
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        details: error.message
    });
};
