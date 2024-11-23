import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';

@Entity('student_medical')
export class StudentMedical {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.medicals)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @Column({ nullable: true })
  blood_group: string;

  @Column({ type: 'text', nullable: true })
  medical_conditions: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  medications: string;

  @Column({ type: 'text', nullable: true })
  immunizations: string;

  @Column({ nullable: true })
  emergency_contact_name: string;

  @Column({ nullable: true })
  emergency_contact_number: string;

  @Column({ nullable: true })
  family_doctor_name: string;

  @Column({ nullable: true })
  family_doctor_number: string;

  @Column({ nullable: true })
  preferred_hospital: string;

  @Column({ type: 'text', nullable: true })
  medical_insurance: string;

  @Column({ type: 'text', nullable: true })
  special_needs: string;

  @Column({ type: 'text', nullable: true })
  dietary_restrictions: string;

  @Column({ type: 'text', nullable: true })
  physical_disabilities: string;

  @Column({ type: 'date', nullable: true })
  last_physical_exam: Date | null;

  @Column({ type: 'text', nullable: true })
  additional_notes: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
