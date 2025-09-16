<?php
/**
 * Authentication Controller
 * Handles user registration, login, password reset, etc.
 */

// Use the global $segments variable from the main router
global $segments;

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

// Get the action from segments (auth/login -> action is 'login')
$action = isset($segments[1]) ? $segments[1] : '';

switch ($method) {
    case 'POST':
        switch ($action) {
            case 'register':
                handleRegister($db);
                break;
            case 'login':
                handleLogin($db);
                break;
            case 'forgot-password':
                handleForgotPassword($db);
                break;
            case 'reset-password':
                handleResetPassword($db);
                break;
            case 'refresh':
                handleRefreshToken($db);
                break;
            default:
                Response::error('Auth endpoint not found: ' . $action, 404);
        }
        break;
    case 'PUT':
        switch ($action) {
            case 'change-password':
                handleChangePassword($db);
                break;
            default:
                Response::error('Auth endpoint not found', 404);
        }
        break;
    default:
        Response::error('Method not allowed', 405);
}

function handleLogin($db) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Basic validation
    if (!$input || !isset($input['email']) || !isset($input['password'])) {
        Response::error('Email and password are required', 400);
        return;
    }
    
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        Response::error('Invalid email format', 400);
        return;
    }
    
    try {
        // Find user
        $user = $db->fetch(
            "SELECT * FROM users WHERE email = ?",
            [$input['email']]
        );
        
        if (!$user) {
            Response::error('Invalid credentials', 401);
            return;
        }
        
        // Verify password
        if (!password_verify($input['password'], $user['password_hash'])) {
            Response::error('Invalid credentials', 401);
            return;
        }
        
        // Update last login
        $db->update('users', [
            'last_login_at' => date('Y-m-d H:i:s')
        ], 'id = ?', [$user['id']]);
        
        // Remove sensitive data
        unset($user['password_hash'], $user['email_verification_token'], 
              $user['phone_verification_code'], $user['password_reset_token']);
        
        // Convert to camelCase for frontend
        $user['firstName'] = $user['first_name'] ?? '';
        $user['lastName'] = $user['last_name'] ?? '';
        $user['isEmailVerified'] = (bool)($user['is_email_verified'] ?? false);
        $user['isPhoneVerified'] = (bool)($user['is_phone_verified'] ?? false);
        $user['createdAt'] = $user['created_at'] ?? null;
        $user['updatedAt'] = $user['updated_at'] ?? null;
        $user['lastLoginAt'] = $user['last_login_at'] ?? null;
        
        // Remove snake_case versions
        unset($user['first_name'], $user['last_name'], $user['is_email_verified'], 
              $user['is_phone_verified'], $user['created_at'], $user['updated_at'], 
              $user['last_login_at']);
        
        // Simple token for now (you can implement JWT later)
        $token = base64_encode($user['id'] . ':' . time());
        
        Response::success([
            'accessToken' => $token,
            'user' => $user,
            'expiresIn' => 3600
        ], 'Login successful');
        
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        Response::error('Login failed: ' . $e->getMessage(), 500);
    }
}

function handleRegister($db) {
    Response::error('Registration endpoint not implemented yet', 501);
}

function handleForgotPassword($db) {
    Response::error('Forgot password endpoint not implemented yet', 501);
}

function handleResetPassword($db) {
    Response::error('Reset password endpoint not implemented yet', 501);
}

function handleRefreshToken($db) {
    Response::error('Refresh token endpoint not implemented yet', 501);
}
?>