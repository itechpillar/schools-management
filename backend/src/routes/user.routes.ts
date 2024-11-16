import { Router } from 'express';
import { auth } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// Protected routes
router.use(auth());

// Super admin only routes
router.use('/admin', auth([UserRole.SUPER_ADMIN]));

export default router;
