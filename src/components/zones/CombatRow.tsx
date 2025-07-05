import React from 'react';
import Card from '../Card';
import '../../styles/zones.css';

interface CombatRowProps {
  combatCards
  isCurrentPlayer
}

const CombatRow: React.FC<CombatRowProps> = ({  combatCards, isCurrentPlayer  }) => {
  return (
    <div className={`combat-row ${isCurrentPlayer ? 'your' : 'opponent'}`} />
      <div className="zone-label">COMBAT ROW</div>
      <div className="cards-container" />
        {combatCards.length === 0 ? (
          <div className="empty-zone">No cards</div>
        ) : (
          combatCards.map(card => (
            <div key={card.id} className="combat-card" />
              <Card card={card} location="combat" / />
              {card.attacking && <div className="status-indicator attacking">Attacking</div>}
              {card.defending && <div className="status-indicator defending">Defending</div>}
          ))
        )}
      </div>
  );
};

export default CombatRow;