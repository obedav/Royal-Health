<?php
/**
 * Simple Authentication Controller
 */

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

// Get path segments from global scope
global $segments;
$action = isset($segments[1]) ? $segments[1] : '';

if ($method === 'POST' && $action === 'login') {
    handleSimpleLogin($db);
} else {
    Response::error('Endpoint not found: ' . $method . ' ' . $action, 404);
}

function handleSimpleLogin($db) {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }
        
        if (!isset($input['email']) || !isset($input['password'])) {
            Response::error('Email and password required', 400);
            return;
        }
        
        // Find user
        $user = $db->fetch("SELECT * FROM users WHERE email = ?", [$input['email']]);
        
        if (!$user) {
            Response::error('User not found', 401);
            return;
        }
        
        // Verify password
        if (!password_verify($input['password'], $user['password_hash'])) {
            Response::error('Invalid password', 401);
            return;
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
}
?>