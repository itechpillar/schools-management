import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface User extends JwtPayload {
      id: string;
      email: string;
      roles: string[];
      schoolId?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

// This export is needed to make this a module
export {};
