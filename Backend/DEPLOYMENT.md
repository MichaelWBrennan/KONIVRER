# Backend Deployment Guide - Render

This guide covers deploying the KONIVRER Deck Database backend to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB Database**: Set up a MongoDB Atlas cluster or other MongoDB hosting
3. **GitHub Repository**: Backend code should be in a GitHub repository

## Deployment Steps

### 1. Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/konivrer?retryWrites=true&w=majority
   ```

### 2. Render Deployment

#### Option A: Using render.yaml (Recommended)

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your backend code

2. **Configure Blueprint**:
   - Render will automatically detect the `render.yaml` file
   - Review the configuration and click "Apply"

3. **Set Environment Variables**:
   - In the Render dashboard, go to your service
   - Navigate to "Environment" tab
   - Add the following variables:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/konivrer?retryWrites=true&w=majority
     JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
     FRONTEND_URL=https://your-app.vercel.app
     ```

#### Option B: Manual Setup

1. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `konivrer-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `Backend` (if backend is in a subdirectory)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Advanced Settings**:
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: `Yes`

4. **Environment Variables**: (Same as Option A)

### 3. Verify Deployment

1. **Check Service Status**:
   - Your service should show "Live" status in Render dashboard
   - Build logs should show successful installation and startup

2. **Test Endpoints**:
   - Health check: `https://your-service.onrender.com/health`
   - API root: `https://your-service.onrender.com/`
   - Should return JSON responses

3. **Check Logs**:
   - Monitor logs in Render dashboard for any errors
   - Look for "Connected to MongoDB" message

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `10000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT token signing | `your-secret-key` |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://app.vercel.app` |

## Connecting Frontend to Backend

Once your backend is deployed, update your frontend configuration:

1. **Get Backend URL**: Copy your Render service URL (e.g., `https://konivrer-backend.onrender.com`)

2. **Update Frontend Environment**:
   - In your Vercel project settings, add environment variable:
     ```
     VITE_API_BASE_URL=https://your-backend.onrender.com/api
     VITE_BACKEND_URL=https://your-backend.onrender.com
     ```

3. **Update vercel.json** (if using proxy):
   ```json
   {
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "https://your-backend.onrender.com/api/$1"
       }
     ]
   }
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that `package.json` is in the correct directory
   - Verify all dependencies are listed
   - Check Node.js version compatibility

2. **Database Connection Issues**:
   - Verify MongoDB URI is correct
   - Check database user permissions
   - Ensure IP whitelist includes Render's IPs (or use 0.0.0.0/0)

3. **CORS Errors**:
   - Verify `FRONTEND_URL` environment variable is set
   - Check that frontend URL matches exactly (including https://)
   - Monitor browser console for specific CORS errors

4. **Service Won't Start**:
   - Check logs for specific error messages
   - Verify all required environment variables are set
   - Ensure port binding is correct (use `process.env.PORT`)

### Monitoring

1. **Health Checks**: Monitor `/health` endpoint
2. **Logs**: Use Render dashboard logs for debugging
3. **Metrics**: Monitor response times and error rates

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **CORS**: Configure specific origins, avoid wildcards in production
3. **JWT Secret**: Use a strong, random secret key
4. **Database**: Use strong passwords and limit IP access
5. **HTTPS**: Render provides HTTPS by default

## Performance Tips

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Connection Pooling**: MongoDB driver handles this automatically
3. **Caching**: Consider adding Redis for session/data caching
4. **Monitoring**: Set up alerts for high response times or errors

## Scaling

Render free tier limitations:
- Service sleeps after 15 minutes of inactivity
- 750 hours/month of runtime
- 512MB RAM, 0.1 CPU

For production apps, consider upgrading to paid plans for:
- Always-on services
- More resources
- Better performance
- Custom domains