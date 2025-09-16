<?php
/**
 * Login Test Script
 * Test login functionality and debug password issues
 */

require_once 'config/database.php';
require_once 'config/config.php';

// Test credentials
$testEmail = 'admin@ancerlarins.com';
$testPassword = 'admin123';

echo "🔍 Testing login for: " . $testEmail . "\n";
echo "Password: " . $testPassword . "\n\n";

try {
    $db = Database::getInstance();
    
    // Find user
    $user = $db->fetch("SELECT * FROM users WHERE email = ?", [$testEmail]);
    
    if (!$user) {
        echo "❌ User not found in database\n";
        echo "Available users:\n";
        $users = $db->fetchAll("SELECT id, email, first_name, role FROM users LIMIT 5");
        foreach ($users as $u) {
            echo "  - " . $u['email'] . " (" . $u['role'] . ")\n";
        }
        exit;
    }
    
    echo "✅ User found:\n";
    echo "  ID: " . $user['id'] . "\n";
    echo "  Email: " . $user['email'] . "\n";
    echo "  Name: " . $user['first_name'] . " " . $user['last_name'] . "\n";
    echo "  Role: " . $user['role'] . "\n";
    echo "  Status: " . $user['status'] . "\n";
    echo "  Password Hash: " . substr($user['password_hash'], 0, 20) . "...\n\n";
    
    // Test password verification
    $isValid = password_verify($testPassword, $user['password_hash']);
    
    if ($isValid) {
        echo "✅ Password verification: SUCCESS\n";
        echo "🎉 Login should work!\n";
    } else {
        echo "❌ Password verification: FAILED\n";
        echo "🔧 Need to update password hash\n\n";
        
        // Generate new hash
        $newHash = password_hash($testPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        echo "New hash: " . $newHash . "\n\n";
        
        // Update database
        $db->update('users', ['password_hash' => $newHash], 'email = ?', [$testEmail]);
        echo "✅ Password updated in database\n";
        echo "🎉 Try logging in again!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>