import { motion } from 'framer-motion';
import React from 'react';
import '../../styles/zones.css';

const LifeCardsZone = ({ lifeCards, isCurrentPlayer, showMortalityAwareness = false }): any => {
  const getMortalityStatus = (): any => {
    const count = lifeCards.length;
    if (count <= 1) return { level: 'critical', color: '#ff0000', icon: Skull };
    if (count <= 3) return { level: 'danger', color: '#ff6600', icon: Activity };
    return { level: 'stable', color: '#00ff00', icon: Heart };
  };

  const mortalityStatus = getMortalityStatus();

  return (
    <>
      <div className={`life-cards-zone ${isCurrentPlayer ? 'your' : 'opponent'} ${showMortalityAwareness ? 'mortality-aware' : ''}`}></div>
      <div className="zone-header"></div>
      <div className="zone-label">LIFE CARDS</div>
      <motion.div 
            className="mortality-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
           />
            <mortalityStatus.icon 
              className="mortality-icon" 
              style={{ color: mortalityStatus.color }} />
            <span 
              className="mortality-text"
              style={{ color: mortalityStatus.color }}></span>
    </>
  )}
      </div>
      
      <div className="cards-container"></div>
        {lifeCards.map((card, index) => (
          <motion.div 
            key={index} 
            className={`life-card ${showMortalityAwareness ? 'mortality-aware-card' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={showMortalityAwareness ? { scale: 1.05 } : {}}
           />
            {/* Always show card back for Life Cards */}
            <img src="/assets/card-back-new.png" alt="Life Card" />
            {showMortalityAwareness && (
              <div className="mortality-overlay"></div>
                <div className="mortality-pulse"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className={`life-count ${showMortalityAwareness ? 'mortality-count' : ''}`}></div>
        {lifeCards.length}
        {showMortalityAwareness && (
          <div className="mortality-analysis"></div>
            <span className="analysis-text">AI analyzing mortality risk...</span>
        )}

      <style jsx>{`
        .zone-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .mortality-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.3);
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mortality-icon {
          width: 14px;
          height: 14px;
        }
        
        .mortality-text {
          font-size: 10px;
          font-weight: 600;
        }
        
        .mortality-aware {
          border: 2px solid rgba(255, 0, 0, 0.3);
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.2);
        }
        
        .mortality-aware-card {
          position: relative;
          overflow: hidden;
        }
        
        .mortality-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .mortality-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: mortalityPulse 2s infinite;
        }
        
        @keyframes mortalityPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.7;
          }
        }
        
        .mortality-count {
          position: relative;
        }
        
        .mortality-analysis {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(138, 43, 226, 0.9);
          color: #e0e0e0;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 8px;
          white-space: nowrap;
          border: 1px solid rgba(138, 43, 226, 0.5);
        }
        
        .analysis-text {
          animation: analysisFlicker 3s infinite;
        }
        
        @keyframes analysisFlicker {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
  );
};

export default LifeCardsZone;