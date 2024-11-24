import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity('teacher_professional')
export class TeacherProfessional {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'employee_id', length: 20, unique: true })
    employeeId: string;

    @Column({ name: 'joining_date', type: 'date' })
    joiningDate: Date;

    @Column({ name: 'department', length: 50 })
    department: string;

    @Column({ name: 'designation', length: 50 })
    designation: string;

    @Column({ name: 'subjects_taught', type: 'text', array: true })
    subjectsTaught: string[];

    @Column({ name: 'is_class_teacher', default: false })
    isClassTeacher: boolean;

    @Column({ name: 'class_assigned', length: 20, nullable: true })
    classAssigned: string;

    @OneToOne(() => Teacher, teacher => teacher.professional)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
