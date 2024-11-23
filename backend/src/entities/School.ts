import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Entity('schools')
export class School {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({ name: 'contact_number' })
    contactNumber: string;

    @Column()
    email: string;

    @OneToMany(() => Student, student => student.school)
    students: Student[];

    @OneToMany(() => Teacher, teacher => teacher.school)
    teachers: Teacher[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
