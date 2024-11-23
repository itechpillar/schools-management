import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTeacherContactEmergencyContact1703169000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, drop the existing column if it exists
        await queryRunner.query(`
            ALTER TABLE teacher_contact 
            DROP COLUMN IF EXISTS "emergencyContact"
        `);

        // Add the new column with the correct name
        await queryRunner.query(`
            ALTER TABLE teacher_contact 
            ADD COLUMN "emergency_contact" JSONB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes
        await queryRunner.query(`
            ALTER TABLE teacher_contact 
            DROP COLUMN IF EXISTS "emergency_contact"
        `);

        await queryRunner.query(`
            ALTER TABLE teacher_contact 
            ADD COLUMN "emergencyContact" JSONB
        `);
    }
}
