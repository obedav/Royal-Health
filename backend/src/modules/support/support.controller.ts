// src/modules/support/support.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator'; // ← Added this import

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

@ApiTags('Support')
@Controller('support')
@Public() // ← Added this decorator
export class SupportController {
  @Get('faqs')
  @ApiOperation({ summary: 'Get frequently asked questions' })
  @ApiResponse({ status: 200, description: 'FAQs retrieved successfully' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  getFAQs(@Query('category') category?: string): FAQ[] {
    console.log('❓ Getting FAQs', category ? `for category: ${category}` : '');

    const faqs: FAQ[] = [
      {
        id: '1',
        question: 'How do I book an appointment?',
        answer:
          'You can book an appointment through our website, mobile app, or by calling our booking hotline at +234 706 332 5184. Online booking is available 24/7 for your convenience.',
        category: 'Booking',
        isActive: true,
        order: 1,
      },
      {
        id: '2',
        question: 'What services do you offer?',
        answer:
          'We offer comprehensive home healthcare services including nursing care, medical consultations, health screenings, wound care, medication administration, post-operative care, and emergency medical assistance.',
        category: 'Services',
        isActive: true,
        order: 2,
      },
      {
        id: '3',
        question: 'Do you accept health insurance?',
        answer:
          'Yes, we accept most major health insurance plans including NHIS, HMOs, and private insurance. Please contact us to verify if your specific insurance plan is accepted before booking.',
        category: 'Insurance',
        isActive: true,
        order: 3,
      },
      {
        id: '4',
        question: 'What are your emergency response times?',
        answer:
          'For emergency calls within Lagos, our response time is typically 15-30 minutes. For other locations in Nigeria, response times may vary but we aim for under 60 minutes. For non-emergency services, we can usually schedule same-day or next-day appointments.',
        category: 'Emergency',
        isActive: true,
        order: 4,
      },
      {
        id: '5',
        question: 'Are your healthcare professionals qualified?',
        answer:
          'Yes, all our healthcare professionals are licensed and certified by the appropriate Nigerian medical bodies including NMA and NMCN. They undergo continuous training and background checks.',
        category: 'Professionals',
        isActive: true,
        order: 5,
      },
      {
        id: '6',
        question: 'What areas do you serve?',
        answer:
          'We currently serve Lagos State and surrounding areas. We are expanding to other states in Nigeria. Please contact us to check if we serve your specific location.',
        category: 'Coverage',
        isActive: true,
        order: 6,
      },
      {
        id: '7',
        question: 'How much do your services cost?',
        answer:
          'Our pricing varies depending on the type of service and duration. We offer competitive rates and accept insurance. Please contact us for a detailed quote based on your specific needs.',
        category: 'Pricing',
        isActive: true,
        order: 7,
      },
      {
        id: '8',
        question: 'Can I cancel or reschedule my appointment?',
        answer:
          'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time through our website, app, or by calling us. Cancellations with less than 2 hours notice may incur a fee.',
        category: 'Booking',
        isActive: true,
        order: 8,
      },
    ];

    // Filter by category if provided
    let filteredFaqs = faqs.filter((faq) => faq.isActive);

    if (category) {
      filteredFaqs = filteredFaqs.filter(
        (faq) => faq.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // Sort by order
    filteredFaqs.sort((a, b) => a.order - b.order);

    return filteredFaqs;
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get FAQ categories' })
  @ApiResponse({
    status: 200,
    description: 'FAQ categories retrieved successfully',
  })
  getCategories() {
    return [
      { name: 'Booking', count: 2 },
      { name: 'Services', count: 1 },
      { name: 'Insurance', count: 1 },
      { name: 'Emergency', count: 1 },
      { name: 'Professionals', count: 1 },
      { name: 'Coverage', count: 1 },
      { name: 'Pricing', count: 1 },
    ];
  }
}
