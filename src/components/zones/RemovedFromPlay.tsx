import React from 'react';
import '../../styles/zones.css';

const RemovedFromPlay = ({ cards, isCurrentPlayer }): any => {
  return (
    <div className={`removed-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}></div>
      <div className="zone-label">REMOVED</div>
      <div className="removed-container"></div>
        {cards.length === 0 ? (
          <div className="empty-zone">Empty</div>
        ) : (
          <div className="removed-count">{cards.length}
        )}
      </div>
  );
};

export default RemovedFromPlay;