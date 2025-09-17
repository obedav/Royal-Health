-- Royal Health Database Schema - Updated for Frontend Compatibility
-- Run this SQL to create/update the required tables

-- Users table (updated)
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('patient','nurse','admin') DEFAULT 'patient',
  `status` enum('pending','active','suspended','inactive') DEFAULT 'active',
  `is_email_verified` tinyint(1) DEFAULT 0,
  `is_phone_verified` tinyint(1) DEFAULT 0,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `national_id` varchar(50) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `preferred_language` varchar(10) DEFAULT 'en',
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

-- Bookings table (updated for frontend compatibility)
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` varchar(36) NOT NULL,
  `confirmation_code` varchar(50) NOT NULL UNIQUE,
  `user_id` varchar(36) DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `booking_type` enum('guest','authenticated') DEFAULT 'guest',
  `service_id` varchar(100) NOT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `patient_email` varchar(255) DEFAULT NULL,
  `patient_phone` varchar(20) DEFAULT NULL,
  `patient_address` text DEFAULT NULL,
  `patient_city` varchar(100) DEFAULT NULL,
  `patient_state` varchar(100) DEFAULT NULL,
  `nurse_id` varchar(36) DEFAULT NULL,
  `scheduled_date` date NOT NULL,
  `scheduled_time` time NOT NULL,
  `duration` int(11) DEFAULT 60,
  `total_amount` decimal(10,2) DEFAULT 5000.00,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'confirmed',
  `notes` text DEFAULT NULL,
  `special_requirements` text DEFAULT NULL,
  `cancelled_reason` text DEFAULT NULL,
  `cancelled_by` varchar(36) DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_nurse_id` (`nurse_id`),
  KEY `idx_status` (`status`),
  KEY `idx_scheduled_date` (`scheduled_date`),
  KEY `idx_confirmation_code` (`confirmation_code`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_booking_nurse` FOREIGN KEY (`nurse_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact messages table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` varchar(36) NOT NULL,
  `reference_id` varchar(50) NOT NULL UNIQUE,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `inquiry_type` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','in_progress','resolved','closed') DEFAULT 'new',
  `assigned_to` varchar(36) DEFAULT NULL,
  `response` text DEFAULT NULL,
  `response_at` datetime DEFAULT NULL,
  `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reference_id` (`reference_id`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services table (for future use)
CREATE TABLE IF NOT EXISTS `services` (
  `id` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 5000.00,
  `duration` int(11) DEFAULT 60,
  `category` varchar(100) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `popular` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default services
INSERT IGNORE INTO `services` (`id`, `name`, `description`, `price`, `duration`, `category`, `icon`, `popular`) VALUES
('health-assessment', 'Comprehensive Health Assessment', 'Complete health screening and medical evaluation at home', 5000.00, 60, 'monitoring', 'FaStethoscope', 1),
('vital-signs', 'Vital Signs Check', 'Blood pressure, temperature, heart rate monitoring', 5000.00, 30, 'monitoring', 'FaHeartbeat', 0),
('medication-management', 'Medication Management', 'Medication administration and management assistance', 5000.00, 45, 'nursing', 'FaPills', 0),
('wound-care', 'Wound Care', 'Professional wound cleaning, dressing, and care', 5000.00, 30, 'nursing', 'FaBandAid', 0),
('emergency-assessment', '24/7 Emergency Health Assessment', 'Urgent health assessment for non-life-threatening emergencies', 5000.00, 45, 'emergency', 'FaAmbulance', 0);

-- Insert a default admin user (password: admin123)
INSERT IGNORE INTO `users` (
  `id`,
  `email`,
  `password`,
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

-- Add any missing columns to existing tables
ALTER TABLE `users`
ADD COLUMN IF NOT EXISTS `password` varchar(255) DEFAULT NULL AFTER `email`;

-- Update existing password_hash column to password if it exists
UPDATE `users` SET `password` = `password_hash` WHERE `password` IS NULL AND `password_hash` IS NOT NULL;

-- Add execute method to Database class if needed
ALTER TABLE `bookings`
ADD COLUMN IF NOT EXISTS `confirmation_code` varchar(50) DEFAULT NULL AFTER `id`,
ADD COLUMN IF NOT EXISTS `session_id` varchar(100) DEFAULT NULL AFTER `user_id`,
ADD COLUMN IF NOT EXISTS `booking_type` enum('guest','authenticated') DEFAULT 'guest' AFTER `session_id`,
ADD COLUMN IF NOT EXISTS `service_id` varchar(100) DEFAULT NULL AFTER `booking_type`;