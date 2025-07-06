import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified Game Controls
 * 
 * A unified game controls component that combines functionality from:
 * - GameControls
 * - KonivrERGameControls
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { Clock, Sword, Zap, RefreshCw, ChevronRight, X, Flame, Droplets, Mountain, Wind, Sun, Moon } from 'lucide-react';

interface UnifiedGameControlsProps {
  // Common props
  gamePhase?: string;
  turn?: number;
  activePlayer?: string;
  onEndPhase?: () => void;
  onEndTurn?: () => void;
  onPass?: () => void;
  
  // KonivrER specific props
  elementalEnergy?: {
    fire: number;
    water: number;
    earth: number;
    air: number;
    light: number;
    dark: number;
  };
  onElementalAction?: (element: string) => void;,
  
  // Style variant
  variant?: 'standard' | 'konivrer' | 'arena';
  
  // Additional props
  className?: string;
  disabled?: boolean;
  showTimer?: boolean;
  timeRemaining?: number;
  isSpectator?: boolean;
}

const UnifiedGameControls: React.FC<UnifiedGameControlsProps> = ({
  // Default props
  gamePhase = 'main',
  turn = 1,
  activePlayer = 'player',
  onEndPhase = () => {}
  onEndTurn = () => {}
  onPass = () => {}
  elementalEnergy = { fire: 0, water: 0, earth: 0, air: 0, light: 0, dark: 0 },
  onElementalAction = () => {}
  variant = 'standard',
  className = '',
  disabled = false,
  showTimer = true,
  timeRemaining = 30,
  isSpectator = false
}) => {
  // State
  const [autoPass, setAutoPass] = useState(false);
  const [showPhaseDetails, setShowPhaseDetails] = useState(false);
  
  // Phase descriptions
  const phaseDescriptions = {
    start: "Draw a card and activate start-of-turn effects",
    main: "Play cards from your hand and activate abilities",
    combat: "Declare attackers and resolve combat",
    refresh: "Refresh your cards and end your turn"
  };
  
  // Timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle auto-pass toggle
  const toggleAutoPass = (): void => {
    setAutoPass(!autoPass);
  };
  
  // Render controls based on variant
  const renderControls = () => {
    switch (variant) {
      case 'konivrer':
        return (
          <div className="konivrer-controls">
            {/* Phase indicators */}
            <div className="phase-indicators">
              <button 
                className={`phase-button ${gamePhase === 'start' ? 'active' : ''}`}
                onClick={() => setShowPhaseDetails(!showPhaseDetails)}
              >
                <RefreshCw size={16} />
                <span>Start</span>
              </button>
              <ChevronRight size={16} className="phase-arrow" />
              
              <button 
                className={`phase-button ${gamePhase === 'main' ? 'active' : ''}`}
                onClick={() => setShowPhaseDetails(!showPhaseDetails)}
              >
                <Zap size={16} />
                <span>Main</span>
              </button>
              <ChevronRight size={16} className="phase-arrow" />
              
              <button 
                className={`phase-button ${gamePhase === 'combat' ? 'active' : ''}`}
                onClick={() => setShowPhaseDetails(!showPhaseDetails)}
              >
                <Sword size={16} />
                <span>Combat</span>
              </button>
              <ChevronRight size={16} className="phase-arrow" />
              
              <button 
                className={`phase-button ${gamePhase === 'refresh' ? 'active' : ''}`}
                onClick={() => setShowPhaseDetails(!showPhaseDetails)}
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
            
            {/* Elemental energy display */}
            <div className="elemental-energy">
              <div className="element fire" onClick={() => onElementalAction('fire')}>
                <Flame size={16} />
                <span>{elementalEnergy.fire}</span>
              </div>
              <div className="element water" onClick={() => onElementalAction('water')}>
                <Droplets size={16} />
                <span>{elementalEnergy.water}</span>
              </div>
              <div className="element earth" onClick={() => onElementalAction('earth')}>
                <Mountain size={16} />
                <span>{elementalEnergy.earth}</span>
              </div>
              <div className="element air" onClick={() => onElementalAction('air')}>
                <Wind size={16} />
                <span>{elementalEnergy.air}</span>
              </div>
              <div className="element light" onClick={() => onElementalAction('light')}>
                <Sun size={16} />
                <span>{elementalEnergy.light}</span>
              </div>
              <div className="element dark" onClick={() => onElementalAction('dark')}>
                <Moon size={16} />
                <span>{elementalEnergy.dark}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="action-buttons">
              <button 
                className="primary-button"
                onClick={onEndPhase}
                disabled={disabled || isSpectator}
              >
                End Phase
              </button>
              <button 
                onClick={onPass}
                disabled={disabled || isSpectator}
              >
                Pass
              </button>
              <button 
                className={`auto-pass-button ${autoPass ? 'active' : ''}`}
                onClick={toggleAutoPass}
                disabled={disabled || isSpectator}
              >
                Auto-Pass
              </button>
            </div>
          </div>
        );
        
      case 'arena':
        return (
          <div className="arena-controls">
            {/* Turn indicator */}
            <div className="turn-indicator">
              <Clock size={16} />
              <span>Turn {turn}</span>
              <span className={`active-player ${activePlayer === 'opponent' ? 'opponent' : 'player'}`}>
                {activePlayer === 'opponent' ? 'Opponent' : 'Your'} Turn
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="action-buttons">
              <button 
                className="primary-button"
                onClick={onEndTurn}
                disabled={disabled || isSpectator || activePlayer === 'opponent'}
              >
                End Turn
              </button>
              <button 
                onClick={onPass}
                disabled={disabled || isSpectator}
              >
                Pass
              </button>
              <button 
                className={`auto-pass-button ${autoPass ? 'active' : ''}`}
                onClick={toggleAutoPass}
                disabled={disabled || isSpectator}
              >
                Auto
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="standard-controls">
            {/* Phase display */}
            <div className="phase-display">
              <span className="phase-name">{gamePhase.toUpperCase()}</span>
              <span className="turn-number">Turn {turn}</span>
            </div>
            
            {/* Action buttons */}
            <div className="action-buttons">
              <button 
                className="primary-button"
                onClick={onEndPhase}
                disabled={disabled || isSpectator}
              >
                End Phase
              </button>
              <button 
                onClick={onPass}
                disabled={disabled || isSpectator}
              >
                Pass
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className={`unified-game-controls ${variant} ${className}`}>
      {renderControls()}
      
      {/* Timer */}
      {showTimer && !isSpectator && (
        <div className={`timer ${timeRemaining < 10 ? 'low' : ''}`}>
          <Clock size={16} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      )}
      
      {/* Phase details tooltip */}
      <AnimatePresence>
        {showPhaseDetails && (
          <motion.div 
            className="phase-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="details-header">
              <h4>{gamePhase.toUpperCase()} PHASE</h4>
              <button onClick={() => setShowPhaseDetails(false)}>
                <X size={16} />
              </button>
            </div>
            <p>{phaseDescriptions[gamePhase] || "Perform actions according to the current phase"}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedGameControls;