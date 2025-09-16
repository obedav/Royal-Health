<?php
/**
 * Test Authentication Endpoints
 */

require_once 'config/database.php';
require_once 'config/config.php';
require_once 'utils/response.php';

echo "<h2>🔧 Testing Authentication System</h2>";

try {
    $db = Database::getInstance();
    
    // 1. Test database connection
    echo "<h3>1. Database Connection</h3>";
    $result = $db->fetch("SELECT COUNT(*) as count FROM users");
    echo "✅ Connected! User count: " . $result['count'] . "<br><br>";
    
    // 2. Create test admin if not exists
    echo "<h3>2. Setting up Admin Account</h3>";
    $admin = $db->fetch("SELECT id FROM users WHERE email = ?", ['admin@ancerlarins.com']);
    
    if (!$admin) {
        $passwordHash = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]);
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
        echo "✅ Admin account created<br>";
    } else {
        // Update admin password to ensure it works
        $passwordHash = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]);
        $db->update('users', ['password_hash' => $passwordHash], 'email = ?', ['admin@ancerlarins.com']);
        echo "✅ Admin password updated<br>";
    }
    
    // 3. Test password verification
    echo "<h3>3. Testing Password Verification</h3>";
    $user = $db->fetch("SELECT * FROM users WHERE email = ?", ['admin@ancerlarins.com']);
    $isValid = password_verify('admin123', $user['password_hash']);
    
    if ($isValid) {
        echo "✅ Password verification works!<br>";
    } else {
        echo "❌ Password verification failed<br>";
    }
    
    // 4. Test login simulation
    echo "<h3>4. Login Simulation</h3>";
    $loginData = [
        'email' => 'admin@ancerlarins.com',
        'password' => 'admin123'
    ];
    
    echo "Testing login with: " . json_encode($loginData) . "<br>";
    
    $user = $db->fetch("SELECT * FROM users WHERE email = ?", [$loginData['email']]);
    if ($user && password_verify($loginData['password'], $user['password_hash'])) {
        echo "✅ Login simulation successful!<br>";
        
        // Test update
        $updateResult = $db->update('users', [
            'last_login_at' => date('Y-m-d H:i:s')
        ], 'id = ?', [$user['id']]);
        
        echo "✅ Update test: " . $updateResult . " rows affected<br>";
    } else {
        echo "❌ Login simulation failed<br>";
    }
    
    echo "<br><h3>🎉 All Tests Complete!</h3>";
    echo "Login credentials:<br>";
    echo "<strong>Email:</strong> admin@ancerlarins.com<br>";
    echo "<strong>Password:</strong> admin123<br>";
    
} catch (Exception $e) {
    echo "<h3>❌ Error</h3>";
    echo "Error: " . $e->getMessage() . "<br>";
    echo "Trace: <pre>" . $e->getTraceAsString() . "</pre>";
}
?>