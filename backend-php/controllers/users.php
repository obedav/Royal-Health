<?php
/**
 * Users Controller
 * Handles user profile management and user-related operations
 */

$method = $_SERVER['REQUEST_METHOD'];
global $segments;
$action = isset($segments[1]) ? $segments[1] : '';

switch ($method) {
    case 'GET':
        if ($action === 'profile') {
            getUserProfile();
        } elseif ($action === 'stats') {
            getUserStats();
        } elseif (empty($action)) {
            getAllUsers();
        } else {
            Response::error('Invalid endpoint', 404);
        }
        break;

    case 'PUT':
        if ($action === 'profile') {
            updateUserProfile();
        } else {
            Response::error('Invalid endpoint', 404);
        }
        break;

    case 'POST':
        if ($action === 'register') {
            registerUser();
        } else {
            Response::error('Invalid endpoint', 404);
        }
        break;

    default:
        Response::error('Method not allowed', 405);
        break;
}

function getUserProfile() {
    try {
        $userId = getCurrentUserId();
        if (!$userId) {
            Response::error('Authentication required', 401);
            return;
        }

        $db = Database::getInstance();
        $user = $db->fetch(
            "SELECT id, email, first_name, last_name, phone, role, status, created_at, updated_at FROM users WHERE id = ?",
            [$userId]
        );

        if (!$user) {
            Response::error('User not found', 404);
            return;
        }

        // Get user stats
        $bookingCount = $db->fetch("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?", [$userId])['count'];

        $profile = [
            'id' => $user['id'],
            'email' => $user['email'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'phone' => $user['phone'],
            'role' => $user['role'],
            'status' => $user['status'],
            'stats' => [
                'totalBookings' => (int)$bookingCount,
            ],
            'createdAt' => $user['created_at'],
            'updatedAt' => $user['updated_at']
        ];

        Response::success($profile, 'User profile retrieved successfully');

    } catch (Exception $e) {
        Response::error('Failed to fetch user profile: ' . $e->getMessage(), 500);
    }
}

function updateUserProfile() {
    try {
        $userId = getCurrentUserId();
        if (!$userId) {
            Response::error('Authentication required', 401);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }

        $allowedFields = ['first_name', 'last_name', 'phone'];
        $updateData = [];
        $updateFields = [];

        foreach ($allowedFields as $field) {
            if (isset($input[camelToSnake($field)])) {
                $updateData[] = $input[camelToSnake($field)];
                $updateFields[] = $field . ' = ?';
            }
        }

        if (empty($updateFields)) {
            Response::error('No valid fields to update', 400);
            return;
        }

        // Add updated_at timestamp
        $updateFields[] = 'updated_at = ?';
        $updateData[] = date('Y-m-d H:i:s');
        $updateData[] = $userId; // For WHERE clause

        $db = Database::getInstance();
        $result = $db->execute(
            "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?",
            $updateData
        );

        if ($result) {
            Response::success(['success' => true], 'Profile updated successfully');
        } else {
            Response::error('Failed to update profile', 500);
        }

    } catch (Exception $e) {
        Response::error('Failed to update profile: ' . $e->getMessage(), 500);
    }
}

function getUserStats() {
    try {
        $userId = getCurrentUserId();
        if (!$userId) {
            Response::error('Authentication required', 401);
            return;
        }

        $db = Database::getInstance();

        // Get booking statistics
        $totalBookings = $db->fetch("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?", [$userId])['count'];
        $completedBookings = $db->fetch("SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND status = 'completed'", [$userId])['count'];
        $pendingBookings = $db->fetch("SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND status = 'confirmed'", [$userId])['count'];
        $cancelledBookings = $db->fetch("SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND status = 'cancelled'", [$userId])['count'];

        // Get total spent
        $totalSpent = $db->fetch("SELECT SUM(total_amount) as total FROM bookings WHERE user_id = ? AND payment_status = 'paid'", [$userId])['total'] ?? 0;

        // Get recent bookings
        $recentBookings = $db->fetchAll(
            "SELECT id, service_id, scheduled_date, scheduled_time, status, total_amount FROM bookings WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
            [$userId]
        );

        $stats = [
            'totalBookings' => (int)$totalBookings,
            'completedBookings' => (int)$completedBookings,
            'pendingBookings' => (int)$pendingBookings,
            'cancelledBookings' => (int)$cancelledBookings,
            'totalSpent' => (float)$totalSpent,
            'recentBookings' => $recentBookings
        ];

        Response::success($stats, 'User stats retrieved successfully');

    } catch (Exception $e) {
        Response::error('Failed to fetch user stats: ' . $e->getMessage(), 500);
    }
}

function getAllUsers() {
    try {
        // Check if user is admin
        $currentUserId = getCurrentUserId();
        if (!$currentUserId) {
            Response::error('Authentication required', 401);
            return;
        }

        $db = Database::getInstance();
        $currentUser = $db->fetch("SELECT role FROM users WHERE id = ?", [$currentUserId]);

        if (!$currentUser || $currentUser['role'] !== 'admin') {
            Response::error('Admin access required', 403);
            return;
        }

        // Get query parameters
        $page = (int)($_GET['page'] ?? 1);
        $limit = min((int)($_GET['limit'] ?? 20), 100); // Max 100 per page
        $search = $_GET['search'] ?? '';
        $role = $_GET['role'] ?? '';

        $offset = ($page - 1) * $limit;

        // Build query
        $whereConditions = [];
        $params = [];

        if (!empty($search)) {
            $whereConditions[] = "(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)";
            $searchTerm = "%{$search}%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if (!empty($role)) {
            $whereConditions[] = "role = ?";
            $params[] = $role;
        }

        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM users $whereClause";
        $total = $db->fetch($countQuery, $params)['total'];

        // Get users
        $usersQuery = "SELECT id, email, first_name, last_name, phone, role, status, created_at, updated_at
                       FROM users $whereClause
                       ORDER BY created_at DESC
                       LIMIT ? OFFSET ?";

        $params[] = $limit;
        $params[] = $offset;

        $users = $db->fetchAll($usersQuery, $params);

        $response = [
            'users' => $users,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$total,
                'pages' => ceil($total / $limit)
            ]
        ];

        Response::success($response, 'Users retrieved successfully');

    } catch (Exception $e) {
        Response::error('Failed to fetch users: ' . $e->getMessage(), 500);
    }
}

