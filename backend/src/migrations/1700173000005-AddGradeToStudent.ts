import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGradeToStudent1700173000005 implements MigrationInterface {
    name = 'AddGradeToStudent1700173000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add grade column if it doesn't exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'students'
                    AND column_name = 'grade'
                ) THEN
                    ALTER TABLE "students"
                    ADD COLUMN "grade" varchar NOT NULL;
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "students"
            DROP COLUMN IF EXISTS "grade"
        `);
    }
}
