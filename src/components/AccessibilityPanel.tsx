import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define accessibility settings interface
export interface AccessibilitySettings {
  fontFamily: 'default' | 'opendyslexic' | 'arial' | 'comic-sans';
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  contrast: 'default' | 'high-contrast' | 'dark' | 'light';
  animations: 'default' | 'reduced' | 'none';
  lineSpacing: 'default' | 'increased' | 'double';
  letterSpacing: 'default' | 'increased' | 'wide';
  screenReader: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  focusIndicators: boolean;
  textToSpeech: boolean;
}

// Default settings
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

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  // Get settings from localStorage or use defaults
  const getInitialSettings = (): AccessibilitySettings => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse accessibility settings', e);
      }
    }
    return defaultSettings;
  };

  const [settings, setSettings] = useState<AccessibilitySettings>(getInitialSettings);
  const [activeTab, setActiveTab] = useState<'text' | 'visual' | 'motion' | 'cognitive'>('text');

  // Apply settings to document when they change
  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Apply font family
    let fontFamily = '';
    switch (settings.fontFamily) {
      case 'opendyslexic':
        fontFamily = '"OpenDyslexic", sans-serif';
        break;
      case 'arial':
        fontFamily = 'Arial, sans-serif';
        break;
      case 'comic-sans':
        fontFamily = '"Comic Sans MS", cursive';
        break;
      default:
        fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    }
    document.documentElement.style.setProperty('--font-family', fontFamily);

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
      case 'dark':
        bgColor = '#121212';
        textColor = '#ffffff';
        accentColor = '#d4af37';
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

    // Initialize screen reader if enabled
    if (settings.screenReader) {
      // This would typically integrate with a screen reader API
      console.log('Screen reader enabled');
    }

    // Initialize text-to-speech if enabled
    if (settings.textToSpeech) {
      // This would typically set up text-to-speech functionality
      console.log('Text-to-speech enabled');
    }
  }, [settings]);

  // Handle setting changes
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  // Render color blind filters (SVG filters)
  const renderColorBlindFilters = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
      <defs>
        {/* Protanopia (red-blind) */}
        <filter id="protanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.567, 0.433, 0, 0, 0
                    0.558, 0.442, 0, 0, 0
                    0, 0.242, 0.758, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        
        {/* Deuteranopia (green-blind) */}
        <filter id="deuteranopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.625, 0.375, 0, 0, 0
                    0.7, 0.3, 0, 0, 0
                    0, 0.3, 0.7, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        
        {/* Tritanopia (blue-blind) */}
        <filter id="tritanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.95, 0.05, 0, 0, 0
                    0, 0.433, 0.567, 0, 0
                    0, 0.475, 0.525, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
      </defs>
    </svg>
  );

  return (
    <>
      {renderColorBlindFilters()}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              zIndex: 2000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                backgroundColor: 'var(--bg-color, #1a1a1a)',
                color: 'var(--text-color, white)',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                fontFamily: 'var(--font-family)'
              }}
            >
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, color: 'var(--accent-color, #d4af37)' }}>Accessibility Settings</h2>
                  <button
                    onClick={onClose}
                    aria-label="Close accessibility panel"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-color, white)',
                      fontSize: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #333', marginBottom: '20px' }}>
                  {[
                    { id: 'text', label: 'Text' },
                    { id: 'visual', label: 'Visual' },
                    { id: 'motion', label: 'Motion' },
                    { id: 'cognitive', label: 'Cognitive' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      aria-selected={activeTab === tab.id}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === tab.id ? `3px solid var(--accent-color, #d4af37)` : '3px solid transparent',
                        color: activeTab === tab.id ? 'var(--accent-color, #d4af37)' : 'var(--text-color, white)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 'inherit'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Text Settings */}
                {activeTab === 'text' && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Font Family
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { id: 'default', label: 'Default' },
                          { id: 'opendyslexic', label: 'OpenDyslexic' },
                          { id: 'arial', label: 'Arial' },
                          { id: 'comic-sans', label: 'Comic Sans' }
                        ].map(font => (
                          <button
                            key={font.id}
                            onClick={() => updateSetting('fontFamily', font.id as any)}
                            aria-pressed={settings.fontFamily === font.id}
                            style={{
                              padding: '10px 15px',
                              border: `2px solid ${settings.fontFamily === font.id ? 'var(--accent-color, #d4af37)' : '#333'}`,
                              borderRadius: '5px',
                              background: settings.fontFamily === font.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: 'var(--text-color, white)',
                              cursor: 'pointer',
                              fontFamily: font.id === 'opendyslexic' ? 'OpenDyslexic, sans-serif' : 
                                         font.id === 'arial' ? 'Arial, sans-serif' : 
                                         font.id === 'comic-sans' ? '"Comic Sans MS", cursive' : 'inherit'
                            }}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Font Size
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { id: 'small', label: 'Small' },
                          { id: 'medium', label: 'Medium' },
                          { id: 'large', label: 'Large' },
                          { id: 'x-large', label: 'Extra Large' }
                        ].map(size => (
                          <button
                            key={size.id}
                            onClick={() => updateSetting('fontSize', size.id as any)}
                            aria-pressed={settings.fontSize === size.id}
                            style={{
                              padding: '10px 15px',
                              border: `2px solid ${settings.fontSize === size.id ? 'var(--accent-color, #d4af37)' : '#333'}`,
                              borderRadius: '5px',
                              background: settings.fontSize === size.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: 'var(--text-color, white)',
                              cursor: 'pointer',
                              fontSize: size.id === 'small' ? '0.9rem' : 
                                       size.id === 'medium' ? '1rem' : 
                                       size.id === 'large' ? '1.2rem' : '1.4rem'
                            }}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Line Spacing
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { id: 'default', label: 'Default' },
                          { id: 'increased', label: 'Increased' },
                          { id: 'double', label: 'Double' }
                        ].map(spacing => (
                          <button
                            key={spacing.id}
                            onClick={() => updateSetting('lineSpacing', spacing.id as any)}
                            aria-pressed={settings.lineSpacing === spacing.id}
                            style={{
                              padding: '10px 15px',
                              border: `2px solid ${settings.lineSpacing === spacing.id ? 'var(--accent-color, #d4af37)' : '#333'}`,
                              borderRadius: '5px',
                              background: settings.lineSpacing === spacing.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: 'var(--text-color, white)',
                              cursor: 'pointer',
                              lineHeight: spacing.id === 'default' ? '1.5' : 
                                          spacing.id === 'increased' ? '1.8' : '2.2'
                            }}
                          >
                            {spacing.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Letter Spacing
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { id: 'default', label: 'Default' },
                          { id: 'increased', label: 'Increased' },
                          { id: 'wide', label: 'Wide' }
                        ].map(spacing => (
                          <button
                            key={spacing.id}
                            onClick={() => updateSetting('letterSpacing', spacing.id as any)}
                            aria-pressed={settings.letterSpacing === spacing.id}
                            style={{
                              padding: '10px 15px',
                              border: `2px solid ${settings.letterSpacing === spacing.id ? 'var(--accent-color, #d4af37)' : '#333'}`,
                              borderRadius: '5px',
                              background: settings.letterSpacing === spacing.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: 'var(--text-color, white)',
                              cursor: 'pointer',
                              letterSpacing: spacing.id === 'default' ? 'normal' : 
                                             spacing.id === 'increased' ? '0.05em' : '0.1em'
                            }}
                          >
                            {spacing.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual Settings */}
                {activeTab === 'visual' && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Contrast
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { id: 'default', label: 'Default' },
                          { id: 'high-contrast', label: 'High Contrast' },
                          { id: 'dark', label: 'Dark' },
                          { id: 'light', label: 'Light' }
                        ].map(contrast => (
                          <button
                            key={contrast.id}
                            onClick={() => updateSetting('contrast', contrast.id as any)}
                            aria-pressed={settings.contrast === contrast.id}
                            style={{
                              padding: '10px 15px',
                              border: `2px solid ${settings.contrast === contrast.id ? 'var(--accent-color, #d4af37)' : '#333'}`,
                              borderRadius: '5px',
                              background: settings.contrast === contrast.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: 'var(--text-color, white)',
                              cursor: 'pointer'
                            }}
                          >
                            {contrast.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Color Blind Mode
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { id: 'none', label: 'None' },
                          { id: 'protanopia', label: 'Protanopia (Red-Blind)' },
                          { id: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
                          { id: 'tritanopia', label: 'Tritanopia (Blue-Blind)' }
                        ].map(mode => (
                          <button
                            key={mode.id}
                            onClick={() => updateSetting('colorBlindMode', mode.id as any)}
                            aria-pressed={settings.colorBlindMode === mode.id}
                            style={{
                              padding: '10px 15px',
                              border: `2px solid ${settings.colorBlindMode === mode.id ? 'var(--accent-color, #d4af37)' : '#333'}`,
                              borderRadius: '5px',
                              background: settings.colorBlindMode === mode.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: 'var(--text-color, white)',
                              cursor: 'pointer'
                            }}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={settings.focusIndicators}
                          onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
                          style={{ width: '20px', height: '20px' }}
                        />
                        <span>Enhanced Focus Indicators</span>
                      </label>
                      <p style={{ margin: '5px 0 0 30px', color: '#999', fontSize: '0.9em' }}>
                        Makes it easier to see which element is currently focused when using keyboard navigation
                      </p>
                    </div>
                  </div>
                )}

                {/* Motion Settings */}
                {activeTab === 'motion' && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Animations
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { id: 'default', label: 'Default' },
                          { id: 'reduced', label: 'Reduced' },
                          { id: 'none', label: 'None' }
                        ].map(animation => (
                          <button
                            key={animation.id}
                            onClick={() => updateSetting('animations', animation.id as any)}
                            aria-pressed={settings.animations === animation.id}
                            style={{
                              padding: '10px 15px',
                              border: `2px solid ${settings.animations === animation.id ? 'var(--accent-color, #d4af37)' : '#333'}`,
                              borderRadius: '5px',
                              background: settings.animations === animation.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              color: 'var(--text-color, white)',
                              cursor: 'pointer'
                            }}
                          >
                            {animation.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cognitive Settings */}
                {activeTab === 'cognitive' && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={settings.screenReader}
                          onChange={(e) => updateSetting('screenReader', e.target.checked)}
                          style={{ width: '20px', height: '20px' }}
                        />
                        <span>Screen Reader Support</span>
                      </label>
                      <p style={{ margin: '5px 0 0 30px', color: '#999', fontSize: '0.9em' }}>
                        Enhances compatibility with screen readers
                      </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={settings.textToSpeech}
                          onChange={(e) => updateSetting('textToSpeech', e.target.checked)}
                          style={{ width: '20px', height: '20px' }}
                        />
                        <span>Text-to-Speech</span>
                      </label>
                      <p style={{ margin: '5px 0 0 30px', color: '#999', fontSize: '0.9em' }}>
                        Enables text-to-speech functionality for selected text
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={resetToDefaults}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      border: '1px solid #666',
                      borderRadius: '5px',
                      color: 'var(--text-color, white)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 'inherit'
                    }}
                  >
                    Reset to Defaults
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'var(--accent-color, #d4af37)',
                      border: 'none',
                      borderRadius: '5px',
                      color: '#000',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      fontWeight: 'bold'
                    }}
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityPanel;