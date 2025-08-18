// backend/src/modules/auth/dto/auth.dto.ts
import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsDateString,
  IsBoolean,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../users/entities/users.entity';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ example: 'male' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  // 🔥 ADD THIS NEW FIELD FOR SUPABASE INTEGRATION
  @ApiProperty({ 
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'Supabase user ID for linking accounts',
    required: false 
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  supabaseUserId?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;

  // 🔥 ADD THIS NEW FIELD FOR SUPABASE INTEGRATION
  @ApiProperty({ 
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'Supabase user ID for account verification',
    required: false 
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  supabaseUserId?: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  confirmPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  newPassword: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  confirmPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class VerifyPhoneDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ResendVerificationDto {
  @ApiProperty({ enum: ['email', 'phone'] })
  @IsEnum(['email', 'phone'])
  type: 'email' | 'phone';
}

// 🔥 UPDATED Response DTOs to include Supabase fields
export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({
    example: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+2348012345678',
      role: 'client',
      status: 'active',
      isEmailVerified: true,
      isPhoneVerified: true,
      state: 'Lagos',
      city: 'Lagos',
      preferredLanguage: 'en',
      supabaseUserId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status: UserStatus; // 🔥 CHANGED from string to UserStatus enum
    dateOfBirth?: Date; // 🔥 ADDED to match your User entity
    gender?: string; // 🔥 ADDED to match your User entity  
    nationalId?: string; // 🔥 ADDED to match your User entity
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    state?: string;
    city?: string;
    preferredLanguage?: string;
    supabaseUserId?: string;
    createdAt: Date; // 🔥 CHANGED from string to Date
    updatedAt: Date; // 🔥 CHANGED from string to Date
    // Add any other fields from your User entity that you want to return
  };

  @ApiProperty({ example: 3600 })
  expiresIn: number;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  success: boolean;
}

// 🔥 ADD NEW DTO for refresh token
export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}