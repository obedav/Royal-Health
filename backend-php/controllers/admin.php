<?php
$method = $_SERVER['REQUEST_METHOD'];
global $segments;
$action    = isset($segments[1]) ? $segments[1] : '';
$subAction = isset($segments[2]) ? $segments[2] : '';

if ($method === 'GET' && $action === 'dashboard') {
    handleGetDashboard();
} elseif ($method === 'GET' && $action === 'contact-messages') {
    handleGetContactMessages($subAction);
} elseif ($method === 'PUT' && $action === 'contact-messages' && $subAction) {
    handleUpdateContactMessage($subAction);
} elseif ($method === 'GET' && $action === 'bookings') {
    handleGetAdminBookings();
} elseif ($method === 'PUT' && $action === 'bookings' && $subAction) {
    handleUpdateAdminBooking($subAction);
} elseif ($method === 'DELETE' && $action === 'bookings' && $subAction) {
    handleDeleteAdminBooking($subAction);
} else {
    sendJsonResponse(['success' => false, 'message' => 'Admin endpoint not found'], 404);
}

function requireAdminAuth(): void {
    $token = JWT::getTokenFromHeader();
    if (!$token) {
        Response::error('Authentication required', 401);
        exit;
    }
    try {
        $decoded = JWT::decode($token);
        if (($decoded['role'] ?? '') !== 'admin') {
            Response::error('Admin access required', 403);
            exit;
        }
    } catch (Exception $e) {
        Response::error('Invalid or expired token', 401);
        exit;
    }
}

function handleGetDashboard() {
    requireAdminAuth();
    try {
        $db = Database::getInstance();

        $consultationStats = [
            'total'     => (int)($db->fetch("SELECT COUNT(*) AS c FROM consultations")['c'] ?? 0),
            'pending'   => (int)($db->fetch("SELECT COUNT(*) AS c FROM consultations WHERE status = 'pending'")['c'] ?? 0),
            'scheduled' => (int)($db->fetch("SELECT COUNT(*) AS c FROM consultations WHERE status = 'scheduled'")['c'] ?? 0),
            'completed' => (int)($db->fetch("SELECT COUNT(*) AS c FROM consultations WHERE status = 'completed'")['c'] ?? 0),
        ];

        $bookingStats = [
            'total'     => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings")['c'] ?? 0),
            'confirmed' => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings WHERE status = 'confirmed'")['c'] ?? 0),
            'completed' => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings WHERE status = 'completed'")['c'] ?? 0),
            'cancelled' => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings WHERE status = 'cancelled'")['c'] ?? 0),
        ];

        $messageStats = [
            'total'   => (int)($db->fetch("SELECT COUNT(*) AS c FROM contact_messages")['c'] ?? 0),
            'new'     => (int)($db->fetch("SELECT COUNT(*) AS c FROM contact_messages WHERE status = 'new'")['c'] ?? 0),
            'replied' => (int)($db->fetch("SELECT COUNT(*) AS c FROM contact_messages WHERE status = 'replied'")['c'] ?? 0),
        ];

        // Recent 5 consultations
        $recentConsultations = $db->fetchAll(
            "SELECT id, name, phone, service_type, status, submitted_at FROM consultations ORDER BY submitted_at DESC LIMIT 5",
            []
        );

        // Recent 5 bookings
        $recentBookings = $db->fetchAll(
            "SELECT id, confirmation_code, patient_name, service_id, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 5",
            []
        );

        sendJsonResponse([
            'consultations'       => $consultationStats,
            'bookings'            => $bookingStats,
            'messages'            => $messageStats,
            'recentConsultations' => $recentConsultations,
            'recentBookings'      => $recentBookings,
        ], 200);

    } catch (Exception $e) {
        error_log("Admin dashboard error: " . $e->getMessage());
        sendJsonResponse(['success' => false, 'message' => 'Failed to fetch dashboard data'], 500);
    }
}

function handleGetContactMessages($filter = '') {
    requireAdminAuth();
    try {
        $db = Database::getInstance();

        $whereClause = '';
        switch ($filter) {
            case 'new':     $whereClause = "WHERE status = 'new'";     break;
            case 'read':    $whereClause = "WHERE status = 'read'";    break;
            case 'replied': $whereClause = "WHERE status = 'replied'"; break;
            case 'closed':  $whereClause = "WHERE status = 'closed'";  break;
        }

        $sql      = "SELECT * FROM contact_messages {$whereClause} ORDER BY submitted_at DESC LIMIT 200";
        $messages = $db->fetchAll($sql, []);

        $counts = [
            'total'   => (int)($db->fetch("SELECT COUNT(*) AS c FROM contact_messages")['c'] ?? 0),
            'new'     => (int)($db->fetch("SELECT COUNT(*) AS c FROM contact_messages WHERE status = 'new'")['c'] ?? 0),
            'read'    => (int)($db->fetch("SELECT COUNT(*) AS c FROM contact_messages WHERE status = 'read'")['c'] ?? 0),
            'replied' => (int)($db->fetch("SELECT COUNT(*) AS c FROM contact_messages WHERE status = 'replied'")['c'] ?? 0),
        ];

        sendJsonResponse([
            'messages' => $messages,
            'counts'   => $counts,
            'filter'   => $filter ?: 'all',
        ], 200);

    } catch (Exception $e) {
        error_log("Admin contact messages error: " . $e->getMessage());
        sendJsonResponse(['success' => false, 'message' => 'Failed to fetch contact messages'], 500);
    }
}

