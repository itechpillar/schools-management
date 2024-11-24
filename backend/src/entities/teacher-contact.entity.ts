import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity('teacher_contact')
export class TeacherContact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @Column({ name: 'phone_number', length: 15 })
    phoneNumber: string;

    @Column({ name: 'emergency_contact_name', length: 100 })
    emergencyContactName: string;

    @Column({ name: 'emergency_contact_phone', length: 15 })
    emergencyContactPhone: string;

    @Column({ name: 'current_address', type: 'text' })
    currentAddress: string;

    @Column({ name: 'permanent_address', type: 'text' })
    permanentAddress: string;

    @OneToOne(() => Teacher, teacher => teacher.contact)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
