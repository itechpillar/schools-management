import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  schoolId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
