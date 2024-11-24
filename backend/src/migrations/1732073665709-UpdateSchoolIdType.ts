import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchoolIdType1732073665709 implements MigrationInterface {
    name = 'UpdateSchoolIdType1732073665709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First drop the foreign key if it exists
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 
                    FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_user_school' 
                    AND table_name = 'users'
                ) THEN
                    ALTER TABLE "users" DROP CONSTRAINT "FK_user_school";
                END IF;
            END $$;
        `);

        // Update the column type
        await queryRunner.query(`
            ALTER TABLE "users" 
            ALTER COLUMN "school_id" TYPE uuid USING school_id::uuid
        `);

        // Re-add the foreign key
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_user_school"
            FOREIGN KEY ("school_id")
            REFERENCES "schools"("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_user_school"
        `);

        // Revert the column type back to varchar
        await queryRunner.query(`
            ALTER TABLE "users" 
            ALTER COLUMN "school_id" TYPE character varying
        `);

        // Re-add the foreign key
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_user_school"
            FOREIGN KEY ("school_id")
            REFERENCES "schools"("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE
        `);
    }
}
