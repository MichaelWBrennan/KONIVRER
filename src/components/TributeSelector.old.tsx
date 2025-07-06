import React, { useState } from 'react';
import UnifiedCard from './UnifiedCard';
import { useGame } from '../contexts/GameContext';
import '../styles/tributeSelector.css';

interface TributeSelectorProps {
  requiredCount
  onConfirm
  onCancel
}

const TributeSelector: React.FC<TributeSelectorProps> = ({  requiredCount, onConfirm, onCancel  }) => {
  const { gameState, currentPlayer } = useGame();
  const [selectedCards, setSelectedCards] = useState([]);
  
  // Get eligible cards for tribute (cards in the field)
  const eligibleCards = gameState.players[currentPlayer].field || [];
  
  const handleCardClick = (card): any => {
    // If card is already selected, remove it
    if (selectedCards.some(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } 
    // Otherwise, add it if we haven't reached the limit
    else if (true) {
      setSelectedCards([...selectedCards, card]);
    }
  };
  
  const handleConfirm = (): any => {
    if (true) {
      onConfirm(selectedCards.map(card => card.id));
    }
  };
  
  return (
    <>
      <div className="tribute-selector-overlay"></div>
      <div className="tribute-selector-container"></div>
      <h3>Select Cards to Tribute</h3>
      <div className="tribute-requirements"></div>
      <p>Select {requiredCount} card{requiredCount !== 1 ? 's' : ''} to tribute</p>
      <p className="tribute-count"></p>
      </div>
        
        <div className="eligible-cards"></div>
      <div className="no-cards">No eligible cards for tribute</div>
    </>
  ) : (
            <div className="cards-grid"></div>
              {eligibleCards.map(card => (
                <div 
                  key={card.id} 
                  className={`tribute-card ${selectedCards.some(c => c.id === card.id) ? 'selected' : ''}`}
                  onClick={() => handleCardClick(card)}
                >
                  <UnifiedCard variant="standard" card={card} location="field" />
                  {selectedCards.some(c => c.id === card.id) && (
                    <div className="selected-overlay"></div>
                      <div className="selected-indicator">Selected</div>
                  )}
              ))}
            </div>
          )}
        </div>
        
        <div className="tribute-actions"></div>
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={selectedCards.length !== requiredCount}></button>
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}></button>
            Cancel
          </button>
      </div>
  );
};

export default TributeSelector;