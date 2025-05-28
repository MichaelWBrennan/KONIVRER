# Deployment Guide - Vercel Frontend + Render Backend

This guide covers deploying the KONIVRER Deck Database with frontend on Vercel and backend on Render.

## Architecture Overview

- **Frontend**: React + Vite deployed on Vercel
- **Backend**: Node.js + Express deployed on Render
- **Database**: MongoDB Atlas (cloud database)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
4. **GitHub Repository**: Your code should be in a GitHub repository

## Part 1: Backend Deployment (Render)

### 1. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster**:
   - Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a new cluster (free tier available)
   - Create a database user with read/write permissions
   - Whitelist IP addresses (use `0.0.0.0/0` for all IPs)

2. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/konivrer?retryWrites=true&w=majority
   ```

### 2. Deploy Backend to Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `konivrer-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/konivrer?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   FRONTEND_URL=https://your-app.vercel.app
   PORT=10000
   ```

4. **Advanced Settings**:
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: `Yes`

5. **Deploy and Test**:
   - Wait for deployment to complete
   - Test endpoints:
     - Health: `https://your-backend.onrender.com/health`
     - API: `https://your-backend.onrender.com/api`

## Part 2: Frontend Deployment (Vercel)

### 1. Configure Environment Variables

Before deploying, you'll need your backend URL from Render.

1. **Get Backend URL**: Copy from Render dashboard (e.g., `https://konivrer-backend.onrender.com`)

2. **Set Environment Variables in Vercel**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_BACKEND_URL=https://your-backend.onrender.com
   VITE_APP_NAME=KONIVRER Deck Database
   VITE_ENABLE_DEBUG=false
   ```

### 2. Deploy Frontend to Vercel

#### Option A: Using Vercel CLI

1. **Install and Login**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add VITE_API_BASE_URL production
   vercel env add VITE_BACKEND_URL production
   ```

#### Option B: Using Vercel Dashboard

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**: (See variables above)

4. **Deploy**: Click "Deploy"

### 3. Update Backend CORS

After frontend deployment, update your backend's `FRONTEND_URL` environment variable in Render:

```
FRONTEND_URL=https://your-actual-vercel-app.vercel.app
```

## Part 3: Testing the Integration

### 1. Test Backend

```bash
# Health check
curl https://your-backend.onrender.com/health

# API endpoints
curl https://your-backend.onrender.com/api/decks
```

### 2. Test Frontend

1. **Visit your Vercel URL**
2. **Check browser console** for any CORS or API errors
3. **Test functionality**:
   - Navigation between pages
   - API calls (if any are implemented)
   - Authentication (if implemented)

### 3. Test Integration

1. **Open browser developer tools**
2. **Monitor Network tab** for API calls
3. **Verify API calls** are going to your Render backend
4. **Check for CORS errors** in console

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://backend.onrender.com/api` |
| `VITE_BACKEND_URL` | Backend base URL | `https://backend.onrender.com` |
| `VITE_APP_NAME` | Application name | `KONIVRER Deck Database` |
| `VITE_ENABLE_DEBUG` | Debug mode | `false` |

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `10000` |
| `MONGO_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL | `https://app.vercel.app` |

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify `FRONTEND_URL` is set correctly in backend
   - Check that frontend URL matches exactly (including https://)
   - Monitor browser console for specific CORS errors

2. **API Connection Failures**:
   - Verify backend is running: check `/health` endpoint
   - Confirm environment variables are set correctly
   - Check network tab in browser dev tools

3. **Backend Won't Start**:
   - Check Render logs for error messages
   - Verify all environment variables are set
   - Ensure MongoDB connection string is correct

4. **Build Failures**:
   - **Frontend**: Check for TypeScript errors, missing dependencies
   - **Backend**: Verify package.json dependencies, Node.js version

### Performance Considerations

1. **Render Free Tier Limitations**:
   - Service sleeps after 15 minutes of inactivity
   - First request after sleep may be slow (cold start)
   - Consider upgrading for production apps

2. **Optimization Tips**:
   - Use Vercel's Edge Network for global distribution
   - Implement proper caching strategies
   - Monitor Core Web Vitals in Vercel Analytics

## Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **CORS**: Configure specific origins, avoid wildcards in production
3. **HTTPS**: Both Vercel and Render provide HTTPS by default
4. **Database**: Use strong passwords and limit IP access
5. **JWT Secrets**: Use long, random strings for JWT signing

## Monitoring and Maintenance

1. **Vercel Analytics**: Enable for frontend performance monitoring
2. **Render Logs**: Monitor backend logs for errors
3. **Database Monitoring**: Use MongoDB Atlas monitoring tools
4. **Uptime Monitoring**: Consider services like UptimeRobot

## Scaling Considerations

### Free Tier Limits

- **Vercel**: 100GB bandwidth, 6,000 build minutes/month
- **Render**: 750 hours/month, sleeps after inactivity
- **MongoDB Atlas**: 512MB storage, shared cluster

### Upgrade Path

For production applications, consider:
- **Vercel Pro**: Custom domains, more bandwidth, team features
- **Render Paid Plans**: Always-on services, more resources
- **MongoDB Atlas Dedicated**: Better performance, more storage

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)

---

**Last Updated**: 2025-05-28
**Version**: 1.0.0