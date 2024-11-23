import AppDataSource from '../config/database';
import { User, UserRole } from '../entities/User';
import * as bcrypt from 'bcrypt';

const createSuperAdmin = async () => {
    try {
        // Initialize the database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const userRepository = AppDataSource.getRepository(User);

        // First, let's check if super admin exists and log their details
        const existingSuperAdmin = await userRepository.findOne({
            where: { role: UserRole.SUPER_ADMIN }
        });

        if (existingSuperAdmin) {
            console.log('Existing Super Admin found:');
            console.log('Email:', existingSuperAdmin.email);
            // Don't log the actual password
            console.log('Has password:', !!existingSuperAdmin.password);
        } else {
            console.log('No Super Admin found. Creating one...');
            
            // Create new super admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const superAdmin = new User();
            superAdmin.firstName = 'Admin';
            superAdmin.lastName = 'User';
            superAdmin.email = 'admin@admin.com';
            superAdmin.password = hashedPassword;
            superAdmin.role = UserRole.SUPER_ADMIN;

            await userRepository.save(superAdmin);
            console.log('Super Admin created successfully with:');
            console.log('Email: admin@admin.com');
            console.log('Password: admin123');
        }

        // List all users
        const allUsers = await userRepository.find();
        console.log('\nAll users in database:');
        allUsers.forEach(user => {
            console.log(`- ${user.email} (${user.role})`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the database connection
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
};

// Run the function
createSuperAdmin();
