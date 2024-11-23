import { Request, Response } from 'express';
import { Teacher } from '../entities/Teacher';
import { School } from '../entities/School';
import AppDataSource from '../config/database';
import { validate } from 'class-validator';
import { handleError, AppError } from '../utils/errorHandler';

const teacherRepository = AppDataSource.getRepository(Teacher);
const schoolRepository = AppDataSource.getRepository(School);

export const getAllTeachers = async (_req: Request, res: Response) => {
    try {
        const teachers = await teacherRepository.find({
            relations: {
                school: true,
                contact: true,
                professional_details: true,
                qualifications: true,
                financial: true
            }
        });

        return res.json({
            status: 'success',
            data: teachers
        });
    } catch (error) {
        return handleError(error, res);
    }
};

export const getTeacherById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teacher = await teacherRepository.findOne({
            where: { id },
            relations: {
                school: true,
                contact: true,
                professional_details: true,
                qualifications: true,
                financial: true
            }
        });

        if (!teacher) {
            throw new AppError(404, `Teacher with ID ${id} not found`);
        }

        return res.json({
            status: 'success',
            data: teacher
        });
    } catch (error) {
        return handleError(error, res);
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

        // First, find the school
        const school = await schoolRepository.findOne({
            where: { id: school_id }
        });

        if (!school) {
            throw new AppError(404, `School with ID ${school_id} not found`);
        }

        const teacher = teacherRepository.create({
            first_name,
            last_name,
            gender,
            date_of_birth,
            aadhar_number,
            pan_number,
            school
        });

        const validationErrors = await validate(teacher);
        if (validationErrors.length > 0) {
            throw validationErrors;
        }

        const savedTeacher = await teacherRepository.save(teacher);

        return res.status(201).json({
            status: 'success',
            message: 'Teacher created successfully',
            data: savedTeacher
        });
    } catch (error) {
        return handleError(error, res);
    }
};

export const updateTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            first_name,
            last_name,
            gender,
            date_of_birth,
            aadhar_number,
            pan_number,
            school_id
        } = req.body;

        const teacher = await teacherRepository.findOne({
            where: { id }
        });

        if (!teacher) {
            throw new AppError(404, `Teacher with ID ${id} not found`);
        }

        // If school_id is provided, find the school
        let school = undefined;
        if (school_id) {
            school = await schoolRepository.findOne({
                where: { id: school_id }
            });

            if (!school) {
                throw new AppError(404, `School with ID ${school_id} not found`);
            }
        }

        const updatedTeacher = teacherRepository.create({
            ...teacher,
            first_name,
            last_name,
            gender,
            date_of_birth,
            aadhar_number,
            pan_number,
            school: school || teacher.school
        });

        const validationErrors = await validate(updatedTeacher);
        if (validationErrors.length > 0) {
            throw validationErrors;
        }

        const savedTeacher = await teacherRepository.save(updatedTeacher);

        return res.json({
            status: 'success',
            message: 'Teacher updated successfully',
            data: savedTeacher
        });
    } catch (error) {
        return handleError(error, res);
    }
};

export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teacher = await teacherRepository.findOne({
            where: { id }
        });

        if (!teacher) {
            throw new AppError(404, `Teacher with ID ${id} not found`);
        }

        await teacherRepository.remove(teacher);

        return res.json({
            status: 'success',
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        return handleError(error, res);
    }
};
