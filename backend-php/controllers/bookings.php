<?php
/**
 * Bookings Controller
 * Handles booking creation, retrieval, and management
 */

$method = $_SERVER['REQUEST_METHOD'];
global $segments;
$action = isset($segments[1]) ? $segments[1] : '';
$id = isset($segments[2]) ? $segments[2] : '';

switch ($method) {
    case 'GET':
        if ($action === 'services') {
            getServices();
        } elseif ($action === 'my-bookings') {
            getMyBookings();
        } elseif ($id && $action === 'confirmation') {
            getBookingConfirmation($id);
        } elseif ($id && $action === 'status') {
            getBookingStatus($id);
        } elseif ($action === 'guest' && $id) {
            getGuestBookings($id);
        } else {
            Response::error('Invalid endpoint', 404);
        }
        break;

    case 'POST':
        if ($action === 'guest') {
            createGuestBooking();
        } elseif ($action === 'user') {
            createUserBooking();
        } elseif ($action === 'convert-guest') {
            convertGuestToUser();
        } else {
            createBooking();
        }
        break;

    case 'PUT':
        if ($id) {
            updateBooking($id);
        } else {
            Response::error('Booking ID required', 400);
        }
        break;

    case 'DELETE':
        if ($id) {
            cancelBooking($id);
        } else {
            Response::error('Booking ID required', 400);
        }
        break;

    default:
        Response::error('Method not allowed', 405);
        break;
}

function getServices() {
    try {
        $services = [
            [
                'id' => 'health-assessment',
                'name' => 'Comprehensive Health Assessment',
                'description' => 'Complete health screening and medical evaluation at home',
                'price' => 5000,
                'duration' => 60,
                'category' => 'monitoring',
                'icon' => 'FaStethoscope',
                'popular' => true,
            ],
            [
                'id' => 'vital-signs',
                'name' => 'Vital Signs Check',
                'description' => 'Blood pressure, temperature, heart rate monitoring',
                'price' => 5000,
                'duration' => 30,
                'category' => 'monitoring',
                'icon' => 'FaHeartbeat',
            ],
            [
                'id' => 'medication-management',
                'name' => 'Medication Management',
                'description' => 'Medication administration and management assistance',
                'price' => 5000,
                'duration' => 45,
                'category' => 'nursing',
                'icon' => 'FaPills',
            ],
            [
                'id' => 'wound-care',
                'name' => 'Wound Care',
                'description' => 'Professional wound cleaning, dressing, and care',
                'price' => 5000,
                'duration' => 30,
                'category' => 'nursing',
                'icon' => 'FaBandAid',
            ],
            [
                'id' => 'emergency-assessment',
                'name' => '24/7 Emergency Health Assessment',
                'description' => 'Urgent health assessment for non-life-threatening emergencies',
                'price' => 5000,
                'duration' => 45,
                'category' => 'emergency',
                'icon' => 'FaAmbulance',
            ],
        ];

        Response::success($services, 'Services retrieved successfully');

    } catch (Exception $e) {
        Response::error('Failed to fetch services: ' . $e->getMessage(), 500);
    }
}

