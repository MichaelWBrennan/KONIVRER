/**
 * User Agent Dynamic Sizing Utility
 * Dynamically calculates optimal sizing based on user agent and device capabilities
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  availableWidth: number;
  availableHeight: number;
  orientation: 'portrait' | 'landscape';
  platform: string;
  browser: string;
  supportsWebGL: boolean;
  maxTextureSize: number;
  memoryLevel: 'low' | 'medium' | 'high';
  isIPhone16Pro?: boolean; // Optional flag for iPhone 16 Pro detection
}

export interface DynamicSizing {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
  unit: 'px' | 'vw' | 'vh' | '%';
  scaleFactor: number;
  cssWidth: string;
  cssHeight: string;
  containerPadding: number;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Detects device capabilities based on user agent and browser APIs
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  const userAgent = navigator.userAgent.toLowerCase();
  const screen = window.screen;
  const pixelRatio = window.devicePixelRatio || 1;

  // Mobile detection patterns with enhanced iPhone detection
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /mobile/i,
  ];

  // Enhanced iPhone model detection - more flexible detection
  const isIPhone16Pro =
    /iphone/i.test(userAgent) &&
    pixelRatio === 3 &&
    ((screen.width === 393 && screen.height === 852) ||
      (screen.width === 852 && screen.height === 393));

  // Tablet detection patterns
  const tabletPatterns = [/ipad/i, /android(?!.*mobile)/i, /tablet/i];

  const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent));
  const isTablet = tabletPatterns.some(pattern => pattern.test(userAgent));
  const isDesktop = !isMobile && !isTablet;

  // Browser detection
  let browser = 'unknown';
  if (userAgent.includes('chrome')) browser = 'chrome';
  else if (userAgent.includes('firefox')) browser = 'firefox';
  else if (userAgent.includes('safari')) browser = 'safari';
  else if (userAgent.includes('edge')) browser = 'edge';

  // Platform detection
  let platform = 'unknown';
  if (userAgent.includes('windows')) platform = 'windows';
  else if (userAgent.includes('mac')) platform = 'mac';
  else if (userAgent.includes('linux')) platform = 'linux';
  else if (userAgent.includes('android')) platform = 'android';
  else if (
    userAgent.includes('ios') ||
    userAgent.includes('iphone') ||
    userAgent.includes('ipad')
  )
    platform = 'ios';

  // WebGL capabilities
  let supportsWebGL = false;
  let maxTextureSize = 2048;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      supportsWebGL = true;
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
    }
  } catch (_e) {
    // WebGL not supported
  }

  // Memory level estimation based on device characteristics
  let memoryLevel: 'low' | 'medium' | 'high' = 'medium';
  const totalPixels = screen.width * screen.height * pixelRatio;
  const deviceMemory = (navigator as any).deviceMemory || 4; // Default to 4GB if not available

  if (deviceMemory <= 2 || totalPixels < 1280 * 720) {
    memoryLevel = 'low';
  } else if (deviceMemory >= 8 && totalPixels >= 1920 * 1080) {
    memoryLevel = 'high';
  }

  // Touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Orientation
  const orientation = screen.width > screen.height ? 'landscape' : 'portrait';

  // Available screen real estate (accounting for browser UI)
  const availableWidth = window.innerWidth || screen.availWidth;
  const availableHeight = window.innerHeight || screen.availHeight;

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasTouch,
    pixelRatio,
    screenWidth: screen.width,
    screenHeight: screen.height,
    availableWidth,
    availableHeight,
    orientation,
    platform,
    browser,
    supportsWebGL,
    maxTextureSize,
    memoryLevel,
    isIPhone16Pro, // Add iPhone 16 Pro detection flag
  };
}

/**
 * Calculates optimal sizing based on device capabilities
 */
