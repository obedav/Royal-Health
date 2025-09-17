<?php
/**
 * Simple API Endpoint Tester
 * Tests the main endpoints that the frontend needs
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Royal Health API Endpoint Test</h2>\n";
echo "<pre>\n";

// Test 1: Health Check
echo "=== Testing Health Check Endpoint ===\n";
testEndpoint('GET', '/health');

// Test 2: Services Endpoint
echo "\n=== Testing Services Endpoint ===\n";
testEndpoint('GET', '/services');

// Test 3: Contact Submit
echo "\n=== Testing Contact Submit Endpoint ===\n";
$contactData = [
    'firstName' => 'Test',
    'lastName' => 'User',
    'email' => 'test@example.com',
    'phone' => '+2348000000001',
    'subject' => 'Test Subject',
    'inquiryType' => 'general',
    'message' => 'This is a test message for the contact form.'
];
testEndpoint('POST', '/contact/submit', $contactData);

// Test 4: Guest Booking
echo "\n=== Testing Guest Booking Endpoint ===\n";
$bookingData = [
    'sessionId' => 'test-session-' . time(),
    'serviceId' => 'health-assessment',
    'patientInfo' => [
        'name' => 'Test Patient',
        'email' => 'patient@example.com',
        'phone' => '+2348000000002',
        'address' => '123 Test Street, Test City'
    ],
    'scheduledDate' => date('Y-m-d', strtotime('+7 days')),
    'scheduledTime' => '10:00:00',
    'totalAmount' => 5000
];
testEndpoint('POST', '/bookings/guest', $bookingData);

echo "</pre>\n";

function testEndpoint($method, $endpoint, $data = null) {
    $baseUrl = 'https://ancerlarins.com/api/v1';
    $url = $baseUrl . $endpoint;

    echo "Testing: {$method} {$endpoint}\n";
    echo "URL: {$url}\n";

    $ch = curl_init();

    // Basic cURL options
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'Royal Health API Tester/1.0',
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json'
        ]
    ]);

    // Set method and data
    if ($method === 'POST' && $data) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        echo "Payload: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
    }

    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);

    // Display results
    echo "HTTP Code: {$httpCode}\n";

    if ($error) {
        echo "cURL Error: {$error}\n";
    } else {
        echo "Response: ";
        $decodedResponse = json_decode($response, true);
        if ($decodedResponse) {
            echo json_encode($decodedResponse, JSON_PRETTY_PRINT) . "\n";
        } else {
            echo $response . "\n";
        }
    }

    // Status
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "✅ SUCCESS\n";
    } else {
        echo "❌ FAILED\n";
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Royal Health API Test</title>
    <style>
        body { font-family: 'Courier New', monospace; margin: 20px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        h2 { color: #C2185B; }
    </style>
</head>
<body>
</body>
</html>