const mysql = require('mysql2');

async function testConnections() {
  const configs = [
    // Test with password
    { host: 'localhost', port: 3306, user: 'root', password: 'Obe@1983', name: 'with password' },
    // Test without password
    { host: 'localhost', port: 3306, user: 'root', password: '', name: 'without password' },
    // Test with different password formats
    { host: 'localhost', port: 3306, user: 'root', password: 'Obe@1983', name: 'with original password' }
  ];

  for (const config of configs) {
    console.log(`\n🧪 Testing connection ${config.name}...`);
    
    try {
      const connection = mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password
      });

      await new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            console.error(`❌ Failed ${config.name}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Success ${config.name}!`);
            
            // Check databases
            connection.query('SHOW DATABASES', (err, results) => {
              if (!err) {
                console.log('📋 Available databases:');
                results.forEach(row => {
                  console.log(`  - ${row.Database}`);
                });
                
                // Check if royal-health database exists
                const dbExists = results.some(row => row.Database === 'royal-health');
                if (!dbExists) {
                  console.log('🔨 Creating royal-health database...');
                  connection.query('CREATE DATABASE IF NOT EXISTS `royal-health`', (createErr) => {
                    if (createErr) {
                      console.error('❌ Failed to create database:', createErr.message);
                    } else {
                      console.log('✅ Database royal-health created successfully!');
                    }
                    connection.end();
                    resolve();
                  });
                } else {
                  console.log('✅ Database royal-health already exists');
                  connection.end();
                  resolve();
                }
              } else {
                connection.end();
                resolve();
              }
            });
          }
        });
      });
      
      // If we get here, connection was successful - save this config
      console.log(`\n🎯 Working configuration found: ${config.name}`);
      
      // Update the .env file with working config
      const fs = require('fs');
      const envPath = '.env';
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${config.password}`);
      fs.writeFileSync(envPath, envContent);
      console.log('📝 Updated .env file with working password');
      break;
      
    } catch (error) {
      // Continue to next config
      continue;
    }
  }
}

testConnections().catch(console.error);