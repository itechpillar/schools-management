import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentProfile1701234567890 implements MigrationInterface {
    name = 'UpdateStudentProfile1701234567890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to students table
        await queryRunner.query(`
            ALTER TABLE "students" 
            ADD "studentId" uuid UNIQUE DEFAULT uuid_generate_v4(),
            ADD "middleName" varchar,
            ADD "photograph" varchar,
            ADD "homeAddress" varchar,
            ADD "parentGuardianName" varchar,
            ADD "parentGuardianContact" varchar,
            ADD "emergencyContactNumber" varchar,
            ADD "communicationPreference" varchar,
            ADD "rollNumber" varchar,
            ADD "section" varchar,
            ADD "subjectsEnrolled" text,
            ADD "previousSchool" varchar,
            ADD "admissionDate" varchar,
            ADD "slcNumber" varchar,
            ADD "board" varchar,
            ADD "gpa" decimal,
            ADD "pastAcademicPerformance" jsonb,
            ADD "bloodGroup" varchar,
            ADD "medicalConditions" jsonb,
            ADD "medications" jsonb,
            ADD "physicalDisabilities" varchar,
            ADD "immunizationRecords" jsonb,
            ADD "doctorContact" jsonb
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove added columns from students table
        await queryRunner.query(`
            ALTER TABLE "students" 
            DROP COLUMN "studentId",
            DROP COLUMN "middleName",
            DROP COLUMN "photograph",
            DROP COLUMN "homeAddress",
            DROP COLUMN "parentGuardianName",
            DROP COLUMN "parentGuardianContact",
            DROP COLUMN "emergencyContactNumber",
            DROP COLUMN "communicationPreference",
            DROP COLUMN "rollNumber",
            DROP COLUMN "section",
            DROP COLUMN "subjectsEnrolled",
            DROP COLUMN "previousSchool",
            DROP COLUMN "admissionDate",
            DROP COLUMN "slcNumber",
            DROP COLUMN "board",
            DROP COLUMN "gpa",
            DROP COLUMN "pastAcademicPerformance",
            DROP COLUMN "bloodGroup",
            DROP COLUMN "medicalConditions",
            DROP COLUMN "medications",
            DROP COLUMN "physicalDisabilities",
            DROP COLUMN "immunizationRecords",
            DROP COLUMN "doctorContact"
        `);
    }
}
