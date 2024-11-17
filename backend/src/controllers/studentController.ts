import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { Student } from '../models/Student';
import { School } from '../models/School';

const studentRepository = AppDataSource.getRepository(Student);
const schoolRepository = AppDataSource.getRepository(School);

export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      schoolId,
      grade,
      status,
    } = req.body;

    // Verify that the school exists
    const school = await schoolRepository.findOne({ where: { id: schoolId } });
    if (!school) {
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    const student = new Student();
    Object.assign(student, {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      schoolId,
      grade,
      status: status || 'active',
    });

    const savedStudent = await studentRepository.save(student);

    return res.status(201).json({
      status: 'success',
      data: savedStudent,
    });
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
      relations: ['school'],
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });

    const studentsWithSchoolName = students.map(student => ({
      ...student,
      schoolName: student.school?.name || 'N/A',
      dateOfBirth: student.dateOfBirth || null,
    }));

    return res.status(200).json({
      status: 'success',
      data: studentsWithSchoolName,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error fetching students',
    });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentRepository.findOne({
      where: { id },
      relations: ['school'],
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
        schoolName: student.school?.name || 'N/A',
        dateOfBirth: student.dateOfBirth || null,
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
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      schoolId,
      grade,
      status,
    } = req.body;

    const student = await studentRepository.findOne({ where: { id } });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    // Verify that the school exists if schoolId is being updated
    if (schoolId) {
      const school = await schoolRepository.findOne({ where: { id: schoolId } });
      if (!school) {
        return res.status(404).json({
          status: 'error',
          message: 'School not found',
        });
      }
    }

    Object.assign(student, {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      schoolId,
      grade,
      status,
    });

    const updatedStudent = await studentRepository.save(student);

    return res.status(200).json({
      status: 'success',
      data: {
        ...updatedStudent,
        dateOfBirth: updatedStudent.dateOfBirth || null,
      },
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
