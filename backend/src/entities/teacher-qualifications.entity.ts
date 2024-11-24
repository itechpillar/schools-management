import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity('teacher_qualifications')
export class TeacherQualifications {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'degree_name', length: 100 })
    degreeName: string;

    @Column({ name: 'institution_name', length: 100 })
    institutionName: string;

    @Column({ name: 'completion_year', type: 'int' })
    completionYear: number;

    @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
    grade: number;

    @ManyToOne(() => Teacher, teacher => teacher.qualifications)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
