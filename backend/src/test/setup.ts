import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { School } from '../entities/School';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';
import { StudentFee } from '../entities/StudentFee';
import { StudentAcademic } from '../entities/StudentAcademic';
import { StudentMedical } from '../entities/StudentMedical';
import { StudentEmergencyContact } from '../entities/StudentEmergencyContact';
import { TeacherContact } from '../entities/TeacherContact';
import { TeacherProfessional } from '../entities/TeacherProfessional';
import { TeacherQualifications } from '../entities/TeacherQualifications';
import { TeacherFinancial } from '../entities/TeacherFinancial';
import { TeacherMedicals } from '../entities/TeacherMedicals';
import { TeacherWorkHistory } from '../entities/TeacherWorkHistory';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'school_management_test',
  synchronize: true,
  dropSchema: true,
  entities: [
    User,
    School,
    Student,
    Teacher,
    StudentFee,
    StudentAcademic,
    StudentMedical,
    StudentEmergencyContact,
    TeacherContact,
    TeacherProfessional,
    TeacherQualifications,
    TeacherFinancial,
    TeacherMedicals,
    TeacherWorkHistory
  ],
  logging: false,
});
