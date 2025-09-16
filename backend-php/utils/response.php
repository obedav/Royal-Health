<?php
/**
 * HTTP Response Helper
 */

class Response {
    
    public static function success($data = null, $message = 'Success', $code = 200) {
        http_response_code($code);
        
        $response = [
            'success' => true,
            'message' => $message,
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit();
    }
    
    public static function error($message = 'Error', $code = 400, $details = null) {
        http_response_code($code);
        
        $response = [
            'success' => false,
            'message' => $message,
        ];
        
        if ($details !== null) {
            $response['details'] = $details;
        }
        
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit();
    }
    
    public static function json($data, $code = 200) {
        http_response_code($code);
        echo json_encode($data, JSON_PRETTY_PRINT);
        exit();
    }
    
    public static function unauthorized($message = 'Unauthorized') {
        self::error($message, 401);
    }
    
    public static function forbidden($message = 'Forbidden') {
        self::error($message, 403);
    }
    
    public static function notFound($message = 'Not found') {
        self::error($message, 404);
    }
    
    public static function validation($errors) {
        self::error('Validation failed', 422, $errors);
    }
}