import express from 'express';
import multer from 'multer';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentDetails,
  updateStudentAcademic,
  updateStudentMedical,
  createStudentEmergencyContact,
  getStudentEmergencyContacts,
  updateStudentEmergencyContact,
  createStudentFee,
  updateFeeStatus,
  uploadStudentPhoto,
  getStudentPhoto
} from '../controllers/studentController';
import { auth } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Apply authentication middleware to all routes
router.use(auth());

// Student CRUD operations (Super Admin only)
router.post('/', auth([UserRole.SUPER_ADMIN]), createStudent);
router.put('/:id', auth([UserRole.SUPER_ADMIN]), updateStudent);
router.delete('/:id', auth([UserRole.SUPER_ADMIN]), deleteStudent);

// Student details (Read operations - accessible to all authenticated users)
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.get('/:id/details', getStudentDetails);

// Student academic operations
router.put('/:id/academic', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentAcademic);

// Student medical operations
router.put('/:id/medical', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentMedical);

// Student emergency contact operations
router.post('/:id/emergency-contacts', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), createStudentEmergencyContact);
router.get('/:id/emergency-contacts', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), getStudentEmergencyContacts);
router.put('/:id/emergency-contacts', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentEmergencyContact);

// Student fee operations
router.post('/:id/fees', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), createStudentFee);
router.put('/:id/fees/:feeId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateFeeStatus);

// Photo routes
router.post('/:id/photo', upload.single('photo'), uploadStudentPhoto);
router.get('/:id/photo', getStudentPhoto);

export default router;
