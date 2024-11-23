import { Router } from 'express';
import { checkRole } from '../middleware/checkRole';
import { School } from '../entities/School';
import AppDataSource from '../config/database';
import { Request, Response } from 'express';
import { UserRole } from '../entities/User';
import { validate } from 'class-validator';
import { handleError, AppError } from '../utils/errorHandler';

const router = Router();
const schoolRepository = AppDataSource.getRepository(School);

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get all schools
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all schools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/School'
 */
router.get('/', checkRole([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), async (_req: Request, res: Response) => {
    try {
        const schools = await schoolRepository.find({
            relations: {
                teachers: true,
                students: true
            }
        });

        return res.json({
            status: 'success',
            data: schools
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School found
 *       404:
 *         description: School not found
 */
router.get('/:id', checkRole([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN]), async (req: Request<{ id: string }>, res: Response) => {
    try {
        const school = await schoolRepository.findOne({
            where: { id: req.params.id },
            relations: {
                teachers: true,
                students: true
            }
        });

        if (!school) {
            throw new AppError(404, `School with ID ${req.params.id} not found`);
        }

        return res.json({
            status: 'success',
            data: school
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolInput'
 *     responses:
 *       201:
 *         description: School created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', checkRole([UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
    try {
        const school = schoolRepository.create(req.body);
        
        const validationErrors = await validate(school);
        if (validationErrors.length > 0) {
            throw validationErrors;
        }

        const savedSchool = await schoolRepository.save(school);

        return res.status(201).json({
            status: 'success',
            message: 'School created successfully',
            data: savedSchool
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Update a school
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolInput'
 *     responses:
 *       200:
 *         description: School updated successfully
 *       404:
 *         description: School not found
 */
router.put('/:id', checkRole([UserRole.SUPER_ADMIN]), async (req: Request<{ id: string }>, res: Response) => {
    try {
        const school = await schoolRepository.findOne({
            where: { id: req.params.id }
        });

        if (!school) {
            throw new AppError(404, `School with ID ${req.params.id} not found`);
        }

        const updatedSchool = schoolRepository.create({
            ...school,
            ...req.body
        });

        const validationErrors = await validate(updatedSchool);
        if (validationErrors.length > 0) {
            throw validationErrors;
        }

        const savedSchool = await schoolRepository.save(updatedSchool);

        return res.json({
            status: 'success',
            message: 'School updated successfully',
            data: savedSchool
        });
    } catch (error) {
        return handleError(error, res);
    }
});

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Delete a school
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       404:
 *         description: School not found
 */
router.delete('/:id', checkRole([UserRole.SUPER_ADMIN]), async (req: Request<{ id: string }>, res: Response) => {
    try {
        const school = await schoolRepository.findOne({
            where: { id: req.params.id }
        });

        if (!school) {
            throw new AppError(404, `School with ID ${req.params.id} not found`);
        }

        await schoolRepository.remove(school);

        return res.json({
            status: 'success',
            message: 'School deleted successfully'
        });
    } catch (error) {
        return handleError(error, res);
    }
});

export default router;
