import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn 
} from 'typeorm';
import { School } from './School';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Information
  @Column({ unique: true, generated: 'uuid' })
  studentId: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  photograph: string;

  // Contact Details
  @Column({ nullable: true })
  homeAddress: string;

  @Column({ nullable: true })
  parentGuardianName: string;

  @Column({ nullable: true })
  parentGuardianContact: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  emergencyContactNumber: string;

  @Column({ nullable: true })
  communicationPreference: string;

  // Academic Information
  @Column()
  grade: string;

  @Column({ nullable: true })
  rollNumber: string;

  @Column({ nullable: true })
  section: string;

  @Column('simple-array', { nullable: true })
  subjectsEnrolled: string[];

  @Column({ nullable: true })
  previousSchool: string;

  @Column({ nullable: true })
  admissionDate: string;

  @Column({ nullable: true })
  slcNumber: string;

  @Column({ nullable: true })
  board: string;

  @Column({ type: 'decimal', nullable: true })
  gpa: number;

  @Column('simple-json', { nullable: true })
  pastAcademicPerformance: {
    year: string;
    grade: string;
    percentage: number;
  }[];

  // Health and Medical Information
  @Column({ nullable: true })
  bloodGroup: string;

  @Column('simple-json', { nullable: true })
  medicalConditions: {
    condition: string;
    details: string;
  }[];

  @Column('simple-json', { nullable: true })
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];

  @Column({ nullable: true })
  physicalDisabilities: string;

  @Column('simple-json', { nullable: true })
  immunizationRecords: {
    vaccine: string;
    date: string;
    nextDueDate: string;
  }[];

  @Column('simple-json', { nullable: true })
  doctorContact: {
    name: string;
    phone: string;
    address: string;
  };

  // School Relationship
  @Column({ name: 'school_id' })
  schoolId: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  // Status
  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
