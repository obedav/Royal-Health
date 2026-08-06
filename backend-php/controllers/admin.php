<?php
// Add this to your existing admin controller or create controllers/admin.php

$method = $_SERVER['REQUEST_METHOD'];
global $segments;
$action = isset($segments[1]) ? $segments[1] : '';
$subAction = isset($segments[2]) ? $segments[2] : '';

if ($method === 'GET' && $action === 'contact-messages') {
    handleGetContactMessages($subAction);
} elseif ($method === 'PUT' && $action === 'contact-messages' && $subAction) {
    handleUpdateContactMessage($subAction);
} else {
    sendJsonResponse(['success' => false, 'message' => 'Admin endpoint not found'], 404);
}

function requireAdminAuth(): void {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if (strpos($authHeader, 'Bearer ') !== 0) {
        Response::error('Authentication required', 401);
        exit;
    }
    try {
        $decoded = JWT::decode(substr($authHeader, 7));
        if (($decoded['role'] ?? '') !== 'admin') {
            Response::error('Admin access required', 403);
            exit;
        }
    } catch (Exception $e) {
        Response::error('Invalid or expired token', 401);
        exit;
    }
}

function handleGetContactMessages($filter = '') {
    requireAdminAuth();
    try {
        $db = Database::getInstance();
        
        // Build query based on filter
        $whereClause = '';
        $params = [];
        
        switch ($filter) {
            case 'new':
                $whereClause = "WHERE status = 'new'";
                break;
            case 'read':
                $whereClause = "WHERE status = 'read'";
                break;
            case 'replied':
                $whereClause = "WHERE status = 'replied'";
                break;
            default:
                // All messages
                break;
        }
        
        $sql = "SELECT * FROM contact_messages {$whereClause} ORDER BY submitted_at DESC LIMIT 100";
        $messages = $db->fetchAll($sql, $params);
        
        // Get counts for dashboard
        $counts = [
            'total' => $db->fetch("SELECT COUNT(*) as count FROM contact_messages")['count'],
            'new' => $db->fetch("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'")['count'],
            'read' => $db->fetch("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'read'")['count'],
            'replied' => $db->fetch("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'replied'")['count']
        ];
        
        sendJsonResponse([
            'messages' => $messages,
            'counts' => $counts,
            'filter' => $filter ?: 'all'
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
        
        $db = Database::getInstance();
        
        $updateData = [
            'status' => $input['status'],
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        if (isset($input['admin_notes'])) {
            $updateData['admin_notes'] = trim($input['admin_notes']);
        }
        
        if ($input['status'] === 'replied') {
            $updateData['replied_at'] = date('Y-m-d H:i:s');
            // You could also set replied_by to the admin user ID
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

function sendJsonResponse($data, $code = 200) {
    if ($code >= 200 && $code < 300) {
        Response::success($data);
    } else {
        Response::error($data['message'] ?? 'Error', $code);
    }
}
?>