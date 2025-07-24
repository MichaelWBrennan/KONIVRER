# 🔄 Vercel Skew Protection

## Overview

Skew protection prevents issues when multiple versions of the application are deployed simultaneously, ensuring users always interact with a consistent version of the app.

## 🛡️ Protection Mechanisms

### 1. **Vercel Skew Protection**
```json
{
  "skewProtection": {
    "maxAge": 3600,
    "enabled": true
  }
}
```

- **maxAge**: 3600 seconds (1 hour) - How long to keep old versions available
- **enabled**: true - Enables automatic skew protection

### 2. **Client-Side Detection**
- Automatic version monitoring every 5 minutes
- Fetch error detection and retry logic
- Version mismatch notifications
- Graceful degradation for network issues

### 3. **Version Tracking**
- Git commit SHA for unique version identification
- Build timestamp for deployment tracking
- Environment-specific version information
- Meta tag injection for client-side access

## 🔧 Implementation Details

### Version API Endpoint
```
GET /api/version
HEAD /api/version
```

Returns:
```json
{
  "version": "abc12345-1234567890",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "region": "iad1",
  "deployment": {
    "id": "dpl_abc123",
    "url": "konivrer-deck-database.vercel.app"
  }
}
```

### Client-Side Components

#### SkewProtection Utility
```javascript
import { skewProtection } from './utils/skewProtection.js';

// Manual version check
await skewProtection.checkVersionSkew();

// Force refresh with cache clearing
skewProtection.forceRefresh();

// Get current status
const status = skewProtection.getStatus();
```

#### React Hook
```javascript
import { useSkewProtection } from './hooks/useSkewProtection.js';

function MyComponent() {
  const { 
    isUpdateAvailable, 
    currentVersion, 
    checkForUpdates, 
    forceRefresh 
  } = useSkewProtection();

  return (
    <div>
      {isUpdateAvailable && (
        <button onClick={forceRefresh}>
          Update Available - Refresh Now
        </button>
      )}
    </div>
  );
}
```

#### SkewProtection Component
- Automatic update notifications
- User-friendly refresh prompts
- Non-intrusive UI design
- Dismissible notifications

## 🚀 Build Process

### Versioned Build
```bash
npm run build:versioned
```

This script:
1. Gets current git commit SHA
2. Generates build timestamp
3. Creates `.env.local` with version info
4. Updates `index.html` with version meta tag
5. Runs the standard build process

### Environment Variables
```bash
VITE_BUILD_TIME=2024-01-01T00:00:00.000Z
VITE_GIT_COMMIT_SHA=abc12345
VITE_APP_VERSION=abc12345-1234567890
```

## 🔍 Monitoring & Detection

### Automatic Checks
- **Periodic Monitoring**: Every 5 minutes
- **Visibility Change**: When user returns to tab
- **Fetch Errors**: Retry with version check
- **Network Recovery**: Version validation after reconnection

### Error Patterns
The system detects potential skew-related errors:
- "chunk load failed"
- "loading chunk"
- "unexpected token"
- "syntax error"
- "module not found"
- "network error"

### Retry Logic
- Maximum 3 retries with exponential backoff
- Version check before each retry
- Graceful fallback to hard refresh

## 🎯 User Experience

### Update Notification
When a new version is detected:

1. **Non-intrusive notification** appears in top-right corner
2. **Gradient background** with modern design
3. **Clear messaging** about available update
4. **Action buttons** for refresh or dismiss
5. **Auto-hide** after 10 seconds

### Notification Features
- ✅ Animated slide-in effect
- ✅ Version information display
- ✅ One-click refresh
- ✅ Manual update check
- ✅ Dismissible interface
- ✅ Accessibility support

## 🛠️ Configuration

### Vercel Settings
```json
{
  "skewProtection": {
    "maxAge": 3600,        // 1 hour retention
    "enabled": true        // Enable protection
  },
  "buildCommand": "npm run build:versioned",
  "env": {
    "VITE_BUILD_TIME": "@now",
    "VITE_GIT_COMMIT_SHA": "@vercel-git-commit-sha"
  }
}
```

### Client Settings
```javascript
const skewConfig = {
  versionCheckInterval: 5 * 60 * 1000,  // 5 minutes
  maxRetries: 3,                        // Retry attempts
  retryDelay: 1000,                     // Base delay (ms)
  notificationTimeout: 10000            // Auto-hide (ms)
};
```

## 🧪 Testing

### Manual Testing
1. **Deploy new version** while keeping old tab open
2. **Make API requests** from old tab
3. **Verify notification** appears
4. **Test refresh functionality**
5. **Check version consistency**

### Automated Testing
```bash
# Test version endpoint
curl -I https://your-app.vercel.app/api/version

# Check version headers
curl -H "X-Requested-With: XMLHttpRequest" \
     https://your-app.vercel.app/api/version
```

### Development Testing
```javascript
// Simulate version mismatch
localStorage.setItem('app-version', 'old-version');

// Trigger manual check
import { checkForUpdates } from './utils/skewProtection.js';
await checkForUpdates();
```

## 📊 Benefits

### For Users
- ✅ **Seamless updates** without manual refresh
- ✅ **Consistent experience** across sessions
- ✅ **No broken functionality** from version mismatches
- ✅ **Clear communication** about updates

### For Developers
- ✅ **Safe deployments** without user disruption
- ✅ **Automatic error recovery** from skew issues
- ✅ **Version tracking** and monitoring
- ✅ **Reduced support tickets** from version conflicts

### For Operations
- ✅ **Zero-downtime deployments**
- ✅ **Gradual rollout** capability
- ✅ **Automatic cleanup** of old versions
- ✅ **Performance optimization** through caching

## 🔧 Troubleshooting

### Common Issues

#### Version Check Fails
```javascript
// Check network connectivity
navigator.onLine

// Verify API endpoint
fetch('/api/version').then(r => console.log(r.status))
```

#### Notification Not Showing
```javascript
// Check if updates are available
import { getSkewStatus } from './utils/skewProtection.js';
console.log(getSkewStatus());
```

#### Build Version Missing
```bash
# Verify environment variables
echo $VITE_BUILD_TIME
echo $VITE_GIT_COMMIT_SHA

# Check build output
grep -r "app-version" dist/
```

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('skew-debug', 'true');

// View protection status
console.log(skewProtection.getStatus());
```

---

**🔄 Skew protection ensures a smooth, consistent user experience during deployments.**