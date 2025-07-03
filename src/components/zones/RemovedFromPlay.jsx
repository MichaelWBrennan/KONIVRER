import React from 'react';
import '../../styles/zones.css';

const RemovedFromPlay = ({ cards, isCurrentPlayer }) => {
  return (
    <div className={`removed-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}>
      <div className="zone-label">REMOVED</div>
      <div className="removed-container">
        {cards.length === 0 ? (
          <div className="empty-zone">Empty</div>
        ) : (
          <div className="removed-count">{cards.length}</div>
        )}
      </div>
    </div>
  );
};

export default RemovedFromPlay;