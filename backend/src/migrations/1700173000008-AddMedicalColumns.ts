import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMedicalColumns1700173000008 implements MigrationInterface {
    name = 'AddMedicalColumns1700173000008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add missing columns to student_medical table
        await queryRunner.query(`
            ALTER TABLE "student_medical"
            ADD COLUMN IF NOT EXISTS "medications" jsonb,
            ADD COLUMN IF NOT EXISTS "immunizations" jsonb,
            ADD COLUMN IF NOT EXISTS "emergency_contact_name" varchar,
            ADD COLUMN IF NOT EXISTS "emergency_contact_number" varchar,
            ADD COLUMN IF NOT EXISTS "family_doctor_name" varchar,
            ADD COLUMN IF NOT EXISTS "family_doctor_number" varchar,
            ADD COLUMN IF NOT EXISTS "preferred_hospital" varchar,
            ADD COLUMN IF NOT EXISTS "medical_insurance" jsonb,
            ADD COLUMN IF NOT EXISTS "special_needs" varchar,
            ADD COLUMN IF NOT EXISTS "dietary_restrictions" varchar,
            ADD COLUMN IF NOT EXISTS "physical_disabilities" jsonb,
            ADD COLUMN IF NOT EXISTS "last_physical_exam" TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "additional_notes" text,
            ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'active';

            -- Convert existing text columns to jsonb if they exist
            ALTER TABLE "student_medical"
            ALTER COLUMN "medical_conditions" TYPE jsonb USING 
                CASE 
                    WHEN medical_conditions IS NULL THEN NULL 
                    ELSE medical_conditions::jsonb 
                END,
            ALTER COLUMN "allergies" TYPE jsonb USING 
                CASE 
                    WHEN allergies IS NULL THEN NULL 
                    ELSE allergies::jsonb 
                END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove added columns
        await queryRunner.query(`
            ALTER TABLE "student_medical"
            DROP COLUMN IF EXISTS "medications",
            DROP COLUMN IF EXISTS "immunizations",
            DROP COLUMN IF EXISTS "emergency_contact_name",
            DROP COLUMN IF EXISTS "emergency_contact_number",
            DROP COLUMN IF EXISTS "family_doctor_name",
            DROP COLUMN IF EXISTS "family_doctor_number",
            DROP COLUMN IF EXISTS "preferred_hospital",
            DROP COLUMN IF EXISTS "medical_insurance",
            DROP COLUMN IF EXISTS "special_needs",
            DROP COLUMN IF EXISTS "dietary_restrictions",
            DROP COLUMN IF EXISTS "physical_disabilities",
            DROP COLUMN IF EXISTS "last_physical_exam",
            DROP COLUMN IF EXISTS "additional_notes",
            DROP COLUMN IF EXISTS "status";

            -- Convert jsonb columns back to text
            ALTER TABLE "student_medical"
            ALTER COLUMN "medical_conditions" TYPE text,
            ALTER COLUMN "allergies" TYPE text;
        `);
    }
}
