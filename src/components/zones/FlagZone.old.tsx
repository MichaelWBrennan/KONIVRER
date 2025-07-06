import React from 'react';
import UnifiedCard from '../UnifiedCard';
import '../../styles/zones.css';

interface FlagZoneProps {
  flagCard
  isCurrentPlayer
}

const FlagZone: React.FC<FlagZoneProps> = ({  flagCard, isCurrentPlayer  }) => {
  return (
    <>
      <div className={`flag-zone ${isCurrentPlayer ? 'your' : 'opponent'}`}></div>
      <div className="zone-label">FLAG</div>
      <div className="flag-card"></div>
      <UnifiedCard variant="standard" card={flagCard} location="flag" />
        </div>
    </>
  ) : (
        <div className="empty-zone">No Flag</div>
      )}
    </div>
  );
};

export default FlagZone;