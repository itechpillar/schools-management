import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { School } from '../entities/School';
import { StudentFee } from './StudentFee';
import { StudentAcademic } from './StudentAcademic';
import { StudentMedical } from './StudentMedical';
import { StudentEmergencyContact } from './StudentEmergencyContact';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;

    @Column({ nullable: true })
    middle_name: string;

    @Column()
    last_name: string;

    @Column({ type: 'date' })
    date_of_birth: Date;

    @Column()
    gender: string;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'bytea', nullable: true })
    photo: Buffer | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    photo_content_type: string | null;

    @ManyToOne(() => School, school => school.students, { nullable: false })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @OneToMany(() => StudentFee, fee => fee.student)
    fees: StudentFee[];

    @OneToOne(() => StudentAcademic, academic => academic.student)
    academic: StudentAcademic;

    @OneToOne(() => StudentMedical, medical => medical.student)
    medical: StudentMedical;

    @OneToOne(() => StudentEmergencyContact, contact => contact.student)
    emergency_contact: StudentEmergencyContact;

    @Column({ nullable: true })
    grade: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
