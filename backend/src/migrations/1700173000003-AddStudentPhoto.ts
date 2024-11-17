import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStudentPhoto1700173000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("students", [
            new TableColumn({
                name: "photo",
                type: "bytea",
                isNullable: true,
                comment: "Student's photo stored as binary data"
            }),
            new TableColumn({
                name: "photo_content_type",
                type: "varchar",
                isNullable: true,
                comment: "MIME type of the photo (e.g., image/jpeg, image/png)"
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("students", ["photo", "photo_content_type"]);
    }
}
