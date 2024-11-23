import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';

@Entity('teacher_medicals')
export class TeacherMedicals {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'blood_group', length: 3 })
    bloodGroup: string;

    @Column({ name: 'medical_conditions', type: 'text', nullable: true })
    medicalConditions: string;

    @Column({ name: 'health_insurance', length: 100, nullable: true })
    healthInsurance: string;

    @OneToOne(() => Teacher, teacher => teacher.medicals)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
