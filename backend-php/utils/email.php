<?php
/**
 * Email Service for Royal Health
 * Handles email notifications for bookings and contact forms
 */

class EmailService {

    // Email configuration
    private const ADMIN_EMAILS = [
        'alexanaba22@gmail.com',
        'lucygodwin83@gmail.com',
        'gbengobe@gmail.com',
        'care@royalhealthconsult.com'
    ];
    private const FROM_EMAIL = 'noreply@ancerlarins.com';
    private const FROM_NAME = 'Royal Health Consult';
    private const SUPPORT_EMAIL = 'care@royalhealthconsult.com';

    /**
     * Send booking confirmation email to admin and patient
     */
    public static function sendBookingConfirmation($bookingData) {
        try {
            // Send to admin
            self::sendBookingNotificationToAdmin($bookingData);

            // Send confirmation to patient (if email provided)
            if (!empty($bookingData['patient_email'])) {
                self::sendBookingConfirmationToPatient($bookingData);
            }

            return true;
        } catch (Exception $e) {
            error_log("Booking email failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send booking notification to all admin emails
     */
    private static function sendBookingNotificationToAdmin($booking) {
        $subject = '🏥 New Booking Received - ' . $booking['confirmation_code'];

        $emailBody = self::getBookingAdminTemplate($booking);

        $headers = [
            'From: ' . self::FROM_NAME . ' <' . self::FROM_EMAIL . '>',
            'Reply-To: ' . ($booking['patient_email'] ?? self::SUPPORT_EMAIL),
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'X-Mailer: Royal Health PHP/' . phpversion(),
            'X-Priority: 2' // High priority for bookings
        ];

        $success = true;
        foreach (self::ADMIN_EMAILS as $adminEmail) {
            $result = mail($adminEmail, $subject, $emailBody, implode("\r\n", $headers));
            if (!$result) {
                error_log("Failed to send booking notification to: " . $adminEmail);
                $success = false;
            }
        }

        return $success;
    }

    /**
     * Send booking confirmation to patient
     */
    private static function sendBookingConfirmationToPatient($booking) {
        $subject = '✅ Booking Confirmation - ' . $booking['confirmation_code'];

        $emailBody = self::getBookingPatientTemplate($booking);

        $headers = [
            'From: ' . self::FROM_NAME . ' <' . self::FROM_EMAIL . '>',
            'Reply-To: ' . self::SUPPORT_EMAIL,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'X-Mailer: Royal Health PHP/' . phpversion()
        ];

        return mail($booking['patient_email'], $subject, $emailBody, implode("\r\n", $headers));
    }

    /**
     * Send contact form notification to admin
     */
    public static function sendContactNotification($contactData) {
        try {
            $subject = '📧 New Contact Form - ' . $contactData['reference_id'];

            $emailBody = self::getContactAdminTemplate($contactData);

            $headers = [
                'From: ' . self::FROM_NAME . ' <' . self::FROM_EMAIL . '>',
                'Reply-To: ' . $contactData['email'],
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8',
                'X-Mailer: Royal Health PHP/' . phpversion()
            ];

            // Send to all admin emails
            $adminResult = true;
            foreach (self::ADMIN_EMAILS as $adminEmail) {
                $result = mail($adminEmail, $subject, $emailBody, implode("\r\n", $headers));
                if (!$result) {
                    error_log("Failed to send contact notification to: " . $adminEmail);
                    $adminResult = false;
                }
            }

            // Send auto-reply to customer
            self::sendContactAutoReply($contactData);

            return $adminResult;
        } catch (Exception $e) {
            error_log("Contact email failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send auto-reply to contact form submitter
     */
    private static function sendContactAutoReply($contactData) {
        $subject = 'Thank you for contacting Royal Health Consult';

        $emailBody = self::getContactAutoReplyTemplate($contactData);

        $headers = [
            'From: ' . self::FROM_NAME . ' <' . self::FROM_EMAIL . '>',
            'Reply-To: ' . self::SUPPORT_EMAIL,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'X-Mailer: Royal Health PHP/' . phpversion()
        ];

        return mail($contactData['email'], $subject, $emailBody, implode("\r\n", $headers));
    }

    /**
     * Booking admin email template
     */
    private static function getBookingAdminTemplate($booking) {
        $serviceName = self::getServiceName($booking['service_id'] ?? 'Unknown');
        $bookingDate = date('l, F j, Y', strtotime($booking['scheduled_date']));
        $bookingTime = date('g:i A', strtotime($booking['scheduled_time']));

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>New Booking Notification</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #fff; }
                .header { background: #C2185B; color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 30px 20px; }
                .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
                .label { font-weight: bold; color: #C2185B; display: inline-block; width: 140px; }
                .value { color: #333; }
                .priority { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
                .btn { background: #C2185B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🏥 New Booking Received</h1>
                    <p>Confirmation: <strong>{$booking['confirmation_code']}</strong></p>
                </div>

                <div class='content'>
                    <div class='priority'>
                        <strong>⚡ Action Required:</strong> A new healthcare booking has been received and requires nurse assignment.
                    </div>

                    <div class='booking-details'>
                        <h3>📋 Booking Details</h3>

                        <div class='detail-row'>
                            <span class='label'>Service:</span>
                            <span class='value'>{$serviceName}</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Date & Time:</span>
                            <span class='value'>{$bookingDate} at {$bookingTime}</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Patient:</span>
                            <span class='value'>{$booking['patient_name']}</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Phone:</span>
                            <span class='value'>{$booking['patient_phone']}</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Email:</span>
                            <span class='value'>" . ($booking['patient_email'] ?? 'Not provided') . "</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Address:</span>
                            <span class='value'>{$booking['patient_address']}</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Amount:</span>
                            <span class='value'>₦" . number_format($booking['total_amount']) . "</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Booking Type:</span>
                            <span class='value'>" . ucfirst($booking['booking_type']) . "</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Status:</span>
                            <span class='value'>" . ucfirst($booking['status']) . "</span>
                        </div>

                        <div class='detail-row'>
                            <span class='label'>Booked:</span>
                            <span class='value'>" . date('M j, Y g:i A') . "</span>
                        </div>
                    </div>

                    <div style='text-align: center; margin: 30px 0;'>
                        <p><strong>Next Steps:</strong></p>
                        <p>1. Assign a qualified nurse<br>
                        2. Confirm appointment with patient<br>
                        3. Update booking status</p>
                    </div>
                </div>

                <div class='footer'>
                    <p>Royal Health Consult - Professional Healthcare at Home</p>
                    <p>📞 Contact: " . self::SUPPORT_EMAIL . "</p>
                    <p>📧 Sent to: " . implode(', ', self::ADMIN_EMAILS) . "</p>
                    <p>This is an automated notification from the Royal Health booking system.</p>
                </div>
            </div>
        </body>
        </html>";
    }

    /**
     * Booking patient confirmation template
     */
    private static function getBookingPatientTemplate($booking) {
        $serviceName = self::getServiceName($booking['service_id'] ?? 'Unknown');
        $bookingDate = date('l, F j, Y', strtotime($booking['scheduled_date']));
        $bookingTime = date('g:i A', strtotime($booking['scheduled_time']));

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Booking Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #fff; }
                .header { background: #C2185B; color: white; padding: 30px 20px; text-align: center; }
                .content { padding: 30px 20px; }
                .confirmation { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>✅ Booking Confirmed!</h1>
                    <p>Confirmation Code: <strong>{$booking['confirmation_code']}</strong></p>
                </div>

                <div class='content'>
                    <div class='confirmation'>
                        <h2>🎉 Thank you, {$booking['patient_name']}!</h2>
                        <p>Your healthcare appointment has been successfully booked.</p>
                    </div>

                    <div class='details'>
                        <h3>📅 Appointment Details</h3>
                        <p><strong>Service:</strong> {$serviceName}</p>
                        <p><strong>Date:</strong> {$bookingDate}</p>
                        <p><strong>Time:</strong> {$bookingTime}</p>
                        <p><strong>Amount:</strong> ₦" . number_format($booking['total_amount']) . "</p>
                        <p><strong>Location:</strong> {$booking['patient_address']}</p>
                    </div>

                    <div style='background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                        <h4>What happens next?</h4>
                        <p>1. Our team will assign a qualified nurse to your appointment<br>
                        2. You'll receive a call 24 hours before your appointment<br>
                        3. The nurse will arrive at your specified time and location</p>
                    </div>

                    <div style='text-align: center; margin: 30px 0;'>
                        <p>Questions? Contact us at " . self::SUPPORT_EMAIL . "</p>
                    </div>
                </div>

                <div class='footer'>
                    <p>Royal Health Consult - Professional Healthcare at Home</p>
                    <p>Thank you for choosing our services!</p>
                </div>
            </div>
        </body>
        </html>";
    }

    /**
     * Contact form admin template
     */
    private static function getContactAdminTemplate($contact) {
        return "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #C2185B; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #C2185B; }
                .value { margin-left: 10px; }
                .message-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 5px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h2>📧 New Contact Form Submission</h2>
                <p>Reference ID: {$contact['reference_id']}</p>
            </div>

            <div class='content'>
                <div class='field'>
                    <span class='label'>Name:</span>
                    <span class='value'>{$contact['first_name']} {$contact['last_name']}</span>
                </div>

                <div class='field'>
                    <span class='label'>Email:</span>
                    <span class='value'>{$contact['email']}</span>
                </div>

                <div class='field'>
                    <span class='label'>Phone:</span>
                    <span class='value'>{$contact['phone']}</span>
                </div>

                <div class='field'>
                    <span class='label'>Subject:</span>
                    <span class='value'>{$contact['subject']}</span>
                </div>

                <div class='field'>
                    <span class='label'>Inquiry Type:</span>
                    <span class='value'>{$contact['inquiry_type']}</span>
                </div>

                <div class='field'>
                    <span class='label'>Message:</span>
                    <div class='message-box'>
                        " . nl2br(htmlspecialchars($contact['message'])) . "
                    </div>
                </div>

                <div class='field'>
                    <span class='label'>Submitted:</span>
                    <span class='value'>" . date('Y-m-d H:i:s') . "</span>
                </div>
            </div>

            <div class='footer'>
                <p>This message was sent from the Royal Health Consult contact form.</p>
                <p>Please respond within 24 hours for the best customer experience.</p>
            </div>
        </body>
        </html>";
    }

    /**
     * Contact auto-reply template
     */
    private static function getContactAutoReplyTemplate($contact) {
        return "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #C2185B; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h2>Thank You for Contacting Us!</h2>
            </div>

            <div class='content'>
                <p>Dear {$contact['first_name']},</p>

                <p>Thank you for reaching out to Royal Health Consult. We have received your message and will respond within 24 hours.</p>

                <p><strong>Your Reference ID:</strong> {$contact['reference_id']}</p>

                <p>If you have an urgent healthcare need, please call us directly at our emergency line.</p>

                <p>Best regards,<br>
                Royal Health Consult Team</p>
            </div>

            <div class='footer'>
                <p>Royal Health Consult - Professional Healthcare at Home</p>
                <p>📧 " . self::SUPPORT_EMAIL . "</p>
            </div>
        </body>
        </html>";
    }

    /**
     * Get service name by ID
     */
    private static function getServiceName($serviceId) {
        $services = [
            'health-assessment' => 'Comprehensive Health Assessment',
            'vital-signs' => 'Vital Signs Check',
            'medication-management' => 'Medication Management',
            'wound-care' => 'Wound Care',
            'emergency-assessment' => '24/7 Emergency Health Assessment'
        ];

        return $services[$serviceId] ?? 'Healthcare Service';
    }
}
?>