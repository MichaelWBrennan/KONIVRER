import React, { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PopoverMenu from './PopoverMenu';
import AccessibilityPanel from './AccessibilityPanel';
import { AppContext, AppContextType } from '../contexts/AppContext';
import UnifiedCardSearch from './UnifiedCardSearch';
import DeckBuilder from './DeckBuilder';
import DeckSearch from './DeckSearch';
import GameIntegration from './GameIntegration';
import RulesViewer from './RulesViewer';
import SimpleEnhancedLoginModal from './SimpleEnhancedLoginModal';
import KONIVRERBattlefield from './battlefield/KONIVRERBattlefield';

// Active view type for internal navigation
type ActiveView =
  | 'cardSearch'
  | 'deckBuilder'
  | 'deckSearch'
  | 'myDecks'
  | 'rules'
  | 'game'
  | 'battlefield';
// Define the four main navigation items
const getMainNavigationItems = (context: AppContextType) => [
  {
    id: 'cardSearch' as ActiveView,
    label: 'Card Search',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    ),
  },
  {
    id: 'deckBuilder' as ActiveView,
    label: 'Deck Builder',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
  },
  {
    id: 'deckSearch' as ActiveView,
    label: 'Browse Decks',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
      </svg>
    ),
  },
  {
    id: 'menu' as ActiveView,
    label: 'More',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    ),
  },
];

// Additional navigation items for the More menu
const getAdditionalNavigationItems = (context: AppContextType) => [
  {
    id: 'rules' as ActiveView,
    label: 'Rules',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
  },
  {
    id: 'battlefield' as ActiveView,
    label: 'KONIVRER Battlefield',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 'game' as ActiveView,
    label: 'Play Game',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
    requiresAuth: true,
  },
  {
    id: 'myDecks' as ActiveView,
    label: 'My Decks',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M16 4l-4-4-4 4v2c0 4.42 3.58 8 8 8s8-3.58 8-8V4h-8zm0 10c-2.21 0-4-1.79-4-4V6h8v4c0 2.21-1.79 4-4 4z" />
      </svg>
    ),
    requiresAuth: true,
  },
];

interface CircularButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaLabel: string;
  isActive?: boolean;
  ref?: React.RefObject<HTMLButtonElement>;
}

const CircularButton = React.forwardRef<HTMLButtonElement, CircularButtonProps>(
  ({ icon, label, onClick, ariaLabel, isActive = false }, ref) => {
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
          backgroundColor: isActive ? '#e6c149' : '#d4af37', // Brighter when active
          border: isActive ? '2px solid #fff' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isActive
            ? '0 6px 20px rgba(212, 175, 55, 0.6)'
            : '0 4px 15px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          position: 'relative',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow =
            '0 6px 20px rgba(212, 175, 55, 0.4)';
          e.currentTarget.style.backgroundColor = '#e6c149';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = isActive
            ? '0 6px 20px rgba(212, 175, 55, 0.6)'
            : '0 4px 15px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.backgroundColor = isActive
            ? '#e6c149'
            : '#d4af37';
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
            zIndex: 1001,
          }}
          className="tooltip"
        >
          {label}
        </div>
      </motion.button>
    );
  },
);

