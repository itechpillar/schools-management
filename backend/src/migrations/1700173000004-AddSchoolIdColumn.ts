import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddSchoolIdColumn1700173000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add school_id column if it doesn't exist
        const hasSchoolIdColumn = await queryRunner.hasColumn('students', 'school_id');
        if (!hasSchoolIdColumn) {
            await queryRunner.addColumn('students', new TableColumn({
                name: 'school_id',
                type: 'uuid',
                isNullable: false,
            }));

            // Add foreign key constraint
            await queryRunner.createForeignKey('students', new TableForeignKey({
                columnNames: ['school_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'schools',
                onDelete: 'CASCADE',
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key first
        const table = await queryRunner.getTable('students');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('school_id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('students', foreignKey);
        }

        // Then remove the column
        await queryRunner.dropColumn('students', 'school_id');
    }
}
