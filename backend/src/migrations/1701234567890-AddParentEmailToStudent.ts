import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddParentEmailToStudent1701234567890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "students",
            new TableColumn({
                name: "parent_email",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("students", "parent_email");
    }
}
