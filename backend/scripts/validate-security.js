#!/usr/bin/env node

/**
 * Security Validation Script for Royal Health
 * Run this before production deployment to ensure security configuration is correct
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

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

function checkEnvFile(envPath, envName) {
  log(`\n📋 Checking ${envName} environment...`, 'blue');
  
  if (!fs.existsSync(envPath)) {
    log(`❌ ${envName} file not found at: ${envPath}`, 'red');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  let isValid = true;
  const checks = [];

  // Check JWT secrets
  const jwtSecret = lines.find(line => line.startsWith('JWT_SECRET='))?.split('=')[1];
  const jwtRefreshSecret = lines.find(line => line.startsWith('JWT_REFRESH_SECRET='))?.split('=')[1];

  if (!jwtSecret || jwtSecret.length < 64) {
    checks.push({ name: 'JWT_SECRET', status: 'FAIL', message: 'Must be at least 64 characters long' });
    isValid = false;
  } else {
    checks.push({ name: 'JWT_SECRET', status: 'PASS', message: `${jwtSecret.length} characters` });
  }

  if (!jwtRefreshSecret || jwtRefreshSecret.length < 64) {
    checks.push({ name: 'JWT_REFRESH_SECRET', status: 'FAIL', message: 'Must be at least 64 characters long' });
    isValid = false;
  } else {
    checks.push({ name: 'JWT_REFRESH_SECRET', status: 'PASS', message: `${jwtRefreshSecret.length} characters` });
  }

  // Check if secrets are different
  if (jwtSecret === jwtRefreshSecret) {
    checks.push({ name: 'JWT_SECRETS_DIFFERENT', status: 'FAIL', message: 'JWT secrets must be different' });
    isValid = false;
  } else {
    checks.push({ name: 'JWT_SECRETS_DIFFERENT', status: 'PASS', message: 'Secrets are different' });
  }

  // Check NODE_ENV for production
  if (envName === 'Production') {
    const nodeEnv = lines.find(line => line.startsWith('NODE_ENV='))?.split('=')[1];
    if (nodeEnv !== 'production') {
      checks.push({ name: 'NODE_ENV', status: 'FAIL', message: 'Must be set to "production"' });
      isValid = false;
    } else {
      checks.push({ name: 'NODE_ENV', status: 'PASS', message: 'Set to production' });
    }
  }

  // Check DATABASE_URL
  const dbUrl = lines.find(line => line.startsWith('DATABASE_URL='))?.split('=')[1];
  if (!dbUrl || dbUrl.includes('localhost') || dbUrl.includes('your-db-host')) {
    checks.push({ name: 'DATABASE_URL', status: 'FAIL', message: 'Must be set to production database' });
    isValid = false;
  } else {
    checks.push({ name: 'DATABASE_URL', status: 'PASS', message: 'Configured' });
  }

  // Display results
  checks.forEach(check => {
    const symbol = check.status === 'PASS' ? '✅' : '❌';
    const color = check.status === 'PASS' ? 'green' : 'red';
    log(`  ${symbol} ${check.name}: ${check.message}`, color);
  });

  return isValid;
}

function checkSecurityHeaders() {
  log(`\n🛡️  Checking security headers configuration...`, 'blue');
  
  const mainTsPath = path.join(__dirname, '..', 'src', 'main.ts');
  if (!fs.existsSync(mainTsPath)) {
    log(`❌ main.ts not found at: ${mainTsPath}`, 'red');
    return false;
  }

  const mainTsContent = fs.readFileSync(mainTsPath, 'utf8');
  
  const securityChecks = [
    { name: 'Helmet middleware', check: mainTsContent.includes("helmet(") },
    { name: 'CORS configuration', check: mainTsContent.includes("enableCors(") },
    { name: 'Compression enabled', check: mainTsContent.includes("compression(") },
    { name: 'Rate limiting', check: mainTsContent.includes("Limiter") },
    { name: 'Global validation pipe', check: mainTsContent.includes("ValidationPipe") },
  ];

  let allPassed = true;
  securityChecks.forEach(check => {
    const symbol = check.check ? '✅' : '❌';
    const color = check.check ? 'green' : 'red';
    log(`  ${symbol} ${check.name}`, color);
    if (!check.check) allPassed = false;
  });

  return allPassed;
}

function checkPackageVulnerabilities() {
  log(`\n🔍 Checking for package vulnerabilities...`, 'blue');
  
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec('npm audit --audit-level=moderate', (error, stdout, stderr) => {
      if (error) {
        if (stdout.includes('found 0 vulnerabilities')) {
          log('  ✅ No vulnerabilities found', 'green');
          resolve(true);
        } else {
          log('  ❌ Vulnerabilities found:', 'red');
          log(stdout, 'yellow');
          resolve(false);
        }
      } else {
        log('  ✅ No vulnerabilities found', 'green');
        resolve(true);
      }
    });
  });
}

function generateSecurityReport() {
  log(`\n📊 Generating security report...`, 'blue');
  
  const report = {
    timestamp: new Date().toISOString(),
    checks: {
      environment: 'pending',
      headers: 'pending',
      vulnerabilities: 'pending'
    },
    recommendations: []
  };

  return report;
}

async function main() {
  log('🔒 Royal Health Security Validation', 'blue');
  log('=====================================', 'blue');

  const backendDir = path.join(__dirname, '..');
  process.chdir(backendDir);

  let allPassed = true;

  // Check production environment
  const prodEnvPath = path.join(backendDir, '.env.production');
  const prodEnvValid = checkEnvFile(prodEnvPath, 'Production');
  if (!prodEnvValid) allPassed = false;

  // Check security headers
  const headersValid = checkSecurityHeaders();
  if (!headersValid) allPassed = false;

  // Check package vulnerabilities
  const vulnCheck = await checkPackageVulnerabilities();
  if (!vulnCheck) allPassed = false;

  // Final result
  log('\n🎯 Security Validation Result:', 'blue');
  log('===============================', 'blue');
  
  if (allPassed) {
    log('✅ ALL SECURITY CHECKS PASSED!', 'green');
    log('🚀 Your application is ready for production deployment.', 'green');
  } else {
    log('❌ SECURITY ISSUES FOUND!', 'red');
    log('🛠️  Please fix the issues above before deploying to production.', 'red');
    process.exit(1);
  }

  log('\n📋 Next steps:', 'blue');
  log('1. Update your production environment variables', 'yellow');
  log('2. Set up your production database', 'yellow');
  log('3. Configure your domain and SSL certificates', 'yellow');
  log('4. Set up error monitoring (Sentry)', 'yellow');
  log('5. Run load tests before going live', 'yellow');
}

main().catch(error => {
  log(`❌ Error running security validation: ${error.message}`, 'red');
  process.exit(1);
});