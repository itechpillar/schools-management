import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateAllTables1700500000000 implements MigrationInterface {
    name = 'RecreateAllTables1700500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables if they exist
        await queryRunner.query(`DROP TABLE IF EXISTS "student_fees" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_academics" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_emergency_contacts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "students" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "schools" CASCADE`);

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

        // Create students table
        await queryRunner.query(`
            CREATE TABLE "students" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "first_name" varchar NOT NULL,
                "middle_name" varchar,
                "last_name" varchar NOT NULL,
                "date_of_birth" TIMESTAMP NOT NULL,
                "gender" varchar NOT NULL,
                "grade" varchar NOT NULL,
                "status" varchar NOT NULL,
                "photo" bytea,
                "photo_content_type" varchar,
                "school_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_school" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE
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
                CONSTRAINT "fk_student_emergency" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
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
                CONSTRAINT "fk_student_academic" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
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
                CONSTRAINT "fk_student_medical" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
            )
        `);

        // Create student_fees table
        await queryRunner.query(`
            CREATE TABLE "student_fees" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "student_id" uuid NOT NULL,
                "fee_type" varchar NOT NULL,
                "amount" decimal NOT NULL,
                "due_date" TIMESTAMP NOT NULL,
                "payment_status" varchar NOT NULL,
                "payment_method" varchar,
                "payment_date" TIMESTAMP,
                "receipt_number" varchar,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_student_fee" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
            )
        `);

        // Create indexes
        await queryRunner.query(`CREATE INDEX "idx_student_school" ON "students"("school_id")`);
        await queryRunner.query(`CREATE INDEX "idx_student_name" ON "students"("first_name", "last_name")`);
        await queryRunner.query(`CREATE INDEX "idx_school_name" ON "schools"("name")`);
        await queryRunner.query(`CREATE INDEX "idx_student_fee_status" ON "student_fees"("payment_status")`);
        await queryRunner.query(`CREATE INDEX "idx_student_fee_type" ON "student_fees"("fee_type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE IF EXISTS "student_fees" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_medicals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_academics" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_emergency_contacts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "students" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "schools" CASCADE`);
    }
}
