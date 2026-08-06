<?php
/**
 * Authentication Controller
 */

$db     = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

global $segments;
$action = isset($segments[1]) ? $segments[1] : '';

if ($method === 'POST' && $action === 'login') {
    handleSimpleLogin($db);
} else {
    Response::error('Endpoint not found', 404);
}

function handleSimpleLogin($db) {
    try {
        // Rate limit: 10 attempts per IP per 15 minutes
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        if (!checkRateLimit('login_' . $ip, 10, 900)) {
            Response::error('Too many login attempts. Please try again later.', 429);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }

        if (empty($input['email']) || empty($input['password'])) {
            Response::error('Email and password required', 400);
            return;
        }

        $user = $db->fetch("SELECT * FROM users WHERE email = ?", [$input['email']]);

        // Single generic message prevents email enumeration (H-5)
        if (!$user || !password_verify($input['password'], $user['password_hash'])) {
            Response::error('Invalid credentials', 401);
            return;
        }

        // Issue a properly signed JWT (C-2 — replaces the broken base64 token)
        $tokenPayload = [
            'userId' => $user['id'],
            'email'  => $user['email'],
            'role'   => $user['role'],
            'exp'    => time() + 3600,
        ];

        Response::success([
            'accessToken' => JWT::encode($tokenPayload),
            'user' => [
                'id'        => $user['id'],
                'email'     => $user['email'],
                'firstName' => $user['first_name'],
                'lastName'  => $user['last_name'],
                'role'      => $user['role'],
            ],
            'expiresIn' => 3600,
        ], 'Login successful');

    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        Response::error('Login failed', 500);
    }
}
