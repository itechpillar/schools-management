import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';

@Entity('student_academics')
export class StudentAcademic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.academics)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @Column()
  academic_year: string;

  @Column()
  grade: string;

  @Column()
  section: string;

  @Column({ nullable: true })
  roll_number: string;

  @Column({ type: 'json', nullable: true })
  subjects: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  attendance_percentage: number;

  @Column({ type: 'json', nullable: true })
  exam_scores: {
    exam_name: string;
    subject: string;
    marks_obtained: number;
    total_marks: number;
    grade: string;
  }[];

  @Column({ type: 'json', nullable: true })
  extracurricular_activities: {
    activity_name: string;
    position: string;
    achievement: string;
  }[];

  @Column({ nullable: true })
  class_teacher_remarks: string;

  @Column({ nullable: true })
  previous_school: string;

  @Column({ type: 'date', nullable: true })
  admission_date: Date | null;

  @Column({ nullable: true })
  board: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
