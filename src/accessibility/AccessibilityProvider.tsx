/**
 * Accessibility Provider
 * 
 * Provides accessibility settings and features throughout the application.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'extra-high';
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  audioDescriptions: boolean;
  captions: boolean;
  language: string;
  interfaceComplexity: 'simple' | 'standard' | 'advanced';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  applySettings: () => void;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

// Default settings
const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  contrast: 'normal',
  colorBlindness: 'none',
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusIndicators: true,
  audioDescriptions: false,
  captions: false,
  language: 'en',
  interfaceComplexity: 'standard',
};

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/**
 * Accessibility Provider Component
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    } catch (error) {
      console.warn('Failed to load accessibility settings from localStorage:', error);
      return defaultSettings;
    }
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
      applySettings();
    } catch (error) {
      console.warn('Failed to save accessibility settings to localStorage:', error);
    }
  }, [settings]);

  // Apply settings to the document
  const applySettings = (): void => {
    const root = document.documentElement;

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px',
    };
    root.style.fontSize = fontSizeMap[settings.fontSize];

    // Apply contrast
    if (settings.contrast === 'high') {
      root.classList.add('high-contrast');
      root.classList.remove('extra-high-contrast');
    } else if (settings.contrast === 'extra-high') {
      root.classList.add('extra-high-contrast');
      root.classList.remove('high-contrast');
    } else {
      root.classList.remove('high-contrast', 'extra-high-contrast');
    }

    // Apply color blindness filters
    const colorBlindnessMap = {
      none: 'none',
      protanopia: 'url(#protanopia-filter)',
      deuteranopia: 'url(#deuteranopia-filter)',
      tritanopia: 'url(#tritanopia-filter)',
    };
    root.style.filter = colorBlindnessMap[settings.colorBlindness];

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Apply screen reader optimizations
    if (settings.screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Apply focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Apply interface complexity
    root.setAttribute('data-interface-complexity', settings.interfaceComplexity);

    // Set language
    root.setAttribute('lang', settings.language);
  };

  // Update a specific setting
  const updateSetting = (key: keyof AccessibilitySettings, value: any): void => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Reset all settings to defaults
  const resetSettings = (): void => {
    setSettings(defaultSettings);
  };

  // Apply settings on mount
  useEffect(() => {
    applySettings();
  }, []);

  const value: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    applySettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook to use accessibility context
 */
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;