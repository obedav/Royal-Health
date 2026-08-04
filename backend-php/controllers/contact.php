<?php
/**
 * Contact Form Controller with Database Storage
 * Handles contact form submissions and saves to database
 */

// Get segments from global scope (set in index.php)
global $segments;

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($segments[1]) ? $segments[1] : '';

if ($method === 'POST') {
    // Handle both /contact and /contact/submit for compatibility
    if ($action === 'submit' || $action === '') {
        handleContactSubmit();
    } else {
        Response::error('Invalid action', 404);
    }
} else {
    Response::error('Method not allowed', 405);
}

function handleContactSubmit() {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }

        // Validate required fields
        $required = ['firstName', 'lastName', 'email', 'phone', 'subject', 'inquiryType', 'message'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                Response::error(ucfirst($field) . ' is required', 400);
                return;
            }
        }

        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
            return;
        }

        // Validate phone number (basic check)
        if (strlen(trim($input['phone'])) < 10) {
            Response::error('Please enter a valid phone number', 400);
            return;
        }

        // Validate message length
        if (strlen(trim($input['message'])) < 10) {
            Response::error('Message must be at least 10 characters long', 400);
            return;
        }

        // Generate IDs
        $messageId = generateContactUUID();
        $referenceId = 'RHC-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        // Prepare message data
        $messageData = [
            'id' => $messageId,
            'reference_id' => $referenceId,
            'first_name' => trim($input['firstName']),
            'last_name' => trim($input['lastName']),
            'email' => trim($input['email']),
            'phone' => trim($input['phone']),
            'subject' => trim($input['subject']),
            'inquiry_type' => trim($input['inquiryType']),
            'message' => trim($input['message']),
            'status' => 'new',
            'submitted_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // Save to database (optional - continue if fails)
        try {
            $db = Database::getInstance();
            $db->insert('contact_messages', $messageData);
            error_log("Contact message saved to database: " . $referenceId);
        } catch (Exception $dbError) {
            error_log("Database error saving contact message: " . $dbError->getMessage());
            // Continue execution - we'll still return success even if DB fails
        }

        // Send email notification
        try {
            sendContactAdminNotification($input, $referenceId);
        } catch (Exception $emailError) {
            error_log("Email notification failed: " . $emailError->getMessage());
            // Continue execution - we'll still return success even if email fails
        }

        // Success response
        $responseData = [
            'referenceId' => $referenceId,
            'submittedAt' => date('Y-m-d H:i:s'),
            'status' => 'received',
            'estimatedResponse' => '24 hours'
        ];

        Response::success($responseData, 'Contact form submitted successfully');

    } catch (Exception $e) {
        error_log("Contact form error: " . $e->getMessage());
        Response::error('Failed to submit contact form', 500);
    }
}

function sendContactAdminNotification($input, $referenceId) {
    // Send to all configured admin emails
    $adminEmails = [
        'alexanaba22@gmail.com',
        'lucygodwin83@gmail.com',
        'gbengobe@gmail.com',
        'care@royalhealthconsult.com'
    ];

    $emailsSent = 0;
    $subject = 'New Contact Form Submission - ' . $referenceId;

    // Generate WhatsApp reply link
    $customerPhone = preg_replace('/[^0-9]/', '', $input['phone']);
    // Ensure phone has country code (Nigeria +234)
    if (strlen($customerPhone) === 10) {
        $customerPhone = '234' . $customerPhone;
    } elseif (strlen($customerPhone) === 11 && $customerPhone[0] === '0') {
        $customerPhone = '234' . substr($customerPhone, 1);
    }

    $whatsappMessage = urlencode("Hello " . $input['firstName'] . ", thank you for contacting Royal Health Consult regarding \"" . $input['subject'] . "\". How can we assist you today?");
    $whatsappLink = "https://wa.me/" . $customerPhone . "?text=" . $whatsappMessage;

    $emailSubjectEncoded = urlencode("Re: " . $input['subject'] . " - " . $referenceId);

    $emailBody = '
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #C2185B; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #C2185B; }
            .value { margin-left: 10px; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            .whatsapp-btn {
                display: inline-block;
                background: #25D366;
                color: white !important;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 10px 5px;
            }
            .email-btn {
                display: inline-block;
                background: #C2185B;
                color: white !important;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 10px 5px;
            }
            .phone-btn {
                display: inline-block;
                background: #2196F3;
                color: white !important;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 10px 5px;
            }
            .quick-actions { text-align: center; padding: 20px; background: #f0f0f0; border-radius: 10px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>Reference ID: ' . htmlspecialchars($referenceId) . '</p>
        </div>

        <div class="content">
            <div class="quick-actions">
                <h3 style="margin-top: 0; color: #333;">Quick Response Options</h3>
                <a href="' . $whatsappLink . '" class="whatsapp-btn">Reply via WhatsApp</a>
                <a href="mailto:' . htmlspecialchars($input['email']) . '?subject=' . $emailSubjectEncoded . '" class="email-btn">Reply via Email</a>
                <a href="tel:' . htmlspecialchars($input['phone']) . '" class="phone-btn">Call Customer</a>
            </div>

            <div class="field">
                <span class="label">Name:</span>
                <span class="value">' . htmlspecialchars($input['firstName']) . ' ' . htmlspecialchars($input['lastName']) . '</span>
            </div>

            <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:' . htmlspecialchars($input['email']) . '">' . htmlspecialchars($input['email']) . '</a></span>
            </div>

            <div class="field">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:' . htmlspecialchars($input['phone']) . '">' . htmlspecialchars($input['phone']) . '</a></span>
            </div>

            <div class="field">
                <span class="label">Subject:</span>
                <span class="value">' . htmlspecialchars($input['subject']) . '</span>
            </div>

            <div class="field">
                <span class="label">Inquiry Type:</span>
                <span class="value">' . htmlspecialchars($input['inquiryType']) . '</span>
            </div>

            <div class="field">
                <span class="label">Message:</span>
                <div class="value" style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 5px;">
                    ' . nl2br(htmlspecialchars($input['message'])) . '
                </div>
            </div>

            <div class="field">
                <span class="label">Submitted:</span>
                <span class="value">' . date('Y-m-d H:i:s') . '</span>
            </div>
        </div>

        <div class="footer">
            <p>This message was sent from the Royal Health Consult contact form.</p>
            <p>Please respond within 24 hours for the best customer experience.</p>
        </div>
    </body>
    </html>
    ';

    $headers = implode("\r\n", [
        'From: Royal Health Consult <noreply@royalhealthconsult.com>',
        'Reply-To: ' . $input['email'],
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion()
    ]);

    // Send email to all admin addresses
    foreach ($adminEmails as $adminEmail) {
        try {
            $result = @mail($adminEmail, $subject, $emailBody, $headers);
            if ($result) {
                $emailsSent++;
                error_log("Contact notification sent to: " . $adminEmail);
            } else {
                error_log("Failed to send contact notification to: " . $adminEmail);
            }
        } catch (Exception $e) {
            error_log("Error sending to " . $adminEmail . ": " . $e->getMessage());
        }
    }

    // Log result
    if ($emailsSent > 0) {
        error_log("Contact form notification sent to " . $emailsSent . " admin emails");
        return true;
    } else {
        error_log("Warning: No admin notification emails were sent successfully");
        return false;
    }
}

function generateContactUUID() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}
