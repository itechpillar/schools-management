import { Router } from 'express';
import { Request, Response } from 'express';
import { User, UserRole } from '../entities/User';
import AppDataSource from '../config/database';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { validate } from 'class-validator';
import { handleError, AppError } from '../utils/errorHandler';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError(409, 'Email already exists');
        }

        if (!Object.values(UserRole).includes(role)) {
            throw new AppError(400, 'Invalid role');
        }

        const hashedPassword = await hash(password, 10);
        const user = userRepository.create({
            email,
            password: hashedPassword,
            role
        });

        const validationErrors = await validate(user);
        if (validationErrors.length > 0) {
            throw validationErrors;
        }

        const savedUser = await userRepository.save(user);
        const { password: _, ...userWithoutPassword } = savedUser;

        return res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new AppError(401, 'Invalid credentials');
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid credentials');
        }

        const token = sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        return res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        return handleError(error, res);
    }
});

export default router;
