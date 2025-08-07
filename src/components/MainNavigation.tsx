import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../contexts/AppContext';
import UnifiedCardSearch from './UnifiedCardSearch';
import DeckBuilder from './DeckBuilder';
import DeckSearch from './DeckSearch';
import GameIntegration from './GameIntegration';
import RulesViewer from './RulesViewer';
import SimpleEnhancedLoginModal from './SimpleEnhancedLoginModal';
import '../styles/main-navigation.css';

type ActiveView =
  | 'cardSearch'
  | 'deckBuilder'
  | 'deckSearch'
  | 'myDecks'
  | 'rules'
  | 'game';

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

  const [activeView, setActiveView] = useState<ActiveView>('cardSearch');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
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
      id: 'game' as ActiveView,
      label: 'Play Game',
      icon: '🎮',
      description: 'Start a game',
      requiresAuth: true,
    },
  ];

  const handleNavigation = (view: ActiveView) => {
    const item = navigationItems.find(item => item.id === view);
    if (item?.requiresAuth && !user) {
      setShowLoginModal(true);
      return;
    }
    setActiveView(view);
    setShowMobileMenu(false);
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

      case 'rules':
        return (
          <RulesViewer
            onBack={() => setActiveView('cardSearch')}
          />
        );

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
