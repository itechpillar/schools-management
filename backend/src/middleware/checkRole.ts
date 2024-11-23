import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../entities/User';
import AppDataSource from '../config/database';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: UserRole;
            };
        }
    }
}

interface JWTPayload {
    id: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export const checkRole = (roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            // Get the JWT token from the request header
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ 
                    message: 'Authentication required. Please provide a valid token.' 
                });
            }

            // Verify the token
            const decoded = jwt.verify(
                token, 
                process.env.JWT_SECRET || 'your-secret-key'
            ) as JWTPayload;
            
            // Get user from database
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ 
                where: { id: decoded.id }
            });

            if (!user) {
                return res.status(404).json({ 
                    message: 'User not found. The account may have been deleted.' 
                });
            }

            // Check if user has required role
            if (!roles.includes(user.role)) {
                return res.status(403).json({ 
                    message: `Access denied: This action requires one of the following roles: ${roles.join(', ')}` 
                });
            }

            // Add user to request object with only necessary fields
            req.user = {
                id: user.id,
                role: user.role
            };
            
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ 
                    message: 'Invalid or expired token. Please login again.' 
                });
            }
            
            console.error('Authentication error:', error);
            return res.status(500).json({ 
                message: 'An error occurred while processing your request.' 
            });
        }
    };
};
