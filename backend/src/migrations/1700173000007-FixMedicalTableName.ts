import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMedicalTableName1700173000007 implements MigrationInterface {
    name = 'FixMedicalTableName1700173000007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, drop the foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "student_medicals"
            DROP CONSTRAINT IF EXISTS "fk_student_medical"
        `);

        // Rename the table
        await queryRunner.query(`
            ALTER TABLE IF EXISTS "student_medicals"
            RENAME TO "student_medical"
        `);

        // Add back the foreign key constraint with the new table name
        await queryRunner.query(`
            ALTER TABLE "student_medical"
            ADD CONSTRAINT "fk_student_medical" 
            FOREIGN KEY ("student_id") 
            REFERENCES "students"("id") 
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "student_medical"
            DROP CONSTRAINT IF EXISTS "fk_student_medical"
        `);

        // Rename back to original name
        await queryRunner.query(`
            ALTER TABLE IF EXISTS "student_medical"
            RENAME TO "student_medicals"
        `);

        // Add back the foreign key constraint with the old table name
        await queryRunner.query(`
            ALTER TABLE "student_medicals"
            ADD CONSTRAINT "fk_student_medical" 
            FOREIGN KEY ("student_id") 
            REFERENCES "students"("id") 
            ON DELETE CASCADE
        `);
    }
}
