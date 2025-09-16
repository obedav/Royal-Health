<?php
/**
 * Admin Account Setup Script
 * Run this once to create/update the admin account with correct password hash
 */

require_once 'config/database.php';
require_once 'config/config.php';

try {
    $db = Database::getInstance();
    
    // Generate proper password hash for 'admin123'
    $password = 'admin123';
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_ROUNDS]);
    
    echo "Generated password hash: " . $passwordHash . "\n";
    
    // Check if admin user exists
    $existingAdmin = $db->fetch("SELECT id FROM users WHERE email = ?", ['admin@ancerlarins.com']);
    
    if ($existingAdmin) {
        // Update existing admin
        $db->update('users', [
            'password_hash' => $passwordHash,
            'status' => 'active',
            'is_email_verified' => 1,
            'is_phone_verified' => 1,
            'updated_at' => date('Y-m-d H:i:s')
        ], 'email = ?', ['admin@ancerlarins.com']);
        
        echo "✅ Admin password updated successfully!\n";
    } else {
        // Create new admin user
        $adminData = [
            'id' => 'admin-' . uniqid(),
            'email' => 'admin@ancerlarins.com',
            'password_hash' => $passwordHash,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'phone' => '+2348000000001',
            'role' => 'admin',
            'status' => 'active',
            'is_email_verified' => 1,
            'is_phone_verified' => 1,
            'preferred_language' => 'en',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $db->insert('users', $adminData);
        echo "✅ Admin user created successfully!\n";
    }
    
    echo "\n";
    echo "=== Admin Login Credentials ===\n";
    echo "Email: admin@ancerlarins.com\n";
    echo "Password: admin123\n";
    echo "Role: admin\n";
    echo "\n";
    echo "🎉 You can now login with these credentials!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>