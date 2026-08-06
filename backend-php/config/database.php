<?php
/**
 * Database Configuration and Connection
 */

class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        self::loadEnv(__DIR__ . '/../.env');

        $host     = $_ENV['DB_HOST']     ?? 'localhost';
        $port     = $_ENV['DB_PORT']     ?? '3306';
        $dbName   = $_ENV['DB_NAME']     ?? '';
        $username = $_ENV['DB_USER']     ?? '';
        $password = $_ENV['DB_PASSWORD'] ?? '';

        if (empty($dbName) || empty($username)) {
            error_log("Database configuration missing. Check .env file.");
            throw new Exception("Database configuration error");
        }

        try {
            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            $this->connection = new PDO($dsn, $username, $password, $options);

        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }

    /**
     * Minimal .env parser — no Composer dependency required.
     * Skips blank lines and comments (#). Does not override existing env vars.
     */
    private static function loadEnv(string $path): void {
        if (!is_readable($path)) return;

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;

            [$key, $value] = explode('=', $line, 2);
            $key   = trim($key);
            $value = trim($value);

            // Strip optional surrounding quotes
            if (strlen($value) >= 2 &&
                (($value[0] === '"' && $value[-1] === '"') ||
                 ($value[0] === "'" && $value[-1] === "'"))) {
                $value = substr($value, 1, -1);
            }

            if (!isset($_ENV[$key]) && !getenv($key)) {
                $_ENV[$key] = $value;
                putenv("{$key}={$value}");
            }
        }
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): PDO {
        return $this->connection;
    }

    public function query(string $sql, array $params = []): PDOStatement {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query failed: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }

    public function fetch(string $sql, array $params = []) {
        return $this->query($sql, $params)->fetch();
    }

    public function fetchAll(string $sql, array $params = []): array {
        return $this->query($sql, $params)->fetchAll();
    }

    public function insert(string $table, array $data) {
        $columns      = implode(',', array_keys($data));
        $placeholders = str_repeat('?,', count($data) - 1) . '?';

        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        $this->query($sql, array_values($data));

        return $this->connection->lastInsertId();
    }

    public function update(string $table, array $data, string $where, array $whereParams = []): int {
        $setClause = [];
        $params    = [];

        foreach ($data as $column => $value) {
            $setClause[] = "{$column} = ?";
            $params[]    = $value;
        }

        $params = array_merge($params, $whereParams);
        $sql    = "UPDATE {$table} SET " . implode(', ', $setClause) . " WHERE {$where}";

        return $this->query($sql, $params)->rowCount();
    }

    public function execute(string $sql, array $params = []): int {
        return $this->query($sql, $params)->rowCount();
    }
}
