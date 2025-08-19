// src/modules/contact/dto/contact.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+234 801 234 5678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Subject of inquiry', example: 'Booking assistance needed' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ 
    description: 'Type of inquiry', 
    example: 'booking',
    enum: ['general', 'booking', 'medical', 'emergency', 'partnership', 'careers', 'technical', 'feedback']
  })
  @IsString()
  @IsNotEmpty()
  inquiryType: string;

  @ApiProperty({ description: 'Message content', example: 'I need help with booking an appointment for tomorrow.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Submission timestamp', required: false })
  @IsOptional()
  @IsString()
  submittedAt?: string;

  @ApiProperty({ description: 'Source of submission', required: false, example: 'website_contact_form' })
  @IsOptional()
  @IsString()
  source?: string;
}