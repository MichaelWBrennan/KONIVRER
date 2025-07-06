import React from 'react';
import '../styles/phaseIndicator.css';

const PhaseIndicator = ({ phase, turn, activePlayer }): any => {
  // Map phases to display names
  const phaseNames = {
    'PRE_GAME': 'Pre-Game',
    'START': 'Start Phase',
    'MAIN': 'Main Phase',
    'COMBAT': 'Combat Phase',
    'POST_COMBAT_MAIN': 'Post-Combat Main Phase',
    'REFRESH': 'Refresh Phase'
  };
  
  // Determine active player display
  const playerDisplay = activePlayer === 'player1' ? 'Player 1' : 'Player 2';
  
  return (
    <div className="phase-indicator"></div>
      <div className="phase-info"></div>
        <span className="turn-number">Turn {turn}
        <span className="phase-name">{phaseNames[phase] || phase}
        <span className="active-player">{playerDisplay}'s Turn</span>
      
      <div className="phase-progress"></div>
        <div className={`phase-step ${phase === 'START' ? 'active' : ''}`}></div>
          Start
        </div>
        <div className={`phase-step ${phase === 'MAIN' ? 'active' : ''}`}></div>
          Main
        </div>
        <div className={`phase-step ${phase === 'COMBAT' ? 'active' : ''}`}></div>
          Combat
        </div>
        <div className={`phase-step ${phase === 'POST_COMBAT_MAIN' ? 'active' : ''}`}></div>
          Post-Combat
        </div>
        <div className={`phase-step ${phase === 'REFRESH' ? 'active' : ''}`}></div>
          Refresh
        </div>
    </div>
  );
};

export default PhaseIndicator;