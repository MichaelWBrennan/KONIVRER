import React from 'react';
import '../../styles/zones.css';

const LifeCardsZone = ({ lifeCards, isCurrentPlayer }) => {
  return (
    <div className={`life-cards-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}>
      <div className="zone-label">LIFE CARDS</div>
      <div className="cards-container">
        {lifeCards.map((card, index) => (
          <div key={index} className="life-card">
            {/* Always show card back for Life Cards */}
            <img src="/assets/card-back-new.png" alt="Life Card" />
          </div>
        ))}
      </div>
      <div className="life-count">{lifeCards.length}</div>
    </div>
  );
};

export default LifeCardsZone;