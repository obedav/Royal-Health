<?php
/**
 * Test Raw Login Response
 */

// Capture all output
ob_start();

// Simulate the login request
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/index.php/v1/auth/login';

// Mock input data
$mockInput = json_encode([
    'email' => 'admin@ancerlarins.com',
    'password' => 'admin123'
]);

// Override php://input for testing
file_put_contents('php://memory', $mockInput);

try {
    // Include the main index file
    include 'index.php';
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

// Get the output
$output = ob_get_clean();

echo "<h3>Raw Response Debug</h3>";
echo "<pre>";
echo "Length: " . strlen($output) . " bytes\n";
echo "First 100 chars: " . substr($output, 0, 100) . "\n";
echo "Last 100 chars: " . substr($output, -100) . "\n";
echo "\nFull output:\n";
echo htmlentities($output);
echo "</pre>";

// Try to decode as JSON
echo "<h3>JSON Validation</h3>";
$decoded = json_decode($output, true);
if ($decoded === null) {
    echo "❌ Not valid JSON. Error: " . json_last_error_msg();
} else {
    echo "✅ Valid JSON: " . print_r($decoded, true);
}
?>