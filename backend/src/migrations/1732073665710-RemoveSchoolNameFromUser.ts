import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveSchoolNameFromUser1732073665710 implements MigrationInterface {
    name = 'RemoveSchoolNameFromUser1732073665710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "schoolName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "schoolName" character varying(100)`);
    }
}
