import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { School } from './School';
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

  @Column()
  date_of_birth: Date;

  @Column()
  gender: string;

  @Column({ nullable: false, default: '' })
  grade: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'parent_email', type: 'varchar', length: 255, nullable: true })
  parent_email: string;

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
