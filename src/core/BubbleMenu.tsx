import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ContextualSearchBar from './ContextualSearchBar';
import './BubbleMenu.css';

interface BubbleMenuProps {
  user?: any;
  onLoginClick?: () => void;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ user, onLoginClick }) => {
  const location = useLocation();
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    };

    if (activePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopup]);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePopup(null);
      }
    };

    if (activePopup) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activePopup]);

  const togglePopup = (popupName: string) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const toggleAccessibilitySetting = (setting: keyof typeof accessibilitySettings) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Apply accessibility changes to document
    const body = document.body;
    const newValue = !accessibilitySettings[setting];
    
    switch (setting) {
      case 'highContrast':
        if (newValue) {
          body.classList.add('high-contrast');
        } else {
          body.classList.remove('high-contrast');
        }
        break;
      case 'largeText':
        if (newValue) {
          body.classList.add('large-text');
        } else {
          body.classList.remove('large-text');
        }
        break;
      case 'reducedMotion':
        if (newValue) {
          body.classList.add('reduced-motion');
        } else {
          body.classList.remove('reduced-motion');
        }
        break;
    }
  };

  // Navigation links for burger menu
  const navigationLinks = [
    { to: '/', label: 'Home', icon: '🏠', description: 'Return to main page' },
    { to: '/cards', label: 'Cards', icon: '🃏', description: 'Browse mystical cards' },
    { to: '/decks', label: 'Decks', icon: '📚', description: 'Manage your decks' },
    { to: '/events', label: 'Events', icon: '🏆', description: 'Join tournaments' },
    { to: '/play', label: 'Play', icon: '⚔️', description: 'Start a game' },
  ];

  // Add login/profile link
  if (user) {
    navigationLinks.push({
      to: '/profile',
      label: 'Profile',
      icon: '👤',
      description: 'View your profile'
    });
  } else {
    navigationLinks.push({
      to: '#',
      label: 'Login',
      icon: '🔑',
      description: 'Sign in to your account'
    });
  }

  return (
    <div ref={menuRef} className="bubble-menu">
      {/* Accessibility Bubble */}
      <div className="bubble-container">
        <motion.div
          className={`bubble ${activePopup === 'accessibility' ? 'active' : ''}`}
          onClick={() => togglePopup('accessibility')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          tabIndex={0}
          aria-label="Accessibility settings"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              togglePopup('accessibility');
            }
          }}
        >
          ♿
        </motion.div>
        
        <AnimatePresence>
          {activePopup === 'accessibility' && (
            <motion.div
              className="popup visible"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="popup-header">
                <span className="popup-title">Accessibility</span>
              </div>
              <div className="popup-content">
                <div className="accessibility-controls">
                  <div className="accessibility-control">
                    <label htmlFor="high-contrast">High Contrast</label>
                    <div
                      className={`accessibility-toggle ${accessibilitySettings.highContrast ? 'active' : ''}`}
                      onClick={() => toggleAccessibilitySetting('highContrast')}
                      role="switch"
                      aria-checked={accessibilitySettings.highContrast}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleAccessibilitySetting('highContrast');
                        }
                      }}
                    />
                  </div>
                  
                  <div className="accessibility-control">
                    <label htmlFor="large-text">Large Text</label>
                    <div
                      className={`accessibility-toggle ${accessibilitySettings.largeText ? 'active' : ''}`}
                      onClick={() => toggleAccessibilitySetting('largeText')}
                      role="switch"
                      aria-checked={accessibilitySettings.largeText}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleAccessibilitySetting('largeText');
                        }
                      }}
                    />
                  </div>
                  
                  <div className="accessibility-control">
                    <label htmlFor="reduced-motion">Reduced Motion</label>
                    <div
                      className={`accessibility-toggle ${accessibilitySettings.reducedMotion ? 'active' : ''}`}
                      onClick={() => toggleAccessibilitySetting('reducedMotion')}
                      role="switch"
                      aria-checked={accessibilitySettings.reducedMotion}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleAccessibilitySetting('reducedMotion');
                        }
                      }}
                    />
                  </div>
                  
                  <div className="accessibility-control">
                    <label htmlFor="screen-reader">Screen Reader Mode</label>
                    <div
                      className={`accessibility-toggle ${accessibilitySettings.screenReader ? 'active' : ''}`}
                      onClick={() => toggleAccessibilitySetting('screenReader')}
                      role="switch"
                      aria-checked={accessibilitySettings.screenReader}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleAccessibilitySetting('screenReader');
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '15px', 
                  fontSize: '12px', 
                  color: '#888',
                  fontStyle: 'italic'
                }}>
                  More accessibility features coming soon
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Bubble */}
      <div className="bubble-container">
        <motion.div
          className={`bubble ${activePopup === 'search' ? 'active' : ''}`}
          onClick={() => togglePopup('search')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          tabIndex={0}
          aria-label="Context-sensitive search"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              togglePopup('search');
            }
          }}
        >
          🔍
        </motion.div>
        
        <AnimatePresence>
          {activePopup === 'search' && (
            <motion.div
              className="popup visible"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="popup-header">
                <span className="popup-title">Search</span>
              </div>
              <div className="popup-content">
                <ContextualSearchBar
                  isVisible={true}
                  onClose={closePopup}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Burger Bubble */}
      <div className="bubble-container">
        <motion.div
          className={`bubble ${activePopup === 'navigation' ? 'active' : ''}`}
          onClick={() => togglePopup('navigation')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          tabIndex={0}
          aria-label="Navigation menu"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              togglePopup('navigation');
            }
          }}
        >
          ☰
        </motion.div>
        
        <AnimatePresence>
          {activePopup === 'navigation' && (
            <motion.div
              className="popup visible"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="popup-header">
                <span className="popup-title">Navigation</span>
              </div>
              <div className="popup-content">
                <div className="nav-links">
                  {navigationLinks.map((link) => (
                    link.to === '#' ? (
                      <button
                        key={link.label}
                        className="nav-link"
                        onClick={() => {
                          if (onLoginClick) {
                            onLoginClick();
                          }
                          closePopup();
                        }}
                        aria-label={link.description}
                      >
                        <span className="nav-link-icon">{link.icon}</span>
                        <span>{link.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                        onClick={closePopup}
                        aria-label={link.description}
                      >
                        <span className="nav-link-icon">{link.icon}</span>
                        <span>{link.label}</span>
                      </Link>
                    )
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BubbleMenu;