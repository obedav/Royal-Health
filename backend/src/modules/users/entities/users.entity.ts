// backend/src/modules/users/entities/users.entity.ts - Corrected to match Supabase schema exactly
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  CLIENT = 'client',
  NURSE = 'nurse',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  password_hash: string;

  @Column({ name: 'first_name', nullable: true })
firstName: string;

@Column({ name: 'last_name', nullable: true })
lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'varchar', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'varchar', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

@Column({ name: 'is_email_verified', default: false })
isEmailVerified: boolean;

@Column({ name: 'is_phone_verified', default: false })
isPhoneVerified: boolean;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ type: 'varchar', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true, name: 'national_id' })
  nationalId: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true, name: 'avatar_url' })
  avatar: string;

  @Column({ nullable: true, name: 'preferred_language' })
  preferredLanguage: string;

  @Column({ nullable: true, name: 'supabase_user_id' })
  supabaseUserId: string;

  @Column({ nullable: true, name: 'email_verification_token' })
  @Exclude()
  emailVerificationToken: string;

  @Column({ nullable: true, name: 'phone_verification_code' })
  @Exclude()
  phoneVerificationCode: string;

  @Column({ nullable: true, name: 'password_reset_token' })
  @Exclude()
  passwordResetToken: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'password_reset_expires' })
  passwordResetExpires: Date;

  @Column({ type: 'integer', default: 0, name: 'login_attempts' })
  loginAttempts: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'lock_until' })
  lockUntil: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Hash password before saving (only on insert)
  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.password_hash) {
      this.password_hash = await bcrypt.hash(this.password_hash, 12);
    }
  }

  // Only hash password on update if it's been modified and not already hashed
  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    if (this.password_hash && !this.password_hash.startsWith('$2a$') && !this.password_hash.startsWith('$2b$')) {
      this.password_hash = await bcrypt.hash(this.password_hash, 12);
    }
  }

  // Compare password method
  async comparePassword(candidatePassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(candidatePassword, this.password_hash);
    } catch (error) {
      console.error('Password comparison error:', error);
      return false;
    }
  }

  // Check if account is locked
  get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }

  // Increment login attempts
  incrementLoginAttempts(): void {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < new Date()) {
      this.loginAttempts = 1;
      this.lockUntil = null;
    } else {
      this.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 2 hours
      if (this.loginAttempts >= 5 && !this.isLocked) {
        this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
      }
    }
  }

  // Reset login attempts
  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lockUntil = null;
  }

  // Get full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Check if user is adult (18+)
  get isAdult(): boolean {
    if (!this.dateOfBirth) return true;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }
}