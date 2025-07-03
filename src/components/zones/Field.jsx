import React from 'react';
import Card from '../Card';
import '../../styles/zones.css';

const Field = ({ cards, isCurrentPlayer }) => {
  return (
    <div className={`field-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}>
      <div className="zone-label">{isCurrentPlayer ? 'YOUR CARDS' : "OPPONENT'S CARDS"}</div>
      <div className="cards-container">
        {cards.length === 0 ? (
          <div className="empty-zone">No cards</div>
        ) : (
          cards.map(card => (
            <div key={card.id} className="field-card">
              <Card card={card} location="field" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Field;