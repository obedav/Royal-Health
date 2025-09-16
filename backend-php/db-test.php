<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>Database Connection Test</h3>";

try {
    $dsn = "mysql:host=localhost;dbname=ancerlar_royal_health;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];
    
    $pdo = new PDO($dsn, 'ancerlar_royal_health_user', 'RoyalConsult1984', $options);
    echo "✅ Database connection successful!<br>";
    
    // Test query
    $stmt = $pdo->query("SELECT NOW() as current_time");
    $result = $stmt->fetch();
    echo "✅ Query successful: " . $result['current_time'] . "<br>";
    
    // Test user count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $count = $stmt->fetch();
    echo "✅ User count: " . $count['count'] . "<br>";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
    echo "Error code: " . $e->getCode() . "<br>";
}
?>