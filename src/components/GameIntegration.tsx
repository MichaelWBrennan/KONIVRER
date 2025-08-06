import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext, Deck } from '../contexts/AppContext';
import DeckSearch from './DeckSearch';
import '../styles/game-integration.css';

interface GameIntegrationProps {
  onDeckSelected?: (deck: Deck) => void;
  onStartGame?: (deck: Deck, gameMode: string) => void;
  gameMode?: 'practice' | 'pvp' | 'tournament';
}

const GameIntegration: React.FC<GameIntegrationProps> = ({
  onDeckSelected,
  onStartGame,
  gameMode = 'practice',
}) => {
  const { user, currentDeck, decks } = useContext(AppContext);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(currentDeck);
  const [showDeckBrowser, setShowDeckBrowser] = useState(false);
  const [showMyDecks, setShowMyDecks] = useState(true);

  const handleDeckSelect = (deck: Deck) => {
    setSelectedDeck(deck);
    onDeckSelected?.(deck);
  };

  const handleStartGame = () => {
    if (selectedDeck) {
      onStartGame?.(selectedDeck, gameMode);
    }
  };

  const getDeckStats = (deck: Deck) => {
    // This would typically use the same logic as in DeckSearch
    return {
      totalCards: deck.cards.reduce((sum, card) => sum + card.quantity, 0),
      familiar: deck.cards.filter(card => {
        // Would need to check card type from KONIVRER_CARDS
        return true; // Simplified for now
      }).length,
      flag: deck.cards.filter(card => {
        // Would need to check card type from KONIVRER_CARDS
        return true; // Simplified for now
      }).length,
    };
  };

  const isValidDeck = (deck: Deck | null): boolean => {
    if (!deck) return false;
    const stats = getDeckStats(deck);
    return stats.totalCards >= 30; // Minimum deck size requirement
  };

  if (!user) {
    return (
      <div className="game-integration">
        <div className="login-required">
          <h3>Login Required</h3>
          <p>Please log in to access game features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-integration">
      <div className="game-header">
        <h2>Game Setup</h2>
        <div className="game-mode-indicator">
          <span className="mode-label">Mode:</span>
          <span className="mode-value">{gameMode.toUpperCase()}</span>
        </div>
      </div>

      <div className="deck-selection-section">
        <div className="deck-selection-header">
          <h3>Select Deck</h3>
          <div className="deck-selection-controls">
            <button
              onClick={() => {
                setShowMyDecks(true);
                setShowDeckBrowser(true);
              }}
              className="browse-btn"
            >
              My Decks
            </button>
            <button
              onClick={() => {
                setShowMyDecks(false);
                setShowDeckBrowser(true);
              }}
              className="browse-btn"
            >
              Browse Public
            </button>
          </div>
        </div>

        {selectedDeck ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="selected-deck-display"
          >
            <div className="deck-card">
              <div className="deck-info">
                <h4>{selectedDeck.name}</h4>
                <p className="deck-author">by {selectedDeck.authorUsername}</p>
                <p className="deck-description">{selectedDeck.description}</p>

                <div className="deck-stats-mini">
                  <div className="stat">
                    <span>Cards: {getDeckStats(selectedDeck).totalCards}</span>
                  </div>
                  <div className="stat">
                    <span>Format: {selectedDeck.format || 'Standard'}</span>
                  </div>
                </div>

                <div className="deck-validation">
                  {isValidDeck(selectedDeck) ? (
                    <span className="valid">✓ Deck Valid</span>
                  ) : (
                    <span className="invalid">
                      ⚠ Deck Invalid (Need 30+ cards)
                    </span>
                  )}
                </div>
              </div>

              <div className="deck-actions">
                <button
                  onClick={() => setSelectedDeck(null)}
                  className="change-deck-btn"
                >
                  Change Deck
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="no-deck-selected">
            <p>No deck selected</p>
            <button
              onClick={() => setShowDeckBrowser(true)}
              className="select-deck-btn"
            >
              Select a Deck
            </button>
          </div>
        )}
      </div>

      {showDeckBrowser && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="deck-browser-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3>{showMyDecks ? 'My Decks' : 'Public Decks'}</h3>
              <button
                onClick={() => setShowDeckBrowser(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <DeckSearch
              showMyDecks={showMyDecks}
              onDeckSelect={deck => {
                handleDeckSelect(deck);
                setShowDeckBrowser(false);
              }}
              onImportDeck={deck => {
                handleDeckSelect(deck);
                setShowDeckBrowser(false);
              }}
            />
          </div>
        </motion.div>
      )}

      <div className="game-start-section">
        <div className="game-options">
          <h3>Game Options</h3>

          <div className="option-group">
            <label>Difficulty:</label>
            <select className="game-option-select">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {gameMode === 'pvp' && (
            <div className="option-group">
              <label>Match Type:</label>
              <select className="game-option-select">
                <option value="casual">Casual</option>
                <option value="ranked">Ranked</option>
              </select>
            </div>
          )}

          {gameMode === 'tournament' && (
            <div className="option-group">
              <label>Tournament:</label>
              <select className="game-option-select">
                <option value="daily">Daily Tournament</option>
                <option value="weekly">Weekly Championship</option>
              </select>
            </div>
          )}
        </div>

        <div className="start-game-area">
          <button
            onClick={handleStartGame}
            disabled={!isValidDeck(selectedDeck)}
            className={`start-game-btn ${isValidDeck(selectedDeck) ? 'enabled' : 'disabled'}`}
          >
            {gameMode === 'practice' && 'Start Practice Game'}
            {gameMode === 'pvp' && 'Find Opponent'}
            {gameMode === 'tournament' && 'Enter Tournament'}
          </button>

          {!isValidDeck(selectedDeck) && (
            <p className="start-game-warning">
              Select a valid deck to start playing
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameIntegration;
