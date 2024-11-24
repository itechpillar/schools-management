import express from 'express';
import { assignRoleToUser, removeRoleFromUser, getUserRoles, getUsersByRole } from '../controllers/roleController';
import { authenticateToken } from '../middleware/authenticate';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Assign role to user
router.post('/assign', assignRoleToUser);

// Remove role from user
router.post('/remove', removeRoleFromUser);

// Get user's roles
router.get('/user/:userId', getUserRoles);

// Get all users with specific role
router.get('/:roleId/users', getUsersByRole);

export default router;
