import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';
import { auth } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth());

// Routes that require super admin
router.post('/', auth([UserRole.SUPER_ADMIN]), createStudent);
router.put('/:id', auth([UserRole.SUPER_ADMIN]), updateStudent);
router.delete('/:id', auth([UserRole.SUPER_ADMIN]), deleteStudent);

// Routes accessible to all authenticated users
router.get('/', getAllStudents);
router.get('/:id', getStudentById);

export default router;
