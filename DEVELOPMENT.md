# KONIVRER Development Automation

This document describes the development automation tools available in this project. These tools are designed to be safe for use with Vercel deployments and won't interfere with production builds.

## Vercel-Safe Development Automation

The project includes a Vercel-safe development automation system that provides helpful development features without interfering with production builds.

### Key Features

- ✅ TypeScript checking every 5 seconds with auto-fix
- ✅ ESLint & Prettier every 5 seconds with auto-fix
- ✅ Security monitoring every minute
- ✅ Performance monitoring every minute
- ✅ Development dashboard

### Vercel Safety Features

- ✅ No automation during builds
- ✅ No auto-commit or auto-push
- ✅ Development-only features
- ✅ No interference with production

## Getting Started

To use the development automation tools, run one of the following commands:

```bash
# Start development server with automation
npm run dev:safe

# Run all checks once
npm run dev:check

# Run auto-fix for TypeScript and ESLint
npm run dev:fix

# Start development dashboard only
npm run dev:dashboard

# Start monitoring only
npm run dev:monitor
```

## Development Dashboard

The development dashboard provides a visual interface for monitoring the status of your development environment. It's available at http://localhost:12002 when running `npm run dev:safe` or `npm run dev:dashboard`.

## How It Works

The development automation system:

1. Automatically detects if it's running in a build environment (Vercel, CI, etc.)
2. Skips all automation during builds to prevent timeouts
3. Runs TypeScript and ESLint checks every 5 seconds in development
4. Provides auto-fix capabilities for common issues
5. Monitors security and performance without interfering with builds

## Configuration

The automation system is configured in `dev-automation.js`. You can adjust the intervals and features by modifying the `CONFIG` object at the top of the file.

```javascript
// Configuration - Development Only
const CONFIG = {
  typescript: { check: true, autoFix: true, interval: 5000 }, // 5 seconds
  security: { check: true, interval: 60000 }, // 1 minute
  quality: { eslint: true, prettier: true, interval: 5000 }, // 5 seconds
  performance: { optimize: true, interval: 60000 }, // 1 minute
  notifications: { enabled: true, channels: ['console'] },
  monitoring: { enabled: true, interval: 5000 }, // 5 seconds
  // VERCEL SAFETY FEATURES
  vercel: {
    disableDuringBuild: true,
    disableAutoCommit: true,
    disableAutoPush: true,
    disableFileWatcher: false,
    safeMode: true
  }
};
```

## Legacy Automation

The project still includes the legacy automation system in the `automation` directory. This system is more aggressive and includes features like auto-commit and auto-push, which can interfere with Vercel builds. It's recommended to use the Vercel-safe development automation system instead.