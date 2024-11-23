import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';

@Entity('teacher_professional')
export class TeacherProfessional {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ length: 50, nullable: true })
    designation: string;

    @Column({ name: 'subjects_taught', type: 'text', array: true, nullable: true })
    subjectsTaught: string[];

    @Column({ name: 'classes_assigned', type: 'text', array: true, nullable: true })
    classesAssigned: string[];

    @Column({ name: 'joining_date', type: 'date', nullable: true })
    joiningDate: Date;

    @Column({ name: 'total_experience', type: 'integer', nullable: true })
    totalExperience: number;

    @Column({ length: 100, nullable: true })
    specialization: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => Teacher, teacher => teacher.professional_details)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
