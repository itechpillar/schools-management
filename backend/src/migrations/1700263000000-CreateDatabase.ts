import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1700263000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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
                "name" varchar NOT NULL,
                "address" varchar NOT NULL,
                "contact_number" varchar NOT NULL,
                "email" varchar NOT NULL,
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
                "first_name" varchar NOT NULL,
                "middle_name" varchar,
                "last_name" varchar NOT NULL,
                "date_of_birth" date NOT NULL,
                "gender" varchar NOT NULL,
                "status" varchar NOT NULL DEFAULT 'active',
                "photo" bytea,
                "photo_content_type" varchar,
                "school_id" uuid NOT NULL,
                "grade" varchar,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_student_school" FOREIGN KEY ("school_id") 
                    REFERENCES "schools"("id") ON DELETE CASCADE
            )
        `);

        // Create student_emergency_contacts table
        await queryRunner.query(`
            CREATE TABLE "student_emergency_contacts" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "student_id" uuid NOT NULL UNIQUE,
                "contact_name" varchar NOT NULL,
                "relationship" varchar NOT NULL,
                "phone_number" varchar NOT NULL,
                "email" varchar,
                "home_address" varchar NOT NULL,
                "alternate_contact_name" varchar,
                "alternate_contact_relationship" varchar,
                "alternate_contact_number" varchar,
                "communication_preference" varchar,
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
                "student_id" uuid NOT NULL UNIQUE,
                "previous_school" varchar,
                "academic_year" varchar NOT NULL,
                "current_grade" varchar NOT NULL,
                "class_section" varchar,
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
                "student_id" uuid NOT NULL UNIQUE,
                "blood_group" varchar,
                "medical_conditions" text,
                "allergies" text,
                "medications" text,
                "doctor_name" varchar,
                "doctor_contact" varchar,
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
                "fee_type" varchar NOT NULL,
                "amount" decimal(10,2) NOT NULL,
                "due_date" date NOT NULL,
                "payment_status" varchar NOT NULL DEFAULT 'pending',
                "payment_method" varchar,
                "payment_date" date,
                "receipt_number" varchar,
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
                "photo" bytea,
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
                "qualification_type" varchar(50),
                "degree" varchar(100),
                "institution" varchar(200),
                "specialization" varchar(100),
                "year_of_passing" integer,
                "percentage" decimal(5,2),
                "documents" jsonb,
                "is_active" boolean DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_qualifications_teacher" FOREIGN KEY ("teacher_id") 
                    REFERENCES "teachers"("id") ON DELETE CASCADE
            )
        `);

        // Create teacher_financial table
        await queryRunner.query(`
            CREATE TABLE "teacher_financial" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "teacher_id" uuid NOT NULL,
                "bank_account_number" varchar(20) UNIQUE NOT NULL,
                "bank_name" varchar(50) NOT NULL,
                "ifsc_code" char(11) NOT NULL,
                "salary" numeric(10, 2),
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
                "teacher_id" uuid NOT NULL,
                "blood_group" char(3) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
                "medical_conditions" text,
                "health_insurance" varchar(100),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_health_teacher" FOREIGN KEY ("teacher_id") 
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
                    REFERENCES "teachers"("id") ON DELETE CASCADE,
                CONSTRAINT "check_work_history_dates" CHECK (end_date >= start_date OR end_date IS NULL)
            )
        `);

        // Create indexes
        // Schools indexes
        await queryRunner.query(`CREATE INDEX "idx_school_name" ON "schools"("name")`);

        // Users indexes
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "users"("email")`);
        await queryRunner.query(`CREATE INDEX "idx_user_role" ON "users"("role")`);
        await queryRunner.query(`CREATE INDEX "idx_user_name" ON "users"("firstName", "lastName")`);

        // Students indexes
        await queryRunner.query(`CREATE INDEX "idx_student_school" ON "students"("school_id")`);
        await queryRunner.query(`CREATE INDEX "idx_student_name" ON "students"("first_name", "last_name")`);
        await queryRunner.query(`CREATE INDEX "idx_student_status" ON "students"("status")`);
        await queryRunner.query(`CREATE INDEX "idx_student_grade" ON "students"("grade")`);

        // Fees indexes
        await queryRunner.query(`CREATE INDEX "idx_student_fee_status" ON "student_fees"("payment_status")`);
        await queryRunner.query(`CREATE INDEX "idx_student_fee_type" ON "student_fees"("fee_type")`);
        await queryRunner.query(`CREATE INDEX "idx_student_fee_due_date" ON "student_fees"("due_date")`);

        // Teachers and related tables indexes
        await queryRunner.query(`CREATE INDEX "idx_teachers_name" ON "teachers"("first_name", "last_name")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_teachers_aadhar" ON "teachers"("aadhar_number")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_teachers_pan" ON "teachers"("pan_number")`);
        await queryRunner.query(`CREATE INDEX "idx_teachers_school" ON "teachers"("school_id")`);

        // Teacher Contact Information indexes
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_teacher_contact_phone" ON "teacher_contact"("phone_number")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_teacher_contact_email" ON "teacher_contact"("email")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_contact_teacher_id" ON "teacher_contact"("teacher_id")`);

        // Teacher Professional Details indexes
        await queryRunner.query(`CREATE INDEX "idx_teacher_professional_designation" ON "teacher_professional"("designation")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_professional_subjects" ON "teacher_professional" USING GIN ("subjects_taught")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_professional_classes" ON "teacher_professional" USING GIN ("classes_assigned")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_professional_teacher_id" ON "teacher_professional"("teacher_id")`);

        // Teacher Educational Qualifications indexes
        await queryRunner.query(`CREATE INDEX "idx_teacher_qualifications_degree" ON "teacher_qualifications"("degree")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_qualifications_institution" ON "teacher_qualifications"("institution")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_qualifications_teacher_id" ON "teacher_qualifications"("teacher_id")`);

        // Teacher Bank and Financial Details indexes
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_teacher_financial_account" ON "teacher_financial"("bank_account_number")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_financial_ifsc" ON "teacher_financial"("ifsc_code")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_financial_teacher_id" ON "teacher_financial"("teacher_id")`);

        // Teacher Health and Emergency Details indexes
        await queryRunner.query(`CREATE INDEX "idx_teacher_medicals_blood_group" ON "teacher_medicals"("blood_group")`);
        await queryRunner.query(`CREATE INDEX "idx_teacher_medicals_teacher_id" ON "teacher_medicals"("teacher_id")`);

        // Teacher Work History indexes
        await queryRunner.query(`CREATE INDEX "idx_work_history_teacher_id" ON "teacher_work_history"("teacher_id")`);
        await queryRunner.query(`CREATE INDEX "idx_work_history_institution" ON "teacher_work_history"("institution_name")`);
        await queryRunner.query(`CREATE INDEX "idx_work_history_dates" ON "teacher_work_history"("start_date", "end_date")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_work_history_dates"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_work_history_institution"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_work_history_teacher_id"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_medicals_teacher_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_medicals_blood_group"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_financial_teacher_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_financial_ifsc"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_financial_account"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_qualifications_teacher_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_qualifications_institution"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_qualifications_degree"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_professional_teacher_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_professional_classes"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_professional_subjects"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_professional_designation"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_contact_teacher_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_contact_email"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teacher_contact_phone"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teachers_pan"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teachers_aadhar"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teachers_school"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_teachers_name"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_student_fee_due_date"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_student_fee_type"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_student_fee_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_student_grade"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_student_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_student_name"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_student_school"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_name"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_role"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_email"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_school_name"`);

        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_work_history" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_financial" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_qualifications" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_professional" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teacher_contact" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "teachers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_fees" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_academics" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_emergency_contacts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "students" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "schools" CASCADE`);

        // Drop enum type
        await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
    }
}
