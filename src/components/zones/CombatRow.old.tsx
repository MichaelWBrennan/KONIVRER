import React from 'react';
import UnifiedCard from '../UnifiedCard';
import '../../styles/zones.css';

interface CombatRowProps {
  combatCards
  isCurrentPlayer
  
}

const CombatRow: React.FC = () => {
  return (
    <any />
    <div className={`combat-row ${isCurrentPlayer ? 'your' : 'opponent'}`} />
    <div className="zone-label">COMBAT ROW</div>
      <div className="cards-container" />
    <div className="empty-zone">No cards</div>
    </>
  ) : (
          combatCards.map(card => (
            <div key={card.id} className="combat-card" />
    <UnifiedCard variant="standard" card={card} location="combat"  / /></UnifiedCard>
              {card.attacking && <div className="status-indicator attacking">Attacking</div>}
              {card.defending && <div className="status-indicator defending">Defending</div>}
          ))
        )}
      </div>
  )
};`
``
export default CombatRow;```