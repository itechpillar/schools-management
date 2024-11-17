import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../entities/User';
import { AppError } from '../utils/appError';
import AppDataSource from '../config/database';
import * as bcrypt from 'bcrypt';

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log('Registration request:', req.body);
      const userRepository = AppDataSource.getRepository(User);
      const { firstName, lastName, email, password, role } = req.body;

      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        return next(new AppError(400, 'Invalid role specified'));
      }

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !role) {
        return next(new AppError(400, 'All fields are required'));
      }

      // Check if user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return next(new AppError(400, 'Email already registered'));
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = hashedPassword;
      user.role = role;

      console.log('Saving user:', { ...user, password: '[REDACTED]' });
      const savedUser = await userRepository.save(user);
      console.log('User saved successfully:', { ...savedUser, password: '[REDACTED]' });

      // Generate JWT token
      const token = jwt.sign(
        { id: savedUser.id, role: savedUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        }
      );

      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            id: savedUser.id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            role: savedUser.role,
          },
        },
      });
    } catch (err) {
      console.error('Registration error:', err);
      next(new AppError(500, 'Error during registration: ' + (err as Error).message));
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log('Login request:', { ...req.body, password: '[REDACTED]' });
      const userRepository = AppDataSource.getRepository(User);
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new AppError(400, 'Email and password are required'));
      }

      // Find user by email
      console.log('Finding user by email:', email);
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        console.log('User not found:', email);
        return next(new AppError(401, 'Invalid email or password'));
      }

      // Check password
      //let t = await bcrypt.hash(password, 10);
      console.log('Checking password for user:', email);
      console.log('Stored hashed password:', user.password);
      console.log(`Attempting to compare with provided password ${password}`);
      console.log(`Provided password: ${password}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password comparison result:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        return next(new AppError(401, 'Invalid email or password'));
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      next(new AppError(500, 'Error during login: ' + (err as Error).message));
    }
  }
}
