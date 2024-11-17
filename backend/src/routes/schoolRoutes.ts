import express from 'express';
import {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} from '../controllers/schoolController';
import { auth } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth());

// Routes that require super admin
router.post('/', auth([UserRole.SUPER_ADMIN]), createSchool);
router.put('/:id', auth([UserRole.SUPER_ADMIN]), updateSchool);
router.delete('/:id', auth([UserRole.SUPER_ADMIN]), deleteSchool);

// Routes accessible to all authenticated users
router.get('/', getAllSchools);
router.get('/:id', getSchoolById);

export default router;
