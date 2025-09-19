<?php
/**
 * Royal Health PHP Backend API
 * Main entry point for all API requests
 */

// Error reporting - log errors but don't display them
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: https://royalhealthconsult.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load configuration and utilities
require_once 'config/database.php';
require_once 'config/config.php';
require_once 'utils/response.php';
require_once 'utils/jwt.php';
require_once 'utils/validation.php';

// Simple router
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query parameters and get clean path
$path = parse_url($request_uri, PHP_URL_PATH);

// Debug: Log the original path
error_log("Original path: " . $path);

// Handle different routing patterns
if (strpos($path, '/index.php/v1/') === 0) {
    // Remove /index.php/v1/ prefix
    $path = substr($path, strlen('/index.php/v1/'));
} elseif (strpos($path, '/api/v1/') === 0) {
    // Remove /api/v1/ prefix
    $path = substr($path, strlen('/api/v1/'));
} elseif (strpos($path, '/api/') === 0) {
    // Remove /api/ prefix  
    $path = substr($path, strlen('/api/'));
}

// Remove leading/trailing slashes
$path = trim($path, '/');

// Debug: Log the processed path
error_log("Processed path: " . $path);

// Split path into segments
$segments = explode('/', $path);

// Debug: Log the segments
error_log("Segments: " . print_r($segments, true));

try {
    // Route to appropriate controller
    switch ($segments[0]) {
        case 'health':
            require_once 'controllers/health.php';
            break;
            
        case 'auth':
            require_once 'controllers/auth_simple.php';
            break;
            
        case 'users':
            require_once 'controllers/users.php';
            break;
            
        case 'bookings':
            require_once 'controllers/bookings.php';
            break;
            
        case 'company':
            require_once 'controllers/company.php';
            break;
            
        case 'support':
            require_once 'controllers/support.php';
            break;
            
        case 'contact':
            require_once 'controllers/contact.php';
            break;

        case 'errors':
            require_once 'errors.php';
            break;

        default:
            Response::error('Endpoint not found', 404);
            break;
    }
} catch (Exception $e) {
    Response::error('Internal server error: ' . $e->getMessage(), 500);
}