function createGuestBooking() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }

        // Validate required fields
        $required = ['sessionId', 'serviceId', 'patientInfo', 'scheduledDate', 'scheduledTime'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                Response::error(ucfirst($field) . ' is required', 400);
                return;
            }
        }

        // Generate booking data
        $bookingId = generateUUID();
        $confirmationCode = 'RHB-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        $bookingData = [
            'id' => $bookingId,
            'confirmation_code' => $confirmationCode,
            'session_id' => $input['sessionId'],
            'booking_type' => 'guest',
            'service_id' => $input['serviceId'],
            'patient_name' => $input['patientInfo']['name'],
            'patient_email' => $input['patientInfo']['email'] ?? null,
            'patient_phone' => $input['patientInfo']['phone'],
            'patient_address' => $input['patientInfo']['address'],
            'scheduled_date' => $input['scheduledDate'],
            'scheduled_time' => $input['scheduledTime'],
            'total_amount' => $input['totalAmount'] ?? 5000,
            'payment_status' => 'pending',
            'status' => 'confirmed',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // Save to database
        $db = Database::getInstance();
        $db->insert('bookings', $bookingData);

        // Send email notifications
        try {
            require_once '../utils/email.php';
            EmailService::sendBookingConfirmation($bookingData);
        } catch (Exception $e) {
            error_log("Email notification failed: " . $e->getMessage());
        }

        $response = [
            'success' => true,
            'bookingId' => $bookingId,
            'confirmationCode' => $confirmationCode,
            'message' => 'Booking created successfully',
            'estimatedArrival' => date('Y-m-d H:i:s', strtotime($input['scheduledDate'] . ' ' . $input['scheduledTime']))
        ];

        Response::success($response, 'Guest booking created successfully');

    } catch (Exception $e) {
        Response::error('Failed to create booking: ' . $e->getMessage(), 500);
    }
}

function createUserBooking() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 400);
            return;
        }

        // Get user from JWT token
        $userId = getCurrentUserId();
        if (!$userId) {
            Response::error('Authentication required', 401);
            return;
        }

        // Validate required fields
        $required = ['serviceId', 'scheduledDate', 'scheduledTime'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                Response::error(ucfirst($field) . ' is required', 400);
                return;
            }
        }

        // Generate booking data
        $bookingId = generateUUID();
        $confirmationCode = 'RHB-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        $bookingData = [
            'id' => $bookingId,
            'confirmation_code' => $confirmationCode,
            'user_id' => $userId,
            'booking_type' => 'authenticated',
            'service_id' => $input['serviceId'],
            'scheduled_date' => $input['scheduledDate'],
            'scheduled_time' => $input['scheduledTime'],
            'total_amount' => $input['totalAmount'] ?? 5000,
            'payment_status' => 'pending',
            'status' => 'confirmed',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // Save to database
        $db = Database::getInstance();
        $db->insert('bookings', $bookingData);

        // Send email notifications
        try {
            require_once '../utils/email.php';
            EmailService::sendBookingConfirmation($bookingData);
        } catch (Exception $e) {
            error_log("Email notification failed: " . $e->getMessage());
        }

        $response = [
            'success' => true,
            'bookingId' => $bookingId,
            'confirmationCode' => $confirmationCode,
            'message' => 'Booking created successfully',
            'estimatedArrival' => date('Y-m-d H:i:s', strtotime($input['scheduledDate'] . ' ' . $input['scheduledTime']))
        ];

        Response::success($response, 'User booking created successfully');

    } catch (Exception $e) {
        Response::error('Failed to create booking: ' . $e->getMessage(), 500);
    }
}

function getBookingConfirmation($bookingId) {
    try {
        $sessionId = $_GET['sessionId'] ?? null;

        $db = Database::getInstance();

        $query = "SELECT * FROM bookings WHERE id = ?";
        $params = [$bookingId];

        if ($sessionId) {
            $query .= " AND session_id = ?";
            $params[] = $sessionId;
        }

        $booking = $db->fetch($query, $params);

        if (!$booking) {
            Response::error('Booking not found', 404);
            return;
        }

        $confirmation = [
            'bookingId' => $booking['id'],
            'confirmationCode' => $booking['confirmation_code'],
            'serviceName' => getServiceName($booking['service_id']),
            'scheduledDate' => $booking['scheduled_date'],
            'scheduledTime' => $booking['scheduled_time'],
            'totalAmount' => (int)$booking['total_amount'],
            'patientName' => $booking['patient_name'] ?? 'N/A',
            'address' => $booking['patient_address'] ?? 'N/A',
            'estimatedArrival' => date('Y-m-d H:i:s', strtotime($booking['scheduled_date'] . ' ' . $booking['scheduled_time'])),
            'paymentStatus' => $booking['payment_status'],
            'status' => $booking['status']
        ];

        Response::success($confirmation, 'Booking confirmation retrieved');

    } catch (Exception $e) {
        Response::error('Failed to fetch booking confirmation: ' . $e->getMessage(), 500);
    }
}

