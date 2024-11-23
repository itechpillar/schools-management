import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { School } from '../entities/School';

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
    console.log('User from request:', _req.user);
    
    const schools = await schoolRepository.find({
      relations: {
        teachers: true,
        students: true
      },
      select: {
        id: true,
        name: true,
        address: true,
        contactNumber: true,
        email: true,
        teachers: {
          id: true,
          first_name: true,
          last_name: true,
          gender: true,
          photo_url: true
        },
        students: {
          id: true,
          firstName: true,
          lastName: true,
          grade: true,
          photoUrl: true
        }
      }
    });
    
    console.log('Number of schools found:', schools.length);
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
    const { id } = req.params;
    const school = await schoolRepository.findOne({
      where: { id },
      relations: {
        teachers: true,
        students: true
      },
      select: {
        id: true,
        name: true,
        address: true,
        contactNumber: true,
        email: true,
        teachers: {
          id: true,
          first_name: true,
          last_name: true,
          gender: true,
          photo_url: true
        },
        students: {
          id: true,
          firstName: true,
          lastName: true,
          grade: true,
          photoUrl: true
        }
      }
    });

    if (!school) {
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: school,
    });
  } catch (error) {
    console.error('Error fetching school:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error fetching school',
    });
  }
};

export const updateSchool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, contactNumber, email } = req.body;

    const school = await schoolRepository.findOne({ where: { id } });
    if (!school) {
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    school.name = name || school.name;
    school.address = address || school.address;
    school.contactNumber = contactNumber || school.contactNumber;
    school.email = email || school.email;

    const updatedSchool = await schoolRepository.save(school);
    return res.status(200).json({
      status: 'success',
      data: updatedSchool,
    });
  } catch (error) {
    console.error('Error updating school:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error updating school',
    });
  }
};

export const deleteSchool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const school = await schoolRepository.findOne({ where: { id } });

    if (!school) {
      return res.status(404).json({
        status: 'error',
        message: 'School not found',
      });
    }

    await schoolRepository.remove(school);
    return res.status(200).json({
      status: 'success',
      message: 'School deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting school:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error deleting school',
    });
  }
};
