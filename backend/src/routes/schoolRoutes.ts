import express from 'express';
import {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} from '../controllers/schoolController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes that require super admin
router.post('/', authorize(['super_admin']), createSchool);
router.put('/:id', authorize(['super_admin']), updateSchool);
router.delete('/:id', authorize(['super_admin']), deleteSchool);

// Routes accessible to all authenticated users
router.get('/', getAllSchools);
router.get('/:id', getSchoolById);

export default router;
