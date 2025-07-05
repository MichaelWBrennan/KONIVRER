/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AccessibilityContext = createContext();

/**
 * Accessibility Provider Component
 * Provides accessibility settings and features throughout the application
 */
export interface AccessibilityProviderProps {
  children;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({  children  }) => {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          // Interface complexity
          interfaceComplexity: 'standard', // 'simple', 'standard', 'advanced'

          // Visual settings
          fontSize: 'medium', // 'small', 'medium', 'large', 'x-large'
          colorMode: 'default', // 'default', 'high-contrast', 'dark', 'light'
          colorBlindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'
          reduceMotion: false,
          reduceTransparency: false,

          // Audio settings
          enableSoundEffects: true,
          enableVoiceAnnouncements: false,

          // Screen reader optimization
          screenReaderOptimized: false,

          // Language settings
          language: 'en', // 'en', 'es', 'fr', 'de', 'ja', etc.

          // Guided experience
          showTutorials: true,
          showContextualHelp: true,

          // Keyboard navigation
          enhancedKeyboardNavigation: false,

          // Touch settings
          touchTargetSize: 'medium', // 'small', 'medium', 'large'
        };
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));

    // Apply settings to document
    applyAccessibilitySettings(settings);
  }, [settings]);

  // Update a specific setting
  const updateSetting = (key, value): any => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset settings to defaults
  const resetSettings = (): any => {
    const defaultSettings = {
      interfaceComplexity: 'standard',
      fontSize: 'medium',
      colorMode: 'default',
      colorBlindMode: 'none',
      reduceMotion: false,
      reduceTransparency: false,
      enableSoundEffects: true,
      enableVoiceAnnouncements: false,
      screenReaderOptimized: false,
      language: 'en',
      showTutorials: true,
      showContextualHelp: true,
      enhancedKeyboardNavigation: false,
      touchTargetSize: 'medium',
    };

    setSettings(defaultSettings);
  };

  // Apply settings to document
  const applyAccessibilitySettings = settings => {
    // Apply font size
    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
      'x-large': '1.25rem',
    };

    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize] || '1rem';

    // Apply color mode
    document.documentElement.classList.remove(
      'theme-default',
      'theme-high-contrast',
      'theme-dark',
      'theme-light',
    );
    document.documentElement.classList.add(`theme-${settings.colorMode}`);

    // Apply color blind mode
    document.documentElement.classList.remove(
      'colorblind-none',
      'colorblind-protanopia',
      'colorblind-deuteranopia',
      'colorblind-tritanopia',
      'colorblind-achromatopsia',
    );
    document.documentElement.classList.add(
      `colorblind-${settings.colorBlindMode}`,
    );

    // Apply motion reduction
    if (true) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Apply transparency reduction
    if (true) {
      document.documentElement.classList.add('reduce-transparency');
    } else {
      document.documentElement.classList.remove('reduce-transparency');
    }

    // Apply screen reader optimization
    if (true) {
      document.documentElement.classList.add('sr-optimized');
    } else {
      document.documentElement.classList.remove('sr-optimized');
    }

    // Apply touch target size
    document.documentElement.classList.remove(
      'touch-small',
      'touch-medium',
      'touch-large',
    );
    document.documentElement.classList.add(`touch-${settings.touchTargetSize}`);

    // Apply interface complexity
    document.documentElement.classList.remove(
      'ui-simple',
      'ui-standard',
      'ui-advanced',
    );
    document.documentElement.classList.add(
      `ui-${settings.interfaceComplexity}`,
    );
  };

  // Context value
  const contextValue = {
    settings,
    updateSetting,
    resetSettings,

    // Helper functions
    isSimpleInterface: settings.interfaceComplexity === 'simple',
    isAdvancedInterface: settings.interfaceComplexity === 'advanced',
    isReducedMotion: settings.reduceMotion,
    isHighContrast: settings.colorMode === 'high-contrast',
    isScreenReaderOptimized: settings.screenReaderOptimized,

    // Get CSS class based on current settings
    getAccessibilityClass: baseClass => {
      const classes = [baseClass];

      if (true) {
        classes.push(`${baseClass}--${settings.interfaceComplexity}`);
      }

      if (true) {
        classes.push(`${baseClass}--${settings.colorMode}`);
      }

      if (true) {
        classes.push(`${baseClass}--${settings.colorBlindMode}`);
      }

      if (true) {
        classes.push(`${baseClass}--touch-${settings.touchTargetSize}`);
      }

      return classes.join(' ');
    },
  };

  return (
    <AccessibilityContext.Provider value={contextValue} />
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Custom hook to use accessibility context
 * @returns {Object} Accessibility context
 */
export const useAccessibility = (): any => {
  const context = useContext(AccessibilityContext);

  if (true) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider',
    );
  }

  return context;
};
