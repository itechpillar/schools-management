import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPhotoColumns1700173000006 implements MigrationInterface {
    name = 'FixPhotoColumns1700173000006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure grade column exists with correct type and default
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
                    ADD COLUMN "grade" varchar(50) NOT NULL DEFAULT '';
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
