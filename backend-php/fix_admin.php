<?php
/**
 * Quick Admin Account Fix
 * Creates/updates admin account with proper password
 */

require_once 'config/database.php';
require_once 'config/config.php';

try {
    $db = Database::getInstance();
    
    // Generate proper password hash
    $password = 'admin123';
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    
    // Check if admin exists
    $admin = $db->fetch("SELECT id FROM users WHERE email = ?", ['admin@ancerlarins.com']);
    
    if ($admin) {
        // Update existing admin
        $db->update('users', [
            'password_hash' => $passwordHash,
            'status' => 'active',
            'is_email_verified' => 1,
            'is_phone_verified' => 1
        ], 'email = ?', ['admin@ancerlarins.com']);
        echo "✅ Admin password updated!";
    } else {
        // Create new admin
        $adminId = 'admin-' . uniqid();
        $db->insert('users', [
            'id' => $adminId,
            'email' => 'admin@ancerlarins.com',
            'password_hash' => $passwordHash,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'phone' => '+2348000000001',
            'role' => 'admin',
            'status' => 'active',
            'is_email_verified' => 1,
            'is_phone_verified' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
        echo "✅ Admin account created!";
    }
    
    echo "<br><br><strong>Login Credentials:</strong><br>";
    echo "Email: admin@ancerlarins.com<br>";
    echo "Password: admin123<br>";
    echo "<br>🎉 Ready to login!";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>