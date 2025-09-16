# 🗄️ Royal Health Database Documentation

## **Database Overview**

Royal Health uses PostgreSQL as the primary database with Supabase for cloud hosting. The database is designed to handle healthcare appointments, user management, and patient records securely.

## **📊 Database Schema**

### **Tables Overview**

| Table | Purpose | Records Expected |
|-------|---------|------------------|
| `users` | Store all user types (patients, nurses, admins) | 1,000+ |
| `bookings` | Store appointment and service bookings | 5,000+ |

### **Users Table**
Primary table for all user types with role-based access control.

```sql
-- Key fields
id                    UUID PRIMARY KEY
email                 VARCHAR(255) UNIQUE
password_hash         VARCHAR(255) -- bcrypt hashed
first_name, last_name VARCHAR(100)
phone                 VARCHAR(20) UNIQUE
role                  ENUM('client', 'nurse', 'admin')
status                ENUM('pending_verification', 'active', 'suspended', 'inactive')
```

**Security Features:**
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Account lockout after 5 failed attempts
- ✅ Email/phone verification tokens
- ✅ Password reset tokens with expiration

### **Bookings Table**
Stores all healthcare service bookings and appointments.

```sql
-- Key fields
id                    UUID PRIMARY KEY
service_type          VARCHAR(100)
scheduled_date        DATE
scheduled_time        VARCHAR(10)
patient_address       TEXT
patient_id            UUID REFERENCES users(id)
nurse_id              UUID REFERENCES users(id)
status                ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')
payment_status        ENUM('pending', 'paid', 'failed', 'refunded', 'cash_on_delivery')
total_price           DECIMAL(10,2) DEFAULT 5000.00
```

## **🔗 Database Connections**

### **Connection Configuration**

**Development:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=royal_health_db
```

**Production (Supabase):**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.mmbeoacbxdlymimsafpl.supabase.co:5432/postgres
DATABASE_URL_DIRECT=postgresql://postgres:[PASSWORD]@db.mmbeoacbxdlymimsafpl.supabase.co:5432/postgres
```

### **Connection Pool Settings**

**Production:**
- Max connections: 20
- Min connections: 5
- Connection timeout: 10 seconds
- Idle timeout: 30 seconds

**Development:**
- Max connections: 10
- Min connections: 1

## **🚀 Database Operations**

### **Available Scripts**

```bash
# Run all pending migrations
npm run db:migrate

# Check database health and connectivity
npm run db:health

# Create backup of current data
npm run db:backup

# Validate security configuration
npm run security:validate
```

### **Migration System**

Migrations are stored in `backend/migrations/` and tracked in the `migrations` table:

```sql
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## **📈 Performance Optimization**

### **Indices Created**

**Users Table:**
- `idx_users_email` - For login queries
- `idx_users_phone` - For phone-based lookups
- `idx_users_role` - For role-based queries
- `idx_users_status` - For status filtering

**Bookings Table:**
- `idx_bookings_patient_id` - For patient booking queries
- `idx_bookings_nurse_id` - For nurse assignment queries
- `idx_bookings_status` - For status filtering
- `idx_bookings_scheduled_date` - For date-based queries

### **Query Optimization**

- ✅ **Parameterized queries** prevent SQL injection
- ✅ **Index usage** for common query patterns
- ✅ **Connection pooling** reduces overhead
- ✅ **Query timeout** prevents long-running queries

## **🛡️ Security Features**

### **Data Protection**
- ✅ **Sensitive data exclusion** from API responses
- ✅ **Role-based access control** at application level
- ✅ **Audit trails** with created/updated timestamps
- ✅ **SSL/TLS encryption** in production

### **Backup Strategy**
- ✅ **Automated daily backups** (Supabase)
- ✅ **Manual backup script** for data export
- ✅ **Point-in-time recovery** available

## **📊 Database Views**

### **User Summary View**
Non-sensitive user information for reports:
```sql
CREATE VIEW user_summary AS
SELECT id, email, first_name, last_name, phone, role, status, created_at
FROM users;
```

### **Booking Summary View**
Comprehensive booking information with user details:
```sql
CREATE VIEW booking_summary AS
SELECT 
    b.*,
    u.first_name || ' ' || u.last_name as patient_name,
    n.first_name || ' ' || n.last_name as nurse_name
FROM bookings b
JOIN users u ON b.patient_id = u.id
LEFT JOIN users n ON b.nurse_id = n.id;
```

## **🔧 Maintenance**

### **Regular Tasks**

**Daily:**
- ✅ Automated backups (Supabase)
- ✅ Health check monitoring

**Weekly:**
- [ ] Review slow query logs
- [ ] Check connection pool utilization
- [ ] Analyze database performance metrics

**Monthly:**
- [ ] Update table statistics
- [ ] Review and optimize indices
- [ ] Clean up old verification tokens
- [ ] Archive old completed bookings

### **Monitoring Queries**

```sql
-- Check active connections
SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active';

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables WHERE schemaname = 'public';

-- Check recent activity
SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24 hours';
SELECT COUNT(*) FROM bookings WHERE created_at > NOW() - INTERVAL '24 hours';
```

## **🚨 Troubleshooting**

### **Common Issues**

**Connection Issues:**
- Verify DATABASE_URL is correct
- Check SSL settings for production
- Confirm network connectivity

**Performance Issues:**
- Check for missing indices
- Review connection pool settings
- Monitor query execution times

**Data Issues:**
- Verify foreign key constraints
- Check enum values match application code
- Validate data types and lengths

### **Emergency Procedures**

**Database Down:**
1. Check Supabase dashboard
2. Verify connection strings
3. Check application logs
4. Contact Supabase support if needed

**Data Corruption:**
1. Stop application immediately
2. Restore from latest backup
3. Investigate root cause
4. Update procedures to prevent recurrence

## **📞 Support**

**Database Issues:**
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Application Logs**: Check backend/logs/
- **Support Email**: support@royalhealthconsult.ng

**Migration Issues:**
- Check `migrations` table for status
- Review migration logs
- Manual rollback if necessary
- Contact development team

---

**Last Updated**: January 2025  
**Schema Version**: 1.0  
**Next Review**: February 2025