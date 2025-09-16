#!/bin/bash

# Royal Health Deployment Script
# Run this script to prepare your application for deployment

echo "🚀 Preparing Royal Health for Deployment"
echo "========================================"

# Set production environment
export NODE_ENV=production

echo "📦 Building Frontend..."
cd frontend
npm install --production=false
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo "📦 Building Backend..."
cd ../backend
npm install --production=false
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

echo "📋 Creating deployment package..."

# Create deployment directory
mkdir -p ../deployment/frontend
mkdir -p ../deployment/backend

# Copy frontend build
cp -r frontend/dist/* ../deployment/frontend/

# Copy backend files
cp -r backend/dist/* ../deployment/backend/
cp backend/package.json ../deployment/backend/
cp backend/.env.production ../deployment/backend/.env

echo "✅ Deployment package ready in '../deployment' folder"
echo ""
echo "📋 Next steps:"
echo "1. Upload '../deployment/frontend' contents to your web root"
echo "2. Upload '../deployment/backend' to your Node.js app directory"
echo "3. Set environment variables in your hosting panel"
echo "4. Start your Node.js application"
echo ""
echo "🔗 Your app will be available at:"
echo "   Frontend: https://ancerlarins.com"
echo "   API: https://ancerlarins.com:30001/api/v1"