import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateStudentPhoto1700173000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the old photo_url column
        await queryRunner.dropColumn("students", "photo_url");

        // Add new photo columns
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
        // Drop new photo columns
        await queryRunner.dropColumns("students", ["photo", "photo_content_type"]);

        // Add back the old photo_url column
        await queryRunner.addColumn("students", new TableColumn({
            name: "photo_url",
            type: "varchar",
            isNullable: true
        }));
    }
}
