<?php
/**
 * Consultations Controller
 * Handles consultation form submissions
 */

// Get segments from global scope (set in index.php)
global $segments;

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($segments[1]) ? $segments[1] : '';

if ($method === 'POST') {
    if ($action === '' || $action === 'submit') {
        handleConsultationSubmit();
    } else {
        Response::error('Invalid action', 404);
    }
} elseif ($method === 'GET') {
    if ($action === '' || $action === 'list') {
        handleGetConsultations();
    } else {
        Response::error('Invalid action', 404);
    }
} else {
    Response::error('Method not allowed', 405);
}

function handleConsultationSubmit() {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }

        // Validate required fields
        $required = ['name', 'phone', 'age', 'gender', 'serviceType', 'state', 'city', 'address', 'preferredDate', 'preferredTime'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || (is_string($input[$field]) && empty(trim($input[$field])))) {
                Response::error(ucfirst($field) . ' is required', 400);
                return;
            }
        }

        // Validate phone number (basic check)
        $phone = is_string($input['phone']) ? trim($input['phone']) : '';
        if (strlen($phone) < 10) {
            Response::error('Please enter a valid phone number', 400);
            return;
        }

        // Generate IDs
        $consultationId = generateConsultationUUID();
        $referenceId = 'RHC-CON-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        // Prepare consultation data
        $consultationData = [
            'id' => $consultationId,
            'reference_id' => $referenceId,
            'name' => trim($input['name']),
            'phone' => $phone,
            'email' => isset($input['email']) ? trim($input['email']) : null,
            'age' => intval($input['age']),
            'gender' => trim($input['gender']),
            'service_type' => trim($input['serviceType']),
            'selected_service' => isset($input['selectedService']) ? trim($input['selectedService']) : null,
            'state' => trim($input['state']),
            'city' => trim($input['city']),
            'address' => trim($input['address']),
            'health_concerns' => isset($input['healthConcerns']) ? trim($input['healthConcerns']) : null,
            'preferred_date' => trim($input['preferredDate']),
            'preferred_time' => trim($input['preferredTime']),
            'status' => 'pending',
            'submitted_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // Save to database (optional - continue if fails)
        try {
            $db = Database::getInstance();
            $db->insert('consultations', $consultationData);
            error_log("Consultation saved to database: " . $referenceId);
        } catch (Exception $dbError) {
            error_log("Database error saving consultation: " . $dbError->getMessage());
            // Continue execution - we'll still return success even if DB fails
        }

        // Send email notifications
        $emailSent = false;
        try {
            $emailSent = sendConsultationAdminNotification($input, $referenceId);
            // Also send confirmation to customer if email provided
            if (!empty($input['email'])) {
                sendConsultationCustomerConfirmation($input, $referenceId);
            }
        } catch (Exception $emailError) {
            error_log("Consultation email notification failed: " . $emailError->getMessage());
            // Continue execution - we'll still return success even if email fails
        }

        // Success response
        $responseData = [
            'referenceId' => $referenceId,
            'submittedAt' => date('Y-m-d H:i:s'),
            'status' => 'pending',
            'message' => 'We will contact you within 24 hours'
        ];

        Response::success($responseData, 'Consultation request submitted successfully');

    } catch (Exception $e) {
        error_log("Consultation form error: " . $e->getMessage());
        Response::error('Failed to submit consultation request', 500);
    }
}

function handleGetConsultations() {
    // This would typically require authentication
    // For now, return empty array or implement auth check
    Response::error('Authentication required', 401);
}

