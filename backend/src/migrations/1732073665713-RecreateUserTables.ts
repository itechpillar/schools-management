import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateUserTables1732073665713 implements MigrationInterface {
    name = 'RecreateUserTables1732073665713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables
        await queryRunner.query(`DROP TABLE IF EXISTS "user_roles" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

        // Recreate users table with correct structure
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                school_id UUID REFERENCES schools(id),
                status VARCHAR(50) DEFAULT 'active',
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Recreate user_roles table
        await queryRunner.query(`
            CREATE TABLE user_roles (
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, role_id)
            )
        `);

        // Add foreign key constraint for school_id
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
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_user_school"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_roles" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    }
}
