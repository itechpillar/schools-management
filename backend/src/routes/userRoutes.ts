import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create a new user (super_admin and school_admin only)
router.post(
  '/',
  authorize(['super_admin', 'school_admin']),
  UserController.createUser
);

// Get all users (filtered by school for school_admin)
router.get(
  '/',
  authorize(['super_admin', 'school_admin']),
  UserController.getUsers
);

// Update user
router.put(
  '/:id',
  authorize(['super_admin', 'school_admin']),
  UserController.updateUser
);

// Delete user
router.delete(
  '/:id',
  authorize(['super_admin']), // Only super_admin can delete users
  UserController.deleteUser
);

export default router;
