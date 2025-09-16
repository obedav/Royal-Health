<?php
/**
 * Application Configuration
 */

// JWT Configuration - matching your Node.js backend
define('JWT_SECRET', 'f3f985e36755974cafc781fb22738535eeb5bb9501860752b8a517da0e2cb73457a1e180e8200347776d5991e840b43e65717ec11bdc8566bb9d0745172eabdf');
define('JWT_REFRESH_SECRET', '1ec4296fadeeba98ade47528fab3ac9db91465e025246bede7afec911b0e920d56eb0c7c1a7b2d9ebac93424e407bb2bb186e2ca2870f30dfd0682190a74074e');
define('JWT_EXPIRES_IN', 3600); // 1 hour

// Application Configuration
define('APP_NAME', 'Royal Health Consult');
define('APP_URL', 'https://ancerlarins.com');
define('API_VERSION', 'v1');

// Security Configuration
define('BCRYPT_ROUNDS', 12);
define('SESSION_TIMEOUT', 3600);
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_DURATION', 7200);

// Rate Limiting
define('RATE_LIMIT_WINDOW', 900); // 15 minutes
define('RATE_LIMIT_MAX_REQUESTS', 100);

// User Roles
define('USER_ROLE_CLIENT', 'client');
define('USER_ROLE_NURSE', 'nurse');
define('USER_ROLE_ADMIN', 'admin');

// User Status
define('USER_STATUS_PENDING_VERIFICATION', 'pending_verification');
define('USER_STATUS_ACTIVE', 'active');
define('USER_STATUS_SUSPENDED', 'suspended');
define('USER_STATUS_INACTIVE', 'inactive');

// Booking Status
define('BOOKING_STATUS_PENDING', 'pending');
define('BOOKING_STATUS_CONFIRMED', 'confirmed');
define('BOOKING_STATUS_IN_PROGRESS', 'in_progress');
define('BOOKING_STATUS_COMPLETED', 'completed');
define('BOOKING_STATUS_CANCELLED', 'cancelled');

// Set timezone
date_default_timezone_set('UTC');