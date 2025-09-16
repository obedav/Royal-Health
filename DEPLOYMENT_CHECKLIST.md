# 🚀 Deployment Checklist for Royal Health

## Step 1: Upload PHP Backend
1. **Create API folder** in your hosting: `/public_html/api/`
2. **Upload all files** from `backend-php/` folder to `/public_html/api/`
3. **Ensure .htaccess** file is uploaded (it handles URL routing)

## Step 2: Set Up Database
1. **Access phpMyAdmin** from your hosting control panel
2. **Select database**: `ancerlar_royal_health`  
3. **Run SQL script**: Copy and paste contents from `backend-php/database/schema.sql`
4. **Verify tables created**: You should see `users` and `bookings` tables

## Step 3: Test PHP Backend
Test these URLs in your browser:

1. **Health Check**: https://ancerlarins.com/api/health
   - Should return JSON with "status": "healthy"

2. **Auth Test**: Try POST to https://ancerlarins.com/api/auth/register
   - Use Postman or browser dev tools

## Step 4: Upload Frontend
1. **Upload contents** of `frontend/dist/` to `/public_html/` (root directory)
2. **Include the updated .htaccess** file for React Router
3. **Include the fixed manifest.json** file

## Step 5: Update API URL (if needed)
If your API isn't at `/api/`, you may need to adjust the frontend:

**Current frontend expects**: `https://ancerlarins.com/api/v1`
**PHP backend provides**: `https://ancerlarins.com/api/[endpoint]`

## Step 6: Test Complete System
1. **Open your website**: https://ancerlarins.com
2. **Try registration**: Create a new account
3. **Try login**: Log in with the account
4. **Check browser console**: Should show no 404 errors

## 🔧 Troubleshooting

### If you get 404 errors:
- Check that `.htaccess` files are uploaded
- Verify mod_rewrite is enabled on your hosting
- Ensure files are in correct directories

### If database connection fails:
- Verify credentials in `backend-php/config/database.php`
- Check database permissions
- Ensure database exists

### If CORS errors occur:
- Update allowed origins in `backend-php/index.php`
- Check hosting provider's CORS policies

## ✅ Success Indicators
- ✅ https://ancerlarins.com/api/health returns healthy status
- ✅ Frontend loads without console errors  
- ✅ Registration and login work
- ✅ No 404 errors in network tab

## 🔑 Test Account
Default admin account (change password after deployment):
- **Email**: admin@ancerlarins.com
- **Password**: admin123