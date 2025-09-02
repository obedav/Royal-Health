// backend/src/modules/notifications/services/sms.service.ts
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../../common/logger/logger.service';

export interface SmsOptions {
  to: string;
  message: string;
}

@Injectable()
export class SmsService {
  private twilioClient: any;

  constructor(private readonly logger: AppLoggerService) {
    this.initializeTwilio();
  }

  private initializeTwilio() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      try {
        // Dynamically import Twilio to avoid requiring it if not configured
        const twilio = require('twilio');
        this.twilioClient = twilio(accountSid, authToken);
        this.logger.log('Twilio client initialized', 'SmsService');
      } catch (error) {
        this.logger.error(
          'Failed to initialize Twilio client',
          error.message,
          'SmsService',
        );
      }
    } else {
      this.logger.warn('Twilio credentials not configured', 'SmsService');
    }
  }

  async sendSms(options: SmsOptions): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.error(
        'Twilio client not initialized',
        undefined,
        'SmsService',
      );
      return false;
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: options.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: options.to,
      });

      this.logger.log(`SMS sent successfully to ${options.to}`, 'SmsService');
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${options.to}`,
        error.message,
        'SmsService',
      );
      return false;
    }
  }

  async sendAppointmentReminder(
    to: string,
    appointmentDetails: any,
  ): Promise<boolean> {
    const message = `Royal Health Reminder: You have an appointment for ${appointmentDetails.service} on ${appointmentDetails.date} at ${appointmentDetails.time}. Location: ${appointmentDetails.location}`;

    return this.sendSms({
      to,
      message,
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<boolean> {
    const message = `Your Royal Health verification code is: ${code}. This code expires in 10 minutes.`;

    return this.sendSms({
      to,
      message,
    });
  }

  async sendAppointmentConfirmation(
    to: string,
    appointmentDetails: any,
  ): Promise<boolean> {
    const message = `Royal Health: Your appointment for ${appointmentDetails.service} has been confirmed for ${appointmentDetails.date} at ${appointmentDetails.time}.`;

    return this.sendSms({
      to,
      message,
    });
  }

  async sendEmergencyAlert(to: string, message: string): Promise<boolean> {
    const emergencyMessage = `ROYAL HEALTH ALERT: ${message}`;

    return this.sendSms({
      to,
      message: emergencyMessage,
    });
  }
}
