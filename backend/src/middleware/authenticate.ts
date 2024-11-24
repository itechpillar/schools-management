import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { AuthUser } from '../types/express';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Check if token exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError(401, 'Authentication required'));
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as AuthUser;

      if (!decoded) {
        return next(new AppError(401, 'Invalid token'));
      }

      // Add user info to request
      req.user = decoded;

      next();
    } catch (error) {
      return next(new AppError(401, 'Invalid or expired token'));
    }
  } catch (error) {
    return next(new AppError(500, 'Authentication error'));
  }
};
