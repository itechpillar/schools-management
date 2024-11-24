import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { AuthUser } from '../types/express';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as AuthUser;

      if (!user) {
        return next(new AppError(401, 'Authentication required'));
      }

      if (!allowedRoles.some(role => user.roles.includes(role))) {
        return next(new AppError(403, 'Access denied'));
      }

      next();
    } catch (error) {
      return next(new AppError(500, 'Authorization error'));
    }
  };
};
