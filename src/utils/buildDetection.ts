/**
 * Build Detection Utility
 * Aggressively detects build/deployment environments to prevent autonomous systems
 */

export const isBuildEnvironment = (): boolean => {
  // Server-side rendering detection
  if (typeof window === 'undefined') {
    return true;
  }

  // Environment variable checks
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.NETLIFY ||
    process.env.BUILD_ENV === 'production'
  ) {
    return true;
  }

  // Build-specific checks
  if (
    process.env.npm_lifecycle_event === 'build' ||
    process.env.npm_command === 'run-script'
  ) {
    return true;
  }

  // User agent checks (build tools)
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent || '';
    if (
      userAgent.includes('Node.js') ||
      userAgent.includes('jsdom') ||
      userAgent.includes('PhantomJS')
    ) {
      return true;
    }
  }

  return false;
};

export const shouldSkipAutonomousSystems = (): boolean => {
  const isBuild = isBuildEnvironment();
  
  if (isBuild) {
    console.log('[BUILD DETECTION] Autonomous systems disabled - build environment detected');
  }
  
  return isBuild;
};