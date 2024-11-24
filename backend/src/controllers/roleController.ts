import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Role } from '../entities/Role';
import { User } from '../entities/User';

const roleRepository = AppDataSource.getRepository(Role);
const userRepository = AppDataSource.getRepository(User);

export const assignRoleToUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleId } = req.body;

        // Find user and role
        const user = await userRepository.findOne({ 
            where: { id: userId },
            relations: ['roles'] // Load existing roles
        });
        const role = await roleRepository.findOne({ 
            where: { id: roleId }
        });

        if (!user || !role) {
            return res.status(404).json({ message: 'User or Role not found' });
        }

        // Add role to user's roles array
        if (!user.roles) {
            user.roles = [];
        }
        user.roles.push(role);

        // Save the user with new role
        await userRepository.save(user);

        return res.status(200).json({
            message: 'Role assigned successfully',
            user: {
                id: user.id,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (error) {
        console.error('Error assigning role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeRoleFromUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleId } = req.body;

        // Find user with roles
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['roles']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove role from user's roles array
        user.roles = user.roles.filter(role => role.id !== roleId);

        // Save the user with updated roles
        await userRepository.save(user);

        return res.status(200).json({
            message: 'Role removed successfully',
            user: {
                id: user.id,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (error) {
        console.error('Error removing role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserRoles = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Find user with roles
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['roles'],
            select: ['id', 'email', 'roles'] // Only select needed fields
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (error) {
        console.error('Error fetching user roles:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        const { roleId } = req.params;

        // Find role with users
        const role = await roleRepository.findOne({
            where: { id: roleId },
            relations: ['users'],
            select: ['id', 'name', 'users'] // Only select needed fields
        });

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        return res.status(200).json({
            role: {
                id: role.id,
                name: role.name,
                users: role.users.map(user => ({
                    id: user.id,
                    email: user.email
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching users by role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Example of checking user permissions
export const hasPermission = async (userId: string, requiredPermission: string): Promise<boolean> => {
    try {
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['roles']
        });

        if (!user || !user.roles) {
            return false;
        }

        // Check if any of the user's roles have the required permission
        return user.roles.some(role => {
            if (role.permissions) {
                // Check for super admin
                if (role.permissions.all === true) {
                    return true;
                }
                
                // Check specific permission
                // Example permission structure: { "students": { "view": true, "edit": true } }
                const [resource, action] = requiredPermission.split(':');
                return role.permissions[resource]?.[action] === true;
            }
            return false;
        });
    } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
    }
};
