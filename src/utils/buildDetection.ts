/**
 * Build Detection Utility
 * Aggressively detects build/deployment environments to prevent autonomous systems
 */

export const isBuildEnvironment = (): boolean => {
  // AGGRESSIVE BUILD DETECTION - Multiple layers of protection
  
  // 1. Server-side rendering detection (most reliable)
  if (typeof window === 'undefined') {
    return true;
  }

  // 2. Document readiness check (build environments often have incomplete DOM)
  if (typeof document === 'undefined' || !document.body) {
    return true;
  }

  // 3. Environment variable checks (comprehensive)
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL === '1' ||
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.VERCEL_URL ||
    process.env.CI === 'true' ||
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.NETLIFY ||
    process.env.BUILD_ENV === 'production' ||
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.VITE_BUILD === 'true'
  ) {
    return true;
  }

  // 4. Build command detection
  if (
    process.env.npm_lifecycle_event === 'build' ||
    process.env.npm_lifecycle_event === 'start' ||
    process.env.npm_command === 'run-script' ||
    process.env.npm_config_user_config?.includes('vercel')
  ) {
    return true;
  }

  // 5. Vercel-specific detection
  if (
    process.env.VERCEL_REGION ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.DEPLOYMENT_ID ||
    typeof process.env.VERCEL_ANALYTICS_ID !== 'undefined'
  ) {
    return true;
  }

  // 6. User agent checks (build tools and headless browsers)
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent || '';
    if (
      userAgent.includes('Node.js') ||
      userAgent.includes('jsdom') ||
      userAgent.includes('PhantomJS') ||
      userAgent.includes('HeadlessChrome') ||
      userAgent.includes('Puppeteer') ||
      userAgent === '' // Empty user agent often indicates build environment
    ) {
      return true;
    }
  }

  // 7. Global object checks (build environments often have different globals)
  if (
    typeof global !== 'undefined' && 
    typeof window !== 'undefined' && 
    global === window
  ) {
    return true; // This pattern often indicates a build environment
  }

  // 8. Performance API check (often missing in build environments)
  if (typeof performance === 'undefined' || !performance.now) {
    return true;
  }

  return false;
};

// Emergency kill switch for autonomous systems
let FORCE_DISABLE_AUTONOMOUS = false;

export const forceDisableAutonomousSystems = (): void => {
  FORCE_DISABLE_AUTONOMOUS = true;
  console.log('[BUILD DETECTION] EMERGENCY: Autonomous systems force-disabled');
};

export const shouldSkipAutonomousSystems = (): boolean => {
  // Emergency kill switch takes priority
  if (FORCE_DISABLE_AUTONOMOUS) {
    return true;
  }

  const isBuild = isBuildEnvironment();
  
  if (isBuild) {
    console.log('[BUILD DETECTION] Autonomous systems disabled - build environment detected');
    // Auto-enable force disable if we detect build environment
    FORCE_DISABLE_AUTONOMOUS = true;
  }
  
  return isBuild;
};

// Additional safety check - disable autonomous systems immediately if Vercel is detected
if (
  typeof process !== 'undefined' && 
  (process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL)
) {
  FORCE_DISABLE_AUTONOMOUS = true;
  console.log('[BUILD DETECTION] VERCEL DETECTED: Autonomous systems pre-disabled');
}