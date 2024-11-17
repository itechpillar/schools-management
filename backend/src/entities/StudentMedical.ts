import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';

@Entity('student_medical')
export class StudentMedical {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @Column({ nullable: true })
  blood_group: string;

  @Column('text', { nullable: true })
  medical_conditions: string;

  @Column('text', { nullable: true })
  medications: string;

  @Column('text', { nullable: true })
  physical_disabilities: string;

  @Column('json', { nullable: true })
  immunization_records: any;

  @Column({ nullable: true })
  doctor_name: string;

  @Column({ nullable: true })
  doctor_contact: string;

  @Column({ nullable: true })
  hospital_preference: string;

  @Column('text', { nullable: true })
  allergies: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
