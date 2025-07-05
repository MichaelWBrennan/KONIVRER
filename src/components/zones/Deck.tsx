import React from 'react';
import '../../styles/zones.css';

const Deck = ({ deckSize, isCurrentPlayer }): any => {
  return (
    <div className={`deck-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}></div>
      <div className="zone-label">DECK</div>
      <div className="deck-container"></div>
        {deckSize > 0 ? (
          <>
            <img src="/assets/card-back-new.png" alt="Deck" className="deck-image" /></img>
            <div className="deck-count">{deckSize}</div>
          </>
        ) : (
          <div className="empty-zone">Empty</div>
        )}
      </div>
    </div>
  );
};

export default Deck;