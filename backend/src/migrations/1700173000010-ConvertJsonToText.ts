import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertJsonToText1700173000010 implements MigrationInterface {
    name = 'ConvertJsonToText1700173000010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, convert existing JSON data to text representation
        await queryRunner.query(`
            ALTER TABLE "student_medical"
            ALTER COLUMN "medical_conditions" TYPE text,
            ALTER COLUMN "allergies" TYPE text,
            ALTER COLUMN "medications" TYPE text,
            ALTER COLUMN "immunizations" TYPE text,
            ALTER COLUMN "medical_insurance" TYPE text,
            ALTER COLUMN "physical_disabilities" TYPE text;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Convert back to JSON type
        await queryRunner.query(`
            ALTER TABLE "student_medical"
            ALTER COLUMN "medical_conditions" TYPE jsonb USING medical_conditions::jsonb,
            ALTER COLUMN "allergies" TYPE jsonb USING allergies::jsonb,
            ALTER COLUMN "medications" TYPE jsonb USING medications::jsonb,
            ALTER COLUMN "immunizations" TYPE jsonb USING immunizations::jsonb,
            ALTER COLUMN "medical_insurance" TYPE jsonb USING medical_insurance::jsonb,
            ALTER COLUMN "physical_disabilities" TYPE jsonb USING physical_disabilities::jsonb;
        `);
    }
}
