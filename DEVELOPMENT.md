# KONIVRER Development Automation

This document describes the development automation tools available in this project. These tools are designed to be safe for use with Vercel deployments and won't interfere with production builds.

## Vercel-Safe Development Automation

The project includes a Vercel-safe development automation system that provides helpful development features without interfering with production builds.

### Key Features

- ✅ TypeScript checking every 5 seconds with auto-fix
- ✅ ESLint & Prettier every 5 seconds with auto-fix
- ✅ Security monitoring every minute with auto-fix
- ✅ Performance monitoring every minute with optimization
- ✅ Dependency checking every hour with auto-update
- ✅ Interactive development dashboard
- ✅ File watcher for real-time feedback
- ✅ VS Code integration
- ✅ Autonomous mode for zero human interaction
- ✅ Browser launcher for easy access
- ✅ File access watcher for auto-start

### Vercel Safety Features

- ✅ No automation during builds
- ✅ No auto-commit or auto-push
- ✅ Development-only features
- ✅ No interference with production
- ✅ Safe timeouts for build operations
- ✅ Automatic environment detection

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

## Advanced Commands

For more advanced usage, you can use the following commands:

```bash
# Set up project (VS Code tasks, initial checks)
npm run dev:setup

# Start file watcher only
npm run dev:file-watcher

# Set up VS Code tasks
npm run dev:vscode

# Start autonomous mode
npm run dev:autonomous

# Start zero-interaction mode
npm run dev:zero-interaction

# Start hands-off mode (same as zero-interaction)
npm run dev:hands-off

# Set up and start browser launcher
npm run dev:browser-launcher

# Set up file access watcher
npm run dev:file-access-watcher
```

## Autonomous Mode

The autonomous mode provides a zero-human-interaction development experience:

```bash
npm run dev:autonomous
```

This mode:
- Automatically runs TypeScript checks and fixes issues
- Automatically runs ESLint and Prettier checks and fixes issues
- Automatically runs security checks and fixes vulnerabilities
- Automatically runs performance checks and optimizations
- Automatically checks for outdated dependencies
- Provides a dashboard for monitoring the system
- Runs continuously without requiring human interaction

## Zero-Interaction Mode

The zero-interaction mode goes even further:

```bash
npm run dev:zero-interaction
```

This mode:
- Starts the development server
- Starts the autonomous mode
- Sets up auto-start features
- Starts the browser launcher
- Provides a complete hands-off development experience

## Auto-Start Features

### Browser Launcher

The browser launcher provides a simple way to start the development server:

```bash
npm run dev:browser-launcher
```

Once started, you can access:
- http://localhost:12003 - Auto-starts the development server
- http://localhost:12003/dashboard - Opens the development dashboard
- http://localhost:12003/autonomous - Starts autonomous mode

### File Access Watcher

The file access watcher automatically starts the development automation when files are accessed:

```bash
npm run dev:file-access-watcher
```

This is useful for automatically starting the development automation when you open a file in your editor.

## Development Dashboard

The development dashboard provides a visual interface for monitoring the status of your development environment. It's available at http://localhost:12002 when running `npm run dev:safe` or `npm run dev:dashboard`.

### Dashboard Features

- Real-time status monitoring
- One-click checks and auto-fix
- System information
- Quick access to documentation
- Interactive controls

## How It Works

The development automation system:

1. Automatically detects if it's running in a build environment (Vercel, CI, etc.)
2. Skips all automation during builds to prevent timeouts
3. Runs TypeScript and ESLint checks every 5 seconds in development
4. Provides auto-fix capabilities for common issues
5. Monitors security and performance without interfering with builds
6. Watches for file changes and provides real-time feedback
7. Sets up VS Code tasks for easy access to automation features
8. Provides a dashboard for monitoring and controlling automation

## Auto-Start Features

The automation system includes several auto-start features:

### File Watcher

The file watcher monitors the `src` directory for changes and automatically runs appropriate checks based on the file type:

- TypeScript files (`.ts`, `.tsx`): TypeScript and ESLint checks
- JavaScript files (`.js`, `.jsx`): ESLint checks

### VS Code Integration

The automation system sets up VS Code tasks for easy access to automation features:

- `Start KONIVRER Development`: Starts the development server with automation
- `Run All Checks`: Runs all checks once
- `Run Auto-Fix`: Runs auto-fix for TypeScript and ESLint

It also sets up recommended VS Code settings for TypeScript, ESLint, and Prettier.

## Configuration

The automation system is configured in `dev-automation.js`. You can adjust the intervals and features by modifying the `CONFIG` object at the top of the file.

```javascript
// Configuration - Development Only
const CONFIG = {
  typescript: { check: true, autoFix: true, interval: 5000 }, // 5 seconds
  security: { 
    check: true, 
    autoFix: true, // Auto-fix security issues in dev only
    interval: 60000, // 1 minute
    quickScan: true 
  },
  quality: { 
    eslint: true, 
    prettier: true, 
    autoFix: true,
    interval: 5000 // 5 seconds
  },
  performance: { 
    optimize: true, 
    bundleAnalysis: true,
    imageOptimization: true,
    interval: 60000 // 1 minute
  },
  dependencies: {
    autoUpdate: true, // Auto-update in dev only
    checkOutdated: true,
    interval: 3600000 // 1 hour
  },
  notifications: { 
    enabled: true, 
    channels: ['console', 'dashboard'],
    desktop: false // No desktop notifications
  },
  monitoring: { 
    enabled: true, 
    interval: 5000, // 5 seconds
    detailedLogs: true
  },
  autoStart: {
    fileWatcher: true, // Auto-start on file access
    dashboard: true, // Auto-start dashboard
    vscodeTask: true // Create VS Code task
  },
  // VERCEL SAFETY FEATURES
  vercel: {
    disableDuringBuild: true, // Disable during Vercel builds
    disableAutoCommit: true, // Never auto-commit
    disableAutoPush: true, // Never auto-push
    disableInProduction: true, // Disable in production
    safeMode: true, // Extra safety checks
    maxBuildTime: 30000 // Max 30s for any operation during build
  }
};
```

## Performance Optimization

The automation system includes several performance optimization features:

- Bundle size analysis
- Large file detection
- Image optimization recommendations
- Performance monitoring

## Security Monitoring

The automation system includes security monitoring features:

- npm audit checks
- Auto-fix for security vulnerabilities (in development only)
- Quick security scans

## Dependency Management

The automation system includes dependency management features:

- Outdated package detection
- Auto-update for dependencies (in development only)
- Regular dependency checks

## Legacy Automation

The project still includes the legacy automation system in the `automation` directory. This system is more aggressive and includes features like auto-commit and auto-push, which can interfere with Vercel builds. It's recommended to use the Vercel-safe development automation system instead.