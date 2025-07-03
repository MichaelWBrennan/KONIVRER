import React from 'react';
import '../styles/playerInfo.css';

const PlayerInfo = ({ player, isOpponent }) => {
  return (
    <div className={`player-info ${isOpponent ? 'opponent' : 'you'}`}>
      <h2>{isOpponent ? 'Opponent' : 'You'}</h2>
      
      <div className="info-row">
        <div className="info-item">
          <span className="info-label">Life:</span>
          <span className="info-value">{player.lifeCards.length}</span>
        </div>
        
        {!isOpponent && (
          <>
            <div className="info-item">
              <span className="info-label">Turn:</span>
              <span className="info-value">{player.id === 'player1' ? 'First' : 'Second'}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Cards:</span>
              <span className="info-value">{player.hand.length}</span>
            </div>
          </>
        )}
        
        {isOpponent && (
          <div className="info-item">
            <span className="info-label">Cards:</span>
            <span className="info-value">{player.hand.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;