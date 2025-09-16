#!/usr/bin/env node

/**
 * MySQL Database Migration Script for Royal Health
 * Handles database schema creation and updates for MySQL
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'royal_health_db',
      charset: 'utf8mb4',
      ssl: process.env.DB_SSL === 'true' ? {} : false,
      multipleStatements: true // Allow multiple SQL statements
    });

    log('✅ Connected to MySQL database', 'green');
    return connection;
  } catch (error) {
    log(`❌ Failed to connect to MySQL database: ${error.message}`, 'red');
    throw error;
  }
}

async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4',
      ssl: process.env.DB_SSL === 'true' ? {} : false
    });

    const dbName = process.env.DB_DATABASE || 'royal_health_db';
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    
    log(`✅ Database '${dbName}' created or already exists`, 'green');
    await connection.end();
  } catch (error) {
    log(`❌ Failed to create database: ${error.message}`, 'red');
    throw error;
  }
}

async function runMigration(connection, migrationFile) {
  const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  log(`🔄 Running migration: ${migrationFile}`, 'blue');
  
  try {
    // Create migrations tracking table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if migration has already been run
    const [existingMigration] = await connection.execute(
      'SELECT id FROM migrations WHERE filename = ?',
      [migrationFile]
    );

    if (existingMigration.length > 0) {
      log(`⏭️  Migration ${migrationFile} already executed, skipping`, 'yellow');
      return;
    }

    // Execute migration
    await connection.beginTransaction();
    
    // Split SQL into individual statements (MySQL doesn't handle multiple statements well in execute)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    // Record migration
    await connection.execute(
      'INSERT INTO migrations (filename) VALUES (?)',
      [migrationFile]
    );
    
    await connection.commit();
    log(`✅ Migration ${migrationFile} completed successfully`, 'green');
    
  } catch (error) {
    await connection.rollback();
    log(`❌ Migration ${migrationFile} failed: ${error.message}`, 'red');
    throw error;
  }
}

async function checkDatabaseHealth(connection) {
  log('\n🏥 Checking MySQL database health...', 'blue');
  
  try {
    // Check basic connectivity
    const [timeResult] = await connection.execute('SELECT NOW() as current_time, VERSION() as db_version');
    log('✅ Database connectivity: OK', 'green');
    log(`✅ Current time: ${timeResult[0].current_time}`, 'green');
    log(`✅ MySQL version: ${timeResult[0].db_version}`, 'green');

    // Check tables exist
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME as tablename
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      ORDER BY TABLE_NAME
    `, [process.env.DB_DATABASE || 'royal_health_db']);
    
    log(`✅ Tables found: ${tables.map(r => r.tablename).join(', ')}`, 'green');

    // Check record counts
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [bookingCount] = await connection.execute('SELECT COUNT(*) as count FROM bookings');
    
    log(`📊 Users: ${userCount[0].count}`, 'blue');
    log(`📊 Bookings: ${bookingCount[0].count}`, 'blue');

    // Check indices
    const [indices] = await connection.execute(`
      SELECT DISTINCT INDEX_NAME as indexname, TABLE_NAME as tablename
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME, INDEX_NAME
    `, [process.env.DB_DATABASE || 'royal_health_db']);
    
    log(`✅ Indices: ${indices.length} found`, 'green');

    return true;
  } catch (error) {
    log(`❌ Database health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function createBackup(connection) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup_mysql_${timestamp}.json`;
  
  log(`\n💾 Creating backup: ${backupFile}`, 'blue');
  
  try {
    const [users] = await connection.execute('SELECT * FROM users');
    const [bookings] = await connection.execute('SELECT * FROM bookings');
    
    const backup = {
      timestamp: new Date().toISOString(),
      database_type: 'mysql',
      users: users,
      bookings: bookings
    };
    
    const backupPath = path.join(__dirname, '..', 'backups', backupFile);
    
    // Create backups directory if it doesn't exist
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    log(`✅ Backup created: ${backupPath}`, 'green');
    
  } catch (error) {
    log(`⚠️  Backup creation failed: ${error.message}`, 'yellow');
  }
}

async function main() {
  const command = process.argv[2] || 'migrate';
  
  log('🚀 Royal Health MySQL Database Manager', 'blue');
  log('======================================', 'blue');
  
  let connection;
  
  try {
    // Create database if it doesn't exist
    if (command === 'migrate') {
      await createDatabaseIfNotExists();
    }
    
    connection = await connectToDatabase();
    
    switch (command) {
      case 'migrate':
        log('\n🔄 Running MySQL migrations...', 'blue');
        const migrationFiles = fs.readdirSync(path.join(__dirname, '..', 'migrations'))
          .filter(file => file.endsWith('.sql') && file.includes('mysql'))
          .sort();
        
        if (migrationFiles.length === 0) {
          log('⚠️  No MySQL migration files found', 'yellow');
          log('Looking for files with "mysql" in the name...', 'yellow');
          break;
        }
        
        for (const file of migrationFiles) {
          await runMigration(connection, file);
        }
        
        log('\n✅ All migrations completed!', 'green');
        await checkDatabaseHealth(connection);
        break;
        
      case 'health':
        await checkDatabaseHealth(connection);
        break;
        
      case 'backup':
        await createBackup(connection);
        break;
        
      default:
        log(`❌ Unknown command: ${command}`, 'red');
        log('Available commands: migrate, health, backup', 'blue');
        process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Database operation failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      log('🔌 MySQL connection closed', 'blue');
    }
  }
}

// Handle script execution
if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { connectToDatabase, runMigration, checkDatabaseHealth };