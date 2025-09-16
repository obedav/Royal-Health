-- Migration 001: Initial Schema for Royal Health
-- Created: January 2025
-- Description: Creates users and bookings tables with all constraints and indices

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'nurse', 'admin')),
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('pending_verification', 'active', 'suspended', 'inactive')),
    
    -- Verification fields
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    is_phone_verified BOOLEAN NOT NULL DEFAULT false,
    email_verification_token VARCHAR(255),
    phone_verification_code VARCHAR(6),
    
    -- Personal information
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    national_id VARCHAR(50),
    state VARCHAR(100),
    city VARCHAR(100),
    avatar_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    
    -- Security fields
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMPTZ,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    lock_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    
    -- Integration fields
    supabase_user_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
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
    duration INTEGER NOT NULL DEFAULT 60, -- in minutes
    
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
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cash_on_delivery')),
    payment_method VARCHAR(50) NOT NULL,
    
    -- Relationships
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    nurse_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Assessment fields
    assessment_notes TEXT,
    assessment_recommendations TEXT,
    follow_up_required BOOLEAN NOT NULL DEFAULT false,
    follow_up_date DATE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_bookings_patient_id ON bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_nurse_id ON bookings(nurse_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_service_type ON bookings(service_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
    u.first_name || ' ' || u.last_name as patient_name,
    u.email as patient_email,
    u.phone as patient_phone,
    n.first_name || ' ' || n.last_name as nurse_name
FROM bookings b
JOIN users u ON b.patient_id = u.id
LEFT JOIN users n ON b.nurse_id = n.id;

-- Insert initial admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash for 'admin123' with bcrypt rounds=12
INSERT INTO users (
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
    'admin@royalhealthconsult.ng',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/9l6EyvNEXx0o9w3Zi', -- admin123
    'Admin',
    'User',
    '+2347000000000',
    'admin',
    'active',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Create database statistics view
CREATE OR REPLACE VIEW database_stats AS
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent_records
FROM users
UNION ALL
SELECT 
    'bookings' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent_records
FROM bookings;

COMMENT ON TABLE users IS 'Users table storing patient, nurse, and admin information';
COMMENT ON TABLE bookings IS 'Bookings table storing all appointment and service requests';
COMMENT ON VIEW user_summary IS 'Simplified view of users without sensitive information';
COMMENT ON VIEW booking_summary IS 'Comprehensive view of bookings with user information';