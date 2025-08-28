/**
 * User Agent Detection Utility
 * Detects if the user is on mobile or desktop to provide appropriate MTG Arena experience
 */

export interface DeviceInfo {
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isPhone: boolean;
  platform: 'mobile' | 'desktop';
  os: string;
  browser: string;
  orientation: 'portrait' | 'landscape';
  requiresRotation: boolean;
}

export function detectDevice(): DeviceInfo {
  const userAgent    : any = navigator.userAgent.toLowerCase();
  
  // Detect mobile devices
  const mobileRegex    : any = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileUA    : any = mobileRegex.test(userAgent);
  const isMobileScreen    : any = window.innerWidth <= 768;
  const isMobile    : any = isMobileUA || isMobileScreen;
  
  // Detect tablets vs phones
  const tabletRegex    : any = /ipad|android(?!.*mobile)|kindle|silk/i;
  const isTabletUA    : any = tabletRegex.test(userAgent);
  
  // Consider it a tablet if:
  // 1. User agent suggests tablet, OR
  // 2. Screen is large enough (>= 768px in any dimension) and is mobile
  const minDimension    : any = Math.min(window.innerWidth, window.innerHeight);
  const maxDimension    : any = Math.max(window.innerWidth, window.innerHeight);
  const isTabletScreen    : any = (minDimension >= 600 && maxDimension >= 768) || minDimension >= 768;
  
  const isTablet    : any = isMobile && (isTabletUA || isTabletScreen);
  const isPhone    : any = isMobile && !isTablet;
  
  // Detect orientation
  const orientation: 'portrait' | 'landscape'    : any = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  
  // All mobile devices (phones and tablets) should be in landscape mode for MTG Arena experience
  const requiresRotation    : any = isMobile && orientation === 'portrait';
  
  // Detect OS
  let os = 'unknown';
  if (userAgent.includes('android')) os = 'android';
  else if (userAgent.includes('iphone') || userAgent.includes('ipad')) os = 'ios';
  else if (userAgent.includes('mac')) os = 'macos';
  else if (userAgent.includes('win')) os = 'windows';
  else if (userAgent.includes('linux')) os = 'linux';
  
  // Detect browser
  let browser = 'unknown';
  if (userAgent.includes('chrome')) browser = 'chrome';
  else if (userAgent.includes('firefox')) browser = 'firefox';
  else if (userAgent.includes('safari')) browser = 'safari';
  else if (userAgent.includes('edge')) browser = 'edge';
  
  return {
    isMobile,
    isDesktop: !isMobile,
    isTablet,
    isPhone,
    platform: isMobile ? 'mobile' : 'desktop',
    os,
    browser,
    orientation,
    requiresRotation
  };
}

interface ZoneConfig {
  position: { x: number; y: number };
  size: { width: number; height: number };
  cardSpacing?: number;
  maxRows?: number;
  overlap?: number;
}

/**
 * Get MTG Arena-specific layout configuration based on device
 */
export function getMTGArenaLayoutConfig(device: DeviceInfo): any {
  if (device.isMobile) {
    // MTG Arena Mobile layout configuration
    return {
      cardSize: { width: 85, height: 119 }, // Smaller cards for mobile
      handCardSize: { width: 65, height: 91 },
      zones: {
        battlefield: { 
          position: { x: 5, y: 55 }, 
          size: { width: 90, height: 25 },
          cardSpacing: 8,
          maxRows: 2
        } as ZoneConfig,
        hand: { 
          position: { x: 5, y: 85 }, 
          size: { width: 90, height: 12 },
          cardSpacing: 4,
          overlap: 0.6 // Cards overlap in mobile hand
        } as ZoneConfig,
        library: { 
          position: { x: 82, y: 60 }, 
          size: { width: 15, height: 20 } 
        } as ZoneConfig,
        graveyard: { 
          position: { x: 3, y: 60 }, 
          size: { width: 15, height: 20 } 
        } as ZoneConfig,
        exile: { 
          position: { x: 82, y: 35 }, 
          size: { width: 15, height: 15 } 
        } as ZoneConfig,
        stack: { 
          position: { x: 42, y: 45 }, 
          size: { width: 16, height: 10 } 
        } as ZoneConfig
      },
      ui: {
        lifeCounter: { size: 'large', position: 'bottom-left' },
        manaPool: { size: 'medium', position: 'bottom-center' },
        phaseIndicator: { size: 'small', position: 'top-center' },
        buttons: { size: 'large', spacing: 'compact' }
      },
      interactions: {
        tapToSelect: true,
        longPressForMenu: true,
        swipeGestures: true,
        zoomOnSelect: 1.5
      }
    };
  } else {
    // MTG Arena Desktop layout configuration
    return {
      cardSize: { width: 120, height: 168 }, // Standard desktop card size
      handCardSize: { width: 100, height: 140 },
      zones: {
        battlefield: { 
          position: { x: 20, y: 55 }, 
          size: { width: 60, height: 25 },
          cardSpacing: 12,
          maxRows: 3
        } as ZoneConfig,
        hand: { 
          position: { x: 15, y: 85 }, 
          size: { width: 70, height: 12 },
          cardSpacing: 8,
          overlap: 0.8 // Less overlap in desktop hand
        } as ZoneConfig,
        library: { 
          position: { x: 85, y: 60 }, 
          size: { width: 12, height: 15 } 
        } as ZoneConfig,
        graveyard: { 
          position: { x: 3, y: 60 }, 
          size: { width: 12, height: 15 } 
        } as ZoneConfig,
        exile: { 
          position: { x: 88, y: 45 }, 
          size: { width: 9, height: 10 } 
        } as ZoneConfig,
        stack: { 
          position: { x: 45, y: 45 }, 
          size: { width: 10, height: 10 } 
        } as ZoneConfig
      },
      ui: {
        lifeCounter: { size: 'medium', position: 'bottom-left' },
        manaPool: { size: 'small', position: 'bottom-right' },
        phaseIndicator: { size: 'medium', position: 'top-center' },
        buttons: { size: 'medium', spacing: 'normal' }
      },
      interactions: {
        tapToSelect: false,
        longPressForMenu: false,
        swipeGestures: false,
        zoomOnSelect: 1.1
      }
    };
  }
}