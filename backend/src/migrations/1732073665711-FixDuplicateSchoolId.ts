import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDuplicateSchoolId1732073665711 implements MigrationInterface {
    name = 'FixDuplicateSchoolId1732073665711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, drop the foreign key constraints if they exist
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

        // Drop the duplicate school_id column if it exists
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'users' 
                    AND column_name = 'schoolid'
                ) THEN
                    ALTER TABLE "users" DROP COLUMN "schoolid";
                END IF;
            END $$;
        `);

        // Ensure we have only one school_id column with correct type
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'users' 
                    AND column_name = 'school_id'
                ) THEN
                    ALTER TABLE "users" ADD COLUMN "school_id" UUID REFERENCES schools(id);
                ELSE
                    ALTER TABLE "users" ALTER COLUMN "school_id" TYPE UUID USING school_id::uuid;
                END IF;
            END $$;
        `);

        // Re-add the foreign key constraint
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
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_user_school"
        `);
    }
}
