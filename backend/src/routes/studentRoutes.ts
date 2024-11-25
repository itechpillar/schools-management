import express, { Router, Request, Response, NextFunction } from 'express';
import AppDataSource from '../config/database';
import { Student } from '../entities/Student';
import { AuthUser } from '../types/express';
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

const router = Router();
const studentRepository = AppDataSource.getRepository(Student);

// Public routes
router.get('/parent-email-check', async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const students = await studentRepository.find({
      where: {
        parent_email: email
      }
    });
    
    return res.status(200).json({ exists: students.length > 0 });
  } catch (error) {
    console.error('Error checking parent email:', error);
    return res.status(500).json({ message: 'Error checking parent email' });
  }
});

// Apply authentication middleware to all routes below this line
router.use(authenticate);

// Parent functionality endpoints
router.get('/parent', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.roles.includes('parent')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const students = await studentRepository.find({
      where: {
        parent_email: req.user.email
      },
      relations: ['academics', 'medicals', 'school']
    });

    return res.status(200).json({ data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Error fetching students' });
  }
});

// Student CRUD operations
router.post('/', authorize(['super_admin', 'school_admin']), createStudent);
router.put('/:id', authorize(['super_admin', 'school_admin']), updateStudent);
router.delete('/:id', authorize(['super_admin', 'school_admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as AuthUser;
    const { id } = req.params;

    // Find the student with their school information
    const student = await studentRepository.findOne({
      where: { id },
      relations: ['school']
    });

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // If school_admin, verify they belong to the same school
    if (user.roles.includes('school_admin') && user.schoolId !== student.school.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete students from your own school'
      });
    }

    // Proceed with deletion
    return deleteStudent(req, res);
  } catch (error) {
    next(error);
  }
});

// Student details (Read operations - accessible to all authenticated users)
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.get('/:id/details', getStudentDetails);

// Step-by-step form endpoints
router.put(
  '/:id/contact',
  authorize(['super_admin', 'school_admin']),
  async (req: Request, res: Response, next: NextFunction) => {
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