function sendConsultationAdminNotification($input, $referenceId) {
    // Send to all configured admin emails
    $adminEmails = [
        'alexanaba22@gmail.com',
        'lucygodwin83@gmail.com',
        'gbengobe@gmail.com',
        'care@royalhealthconsult.com'
    ];

    $emailsSent = 0;
    $subject = 'New Consultation Request - ' . $referenceId;

    // Generate WhatsApp reply link
    $customerPhone = preg_replace('/[^0-9]/', '', $input['phone']);
    // Ensure phone has country code (Nigeria +234)
    if (strlen($customerPhone) === 10) {
        $customerPhone = '234' . $customerPhone;
    } elseif (strlen($customerPhone) === 11 && $customerPhone[0] === '0') {
        $customerPhone = '234' . substr($customerPhone, 1);
    }

    $serviceName = isset($input['selectedService']) ? $input['selectedService'] : $input['serviceType'];
    $whatsappMessage = urlencode("Hello " . $input['name'] . ", thank you for requesting a consultation with Royal Health Consult for " . $serviceName . ". We're reaching out to confirm your appointment. How can we assist you?");
    $whatsappLink = "https://wa.me/" . $customerPhone . "?text=" . $whatsappMessage;

    $emailSubjectEncoded = urlencode("Re: Consultation Request - " . $referenceId);
    $customerEmail = isset($input['email']) && !empty($input['email']) ? $input['email'] : '';

    // Format preferred time
    $timeLabels = [
        'morning' => 'Morning (8AM - 12PM)',
        'afternoon' => 'Afternoon (12PM - 5PM)',
        'evening' => 'Evening (5PM - 8PM)'
    ];
    $preferredTimeFormatted = isset($timeLabels[$input['preferredTime']]) ? $timeLabels[$input['preferredTime']] : $input['preferredTime'];

    $emailBody = '
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #C2185B, #7B1FA2); color: white; padding: 25px; text-align: center; }
            .content { padding: 25px; }
            .field { margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .label { font-weight: bold; color: #C2185B; display: block; margin-bottom: 5px; }
            .value { color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .whatsapp-btn {
                display: inline-block;
                background: #25D366;
                color: white !important;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 10px 5px;
            }
            .email-btn {
                display: inline-block;
                background: #C2185B;
                color: white !important;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 10px 5px;
            }
            .phone-btn {
                display: inline-block;
                background: #2196F3;
                color: white !important;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 10px 5px;
            }
            .quick-actions { text-align: center; padding: 25px; background: #f0f0f0; border-radius: 10px; margin: 20px 0; }
            .section-title { color: #7B1FA2; font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; border-bottom: 2px solid #C2185B; padding-bottom: 5px; }
            .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #C2185B; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h2 style="margin: 0;">New Consultation Request</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Reference ID: ' . htmlspecialchars($referenceId) . '</p>
        </div>

        <div class="content">
            <div class="quick-actions">
                <h3 style="margin-top: 0; color: #333;">Quick Response Options</h3>
                <a href="' . $whatsappLink . '" class="whatsapp-btn">Reply via WhatsApp</a>
                ' . ($customerEmail ? '<a href="mailto:' . htmlspecialchars($customerEmail) . '?subject=' . $emailSubjectEncoded . '" class="email-btn">Reply via Email</a>' : '') . '
                <a href="tel:' . htmlspecialchars($input['phone']) . '" class="phone-btn">Call Customer</a>
            </div>

            <div class="highlight">
                <strong>Preferred Appointment:</strong> ' . htmlspecialchars($input['preferredDate']) . ' - ' . $preferredTimeFormatted . '
            </div>

            <div class="section-title">Patient Information</div>
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">' . htmlspecialchars($input['name']) . '</span>
            </div>
            <div class="field">
                <span class="label">Age:</span>
                <span class="value">' . htmlspecialchars($input['age']) . ' years</span>
            </div>
            <div class="field">
                <span class="label">Gender:</span>
                <span class="value">' . ucfirst(htmlspecialchars($input['gender'])) . '</span>
            </div>
            <div class="field">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:' . htmlspecialchars($input['phone']) . '">' . htmlspecialchars($input['phone']) . '</a></span>
            </div>
            ' . ($customerEmail ? '<div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:' . htmlspecialchars($customerEmail) . '">' . htmlspecialchars($customerEmail) . '</a></span>
            </div>' : '') . '

            <div class="section-title">Service Requested</div>
            <div class="field">
                <span class="label">Assessment Type:</span>
                <span class="value">' . htmlspecialchars($input['serviceType']) . '</span>
            </div>
            ' . (isset($input['selectedService']) ? '<div class="field">
                <span class="label">Selected Service:</span>
                <span class="value">' . htmlspecialchars($input['selectedService']) . '</span>
            </div>' : '') . '

            <div class="section-title">Location</div>
            <div class="field">
                <span class="label">State:</span>
                <span class="value">' . htmlspecialchars($input['state']) . '</span>
            </div>
            <div class="field">
                <span class="label">City:</span>
                <span class="value">' . htmlspecialchars($input['city']) . '</span>
            </div>
            <div class="field">
                <span class="label">Full Address:</span>
                <span class="value">' . htmlspecialchars($input['address']) . '</span>
            </div>

            ' . (isset($input['healthConcerns']) && !empty($input['healthConcerns']) ? '
            <div class="section-title">Health Concerns</div>
            <div class="field" style="background: #fff8e1;">
                <span class="value">' . nl2br(htmlspecialchars($input['healthConcerns'])) . '</span>
            </div>' : '') . '

            <div class="field">
                <span class="label">Submitted:</span>
                <span class="value">' . date('Y-m-d H:i:s') . '</span>
            </div>
        </div>

        <div class="footer">
            <p>This consultation request was submitted from the Royal Health Consult website.</p>
            <p><strong>Please respond within 24 hours</strong> to schedule the appointment.</p>
        </div>
    </body>
    </html>
    ';

    $headers = implode("\r\n", [
        'From: Royal Health Consult <noreply@royalhealthconsult.com>',
        'Reply-To: ' . ($customerEmail ? $customerEmail : 'care@royalhealthconsult.com'),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion()
    ]);

    // Send email to all admin addresses
    foreach ($adminEmails as $adminEmail) {
        try {
            $result = mail($adminEmail, $subject, $emailBody, $headers);
            if ($result) {
                $emailsSent++;
                error_log("Consultation notification sent to: " . $adminEmail);
            } else {
                error_log("Failed to send consultation notification to: " . $adminEmail);
            }
        } catch (Exception $e) {
            error_log("Error sending to " . $adminEmail . ": " . $e->getMessage());
        }
    }

    // Log result
    if ($emailsSent > 0) {
        error_log("Consultation notification sent to " . $emailsSent . " admin emails");
        return true;
    } else {
        error_log("Warning: No consultation notification emails were sent successfully");
        return false;
    }
}

function sendConsultationCustomerConfirmation($input, $referenceId) {
    $customerEmail = trim($input['email']);
    if (empty($customerEmail)) return false;

    $subject = 'Consultation Request Received - ' . $referenceId;

    $timeLabels = [
        'morning' => 'Morning (8AM - 12PM)',
        'afternoon' => 'Afternoon (12PM - 5PM)',
        'evening' => 'Evening (5PM - 8PM)'
    ];
    $preferredTimeFormatted = isset($timeLabels[$input['preferredTime']]) ? $timeLabels[$input['preferredTime']] : $input['preferredTime'];
    $serviceName = isset($input['selectedService']) ? htmlspecialchars($input['selectedService']) : htmlspecialchars($input['serviceType']);

    $emailBody = '
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .header { background: linear-gradient(135deg, #C2185B, #7B1FA2); color: white; padding: 25px; text-align: center; }
            .content { padding: 25px; }
            .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #C2185B; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #666; }
            .highlight { background: #d4edda; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h2 style="margin: 0;">Thank You, ' . htmlspecialchars($input['name']) . '!</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your consultation request has been received</p>
        </div>

        <div class="content">
            <div class="highlight">
                <h3 style="margin: 0; color: #155724;">Reference ID: ' . htmlspecialchars($referenceId) . '</h3>
                <p style="margin: 5px 0 0 0; color: #155724;">Please save this for your records</p>
            </div>

            <div class="details">
                <h3 style="margin-top: 0;">Consultation Details</h3>
                <div class="detail-row">
                    <span class="label">Service:</span> ' . $serviceName . '
                </div>
                <div class="detail-row">
                    <span class="label">Preferred Date:</span> ' . htmlspecialchars($input['preferredDate']) . '
                </div>
                <div class="detail-row">
                    <span class="label">Preferred Time:</span> ' . $preferredTimeFormatted . '
                </div>
                <div class="detail-row">
                    <span class="label">Location:</span> ' . htmlspecialchars($input['address']) . ', ' . htmlspecialchars($input['city']) . ', ' . htmlspecialchars($input['state']) . '
                </div>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0;">What happens next?</h4>
                <p>1. Our team will review your request within 24 hours<br>
                2. We will call you at <strong>' . htmlspecialchars($input['phone']) . '</strong> to confirm your appointment<br>
                3. A qualified healthcare professional will visit you at your specified location</p>
            </div>

            <p style="text-align: center;">
                Need immediate help? Call us at <strong>+234 706 332 5184</strong><br>
                or email <strong>care@royalhealthconsult.com</strong>
            </p>
        </div>

        <div class="footer">
            <p><strong>Royal Health Consult</strong> - Professional Healthcare at Home</p>
            <p>4 Barthlomew Ezeogu Street, Oke Alfa, Isolo, Lagos, Nigeria</p>
        </div>
    </body>
    </html>';

    $headers = implode("\r\n", [
        'From: Royal Health Consult <noreply@royalhealthconsult.com>',
        'Reply-To: care@royalhealthconsult.com',
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion()
    ]);

    $result = mail($customerEmail, $subject, $emailBody, $headers);
    if ($result) {
        error_log("Consultation confirmation sent to customer: " . $customerEmail);
    } else {
        error_log("Failed to send consultation confirmation to customer: " . $customerEmail);
    }
    return $result;
}

function generateConsultationUUID() {
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
