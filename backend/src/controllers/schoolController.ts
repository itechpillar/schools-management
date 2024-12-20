import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { School } from '../models/School';

const schoolRepository = AppDataSource.getRepository(School);

export const createSchool = async (req: Request, res: Response) => {
  try {
    console.log('Creating school with data:', req.body);
    const { name, address, contactNumber, email } = req.body;

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
    console.error('Error creating school:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error creating school',
    });
  }
};

export const getAllSchools = async (_req: Request, res: Response) => {
  try {
    console.log('Fetching all schools...');
    const schools = await schoolRepository.find();
    console.log('Schools fetched:', schools);
    return res.status(200).json({
      status: 'success',
      data: schools,
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error fetching schools',
    });
  }
};

export const getSchoolById = async (req: Request, res: Response) => {
  try {
    console.log('Fetching school by id...');
    const { id } = req.params;
    const school = await schoolRepository.findOne({ where: { id } });

    if (!school) {
      console.log('School not found:', id);
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    console.log('School fetched:', school);
    return res.status(200).json({
      status: 'success',
      data: school,
    });
  } catch (error) {
    console.error('Error fetching school:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error fetching school',
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
      console.log('School not found:', id);
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    school.name = name;
    school.address = address;
    school.contactNumber = contactNumber;
    school.email = email;

    console.log('School object before save:', school);
    await schoolRepository.save(school);
    console.log('School updated successfully:', school);

    return res.status(200).json({
      status: 'success',
      data: school,
    });
  } catch (error) {
    console.error('Error updating school:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error updating school',
    });
  }
};

export const deleteSchool = async (req: Request, res: Response) => {
  try {
    console.log('Deleting school...');
    const { id } = req.params;
    const school = await schoolRepository.findOne({ where: { id } });

    if (!school) {
      console.log('School not found:', id);
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    console.log('School object before delete:', school);
    await schoolRepository.remove(school);
    console.log('School deleted successfully:', id);

    return res.status(200).json({
      status: 'success',
      message: 'School deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting school:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error deleting school',
    });
  }
};
