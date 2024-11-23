import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';

@Entity('teacher_contact')
export class TeacherContact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'current_address', type: 'text' })
    currentAddress: string;

    @Column({ name: 'permanent_address', type: 'text', nullable: true })
    permanentAddress: string;

    @Column({ name: 'phone_number', length: 15, unique: true })
    phoneNumber: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ name: 'emergency_contact', type: 'jsonb', nullable: true })
    emergencyContact: {
        name: string;
        relationship: string;
        phone_number: string;
    };

    @OneToOne(() => Teacher, teacher => teacher.contact)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
