import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { School } from './school.entity';
import { TeacherContact } from './teacher-contact.entity';
import { TeacherProfessional } from './teacher-professional.entity';
import { TeacherQualifications } from './teacher-qualifications.entity';
import { TeacherFinancial } from './teacher-financial.entity';
import { TeacherMedicals } from './teacher-medicals.entity';
import { TeacherWorkHistory } from './teacher-work-history.entity';

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'school_id' })
    schoolId: string;

    @Column({ name: 'first_name', length: 50 })
    firstName: string;

    @Column({ name: 'last_name', length: 50 })
    lastName: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ name: 'date_of_birth', type: 'date' })
    dateOfBirth: Date;

    @Column({ length: 10 })
    gender: string;

    @ManyToOne(() => School, school => school.teachers)
    @JoinColumn({ name: 'school_id' })
    school: School;

    @OneToOne(() => TeacherContact, contact => contact.teacher)
    contact: TeacherContact;

    @OneToOne(() => TeacherProfessional, professional => professional.teacher)
    professional: TeacherProfessional;

    @OneToMany(() => TeacherQualifications, qualification => qualification.teacher)
    qualifications: TeacherQualifications[];

    @OneToOne(() => TeacherFinancial, financial => financial.teacher)
    financial: TeacherFinancial;

    @OneToOne(() => TeacherMedicals, medical => medical.teacher)
    medical: TeacherMedicals;

    @OneToMany(() => TeacherWorkHistory, workHistory => workHistory.teacher)
    work_history: TeacherWorkHistory[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
