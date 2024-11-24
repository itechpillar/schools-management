import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

// Update the Request interface to support multiple roles
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
        schoolId?: string;
      };
    }
  }
}

export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      if (!user) {
        return next(new AppError(401, 'Authentication required'));
      }

      // Check if user has any of the allowed roles
      const hasPermission = user.roles.some(role => allowedRoles.includes(role));
      
      if (!hasPermission) {
        return next(new AppError(403, 'Insufficient permissions'));
      }

      // For school_admin, ensure they can only access their school's data
      if (user.roles.includes('school_admin') && !user.roles.includes('super_admin')) {
        const requestedSchoolId = req.body.schoolId || req.query.schoolId || req.params.schoolId;
        
        if (requestedSchoolId && requestedSchoolId !== user.schoolId) {
          return next(new AppError(403, 'You can only access data from your assigned school'));
        }
      }

      next();
    } catch (error) {
      return next(new AppError(500, 'Authorization error'));
    }
  };
};
