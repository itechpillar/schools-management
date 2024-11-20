import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionColumns1700173000013 implements MigrationInterface {
    name = 'AddTransactionColumns1700173000013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "student_fees" 
            ADD COLUMN IF NOT EXISTS "transaction_id" varchar,
            ADD COLUMN IF NOT EXISTS "receipt_number" varchar,
            ADD COLUMN IF NOT EXISTS "remarks" text,
            ADD COLUMN IF NOT EXISTS "payment_date" date,
            ADD COLUMN IF NOT EXISTS "collected_by" varchar,
            ADD COLUMN IF NOT EXISTS "payment_history" json,
            ADD COLUMN IF NOT EXISTS "is_cancelled" boolean DEFAULT false,
            ADD COLUMN IF NOT EXISTS "cancellation_reason" varchar;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "student_fees" 
            DROP COLUMN IF EXISTS "transaction_id",
            DROP COLUMN IF EXISTS "receipt_number",
            DROP COLUMN IF EXISTS "remarks",
            DROP COLUMN IF EXISTS "payment_date",
            DROP COLUMN IF EXISTS "collected_by",
            DROP COLUMN IF EXISTS "payment_history",
            DROP COLUMN IF EXISTS "is_cancelled",
            DROP COLUMN IF EXISTS "cancellation_reason";
        `);
    }
}
