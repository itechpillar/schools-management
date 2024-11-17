import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { Student } from '../entities/Student';
import { School } from '../entities/School';
import { StudentAcademic } from '../entities/StudentAcademic';
import { StudentMedical } from '../entities/StudentMedical';
import { StudentEmergencyContact } from '../entities/StudentEmergencyContact';
import { StudentFee } from '../entities/StudentFee';
import { validatePhoto, processPhotoUpload } from '../utils/photoUtils';
import { FeeType, PaymentMethod, PaymentStatus } from '../entities/enums';

const studentRepository = AppDataSource.getRepository(Student);
const schoolRepository = AppDataSource.getRepository(School);
const academicRepository = AppDataSource.getRepository(StudentAcademic);
const medicalRepository = AppDataSource.getRepository(StudentMedical);
const emergencyContactRepository = AppDataSource.getRepository(StudentEmergencyContact);
const feeRepository = AppDataSource.getRepository(StudentFee);

export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      school_id,
      schoolId,
      grade,
      status,
    } = req.body;

    const actualSchoolId = school_id || schoolId;

    // Verify that the school exists
    const school = await schoolRepository.findOne({ where: { id: actualSchoolId } });
    if (!school) {
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    // Validate required fields
    const missingFields = [];
    
    if (!firstName?.trim()) missingFields.push('First Name');
    if (!lastName?.trim()) missingFields.push('Last Name');
    if (!dateOfBirth) missingFields.push('Date of Birth');
    if (!gender) missingFields.push('Gender');
    if (!actualSchoolId) missingFields.push('School');
    if (!grade?.trim()) missingFields.push('Grade');

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Create new student with school relationship
    const student = new Student();
    student.first_name = firstName;
    student.middle_name = middleName || null;
    student.last_name = lastName;
    student.date_of_birth = new Date(dateOfBirth);
    student.gender = gender;
    student.grade = grade;
    student.status = status || 'active';
    student.school = school;  // Set the school relationship directly

    try {
      // Save the student with school relationship
      const savedStudent = await studentRepository.save(student);

      // Fetch the saved student with school details
      const studentWithDetails = await studentRepository.findOne({
        where: { id: savedStudent.id },
        relations: ['school']
      });

      return res.status(201).json({
        status: 'success',
        data: studentWithDetails,
      });
    } catch (error) {
      console.error('Error creating student:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create student',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error creating student',
    });
  }
};

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await studentRepository.find({
      relations: ['school', 'emergency_contact'],
      order: {
        first_name: 'ASC',
        last_name: 'ASC',
      },
    });

    const formattedStudents = students.map(student => ({
      ...student,
      school_name: student.school?.name || 'N/A',
      contact_name: student.emergency_contact?.contact_name || null,
      email: student.emergency_contact?.email || null,
      phone_number: student.emergency_contact?.phone_number || null,
      home_address: student.emergency_contact?.home_address || null,
      date_of_birth: student.date_of_birth || null,
      has_emergency_contact: !!student.emergency_contact
    }));

    return res.status(200).json({
      status: 'success',
      data: formattedStudents,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentRepository.findOne({
      where: { id },
      relations: ['school', 'emergency_contact'],
    });

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...student,
        school_name: student.school?.name || 'N/A',
        contact_name: student.emergency_contact?.contact_name || null,
        email: student.emergency_contact?.email || null,
        phone_number: student.emergency_contact?.phone_number || null,
        home_address: student.emergency_contact?.home_address || null,
        date_of_birth: student.date_of_birth || null,
        has_emergency_contact: !!student.emergency_contact
      },
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error fetching student',
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      school_id,
      schoolId,
      grade,
      status,
    } = req.body;

    const actualSchoolId = school_id || schoolId;

    // Validate required fields
    const missingFields = [];
    
    if (!first_name?.trim()) missingFields.push('First Name');
    if (!last_name?.trim()) missingFields.push('Last Name');
    if (!date_of_birth) missingFields.push('Date of Birth');
    if (!gender) missingFields.push('Gender');
    if (!grade?.trim()) missingFields.push('Grade');

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    const student = await studentRepository.findOne({
      where: { id },
      relations: ['school']
    });

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    if (actualSchoolId) {
      const school = await schoolRepository.findOne({ where: { id: actualSchoolId } });
      if (!school) {
        return res.status(404).json({
          status: 'error',
          message: 'School not found',
        });
      }
      student.school = school;
    }

    Object.assign(student, {
      first_name,
      last_name,
      date_of_birth,
      gender,
      grade,
      status,
    });

    const updatedStudent = await studentRepository.save(student);

    return res.status(200).json({
      status: 'success',
      data: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error updating student',
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentRepository.findOne({ where: { id } });

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    await studentRepository.remove(student);

    return res.status(200).json({
      status: 'success',
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error deleting student',
    });
  }
};

