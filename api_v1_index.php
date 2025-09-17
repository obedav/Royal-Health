<?php
/**
 * API v1 Entry Point
 * Routes all /api/v1/* requests to the backend-php system
 */

// Set proper headers for API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://ancerlarins.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request URI and extract the path after /api/v1/
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove /api/v1/ prefix to get the actual endpoint
if (strpos($path, '/api/v1/') === 0) {
    $path = substr($path, strlen('/api/v1/'));
}

// Remove leading slash if present
$path = ltrim($path, '/');

// Debug logging
error_log("API v1 Request: " . $requestUri);
error_log("Processed path: " . $path);

// Set the processed path for the backend
$_SERVER['REQUEST_URI'] = '/' . $path;

// Set up the environment for the backend
$_SERVER['SCRIPT_NAME'] = '/api/v1/index.php';
$_SERVER['PHP_SELF'] = '/api/v1/index.php';

// Change to backend directory (relative to api/v1/)
$backendPath = __DIR__ . '/../../backend-php';

// Check if backend exists
if (!is_dir($backendPath)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Backend not found',
        'debug' => [
            'backend_path' => $backendPath,
            'current_dir' => __DIR__
        ]
    ]);
    exit();
}

// Include required backend files
require_once $backendPath . '/config/database.php';
require_once $backendPath . '/config/config.php';
require_once $backendPath . '/utils/response.php';
require_once $backendPath . '/utils/jwt.php';
require_once $backendPath . '/utils/validation.php';

// Simple router (copied from backend-php/index.php)
$segments = explode('/', $path);

// Debug: Log the segments
error_log("API Segments: " . print_r($segments, true));

try {
    // Route to appropriate controller
    switch ($segments[0]) {
        case 'health':
            require_once $backendPath . '/controllers/health.php';
            break;

        case 'auth':
            require_once $backendPath . '/controllers/auth_simple.php';
            break;

        case 'users':
            require_once $backendPath . '/controllers/users.php';
            break;

        case 'bookings':
            require_once $backendPath . '/controllers/bookings.php';
            break;

        case 'contact':
            require_once $backendPath . '/controllers/contact.php';
            break;

        case 'company':
            require_once $backendPath . '/controllers/company.php';
            break;

        case 'support':
            require_once $backendPath . '/controllers/support.php';
            break;

        case 'services':
            // Handle services request (redirect to bookings controller)
            $_SERVER['REQUEST_URI'] = '/services';
            $segments = ['bookings', 'services'];
            require_once $backendPath . '/controllers/bookings.php';
            break;

        default:
            Response::error('Endpoint not found', 404);
            break;
    }
} catch (Exception $e) {
    Response::error('Internal server error: ' . $e->getMessage(), 500);
}
?>