<?php
/**
 * Test Routing Logic
 */

// Test different path formats
$testPaths = [
    '/index.php/v1/auth/login',
    '/api/v1/auth/login', 
    '/api/auth/login',
    '/auth/login'
];

echo "<h2>🔧 Routing Test</h2>";

foreach ($testPaths as $testPath) {
    echo "<h3>Testing: " . $testPath . "</h3>";
    
    // Simulate the routing logic
    $path = $testPath;
    
    echo "Original: " . $path . "<br>";
    
    // Handle different routing patterns
    if (strpos($path, '/index.php/v1/') === 0) {
        $path = substr($path, strlen('/index.php/v1/'));
        echo "Matched /index.php/v1/ pattern<br>";
    } elseif (strpos($path, '/api/v1/') === 0) {
        $path = substr($path, strlen('/api/v1/'));
        echo "Matched /api/v1/ pattern<br>";
    } elseif (strpos($path, '/api/') === 0) {
        $path = substr($path, strlen('/api/'));
        echo "Matched /api/ pattern<br>";
    }
    
    $path = trim($path, '/');
    $segments = explode('/', $path);
    
    echo "Processed: " . $path . "<br>";
    echo "Segments: " . print_r($segments, true) . "<br>";
    echo "Controller: " . ($segments[0] ?? 'none') . "<br>";
    echo "Action: " . ($segments[1] ?? 'none') . "<br>";
    echo "<hr>";
}

// Test the actual request
echo "<h3>Current Request</h3>";
echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'not set') . "<br>";
echo "PATH_INFO: " . ($_SERVER['PATH_INFO'] ?? 'not set') . "<br>";
?>