// src/modules/company/company.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Company')
@Controller('company')
@Public() // ← Added this decorator
export class CompanyController {

  @Get('contact-info')
  @ApiOperation({ summary: 'Get company contact information' })
  @ApiResponse({ status: 200, description: 'Company contact information retrieved successfully' })
  getContactInfo() {
    console.log('📞 Getting company contact info');
    
    return {
      phones: ['+234 706 332 5184', '+234 808 374 7339'],
      emails: ['info@royalhealthconsult.ng', 'support@royalhealthconsult.ng'],
      address: {
        street: '4 Barthlomew Ezeogu Street',
        city: 'Oke Alfa, Isolo',
        state: 'Lagos',
        country: 'Nigeria',
        postalCode: '101241'
      },
      businessHours: {
        weekdays: 'Mon - Fri: 8:00 AM - 6:00 PM',
        saturday: 'Sat: 9:00 AM - 4:00 PM',
        sunday: 'Sun: Emergency Services Only',
        emergency: '24/7 Emergency Available'
      },
      socialMedia: {
        facebook: 'https://facebook.com/royalhealthconsult',
        twitter: 'https://twitter.com/royalhealthng',
        instagram: 'https://instagram.com/royalhealthconsult',
        linkedin: 'https://linkedin.com/company/royal-health-consult',
        whatsapp: 'https://wa.me/2347063325184'
      }
    };
  }

  @Get('about')
  @ApiOperation({ summary: 'Get company information' })
  @ApiResponse({ status: 200, description: 'Company information retrieved successfully' })
  getAbout() {
    return {
      name: 'Royal Health Consult',
      tagline: 'Your Trusted Healthcare Partner',
      description: 'Royal Health Consult is Nigeria\'s leading home healthcare service provider, offering professional medical care in the comfort of your home.',
      mission: 'To provide accessible, quality healthcare services to every Nigerian family.',
      vision: 'To be the most trusted healthcare platform in Nigeria.',
      founded: '2023',
      services: [
        'Home Healthcare Services',
        'Medical Consultations',
        'Health Assessments',
        'Emergency Medical Response',
        'Nursing Care',
        'Health Monitoring'
      ],
      certifications: [
        'Nigeria Medical Association (NMA)',
        'Nursing and Midwifery Council of Nigeria (NMCN)',
        'Lagos State Health Service Commission'
      ]
    };
  }
}