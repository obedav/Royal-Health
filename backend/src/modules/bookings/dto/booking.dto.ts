// backend/src/modules/bookings/dto/booking.dto.ts
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Assessment service categories
export enum AssessmentCategory {
  GENERAL = 'general',
  SPECIALIZED = 'specialized', 
  EMERGENCY = 'emergency',
  ROUTINE = 'routine'
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank-transfer',
  USSD = 'ussd',
  CASH = 'cash'
}

export class CreateBookingDto {
  @ApiProperty({ 
    description: 'Type of assessment service',
    example: 'general-health-assessment'
  })
  @IsString()
  serviceType: string;

  @ApiProperty({ 
    description: 'Name of the assessment service',
    example: 'General Health Assessment'
  })
  @IsString()
  serviceName: string;

  @ApiProperty({ 
    description: 'Description of the assessment',
    example: 'Comprehensive health evaluation including vital signs monitoring',
    default: 'General health service'
  })
  @IsString()
  serviceDescription: string = 'General health service';

  @ApiProperty({ 
    description: 'Base assessment price (always 5000 NGN)',
    example: 5000,
    minimum: 5000,
    maximum: 5000
  })
  @IsNumber()
  @Min(5000)
  @Max(5000)
  basePrice: number;

  @ApiProperty({ 
    description: 'Total price for assessment (always 5000 NGN)',
    example: 5000
  })
  @IsNumber()
  @Min(5000)
  @Max(5000) 
  totalPrice: number;

  @ApiProperty({ 
    description: 'Scheduled date for assessment',
    example: '2025-08-25'
  })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ 
    description: 'Scheduled time for assessment',
    example: '10:00 AM'
  })
  @IsString()
  scheduledTime: string;

  @ApiProperty({ 
    description: 'Duration of assessment in minutes',
    example: 60,
    minimum: 45,
    maximum: 90
  })
  @IsNumber()
  @Min(45)
  @Max(90)
  duration: number;

  @ApiProperty({ 
    description: 'Patient address for home assessment',
    example: '123 Victoria Island, Lagos'
  })
  @IsString()
  patientAddress: string;

  @ApiProperty({ 
    description: 'City where assessment will take place',
    example: 'Lagos'
  })
  @IsString()
  city: string;

  @ApiProperty({ 
    description: 'State where assessment will take place',
    example: 'Lagos'
  })
  @IsString()
  state: string;

  @ApiProperty({ 
    description: 'Emergency contact name',
    example: 'John Doe'
  })
  @IsString()
  emergencyContactName: string;

  @ApiProperty({ 
    description: 'Emergency contact phone number',
    example: '+2348012345678'
  })
  @IsString()
  emergencyContactPhone: string;

  @ApiProperty({ 
    description: 'Current medical conditions (optional)',
    example: 'Hypertension, Diabetes',
    required: false
  })
  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @ApiProperty({ 
    description: 'Current medications being taken (optional)',
    example: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
    required: false
  })
  @IsOptional()
  @IsString()
  currentMedications?: string;

  @ApiProperty({ 
    description: 'Known allergies (optional)',
    example: 'Penicillin allergy, Shellfish allergy',
    required: false
  })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty({ 
    description: 'Special requirements for the assessment (optional)',
    example: 'Patient has mobility issues, requires wheelchair access',
    required: false
  })
  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @ApiProperty({ 
    description: 'Preferred payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CARD
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ 
    description: 'Assessment category',
    enum: AssessmentCategory,
    example: AssessmentCategory.GENERAL,
    required: false
  })
  @IsOptional()
  @IsEnum(AssessmentCategory)
  category?: AssessmentCategory;
}

// Update DTO for partial updates
export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ 
    description: 'Booking status update',
    example: 'confirmed',
    required: false
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ 
    description: 'Payment status update',
    example: 'paid',
    required: false
  })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiProperty({ 
    description: 'Assigned nurse ID',
    example: 'nurse-uuid-here',
    required: false
  })
  @IsOptional()
  @IsString()
  nurseId?: string;

  @ApiProperty({ 
    description: 'Assessment notes from healthcare professional',
    example: 'Patient shows normal vital signs. Recommend follow-up in 6 months.',
    required: false
  })
  @IsOptional()
  @IsString()
  assessmentNotes?: string;

  @ApiProperty({ 
    description: 'Assessment recommendations',
    example: 'Maintain current medication. Increase physical activity.',
    required: false
  })
  @IsOptional()
  @IsString()
  assessmentRecommendations?: string;

  @ApiProperty({ 
    description: 'Whether follow-up is required',
    example: true,
    required: false
  })
  @IsOptional()
  followUpRequired?: boolean;

  @ApiProperty({ 
    description: 'Follow-up date if required',
    example: '2025-09-25',
    required: false
  })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}

// Response DTOs
export class BookingResponseDto {
  @ApiProperty({ description: 'Booking ID' })
  id: string;

  @ApiProperty({ description: 'Service type' })
  serviceType: string;

  @ApiProperty({ description: 'Service name' })
  serviceName: string;

  @ApiProperty({ description: 'Booking status' })
  status: string;

  @ApiProperty({ description: 'Payment status' })
  paymentStatus: string;

  @ApiProperty({ description: 'Scheduled date' })
  scheduledDate: string;

  @ApiProperty({ description: 'Scheduled time' })
  scheduledTime: string;

  @ApiProperty({ description: 'Assessment duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Total price' })
  totalPrice: number;

  @ApiProperty({ description: 'Patient information' })
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  @ApiProperty({ description: 'Assigned nurse (if any)', required: false })
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class BookingStatsResponseDto {
  @ApiProperty({ description: 'Total number of bookings' })
  total: number;

  @ApiProperty({ description: 'Number of pending bookings' })
  pending: number;

  @ApiProperty({ description: 'Number of confirmed bookings' })
  confirmed: number;

  @ApiProperty({ description: 'Number of completed bookings' })
  completed: number;

  @ApiProperty({ description: 'Number of cancelled bookings' })
  cancelled: number;

  @ApiProperty({ description: 'Total revenue from completed bookings' })
  revenue: number;
}