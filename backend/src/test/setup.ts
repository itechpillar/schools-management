import { DataSource } from 'typeorm';
<<<<<<< Updated upstream
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
=======
import { User } from '../entities/user.entity';
import { School } from '../entities/school.entity';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';
import { StudentEmergencyContact } from '../entities/student-emergency-contact.entity';
import { StudentAcademic } from '../entities/student-academic.entity';
import { StudentMedical } from '../entities/student-medical.entity';
import { StudentFee } from '../entities/student-fee.entity';
import { TeacherContact } from '../entities/teacher-contact.entity';
import { TeacherProfessional } from '../entities/teacher-professional.entity';
import { TeacherQualifications } from '../entities/teacher-qualifications.entity';
import { TeacherFinancial } from '../entities/teacher-financial.entity';
import { TeacherMedicals } from '../entities/teacher-medicals.entity';
import { TeacherWorkHistory } from '../entities/teacher-work-history.entity';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    StudentFee,
    StudentAcademic,
    StudentMedical,
    StudentEmergencyContact,
=======
    StudentEmergencyContact,
    StudentAcademic,
    StudentMedical,
    StudentFee,
>>>>>>> Stashed changes
    TeacherContact,
    TeacherProfessional,
    TeacherQualifications,
    TeacherFinancial,
    TeacherMedicals,
    TeacherWorkHistory
  ],
  logging: false,
});
