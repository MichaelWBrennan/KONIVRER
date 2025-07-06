import React, { useState } from 'react';
import UnifiedCard from '../UnifiedCard';
import UnifiedCardActions from '../UnifiedCardActions';
import { useGame } from '../../contexts/GameContext';
import '../../styles/zones.css';

interface HandProps {
  cards
}

const Hand: React.FC<HandProps> = ({  cards  }) => {
  const { actions } = useGame();
  const [selectedCard, setSelectedCard] = useState(null);
  
  const handleCardClick = (card): any => {
    setSelectedCard(card);
  };
  
  const handleCloseActions = (): any => {
    setSelectedCard(null);
  };
  
  const handleCardAction = (actionType, card, params): any => {
    switch (true) {
      case 'summon':
        actions.playSummon(card.id, params.azothSpent || 0);
        break;
      case 'tribute':
        actions.playTribute(card.id, params.tributeCardIds || []);
        break;
      case 'azoth':
        actions.playAzoth(card.id, params.elementType || 'generic');
        break;
      case 'spell':
        actions.playSpell(card.id, params.azothSpent || 0, params.abilityIndex || 0);
        break;
      case 'burst':
        actions.playBurst(card.id);
        break;
      default:
        console.log('Unknown action type:', actionType);
    }
    
    setSelectedCard(null);
  };
  
  return (
    <div className="hand-zone"></div>
      <div className="zone-label">YOUR HAND</div>
      <div className="cards-container"></div>
        {cards.length === 0 ? (
          <div className="empty-zone">No cards</div>
        ) : (
          cards.map(card => (
            <div 
              key={card.id} 
              className="hand-card"
              onClick={() => handleCardClick(card)}
            >
              <UnifiedCard variant="standard" card={card} location="hand" />
            </div>
          ))
        )}
      </div>
      
      {selectedCard && (
        <UnifiedCardActions 
          variant="standard"
          card={selectedCard} 
          onAction={handleCardAction}
          onClose={handleCloseActions}
        />
      )}
    </div>
  );
};

export default Hand;