<?php
/**
 * Direct Login Test - Bypasses routing
 */

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://ancerlarins.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    require_once 'config/database.php';
    require_once 'config/config.php';
    require_once 'utils/response.php';
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['email']) || !isset($input['password'])) {
        Response::error('Email and password required', 400);
    }
    
    $db = Database::getInstance();
    
    // Find user
    $user = $db->fetch("SELECT * FROM users WHERE email = ?", [$input['email']]);
    
    if (!$user) {
        Response::error('User not found', 401);
    }
    
    // Verify password
    if (!password_verify($input['password'], $user['password_hash'])) {
        Response::error('Invalid password', 401);
    }
    
    // Success response
    Response::success([
        'accessToken' => base64_encode($user['id'] . ':' . time()),
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'role' => $user['role']
        ],
        'expiresIn' => 3600
    ], 'Login successful');
    
} catch (Exception $e) {
    Response::error('Login failed: ' . $e->getMessage(), 500);
}
?>