import { Request, Response } from 'express';
import { Teacher } from '../entities/Teacher';
import { AppDataSource } from '../config/database';
import { validate } from 'class-validator';

const teacherRepository = AppDataSource.getRepository(Teacher);

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await teacherRepository.find();
    res.json({ data: teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers' });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await teacherRepository.findOne({ where: { id } });
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ data: teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Error fetching teacher' });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      aadhar_number,
      pan_number,
      school_id
    } = req.body;

    const teacher = new Teacher();
    teacher.first_name = first_name;
    teacher.last_name = last_name;
    teacher.gender = gender;
    teacher.date_of_birth = date_of_birth;
    teacher.aadhar_number = aadhar_number;
    teacher.pan_number = pan_number;
    teacher.school_id = school_id;

    const errors = await validate(teacher);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await teacherRepository.save(teacher);
    res.status(201).json({ data: teacher });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Error creating teacher' });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacherRepository.merge(teacher, req.body);
    const errors = await validate(teacher);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await teacherRepository.save(teacher);
    res.json({ data: teacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Error updating teacher' });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacherRepository.remove(teacher);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Error deleting teacher' });
  }
};
