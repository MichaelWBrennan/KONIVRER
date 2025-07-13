import { useEffect } from 'react';
import { applyFontFamily, logFontStatus, waitForFontsToLoad } from '../utils/fontUtils';

export interface AccessibilitySettings {
  fontFamily: 'default' | 'arial' | 'comic-sans';
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  contrast: 'default' | 'high-contrast' | 'light';
  animations: 'default' | 'reduced' | 'none';
  lineSpacing: 'default' | 'increased' | 'double';
  letterSpacing: 'default' | 'increased' | 'wide';
  screenReader: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  focusIndicators: boolean;
  textToSpeech: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontFamily: 'default',
  fontSize: 'medium',
  contrast: 'default',
  animations: 'default',
  lineSpacing: 'default',
  letterSpacing: 'default',
  screenReader: false,
  colorBlindMode: 'none',
  focusIndicators: true,
  textToSpeech: false
};

export const useAccessibilitySettings = () => {
  useEffect(() => {
    // Load and apply accessibility settings on app start
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('accessibility-settings');
      let settings = defaultSettings;
      
      if (savedSettings) {
        try {
          settings = JSON.parse(savedSettings);
        } catch (e) {
          console.error('Failed to parse accessibility settings', e);
        }
      }

      // Apply font family using utility function
      applyFontFamily(settings.fontFamily);

      // Apply font size
      let fontSize = '';
      switch (settings.fontSize) {
        case 'small':
          fontSize = '0.9rem';
          break;
        case 'medium':
          fontSize = '1rem';
          break;
        case 'large':
          fontSize = '1.2rem';
          break;
        case 'x-large':
          fontSize = '1.4rem';
          break;
        default:
          fontSize = '1rem';
      }
      document.documentElement.style.setProperty('--font-size-base', fontSize);

      // Apply contrast
      let bgColor = '';
      let textColor = '';
      let accentColor = '';
      switch (settings.contrast) {
        case 'high-contrast':
          bgColor = '#000000';
          textColor = '#ffffff';
          accentColor = '#ffff00';
          break;
        case 'light':
          bgColor = '#ffffff';
          textColor = '#000000';
          accentColor = '#0066cc';
          break;
        default:
          bgColor = '#121212';
          textColor = '#ffffff';
          accentColor = '#d4af37';
      }
      document.documentElement.style.setProperty('--bg-color', bgColor);
      document.documentElement.style.setProperty('--text-color', textColor);
      document.documentElement.style.setProperty('--accent-color', accentColor);

      // Apply animations setting
      let animationSpeed = '';
      switch (settings.animations) {
        case 'reduced':
          animationSpeed = '0.5';
          break;
        case 'none':
          animationSpeed = '0';
          break;
        default:
          animationSpeed = '1';
      }
      document.documentElement.style.setProperty('--animation-speed-factor', animationSpeed);

      // Apply line spacing
      let lineHeight = '';
      switch (settings.lineSpacing) {
        case 'increased':
          lineHeight = '1.8';
          break;
        case 'double':
          lineHeight = '2.2';
          break;
        default:
          lineHeight = '1.5';
      }
      document.documentElement.style.setProperty('--line-height', lineHeight);

      // Apply letter spacing
      let letterSpacing = '';
      switch (settings.letterSpacing) {
        case 'increased':
          letterSpacing = '0.05em';
          break;
        case 'wide':
          letterSpacing = '0.1em';
          break;
        default:
          letterSpacing = 'normal';
      }
      document.documentElement.style.setProperty('--letter-spacing', letterSpacing);

      // Apply color blind mode
      let colorFilter = '';
      switch (settings.colorBlindMode) {
        case 'protanopia':
          colorFilter = 'url(#protanopia-filter)';
          break;
        case 'deuteranopia':
          colorFilter = 'url(#deuteranopia-filter)';
          break;
        case 'tritanopia':
          colorFilter = 'url(#tritanopia-filter)';
          break;
        default:
          colorFilter = 'none';
      }
      document.documentElement.style.setProperty('--color-filter', colorFilter);

      // Apply focus indicators
      if (settings.focusIndicators) {
        document.documentElement.classList.add('focus-visible');
      } else {
        document.documentElement.classList.remove('focus-visible');
      }

      console.log('Accessibility settings loaded and applied:', settings);
    };

    // Wait for fonts to load, then apply settings
    waitForFontsToLoad(3000).then(() => {
      logFontStatus();
      loadSettings();
    });
  }, []);
};