export const getStudentDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const student = await studentRepository.findOne({
      where: { id },
      relations: ['school', 'academic', 'medical', 'emergency_contact', 'fees']
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudentAcademic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      grade,
      section,
      roll_number,
      subjects_enrolled,
      previous_school,
      admission_date,
      slc_number,
      board,
      gpa,
      past_academic_performance,
      academic_year
    } = req.body;

    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const academicRecord = new StudentAcademic();
    academicRecord.student = student;
    academicRecord.grade = grade;
    academicRecord.section = section;
    academicRecord.roll_number = roll_number;
    if (subjects_enrolled) academicRecord.subjects_enrolled = subjects_enrolled;
    if (previous_school) academicRecord.previous_school = previous_school;
    if (admission_date) academicRecord.admission_date = admission_date;
    if (slc_number) academicRecord.slc_number = slc_number;
    if (board) academicRecord.board = board;
    if (gpa) academicRecord.gpa = gpa;
    if (past_academic_performance) academicRecord.past_academic_performance = past_academic_performance;
    academicRecord.academic_year = academic_year || '2023-2024';

    await academicRepository.save(academicRecord);
    return res.status(201).json(academicRecord);
  } catch (error) {
    console.error('Error creating student academic record:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudentAcademic = async (req: Request, res: Response) => {
  try {
    const { id, academicId } = req.params;
    const {
      grade,
      section,
      roll_number,
      subjects_enrolled,
      previous_school,
      admission_date,
      slc_number,
      board,
      gpa,
      past_academic_performance,
      academic_year
    } = req.body;

    const academicRecord = await academicRepository.findOne({
      where: { id: academicId, student: { id } }
    });

    if (!academicRecord) {
      return res.status(404).json({ message: 'Academic record not found' });
    }

    if (grade) academicRecord.grade = grade;
    if (section) academicRecord.section = section;
    if (roll_number) academicRecord.roll_number = roll_number;
    if (subjects_enrolled) academicRecord.subjects_enrolled = subjects_enrolled;
    if (previous_school) academicRecord.previous_school = previous_school;
    if (admission_date) academicRecord.admission_date = admission_date;
    if (slc_number) academicRecord.slc_number = slc_number;
    if (board) academicRecord.board = board;
    if (gpa) academicRecord.gpa = gpa;
    if (past_academic_performance) academicRecord.past_academic_performance = past_academic_performance;
    if (academic_year) academicRecord.academic_year = academic_year;

    await academicRepository.save(academicRecord);
    return res.status(200).json(academicRecord);
  } catch (error) {
    console.error('Error updating student academic record:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudentMedical = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { blood_group, medical_conditions, allergies } = req.body;

    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let medical = await medicalRepository.findOne({ where: { student: { id } } });
    if (!medical) {
      medical = medicalRepository.create({ student });
    }

    medical.blood_group = blood_group;
    medical.medical_conditions = medical_conditions;
    medical.allergies = allergies;

    await medicalRepository.save(medical);
    return res.json(medical);
  } catch (error) {
    console.error('Error updating student medical:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudentEmergencyContact = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const {
      contact_name,
      relationship,
      phone_number,
      email,
      alternate_contact_name,
      alternate_contact_relationship,
      alternate_contact_number,
      communication_preference,
      home_address
    } = req.body;

    // Find the student
    const student = await studentRepository.findOne({
      where: { id: studentId },
      relations: ['emergency_contact']
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let emergency = student.emergency_contact;

    // If no emergency contact exists, create a new one
    if (!emergency) {
      emergency = emergencyContactRepository.create({
        student_id: studentId,
        contact_name: contact_name || '',
        relationship: relationship || '',
        phone_number: phone_number || '',
        email: email || null,
        home_address: home_address || '',
        alternate_contact_name: alternate_contact_name || null,
        alternate_contact_relationship: alternate_contact_relationship || null,
        alternate_contact_number: alternate_contact_number || null,
        communication_preference: communication_preference || null
      });
    } else {
      // Update all emergency contact fields
      if (contact_name) emergency.contact_name = contact_name;
      if (relationship) emergency.relationship = relationship;
      if (phone_number) emergency.phone_number = phone_number;
      if (email) emergency.email = email;
      if (home_address) emergency.home_address = home_address;
      if (alternate_contact_name) emergency.alternate_contact_name = alternate_contact_name;
      if (alternate_contact_relationship) emergency.alternate_contact_relationship = alternate_contact_relationship;
      if (alternate_contact_number) emergency.alternate_contact_number = alternate_contact_number;
      if (communication_preference) emergency.communication_preference = communication_preference;
    }

    // Save the emergency contact
    await emergencyContactRepository.save(emergency);

    return res.status(200).json({
      status: 'success',
      data: emergency
    });
  } catch (error) {
    console.error('Error updating student emergency contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudentFee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      fee_type,
      amount,
      due_date,
      payment_method,
      academic_year,
      term
    } = req.body;

    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const fee = feeRepository.create({
      student,
      fee_type: fee_type || FeeType.TUITION,
      amount,
      due_date,
      payment_status: PaymentStatus.PENDING,
      payment_method: payment_method || PaymentMethod.CASH,
      academic_year,
      term,
      amount_paid: 0,
      balance: amount
    });

    await feeRepository.save(fee);
    return res.status(201).json(fee);
  } catch (error) {
    console.error('Error creating student fee:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateFeeStatus = async (req: Request, res: Response) => {
  try {
    const { id, feeId } = req.params;
    const { payment_status, payment_method, payment_date, amount_paid, transaction_id } = req.body;

    const fee = await feeRepository.findOne({
      where: { id: feeId, student_id: id }
    });

    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    if (payment_status) fee.payment_status = payment_status;
    if (payment_method) fee.payment_method = payment_method;
    if (payment_date) fee.payment_date = payment_date;
    if (amount_paid) fee.amount_paid = amount_paid;
    if (transaction_id) fee.transaction_id = transaction_id;

    await feeRepository.save(fee);
    return res.status(200).json(fee);
  } catch (error) {
    console.error('Error updating fee status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadStudentPhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const validation = validatePhoto(file);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const student = await studentRepository.findOne({ where: { id } });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { photo, photo_content_type } = processPhotoUpload(file);
    
    student.photo = photo;
    student.photo_content_type = photo_content_type;
    await studentRepository.save(student);

    return res.status(200).json({ message: 'Photo uploaded successfully' });
  } catch (error) {
    console.error('Error uploading student photo:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentPhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentRepository.findOne({ where: { id } });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!student.photo || !student.photo_content_type) {
      return res.status(404).json({ error: 'No photo found for this student' });
    }

    res.set('Content-Type', student.photo_content_type);
    return res.send(student.photo);
  } catch (error) {
    console.error('Error retrieving student photo:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentEmergencyContacts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const emergencyContact = await emergencyContactRepository.findOne({
      where: { student: { id } }
    });

    if (!emergencyContact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: emergencyContact
    });
  } catch (error) {
    console.error('Error fetching student emergency contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudentEmergencyContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      parent_guardian_name,
      parent_guardian_relationship,
      parent_guardian_contact,
      parent_guardian_email,
      parent_guardian_occupation,
      alternate_contact_name,
      alternate_contact_relationship,
      alternate_contact_number,
      communication_preference
    } = req.body;

    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if emergency contact already exists
    const existingContact = await emergencyContactRepository.findOne({
      where: { student: { id } }
    });

    if (existingContact) {
      return res.status(400).json({
        status: 'error',
        message: 'Emergency contact already exists for this student. Use update endpoint instead.'
      });
    }

    const emergencyContact = emergencyContactRepository.create({
      student: { id },
      contact_name: parent_guardian_name,
      relationship: parent_guardian_relationship,
      phone_number: parent_guardian_contact,
      email: parent_guardian_email,
      home_address: parent_guardian_occupation,
      alternate_contact_name,
      alternate_contact_relationship,
      alternate_contact_number,
      communication_preference
    });

    await emergencyContactRepository.save(emergencyContact);

    return res.status(201).json({
      status: 'success',
      data: emergencyContact
    });
  } catch (error) {
    console.error('Error creating student emergency contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
