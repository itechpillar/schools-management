import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateStudentTables1699000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Skip students table and its foreign key as they already exist

        // Create student_academics table
        await queryRunner.createTable(
            new Table({
                name: "student_academics",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                    },
                    {
                        name: "grade",
                        type: "varchar",
                    },
                    {
                        name: "section",
                        type: "varchar",
                    },
                    {
                        name: "academic_year",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create student_medical table
        await queryRunner.createTable(
            new Table({
                name: "student_medical",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                    },
                    {
                        name: "blood_group",
                        type: "varchar",
                    },
                    {
                        name: "medical_conditions",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "allergies",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create student_emergency_contacts table
        await queryRunner.createTable(
            new Table({
                name: "student_emergency_contacts",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                    },
                    {
                        name: "contact_name",
                        type: "varchar",
                    },
                    {
                        name: "relationship",
                        type: "varchar",
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                    },
                    {
                        name: "alternate_phone_number",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create student_fees table
        await queryRunner.createTable(
            new Table({
                name: "student_fees",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "student_id",
                        type: "uuid",
                    },
                    {
                        name: "fee_type",
                        type: "varchar",
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: "due_date",
                        type: "date",
                    },
                    {
                        name: "payment_status",
                        type: "varchar",
                    },
                    {
                        name: "payment_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Add foreign key constraints for the new tables
        await queryRunner.createForeignKey(
            "student_academics",
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "students",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "student_medical",
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "students",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "student_emergency_contacts",
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "students",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "student_fees",
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "students",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.dropTable("student_fees");
        await queryRunner.dropTable("student_emergency_contacts");
        await queryRunner.dropTable("student_medical");
        await queryRunner.dropTable("student_academics");
        // Skip dropping students table as it was not created in this migration
    }
}
