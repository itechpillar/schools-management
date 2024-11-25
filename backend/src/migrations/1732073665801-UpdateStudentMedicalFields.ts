import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentMedicalFields1732073665801 implements MigrationInterface {
    name = 'UpdateStudentMedicalFields1732073665801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the old emergency_contact column
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "emergency_contact"`);

        // Add new columns
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "medications" text`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "immunizations" text`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "emergency_contact_name" varchar(100)`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "emergency_contact_number" varchar(20)`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "family_doctor_name" varchar(100)`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "family_doctor_number" varchar(20)`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "preferred_hospital" varchar(100)`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "medical_insurance" text`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "special_needs" text`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "dietary_restrictions" text`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "physical_disabilities" text`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "last_physical_exam" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "additional_notes" text`);
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "status" varchar(20) DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove new columns
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "additional_notes"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "last_physical_exam"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "physical_disabilities"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "dietary_restrictions"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "special_needs"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "medical_insurance"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "preferred_hospital"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "family_doctor_number"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "family_doctor_name"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "emergency_contact_number"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "emergency_contact_name"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "immunizations"`);
        await queryRunner.query(`ALTER TABLE "student_medical" DROP COLUMN "medications"`);

        // Restore the old emergency_contact column
        await queryRunner.query(`ALTER TABLE "student_medical" ADD "emergency_contact" text`);
    }
}
