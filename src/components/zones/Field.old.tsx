import React from 'react';
import UnifiedCard from '../UnifiedCard';
import '../../styles/zones.css';

interface FieldProps {
  cards
  isCurrentPlayer
  
}

const Field: React.FC = () => {
  return (
    <any />
    <div className={`field-zone ${isCurrentPlayer ? 'your' : 'opponent'}`} />
    <div className="zone-label">{isCurrentPlayer ? 'YOUR CARDS' : "OPPONENT'S CARDS"}
      <div className="cards-container" />
    <div className="empty-zone">No cards</div>
    </>
  ) : (
          cards.map(card => (
            <div key={card.id} className="field-card" />
    <UnifiedCard variant="standard" card={card} location="field"  / /></UnifiedCard>
            </div>
          ))
        )}
      </div>
  )
};`
``
export default Field;```