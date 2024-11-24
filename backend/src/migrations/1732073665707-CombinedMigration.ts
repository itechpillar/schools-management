import { MigrationInterface, QueryRunner } from "typeorm";

export class CombinedMigration1732073665708 implements MigrationInterface {
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
                school_id UUID REFERENCES schools(id),
                grade VARCHAR(50),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create student_academics table
        await queryRunner.query(`
            CREATE TABLE student_academics (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id),
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

        // Create student_medicals table
        await queryRunner.query(`
            CREATE TABLE student_medicals (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id),
                blood_group VARCHAR(50),
                medical_conditions TEXT,
                allergies TEXT,
                medications TEXT,
                immunizations TEXT,
                emergency_contact_name VARCHAR(255),
                emergency_contact_number VARCHAR(50),
                family_doctor_name VARCHAR(255),
                family_doctor_number VARCHAR(50),
                preferred_hospital VARCHAR(255),
                medical_insurance VARCHAR(255),
                special_needs TEXT,
                dietary_restrictions TEXT,
                physical_disabilities TEXT,
                last_physical_exam DATE,
                additional_notes TEXT,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create student_emergency_contacts table
        await queryRunner.query(`
            CREATE TABLE student_emergency_contacts (
                contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id),
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
                student_id UUID REFERENCES students(id),
                fee_type VARCHAR(50) NOT NULL,
                academic_year VARCHAR(50),
                term VARCHAR(50),
                amount DECIMAL(10,2),
                amount_paid DECIMAL(10,2),
                balance DECIMAL(10,2),
                due_date DATE,
                payment_status VARCHAR(50),
                payment_method VARCHAR(50),
                transaction_id VARCHAR(255),
                receipt_number VARCHAR(255),
                remarks TEXT,
                payment_date DATE,
                collected_by VARCHAR(255),
                is_cancelled BOOLEAN DEFAULT false,
                cancellation_reason TEXT,
                payment_history TEXT,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create roles table
        await queryRunner.query(`
            CREATE TABLE roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                permissions JSONB,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                school_id UUID REFERENCES schools(id),
                status VARCHAR(50) DEFAULT 'active',
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create user_roles junction table
        await queryRunner.query(`
            CREATE TABLE user_roles (
                user_id UUID REFERENCES users(id),
                role_id UUID REFERENCES roles(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, role_id)
            )
        `);

        // Insert default roles
        await queryRunner.query(`
            INSERT INTO roles (name, description, permissions) VALUES
            ('super_admin', 'Super Administrator with full system access', '{"all": true}'::jsonb),
            ('school_admin', 'School Administrator with full school access', '{"school": true, "users": true, "students": true}'::jsonb),
            ('teacher', 'Teacher with limited access', '{"students": {"view": true, "edit": true}}'::jsonb),
            ('staff', 'Staff member with basic access', '{"students": {"view": true}}'::jsonb)
        `);
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
