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
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = express.Router();
const studentRepository = AppDataSource.getRepository(Student);

// Apply authentication middleware to all routes
router.use(authenticate);

// Student CRUD operations
router.post('/', authorize(['super_admin', 'school_admin']), createStudent);
router.put('/:id', authorize(['super_admin', 'school_admin']), updateStudent);
router.delete('/:id', authorize(['super_admin']), deleteStudent);

// Student details (Read operations - accessible to all authenticated users)
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.get('/:id/details', getStudentDetails);

// Step-by-step form endpoints
router.put(
  '/:id/contact',
  authorize(['super_admin', 'school_admin']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const contactData = req.body;
      
      const student = await studentRepository.findOne({ where: { id } });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Update contact information
      Object.assign(student, contactData);
      await studentRepository.save(student);

      return res.status(200).json({ message: 'Contact information updated successfully', student });
    } catch (error) {
      return next(error);
    }
  }
);

// Academic routes
router.get('/:id/academics', getStudentAcademics);
router.post('/:id/academics', authorize(['super_admin', 'school_admin']), createStudentAcademic);
router.put('/:id/academics/:academicId', authorize(['super_admin', 'school_admin']), updateStudentAcademic);
router.delete('/:id/academics/:academicId', authorize(['super_admin']), deleteStudentAcademic);

// Medical routes
router.get('/:id/medicals', getStudentMedicals);
router.post('/:id/medicals', authorize(['super_admin', 'school_admin']), createStudentMedical);
router.put('/:id/medicals/:medicalId', authorize(['super_admin', 'school_admin']), updateStudentMedical);
router.delete('/:id/medicals/:medicalId', authorize(['super_admin']), deleteStudentMedical);

// Emergency contact routes
router.get('/:id/emergency-contacts', getStudentEmergencyContacts);
router.post('/:id/emergency-contacts', authorize(['super_admin', 'school_admin']), createStudentEmergencyContact);
router.put('/:id/emergency-contacts/:contactId', authorize(['super_admin', 'school_admin']), updateStudentEmergencyContact);
router.delete('/:id/emergency-contacts/:contactId', authorize(['super_admin']), deleteStudentEmergencyContact);

// Fee routes
router.get('/:id/fees', getStudentFees);
router.post('/:id/fees', authorize(['super_admin', 'school_admin']), createStudentFee);
router.put('/:id/fees/:feeId/status', authorize(['super_admin', 'school_admin']), updateFeeStatus);

export default router;
