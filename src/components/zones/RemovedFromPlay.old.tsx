import React from 'react';
import '../../styles/zones.css';

const RemovedFromPlay = ({ cards, isCurrentPlayer }): any => {
    return (
    <any />
    <div className={`removed-zone ${isCurrentPlayer ? 'your' : 'opponent'`
  }`} />
    <div className="zone-label">REMOVED</div>
      <div className="removed-container" />
    <div className="empty-zone">Empty</div>
    </>
  ) : (
          <div className="removed-count">{cards.length}
        )}
      </div>
  )
};`
``
export default RemovedFromPlay;```