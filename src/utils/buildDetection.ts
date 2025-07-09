/**
 * Build Detection Utility
 * Aggressively detects build/deployment environments to prevent autonomous systems
 */

export const isBuildEnvironment = (): boolean => {
  // ULTRA-AGGRESSIVE BUILD DETECTION - Multiple layers of protection
  
  // Browser environment check - process is not available in browser
  if (typeof process === 'undefined') {
    return false; // In browser, not a build environment
  }
  
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
  if (typeof process !== 'undefined' && (
    process.env.VITE_BUILD === 'true' ||
    process.env.BUILD_ENV === 'production' ||
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.DISABLE_AUTONOMOUS === 'true' ||
    process.env.FORCE_BUILD_MODE === 'true' ||
    process.env.NODE_ENV === 'production' ||
    process.env.CI === 'true'
  )) {
    return true;
  }

  // 4. Build command detection
  if (typeof process !== 'undefined' && (
    process.env.npm_lifecycle_event === 'build' ||
    process.env.npm_lifecycle_event === 'start' ||
    process.env.npm_command === 'run-script' ||
    process.env.npm_config_user_config?.includes('vercel')
  )) {
    return true;
  }

  // 5. Build-specific detection (not runtime)
  if (typeof process !== 'undefined' && (
    process.env.KONIVRER_BUILD_ID === 'vercel-build' ||
    process.env.__VERCEL_BUILD_RUNNING === '1'
  )) {
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
  // GENTLE DETECTION - Only disable during actual build process, not in production runtime
  
  // Emergency kill switch takes priority
  if (FORCE_DISABLE_AUTONOMOUS) {
    return true;
  }

  // Only disable during actual build process (not production runtime)
  if (typeof process !== 'undefined' && (
    process.env.npm_lifecycle_event === 'build' ||
    process.env.__VERCEL_BUILD_RUNNING === '1' ||
    process.env.VITE_BUILD === 'true' ||
    process.env.DISABLE_AUTONOMOUS === 'true'
  )) {
    console.log('[BUILD DETECTION] Build process detected - autonomous systems disabled');
    return true;
  }

  // Server-side rendering detection (SSR builds)
  if (typeof window === 'undefined') {
    return true;
  }

  // Allow autonomous systems in production runtime (Vercel, etc.)
  console.log('[BUILD DETECTION] Runtime environment - autonomous systems enabled');
  return false;
};

// Gentle safety check - only disable during actual build process
if (
  typeof process !== 'undefined' &&
  (
    // Only actual build process detection
    process.env.npm_lifecycle_event === 'build' ||
    process.env.__VERCEL_BUILD_RUNNING === '1' ||
    process.env.VITE_BUILD === 'true' ||
    process.env.DISABLE_AUTONOMOUS === 'true'
  )
) {
  FORCE_DISABLE_AUTONOMOUS = true;
  console.log(
    '[BUILD DETECTION] BUILD PROCESS DETECTED: Autonomous systems disabled for build only',
  );
}