const FourBubbleNavigation: React.FC = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] =
    useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('cardSearch');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const appContext = useContext(AppContext);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const {
    user,
    setUser,
    currentDeck,
    setCurrentDeck,
    showLoginModal,
    setShowLoginModal,
    addCardToDeck,
    createDeck,
    importDeck,
  } = appContext;

  // Get navigation items
  const mainNavigationItems = getMainNavigationItems(appContext);
  const additionalNavigationItems = getAdditionalNavigationItems(appContext);

  const handleNavigation = (view: ActiveView) => {
    const item = additionalNavigationItems.find(item => item.id === view);
    if (item?.requiresAuth && !user) {
      setShowLoginModal(true);
      return;
    }
    setActiveView(view);
    setIsMoreMenuOpen(false);
  };

  const handleCardSearch = () => {
    setActiveView('cardSearch');
  };

  const handleDeckBuilder = () => {
    setActiveView('deckBuilder');
  };

  const handleBrowseDecks = () => {
    setActiveView('deckSearch');
  };

  const handleMoreMenu = () => {
    setIsMoreMenuOpen(true);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'cardSearch':
        return (
          <UnifiedCardSearch
            onCardSelect={card => {
              // Add card to current deck if exists, or prompt to create new deck
              if (currentDeck) {
                addCardToDeck(card.id);
                console.log(`Added ${card.name} to ${currentDeck.name}`);
              } else if (user) {
                // Create a new deck if none exists
                const newDeck = createDeck(
                  'My Deck',
                  'New deck from card search',
                  false,
                );
                setCurrentDeck(newDeck);
                addCardToDeck(card.id, newDeck.id);
                console.log(`Created new deck and added ${card.name}`);
                // Optionally switch to deck builder view
                // setActiveView('deckBuilder');
              } else {
                // Prompt user to login
                setShowLoginModal(true);
              }
            }}
          />
        );

      case 'deckBuilder':
        return (
          <DeckBuilder
            initialDeck={currentDeck || undefined}
            onSave={deck => {
              setCurrentDeck(deck);
              console.log('Deck saved:', deck);
            }}
            onCancel={() => setActiveView('cardSearch')}
          />
        );

      case 'deckSearch':
        return (
          <DeckSearch
            onDeckSelect={deck => {
              console.log('Deck selected:', deck);
            }}
            onImportDeck={deck => {
              importDeck(deck);
              setActiveView('deckBuilder');
            }}
            onPlayWithDeck={deck => {
              importDeck(deck);
              setActiveView('game');
            }}
          />
        );

      case 'myDecks':
        return (
          <DeckSearch
            showMyDecks={true}
            onDeckSelect={deck => {
              setCurrentDeck(deck);
              setActiveView('deckBuilder');
            }}
            onPlayWithDeck={deck => {
              setCurrentDeck(deck);
              setActiveView('game');
            }}
          />
        );

      case 'game':
        return (
          <GameIntegration
            onDeckSelected={deck => {
              setCurrentDeck(deck);
            }}
            onStartGame={(deck, gameMode) => {
              console.log('Starting game with deck:', deck, 'Mode:', gameMode);
              // Here you would typically navigate to the actual game
            }}
          />
        );

      case 'battlefield':
        return (
          <KONIVRERBattlefield
            onThemeChange={theme => {
              console.log('Theme changed to:', theme);
            }}
            onQualityChange={quality => {
              console.log('Quality changed to:', quality);
            }}
            onGameAction={action => {
              console.log('Game action:', action);
            }}
            enablePerformanceMonitoring={true}
            className="main-nav-battlefield"
          />
        );

      case 'rules':
        return <RulesViewer onBack={() => setActiveView('cardSearch')} />;

      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="four-bubble-navigation">
      {/* Main Content */}
      <main className="nav-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="view-container"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Four Bubble Bottom Navigation */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          borderTop: 'none',
          padding: '20px',
          paddingBottom: `calc(20px + env(safe-area-inset-bottom, 0px))`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '25px',
          zIndex: 1000,
          boxShadow: 'none',
        }}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Card Search Button */}
        <CircularButton
          icon={mainNavigationItems[0].icon}
          label={mainNavigationItems[0].label}
          onClick={handleCardSearch}
          ariaLabel="Navigate to Card Search"
          isActive={activeView === 'cardSearch'}
        />

        {/* Deck Builder Button */}
        <CircularButton
          icon={mainNavigationItems[1].icon}
          label={mainNavigationItems[1].label}
          onClick={handleDeckBuilder}
          ariaLabel="Navigate to Deck Builder"
          isActive={activeView === 'deckBuilder'}
        />

        {/* Browse Decks Button */}
        <CircularButton
          icon={mainNavigationItems[2].icon}
          label={mainNavigationItems[2].label}
          onClick={handleBrowseDecks}
          ariaLabel="Navigate to Browse Decks"
          isActive={activeView === 'deckSearch'}
        />

        {/* More Menu Button */}
        <CircularButton
          icon={mainNavigationItems[3].icon}
          label={mainNavigationItems[3].label}
          onClick={handleMoreMenu}
          ariaLabel="Open more options menu"
          isActive={['rules', 'battlefield', 'game', 'myDecks'].includes(
            activeView,
          )}
          ref={moreButtonRef}
        />
      </motion.nav>

      {/* More Menu Popover */}
      <PopoverMenu
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        navigationItems={additionalNavigationItems.map(item => ({
          to: '#',
          label: item.label,
          icon: item.icon,
          onClick: () => handleNavigation(item.id),
        }))}
        anchorRef={moreButtonRef}
      />

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={isAccessibilityPanelOpen}
        onClose={() => setIsAccessibilityPanelOpen(false)}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <SimpleEnhancedLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={userData => {
            // Handle successful login
            setUser(userData);
            setShowLoginModal(false);
          }}
        />
      )}

      <style jsx>{`
        .four-bubble-navigation {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .nav-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 100px; /* Space for bottom navigation */
        }

        .view-container {
          width: 100%;
          height: 100%;
        }

        button:hover .tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default FourBubbleNavigation;
