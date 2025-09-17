<?php
/**
 * Email Testing Script
 * Tests email functionality for bookings and contact forms
 */

echo "<h2>Royal Health Email Testing</h2>\n";
echo "<pre>\n";

// Include required files
require_once 'utils/email.php';

// Test 1: Contact Form Email
echo "=== Testing Contact Form Email ===\n";
$contactData = [
    'reference_id' => 'RHC-TEST-' . date('Ymd-His'),
    'first_name' => 'Test',
    'last_name' => 'User',
    'email' => 'testuser@example.com',
    'phone' => '+2348000000001',
    'subject' => 'Test Email Functionality',
    'inquiry_type' => 'general',
    'message' => 'This is a test message to verify email functionality is working correctly.'
];

try {
    $result = EmailService::sendContactNotification($contactData);
    if ($result) {
        echo "✅ Contact email sent successfully!\n";
    } else {
        echo "❌ Contact email failed to send\n";
    }
} catch (Exception $e) {
    echo "❌ Contact email error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Booking Confirmation Email
echo "=== Testing Booking Confirmation Email ===\n";
$bookingData = [
    'id' => 'test-booking-' . uniqid(),
    'confirmation_code' => 'RHB-TEST-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6)),
    'service_id' => 'health-assessment',
    'patient_name' => 'Jane Doe',
    'patient_email' => 'patient@example.com',
    'patient_phone' => '+2348000000002',
    'patient_address' => '123 Test Street, Lagos, Nigeria',
    'scheduled_date' => date('Y-m-d', strtotime('+7 days')),
    'scheduled_time' => '14:30:00',
    'total_amount' => 5000,
    'booking_type' => 'guest',
    'status' => 'confirmed'
];

try {
    $result = EmailService::sendBookingConfirmation($bookingData);
    if ($result) {
        echo "✅ Booking confirmation emails sent successfully!\n";
    } else {
        echo "❌ Booking confirmation emails failed to send\n";
    }
} catch (Exception $e) {
    echo "❌ Booking email error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 3: PHP Mail Configuration
echo "=== Testing PHP Mail Configuration ===\n";
if (function_exists('mail')) {
    echo "✅ PHP mail() function is available\n";

    // Check basic mail settings
    $ini_sendmail = ini_get('sendmail_path');
    $ini_smtp = ini_get('SMTP');
    $ini_smtp_port = ini_get('smtp_port');

    echo "Sendmail path: " . ($ini_sendmail ?: 'Not set') . "\n";
    echo "SMTP server: " . ($ini_smtp ?: 'Not set') . "\n";
    echo "SMTP port: " . ($ini_smtp_port ?: 'Not set') . "\n";

    // Test simple email
    echo "\n--- Testing Simple Email ---\n";
    $test_email = 'rcs@royalhealthconsult.com';
    $subject = 'Royal Health Email Test - ' . date('Y-m-d H:i:s');
    $message = 'This is a test email from Royal Health Consult system.';
    $headers = 'From: Royal Health <noreply@ancerlarins.com>';

    $simple_result = mail($test_email, $subject, $message, $headers);
    if ($simple_result) {
        echo "✅ Simple test email sent successfully!\n";
    } else {
        echo "❌ Simple test email failed\n";
    }

} else {
    echo "❌ PHP mail() function is NOT available\n";
    echo "Contact your hosting provider to enable mail functionality\n";
}

echo "\n";

// Test 4: Email Template Preview
echo "=== Email Template Preview ===\n";
echo "📧 Admin emails will be sent to ALL of these addresses:\n";
echo "   • alexanaba22@gmail.com\n";
echo "   • lucygodwin83@gmail.com\n";
echo "   • gbengobe@gmail.com\n";
echo "   • care@royalhealthconsult.com\n";
echo "\n";
echo "📋 What gets emailed:\n";
echo "   • BOOKINGS: All 4 admins get booking notifications\n";
echo "   • CONTACT FORMS: All 4 admins get contact form submissions\n";
echo "   • PATIENT CONFIRMATIONS: Sent to patient's email address\n";
echo "   • AUTO-REPLIES: Sent from noreply@ancerlarins.com\n";

echo "</pre>\n";
?>

<!DOCTYPE html>
<html>
<head>
    <title>Royal Health Email Test</title>
    <style>
        body { font-family: 'Courier New', monospace; margin: 20px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        h2 { color: #C2185B; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
    </style>
</head>
<body>
    <p><a href="test_endpoints.php">← Back to API Tests</a></p>

    <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>📧 Email Configuration:</h3>
        <ul>
            <li><strong>Admin Emails (ALL receive notifications):</strong>
                <ul>
                    <li>alexanaba22@gmail.com</li>
                    <li>lucygodwin83@gmail.com</li>
                    <li>gbengobe@gmail.com</li>
                    <li>care@royalhealthconsult.com</li>
                </ul>
            </li>
            <li><strong>From Email:</strong> noreply@ancerlarins.com</li>
            <li><strong>Support Email:</strong> care@royalhealthconsult.com</li>
        </ul>

        <p><strong>What gets emailed:</strong></p>
        <ul>
            <li>📋 <strong>Bookings:</strong> Admin gets notification + Patient gets confirmation</li>
            <li>📧 <strong>Contact Forms:</strong> Admin gets message + Customer gets auto-reply</li>
            <li>🎨 <strong>Templates:</strong> Professional HTML emails with branding</li>
        </ul>
    </div>
</body>
</html>