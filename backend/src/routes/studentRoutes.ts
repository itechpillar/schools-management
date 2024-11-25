import express, { Router, Request, Response, NextFunction } from 'express';
import { Student } from '../entities/Student';
import { StudentMedical } from '../entities/StudentMedical';
import AppDataSource from '../config/database';
import { AuthUser } from '../types/express';
import { authenticateToken, authorize } from '../middleware/auth';
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
router.use(authenticateToken);

// Parent functionality endpoints
router.get('/parent', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('Parent route accessed by user:', {
      email: req.user.email,
      roles: req.user.roles
    });

    if (!req.user.roles.includes('parent')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Searching for students with parent_email:', req.user.email);

    const students = await studentRepository.find({
      where: {
        parent_email: req.user.email
      },
      relations: ['academics', 'medicals', 'school']
    });

    console.log('Found students:', students.length);

    return res.status(200).json({ data: students });
  } catch (error) {
    console.error('Error in /parent route:', error);
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

// Medical Records Routes
router.get('/:studentId/medicals', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    
    const medicalRecords = await AppDataSource
      .getRepository(StudentMedical)
      .find({
        where: { 
          student_id: studentId,
          status: 'active'
        },
        order: { created_at: 'DESC' }
      });

    return res.status(200).json({
      success: true,
      data: medicalRecords
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching medical records'
    });
  }
});

router.post('/:studentId/medicals', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const {
      blood_group,
      medical_conditions,
      allergies,
      emergency_contact
    } = req.body;

    // Check if student exists
    const student = await AppDataSource
      .getRepository(Student)
      .findOne({ where: { id: studentId } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create new medical record
    const medicalRepo = AppDataSource.getRepository(StudentMedical);
    const newMedical = medicalRepo.create({
      student_id: studentId,
      blood_group,
      medical_conditions,
      allergies,
      emergency_contact,
      status: 'active'
    });

    await medicalRepo.save(newMedical);

    return res.status(201).json({
      success: true,
      data: newMedical
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating medical record'
    });
  }
});

router.put('/:studentId/medicals/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { studentId, id } = req.params;
    const {
      blood_group,
      medical_conditions,
      allergies,
      emergency_contact
    } = req.body;

    const medicalRepo = AppDataSource.getRepository(StudentMedical);
    const medical = await medicalRepo.findOne({
      where: {
        id,
        student_id: studentId,
        status: 'active'
      }
    });

    if (!medical) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Update medical record
    medical.blood_group = blood_group;
    medical.medical_conditions = medical_conditions;
    medical.allergies = allergies;
    medical.emergency_contact = emergency_contact;

    await medicalRepo.save(medical);

    return res.status(200).json({
      success: true,
      data: medical
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating medical record'
    });
  }
});

router.delete('/:studentId/medicals/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { studentId, id } = req.params;
    
    const medicalRepo = AppDataSource.getRepository(StudentMedical);
    const medical = await medicalRepo.findOne({
      where: {
        id,
        student_id: studentId,
        status: 'active'
      }
    });

    if (!medical) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Soft delete by updating status
    medical.status = 'inactive';
    await medicalRepo.save(medical);

    return res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting medical record'
    });
  }
});

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
