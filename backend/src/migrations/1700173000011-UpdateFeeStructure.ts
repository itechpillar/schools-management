import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFeeStructure1700173000011 implements MigrationInterface {
    name = 'UpdateFeeStructure1700173000011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "student_fees" 
            ADD COLUMN IF NOT EXISTS "fee_type" varchar NOT NULL DEFAULT 'tuition',
            ADD COLUMN IF NOT EXISTS "amount_paid" decimal(10,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "balance" decimal(10,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "payment_status" varchar NOT NULL DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS "payment_method" varchar NOT NULL DEFAULT 'cash',
            ADD COLUMN IF NOT EXISTS "is_cancelled" boolean NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            ADD COLUMN IF NOT EXISTS "academic_year" varchar;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "student_fees" 
            DROP COLUMN IF EXISTS "fee_type",
            DROP COLUMN IF EXISTS "amount_paid",
            DROP COLUMN IF EXISTS "balance",
            DROP COLUMN IF EXISTS "payment_status",
            DROP COLUMN IF EXISTS "payment_method",
            DROP COLUMN IF EXISTS "is_cancelled",
            DROP COLUMN IF EXISTS "created_at",
            DROP COLUMN IF EXISTS "updated_at",
            DROP COLUMN IF EXISTS "academic_year";
        `);
    }
}
