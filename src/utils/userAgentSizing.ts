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
  
  // Mobile detection patterns
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /mobile/i
  ];
  
  // Tablet detection patterns  
  const tabletPatterns = [
    /ipad/i,
    /android(?!.*mobile)/i,
    /tablet/i
  ];
  
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
  else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) platform = 'ios';
  
  // WebGL capabilities
  let supportsWebGL = false;
  let maxTextureSize = 2048;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      supportsWebGL = true;
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
    }
  } catch (e) {
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
    memoryLevel
  };
}

/**
 * Calculates optimal sizing based on device capabilities
 */
export function calculateDynamicSizing(capabilities: DeviceCapabilities): DynamicSizing {
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
    memoryLevel
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
    right: 0
  };
  
  // Platform-specific adjustments
  if (platform === 'ios') {
    // iOS devices often have safe area insets
    safeAreaInsets.top = 44; // Status bar
    safeAreaInsets.bottom = 34; // Home indicator on newer devices
    
    // Adjust for iPhone X and newer models with notches
    if (availableHeight > 800 && orientation === 'portrait') {
      safeAreaInsets.top = 47;
      safeAreaInsets.bottom = 34;
    }
    
    if (orientation === 'landscape') {
      safeAreaInsets.left = 44;
      safeAreaInsets.right = 44;
      safeAreaInsets.top = 0;
      safeAreaInsets.bottom = 21;
    }
  } else if (platform === 'android') {
    // Android devices may have navigation bars
    safeAreaInsets.bottom = 48; // Navigation bar
    safeAreaInsets.top = 24; // Status bar
  }
  
  // Device type specific sizing
  if (isMobile) {
    // Mobile devices: use most of the screen but account for browser UI
    if (orientation === 'portrait') {
      width = availableWidth;
      height = availableHeight - 60; // Account for browser address bar
      containerPadding = 8;
    } else {
      width = availableWidth;
      height = availableHeight - 40; // Less padding in landscape
      containerPadding = 4;
    }
    
    // Use viewport units for mobile for better responsiveness
    unit = 'vw';
    scaleFactor = 0.98; // 98% of viewport to leave some breathing room
    
  } else if (isTablet) {
    // Tablets: use more space but leave room for UI
    width = Math.min(availableWidth * 0.95, 1024);
    height = Math.min(availableHeight * 0.95, 768);
    containerPadding = 16;
    unit = 'px';
    
  } else if (isDesktop) {
    // Desktop: optimal game size based on common resolutions
    const optimalWidth = Math.min(availableWidth * 0.9, 1440);
    const optimalHeight = Math.min(availableHeight * 0.9, 900);
    
    width = optimalWidth;
    height = optimalHeight;
    containerPadding = 20;
    unit = 'px';
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
  
  // Generate CSS values
  const cssWidth = unit === 'px' ? `${width}px` : unit === 'vw' ? `${(width / availableWidth) * 100}vw` : `${width}${unit}`;
  const cssHeight = unit === 'px' ? `${height}px` : unit === 'vh' ? `${(height / availableHeight) * 100}vh` : `${height}${unit}`;
  
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
    safeAreaInsets
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