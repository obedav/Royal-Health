const mysql = require('mysql2');

console.log('Creating royal-health database...');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: ''
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to MariaDB!');
    
    // Create database
    connection.query('CREATE DATABASE IF NOT EXISTS `royal-health`', (createErr) => {
      if (createErr) {
        console.error('❌ Failed to create database:', createErr.message);
      } else {
        console.log('✅ Database royal-health created successfully!');
        
        // Verify database exists
        connection.query('SHOW DATABASES LIKE "royal-health"', (showErr, results) => {
          if (showErr) {
            console.error('❌ Failed to verify database:', showErr.message);
          } else {
            if (results.length > 0) {
              console.log('✅ Database royal-health confirmed to exist!');
            } else {
              console.log('⚠️ Database creation may not have worked');
            }
          }
          connection.end();
        });
      }
    });
  }
});