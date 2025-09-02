// backend/src/modules/notifications/services/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppLoggerService } from '../../../common/logger/logger.service';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly logger: AppLoggerService) {
    this.createTransporter();
  }

  private createTransporter() {
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    this.transporter = nodemailer.createTransport(config);

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error(
          'Email transporter verification failed',
          error.message,
          'EmailService',
        );
      } else {
        this.logger.log('Email transporter ready', 'EmailService');
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email sent successfully to ${options.to}`,
        'EmailService',
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}`,
        error.message,
        'EmailService',
      );
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to Royal Health Consult!</h1>
        <p>Dear ${name},</p>
        <p>Welcome to Royal Health Consult! We're excited to have you join our healthcare community.</p>
        <p>With Royal Health Consult, you can:</p>
        <ul>
          <li>Book healthcare appointments</li>
          <li>Access professional nursing services</li>
          <li>Get home healthcare consultations</li>
          <li>Manage your health records</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The Royal Health Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to Royal Health Consult',
      html,
    });
  }

  async sendAppointmentConfirmation(
    to: string,
    appointmentDetails: any,
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Appointment Confirmation</h1>
        <p>Your appointment has been confirmed!</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Appointment Details:</h3>
          <p><strong>Service:</strong> ${appointmentDetails.service}</p>
          <p><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.time}</p>
          <p><strong>Location:</strong> ${appointmentDetails.location}</p>
        </div>
        <p>Please arrive 15 minutes early for your appointment.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br>The Royal Health Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Appointment Confirmation - Royal Health Consult',
      html,
    });
  }

  async sendPasswordReset(to: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Password Reset Request</h1>
        <p>You requested a password reset for your Royal Health Consult account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Royal Health Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Password Reset - Royal Health Consult',
      html,
    });
  }
}