export function calculateDynamicSizing(
  capabilities: DeviceCapabilities,
): DynamicSizing {
  const {
    isMobile,
    isTablet,
    isDesktop,
    availableWidth,
    availableHeight,
    pixelRatio,
    orientation,
    platform,
    browser,
    memoryLevel,
    isIPhone16Pro,
  } = capabilities;

  let width = availableWidth;
  let height = availableHeight;
  let unit: 'px' | 'vw' | 'vh' | '%' = 'px';
  let scaleFactor = 1;
  let containerPadding = 0;

  // Safe area insets (especially important for iOS devices with notches)
  const safeAreaInsets = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  // Platform-specific adjustments with enhanced user agent detection
  if (platform === 'ios') {
    // Enhanced iPhone 16 Pro specific handling
    if (isIPhone16Pro) {
      // iPhone 16 Pro has a Dynamic Island and specific safe area requirements
      safeAreaInsets.top = orientation === 'portrait' ? 54 : 0; // Account for Dynamic Island
      safeAreaInsets.bottom = orientation === 'portrait' ? 40 : 30; // Home indicator
      safeAreaInsets.left = orientation === 'landscape' ? 54 : 0; // Dynamic Island in landscape
      safeAreaInsets.right = orientation === 'landscape' ? 54 : 0;
    } else if (isMobile) {
      // Reduced safe area insets for mobile gaming experience (other mobile iOS devices)
      safeAreaInsets.top = orientation === 'portrait' ? 20 : 0; // Minimal status bar space
      safeAreaInsets.bottom = orientation === 'portrait' ? 10 : 5; // Minimal home indicator space

      // Minimal landscape adjustments for mobile
      if (orientation === 'landscape') {
        safeAreaInsets.left = availableWidth > 800 ? 10 : 0;
        safeAreaInsets.right = availableWidth > 800 ? 10 : 0;
      }
    } else {
      // Standard iOS safe areas for tablets/desktop
      safeAreaInsets.top = 44; // Status bar
      safeAreaInsets.bottom = 34; // Home indicator on newer devices

      // Adjust for iPhone X and newer models with notches/Dynamic Island
      if (availableHeight > 800 && orientation === 'portrait') {
        safeAreaInsets.top = 47;
        safeAreaInsets.bottom = 34;
      }

      // Enhanced landscape handling for different iPhone models
      if (orientation === 'landscape') {
        safeAreaInsets.left = availableWidth > 800 ? 44 : 0;
        safeAreaInsets.right = availableWidth > 800 ? 44 : 0;
        safeAreaInsets.top = 0;
        safeAreaInsets.bottom = 21;
      }

      // Special handling for iPad
      if (isTablet) {
        safeAreaInsets.top = 24;
        safeAreaInsets.bottom = 0;
        safeAreaInsets.left = 0;
        safeAreaInsets.right = 0;
      }
    }
  } else if (platform === 'android') {
    if (isMobile) {
      // Minimal Android safe areas for mobile gaming
      const hasNavBar = availableHeight < capabilities.screenHeight * 0.95;
      safeAreaInsets.bottom = hasNavBar ? 15 : 0; // Reduced navigation bar space
      safeAreaInsets.top = 10; // Minimal status bar

      // Minimal gesture navigation handling
      if (availableHeight > capabilities.screenHeight * 0.97) {
        safeAreaInsets.bottom = 5; // Minimal gesture bar
      }
    } else {
      // Standard Android safe areas for tablets/desktop
      const hasNavBar = availableHeight < capabilities.screenHeight * 0.95;
      safeAreaInsets.bottom = hasNavBar ? 48 : 0;
      safeAreaInsets.top = 24; // Status bar

      // Gesture navigation handling
      if (availableHeight > capabilities.screenHeight * 0.97) {
        safeAreaInsets.bottom = 10; // Gesture bar
      }
    }
  }

  // Device type specific sizing with enhanced responsiveness
  if (isMobile) {
    // Special handling for iPhone 16 Pro
    if (isIPhone16Pro) {
      // iPhone 16 Pro optimized sizing with safety checks
      if (orientation === 'portrait') {
        width = availableWidth;
        // Ensure height is never too small - use at least 80% of available height
        height = Math.max(availableHeight * 0.8, availableHeight - 100);
        containerPadding = 6; // Minimal padding for better space utilization
      } else {
        width = availableWidth;
        // Ensure height is never too small in landscape
        height = Math.max(availableHeight * 0.85, availableHeight - 60);
        containerPadding = 4;
      }

      // Use viewport units for iPhone 16 Pro for better flexibility
      unit = 'vh';
      scaleFactor = 0.95; // 95% to ensure content is visible
    } else {
      // Mobile devices: use maximum screen space for optimal experience
      if (orientation === 'portrait') {
        width = availableWidth;
        height =
          availableHeight -
          (browser === 'safari' && platform === 'ios' ? 30 : 20); // Reduced padding
        containerPadding = 2; // Minimal padding
      } else {
        width = availableWidth;
        height =
          availableHeight -
          (browser === 'safari' && platform === 'ios' ? 20 : 10); // Minimal padding
        containerPadding = 1; // Minimal padding for landscape
      }

      // Use viewport units for mobile for better responsiveness
      unit = 'px'; // Changed back to pixels for more predictable sizing
      scaleFactor = 1.0; // Use full available space
    }

    // For very small screens, still use full space but with minimal adjustments
    if (availableWidth < 375) {
      containerPadding = 1;
    }
  } else if (isTablet) {
    // Tablets: use more space but leave room for UI
    const maxTabletWidth = Math.min(availableWidth * 0.95, 1024);
    const maxTabletHeight = Math.min(availableHeight * 0.95, 768);

    width = maxTabletWidth;
    height = maxTabletHeight;
    containerPadding = 16;
    unit = 'px';

    // Better tablet scaling based on actual screen size
    if (availableWidth > 1000) {
      scaleFactor = 1.1;
    }
  } else if (isDesktop) {
    // Desktop: optimal game size based on common resolutions
    const optimalWidth = Math.min(availableWidth * 0.85, 1440);
    const optimalHeight = Math.min(availableHeight * 0.85, 900);

    width = optimalWidth;
    height = optimalHeight;
    containerPadding = 20;
    unit = 'px';

    // Ultra-wide monitor support
    if (availableWidth > 1920) {
      width = Math.min(availableWidth * 0.7, 1600);
      scaleFactor = 1.2;
    }
  }

  // Performance-based adjustments
  if (memoryLevel === 'low') {
    scaleFactor *= 0.8; // Reduce size for low-end devices
    containerPadding += 8; // More padding to prevent edge issues
  } else if (memoryLevel === 'high') {
    scaleFactor *= 1.1; // Slightly larger for high-end devices
  }

  // High DPI adjustments
  if (pixelRatio > 2) {
    // High DPI screens can handle slightly larger content
    scaleFactor *= 1.05;
  }

  // Browser-specific adjustments
  if (browser === 'safari' && platform === 'ios') {
    // Safari on iOS has unique viewport behavior
    height -= 50; // Account for Safari's bottom toolbar
  }

  // Apply scale factor
  width *= scaleFactor;
  height *= scaleFactor;

  // Calculate bounds
  const minWidth = isMobile ? 320 : 800;
  const minHeight = isMobile ? 480 : 600;
  const maxWidth = isDesktop ? 1920 : availableWidth;
  const maxHeight = isDesktop ? 1200 : availableHeight;

  // Ensure we don't exceed bounds
  width = Math.max(minWidth, Math.min(maxWidth, width));
  height = Math.max(minHeight, Math.min(maxHeight, height));

  // Account for safe area insets
  width -= safeAreaInsets.left + safeAreaInsets.right;
  height -= safeAreaInsets.top + safeAreaInsets.bottom;

  // Final safety check: ensure minimum dimensions after safe area adjustments
  width = Math.max(minWidth, width);
  height = Math.max(minHeight, height);

  // Add debugging info for iPhone 16 Pro
  if (isIPhone16Pro) {
    console.log('[iPhone 16 Pro Debug] Calculated dimensions:', {
      width,
      height,
      availableWidth,
      availableHeight,
      safeAreaInsets,
      scaleFactor,
      unit,
    });
  }

  // Generate CSS values
  const cssWidth =
    unit === 'px'
      ? `${width}px`
      : unit === 'vw'
        ? `${(width / availableWidth) * 100}vw`
        : `${width}${unit}`;
  const cssHeight =
    unit === 'px'
      ? `${height}px`
      : unit === 'vh'
        ? `${(height / availableHeight) * 100}vh`
        : `${height}${unit}`;

  return {
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    unit,
    scaleFactor,
    cssWidth,
    cssHeight,
    containerPadding,
    safeAreaInsets,
  };
}

/**
 * React hook for dynamic sizing that updates on window resize and orientation change
 */
export function useDynamicSizing() {
  const [sizing, setSizing] = React.useState<DynamicSizing>(() => {
    const capabilities = detectDeviceCapabilities();
    return calculateDynamicSizing(capabilities);
  });

  React.useEffect(() => {
    const updateSizing = () => {
      const capabilities = detectDeviceCapabilities();
      const newSizing = calculateDynamicSizing(capabilities);
      setSizing(newSizing);
    };

    // Update on resize and orientation change
    window.addEventListener('resize', updateSizing);
    window.addEventListener('orientationchange', updateSizing);

    // Update after a short delay on orientation change to ensure accurate measurements
    const handleOrientationChange = () => {
      setTimeout(updateSizing, 100);
    };
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', updateSizing);
      window.removeEventListener('orientationchange', updateSizing);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return sizing;
}

// For compatibility with non-React code
import React from 'react';
