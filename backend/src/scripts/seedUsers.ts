import AppDataSource from '../config/database';
import { User, UserRole } from '../models/User';

const seedUsers = async () => {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    // Check if super admin exists
    const existingSuperAdmin = await userRepository.findOne({
      where: { role: UserRole.SUPER_ADMIN }
    });

    if (!existingSuperAdmin) {
      console.log('Creating super admin user...');
      const superAdmin = new User();
      superAdmin.firstName = 'Super';
      superAdmin.lastName = 'Admin';
      superAdmin.email = 'admin@school.com';
      superAdmin.password = 'admin123';
      superAdmin.role = UserRole.SUPER_ADMIN;
      await userRepository.save(superAdmin);
      console.log('Super admin created successfully');
    } else {
      console.log('Super admin already exists');
    }

    // Create test users for other roles if they don't exist
    const testUsers = [
      {
        firstName: 'Test',
        lastName: 'Teacher',
        email: 'teacher@school.com',
        password: 'teacher123',
        role: UserRole.TEACHER
      },
      {
        firstName: 'Test',
        lastName: 'Student',
        email: 'student@school.com',
        password: 'student123',
        role: UserRole.STUDENT
      }
    ];

    for (const testUser of testUsers) {
      const existingUser = await userRepository.findOne({
        where: { email: testUser.email }
      });

      if (!existingUser) {
        console.log(`Creating ${testUser.role} user...`);
        const user = new User();
        Object.assign(user, testUser);
        await userRepository.save(user);
        console.log(`${testUser.role} user created successfully`);
      } else {
        console.log(`${testUser.role} user already exists`);
      }
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await AppDataSource.destroy();
  }
};

// Run the seed
seedUsers();
