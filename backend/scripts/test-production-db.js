#!/usr/bin/env node

/**
 * Test Production Database Connection
 * Use this script to test your production database connection before deployment
 */

require('dotenv').config({ path: '.env.production' });
const { Client } = require('pg');

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

async function testProductionConnection() {
  log('🔍 Testing Production Database Connection', 'blue');
  log('=========================================', 'blue');
  
  const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL_POOLER;
  
  if (!dbUrl) {
    log('❌ No DATABASE_URL found in .env.production', 'red');
    log('Please update your .env.production file with the correct database URL', 'yellow');
    return false;
  }
  
  // Mask sensitive parts of the URL for logging
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
  log(`🔗 Connecting to: ${maskedUrl}`, 'blue');
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    // Test connection
    await client.connect();
    log('✅ Database connection successful!', 'green');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    log(`✅ Current time: ${result.rows[0].current_time}`, 'green');
    log(`✅ Database version: ${result.rows[0].db_version.split(' ')[0]}`, 'green');
    
    // Check if our tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    log(`📊 Tables found: ${tables.rows.length}`, 'blue');
    tables.rows.forEach(table => {
      log(`  - ${table.table_name}`, 'blue');
    });
    
    // Check if we can create/drop a test table
    try {
      await client.query('CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, test_time TIMESTAMPTZ DEFAULT NOW())');
      await client.query('INSERT INTO connection_test DEFAULT VALUES');
      const testResult = await client.query('SELECT COUNT(*) FROM connection_test');
      await client.query('DROP TABLE connection_test');
      log(`✅ Read/Write operations work! Test records: ${testResult.rows[0].count}`, 'green');
    } catch (error) {
      log(`⚠️  Read/Write test failed: ${error.message}`, 'yellow');
    }
    
    log('\n🎉 Production database is ready!', 'green');
    log('You can now run: npm run db:migrate', 'green');
    
    return true;
    
  } catch (error) {
    log(`❌ Connection failed: ${error.message}`, 'red');
    
    if (error.message.includes('password authentication failed')) {
      log('\n🔧 Troubleshooting:', 'yellow');
      log('1. Check your database password in .env.production', 'yellow');
      log('2. Verify the database URL format', 'yellow');
      log('3. Ensure your Supabase project is active', 'yellow');
    } else if (error.message.includes('does not exist')) {
      log('\n🔧 Troubleshooting:', 'yellow');
      log('1. Check the database name in your connection string', 'yellow');
      log('2. Verify your Supabase project configuration', 'yellow');
    } else {
      log('\n🔧 Troubleshooting:', 'yellow');
      log('1. Check your internet connection', 'yellow');
      log('2. Verify the host and port in your connection string', 'yellow');
      log('3. Check Supabase service status', 'yellow');
    }
    
    return false;
    
  } finally {
    try {
      await client.end();
      log('🔌 Connection closed', 'blue');
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

if (require.main === module) {
  testProductionConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}