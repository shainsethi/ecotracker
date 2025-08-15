# 🚀 Quick Deploy - EcoTracker

## ⚡ 5-Minute Deployment

### 1. Install Required Tools
```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI
npm install -g @railway/cli
```

### 2. Deploy Frontend (Vercel)
```bash
cd project
npm run build
vercel --prod
```

### 3. Deploy Backend (Railway)
```bash
cd project/backend
railway login
railway init
railway up
```

### 4. Set Environment Variables

#### In Railway Dashboard:
- `NODE_ENV`: `production`
- `JWT_SECRET`: `your_long_random_secret`
- `MONGODB_URI`: `your_mongodb_connection_string`
- `GOOGLE_MAPS_API_KEY`: `your_google_maps_key`
- `CORS_ORIGINS`: `https://your-frontend.vercel.app`

#### In Vercel Dashboard:
- `VITE_API_URL`: `https://your-backend.railway.app/api`
- `VITE_GOOGLE_MAPS_API_KEY`: `your_google_maps_key`

### 5. Update Google Maps API
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Add your Vercel domain to allowed referrers

## 🎯 That's It!

Your EcoTracker app is now live! 🎉

## 🔗 Your URLs
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API: `https://your-app.railway.app/api`

## 📚 Need More Details?
See `DEPLOYMENT.md` for comprehensive instructions.
