# Deployment Guide for Home Healthcare Platform

## Pre-Deployment Checklist

### ✅ Critical Requirements (Must Complete)

#### Environment Configuration
- [ ] Copy `.env.example` to `.env` in frontend directory
- [ ] Set `VITE_API_BASE_URL` to your production API URL
- [ ] Configure contact information in environment variables
- [ ] Set `VITE_ENVIRONMENT=production`

#### Image Assets
- [ ] Ensure all required images exist in `frontend/public/images/`:
  - `general.jpg` - General Health Assessment
  - `elderly.jpg` - Elderly Care Assessment
  - `chronic.jpg` - Chronic Condition Assessment
  - `post-surgery.jpg` - Post-Surgery Assessment
  - `mental.jpg` - Mental Health Screening
  - `maternal.jpg` - Maternal Health Assessment
  - `pediatric.jpg` - Pediatric Assessment
  - `routine.jpg` - Routine Check-up
  - `emergency.jpg` - Emergency Assessment
  - `assessment.jpg` - Default assessment fallback
  - `care-img.jpeg` - Home nursing care
  - `m-care.png` - Mother & baby care
  - `wound-img.png` - Wound dressing
  - `physiotherapy.jpg` - Physiotherapy services
  - `dementia-care.jpg` - Dementia care

#### Backend API
- [ ] Ensure backend API is running and accessible
- [ ] Verify `/api/consultations` endpoint accepts POST requests
- [ ] Test API endpoint returns proper JSON responses
- [ ] Configure CORS to allow frontend domain

#### Build & Testing
- [ ] Run `npm run build` successfully with no errors
- [ ] Test consultation form submission
- [ ] Test booking flow from consultation
- [ ] Test image loading and fallbacks
- [ ] Test responsive design on mobile devices
- [ ] Test error handling for network failures

### 🔧 Optional Optimizations

#### Performance
- [ ] Enable image optimization/CDN (set `VITE_IMAGE_CDN_URL`)
- [ ] Configure service worker for offline functionality
- [ ] Enable gzip compression on server
- [ ] Implement lazy loading for images

#### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Enable analytics (set `VITE_ENABLE_ANALYTICS=true`)
- [ ] Configure health check endpoints
- [ ] Set up uptime monitoring

#### Security
- [ ] Configure Content Security Policy (CSP)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure headers on server
- [ ] Validate and sanitize all form inputs on backend

## Deployment Steps

### 1. Frontend Deployment

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with production values

# 4. Build for production
npm run build

# 5. Deploy dist folder to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### 2. Backend Setup (if needed)

```bash
# Set up your backend API to handle:
# POST /api/consultations
# - Accept JSON with consultation data
# - Return JSON response
# - Handle errors gracefully
```

### 3. Domain & DNS Configuration

- [ ] Point domain to hosting service
- [ ] Configure SSL certificates
- [ ] Test domain accessibility
- [ ] Update CORS settings with production domain

## Environment Variables Reference

### Required for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_ENVIRONMENT=production
VITE_CONTACT_PHONE="+234 706 332 5184"
```

### Optional
```env
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_IMAGE_CDN_URL=https://your-cdn.com
```

## Troubleshooting

### Common Issues

#### 1. Images Not Loading
- Check all image files exist in `public/images/`
- Verify file names match exactly (case-sensitive)
- Check browser network tab for 404 errors

#### 2. API Connection Errors
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration on backend
- Test API endpoint directly with curl/Postman

#### 3. Form Submission Issues
- Check network tab for request details
- Verify backend accepts JSON content-type
- Check for proper error handling

#### 4. Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`
- Verify all imports are correct

### Health Checks

After deployment, verify:
- [ ] Home page loads correctly
- [ ] Services page displays all categories
- [ ] Consultation modal opens and closes
- [ ] Form validation works
- [ ] Image fallbacks work (temporarily rename an image file)
- [ ] Mobile responsive design
- [ ] Error states display properly

## Support

For deployment issues:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify environment variables are set correctly
4. Test API endpoints independently

## Performance Benchmarks

Target metrics:
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Time to Interactive**: < 4s
- **Lighthouse Score**: > 90

Monitor these metrics after deployment and optimize as needed.