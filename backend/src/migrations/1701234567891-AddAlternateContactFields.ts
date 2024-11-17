import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAlternateContactFields1701234567891 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("student_emergency_contacts", [
            new TableColumn({
                name: "alternate_contact_name",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "alternate_contact_relationship",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "alternate_contact_number",
                type: "varchar",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("student_emergency_contacts", [
            "alternate_contact_name",
            "alternate_contact_relationship",
            "alternate_contact_number"
        ]);
    }
}