function registerUser() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }

        // Validate required fields
        $required = ['email', 'password'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                Response::error(ucfirst($field) . ' is required', 400);
                return;
            }
        }

        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
            return;
        }

        // Check if user already exists
        $db = Database::getInstance();
        $existingUser = $db->fetch("SELECT id FROM users WHERE email = ?", [$input['email']]);

        if ($existingUser) {
            Response::error('User with this email already exists', 409);
            return;
        }

        // Generate user data
        $userId = generateUUID();
        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);

        $userData = [
            'id' => $userId,
            'email' => trim($input['email']),
            'password' => $hashedPassword,
            'first_name' => trim($input['firstName'] ?? ''),
            'last_name' => trim($input['lastName'] ?? ''),
            'phone' => trim($input['phone'] ?? ''),
            'role' => $input['role'] ?? 'patient',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // Save to database
        $result = $db->insert('users', $userData);

        if ($result) {
            // Generate JWT token
            $tokenPayload = [
                'userId' => $userId,
                'email' => $userData['email'],
                'role' => $userData['role'],
                'exp' => time() + (24 * 60 * 60) // 24 hours
            ];

            $token = JWT::encode($tokenPayload);

            $response = [
                'success' => true,
                'userId' => $userId,
                'token' => $token,
                'user' => [
                    'id' => $userId,
                    'email' => $userData['email'],
                    'firstName' => $userData['first_name'],
                    'lastName' => $userData['last_name'],
                    'role' => $userData['role']
                ]
            ];

            Response::success($response, 'User registered successfully');
        } else {
            Response::error('Failed to register user', 500);
        }

    } catch (Exception $e) {
        Response::error('Registration failed: ' . $e->getMessage(), 500);
    }
}

function getCurrentUserId() {
    // Extract user ID from JWT token
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        try {
            $decoded = JWT::decode($token);
            return $decoded['userId'] ?? null;
        } catch (Exception $e) {
            return null;
        }
    }

    return null;
}

function camelToSnake($input) {
    return strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $input));
}

function generateUUID() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}
?>