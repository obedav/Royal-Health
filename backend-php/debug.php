<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Test basic connection with your exact credentials
    $dsn = "mysql:host=localhost;port=3306;dbname=ancerlar_royal_health;charset=utf8mb4";
    $pdo = new PDO($dsn, 'ancerlar_royal_health_user', 'RoyalConsult1984');
    
    echo "✅ Database connection successful!<br>";
    echo "Database: ancerlar_royal_health<br>";
    echo "Host: localhost<br>";
    
    // Test if tables exist
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables found: " . implode(', ', $tables) . "<br>";
    
} catch (PDOException $e) {
    echo "❌ Database connection failed:<br>";
    echo "Error: " . $e->getMessage() . "<br>";
    echo "Code: " . $e->getCode() . "<br>";
}
?>