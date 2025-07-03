import React, { useRef, useEffect, useState } from 'react';
import '../styles/gameLog.css';

const GameLog = ({ log }) => {
  const [isVisible, setIsVisible] = useState(true);
  const logRef = useRef(null);
  
  // Auto-scroll to bottom when log updates
  useEffect(() => {
    if (logRef.current && isVisible) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log, isVisible]);
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  return (
    <div className={`game-log ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="log-header">
        <h3>Game Log</h3>
        <button className="toggle-button" onClick={toggleVisibility}>
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {isVisible && (
        <div className="log-content" ref={logRef}>
          {log.map((entry, index) => (
            <div key={index} className="log-entry">
              {entry}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameLog;