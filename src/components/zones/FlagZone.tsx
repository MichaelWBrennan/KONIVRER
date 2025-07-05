import React from 'react';
import Card from '../Card';
import '../../styles/zones.css';

interface FlagZoneProps {
  flagCard
  isCurrentPlayer
}

const FlagZone: React.FC<FlagZoneProps> = ({  flagCard, isCurrentPlayer  }) => {
  return (
    <div className={`flag-zone ${isCurrentPlayer ? 'your' : 'opponent'}`} />
      <div className="zone-label">FLAG</div>
      {flagCard ? (
        <div className="flag-card" />
          <Card card={flagCard} location="flag" / />
        </div>
      ) : (
        <div className="empty-zone">No Flag</div>
      )}
    </div>
  );
};

export default FlagZone;