#!/usr/bin/env node

/**
 * Database Migration Script for Royal Health
 * Handles database schema creation and updates
 */

const { Client } = require('pg');
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
  const connectionString = process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
  
  const client = new Client({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    log('✅ Connected to database', 'green');
    return client;
  } catch (error) {
    log(`❌ Failed to connect to database: ${error.message}`, 'red');
    throw error;
  }
}

async function runMigration(client, migrationFile) {
  const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  log(`🔄 Running migration: ${migrationFile}`, 'blue');
  
  try {
    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Check if migration has already been run
    const existingMigration = await client.query(
      'SELECT id FROM migrations WHERE filename = $1',
      [migrationFile]
    );

    if (existingMigration.rows.length > 0) {
      log(`⏭️  Migration ${migrationFile} already executed, skipping`, 'yellow');
      return;
    }

    // Execute migration
    await client.query('BEGIN');
    await client.query(migrationSQL);
    
    // Record migration
    await client.query(
      'INSERT INTO migrations (filename) VALUES ($1)',
      [migrationFile]
    );
    
    await client.query('COMMIT');
    log(`✅ Migration ${migrationFile} completed successfully`, 'green');
    
  } catch (error) {
    await client.query('ROLLBACK');
    log(`❌ Migration ${migrationFile} failed: ${error.message}`, 'red');
    throw error;
  }
}

async function checkDatabaseHealth(client) {
  log('\n🏥 Checking database health...', 'blue');
  
  try {
    // Check basic connectivity
    await client.query('SELECT NOW() as current_time');
    log('✅ Database connectivity: OK', 'green');

    // Check tables exist
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    log(`✅ Tables found: ${tables.rows.map(r => r.tablename).join(', ')}`, 'green');

    // Check record counts
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const bookingCount = await client.query('SELECT COUNT(*) FROM bookings');
    
    log(`📊 Users: ${userCount.rows[0].count}`, 'blue');
    log(`📊 Bookings: ${bookingCount.rows[0].count}`, 'blue');

    // Check indices
    const indices = await client.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);
    
    log(`✅ Indices: ${indices.rows.length} found`, 'green');

    return true;
  } catch (error) {
    log(`❌ Database health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function createBackup(client) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup_${timestamp}.sql`;
  
  log(`\n💾 Creating backup: ${backupFile}`, 'blue');
  
  // This would require pg_dump to be installed
  // For now, just create a simple data export
  try {
    const users = await client.query('SELECT * FROM users');
    const bookings = await client.query('SELECT * FROM bookings');
    
    const backup = {
      timestamp: new Date().toISOString(),
      users: users.rows,
      bookings: bookings.rows
    };
    
    const backupPath = path.join(__dirname, '..', 'backups', backupFile + '.json');
    
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
  
  log('🚀 Royal Health Database Manager', 'blue');
  log('=================================', 'blue');
  
  let client;
  
  try {
    client = await connectToDatabase();
    
    switch (command) {
      case 'migrate':
        log('\n🔄 Running migrations...', 'blue');
        const migrationFiles = fs.readdirSync(path.join(__dirname, '..', 'migrations'))
          .filter(file => file.endsWith('.sql'))
          .sort();
        
        if (migrationFiles.length === 0) {
          log('⚠️  No migration files found', 'yellow');
          break;
        }
        
        for (const file of migrationFiles) {
          await runMigration(client, file);
        }
        
        log('\n✅ All migrations completed!', 'green');
        await checkDatabaseHealth(client);
        break;
        
      case 'health':
        await checkDatabaseHealth(client);
        break;
        
      case 'backup':
        await createBackup(client);
        break;
        
      case 'reset':
        log('\n⚠️  WARNING: This will delete all data!', 'yellow');
        // In a real scenario, you'd want confirmation here
        log('Reset functionality not implemented for safety', 'red');
        break;
        
      default:
        log(`❌ Unknown command: ${command}`, 'red');
        log('Available commands: migrate, health, backup, reset', 'blue');
        process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Database operation failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      log('🔌 Database connection closed', 'blue');
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