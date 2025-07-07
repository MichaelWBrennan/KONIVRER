/**
 * Build Detection Utility
 * Aggressively detects build/deployment environments to prevent autonomous systems
 */

export const isBuildEnvironment = (): boolean => {
  // ULTRA-AGGRESSIVE BUILD DETECTION - Multiple layers of protection
  
  // VERCEL-SPECIFIC DETECTION - Highest priority
  if (
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_REGION ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_DEPLOYMENT_ID
  ) {
    console.log('[BUILD DETECTION] VERCEL environment detected');
    return true;
  }

  // 1. Server-side rendering detection (most reliable)
  if (typeof window === 'undefined') {
    return true;
  }

  // 2. Document readiness check (build environments often have incomplete DOM)
  if (typeof document === 'undefined' || !document.body) {
    return true;
  }

  // 3. Build-specific environment variable checks (only actual build time)
  if (
    process.env.VITE_BUILD === 'true' ||
    process.env.BUILD_ENV === 'production' ||
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.DISABLE_AUTONOMOUS === 'true' ||
    process.env.FORCE_BUILD_MODE === 'true' ||
    process.env.NODE_ENV === 'production' ||
    process.env.CI === 'true'
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

  // 5. Build-specific detection (not runtime)
  if (
    process.env.KONIVRER_BUILD_ID === 'vercel-build' ||
    process.env.__VERCEL_BUILD_RUNNING === '1'
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
  // ULTRA-AGGRESSIVE DETECTION - Always disable in production builds
  
  // Vercel-specific detection - highest priority
  if (
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV ||
    process.env.VERCEL_URL
  ) {
    console.log('[BUILD DETECTION] VERCEL detected - autonomous systems disabled');
    FORCE_DISABLE_AUTONOMOUS = true;
    return true;
  }
  
  // Emergency kill switch takes priority
  if (FORCE_DISABLE_AUTONOMOUS) {
    return true;
  }

  // Production environment check
  if (process.env.NODE_ENV === 'production') {
    console.log('[BUILD DETECTION] Production environment - autonomous systems disabled');
    FORCE_DISABLE_AUTONOMOUS = true;
    return true;
  }

  // Check for build environment
  const isBuild = isBuildEnvironment();

  if (isBuild) {
    console.log(
      '[BUILD DETECTION] Autonomous systems disabled - build environment detected',
    );
    // Auto-enable force disable if we detect build environment
    FORCE_DISABLE_AUTONOMOUS = true;
  }

  return isBuild;
};

// ULTRA-AGGRESSIVE safety check - disable autonomous systems immediately in any build-like environment
if (
  typeof process !== 'undefined' &&
  (
    // Vercel detection
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_REGION ||
    process.env.VERCEL_DEPLOYMENT_ID ||
    
    // Production/build detection
    process.env.NODE_ENV === 'production' ||
    process.env.VITE_BUILD === 'true' ||
    process.env.BUILD_ENV === 'production' ||
    process.env.DISABLE_AUTONOMOUS === 'true' ||
    process.env.FORCE_BUILD_MODE === 'true' ||
    process.env.KONIVRER_BUILD_ID === 'vercel-build' ||
    process.env.CI === 'true' ||
    
    // Build command detection
    process.env.npm_lifecycle_event === 'build' ||
    process.env.__VERCEL_BUILD_RUNNING === '1'
  )
) {
  FORCE_DISABLE_AUTONOMOUS = true;
  console.log(
    '[BUILD DETECTION] BUILD ENVIRONMENT DETECTED: Autonomous systems pre-disabled',
  );
}
