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
router.use(auth([UserRole.SUPER_ADMIN]));

// School routes
router.post('/', createSchool);
router.get('/', getAllSchools);
router.get('/:id', getSchoolById);
router.put('/:id', updateSchool);
router.delete('/:id', deleteSchool);

export default router;
