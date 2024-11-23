import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';

@Entity('teacher_qualifications')
export class TeacherQualifications {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'qualification_type', length: 50, nullable: true })
    qualificationType: string;

    @Column({ length: 100, nullable: true })
    degree: string;

    @Column({ length: 200, nullable: true })
    institution: string;

    @Column({ length: 100, nullable: true })
    specialization: string;

    @Column({ name: 'year_of_passing', type: 'integer', nullable: true })
    yearOfPassing: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    percentage: number;

    @Column({ type: 'jsonb', nullable: true })
    documents: any;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => Teacher, teacher => teacher.qualifications)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
