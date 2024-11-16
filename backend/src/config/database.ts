import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { School } from '../models/School';
import { CreateSchoolsTable1699000000000 } from '../migrations/1699000000000-CreateSchoolsTable';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'nvoruganti',
  password: process.env.DB_PASSWORD || '',
  database: isTest ? 'school_management_test' : 'school_management',
  synchronize: false,
  logging: true,
  entities: [User, School],
  subscribers: [],
  migrations: [CreateSchoolsTable1699000000000],
});

export default AppDataSource;
