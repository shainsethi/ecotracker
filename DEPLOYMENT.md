# 🚀 EcoTracker Deployment Guide

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) 18+ installed
- [Vercel CLI](https://vercel.com/cli) (for frontend)
- [Railway CLI](https://railway.app/cli) or [Render](https://render.com/) account (for backend)

## 🌐 Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Build Your Project
```bash
cd project
npm run build
```

### 3. Deploy to Vercel
```bash
vercel
```

### 4. Set Environment Variables in Vercel Dashboard
Go to your project settings and add:
- `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app/api`)
- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

### 5. Update Google Maps API Restrictions
In Google Cloud Console, add your Vercel domain to allowed referrers.

## 🔧 Backend Deployment (Railway - Recommended)

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Railway Project
```bash
cd project/backend
railway init
```

### 4. Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_production_jwt_secret
railway variables set MONGODB_URI=your_production_mongodb_uri
railway variables set GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 5. Deploy
```bash
railway up
```

## 🔧 Alternative Backend Deployment (Render)

### 1. Create Render Account
Go to [render.com](https://render.com/) and create an account

### 2. Create New Web Service
- Connect your GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`
- Set environment variables

### 3. Environment Variables
- `NODE_ENV`: `production`
- `JWT_SECRET`: Your production JWT secret
- `MONGODB_URI`: Your production MongoDB URI
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Add to backend environment variables

### Option 2: Railway MongoDB
1. Create MongoDB service in Railway
2. Use the provided connection string

## 🔐 Environment Variables Summary

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Backend (Railway/Render Variables)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_very_long_random_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CORS_ORIGINS=https://your-frontend.vercel.app
```

## 🚀 Quick Deploy Commands

### Frontend
```bash
cd project
npm run build
vercel --prod
```

### Backend (Railway)
```bash
cd project/backend
railway up
```

## 🔍 Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend API endpoints respond
- [ ] Database connection works
- [ ] Authentication works
- [ ] Google Maps loads
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] SSL certificates are valid

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Check CORS_ORIGINS in backend
2. **Database connection**: Verify MONGODB_URI
3. **JWT errors**: Check JWT_SECRET is set
4. **Maps not loading**: Verify Google Maps API key and restrictions

### Debug Commands:
```bash
# Check backend logs
railway logs

# Check environment variables
railway variables

# Restart service
railway service restart
```

## 📱 Custom Domain (Optional)

### Frontend (Vercel)
1. Go to project settings
2. Add custom domain
3. Update DNS records

### Backend (Railway)
1. Go to service settings
2. Add custom domain
3. Update DNS records

## 🔒 Security Checklist

- [ ] JWT_SECRET is long and random
- [ ] MongoDB connection uses authentication
- [ ] CORS is restricted to your domains
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are active
- [ ] Environment variables are not exposed in code
