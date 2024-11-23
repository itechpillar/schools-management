import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { FeeType, PaymentStatus, PaymentMethod } from './enums';

@Entity('student_fees')
export class StudentFee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.fees)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @Column({
    type: 'enum',
    enum: FeeType,
    default: FeeType.TUITION
  })
  fee_type: FeeType;

  @Column()
  academic_year: string;

  @Column({ nullable: true })
  term: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount_paid: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  payment_status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true
  })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  receipt_number: string;

  @Column('text', { nullable: true })
  remarks: string;

  @Column({ type: 'date', nullable: true })
  payment_date: Date;

  @Column({ nullable: true })
  collected_by: string;

  @Column('json', { nullable: true })
  payment_history: {
    date: Date;
    amount: number;
    method: PaymentMethod;
    transaction_id?: string;
    remarks?: string;
  }[];

  @Column('boolean', { default: false })
  is_cancelled: boolean;

  @Column({ nullable: true })
  cancellation_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
