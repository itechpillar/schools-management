import { Response } from 'express';

export const handleError = (error: unknown, res: Response, defaultMessage: string) => {
  console.error(defaultMessage, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  return res.status(500).json({
    status: 'error',
    message: defaultMessage,
    error: errorMessage
  });
};
