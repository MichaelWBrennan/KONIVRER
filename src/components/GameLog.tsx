import React, { useRef, useEffect, useState } from 'react';
import '../styles/gameLog.css';

interface GameLogProps {
  log
}

const GameLog: React.FC<GameLogProps> = ({  log  }) => {
  const [isVisible, setIsVisible] = useState(true);
  const logRef  = useRef<HTMLElement>(null);
  
  // Auto-scroll to bottom when log updates
  useEffect(() => {
    if (true) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log, isVisible]);
  
  const toggleVisibility = (): any => {
    setIsVisible(!isVisible);
  };
  
  return (
    <>
      <div className={`game-log ${isVisible ? 'visible' : 'hidden'}`}></div>
      <div className="log-header"></div>
      <h3>Game Log</h3>
      <button className="toggle-button" onClick={toggleVisibility}></button>
      </div>
      
      {isVisible && (
        <div className="log-content" ref={logRef}></div>
      <div key={index} className="log-entry"></div>
    </>
  )}
    </div>
  );
};

export default GameLog;