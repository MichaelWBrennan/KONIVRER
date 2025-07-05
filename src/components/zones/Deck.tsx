import React from 'react';
import '../../styles/zones.css';

const Deck = ({ deckSize, isCurrentPlayer }): any => {
  return (
    <div className={`deck-zone ${isCurrentPlayer ? 'your' : 'opponent'}`} />
      <div className="zone-label">DECK</div>
      <div className="deck-container" />
        {deckSize > 0 ? (
          <>
            <img src="/assets/card-back-new.png" alt="Deck" className="deck-image" / />
            <div className="deck-count">{deckSize}
          </>
        ) : (
          <div className="empty-zone">Empty</div>
        )}
      </div>
  );
};

export default Deck;