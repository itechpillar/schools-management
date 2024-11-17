import { DataSource } from 'typeorm';
import { Student } from '../entities/Student';
import { StudentAcademic } from '../entities/StudentAcademic';
import { StudentMedical } from '../entities/StudentMedical';
import { StudentEmergencyContact } from '../entities/StudentEmergencyContact';
import { StudentFee } from '../entities/StudentFee';
import { School } from '../entities/School';
import { User } from '../entities/User';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: isTest ? 'school_management_test' : (process.env.DB_NAME || 'school_management'),
    entities: [Student, StudentAcademic, StudentMedical, StudentEmergencyContact, StudentFee, School, User],
    migrations: [
        'src/migrations/*.ts'
    ],
    synchronize: false,
    logging: true
});

export default AppDataSource;
