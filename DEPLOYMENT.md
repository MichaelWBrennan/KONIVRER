# Deployment Guide

## Vercel Deployment

This project is optimized for deployment on Vercel with the following configuration:

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Set up required environment variables

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Crypto3k/KONIVRER-deck-database)

### Manual Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   
   In your Vercel dashboard, add these environment variables:
   
   ```
   NODE_ENV=production
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_APP_NAME=KONIVRER Deck Database
   VITE_APP_VERSION=1.0.0
   ```

3. **Build Settings**
   
   Vercel will automatically detect the configuration from `vercel.json`:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Backend Integration

The frontend is configured to work with a separate backend API. Update the `VITE_API_BASE_URL` environment variable to point to your backend service.

#### Recommended Backend Options:

1. **Vercel Functions** (Serverless)
2. **Railway** (Full-stack hosting)
3. **Heroku** (Traditional hosting)
4. **AWS/GCP/Azure** (Cloud platforms)

### Domain Configuration

1. **Custom Domain**: Add your domain in Vercel dashboard
2. **SSL**: Automatically provided by Vercel
3. **CDN**: Global edge network included

### Performance Optimizations

The build includes:
- ✅ Code splitting and lazy loading
- ✅ Asset optimization and compression
- ✅ Modern JavaScript with fallbacks
- ✅ CSS optimization and purging
- ✅ Image optimization ready
- ✅ Service worker ready (PWA)

### Monitoring

Set up monitoring with:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking (add to environment)
- **Google Analytics**: User analytics (configure in env)

### Troubleshooting

#### Build Failures
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

#### Environment Issues
- Ensure all `VITE_` prefixed variables are set
- Check that API endpoints are accessible
- Verify CORS configuration on backend

#### Routing Issues
- Vercel automatically handles SPA routing via `vercel.json`
- All routes redirect to `index.html` for client-side routing

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### CI/CD

The repository includes GitHub Actions workflow for:
- ✅ Automated testing
- ✅ Build verification
- ✅ Deployment to Vercel
- ✅ Environment validation

### Security

Production deployment includes:
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Environment variable validation
- ✅ Error boundary for graceful failures

### Support

For deployment issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check environment variable configuration
4. Verify backend API connectivity

---

**Last Updated**: 2024-05-28
**Version**: 1.0.0