import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserTables1732073665712 implements MigrationInterface {
    name = 'DropUserTables1732073665712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First drop the user_roles table as it depends on users
        await queryRunner.query(`DROP TABLE IF EXISTS "user_roles" CASCADE`);
        
        // Then drop the users table
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate users table
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
                user_id UUID REFERENCES users(id),
                role_id UUID REFERENCES roles(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, role_id)
            )
        `);
    }
}
