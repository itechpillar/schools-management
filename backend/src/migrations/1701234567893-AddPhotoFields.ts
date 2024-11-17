import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPhotoFields1701234567893 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("students", [
            new TableColumn({
                name: "photo",
                type: "bytea",
                isNullable: true
            }),
            new TableColumn({
                name: "photo_content_type",
                type: "varchar",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("students", [
            "photo",
            "photo_content_type"
        ]);
    }
}
