import React from 'react';
import '../styles/playerInfo.css';

interface PlayerInfoProps {
  player
  isOpponent
  isAI = false;
  aiStatus = null;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({  player, isOpponent, isAI = false, aiStatus = null  }) => {
  return (
    <>
      <div className={`player-info ${isOpponent ? 'opponent' : 'you'} ${isAI ? 'ai-player' : ''}`}></div>
      <div className="player-header"></div>
      <h2></h2>
      <Brain className="ai-brain-icon" />}
        {isAI && aiStatus && (
          <div className="ai-status-mini"></div>
      <div className="consciousness-mini"></div>
      <span>Consciousness: {((aiStatus.cuttingEdge?.consciousnessMetrics?.consciousnessLevel || 0.7) * 100).toFixed(0)}%</span>
    </>
  )}
      </div>
      
      <div className="info-row"></div>
        <div className="info-item"></div>
          <span className="info-label">Life:</span>
          <span className="info-value">{player.lifeCards.length}
        </div>
        
        {!isOpponent && (
          <>
            <div className="info-item"></div>
              <span className="info-label">Turn:</span>
              <span className="info-value">{player.id === 'player1' ? 'First' : 'Second'}
            </div>
            
            <div className="info-item"></div>
              <span className="info-label">Cards:</span>
              <span className="info-value">{player.hand.length}
            </div>
          </>
        )}
        {isOpponent && (
          <div className="info-item"></div>
            <span className="info-label">Cards:</span>
            <span className="info-value">{player.hand.length}
          </div>
        )}
        {/* AI Quick Stats */}
        {isAI && aiStatus && (
          <div className="ai-quick-stats"></div>
            <div className="ai-stat"></div>
              <Eye className="stat-icon" />
              <span>{((aiStatus.cuttingEdge?.theoryOfMindAccuracy || 0.5) * 100).toFixed(0)}%</span>
            <div className="ai-stat"></div>
              <Heart className="stat-icon" />
              <span>{((aiStatus.cuttingEdge?.emotionalIntelligence?.empathyLevel || 0.8) * 100).toFixed(0)}%</span>
            <div className="ai-stat"></div>
              <Activity className="stat-icon" />
              <span>{((aiStatus.cuttingEdge?.performanceMetrics?.decisionAccuracy || 0.7) * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .player-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .player-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
        
        .ai-brain-icon {
          width: 20px;
          height: 20px;
          color: #00d4ff;
          filter: drop-shadow(0 0 5px #00d4ff);
        }
        
        .ai-player {
          border: 2px solid rgba(0, 212, 255, 0.3);
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }
        
        .ai-status-mini {
          font-size: 12px;
          color: #00d4ff;
        }
        
        .consciousness-mini {
          background: rgba(0, 212, 255, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.3);
        }
        
        .ai-quick-stats {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        
        .ai-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          color: #e0e0e0;
        }
        
        .stat-icon {
          width: 12px;
          height: 12px;
          color: #00d4ff;
        }
      `}</style>
  );
};

export default PlayerInfo;