/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Enhanced Font Loading Utility
 * Specialized for OpenDyslexic font with ancient and esoteric theme
 */

// Check if a specific font is loaded
export const checkFontLoaded = fontFamily => {
  if (!document.fonts) {
    return Promise.resolve(false);
  }

  return document.fonts.ready.then(() => {
    const testString = 'abcdefghijklmnopqrstuvwxyz';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Test with fallback font
    context.font = '16px Arial';
    const fallbackWidth = context.measureText(testString).width;

    // Test with target font
    context.font = `16px ${fontFamily}, Arial`;
    const targetWidth = context.measureText(testString).width;

    // If widths are different, the font is loaded
    return fallbackWidth !== targetWidth;
  });
};

// Wait for a font to load with timeout
export const waitForFont = (fontFamily, timeout = 3000) => {
  return new Promise(resolve => {
    const startTime = Date.now();

    const checkFont = () => {
      checkFontLoaded(fontFamily).then(loaded => {
        if (loaded) {
          resolve(true);
        } else if (Date.now() - startTime < timeout) {
          setTimeout(checkFont, 100);
        } else {
          resolve(false);
        }
      });
    };

    checkFont();
  });
};

// Preload OpenDyslexic fonts
export const preloadOpenDyslexicFonts = () => {
  const fontPaths = [
    '/fonts/OpenDyslexic-Regular.woff2',
    '/fonts/OpenDyslexic-Bold.woff2'
  ];
  
  fontPaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = path;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Initialize OpenDyslexic font loading
export const initOpenDyslexic = () => {
  // Add loading class to document
  document.documentElement.classList.add('fonts-loading');
  
  // Preload fonts
  preloadOpenDyslexicFonts();
  
  // Wait for OpenDyslexic to load
  waitForFont('OpenDyslexic', 5000).then(loaded => {
    if (loaded) {
      console.log('OpenDyslexic font loaded successfully');
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
    } else {
      console.warn('OpenDyslexic font may not have loaded properly, using fallback');
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-fallback');
      
      // Force apply OpenDyslexic anyway
      document.body.style.fontFamily = "'OpenDyslexic', 'Inter', sans-serif";
    }
    
    // Add ancient theme class
    document.documentElement.classList.add('ancient-theme');
  });
  
  // Verify font usage after a delay
  setTimeout(() => {
    const bodyFont = window.getComputedStyle(document.body).fontFamily;
    const isOpenDyslexicActive = bodyFont.toLowerCase().includes('opendyslexic');
    
    if (!isOpenDyslexicActive) {
      console.warn('OpenDyslexic font may not be applied correctly. Current font:', bodyFont);
      
      // Force apply OpenDyslexic
      document.body.style.fontFamily = "'OpenDyslexic', " + bodyFont;
      console.log('Forced OpenDyslexic font application');
    } else {
      console.log('OpenDyslexic font is correctly applied');
    }
  }, 2000);
};
