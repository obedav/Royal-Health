<?php
/**
 * Health Check Controller
 */

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $db = Database::getInstance();

        // Test database connection
        $result = $db->fetch("SELECT NOW() as server_time, VERSION() as db_version");

        Response::success([
            'status' => 'healthy',
            'timestamp' => $result['server_time'],
            'database' => [
                'status' => 'connected',
                'version' => $result['db_version'],
            ],
            'api_version' => API_VERSION,
            'app_name' => APP_NAME
        ], 'Health check passed');
        
    } catch (Exception $e) {
        Response::error('Health check failed: ' . $e->getMessage(), 500);
    }
} else {
    Response::error('Method not allowed', 405);
}