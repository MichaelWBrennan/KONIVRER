import React from 'react';
import UnifiedCard from '../UnifiedCard';
import '../../styles/zones.css';

interface FieldProps {
  cards
  isCurrentPlayer
}

const Field: React.FC<FieldProps> = ({  cards, isCurrentPlayer  }) => {
  return (
    <>
      <div className={`field-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}></div>
      <div className="zone-label">{isCurrentPlayer ? 'YOUR CARDS' : "OPPONENT'S CARDS"}
      <div className="cards-container"></div>
      <div className="empty-zone">No cards</div>
    </>
  ) : (
          cards.map(card => (
            <div key={card.id} className="field-card"></div>
              <UnifiedCard variant="standard" card={card} location="field" />
            </div>
          ))
        )}
      </div>
  );
};

export default Field;