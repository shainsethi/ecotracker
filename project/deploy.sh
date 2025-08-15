#!/bin/bash

echo "🚀 EcoTracker Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Deploy frontend to Vercel
echo "🌐 Deploying frontend to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Frontend deployment failed"
    exit 1
fi

echo "✅ Frontend deployed successfully"

# Deploy backend to Railway
echo "🔧 Deploying backend to Railway..."
cd backend

if [ ! -f "railway.json" ]; then
    echo "❌ Railway configuration not found"
    exit 1
fi

railway up

if [ $? -ne 0 ]; then
    echo "❌ Backend deployment failed"
    exit 1
fi

echo "✅ Backend deployed successfully"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Railway dashboard"
echo "2. Set environment variables in Vercel dashboard"
echo "3. Update Google Maps API restrictions"
echo "4. Test your deployed application"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
