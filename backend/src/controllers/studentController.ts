import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { Student } from '../entities/Student';
import { School } from '../entities/School';
import { StudentAcademic } from '../entities/StudentAcademic';
import { StudentMedical } from '../entities/StudentMedical';
import { StudentEmergencyContact } from '../entities/StudentEmergencyContact';
import { StudentFee } from '../entities/StudentFee';
import { FeeType, PaymentMethod, PaymentStatus } from '../entities/enums';
import { handleError } from '../utils/handleError';

const studentRepository = AppDataSource.getRepository(Student);
const schoolRepository = AppDataSource.getRepository(School);
const academicRepository = AppDataSource.getRepository(StudentAcademic);
const medicalRepository = AppDataSource.getRepository(StudentMedical);
const studentEmergencyContactRepository = AppDataSource.getRepository(StudentEmergencyContact);
const feeRepository = AppDataSource.getRepository(StudentFee);

export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      schoolId,
      grade,
      status,
    } = req.body;

    // For school_admin, use their assigned school
    const userRole = req.user?.roles?.[0];
    const userSchoolId = req.user?.schoolId;
    
    let actualSchoolId = schoolId;

    // If school_admin, override with their school
    if (userRole === 'school_admin') {
      if (!userSchoolId) {
        return res.status(400).json({
          status: 'error',
          message: 'School admin must have an assigned school',
        });
      }
      actualSchoolId = userSchoolId;
    }

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

    // Create new student
    const student = new Student();
    student.first_name = firstName.trim();
    student.middle_name = middleName?.trim() || null;
    student.last_name = lastName.trim();
    student.date_of_birth = new Date(dateOfBirth);
    student.gender = gender;
    student.school = school;
    student.grade = grade.trim();
    student.status = status || 'active';

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
      return handleError(error, res, 'Failed to create student');
    }
  } catch (error) {
    return handleError(error, res, 'Failed to create student');
  }
};

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await studentRepository.find({
      relations: ['school', 'emergency_contacts'],
      order: {
        first_name: 'ASC',
        last_name: 'ASC',
      },
    });

    const formattedStudents = students.map(student => ({
      ...student,
      school_name: student.school?.name || 'N/A',
      contact_name: student.emergency_contacts?.[0]?.contact_name || null,
      relationship: student.emergency_contacts?.[0]?.relationship || null,
      phone_number: student.emergency_contacts?.[0]?.phone_number || null,
      email: student.emergency_contacts?.[0]?.email || null,
      home_address: student.emergency_contacts?.[0]?.home_address || null,
      alternate_contact_name: student.emergency_contacts?.[0]?.alternate_contact_name || null,
      alternate_contact_relationship: student.emergency_contacts?.[0]?.alternate_contact_relationship || null,
      alternate_contact_number: student.emergency_contacts?.[0]?.alternate_contact_number || null,
      communication_preference: student.emergency_contacts?.[0]?.communication_preference || null,
      date_of_birth: student.date_of_birth || null,
      has_emergency_contact: !!student.emergency_contacts
    }));

    return res.status(200).json({
      status: 'success',
      data: formattedStudents,
    });
  } catch (error) {
    // console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentRepository.findOne({
      where: { id },
      relations: ['school', 'emergency_contacts']
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
        contact_name: student.emergency_contacts?.[0]?.contact_name || null,
        relationship: student.emergency_contacts?.[0]?.relationship || null,
        phone_number: student.emergency_contacts?.[0]?.phone_number || null,
        email: student.emergency_contacts?.[0]?.email || null,
        home_address: student.emergency_contacts?.[0]?.home_address || null,
        alternate_contact_name: student.emergency_contacts?.[0]?.alternate_contact_name || null,
        alternate_contact_relationship: student.emergency_contacts?.[0]?.alternate_contact_relationship || null,
        alternate_contact_number: student.emergency_contacts?.[0]?.alternate_contact_number || null,
        communication_preference: student.emergency_contacts?.[0]?.communication_preference || null,
        date_of_birth: student.date_of_birth || null,
        has_emergency_contact: !!student.emergency_contacts
      },
    });
  } catch (error) {
    // console.error('Error fetching student:', error);
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
      firstName,
      last_name,
      lastName,
      date_of_birth,
      dateOfBirth,
      gender,
      schoolId,
      grade,
      status,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      parentGuardianName,
      parentGuardianPhone,
      parentGuardianEmail,
    } = req.body;

    const actualFirstName = firstName || first_name;
    const actualLastName = lastName || last_name;
    const actualDateOfBirth = dateOfBirth || date_of_birth;
    const actualSchoolId = schoolId;

    // Validate required fields
    const missingFields = [];
    
    if (!actualFirstName?.trim()) missingFields.push('First Name');
    if (!actualLastName?.trim()) missingFields.push('Last Name');
    if (!actualDateOfBirth) missingFields.push('Date of Birth');
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
      relations: ['school', 'emergency_contacts']
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

    // Format date string to ensure consistent format
    let formattedDate: Date;
    try {
      // Parse the date and set it to noon UTC to avoid timezone issues
      const [year, month, day] = actualDateOfBirth.split(/[-\/]/);
      formattedDate = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,  // Month is 0-based
        parseInt(day),
        12  // Set to noon UTC
      ));

      if (isNaN(formattedDate.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format for Date of Birth. Please use YYYY-MM-DD or MM/DD/YYYY format.',
      });
    }

    // Update student fields
    student.first_name = actualFirstName.trim();
    student.last_name = actualLastName.trim();
    student.date_of_birth = formattedDate;
    student.gender = gender;
    student.grade = grade.trim();
    if (status) student.status = status;

    // Save the student first to ensure we have an ID
    const updatedStudent = await studentRepository.save(student);

    // Handle emergency contacts
    if (emergencyContactName || emergencyContactPhone || emergencyContactRelation) {
      // Find or create emergency contact for the student
      let emergencyContact = updatedStudent.emergency_contacts?.find(contact => 
        contact.relationship === 'emergency'
      );

      if (!emergencyContact) {
        emergencyContact = new StudentEmergencyContact();
        emergencyContact.student_id = updatedStudent.id;
        emergencyContact.relationship = 'emergency';
      }

      if (emergencyContactName) emergencyContact.contact_name = emergencyContactName;
      if (emergencyContactPhone) emergencyContact.phone_number = emergencyContactPhone;
      if (emergencyContactRelation) emergencyContact.relationship = emergencyContactRelation;

      await studentEmergencyContactRepository.save(emergencyContact);
    }

    // Handle parent/guardian contact
    if (parentGuardianName || parentGuardianPhone || parentGuardianEmail) {
      // Find or create parent/guardian contact for the student
      let parentContact = updatedStudent.emergency_contacts?.find(contact => 
        contact.relationship === 'parent/guardian'
      );

      if (!parentContact) {
        parentContact = new StudentEmergencyContact();
        parentContact.student_id = updatedStudent.id;
        parentContact.relationship = 'parent/guardian';
      }

      if (parentGuardianName) parentContact.contact_name = parentGuardianName;
      if (parentGuardianPhone) parentContact.phone_number = parentGuardianPhone;
      if (parentGuardianEmail) parentContact.email = parentGuardianEmail;

      await studentEmergencyContactRepository.save(parentContact);
    }

    // Fetch the updated student with all relations
    const finalStudent = await studentRepository.findOne({
      where: { id: updatedStudent.id },
      relations: ['school', 'emergency_contacts']
    });

    if (!finalStudent) {
      return res.status(404).json({
        status: 'error',
        message: 'Updated student not found'
      });
    }

    // Format the date back to ISO string for the response
    const responseStudent = {
      ...finalStudent,
      date_of_birth: finalStudent.date_of_birth ? finalStudent.date_of_birth.toISOString().slice(0, 10) : null,
      school_name: finalStudent.school?.name || null
    };

    return res.status(200).json({
      status: 'success',
      data: responseStudent
    });
  } catch (error) {
    // console.error('Error updating student:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error updating student',
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find student with all relations
    const student = await studentRepository.findOne({
      where: { id },
      relations: ['academics', 'medicals', 'emergency_contacts', 'fees']
    });

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    // Delete related records first
    if (student.academics?.length) {
      await academicRepository.remove(student.academics);
    }
    
    if (student.medicals?.length) {
      await medicalRepository.remove(student.medicals);
    }
    
    if (student.emergency_contacts?.length) {
      await studentEmergencyContactRepository.remove(student.emergency_contacts);
    }
    
    if (student.fees?.length) {
      await feeRepository.remove(student.fees);
    }

    // Finally delete the student
    await studentRepository.remove(student);

    return res.status(200).json({
      status: 'success',
      message: 'Student and all related records deleted successfully',
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
      relations: ['school', 'academic', 'medical', 'emergency_contacts', 'fees']
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    // console.error('Error fetching student details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentAcademics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const academics = await academicRepository.find({
      where: { student_id: id },
      order: { academic_year: 'DESC' }
    });

    return res.status(200).json({
      status: 'success',
      data: academics
    });
  } catch (error) {
    // console.error('Error fetching student academics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudentAcademic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      academic_year,
      grade,
      section,
      roll_number,
      subjects,
      attendance_percentage,
      exam_scores,
      extracurricular_activities,
      class_teacher_remarks,
      previous_school,
      admission_date,
      board,
    } = req.body;

    // Validate required fields
    if (!academic_year || !grade || !section) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: academic year, grade, and section are required'
      });
    }

    // Check if student exists
    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    const academicData = academicRepository.create({
      student_id: id,
      academic_year,
      grade,
      section,
      roll_number,
      subjects,
      attendance_percentage,
      exam_scores,
      extracurricular_activities,
      class_teacher_remarks,
      previous_school,
      admission_date,
      board,
    });

    await academicRepository.save(academicData);

    return res.status(201).json({
      status: 'success',
      data: academicData
    });
  } catch (error) {
    console.error('Error creating student academic:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudentAcademic = async (req: Request, res: Response) => {
  try {
    const { id, academicId } = req.params;
    const {
      academic_year,
      grade,
      section,
      roll_number,
      subjects,
      attendance_percentage,
      exam_scores,
      extracurricular_activities,
      class_teacher_remarks,
      previous_school,
      admission_date,
      board,
    } = req.body;

    // Check if student exists
    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check if academic record exists
    const academic = await academicRepository.findOne({
      where: { id: academicId, student_id: id }
    });

    if (!academic) {
      return res.status(404).json({
        status: 'error',
        message: 'Academic record not found'
      });
    }

    // Update academic record
    Object.assign(academic, {
      academic_year,
      grade,
      section,
      roll_number,
      subjects,
      attendance_percentage,
      exam_scores,
      extracurricular_activities,
      class_teacher_remarks,
      previous_school,
      admission_date,
      board,
    });

    await academicRepository.save(academic);

    return res.status(200).json({
      status: 'success',
      data: academic
    });
  } catch (error) {
    console.error('Error updating student academic:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteStudentAcademic = async (req: Request, res: Response) => {
  try {
    const { id, academicId } = req.params;

    // Check if student exists
    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check if academic record exists
    const academic = await academicRepository.findOne({
      where: { id: academicId, student_id: id }
    });

    if (!academic) {
      return res.status(404).json({
        status: 'error',
        message: 'Academic record not found'
      });
    }

    await academicRepository.remove(academic);

    return res.status(200).json({
      status: 'success',
      message: 'Academic record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student academic:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentMedicals = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const medicals = await medicalRepository.find({
      where: { student_id: id },
      order: { created_at: 'DESC' }
    });

    return res.status(200).json({
      status: 'success',
      data: medicals
    });
  } catch (error) {
    console.error('Error fetching student medical records:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudentMedical = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      blood_group,
      medical_conditions,
      allergies,
      medications,
      immunizations,
      emergency_contact_name,
      emergency_contact_number,
      family_doctor_name,
      family_doctor_number,
      preferred_hospital,
      medical_insurance,
      special_needs,
      dietary_restrictions,
      physical_disabilities,
      last_physical_exam,
      additional_notes,
      status
    } = req.body;

    // Check if student exists
    const student = await studentRepository.findOne({
      where: { id }
    });

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Create new medical record
    const medical = new StudentMedical();
    medical.student = student;
    medical.student_id = id;
    medical.blood_group = blood_group || null;
    medical.medical_conditions = medical_conditions || null;
    medical.allergies = allergies || null;
    medical.medications = medications || null;
    medical.immunizations = immunizations || null;
    medical.emergency_contact_name = emergency_contact_name || null;
    medical.emergency_contact_number = emergency_contact_number || null;
    medical.family_doctor_name = family_doctor_name || null;
    medical.family_doctor_number = family_doctor_number || null;
    medical.preferred_hospital = preferred_hospital || null;
    medical.medical_insurance = medical_insurance || null;
    medical.special_needs = special_needs || null;
    medical.dietary_restrictions = dietary_restrictions || null;
    medical.physical_disabilities = physical_disabilities || null;
    medical.last_physical_exam = last_physical_exam ? new Date(last_physical_exam) : null;
    medical.additional_notes = additional_notes || null;
    medical.status = status || 'active';

    // Save the medical record
    const savedMedical = await medicalRepository.save(medical);

    return res.status(201).json({
      status: 'success',
      data: savedMedical
    });
  } catch (error) {
    // console.error('Error creating student medical record:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudentMedical = async (req: Request, res: Response) => {
  try {
    const { id, medicalId } = req.params;
    const {
      blood_group,
      medical_conditions,
      allergies,
      medications,
      immunizations,
      emergency_contact_name,
      emergency_contact_number,
      family_doctor_name,
      family_doctor_number,
      preferred_hospital,
      medical_insurance,
      special_needs,
      dietary_restrictions,
      physical_disabilities,
      last_physical_exam,
      additional_notes,
      status
    } = req.body;

    // Find the medical record
    const medical = await medicalRepository.findOne({
      where: {
        id: medicalId,
        student_id: id
      }
    });

    if (!medical) {
      return res.status(404).json({
        status: 'error',
        message: 'Medical record not found'
      });
    }

    // Update fields if provided
    if (blood_group !== undefined) medical.blood_group = blood_group;
    if (medical_conditions) medical.medical_conditions = medical_conditions;
    if (allergies) medical.allergies = allergies;
    if (medications) medical.medications = medications;
    if (immunizations) medical.immunizations = immunizations;
    if (emergency_contact_name !== undefined) medical.emergency_contact_name = emergency_contact_name;
    if (emergency_contact_number !== undefined) medical.emergency_contact_number = emergency_contact_number;
    if (family_doctor_name !== undefined) medical.family_doctor_name = family_doctor_name;
    if (family_doctor_number !== undefined) medical.family_doctor_number = family_doctor_number;
    if (preferred_hospital !== undefined) medical.preferred_hospital = preferred_hospital;
    if (medical_insurance) medical.medical_insurance = medical_insurance;
    if (special_needs !== undefined) medical.special_needs = special_needs;
    if (dietary_restrictions !== undefined) medical.dietary_restrictions = dietary_restrictions;
    if (physical_disabilities) medical.physical_disabilities = physical_disabilities;
    if (last_physical_exam) medical.last_physical_exam = new Date(last_physical_exam);
    if (additional_notes !== undefined) medical.additional_notes = additional_notes;
    if (status) medical.status = status;

    // Save the updated medical record
    await medicalRepository.save(medical);

    return res.status(200).json({
      status: 'success',
      data: medical
    });
  } catch (error) {
    // console.error('Error updating student medical record:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteStudentMedical = async (req: Request, res: Response) => {
  try {
    const { id, medicalId } = req.params;

    // Find the medical record
    const medical = await medicalRepository.findOne({
      where: {
        id: medicalId,
        student_id: id
      }
    });

    if (!medical) {
      return res.status(404).json({
        status: 'error',
        message: 'Medical record not found'
      });
    }

    // Delete the medical record
    await medicalRepository.remove(medical);

    return res.status(200).json({
      status: 'success',
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    // console.error('Error deleting student medical record:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudentEmergencyContact = async (req: Request, res: Response) => {
  try {
    const { studentId, contactId } = req.params;
    const {
      contact_name,
      relationship,
      phone_number,
      email,
      home_address,
      alternate_contact_name,
      alternate_contact_relationship,
      alternate_contact_number,
      communication_preference
    } = req.body;

    // Find the emergency contact directly
    const emergencyContact = await studentEmergencyContactRepository.findOne({
      where: {
        contact_id: contactId,
        student_id: studentId
      }
    });

    if (!emergencyContact) {
      return res.status(404).json({
        status: 'error',
        message: 'Emergency contact not found'
      });
    }

    // Update fields if provided
    if (contact_name) emergencyContact.contact_name = contact_name;
    if (relationship) emergencyContact.relationship = relationship;
    if (phone_number) emergencyContact.phone_number = phone_number;
    if (email !== undefined) emergencyContact.email = email;
    if (home_address) emergencyContact.home_address = home_address;
    if (alternate_contact_name !== undefined) emergencyContact.alternate_contact_name = alternate_contact_name;
    if (alternate_contact_relationship !== undefined) emergencyContact.alternate_contact_relationship = alternate_contact_relationship;
    if (alternate_contact_number !== undefined) emergencyContact.alternate_contact_number = alternate_contact_number;
    if (communication_preference !== undefined) emergencyContact.communication_preference = communication_preference;

    // Save the updated emergency contact
    await studentEmergencyContactRepository.save(emergencyContact);

    return res.status(200).json({
      status: 'success',
      data: emergencyContact
    });
  } catch (error) {
    // console.error('Error updating student emergency contact:', error);
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
    // console.error('Error creating student fee:', error);
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
    // console.error('Error updating fee status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentEmergencyContacts = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Find all emergency contacts for the student
    const emergencyContacts = await studentEmergencyContactRepository.find({
      where: { student_id: studentId }
    });

    if (!emergencyContacts || emergencyContacts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No emergency contacts found for this student'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: emergencyContacts
    });
  } catch (error) {
    // console.error('Error fetching student emergency contacts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudentEmergencyContact = async (req: Request, res: Response) => {
  try {
    console.log('Starting emergency contact creation...');
    const { id } = req.params;
    console.log('Student ID from params:', id);
    const {
      contact_name,
      relationship,
      phone_number,
      email,
      home_address,
      alternate_contact_name,
      alternate_contact_relationship,
      alternate_contact_number,
      communication_preference
    } = req.body;
    console.log('Request body:', req.body);

    // Validate required fields
    if (!contact_name || !relationship || !phone_number || !home_address) {
      console.log('Missing required fields:', { contact_name, relationship, phone_number, home_address });
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Find the student
    console.log('Finding student with ID:', id);
    const student = await studentRepository.findOne({
      where: { id }
    });

    if (!student) {
      console.log('Student not found with ID:', id);
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }
    console.log('Found student:', student.id);

    // Create new emergency contact
    console.log('Creating new emergency contact...');
    const emergencyContact = new StudentEmergencyContact();
    emergencyContact.student = student;
    emergencyContact.student_id = id;
    emergencyContact.contact_name = contact_name;
    emergencyContact.relationship = relationship;
    emergencyContact.phone_number = phone_number;
    emergencyContact.email = email;
    emergencyContact.home_address = home_address;
    emergencyContact.alternate_contact_name = alternate_contact_name;
    emergencyContact.alternate_contact_relationship = alternate_contact_relationship;
    emergencyContact.alternate_contact_number = alternate_contact_number;
    emergencyContact.communication_preference = communication_preference;

    console.log('Emergency contact object created:', emergencyContact);

    // Save the emergency contact
    console.log('Saving emergency contact...');
    const savedContact = await studentEmergencyContactRepository.save(emergencyContact);
    console.log('Emergency contact saved successfully:', savedContact);

    return res.status(201).json({
      status: 'success',
      data: savedContact
    });
  } catch (error) {
    return handleError(error, res, 'Error creating emergency contact');
  }
};

export const deleteStudentEmergencyContact = async (req: Request, res: Response) => {
  try {
    const { id, contactId } = req.params;

    // Find the emergency contact
    const emergencyContact = await studentEmergencyContactRepository.findOne({
      where: {
        contact_id: contactId,
        student_id: id
      }
    });

    if (!emergencyContact) {
      return res.status(404).json({
        status: 'error',
        message: 'Emergency contact not found'
      });
    }

    // Delete the emergency contact
    await studentEmergencyContactRepository.remove(emergencyContact);

    return res.status(200).json({
      status: 'success',
      message: 'Emergency contact deleted successfully'
    });
  } catch (error) {
    // console.error('Error deleting student emergency contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentFees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fees = await feeRepository.find({
      where: { student_id: id },
      order: { created_at: 'DESC' }
    });

    return res.status(200).json({
      status: 'success',
      data: fees
    });
  } catch (error) {
    console.error('Error fetching student fees:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
