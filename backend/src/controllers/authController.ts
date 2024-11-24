import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AppError } from '../utils/appError';
import AppDataSource from '../config/database';
import * as bcrypt from 'bcrypt';
import { Role } from '../entities/Role';
import { School } from '../entities/School';

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const schoolRepository = AppDataSource.getRepository(School);

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log('Registration request:', req.body);
      const { firstName, lastName, email, password, role: selectedRole, schoolId } = req.body;

      // Check if user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return next(new AppError(400, 'Email already registered'));
      }

      // Find the appropriate role
      const role = await roleRepository.findOne({ 
        where: { name: selectedRole.toLowerCase() }
      });

      if (!role) {
        return next(new AppError(400, 'Invalid role selected'));
      }

      // If not super_admin, verify school exists
      let school = null;
      if (selectedRole !== 'super_admin' && schoolId) {
        school = await schoolRepository.findOne({ where: { id: schoolId } });
        if (!school) {
          return next(new AppError(400, 'Invalid school selected'));
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.username = email; // Set username to email by default
      user.password = hashedPassword;
      user.roles = [role];
      
      // Set school if provided and role is not super_admin
      if (school) {
        user.schoolId = school.id;
        user.school = school;
      }

      console.log('Saving user:', { ...user, password: '[REDACTED]' });
      const savedUser = await userRepository.save(user);
      console.log('User saved successfully:', { ...savedUser, password: '[REDACTED]' });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: savedUser.id,
          email: savedUser.email,
          roles: [role.name],
          schoolId: savedUser.schoolId
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
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
            roles: [role],
            schoolId: savedUser.schoolId
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
      const { email, password } = req.body;

      // Find user with roles and school
      const user = await userRepository.findOne({
        where: { email },
        relations: ['roles', 'school']
      });

      if (!user) {
        return next(new AppError(401, 'Invalid email or password'));
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new AppError(401, 'Invalid email or password'));
      }

      // Generate token with roles and school
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          roles: user.roles.map(role => role.name),
          schoolId: user.schoolId
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
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
            roles: user.roles,
            schoolId: user.schoolId,
            school: user.school
          },
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      return next(new AppError(500, 'Internal server error'));
    }
  }
}
