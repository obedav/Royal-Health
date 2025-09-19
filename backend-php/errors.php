<?php
/**
 * Error Logging Endpoint
 * Handles frontend error reporting
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://royalhealthconsult.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get the JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Create error log entry
    $errorData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'message' => $input['message'] ?? 'Unknown error',
        'stack' => $input['stack'] ?? null,
        'url' => $input['url'] ?? null,
        'userAgent' => $input['userAgent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? null,
        'componentStack' => $input['componentStack'] ?? null,
        'sessionId' => $input['sessionId'] ?? null,
        'userId' => $input['userId'] ?? null,
        'environment' => $input['environment'] ?? 'production'
    ];

    // Log to PHP error log
    $logMessage = sprintf(
        "[FRONTEND ERROR] %s | URL: %s | Message: %s",
        $errorData['timestamp'],
        $errorData['url'],
        $errorData['message']
    );

    error_log($logMessage);

    // Optionally, save to a file (uncomment if needed)
    /*
    $logFile = __DIR__ . '/logs/frontend_errors.log';
    if (!is_dir(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    file_put_contents($logFile, json_encode($errorData) . "\n", FILE_APPEND | LOCK_EX);
    */

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Error logged successfully',
        'timestamp' => $errorData['timestamp']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to log error: ' . $e->getMessage()
    ]);
}
?>