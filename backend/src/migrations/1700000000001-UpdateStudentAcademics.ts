import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentAcademics1700000000001 implements MigrationInterface {
    name = 'UpdateStudentAcademics1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to student_academics table
        await queryRunner.query(`
            ALTER TABLE "student_academics"
            ADD COLUMN IF NOT EXISTS "roll_number" varchar,
            ADD COLUMN IF NOT EXISTS "section" varchar,
            ADD COLUMN IF NOT EXISTS "subjects" json,
            ADD COLUMN IF NOT EXISTS "attendance_percentage" decimal(5,2),
            ADD COLUMN IF NOT EXISTS "exam_scores" json,
            ADD COLUMN IF NOT EXISTS "extracurricular_activities" json,
            ADD COLUMN IF NOT EXISTS "class_teacher_remarks" varchar,
            ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'active'
        `);

        // Drop columns that are no longer needed
        await queryRunner.query(`
            ALTER TABLE "student_academics"
            DROP COLUMN IF EXISTS "previous_school",
            DROP COLUMN IF EXISTS "current_grade",
            DROP COLUMN IF EXISTS "class_section",
            DROP COLUMN IF EXISTS "achievements",
            DROP COLUMN IF EXISTS "extra_curricular"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes
        await queryRunner.query(`
            ALTER TABLE "student_academics"
            DROP COLUMN IF EXISTS "roll_number",
            DROP COLUMN IF EXISTS "section",
            DROP COLUMN IF EXISTS "subjects",
            DROP COLUMN IF EXISTS "attendance_percentage",
            DROP COLUMN IF EXISTS "exam_scores",
            DROP COLUMN IF EXISTS "extracurricular_activities",
            DROP COLUMN IF EXISTS "class_teacher_remarks",
            DROP COLUMN IF EXISTS "status"
        `);

        await queryRunner.query(`
            ALTER TABLE "student_academics"
            ADD COLUMN IF NOT EXISTS "previous_school" varchar,
            ADD COLUMN IF NOT EXISTS "current_grade" varchar NOT NULL,
            ADD COLUMN IF NOT EXISTS "class_section" varchar,
            ADD COLUMN IF NOT EXISTS "achievements" text,
            ADD COLUMN IF NOT EXISTS "extra_curricular" text
        `);
    }
}
