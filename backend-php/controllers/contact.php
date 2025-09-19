<?php
/**
 * Contact Form Controller with Database Storage
 * Handles contact form submissions and saves to database
 */

$method = $_SERVER['REQUEST_METHOD'];
global $segments;
$action = isset($segments[1]) ? $segments[1] : '';

if ($method === 'POST') {
    // Handle both /contact and /contact/submit for compatibility
    if ($action === 'submit' || $action === '') {
        handleContactSubmit();
    } else {
        sendJsonResponse(['success' => false, 'message' => 'Invalid action'], 404);
    }
} else {
    sendJsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

function handleContactSubmit() {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendJsonResponse(['success' => false, 'message' => 'Invalid JSON input'], 400);
            return;
        }
        
        // Validate required fields
        $required = ['firstName', 'lastName', 'email', 'phone', 'subject', 'inquiryType', 'message'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                sendJsonResponse(['success' => false, 'message' => ucfirst($field) . ' is required'], 400);
                return;
            }
        }
        
        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            sendJsonResponse(['success' => false, 'message' => 'Invalid email format'], 400);
            return;
        }
        
        // Validate phone number (basic check)
        if (strlen(trim($input['phone'])) < 10) {
            sendJsonResponse(['success' => false, 'message' => 'Please enter a valid phone number'], 400);
            return;
        }
        
        // Validate message length
        if (strlen(trim($input['message'])) < 10) {
            sendJsonResponse(['success' => false, 'message' => 'Message must be at least 10 characters long'], 400);
            return;
        }
        
        // Generate IDs
        $messageId = generateUUID();
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
            // Simple email notification instead of EmailService for now
            sendAdminNotification($input, $referenceId);
        } catch (Exception $emailError) {
            error_log("Email notification failed: " . $emailError->getMessage());
            // Continue execution - we'll still return success even if email fails
        }
        
        // Success response
        $response = [
            'success' => true,
            'message' => 'Contact form submitted successfully',
            'id' => $referenceId,
            'data' => [
                'referenceId' => $referenceId,
                'submittedAt' => date('Y-m-d H:i:s'),
                'status' => 'received',
                'estimatedResponse' => '24 hours'
            ]
        ];
        
        sendJsonResponse($response, 200);
        
    } catch (Exception $e) {
        error_log("Contact form error: " . $e->getMessage());
        sendJsonResponse(['success' => false, 'message' => 'Failed to submit contact form'], 500);
    }
}

function sendAdminNotification($input, $referenceId) {
    // Send to all configured admin emails
    $adminEmails = [
        'alexanaba22@gmail.com',
        'lucygodwin83@gmail.com',
        'gbengobe@gmail.com',
        'care@royalhealthconsult.com'
    ];

    $emailsSent = 0;
    $subject = 'New Contact Form Submission - ' . $referenceId;
    
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #C2185B; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #C2185B; }
            .value { margin-left: 10px; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
            <p>Reference ID: {$referenceId}</p>
        </div>
        
        <div class='content'>
            <div class='field'>
                <span class='label'>Name:</span>
                <span class='value'>{$input['firstName']} {$input['lastName']}</span>
            </div>
            
            <div class='field'>
                <span class='label'>Email:</span>
                <span class='value'>{$input['email']}</span>
            </div>
            
            <div class='field'>
                <span class='label'>Phone:</span>
                <span class='value'>{$input['phone']}</span>
            </div>
            
            <div class='field'>
                <span class='label'>Subject:</span>
                <span class='value'>{$input['subject']}</span>
            </div>
            
            <div class='field'>
                <span class='label'>Inquiry Type:</span>
                <span class='value'>{$input['inquiryType']}</span>
            </div>
            
            <div class='field'>
                <span class='label'>Message:</span>
                <div class='value' style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 5px;'>
                    " . nl2br(htmlspecialchars($input['message'])) . "
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
    </html>
    ";
    
    $headers = [
        'From: Royal Health Consult <noreply@royalhealthconsult.com>',
        'Reply-To: ' . $input['email'],
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion()
    ];

    // Send email to all admin addresses
    foreach ($adminEmails as $adminEmail) {
        try {
            $result = mail($adminEmail, $subject, $emailBody, implode("\r\n", $headers));
            if ($result) {
                $emailsSent++;
                error_log("Contact notification sent to: " . $adminEmail);
            } else {
                error_log("Failed to send contact notification to: " . $adminEmail);
            }
        } catch (Exception $e) {
            error_log("Error sending to {$adminEmail}: " . $e->getMessage());
        }
    }

    // Return true if at least one email was sent
    if ($emailsSent > 0) {
        error_log("Contact form notification sent to {$emailsSent} admin emails");
        return true;
    } else {
        throw new Exception("Failed to send admin notification emails to any recipient");
    }
}

function generateUUID() {
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

function sendJsonResponse($data, $code = 200) {
    // Clear any output buffers
    if (ob_get_level()) {
        ob_clean();
    }
    
    // Set HTTP response code
    http_response_code($code);
    
    // Set headers
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: https://royalhealthconsult.com');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    // Send JSON response
    echo json_encode($data);
    exit;
}
?>