# Royal Health Consult - Deployment Guide

## Prerequisites
- Node.js 18+ 
- npm 8+
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

## Environment Configuration

### Required Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_DATABASE=royal_health_db

# Production Database URLs
DATABASE_URL=postgresql://user:pass@host:port/db
DATABASE_URL_DIRECT=postgresql://direct-connection-url
DATABASE_URL_POOLER=postgresql://pooler-connection-url

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-minimum-64-characters-long
JWT_REFRESH_SECRET=your-different-super-secure-refresh-secret
JWT_EXPIRES_IN=3600s

# Redis
REDIS_URL=redis://localhost:6379

# Email Service
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Error Tracking
SENTRY_DSN=https://your-sentry-dsn

# Application
NODE_ENV=production
PORT=3001
CORS_ORIGINS=https://your-frontend-domain.com
LOG_LEVEL=info
```

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Build and Run
```bash
# Build the Docker image
docker build -t royal-health-api .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: royal_health_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 2. Traditional Server Deployment

```bash
# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Start the application
npm run start:prod
```

### 3. Platform-as-a-Service Deployment

#### Render.com
1. Connect your GitHub repository
2. Set build command: `npm ci && npm run build`
3. Set start command: `npm run start:prod`
4. Add environment variables in dashboard

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

#### Heroku
```bash
# Create Heroku app
heroku create royal-health-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Add Redis addon
heroku addons:create heroku-redis:mini

# Deploy
git push heroku main
```

## Database Setup

### 1. Development Database
```bash
# Create database
createdb royal_health_db

# Run migrations (when available)
npm run migration:run

# Seed data (when available)  
npm run seed:run
```

### 2. Production Database
```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host:port/db"

# Run migrations in production
npm run migration:run -- --environment=production
```

## Monitoring Setup

### 1. Health Checks
The API provides several health check endpoints:
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system information
- `GET /api/v1/metrics/health` - Health metrics with alerts

### 2. Logging
Logs are written to:
- Console (development)
- `logs/application-YYYY-MM-DD.log` (all logs)
- `logs/error-YYYY-MM-DD.log` (errors only)

### 3. Metrics Endpoints (Admin access required)
- `/api/v1/metrics/system` - System metrics
- `/api/v1/metrics/application` - Application metrics
- `/api/v1/metrics/endpoints` - Endpoint performance

### 4. Error Tracking
Configure Sentry for production error tracking:
```bash
export SENTRY_DSN="https://your-sentry-dsn"
```

## Security Checklist

### Pre-Deployment
- [ ] Environment variables secured
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] CORS origins are configured
- [ ] Rate limiting is enabled
- [ ] File upload validation is active
- [ ] Error messages don't expose sensitive data

### Post-Deployment
- [ ] HTTPS is enforced
- [ ] Security headers are active
- [ ] Database access is restricted
- [ ] Logs don't contain sensitive data
- [ ] Backup strategy is in place
- [ ] Monitoring alerts are configured

## Backup Strategy

### Database Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_file.sql
```

### File Storage Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

## Performance Optimization

### 1. Database
- Enable connection pooling
- Use database indexes appropriately
- Implement query optimization
- Set up read replicas for scaling

### 2. Caching
- Redis is configured for session storage
- API responses can be cached using `@CacheInterceptor`
- Static assets should be served by CDN

### 3. Application
- Enable compression middleware
- Use cluster mode for multiple CPU cores
- Implement proper error handling
- Monitor memory usage and garbage collection

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy, AWS ALB)
- Implement session storage in Redis
- Use database connection pooling
- Separate file storage to external service (AWS S3)

### Vertical Scaling
- Monitor CPU and memory usage
- Adjust PM2 cluster instances
- Optimize database queries
- Implement caching strategies

## Troubleshooting

### Common Issues
1. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check connection pool settings

2. **Memory Issues**
   - Monitor application logs
   - Check for memory leaks
   - Adjust Node.js memory limits

3. **Performance Issues**
   - Review slow query logs
   - Check Redis connection
   - Monitor API response times

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=debug
export NODE_ENV=development

# Start application
npm run start:dev
```

## Support
For deployment support, contact: `devops@royalhealthconsult.com`