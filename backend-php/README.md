# Royal Health PHP Backend - Deployment Guide

## 🚀 Deployment Steps

### 1. Upload Files
Upload all files from `backend-php/` to your hosting directory:
- **Recommended path**: `/public_html/api/` 
- **Alternative**: `/public_html/backend-php/`

### 2. Set Up Database
1. Access your hosting control panel → phpMyAdmin
2. Select your database: `ancerlar_royal_health`
3. Import or run the SQL from `database/schema.sql`

### 3. Configure URLs
Your API endpoints will be available at:
- Health Check: `https://ancerlarins.com/api/health`
- Login: `https://ancerlarins.com/api/auth/login` 
- Register: `https://ancerlarins.com/api/auth/register`

### 4. Test the API
Test the health endpoint first:
```bash
curl https://ancerlarins.com/api/health
```

Should return:
```json
{
    "success": true,
    "message": "Health check passed",
    "data": {
        "status": "healthy",
        "database": {
            "status": "connected"
        }
    }
}
```

### 5. Update Frontend
The frontend is already configured to use `/api/v1` but you may need to adjust to `/api`:

In your frontend environment file, change:
```
VITE_API_BASE_URL=https://ancerlarins.com/api
```

## 🔧 Troubleshooting

### 404 Errors
- Ensure `.htaccess` file is uploaded and working
- Check that mod_rewrite is enabled on your hosting
- Verify files are in the correct directory

### Database Connection Issues
- Verify database credentials in `config/database.php`
- Ensure the database user has proper permissions
- Check that the database exists

### CORS Issues
- Update CORS origins in `index.php` if needed
- Check hosting provider's CORS policies

## 📁 File Structure
```
/public_html/api/
├── index.php (main router)
├── .htaccess (URL rewriting)
├── config/
├── controllers/
├── utils/
└── database/
```

## 🔑 Default Admin Account
- Email: `admin@ancerlarins.com`
- Password: `admin123`
- Role: `admin`

**⚠️ Change the admin password after deployment!**