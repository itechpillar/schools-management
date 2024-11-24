import AppDataSource from '../config/database';
import { Role } from '../entities/Role';
import { UserRole } from '../entities/User';

const roles = [
  {
    name: UserRole.SUPER_ADMIN,
    description: 'Super administrator with full system access',
  },
  {
    name: UserRole.SCHOOL_ADMIN,
    description: 'School administrator with access to school-specific data',
  },
  {
    name: UserRole.TEACHER,
    description: 'Teacher with access to class and student data',
  },
  {
    name: UserRole.STUDENT,
    description: 'Student with access to their own data',
  },
  {
    name: UserRole.PARENT,
    description: 'Parent with access to their children\'s data',
  },
  {
    name: UserRole.HEALTH_STAFF,
    description: 'Health staff with access to student medical data',
  },
];

const seedRoles = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    const roleRepository = AppDataSource.getRepository(Role);

    // Create roles if they don't exist
    for (const roleData of roles) {
      const existingRole = await roleRepository.findOne({
        where: { name: roleData.name }
      });

      if (!existingRole) {
        console.log(`Creating role: ${roleData.name}`);
        const role = roleRepository.create(roleData);
        await roleRepository.save(role);
        console.log(`Role ${roleData.name} created successfully`);
      } else {
        console.log(`Role ${roleData.name} already exists`);
      }
    }

    console.log('Roles seeding completed successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  }
};

// Run the seed
seedRoles();
