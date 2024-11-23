import { Router } from 'express';
import { checkRole } from '../middleware/checkRole';
import { Teacher } from '../entities/Teacher';
import { TeacherContact } from '../entities/TeacherContact';
import { TeacherProfessional } from '../entities/TeacherProfessional';
import { TeacherWorkHistory } from '../entities/TeacherWorkHistory';
import AppDataSource from '../config/database';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { UserRole } from '../entities/User';
import { handleError, AppError } from '../utils/errorHandler';

/**
 * @swagger
 * components:
 *   schemas:
 *     TeacherBase:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - gender
 *         - date_of_birth
 *         - aadhar_number
 *         - school_id
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *         date_of_birth:
 *           type: string
 *           format: date
 *         aadhar_number:
 *           type: string
 *         pan_number:
 *           type: string
 *         school_id:
 *           type: string
 *     TeacherContact:
 *       type: object
 *       required:
 *         - current_address
 *         - phone_number
 *         - email
 *       properties:
 *         current_address:
 *           type: string
 *         permanent_address:
 *           type: string
 *         phone_number:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         emergency_contact:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             relationship:
 *               type: string
 *             phone_number:
 *               type: string
 *     TeacherProfessional:
 *       type: object
 *       required:
 *         - designation
 *         - department
 *         - joining_date
 *       properties:
 *         designation:
 *           type: string
 *         department:
 *           type: string
 *         joining_date:
 *           type: string
 *           format: date
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *         specializations:
 *           type: array
 *           items:
 *             type: string
 *     TeacherWorkHistory:
 *       type: object
 *       required:
 *         - institution_name
 *         - designation
 *         - start_date
 *       properties:
 *         institution_name:
 *           type: string
 *         designation:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         is_active:
 *           type: boolean
 *     Teacher:
 *       allOf:
 *         - $ref: '#/components/schemas/TeacherBase'
 *         - type: object
 *           properties:
 *             contact:
 *               $ref: '#/components/schemas/TeacherContact'
 *             professional:
 *               $ref: '#/components/schemas/TeacherProfessional'
 *             work_history:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeacherWorkHistory'
 */

interface TeacherRequestBody {
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    aadhar_number: string;
    pan_number?: string;
    school_id: string;
    contact?: {
        current_address: string;
        permanent_address?: string;
        phone_number: string;
        email: string;
        emergency_contact?: {
            name: string;
            relationship: string;
            phone_number: string;
        };
    };
    professional?: {
        designation: string;
        department: string;
        joining_date: string;
        qualifications: string[];
        specializations: string[];
    };
    work_history?: Array<{
        institution_name: string;
        designation: string;
        start_date: string;
        end_date?: string;
        is_active?: boolean;
    }>;
}

const router = Router();
const teacherRepository = AppDataSource.getRepository(Teacher);

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires SUPER_ADMIN role
 */
