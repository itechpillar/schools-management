import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { School } from './School';
import { TeacherContact } from './TeacherContact';
import { TeacherProfessional } from './TeacherProfessional';
import { TeacherQualifications } from './TeacherQualifications';
import { TeacherFinancial } from './TeacherFinancial';
import { TeacherMedicals } from './TeacherMedicals';
import { TeacherWorkHistory } from './TeacherWorkHistory';

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'first_name', length: 50 })
    first_name: string;

    @Column({ name: 'last_name', length: 50 })
    last_name: string;

    @Column({ length: 1 })
    gender: string;

    @Column({ name: 'date_of_birth', type: 'date' })
    date_of_birth: Date;

    @Column({ name: 'aadhar_number', length: 12, unique: true })
    aadhar_number: string;

    @Column({ name: 'pan_number', length: 10, unique: true, nullable: true })
    pan_number: string;

    @Column({ type: 'bytea', nullable: true })
    photo: Buffer;

    @ManyToOne(() => School, school => school.teachers, { nullable: false })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @OneToOne(() => TeacherContact, contact => contact.teacher)
    contact: TeacherContact;

    @OneToMany(() => TeacherProfessional, professional => professional.teacher)
    professional_details: TeacherProfessional[];

    @OneToMany(() => TeacherQualifications, qualification => qualification.teacher)
    qualifications: TeacherQualifications[];

    @OneToOne(() => TeacherFinancial, financial => financial.teacher)
    financial: TeacherFinancial;

    @OneToOne(() => TeacherMedicals, medicals => medicals.teacher)
    medicals: TeacherMedicals;

    @OneToMany(() => TeacherWorkHistory, workHistory => workHistory.teacher)
    workHistory: TeacherWorkHistory[];

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
