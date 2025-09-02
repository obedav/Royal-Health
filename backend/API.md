# Royal Health Consult API Documentation

## Overview
The Royal Health Consult API provides comprehensive healthcare management services including user authentication, appointment booking, health records management, and notification services.

**Base URL:** `https://api.royalhealthconsult.com/api/v1`  
**Documentation:** `https://api.royalhealthconsult.com/api/docs`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Auth Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Rate Limiting
- **General API:** 1000 requests per 15 minutes
- **Authentication:** 10 requests per 15 minutes
- **Password Reset:** 3 requests per hour

## Core Features

### 1. User Management (`/users`)
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/health-records` - Get health records
- `POST /users/health-records` - Add health record

### 2. Booking System (`/bookings`)
- `GET /bookings` - List user bookings
- `POST /bookings` - Create new booking
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

### 3. Health Monitoring (`/health`)
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system health

### 4. Notifications (`/notifications`)
- `POST /notifications/send-email` - Send email notification
- `POST /notifications/send-sms` - Send SMS notification
- `POST /notifications/appointment-reminder` - Send appointment reminder

### 5. File Uploads (`/uploads`)
- `POST /uploads/image` - Upload image files
- `POST /uploads/document` - Upload document files  
- `POST /uploads/medical-record` - Upload medical records
- `DELETE /uploads/:filename` - Delete uploaded file

### 6. Metrics & Monitoring (`/metrics`) - Admin Only
- `GET /metrics/health` - Health metrics with alerts
- `GET /metrics/system` - System performance metrics
- `GET /metrics/application` - Application usage metrics
- `GET /metrics/endpoints` - Endpoint performance metrics
- `POST /metrics/reset` - Reset metrics counters

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "POST",
  "message": "Error description"
}
```

## Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Security Features
- **Helmet.js** - Security headers
- **Rate Limiting** - Request throttling
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Request data validation
- **File Validation** - Upload security checks
- **CORS** - Cross-origin protection

## Monitoring & Logging
- **Winston Logging** - Structured application logs
- **Error Tracking** - Automatic error collection
- **Performance Metrics** - Response time tracking
- **Security Alerts** - Suspicious activity detection
- **Health Checks** - System status monitoring

## File Upload Specifications

### Image Upload
- **Max Size:** 5MB
- **Formats:** JPEG, PNG, GIF, WebP
- **Endpoint:** `POST /uploads/image`

### Document Upload  
- **Max Size:** 10MB
- **Formats:** PDF, DOC, DOCX, TXT
- **Endpoint:** `POST /uploads/document`

### Medical Records
- **Max Size:** 20MB
- **Formats:** PDF, JPEG, PNG, DICOM
- **Endpoint:** `POST /uploads/medical-record`

## Notification Services

### Email Notifications
- Welcome emails
- Appointment confirmations
- Password reset emails
- Appointment reminders

### SMS Notifications
- Verification codes
- Appointment confirmations
- Emergency alerts
- Appointment reminders

## Development
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with TypeORM
- **Cache:** Redis
- **Queue:** Bull/Redis
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest with E2E tests

## Support
For API support, contact: `dev@royalhealthconsult.com`  
Documentation issues: Submit to GitHub repository