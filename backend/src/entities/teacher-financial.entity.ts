import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity('teacher_financial')
export class TeacherFinancial {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'bank_account_number', length: 20, unique: true })
    bankAccountNumber: string;

    @Column({ name: 'bank_name', length: 50 })
    bankName: string;

    @Column({ name: 'ifsc_code', length: 11 })
    ifscCode: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    salary: number;

    @OneToOne(() => Teacher, teacher => teacher.financial)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
