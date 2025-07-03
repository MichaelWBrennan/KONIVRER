import React from 'react';
import Card from '../Card';
import '../../styles/zones.css';

const FlagZone = ({ flagCard, isCurrentPlayer }) => {
  return (
    <div className={`flag-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}>
      <div className="zone-label">FLAG</div>
      {flagCard ? (
        <div className="flag-card">
          <Card card={flagCard} location="flag" />
        </div>
      ) : (
        <div className="empty-zone">No Flag</div>
      )}
    </div>
  );
};

export default FlagZone;