import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../entities/User';
import { auth } from '../auth';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should authenticate valid JWT token', async () => {
    const user = {
      id: '123',
      role: UserRole.TEACHER,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key');
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    const middleware = auth();
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user?.id).toBe('123');
    expect(mockRequest.user?.role).toBe(UserRole.TEACHER);
  });

  it('should reject requests without token', async () => {
    mockRequest.headers = {};

    const middleware = auth();
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Authentication required',
    });
  });

  it('should reject invalid tokens', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid.token.here',
    };

    const middleware = auth();
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    });
  });

  it('should reject requests with insufficient role', async () => {
    const user = {
      id: '123',
      role: UserRole.STUDENT,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key');
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    const middleware = auth([UserRole.TEACHER]);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Insufficient permissions',
    });
  });
});
