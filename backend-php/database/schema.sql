-- Royal Health Database Schema
-- Run this SQL to create the required tables

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) NOT NULL UNIQUE,
  `role` enum('client','nurse','admin') DEFAULT 'client',
  `status` enum('pending_verification','active','suspended','inactive') DEFAULT 'active',
  `is_email_verified` tinyint(1) DEFAULT 0,
  `is_phone_verified` tinyint(1) DEFAULT 0,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `national_id` varchar(50) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `preferred_language` varchar(10) DEFAULT 'en',
  `supabase_user_id` varchar(255) DEFAULT NULL,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `phone_verification_code` varchar(10) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `login_attempts` int(11) DEFAULT 0,
  `lock_until` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `nurse_id` varchar(36) DEFAULT NULL,
  `service_type` varchar(100) NOT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `duration_hours` int(11) DEFAULT 1,
  `location` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `special_requirements` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `booking_reference` varchar(20) UNIQUE DEFAULT NULL,
  `cancelled_reason` text DEFAULT NULL,
  `cancelled_by` varchar(36) DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_nurse_id` (`nurse_id`),
  KEY `idx_status` (`status`),
  KEY `idx_appointment_date` (`appointment_date`),
  CONSTRAINT `fk_booking_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_nurse` FOREIGN KEY (`nurse_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default admin user (password: admin123)
-- Note: Run setup_admin.php instead to ensure correct password hash
INSERT IGNORE INTO `users` (
  `id`, 
  `email`, 
  `password_hash`, 
  `first_name`, 
  `last_name`, 
  `phone`, 
  `role`, 
  `status`, 
  `is_email_verified`, 
  `is_phone_verified`,
  `created_at`,
  `updated_at`
) VALUES (
  'admin-uuid-001',
  'admin@ancerlarins.com',
  '$2y$12$TGI1Z3JqeZbW2Sf.z6.oauK1Y1N5mXzQ3Xzj7J8YLKvYS2sXXd.e2', -- admin123 
  'Admin',
  'User',
  '+2348000000000',
  'admin',
  'active',
  1,
  1,
  NOW(),
  NOW()
);