import { MigrationInterface, QueryRunner } from "typeorm"

export class AddSchoolNameToUser1732073665708 implements MigrationInterface {
    name = 'AddSchoolNameToUser1732073665708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "schoolName" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "schoolName"`);
    }
}
