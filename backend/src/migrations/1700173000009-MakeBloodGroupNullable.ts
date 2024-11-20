import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeBloodGroupNullable1700173000009 implements MigrationInterface {
    name = 'MakeBloodGroupNullable1700173000009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Make blood_group column nullable
        await queryRunner.query(`
            ALTER TABLE "student_medical"
            ALTER COLUMN "blood_group" DROP NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Make blood_group column NOT NULL again
        await queryRunner.query(`
            UPDATE "student_medical"
            SET "blood_group" = ''
            WHERE "blood_group" IS NULL;

            ALTER TABLE "student_medical"
            ALTER COLUMN "blood_group" SET NOT NULL;
        `);
    }
}
