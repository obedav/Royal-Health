// backend/src/modules/bookings/entities/booking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Assessment service details
  @Column({ name: 'service_type' })
  serviceType: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'service_description', type: 'text' })
  serviceDescription: string;

  @Column({ name: 'service_category', default: 'general' })
  category: string;

  // Pricing (always 5000 for assessments)
  @Column({
    name: 'base_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 5000,
  })
  basePrice: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 5000,
  })
  totalPrice: number;

  // Scheduling
  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: string;

  @Column({ name: 'scheduled_time' })
  scheduledTime: string;

  @Column({ name: 'duration', default: 60 })
  duration: number; // minutes

  // Location
  @Column({ name: 'patient_address', type: 'text' })
  patientAddress: string;

  @Column()
  city: string;

  @Column()
  state: string;

  // Medical information
  @Column({ name: 'medical_conditions', type: 'text', nullable: true })
  medicalConditions?: string;

  @Column({ name: 'current_medications', type: 'text', nullable: true })
  currentMedications?: string;

  @Column({ name: 'allergies', type: 'text', nullable: true })
  allergies?: string;

  @Column({ name: 'special_requirements', type: 'text', nullable: true })
  specialRequirements?: string;

  // Emergency contact
  @Column({ name: 'emergency_contact_name' })
  emergencyContactName: string;

  @Column({ name: 'emergency_contact_phone' })
  emergencyContactPhone: string;

  // Status tracking
  @Column({
    name: 'status',
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  // Relationships
  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @Column({ name: 'nurse_id', nullable: true })
  nurseId?: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'nurse_id' })
  nurse?: User;

  // Assessment-specific fields
  @Column({ name: 'assessment_notes', type: 'text', nullable: true })
  assessmentNotes?: string;

  @Column({ name: 'assessment_recommendations', type: 'text', nullable: true })
  assessmentRecommendations?: string;

  @Column({ name: 'follow_up_required', default: false })
  followUpRequired: boolean;

  @Column({ name: 'follow_up_date', type: 'date', nullable: true })
  followUpDate?: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt?: Date;

  @Column({ name: 'cancelled_at', type: 'datetime', nullable: true })
  cancelledAt?: Date;
}
