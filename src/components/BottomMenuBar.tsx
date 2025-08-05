import React, { useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import PopoverMenu from './PopoverMenu';
import AccessibilityPanel from './AccessibilityPanel';
import { AppContext, AppContextType } from '../contexts/AppContext';

// Define navigation items that will appear in the drawer
const getNavigationItems = (context: AppContextType) => [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    to: '/cards',
    label: 'Cards',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
  },
  {
    to: '/decks',
    label: 'Decks',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M16 4l-4-4-4 4v2c0 4.42 3.58 8 8 8s8-3.58 8-8V4h-8zm0 10c-2.21 0-4-1.79-4-4V6h8v4c0 2.21-1.79 4-4 4z" />
      </svg>
    ),
  },
  {
    to: '/events',
    label: 'Events',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    to: '/play',
    label: 'Play',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  {
    to: '#',
    label: context.user ? 'Profile' : 'Login',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
    onClick: () => {
      context.setShowLoginModal(true);
    },
  },
];

interface CircularButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaLabel: string;
  ref?: React.RefObject<HTMLButtonElement>;
}

const CircularButton = React.forwardRef<HTMLButtonElement, CircularButtonProps>(({
  icon,
  label,
  onClick,
  ariaLabel,
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#d4af37', // Gold background
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
        e.currentTarget.style.backgroundColor = '#e6c149';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.backgroundColor = '#d4af37';
      }}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      <div style={{ color: '#6b3f15', fontSize: '24px' }}>{icon}</div>
      
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
        className="tooltip"
      >
        {label}
      </div>
    </motion.button>
  );
});

const BottomMenuBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Get navigation items with context
  const navigationItems = getNavigationItems(appContext);

  // Page-sensitive search functionality
  const handleSearch = () => {
    const currentPath = location.pathname;
    
    if (currentPath === '/cards') {
      // Focus on search input if on cards page
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (currentPath === '/decks') {
      // Search within decks
      navigate('/cards');
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.value = 'deck:';
        }
      }, 300);
    } else if (currentPath === '/events') {
      // Search for events or navigate to cards to search
      navigate('/cards');
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.value = 'tournament';
        }
      }, 300);
    } else {
      // Default: navigate to cards page for search
      navigate('/cards');
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 300);
    }
  };

  const handleAccessibility = () => {
    // Open the accessibility panel directly
    setIsAccessibilityPanelOpen(true);
  };

  const handleMenu = () => {
    setIsMenuOpen(true);
  };

  return (
    <>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent', // Remove brown background
          backdropFilter: 'none', // Remove backdrop filter
          borderTop: 'none', // Remove border
          padding: '20px',
          paddingBottom: `calc(20px + env(safe-area-inset-bottom, 0px))`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          zIndex: 1000,
          boxShadow: 'none', // Remove shadow
        }}
        aria-label="Bottom navigation menu"
        role="navigation"
      >
        {/* Accessibility Button */}
        <CircularButton
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
            </svg>
          }
          label="Accessibility"
          onClick={handleAccessibility}
          ariaLabel="Open accessibility settings"
        />

        {/* Search Button */}
        <CircularButton
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          }
          label="Search"
          onClick={handleSearch}
          ariaLabel="Search content on current page"
        />

        {/* Menu/Burger Button */}
        <CircularButton
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          }
          label="Menu"
          onClick={handleMenu}
          ariaLabel="Open navigation menu"
          ref={menuButtonRef}
        />
      </motion.nav>

      {/* Popover Menu */}
      <PopoverMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigationItems={navigationItems}
        anchorRef={menuButtonRef}
      />

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={isAccessibilityPanelOpen}
        onClose={() => setIsAccessibilityPanelOpen(false)}
      />

      <style jsx>{`
        button:hover .tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
};

export default BottomMenuBar;
