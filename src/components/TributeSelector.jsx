import React, { useState } from 'react';
import Card from './Card';
import { useGame } from '../contexts/GameContext';
import '../styles/tributeSelector.css';

const TributeSelector = ({ requiredCount, onConfirm, onCancel }) => {
  const { gameState, currentPlayer } = useGame();
  const [selectedCards, setSelectedCards] = useState([]);
  
  // Get eligible cards for tribute (cards in the field)
  const eligibleCards = gameState.players[currentPlayer].field || [];
  
  const handleCardClick = (card) => {
    // If card is already selected, remove it
    if (selectedCards.some(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } 
    // Otherwise, add it if we haven't reached the limit
    else if (selectedCards.length < requiredCount) {
      setSelectedCards([...selectedCards, card]);
    }
  };
  
  const handleConfirm = () => {
    if (selectedCards.length === requiredCount) {
      onConfirm(selectedCards.map(card => card.id));
    }
  };
  
  return (
    <div className="tribute-selector-overlay">
      <div className="tribute-selector-container">
        <h3>Select Cards to Tribute</h3>
        
        <div className="tribute-requirements">
          <p>Select {requiredCount} card{requiredCount !== 1 ? 's' : ''} to tribute</p>
          <p className="tribute-count">
            Selected: {selectedCards.length}/{requiredCount}
          </p>
        </div>
        
        <div className="eligible-cards">
          {eligibleCards.length === 0 ? (
            <div className="no-cards">No eligible cards for tribute</div>
          ) : (
            <div className="cards-grid">
              {eligibleCards.map(card => (
                <div 
                  key={card.id} 
                  className={`tribute-card ${selectedCards.some(c => c.id === card.id) ? 'selected' : ''}`}
                  onClick={() => handleCardClick(card)}
                >
                  <Card card={card} location="field" />
                  {selectedCards.some(c => c.id === card.id) && (
                    <div className="selected-overlay">
                      <div className="selected-indicator">Selected</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="tribute-actions">
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={selectedCards.length !== requiredCount}
          >
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TributeSelector;