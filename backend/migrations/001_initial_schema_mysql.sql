-- Migration 001: Initial MySQL Schema for Royal Health
-- Created: January 2025
-- Description: Creates users and bookings tables with all constraints and indices for MySQL

-- Set charset and collation for the database
-- Run this first: CREATE DATABASE royal_health_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE royal_health_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL UNIQUE,
    role ENUM('client', 'nurse', 'admin') NOT NULL DEFAULT 'client',
    status ENUM('pending_verification', 'active', 'suspended', 'inactive') NOT NULL DEFAULT 'active',
    
    -- Verification fields
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    phone_verification_code VARCHAR(6),
    
    -- Personal information
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    national_id VARCHAR(50),
    state VARCHAR(100),
    city VARCHAR(100),
    avatar_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    
    -- Security fields
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    login_attempts INT NOT NULL DEFAULT 0,
    lock_until DATETIME,
    last_login_at DATETIME,
    
    -- Integration fields
    supabase_user_id VARCHAR(255),
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    
    -- Service details
    service_type VARCHAR(100) NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    service_description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(10) NOT NULL,
    duration INT NOT NULL DEFAULT 60, -- in minutes
    
    -- Location
    patient_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    
    -- Medical information
    medical_conditions TEXT,
    current_medications TEXT,
    allergies TEXT,
    special_requirements TEXT,
    
    -- Emergency contact
    emergency_contact_name VARCHAR(200) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    
    -- Status
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled') NOT NULL DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'cash_on_delivery') NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    
    -- Relationships
    patient_id CHAR(36) NOT NULL,
    nurse_id CHAR(36),
    
    -- Assessment fields
    assessment_notes TEXT,
    assessment_recommendations TEXT,
    follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
    follow_up_date DATE,
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME,
    cancelled_at DATETIME,
    
    -- Foreign key constraints
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (nurse_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indices for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_bookings_patient_id ON bookings(patient_id);
CREATE INDEX idx_bookings_nurse_id ON bookings(nurse_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_service_type ON bookings(service_type);

-- Create views for common queries
CREATE OR REPLACE VIEW user_summary AS
SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    status,
    is_email_verified,
    is_phone_verified,
    created_at,
    last_login_at
FROM users;

CREATE OR REPLACE VIEW booking_summary AS
SELECT 
    b.id,
    b.service_name,
    b.scheduled_date,
    b.scheduled_time,
    b.status,
    b.payment_status,
    b.total_price,
    b.created_at,
    CONCAT(u.first_name, ' ', u.last_name) as patient_name,
    u.email as patient_email,
    u.phone as patient_phone,
    CONCAT(n.first_name, ' ', n.last_name) as nurse_name
FROM bookings b
JOIN users u ON b.patient_id = u.id
LEFT JOIN users n ON b.nurse_id = n.id;

-- Insert initial admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash for 'admin123' with bcrypt rounds=12
INSERT INTO users (
    id,
    email, 
    password_hash, 
    first_name, 
    last_name, 
    phone, 
    role, 
    status,
    is_email_verified,
    is_phone_verified
) VALUES (
    UUID(),
    'admin@royalhealthconsult.ng',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/9l6EyvNEXx0o9w3Zi', -- admin123
    'Admin',
    'User',
    '+2347000000000',
    'admin',
    'active',
    TRUE,
    TRUE
) ON DUPLICATE KEY UPDATE email = email; -- MySQL equivalent of ON CONFLICT DO NOTHING

-- Create database statistics view
CREATE OR REPLACE VIEW database_stats AS
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as recent_records
FROM users
UNION ALL
SELECT 
    'bookings' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as recent_records
FROM bookings;