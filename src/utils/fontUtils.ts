/**
 * Font loading and detection utilities
 */

export interface FontInfo {
  name: string;
  isLoaded: boolean;
  fallback: string;
}

/**
 * Check if a font is available/loaded
 */
export function isFontLoaded(fontFamily: string): boolean {
  // Create a test element
  const testElement = document.createElement('span');
  testElement.style.fontFamily = fontFamily;
  testElement.style.fontSize = '72px';
  testElement.style.position = 'absolute';
  testElement.style.left = '-9999px';
  testElement.style.top = '-9999px';
  testElement.style.visibility = 'hidden';
  testElement.textContent = 'mmmmmmmmmmlli';

  document.body.appendChild(testElement);

  // Get the width with the test font
  const testWidth = testElement.offsetWidth;

  // Test against a known fallback font
  testElement.style.fontFamily = 'monospace';
  const fallbackWidth = testElement.offsetWidth;

  document.body.removeChild(testElement);

  // If widths are different, the font is likely loaded
  return testWidth !== fallbackWidth;
}

/**
 * Get font loading status for all accessibility fonts
 */
export function getFontLoadingStatus(): FontInfo[] {
  return [
    {
      name: 'OpenDyslexic',
      isLoaded: isFontLoaded('OpenDyslexic'),
      fallback: 'Comic Sans MS, cursive',
    },
    {
      name: 'Comic Sans MS',
      isLoaded: isFontLoaded('Comic Sans MS'),
      fallback: 'cursive',
    },
    {
      name: 'Arial',
      isLoaded: isFontLoaded('Arial'),
      fallback: 'sans-serif',
    },
    {
      name: 'Inter',
      isLoaded: isFontLoaded('Inter'),
      fallback: 'sans-serif',
    },
  ];
}

/**
 * Wait for fonts to load and return a promise
 */
export function waitForFontsToLoad(
  timeout: number = 3000,
): Promise<FontInfo[]> {
  return new Promise(resolve => {
    const startTime = Date.now();

    const checkFonts = () => {
      const fontStatus = getFontLoadingStatus();
      const allCriticalFontsLoaded = fontStatus.some(
        font =>
          (font.name === 'OpenDyslexic' || font.name === 'Comic Sans MS') &&
          font.isLoaded,
      );

      if (allCriticalFontsLoaded || Date.now() - startTime > timeout) {
        resolve(fontStatus);
      } else {
        setTimeout(checkFonts, 100);
      }
    };

    checkFonts();
  });
}

/**
 * Log font loading status to console
 */
export function logFontStatus(): void {
  const fontStatus = getFontLoadingStatus();
  console.group('🔤 Font Loading Status');
  fontStatus.forEach(font => {
    console.log(
      `${font.isLoaded ? '✅' : '❌'} ${font.name}: ${font.isLoaded ? 'Loaded' : 'Not loaded'}`,
    );
  });
  console.groupEnd();
}

/**
 * Apply font with proper fallbacks and logging
 */
export function applyFontFamily(fontType: string): string {
  let fontFamily = '';

  switch (fontType) {
    case 'arial':
      fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
      break;
    case 'comic-sans':
      fontFamily =
        '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive, sans-serif';
      break;
    default:
      fontFamily =
        '"OpenDyslexic", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
  }

  document.documentElement.style.setProperty('--font-family', fontFamily);

  // Log the change
  console.log(`🔤 Font changed to: ${fontType} (${fontFamily})`);

  // Check if the font is actually loaded
  setTimeout(() => {
    const primaryFont = fontFamily.split(',')[0].replace(/"/g, '');
    const isLoaded = isFontLoaded(primaryFont);
    console.log(
      `🔤 Font "${primaryFont}" ${isLoaded ? 'is loaded' : 'failed to load, using fallback'}`,
    );
  }, 100);

  return fontFamily;
}
