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

  @Column({ nullable: true, length: 10 })
  blood_group: string;

  @Column({ type: 'text', nullable: true })
  medical_conditions: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  emergency_contact: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
