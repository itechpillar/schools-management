import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserTable1732073665714 implements MigrationInterface {
    name = 'DropUserTable1732073665714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the singular "user" table if it exists
        await queryRunner.query(`DROP TABLE IF EXISTS "user" CASCADE`);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        // We don't need to recreate the "user" table as we're using "users" table
    }
}
