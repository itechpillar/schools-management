import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTermColumn1700173000012 implements MigrationInterface {
    name = 'AddTermColumn1700173000012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "student_fees" 
            ADD COLUMN IF NOT EXISTS "term" varchar;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "student_fees" 
            DROP COLUMN IF EXISTS "term";
        `);
    }
}
