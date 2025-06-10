// Font loading utility
export const checkFontLoaded = (fontFamily) => {
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

export const waitForFont = (fontFamily, timeout = 3000) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkFont = () => {
      checkFontLoaded(fontFamily).then((loaded) => {
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