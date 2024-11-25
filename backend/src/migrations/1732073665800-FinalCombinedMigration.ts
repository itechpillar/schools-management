import { MigrationInterface, QueryRunner } from "typeorm";

export class FinalCombinedMigration1732073665800 implements MigrationInterface {
    name = 'FinalCombinedMigration1732073665800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables if they exist
        await queryRunner.query(`DROP TABLE IF EXISTS student_fees CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS student_emergency_contacts CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS student_medicals CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS student_academics CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS students CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS schools CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS user_roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);

        // Create roles table
        await queryRunner.query(`
            CREATE TABLE roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                permissions JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                school_id UUID,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create user_roles junction table
        await queryRunner.query(`
            CREATE TABLE user_roles (
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, role_id)
            )
        `);

        // Create schools table
        await queryRunner.query(`
            CREATE TABLE schools (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                address TEXT,
                phone VARCHAR(50),
                email VARCHAR(255),
                website VARCHAR(255),
                principal_name VARCHAR(255),
                contact_number VARCHAR(50),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add foreign key for school_id in users table
        await queryRunner.query(`
            ALTER TABLE users
            ADD CONSTRAINT fk_user_school
            FOREIGN KEY (school_id)
            REFERENCES schools(id)
            ON DELETE SET NULL
        `);

        // Create students table
        await queryRunner.query(`
            CREATE TABLE students (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                first_name VARCHAR(255) NOT NULL,
                middle_name VARCHAR(255),
                last_name VARCHAR(255) NOT NULL,
                date_of_birth DATE,
                gender VARCHAR(50),
                photo_url VARCHAR(255),
                photo_public_id VARCHAR(255),
                school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
                grade VARCHAR(50),
                parent_email VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create student_academics table
        await queryRunner.query(`
            CREATE TABLE student_academics (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                academic_year VARCHAR(50) NOT NULL,
                grade VARCHAR(50) NOT NULL,
                section VARCHAR(50) NOT NULL,
                roll_number VARCHAR(50),
                subjects JSONB,
                attendance_percentage DECIMAL(5,2),
                exam_scores JSONB,
                extracurricular_activities JSONB,
                class_teacher_remarks TEXT,
                previous_school VARCHAR(255),
                admission_date DATE,
                board VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create student_medicals table with simplified structure
        await queryRunner.query(`
            CREATE TABLE student_medicals (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                blood_group VARCHAR(10),
                medical_conditions TEXT,
                allergies TEXT,
                emergency_contact TEXT,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create student_emergency_contacts table
        await queryRunner.query(`
            CREATE TABLE student_emergency_contacts (
                contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                contact_name VARCHAR(255) NOT NULL,
                relationship VARCHAR(255),
                phone_number VARCHAR(50),
                email VARCHAR(255),
                home_address TEXT,
                alternate_contact_name VARCHAR(255),
                alternate_contact_relationship VARCHAR(255),
                alternate_contact_number VARCHAR(50),
                communication_preference VARCHAR(50),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create student_fees table
        await queryRunner.query(`
            CREATE TABLE student_fees (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                fee_type VARCHAR(50) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                due_date DATE,
                payment_date DATE,
                payment_method VARCHAR(50),
                payment_status VARCHAR(50) DEFAULT 'pending',
                transaction_id VARCHAR(255),
                receipt_number VARCHAR(255),
                academic_year VARCHAR(50),
                term VARCHAR(50),
                description TEXT,
                late_fee DECIMAL(10,2),
                discount DECIMAL(10,2),
                total_amount DECIMAL(10,2),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add indexes for better query performance
        await queryRunner.query(`CREATE INDEX idx_student_school ON students(school_id)`);
        await queryRunner.query(`CREATE INDEX idx_student_status ON students(status)`);
        await queryRunner.query(`CREATE INDEX idx_student_grade ON students(grade)`);
        await queryRunner.query(`CREATE INDEX idx_student_parent_email ON students(parent_email)`);
        await queryRunner.query(`CREATE INDEX idx_academic_student ON student_academics(student_id)`);
        await queryRunner.query(`CREATE INDEX idx_medical_student ON student_medicals(student_id)`);
        await queryRunner.query(`CREATE INDEX idx_emergency_student ON student_emergency_contacts(student_id)`);
        await queryRunner.query(`CREATE INDEX idx_fees_student ON student_fees(student_id)`);
        await queryRunner.query(`CREATE INDEX idx_fees_status ON student_fees(payment_status)`);
        await queryRunner.query(`CREATE INDEX idx_user_email ON users(email)`);
        await queryRunner.query(`CREATE INDEX idx_user_school ON users(school_id)`);
        await queryRunner.query(`CREATE INDEX idx_school_status ON schools(status)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all tables in reverse order
        await queryRunner.query(`DROP TABLE IF EXISTS student_fees CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS student_emergency_contacts CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS student_medicals CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS student_academics CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS students CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS schools CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS user_roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);
    }
}
