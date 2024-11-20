import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcademicFields1732073665706 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE student_academics
            ADD COLUMN IF NOT EXISTS previous_school VARCHAR(255),
            ADD COLUMN IF NOT EXISTS admission_date DATE,
            ADD COLUMN IF NOT EXISTS board VARCHAR(255)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE student_academics
            DROP COLUMN IF EXISTS previous_school,
            DROP COLUMN IF EXISTS admission_date,
            DROP COLUMN IF EXISTS board
        `);
    }
}
