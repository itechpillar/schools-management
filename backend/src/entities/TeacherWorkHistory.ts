import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';

@Entity('teacher_work_history')
export class TeacherWorkHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'institution_name', length: 100 })
    institutionName: string;

    @Column({ length: 50, nullable: true })
    designation: string;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => Teacher, teacher => teacher.work_history)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
