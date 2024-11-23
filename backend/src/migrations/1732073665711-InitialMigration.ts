import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732073665711 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables and types if they exist
        await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_work_history" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_financial" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_qualifications" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_professional" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_contact" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teachers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_fees" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_emergency_contacts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_academics" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "students" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "schools" CASCADE`);

        // Create enum type for user roles
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM (
                'super_admin',
                'school_admin',
                'teacher',
                'student',
                'parent',
                'health_staff'
            )
        `);

        // Create schools table
        await queryRunner.query(`
            CREATE TABLE "schools" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "address" text NOT NULL,
                "contact_number" varchar(50) NOT NULL,
                "email" varchar(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "firstName" varchar(100) NOT NULL,
                "lastName" varchar(100) NOT NULL,
                "email" varchar(100) NOT NULL UNIQUE,
                "password" varchar(100) NOT NULL,
                "role" user_role_enum NOT NULL DEFAULT 'student',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Create students table
        await queryRunner.query(`
            CREATE TABLE "students" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "first_name" varchar(255) NOT NULL,
                "middle_name" varchar(255),
                "last_name" varchar(255) NOT NULL,
                "date_of_birth" date NOT NULL,
                "gender" varchar(50) NOT NULL,
                "grade" varchar(50) NOT NULL DEFAULT '',
                "status" varchar(50) DEFAULT 'active',
                "school_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_student_school" FOREIGN KEY ("school_id") 
                    REFERENCES "schools"("id") ON DELETE CASCADE
            )
        `);

        // Create student_emergency_contacts table
        await queryRunner.query(`
            CREATE TABLE "student_emergency_contacts" (
                "contact_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "student_id" uuid NOT NULL,
                "contact_name" varchar(255) NOT NULL,
                "relationship" varchar(100) NOT NULL,
                "phone_number" varchar(50) NOT NULL,
                "email" varchar(255),
                "home_address" text NOT NULL,
                "alternate_contact_name" varchar(255),
                "alternate_contact_relationship" varchar(100),
                "alternate_contact_number" varchar(50),
                "communication_preference" varchar(50),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_student_emergency" FOREIGN KEY ("student_id") 
                    REFERENCES "students"("id") ON DELETE CASCADE
            )
        `);

        // Create student_academics table
        await queryRunner.query(`
            CREATE TABLE "student_academics" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "student_id" uuid NOT NULL,
                "previous_school" varchar(255),
                "academic_year" varchar(50) NOT NULL,
                "current_grade" varchar(50) NOT NULL,
                "class_section" varchar(50),
                "achievements" text,
                "extra_curricular" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_student_academic" FOREIGN KEY ("student_id") 
                    REFERENCES "students"("id") ON DELETE CASCADE
            )
        `);

        // Create student_medicals table
        await queryRunner.query(`
            CREATE TABLE "student_medicals" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "student_id" uuid NOT NULL,
                "blood_group" varchar(10),
                "medical_conditions" text,
                "allergies" text,
                "medications" text,
                "doctor_name" varchar(255),
                "doctor_contact" varchar(50),
                "insurance_info" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_student_medical" FOREIGN KEY ("student_id") 
                    REFERENCES "students"("id") ON DELETE CASCADE
            )
        `);

        // Create student_fees table
        await queryRunner.query(`
            CREATE TABLE "student_fees" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "student_id" uuid NOT NULL,
                "fee_type" varchar(100) NOT NULL,
                "amount" decimal(10,2) NOT NULL,
                "due_date" date NOT NULL,
                "payment_status" varchar(50) NOT NULL DEFAULT 'pending',
                "payment_method" varchar(50),
                "payment_date" date,
                "receipt_number" varchar(100),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_student_fee" FOREIGN KEY ("student_id") 
                    REFERENCES "students"("id") ON DELETE CASCADE
            )
        `);

        // Create teachers table
        await queryRunner.query(`
            CREATE TABLE "teachers" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "first_name" varchar(50) NOT NULL,
                "last_name" varchar(50) NOT NULL,
                "gender" char(1) CHECK (gender IN ('M', 'F', 'O')),
                "date_of_birth" date NOT NULL,
                "aadhar_number" char(12) UNIQUE NOT NULL,
                "pan_number" char(10) UNIQUE,
                "photo_url" varchar(255),
                "photo_public_id" varchar(255),
                "school_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_teacher_school" FOREIGN KEY ("school_id") 
                    REFERENCES "schools"("id") ON DELETE CASCADE
            )
        `);

        // Create teacher_contact table
        await queryRunner.query(`
            CREATE TABLE "teacher_contact" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "teacher_id" uuid NOT NULL,
                "current_address" text NOT NULL,
                "permanent_address" text,
                "phone_number" varchar(15) UNIQUE NOT NULL,
                "email" varchar(100) UNIQUE NOT NULL,
                "emergency_contact" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_contact_teacher" FOREIGN KEY ("teacher_id") 
                    REFERENCES "teachers"("id") ON DELETE CASCADE
            )
        `);

        // Create teacher_professional table
        await queryRunner.query(`
            CREATE TABLE "teacher_professional" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "teacher_id" uuid NOT NULL,
                "designation" varchar(50),
                "subjects_taught" text[],
                "classes_assigned" text[],
                "joining_date" date,
                "total_experience" integer,
                "specialization" varchar(100),
                "is_active" boolean DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_professional_teacher" FOREIGN KEY ("teacher_id") 
                    REFERENCES "teachers"("id") ON DELETE CASCADE
            )
        `);

        // Create teacher_qualifications table
        await queryRunner.query(`
            CREATE TABLE "teacher_qualifications" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "teacher_id" uuid NOT NULL,
                "degree" varchar(100) NOT NULL,
                "institution" varchar(255) NOT NULL,
                "year_of_completion" integer NOT NULL,
                "specialization" varchar(100),
                "achievements" text,
                "certifications" text[],
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_qualification_teacher" FOREIGN KEY ("teacher_id") 
                    REFERENCES "teachers"("id") ON DELETE CASCADE
            )
        `);

        // Create teacher_financial table
        await queryRunner.query(`
            CREATE TABLE "teacher_financial" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "teacher_id" uuid NOT NULL UNIQUE,
                "bank_account_number" varchar(20) UNIQUE NOT NULL,
                "bank_name" varchar(50) NOT NULL,
                "ifsc_code" varchar(11) NOT NULL,
                "salary" numeric(10,2),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_financial_teacher" FOREIGN KEY ("teacher_id") 
                    REFERENCES "teachers"("id") ON DELETE CASCADE
            )
        `);

        // Create teacher_medicals table
        await queryRunner.query(`
            CREATE TABLE "teacher_medicals" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "teacher_id" uuid NOT NULL UNIQUE,
                "blood_group" varchar(3) NOT NULL,
                "medical_conditions" text,
                "health_insurance" varchar(100),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_medical_teacher" FOREIGN KEY ("teacher_id") 
                    REFERENCES "teachers"("id") ON DELETE CASCADE
            )
        `);

        // Create teacher_work_history table
        await queryRunner.query(`
            CREATE TABLE "teacher_work_history" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "teacher_id" uuid NOT NULL,
                "institution_name" varchar(100) NOT NULL,
                "designation" varchar(50),
                "start_date" date NOT NULL,
                "end_date" date,
                "is_active" boolean DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_work_history_teacher" FOREIGN KEY ("teacher_id") 
                    REFERENCES "teachers"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_work_history" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_financial" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_qualifications" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_professional" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_contact" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teachers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_fees" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_emergency_contacts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_academics" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "students" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "schools" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum" CASCADE`);
    }
}
