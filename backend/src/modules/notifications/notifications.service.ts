import { Injectable } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { AppLoggerService } from '../../common/logger/logger.service';

export interface NotificationOptions {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly logger: AppLoggerService,
  ) {}

  async sendWelcome(
    to: string,
    name: string,
    phone?: string,
    options: NotificationOptions = { email: true },
  ): Promise<void> {
    const promises = [];

    if (options.email) {
      promises.push(this.emailService.sendWelcomeEmail(to, name));
    }

    if (options.sms && phone) {
      const message = `Welcome to Royal Health Consult, ${name}! Your account has been created successfully.`;
      promises.push(this.smsService.sendSms({ to: phone, message }));
    }

    await Promise.all(promises);
    this.logger.logBusiness('Welcome notification sent', undefined, {
      to,
      name,
    });
  }

  async sendAppointmentConfirmation(
    email: string,
    phone: string,
    appointmentDetails: any,
    options: NotificationOptions = { email: true, sms: true },
  ): Promise<void> {
    const promises = [];

    if (options.email) {
      promises.push(
        this.emailService.sendAppointmentConfirmation(
          email,
          appointmentDetails,
        ),
      );
    }

    if (options.sms) {
      promises.push(
        this.smsService.sendAppointmentConfirmation(phone, appointmentDetails),
      );
    }

    await Promise.all(promises);
    this.logger.logBusiness(
      'Appointment confirmation sent',
      appointmentDetails.userId,
      { appointmentDetails },
    );
  }

  async sendAppointmentReminder(
    email: string,
    phone: string,
    appointmentDetails: any,
    options: NotificationOptions = { email: true, sms: true },
  ): Promise<void> {
    const promises = [];

    if (options.email) {
      // You could create an appointment reminder email template
      promises.push(
        this.emailService.sendEmail({
          to: email,
          subject: 'Appointment Reminder - Royal Health Consult',
          html: `Your appointment for ${appointmentDetails.service} is tomorrow at ${appointmentDetails.time}.`,
        }),
      );
    }

    if (options.sms) {
      promises.push(
        this.smsService.sendAppointmentReminder(phone, appointmentDetails),
      );
    }

    await Promise.all(promises);
    this.logger.logBusiness(
      'Appointment reminder sent',
      appointmentDetails.userId,
      { appointmentDetails },
    );
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    await this.emailService.sendPasswordReset(email, resetToken);
    this.logger.logBusiness('Password reset email sent', undefined, { email });
  }

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    await this.smsService.sendVerificationCode(phone, code);
    this.logger.logBusiness('Verification code sent', undefined, { phone });
  }

  async sendEmergencyAlert(contacts: string[], message: string): Promise<void> {
    const promises = contacts.map((contact) =>
      this.smsService.sendEmergencyAlert(contact, message),
    );

    await Promise.all(promises);
    this.logger.logBusiness('Emergency alert sent', undefined, {
      contacts: contacts.length,
      message,
    });
  }
}
