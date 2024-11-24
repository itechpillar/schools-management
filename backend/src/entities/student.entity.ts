import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { School } from './school.entity';
import { StudentEmergencyContact } from './student-emergency-contact.entity';
import { StudentAcademic } from './student-academic.entity';
import { StudentMedical } from './student-medical.entity';
import { StudentFee } from './student-fee.entity';

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

  @Column()
  date_of_birth: Date;

  @Column()
  gender: string;

  @Column({ nullable: false, default: '' })
  grade: string;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => School, school => school.students, { nullable: false })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToMany(() => StudentFee, fee => fee.student)
  fees: StudentFee[];

  @OneToMany(() => StudentAcademic, academic => academic.student)
  academics: StudentAcademic[];

  @OneToMany(() => StudentMedical, medical => medical.student)
  medicals: StudentMedical[];

  @OneToMany(() => StudentEmergencyContact, emergencyContact => emergencyContact.student)
  emergency_contacts: StudentEmergencyContact[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
