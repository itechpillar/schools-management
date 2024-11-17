import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAcademicYear1700173000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("student_academics", new TableColumn({
            name: "academic_year",
            type: "varchar",
            isNullable: false,
            default: "'2023-2024'"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("student_academics", "academic_year");
    }
}
