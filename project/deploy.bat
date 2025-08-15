@echo off
echo 🚀 EcoTracker Deployment Script
echo ================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Build frontend
echo 📦 Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

echo ✅ Frontend built successfully

REM Deploy frontend to Vercel
echo 🌐 Deploying frontend to Vercel...
call vercel --prod

if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed
    pause
    exit /b 1
)

echo ✅ Frontend deployed successfully

REM Deploy backend to Railway
echo 🔧 Deploying backend to Railway...
cd backend

if not exist "railway.json" (
    echo ❌ Railway configuration not found
    pause
    exit /b 1
)

call railway up

if %errorlevel% neq 0 (
    echo ❌ Backend deployment failed
    pause
    exit /b 1
)

echo ✅ Backend deployed successfully

echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📋 Next steps:
echo 1. Set environment variables in Railway dashboard
echo 2. Set environment variables in Vercel dashboard
echo 3. Update Google Maps API restrictions
echo 4. Test your deployed application
echo.
echo 📚 See DEPLOYMENT.md for detailed instructions
pause
