import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../models/User';
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

    expect(nextFunction).toHaveBeenCalled();
    const error = nextFunction.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Authentication required');
  });

  it('should reject requests with invalid token', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    const middleware = auth();
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    const error = nextFunction.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Invalid or expired token');
  });

  it('should check role permissions', async () => {
    const user = {
      id: '123',
      role: UserRole.TEACHER,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key');
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    const middleware = auth([UserRole.SUPER_ADMIN]);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    const error = nextFunction.mock.calls[0][0];
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Insufficient permissions');
  });
});
