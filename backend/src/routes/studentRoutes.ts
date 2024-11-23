import express from 'express';
import AppDataSource from '../config/database';
import { Student } from '../entities/Student';
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
  deleteStudentEmergencyContact,
  createStudentFee,
  updateFeeStatus,
  getStudentAcademics,
  createStudentAcademic,
  deleteStudentAcademic,
  getStudentMedicals,
  createStudentMedical,
  deleteStudentMedical,
  getStudentFees,
} from '../controllers/studentController';
import { auth } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = express.Router();
const studentRepository = AppDataSource.getRepository(Student);

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

// Step-by-step form endpoints
router.put('/:id/contact', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const contactData = req.body;
    
    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    // Update contact information
    Object.assign(student, contactData);
    await studentRepository.save(student);

    return res.status(200).json({
      status: 'success',
      data: student,
    });
  } catch (error) {
    console.error('Error updating contact information:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error updating contact information',
    });
  }
});

router.put('/:id/academics', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentAcademic);
router.put('/:id/medicals', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentMedical);
router.put('/:id/emergency-contacts', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentEmergencyContact);
router.put('/:id/fees', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), createStudentFee);

// Student emergency contact operations
router.get('/:studentId/emergency-contacts', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), getStudentEmergencyContacts);
router.post('/:studentId/emergency-contacts', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), createStudentEmergencyContact);
router.put('/:studentId/emergency-contacts/:contactId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentEmergencyContact);
router.delete('/:studentId/emergency-contacts/:contactId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), deleteStudentEmergencyContact);

// Student fee operations
router.get('/:id/fees', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), getStudentFees);
router.post('/:id/fees', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), createStudentFee);
router.put('/:id/fees/:feeId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateFeeStatus);

// Student academic operations
router.get('/:studentId/academics', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), getStudentAcademics);
router.post('/:studentId/academics', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), createStudentAcademic);
router.put('/:studentId/academics/:academicId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentAcademic);
router.delete('/:studentId/academics/:academicId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), deleteStudentAcademic);

// Student medical operations
router.get('/:studentId/medicals', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), getStudentMedicals);
router.post('/:studentId/medicals', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), createStudentMedical);
router.put('/:studentId/medicals/:medicalId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), updateStudentMedical);
router.delete('/:studentId/medicals/:medicalId', auth([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), deleteStudentMedical);

export default router;
