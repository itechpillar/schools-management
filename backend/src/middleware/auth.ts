import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';
import { AppError } from '../utils/appError';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export const auth = (allowedRoles?: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
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
        ) as {
          id: string;
          role: UserRole;
        };

        // Add user info to request
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };

        // Check role permissions if roles are specified
        if (allowedRoles && !allowedRoles.includes(decoded.role)) {
          return next(new AppError(403, 'Insufficient permissions'));
        }

        next();
      } catch (error) {
        return next(new AppError(401, 'Invalid or expired token'));
      }
    } catch (error) {
      next(error);
    }
  };
};
