import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { School } from '../entities/School';
import { AppError } from '../utils/appError';

const schoolRepository = AppDataSource.getRepository(School);

export const createSchool = async (req: Request, res: Response) => {
  try {
    console.log('Creating school with data:', req.body);
    const { name, address, contactNumber, email } = req.body;

    if (!name || !address || !contactNumber) {
      throw new AppError(400, 'Missing required fields');
    }

    const school = new School();
    school.name = name;
    school.address = address;
    school.contactNumber = contactNumber;
    school.email = email;

    console.log('School object before save:', school);
    const savedSchool = await schoolRepository.save(school);
    console.log('School saved successfully:', savedSchool);

    return res.status(201).json({
      status: 'success',
      data: savedSchool,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating school:', error);
      console.error('Error stack:', error.stack);
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: 'error',
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
};

export const getAllSchools = async (_req: Request, res: Response) => {
  try {
    console.log('Fetching all schools...');
    console.log('User from request:', _req.user); // Log the authenticated user
    const schools = await schoolRepository.find();
    console.log('Number of schools found:', schools.length);
    console.log('Schools data:', JSON.stringify(schools, null, 2));
    return res.status(200).json({
      status: 'success',
      data: schools,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching schools:', error);
      console.error('Error stack:', error.stack);
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: 'error',
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
};

export const getSchoolById = async (req: Request, res: Response) => {
  try {
    console.log('Fetching school by id...');
    const { id } = req.params;
    const school = await schoolRepository.findOne({ where: { id } });

    if (!school) {
      throw new AppError(404, 'School not found');
    }

    console.log('School fetched:', school);
    return res.status(200).json({
      status: 'success',
      data: school,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching school:', error);
      console.error('Error stack:', error.stack);
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: 'error',
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
};

export const updateSchool = async (req: Request, res: Response) => {
  try {
    console.log('Updating school with data:', req.body);
    const { id } = req.params;
    const { name, address, contactNumber, email } = req.body;

    const school = await schoolRepository.findOne({ where: { id } });

    if (!school) {
      throw new AppError(404, 'School not found');
    }

    if (name) school.name = name;
    if (address) school.address = address;
    if (contactNumber) school.contactNumber = contactNumber;
    if (email) school.email = email;

    console.log('School object before save:', school);
    const updatedSchool = await schoolRepository.save(school);
    console.log('School updated successfully:', updatedSchool);

    return res.status(200).json({
      status: 'success',
      data: updatedSchool,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating school:', error);
      console.error('Error stack:', error.stack);
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: 'error',
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
};

export const deleteSchool = async (req: Request, res: Response) => {
  try {
    console.log('Deleting school...');
    const { id } = req.params;
    const school = await schoolRepository.findOne({ where: { id } });

    if (!school) {
      throw new AppError(404, 'School not found');
    }

    console.log('School object before delete:', school);
    await schoolRepository.remove(school);
    console.log('School deleted successfully:', id);

    return res.status(200).json({
      status: 'success',
      message: 'School deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting school:', error);
      console.error('Error stack:', error.stack);
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: 'error',
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
};
