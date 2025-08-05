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

const CircularButton = React.forwardRef<HTMLButtonElement, CircularButtonProps>(
  ({ icon, label, onClick, ariaLabel }, ref) => {
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
          e.currentTarget.style.boxShadow =
            '0 6px 20px rgba(212, 175, 55, 0.4)';
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
  },
);

const BottomMenuBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] =
    useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Get navigation items with context
  const navigationItems = getNavigationItems(appContext);

  // Page-sensitive search functionality
  const handleSearch = () => {
    const currentPath = location.pathname;

    if (currentPath === '/') {
      // Home page - search blog posts
      const blogSections = document.querySelectorAll(
        '[data-search-type="blog"]',
      );
      if (blogSections.length > 0) {
        blogSections[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      // Show a subtle notification about blog search
      console.log('Blog search: Scrolled to blog section');
    } else if (currentPath === '/cards') {
      // Cards page - implement smart card search
      handleCardSearch();
    } else if (currentPath === '/decks') {
      // Decks page - implement deck search
      handleDeckSearch();
    } else if (currentPath === '/events') {
      // Events page - implement event search
      handleEventSearch();
    } else if (currentPath === '/play') {
      // Play page - search for game modes
      const gameElements = document.querySelectorAll(
        '[data-search-type="game"]',
      );
      if (gameElements.length > 0) {
        gameElements[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    } else {
      // Default fallback - navigate to cards page for general search
      navigate('/cards');
      setTimeout(() => {
        handleCardSearch();
      }, 300);
    }
  };

  // Improved card search functionality
  const handleCardSearch = () => {
    // Show a search overlay or modal for cards
    showSearchOverlay('cards');
  };

  // Improved deck search functionality
  const handleDeckSearch = () => {
    // For now, if no decks are present, navigate to cards page for deck-building search
    const deckElements = document.querySelectorAll('[data-search-type="deck"]');
    if (deckElements.length === 0) {
      // No decks to search, go to cards page for deck building
      navigate('/cards');
      setTimeout(() => {
        showSearchOverlay('deck-building');
      }, 300);
    } else {
      // Search within existing decks
      showSearchOverlay('decks');
    }
  };

  // Improved event search functionality
  const handleEventSearch = () => {
    showSearchOverlay('events');
  };

  // Show search overlay (simplified implementation)
  const showSearchOverlay = (searchType: string) => {
    // Create a simple search interface
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
    `;

    const searchBox = document.createElement('div');
    searchBox.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #d4af37;
      border-radius: 12px;
      padding: 30px;
      max-width: 500px;
      width: 90%;
      position: relative;
    `;

    const title = document.createElement('h3');
    title.style.cssText = `
      color: #d4af37;
      margin: 0 0 20px 0;
      text-align: center;
      font-size: 18px;
    `;
    title.textContent = getSearchTitle(searchType);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = getSearchPlaceholder(searchType);
    input.style.cssText = `
      width: 100%;
      padding: 12px;
      border: 1px solid #d4af37;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 16px;
      margin-bottom: 20px;
      box-sizing: border-box;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    `;

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.style.cssText = `
      background: #d4af37;
      color: black;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    `;

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      background: transparent;
      color: #ccc;
      border: 1px solid #666;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    `;

    // Event handlers
    const closeOverlay = () => {
      document.body.removeChild(overlay);
    };

    const performSearch = () => {
      const searchTerm = input.value.trim();
      if (searchTerm) {
        handleSearchExecution(searchType, searchTerm);
      }
      closeOverlay();
    };

    searchButton.onclick = performSearch;
    cancelButton.onclick = closeOverlay;
    overlay.onclick = e => {
      if (e.target === overlay) closeOverlay();
    };

    input.onkeydown = e => {
      if (e.key === 'Enter') performSearch();
      if (e.key === 'Escape') closeOverlay();
    };

    // Assemble the overlay
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(searchButton);
    searchBox.appendChild(title);
    searchBox.appendChild(input);
    searchBox.appendChild(buttonContainer);
    overlay.appendChild(searchBox);
    document.body.appendChild(overlay);

    // Focus the input
    setTimeout(() => input.focus(), 100);
  };

  const getSearchTitle = (searchType: string) => {
    switch (searchType) {
      case 'cards':
        return 'Search Cards';
      case 'deck-building':
        return 'Search Cards for Deck Building';
      case 'decks':
        return 'Search Decks';
      case 'events':
        return 'Search Events';
      default:
        return 'Search';
    }
  };

  const getSearchPlaceholder = (searchType: string) => {
    switch (searchType) {
      case 'cards':
        return 'Enter card name, type, or element...';
      case 'deck-building':
        return 'Search for cards to add to your deck...';
      case 'decks':
        return 'Enter deck name...';
      case 'events':
        return 'Enter event or tournament name...';
      default:
        return 'Enter search term...';
    }
  };

  const handleSearchExecution = (searchType: string, searchTerm: string) => {
    console.log(`Executing ${searchType} search for: ${searchTerm}`);

    switch (searchType) {
      case 'cards':
      case 'deck-building':
        // Search cards on current page or navigate to cards page
        if (location.pathname !== '/cards') {
          navigate('/cards');
        }
        // Highlight matching cards
        setTimeout(() => {
          highlightMatchingCards(searchTerm);
        }, 200);
        break;

      case 'decks':
        // Search through deck names
        highlightMatchingDecks(searchTerm);
        break;

      case 'events':
        // Search through events
        highlightMatchingEvents(searchTerm);
        break;
    }
  };

  const highlightMatchingCards = (searchTerm: string) => {
    const cardElements = document.querySelectorAll('[data-card-name]');
    let matchCount = 0;

    cardElements.forEach(element => {
      const cardName = element.getAttribute('data-card-name') || '';
      const cardType = element.getAttribute('data-card-type') || '';
      const cardElements = element.getAttribute('data-card-elements') || '';

      const matches =
        cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cardType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cardElements.toLowerCase().includes(searchTerm.toLowerCase());

      if (matches) {
        (element as HTMLElement).style.border = '3px solid #d4af37';
        (element as HTMLElement).style.boxShadow =
          '0 0 20px rgba(212, 175, 55, 0.5)';
        (element as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        matchCount++;
      } else {
        (element as HTMLElement).style.opacity = '0.3';
      }
    });

    // Show result notification
    showSearchNotification(
      `Found ${matchCount} matching cards for "${searchTerm}"`,
    );

    // Reset highlighting after 10 seconds
    setTimeout(() => {
      resetCardHighlighting();
    }, 10000);
  };

  const highlightMatchingDecks = (searchTerm: string) => {
    const deckElements = document.querySelectorAll('[data-search-type="deck"]');
    if (deckElements.length === 0) {
      showSearchNotification('No decks found. Create your first deck!');
      return;
    }

    // Implementation for deck search would go here
    showSearchNotification(`Searching decks for "${searchTerm}"...`);
  };

  const highlightMatchingEvents = (searchTerm: string) => {
    const eventElements = document.querySelectorAll(
      '[data-search-type="event"]',
    );
    let matchCount = 0;

    eventElements.forEach(element => {
      const text = element.textContent?.toLowerCase() || '';
      if (text.includes(searchTerm.toLowerCase())) {
        (element as HTMLElement).style.border = '2px solid #d4af37';
        (element as HTMLElement).style.backgroundColor =
          'rgba(212, 175, 55, 0.1)';
        (element as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        matchCount++;
      }
    });

    showSearchNotification(
      `Found ${matchCount} matching events for "${searchTerm}"`,
    );

    // Reset highlighting after 8 seconds
    setTimeout(() => {
      resetEventHighlighting();
    }, 8000);
  };

  const resetCardHighlighting = () => {
    const cardElements = document.querySelectorAll('[data-card-name]');
    cardElements.forEach(element => {
      (element as HTMLElement).style.border = '';
      (element as HTMLElement).style.boxShadow = '';
      (element as HTMLElement).style.opacity = '';
    });
  };

  const resetEventHighlighting = () => {
    const eventElements = document.querySelectorAll(
      '[data-search-type="event"]',
    );
    eventElements.forEach(element => {
      (element as HTMLElement).style.border = '';
      (element as HTMLElement).style.backgroundColor = '';
    });
  };

  const showSearchNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #d4af37;
      color: black;
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: bold;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
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
