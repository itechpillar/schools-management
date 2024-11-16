import { DataSource } from 'typeorm';
import { User } from '../models/User';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'school_management_test',
  synchronize: true,
  dropSchema: true,
  entities: [User],
  logging: false,
});
