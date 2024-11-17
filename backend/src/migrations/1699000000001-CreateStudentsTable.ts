import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateStudentsTable1699000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "students",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "date_of_birth",
                        type: "date",
                    },
                    {
                        name: "gender",
                        type: "varchar",
                    },
                    {
                        name: "school_id",
                        type: "uuid",
                    },
                    {
                        name: "grade",
                        type: "varchar",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["active", "inactive"],
                        default: "'active'",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "students",
            new TableForeignKey({
                columnNames: ["school_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "schools",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("students");
        if (table) {
            const foreignKey = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("school_id") !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("students", foreignKey);
            }
        }
        await queryRunner.dropTable("students");
    }
}
