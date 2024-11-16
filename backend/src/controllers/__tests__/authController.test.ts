import { Request, Response } from 'express';
import { User, UserRole } from '../../models/User';
import { AuthController } from '../authController';
import { testDataSource } from '../../test/setup';

describe('Auth Controller', () => {
  let userRepository: any;

  beforeAll(() => {
    userRepository = testDataSource.getRepository(User);
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockRequest = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.register@example.com',
          password: 'password123',
          role: UserRole.TEACHER,
        },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();

      await AuthController.register(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data.user.email).toBe('john.register@example.com');
      expect(responseData.data.token).toBeDefined();
    });

    it('should not register a user with existing email', async () => {
      // Create an existing user
      const existingUser = userRepository.create({
        firstName: 'Existing',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'password123',
        role: UserRole.STUDENT,
      });
      await userRepository.save(existingUser);

      const mockRequest = {
        body: {
          firstName: 'New',
          lastName: 'User',
          email: 'existing@example.com',
          password: 'password123',
          role: UserRole.TEACHER,
        },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();

      await AuthController.register(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Email already registered');
    });
  });

  describe('login', () => {
    it('should login user successfully with correct credentials', async () => {
      // Create a user first
      const user = userRepository.create({
        firstName: 'Login',
        lastName: 'Test',
        email: 'login.test@example.com',
        password: 'password123',
        role: UserRole.TEACHER,
      });
      await userRepository.save(user);

      const mockRequest = {
        body: {
          email: 'login.test@example.com',
          password: 'password123',
        },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();

      await AuthController.login(mockRequest, mockResponse, mockNext);

      expect(mockResponse.json).toHaveBeenCalled();
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data.user.email).toBe('login.test@example.com');
      expect(responseData.data.token).toBeDefined();
    });

    it('should not login with incorrect credentials', async () => {
      const mockRequest = {
        body: {
          email: 'wrong@example.com',
          password: 'wrongpassword',
        },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();

      await AuthController.login(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Invalid email or password');
    });
  });
});
