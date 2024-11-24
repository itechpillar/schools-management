import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { School } from '../entities/School';
import { AppError } from '../utils/appError';
import AppDataSource from '../config/database';

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const schoolRepository = AppDataSource.getRepository(School);

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, password, roles, schoolId } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !roles || !Array.isArray(roles)) {
        return next(new AppError(400, 'Please provide all required fields'));
      }

      // Check if user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return next(new AppError(400, 'Email already registered'));
      }

      // Verify school exists if schoolId is provided
      let school = null;
      if (schoolId) {
        school = await schoolRepository.findOne({ where: { id: schoolId } });
        if (!school) {
          return next(new AppError(400, 'Invalid school selected'));
        }
      }

      // Find all requested roles
      const userRoles = await Promise.all(
        roles.map(async (roleName: string) => {
          const role = await roleRepository.findOne({
            where: { name: roleName.toLowerCase() }
          });
          if (!role) {
            throw new AppError(400, `Invalid role: ${roleName}`);
          }
          return role;
        })
      );

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = userRepository.create({
        firstName,
        lastName,
        email,
        username: email, // Using email as username
        password: hashedPassword,
        schoolId: school?.id || null
      });

      // Save user and assign roles
      await userRepository.save(user);
      
      // Assign roles to user
      user.roles = userRoles;
      await userRepository.save(user);

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: userRoles.map(role => role.name),
            schoolId: user.schoolId
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schoolId } = req.query;

      const queryBuilder = userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('user.school', 'school');

      // Filter by school if schoolId is provided
      if (schoolId) {
        queryBuilder.where('user.schoolId = :schoolId', { schoolId });
      }

      const users = await queryBuilder.getMany();

      res.status(200).json({
        status: 'success',
        data: users.map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles.map(role => role.name),
          schoolId: user.schoolId
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, roles, schoolId } = req.body;

      const user = await userRepository.findOne({
        where: { id },
        relations: ['roles']
      });

      if (!user) {
        return next(new AppError(404, 'User not found'));
      }

      // Update user fields if provided
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;

      // Update school if provided
      if (schoolId) {
        const school = await schoolRepository.findOne({ where: { id: schoolId } });
        if (!school) {
          return next(new AppError(400, 'Invalid school selected'));
        }
        user.schoolId = schoolId;
      }

      // Update roles if provided
      if (roles && Array.isArray(roles)) {
        const userRoles = await Promise.all(
          roles.map(async (roleName: string) => {
            const role = await roleRepository.findOne({
              where: { name: roleName.toLowerCase() }
            });
            if (!role) {
              throw new AppError(400, `Invalid role: ${roleName}`);
            }
            return role;
          })
        );
        user.roles = userRoles;
      }

      await userRepository.save(user);

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: user.roles.map(role => role.name),
            schoolId: user.schoolId
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({ where: { id } });
      if (!user) {
        return next(new AppError(404, 'User not found'));
      }

      await userRepository.remove(user);

      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
