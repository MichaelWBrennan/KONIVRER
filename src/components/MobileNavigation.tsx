import React, { useState, useEffect } from 'react';
import './MobileNavigation.css';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

interface MobileNavigationProps {
  items: NavigationItem[];
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  currentPath = '/',
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide navigation on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    onNavigate?.(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={`mobile-topbar ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="mobile-topbar-content">
          <div className="mobile-logo">
            <span className="logo-text">KONIVRER</span>
          </div>
          
          <button 
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <h2>KONIVRER</h2>
            <button 
              className="mobile-menu-close"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          
          <nav className="mobile-menu-nav">
            {items.map((item) => (
              <button
                key={item.id}
                className={`mobile-nav-item ${currentPath === item.path ? 'active' : ''}`}
                onClick={() => handleNavigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>
          
          <div className="mobile-menu-footer">
            <div className="menu-footer-text">
              Trading Card Game Platform
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (for key functions) */}
      <div className={`mobile-bottom-nav ${isVisible ? 'visible' : 'hidden'}`}>
        {items.slice(0, 4).map((item) => (
          <button
            key={item.id}
            className={`bottom-nav-item ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => handleNavigate(item.path)}
            aria-label={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="bottom-nav-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default MobileNavigation;