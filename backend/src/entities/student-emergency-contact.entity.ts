import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('student_emergency_contacts')
export class StudentEmergencyContact {
  @PrimaryGeneratedColumn('uuid', { name: 'contact_id' })
  contact_id: string;

  @ManyToOne(() => Student, student => student.emergency_contacts)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @Column()
  contact_name: string;

  @Column()
  relationship: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  home_address: string;

  @Column({ nullable: true })
  alternate_contact_name: string;

  @Column({ nullable: true })
  alternate_contact_relationship: string;

  @Column({ nullable: true })
  alternate_contact_number: string;

  @Column({ nullable: true })
  communication_preference: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