function handleUpdateContactMessage($messageId) {
    requireAdminAuth();
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || !isset($input['status'])) {
            sendJsonResponse(['success' => false, 'message' => 'Status is required'], 400);
            return;
        }

        $allowedStatuses = ['new', 'read', 'replied', 'closed'];
        if (!in_array($input['status'], $allowedStatuses)) {
            sendJsonResponse(['success' => false, 'message' => 'Invalid status'], 400);
            return;
        }

        $db         = Database::getInstance();
        $updateData = [
            'status'     => $input['status'],
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        if (isset($input['admin_notes'])) {
            $updateData['admin_notes'] = substr(trim($input['admin_notes']), 0, 2000);
        }

        if ($input['status'] === 'replied') {
            $updateData['replied_at'] = date('Y-m-d H:i:s');
        }

        $rowsUpdated = $db->update('contact_messages', $updateData, 'id = ?', [$messageId]);

        if ($rowsUpdated > 0) {
            sendJsonResponse(['success' => true, 'message' => 'Message updated successfully'], 200);
        } else {
            sendJsonResponse(['success' => false, 'message' => 'Message not found'], 404);
        }

    } catch (Exception $e) {
        error_log("Admin update contact message error: " . $e->getMessage());
        sendJsonResponse(['success' => false, 'message' => 'Failed to update message'], 500);
    }
}

function handleGetAdminBookings() {
    requireAdminAuth();
    try {
        $db     = Database::getInstance();
        $params = [];
        $where  = [];

        $status = isset($_GET['status']) ? trim($_GET['status']) : '';
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $limit  = min(200, max(1, (int)($_GET['limit'] ?? 100)));

        if ($status && $status !== 'all') {
            $where[]  = "status = ?";
            $params[] = $status;
        }

        if ($search) {
            $like     = '%' . $search . '%';
            $where[]  = "(patient_name LIKE ? OR patient_email LIKE ? OR patient_phone LIKE ? OR confirmation_code LIKE ?)";
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $sql         = "SELECT * FROM bookings {$whereClause} ORDER BY created_at DESC LIMIT {$limit}";
        $bookings    = $db->fetchAll($sql, $params);

        $counts = [
            'total'       => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings")['c'] ?? 0),
            'confirmed'   => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings WHERE status = 'confirmed'")['c'] ?? 0),
            'in_progress' => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings WHERE status = 'in-progress'")['c'] ?? 0),
            'completed'   => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings WHERE status = 'completed'")['c'] ?? 0),
            'cancelled'   => (int)($db->fetch("SELECT COUNT(*) AS c FROM bookings WHERE status = 'cancelled'")['c'] ?? 0),
        ];

        sendJsonResponse(['bookings' => $bookings, 'counts' => $counts], 200);

    } catch (Exception $e) {
        error_log("Admin get bookings error: " . $e->getMessage());
        sendJsonResponse(['success' => false, 'message' => 'Failed to fetch bookings'], 500);
    }
}

function handleUpdateAdminBooking($bookingId) {
    requireAdminAuth();
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || !isset($input['status'])) {
            sendJsonResponse(['success' => false, 'message' => 'Status is required'], 400);
            return;
        }

        $allowed = ['confirmed', 'in-progress', 'completed', 'cancelled'];
        if (!in_array($input['status'], $allowed)) {
            sendJsonResponse(['success' => false, 'message' => 'Invalid status'], 400);
            return;
        }

        $db         = Database::getInstance();
        $updateData = [
            'status'     => $input['status'],
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        if (isset($input['admin_notes'])) {
            $updateData['admin_notes'] = substr(trim($input['admin_notes']), 0, 2000);
        }

        $rowsUpdated = $db->update('bookings', $updateData, 'id = ?', [$bookingId]);

        if ($rowsUpdated > 0) {
            sendJsonResponse(['success' => true, 'message' => 'Booking updated successfully'], 200);
        } else {
            sendJsonResponse(['success' => false, 'message' => 'Booking not found'], 404);
        }

    } catch (Exception $e) {
        error_log("Admin update booking error: " . $e->getMessage());
        sendJsonResponse(['success' => false, 'message' => 'Failed to update booking'], 500);
    }
}

function handleDeleteAdminBooking($bookingId) {
    requireAdminAuth();
    try {
        $db          = Database::getInstance();
        $rowsDeleted = $db->delete('bookings', 'id = ?', [$bookingId]);

        if ($rowsDeleted > 0) {
            sendJsonResponse(['success' => true, 'message' => 'Booking deleted successfully'], 200);
        } else {
            sendJsonResponse(['success' => false, 'message' => 'Booking not found'], 404);
        }

    } catch (Exception $e) {
        error_log("Admin delete booking error: " . $e->getMessage());
        sendJsonResponse(['success' => false, 'message' => 'Failed to delete booking'], 500);
    }
}

function sendJsonResponse($data, $code = 200) {
    if ($code >= 200 && $code < 300) {
        Response::success($data);
    } else {
        Response::error($data['message'] ?? 'Error', $code);
    }
}
?>
