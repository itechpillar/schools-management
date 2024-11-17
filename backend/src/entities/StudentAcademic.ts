import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';

@Entity('student_academics')
export class StudentAcademic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @Column()
  grade: string;

  @Column()
  section: string;

  @Column()
  roll_number: string;

  @Column('simple-array', { nullable: true })
  subjects_enrolled: string[];

  @Column({ nullable: true })
  previous_school: string;

  @Column({ type: 'date', nullable: true })
  admission_date: Date;

  @Column({ nullable: true })
  slc_number: string;

  @Column({ nullable: true })
  board: string;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  gpa: number;

  @Column('json', { nullable: true })
  past_academic_performance: any;

  @Column()
  academic_year: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
