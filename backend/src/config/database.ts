import { DataSource } from 'typeorm';
<<<<<<< Updated upstream
import { Student } from '../entities/Student';
import { StudentAcademic } from '../entities/StudentAcademic';
import { StudentMedical } from '../entities/StudentMedical';
import { StudentEmergencyContact } from '../entities/StudentEmergencyContact';
import { StudentFee } from '../entities/StudentFee';
import { School } from '../entities/School';
import { User } from '../entities/User';
import { Teacher } from '../entities/Teacher';
import { TeacherContact } from '../entities/TeacherContact';
import { TeacherProfessional } from '../entities/TeacherProfessional';
import { TeacherQualifications } from '../entities/TeacherQualifications';
import { TeacherFinancial } from '../entities/TeacherFinancial';
import { TeacherMedicals } from '../entities/TeacherMedicals';
import { TeacherWorkHistory } from '../entities/TeacherWorkHistory';
=======
import { Student } from '../entities/student.entity';
import { StudentAcademic } from '../entities/student-academic.entity';
import { StudentMedical } from '../entities/student-medical.entity';
import { StudentEmergencyContact } from '../entities/student-emergency-contact.entity';
import { StudentFee } from '../entities/student-fee.entity';
import { School } from '../entities/school.entity';
import { User } from '../entities/user.entity';
import { Teacher } from '../entities/teacher.entity';
import { TeacherContact } from '../entities/teacher-contact.entity';
import { TeacherProfessional } from '../entities/teacher-professional.entity';
import { TeacherQualifications } from '../entities/teacher-qualifications.entity';
import { TeacherFinancial } from '../entities/teacher-financial.entity';
import { TeacherMedicals } from '../entities/teacher-medicals.entity';
import { TeacherWorkHistory } from '../entities/teacher-work-history.entity';
>>>>>>> Stashed changes
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'nvoruganti',
    password: process.env.DB_PASSWORD || '',
    database: isTest ? 'school_management_test' : (process.env.DB_NAME || 'school_management'),
    entities: [
<<<<<<< Updated upstream
        Student, 
        StudentAcademic, 
        StudentMedical, 
        StudentEmergencyContact, 
        StudentFee, 
        School, 
=======
        Student,
        StudentAcademic,
        StudentMedical,
        StudentEmergencyContact,
        StudentFee,
        School,
>>>>>>> Stashed changes
        User,
        Teacher,
        TeacherContact,
        TeacherProfessional,
        TeacherQualifications,
        TeacherFinancial,
        TeacherMedicals,
        TeacherWorkHistory
    ],
    migrations: [
        'src/migrations/*.ts'
    ],
    synchronize: false,
    logging: true
});

export default AppDataSource;