router.post('/', checkRole([UserRole.SUPER_ADMIN]), async (req: Request<{}, {}, TeacherRequestBody>, res: Response) => {
    try {
        const {
            first_name,
            last_name,
            gender,
            date_of_birth,
            aadhar_number,
            pan_number,
            school_id,
            contact,
            professional,
            work_history
        } = req.body;

        // Create teacher instance
        const teacher = teacherRepository.create({
            first_name,
            last_name,
            gender,
            date_of_birth: new Date(date_of_birth),
            aadhar_number,
            pan_number,
            school: { id: school_id }
        });

        // Validate teacher data
        const errors = await validate(teacher);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Save teacher
        const savedTeacher = await teacherRepository.save(teacher);

        // Save contact information if provided
        if (contact) {
            const contactRepo = AppDataSource.getRepository(TeacherContact);
            const teacherContact = contactRepo.create({
                ...contact,
                teacher: savedTeacher
            });
            await contactRepo.save(teacherContact);
        }

        // Save professional information if provided
        if (professional) {
            const professionalRepo = AppDataSource.getRepository(TeacherProfessional);
            const teacherProfessional = professionalRepo.create({
                ...professional,
                teacher: savedTeacher
            });
            await professionalRepo.save(teacherProfessional);
        }

        // Save work history if provided
        if (work_history && work_history.length > 0) {
            const workHistoryRepo = AppDataSource.getRepository(TeacherWorkHistory);
            const workHistoryEntries = work_history.map(entry => 
                workHistoryRepo.create({
                    institutionName: entry.institution_name,
                    designation: entry.designation,
                    startDate: new Date(entry.start_date),
                    endDate: entry.end_date ? new Date(entry.end_date) : undefined,
                    isActive: entry.is_active ?? true,
                    teacher: savedTeacher
                })
            );
            await workHistoryRepo.save(workHistoryEntries);
        }

        // Return teacher with relations
        const teacherWithRelations = await teacherRepository.findOne({
            where: { id: savedTeacher.id },
            relations: {
                contact: true,
                professional_details: true,
                work_history: true,
                qualifications: true,
                financial: true
            }
        });

        return res.status(201).json({
            status: 'success',
            data: teacherWithRelations
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 */
router.get('/:id', checkRole([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER]), async (req: Request<{ id: string }>, res: Response) => {
    try {
        const teacher = await teacherRepository.findOne({
            where: { id: req.params.id },
            relations: {
                contact: true,
                professional_details: true,
                work_history: true,
                qualifications: true,
                financial: true
            }
        });

        if (!teacher) {
            throw new AppError(404, `Teacher with ID ${req.params.id} not found`);
        }

        return res.json({
            status: 'success',
            data: teacher
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', checkRole([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), async (_req: Request, res: Response) => {
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
});

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Update a teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires SUPER_ADMIN or SCHOOL_ADMIN role
 *       404:
 *         description: Teacher not found
 */
router.put('/:id', checkRole([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), async (req: Request<{ id: string }, {}, TeacherRequestBody>, res: Response) => {
    try {
        const teacher = await teacherRepository.findOne({
            where: { id: req.params.id },
            relations: {
                contact: true,
                professional_details: true,
                work_history: true,
                qualifications: true,
                financial: true
            }
        });

        if (!teacher) {
            throw new AppError(404, `Teacher with ID ${req.params.id} not found`);
        }

        const {
            first_name,
            last_name,
            gender,
            date_of_birth,
            aadhar_number,
            pan_number,
            school_id,
            contact,
            professional,
            work_history
        } = req.body;

        // Update teacher basic information
        teacherRepository.merge(teacher, {
            first_name,
            last_name,
            gender,
            date_of_birth: new Date(date_of_birth),
            aadhar_number,
            pan_number,
            school: { id: school_id }
        });

        // Validate updated data
        const errors = await validate(teacher);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const updatedTeacher = await teacherRepository.save(teacher);

        // Update contact information if provided
        if (contact) {
            const contactRepo = AppDataSource.getRepository(TeacherContact);
            if (teacher.contact) {
                await contactRepo.update({ teacher: { id: teacher.id } }, {
                    ...contact,
                    teacher: updatedTeacher
                });
            } else {
                const newContact = contactRepo.create({
                    ...contact,
                    teacher: updatedTeacher
                });
                await contactRepo.save(newContact);
            }
        }

        // Update professional information if provided
        if (professional) {
            const professionalRepo = AppDataSource.getRepository(TeacherProfessional);
            await professionalRepo.delete({ teacher: { id: teacher.id } });
            const newProfessional = professionalRepo.create({
                ...professional,
                teacher: updatedTeacher
            });
            await professionalRepo.save(newProfessional);
        }

        // Update work history if provided
        if (work_history) {
            const workHistoryRepo = AppDataSource.getRepository(TeacherWorkHistory);
            await workHistoryRepo.delete({ teacher: { id: teacher.id } });
            
            if (work_history.length > 0) {
                const workHistoryEntries = work_history.map(entry => 
                    workHistoryRepo.create({
                        institutionName: entry.institution_name,
                        designation: entry.designation,
                        startDate: new Date(entry.start_date),
                        endDate: entry.end_date ? new Date(entry.end_date) : undefined,
                        isActive: entry.is_active ?? true,
                        teacher: updatedTeacher
                    })
                );
                await workHistoryRepo.save(workHistoryEntries);
            }
        }

        // Return updated teacher with relations
        const teacherWithRelations = await teacherRepository.findOne({
            where: { id: updatedTeacher.id },
            relations: {
                contact: true,
                professional_details: true,
                work_history: true,
                qualifications: true,
                financial: true
            }
        });

        return res.json({
            status: 'success',
            data: teacherWithRelations
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires SUPER_ADMIN role
 *       404:
 *         description: Teacher not found
 */
router.delete('/:id', checkRole([UserRole.SUPER_ADMIN]), async (req: Request<{ id: string }>, res: Response) => {
    try {
        const teacher = await teacherRepository.findOne({
            where: { id: req.params.id }
        });

        if (!teacher) {
            throw new AppError(404, `Teacher with ID ${req.params.id} not found`);
        }

        await teacherRepository.remove(teacher);
        return res.json({
            status: 'success',
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        return handleError(error, res);
    }
});

export default router;
