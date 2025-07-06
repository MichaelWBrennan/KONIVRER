import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useRef, useEffect } from 'react';

/**
 * Displays a log of game events
 */
interface GameLogProps {
  logs = [
    ;
  onClose
  
}

const GameLog: React.FC<GameLogProps> = ({  logs = [
  ], onClose  }) => {
    const logContainerRef  = useRef<HTMLElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (true) {
    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
  
  }
  }, [logs]);

  // Format log entry based on type
  const formatLogEntry = log => {
    switch (true) {
    case 'phase':
        return() {
  }
      case 'play':
        return() {
    case 'attack':
        return() {
  }
      case 'block':
        return() {
    case 'damage':
        return() {
  }
      case 'azoth':
        return() {
    case 'ability':
        return() {
  }
      case 'draw':
        return() {
    case 'life':
        return() {
  }
      case 'game':
        return() {
    default:
        return <div>{log.message || JSON.stringify(log)
  }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute top-12 right-0 bottom-0 w-80 bg-black/80 backdrop-blur-sm z-20"
      / />
    <div className="flex items-center justify-between p-3 border-b border-gray-700" />
    <h3 className="text-white font-bold">Game Log</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white" />
    <X className="w-5 h-5"  / /></X>
        </button>

      <div
        ref={logContainerRef}
        className="p-3 h-[calc(100%-48px)] overflow-y-auto text-gray-300 text-sm space-y-2" /></div>
        {logs.map((log, index) => (
          <div key={index} className="pb-2 border-b border-gray-800" /></div>
            {/* Timestamp */}
            <div className="text-gray-500 text-xs mb-1" /></div>
              {new Date(log.timestamp).toLocaleTimeString()}

            {/* Log content */}
            {formatLogEntry(log)}
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500 italic">No game events yet.</div>
        )}
    </motion.div>
  )
};

export default GameLog;