function getBookingStatus($bookingId) {
    try {
        $sessionId = $_GET['sessionId'] ?? null;

        $db = Database::getInstance();

        $query = "SELECT status, payment_status, scheduled_date, scheduled_time FROM bookings WHERE id = ?";
        $params = [$bookingId];

        if ($sessionId) {
            $query .= " AND session_id = ?";
            $params[] = $sessionId;
        }

        $booking = $db->fetch($query, $params);

        if (!$booking) {
            Response::error('Booking not found', 404);
            return;
        }

        Response::success([
            'status' => $booking['status'],
            'paymentStatus' => $booking['payment_status'],
            'scheduledDate' => $booking['scheduled_date'],
            'scheduledTime' => $booking['scheduled_time']
        ], 'Booking status retrieved');

    } catch (Exception $e) {
        Response::error('Failed to check booking status: ' . $e->getMessage(), 500);
    }
}

function cancelBooking($bookingId) {
    try {
        $sessionId = $_GET['sessionId'] ?? null;

        $db = Database::getInstance();

        $query = "UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?";
        $params = [date('Y-m-d H:i:s'), $bookingId];

        if ($sessionId) {
            $query .= " AND session_id = ?";
            $params[] = $sessionId;
        }

        $result = $db->execute($query, $params);

        if ($result) {
            Response::success(['success' => true, 'message' => 'Booking cancelled successfully']);
        } else {
            Response::error('Booking not found or already cancelled', 404);
        }

    } catch (Exception $e) {
        Response::error('Failed to cancel booking: ' . $e->getMessage(), 500);
    }
}

function getGuestBookings($sessionId) {
    try {
        $db = Database::getInstance();
        $bookings = $db->fetchAll("SELECT * FROM bookings WHERE session_id = ? ORDER BY created_at DESC", [$sessionId]);

        Response::success($bookings, 'Guest bookings retrieved');

    } catch (Exception $e) {
        Response::error('Failed to fetch guest bookings: ' . $e->getMessage(), 500);
    }
}

function getMyBookings() {
    try {
        $userId = getCurrentUserId();
        if (!$userId) {
            Response::error('Authentication required', 401);
            return;
        }

        $db = Database::getInstance();
        $bookings = $db->fetchAll("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", [$userId]);

        Response::success($bookings, 'User bookings retrieved');

    } catch (Exception $e) {
        Response::error('Failed to fetch user bookings: ' . $e->getMessage(), 500);
    }
}

function convertGuestToUser() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || !isset($input['sessionId']) || !isset($input['email']) || !isset($input['password'])) {
            Response::error('Session ID, email and password are required', 400);
            return;
        }

        // Create user account first
        $userId = generateUUID();
        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);

        $userData = [
            'id' => $userId,
            'email' => $input['email'],
            'password' => $hashedPassword,
            'role' => 'patient',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $db = Database::getInstance();
        $db->insert('users', $userData);

        // Update guest bookings to be associated with the new user
        $db->execute(
            "UPDATE bookings SET user_id = ?, booking_type = 'authenticated' WHERE session_id = ?",
            [$userId, $input['sessionId']]
        );

        Response::success(['success' => true, 'userId' => $userId], 'Account created and bookings converted');

    } catch (Exception $e) {
        Response::error('Failed to convert guest to user: ' . $e->getMessage(), 500);
    }
}

function getServiceName($serviceId) {
    $services = [
        'health-assessment' => 'Comprehensive Health Assessment',
        'vital-signs' => 'Vital Signs Check',
        'medication-management' => 'Medication Management',
        'wound-care' => 'Wound Care',
        'emergency-assessment' => '24/7 Emergency Health Assessment'
    ];

    return $services[$serviceId] ?? 'Unknown Service';
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