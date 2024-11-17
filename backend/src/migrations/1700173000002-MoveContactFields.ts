import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MoveContactFields1700173000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, add columns to student_emergency_contacts
        await queryRunner.addColumns("student_emergency_contacts", [
            new TableColumn({
                name: "home_address",
                type: "varchar",
                isNullable: false,
                default: "''"
            }),
            new TableColumn({
                name: "email",
                type: "varchar",
                isNullable: true
            })
        ]);

        // Copy data from students to student_emergency_contacts
        await queryRunner.query(`
            UPDATE student_emergency_contacts sec
            SET home_address = s.home_address,
                email = s.email
            FROM students s
            WHERE sec.student_id = s.id
        `);

        // Drop columns from students table
        await queryRunner.dropColumns("students", [
            "home_address",
            "email"
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add columns back to students
        await queryRunner.addColumns("students", [
            new TableColumn({
                name: "home_address",
                type: "varchar",
                isNullable: false,
                default: "''"
            }),
            new TableColumn({
                name: "email",
                type: "varchar",
                isNullable: true
            })
        ]);

        // Copy data back from student_emergency_contacts to students
        await queryRunner.query(`
            UPDATE students s
            SET home_address = sec.home_address,
                email = sec.email
            FROM student_emergency_contacts sec
            WHERE s.id = sec.student_id
        `);

        // Drop columns from student_emergency_contacts
        await queryRunner.dropColumns("student_emergency_contacts", [
            "home_address",
            "email"
        ]);
    }
}
