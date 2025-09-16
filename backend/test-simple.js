const mysql = require('mysql2');

console.log('Testing MariaDB connection without password...');

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
        console.log('✅ Database royal-health ready!');
      }
      connection.end();
    });
  }
});