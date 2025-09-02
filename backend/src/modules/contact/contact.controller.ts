// src/modules/contact/contact.controller.ts
import { Controller, Post, Get, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateContactDto } from './dto/contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  @Post('submit')
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiResponse({
    status: 201,
    description: 'Contact form submitted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiBody({ type: CreateContactDto })
  async submitContact(@Body() createContactDto: CreateContactDto) {
    console.log('📨 Contact form submission received:', {
      email: createContactDto.email,
      subject: createContactDto.subject,
      inquiryType: createContactDto.inquiryType,
    });

    // Create contact submission object
    const contactSubmission = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: createContactDto.firstName.trim(),
      lastName: createContactDto.lastName.trim(),
      email: createContactDto.email.trim().toLowerCase(),
      phone: createContactDto.phone.trim(),
      subject: createContactDto.subject.trim(),
      inquiryType: createContactDto.inquiryType,
      message: createContactDto.message.trim(),
      submittedAt: createContactDto.submittedAt || new Date().toISOString(),
      source: createContactDto.source || 'website_contact_form',
      status: 'pending',
      priority:
        createContactDto.inquiryType === 'emergency' ? 'high' : 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Save to database when you have contact submissions table
    // For now, just log it
    console.log('📝 Contact submission created:', contactSubmission);

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user
    // TODO: Create notification for admin dashboard

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      message:
        'Contact form submitted successfully. We will get back to you within 24 hours.',
      id: contactSubmission.id,
      data: {
        id: contactSubmission.id,
        submittedAt: contactSubmission.submittedAt,
        status: contactSubmission.status,
        priority: contactSubmission.priority,
      },
    };
  }

  @Get('submissions')
  @ApiOperation({ summary: 'Get all contact submissions (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Contact submissions retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async getSubmissions() {
    // TODO: Add authentication middleware to check admin role
    // TODO: Get submissions from database

    return {
      submissions: [],
      total: 0,
      message: 'Contact submissions endpoint - database integration pending',
    };
  }

  @Get('inquiry-types')
  @ApiOperation({ summary: 'Get available inquiry types' })
  @ApiResponse({
    status: 200,
    description: 'Inquiry types retrieved successfully',
  })
  getInquiryTypes() {
    return [
      {
        value: 'general',
        label: 'General Inquiry',
        description: 'General questions about our services',
      },
      {
        value: 'booking',
        label: 'Booking & Appointments',
        description: 'Questions about booking appointments',
      },
      {
        value: 'medical',
        label: 'Medical Consultation',
        description: 'Medical questions and consultations',
      },
      {
        value: 'emergency',
        label: 'Emergency Services',
        description: 'Emergency medical assistance',
      },
      {
        value: 'partnership',
        label: 'Partnership Opportunities',
        description: 'Business partnerships and collaborations',
      },
      {
        value: 'careers',
        label: 'Careers & Employment',
        description: 'Job opportunities and career inquiries',
      },
      {
        value: 'technical',
        label: 'Technical Support',
        description: 'Website or app technical issues',
      },
      {
        value: 'feedback',
        label: 'Feedback & Complaints',
        description: 'Service feedback and complaints',
      },
    ];
  }
}
