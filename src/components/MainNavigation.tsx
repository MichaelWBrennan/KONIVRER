import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext, Deck } from '../contexts/AppContext';
import HomePage from './HomePage';
import UnifiedCardSearch from './UnifiedCardSearch';
import DeckBuilder from './DeckBuilder';
import DeckSearch from './DeckSearch';
import GameIntegration from './GameIntegration';
import RulesViewer from './RulesViewer';
import SimpleEnhancedLoginModal from './SimpleEnhancedLoginModal';
import { LazyGameContainer } from '../game/components/LazyGameContainer';
import '../styles/main-navigation.css';

// Direct 3D Game Interface Component
interface Direct3DGameInterfaceProps {
  gameMode: 'practice3d' | 'quick3d' | 'ranked' | 'tournament';
  onBack: () => void;
  currentDeck: Deck | null;
}

const Direct3DGameInterface: React.FC<Direct3DGameInterfaceProps> = ({
  gameMode,
  onBack,
  currentDeck,
}) => {
  const [showGame, setShowGame] = useState(true);

  const gameModeLabels = {
    practice3d: '3D Practice',
    quick3d: '3D Quick Duel',
    ranked: 'Ranked Conquest',
    tournament: 'Grand Tournament',
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1001,
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          ← Back to Menu
        </button>
      </motion.div>

      {showGame && (
        <LazyGameContainer
          onClose={() => {
            setShowGame(false);
            onBack();
          }}
          setShowGame={setShowGame}
        />
      )}
    </div>
  );
};

type ActiveView =
  | 'home'
  | 'cardSearch'
  | 'deckBuilder'
  | 'deckSearch'
  | 'myDecks'
  | 'rules'
  | 'practice3d'
  | 'quick3d'
  | 'ranked'
  | 'tournament';

const MainNavigation: React.FC = () => {
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
  } = useContext(AppContext);

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [allowFamiliarAccess, setAllowFamiliarAccess] = useState(false);

  const navigationItems = [
    {
      id: 'home' as ActiveView,
      label: 'Home',
      icon: '🏠',
      description: 'Return to main menu',
    },
    {
      id: 'cardSearch' as ActiveView,
      label: 'Card Search',
      icon: '🔍',
      description: 'Search and explore cards',
    },
    {
      id: 'deckBuilder' as ActiveView,
      label: 'Deck Builder',
      icon: '🔨',
      description: 'Build and edit decks',
    },
    {
      id: 'deckSearch' as ActiveView,
      label: 'Browse Decks',
      icon: '📚',
      description: 'Find public decks',
    },
    {
      id: 'myDecks' as ActiveView,
      label: 'My Decks',
      icon: '💼',
      description: 'Your deck collection',
      requiresAuth: true,
    },
    {
      id: 'rules' as ActiveView,
      label: 'Rules',
      icon: '📖',
      description: 'Game rules and guidelines',
    },
    {
      id: 'practice3d' as ActiveView,
      label: '3D Practice',
      icon: '🎯',
      description: '3D cards with physics - Master skills against AI',
      requiresAuth: true,
    },
    {
      id: 'quick3d' as ActiveView,
      label: '3D Quick Duel',
      icon: '⚡',
      description: 'Fast-paced 3D battles with drag-and-drop physics',
      requiresAuth: true,
    },
    {
      id: 'ranked' as ActiveView,
      label: 'Ranked Conquest',
      icon: '🏆',
      description: 'Climb the competitive ladder and earn rewards',
      requiresAuth: true,
    },
    {
      id: 'tournament' as ActiveView,
      label: 'Grand Tournament',
      icon: '👑',
      description: 'Structured events with exclusive prizes',
      requiresAuth: true,
    },
  ];

  const handleNavigation = (view: ActiveView) => {
    const item = navigationItems.find(item => item.id === view);
    if (item?.requiresAuth && !user) {
      setShowLoginModal(true);
      return;
    }

    // Enable familiar access when navigating to game sections
    const gameViews: ActiveView[] = [
      'practice3d',
      'quick3d',
      'ranked',
      'tournament',
    ];
    if (gameViews.includes(view)) {
      setAllowFamiliarAccess(true);
    } else if (!['home'].includes(view)) {
      setAllowFamiliarAccess(false);
    }

    setActiveView(view);
    setShowMobileMenu(false);
  };

  const handleHomeNavigation = (
    view:
      | 'cardSearch'
      | 'deckBuilder'
      | 'deckSearch'
      | 'practice3d'
      | 'quick3d'
      | 'ranked'
      | 'tournament',
  ) => {
    const gameViews: ActiveView[] = [
      'practice3d',
      'quick3d',
      'ranked',
      'tournament',
    ];

    if (gameViews.includes(view as ActiveView) && !user) {
      setShowLoginModal(true);
      return;
    }

    // Enable familiar access when navigating to games from home
    if (gameViews.includes(view as ActiveView)) {
      setAllowFamiliarAccess(true);
    } else {
      setAllowFamiliarAccess(false);
    }

    setActiveView(view as ActiveView);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage onNavigate={handleHomeNavigation} />;

      case 'cardSearch':
        return (
          <UnifiedCardSearch
            allowFamiliarCards={allowFamiliarAccess}
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

      case 'practice3d':
      case 'quick3d':
      case 'ranked':
      case 'tournament':
        return (
          <Direct3DGameInterface
            gameMode={activeView}
            onBack={() => setActiveView('home')}
            currentDeck={currentDeck}
          />
        );

      case 'rules':
        return <RulesViewer onBack={() => setActiveView('cardSearch')} />;

      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="main-navigation">
      {/* Header */}
      <header className="nav-header">
        <div className="nav-brand">
          <h1>KONIVRER</h1>
          <span className="nav-subtitle">Deck Database</span>
        </div>

        <div className="nav-user-section">
          {user ? (
            <div className="user-info">
              <span className="username">Welcome, {user.username}</span>
              <button
                onClick={() => {
                  // Logout functionality
                  setUser(null);
                  setCurrentDeck(null);
                  localStorage.removeItem('konivrer_user');
                  localStorage.removeItem('konivrer_current_deck');
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="login-btn"
            >
              Login
            </button>
          )}

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-menu-btn"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`nav-menu ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="nav-items">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`nav-item ${activeView === item.id ? 'active' : ''} ${
                item.requiresAuth && !user ? 'disabled' : ''
              }`}
              disabled={item.requiresAuth && !user}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.requiresAuth && !user && (
                <span className="auth-required">🔒</span>
              )}
            </button>
          ))}
        </div>

        {currentDeck && (
          <div className="current-deck-indicator">
            <div className="deck-info">
              <span className="deck-name">{currentDeck.name}</span>
              <span className="deck-cards">
                {currentDeck.cards.reduce(
                  (sum, card) => sum + card.quantity,
                  0,
                )}{' '}
                cards
              </span>
            </div>
            <button
              onClick={() => setActiveView('deckBuilder')}
              className="edit-deck-btn"
            >
              Edit
            </button>
          </div>
        )}
      </nav>

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
    </div>
  );
};

export default MainNavigation;
