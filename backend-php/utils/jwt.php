<?php
/**
 * JWT Token Helper
 */

class JWT {
    
    public static function encode($payload, $secret = JWT_SECRET, $expiresIn = JWT_EXPIRES_IN) {
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);
        
        $payload['iat'] = time();
        $payload['exp'] = time() + $expiresIn;
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $secret, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
    }
    
    public static function decode($token, $secret = JWT_SECRET) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        [$header, $payload, $signature] = $parts;
        
        // Verify signature
        $expectedSignature = hash_hmac('sha256', $header . '.' . $payload, $secret, true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));
        
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid token signature');
        }
        
        // Decode payload
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $payload));
        $payload = json_decode($payload, true);
        
        if (!$payload) {
            throw new Exception('Invalid token payload');
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired');
        }
        
        return $payload;
    }
    
    public static function getTokenFromHeader() {
        $headers = getallheaders();
        $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (!$authorization) {
            return null;
        }
        
        if (strpos($authorization, 'Bearer ') === 0) {
            return substr($authorization, 7);
        }
        
        return null;
    }
    
    public static function getCurrentUser() {
        try {
            $token = self::getTokenFromHeader();
            if (!$token) {
                return null;
            }
            
            $payload = self::decode($token);
            return $payload;
        } catch (Exception $e) {
            return null;
        }
    }
    
    public static function requireAuth() {
        $user = self::getCurrentUser();
        if (!$user) {
            Response::unauthorized('Authentication required');
        }
        return $user;
    }
}