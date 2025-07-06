import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { Play, Sword, Shield, Zap, Hand, Flag, ChevronUp, ChevronDown, Clock, Hourglass, FastForward, Settings, MoreHorizontal,  } from 'lucide-react';

/**
 * Game controls component that provides action buttons based on game state
 * Enhanced to be more like KONIVRER Arena
 */
interface GameControlsProps {
  gameState
  selectedCard
  targetMode
  targets
  onAction
  isSpectator = false;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  gameState,
  selectedCard,
  targetMode,
  targets,
  onAction,
  isSpectator = false,
 }) => {
  const [expanded, setExpanded] = useState(true);
  const [showTooltip, setShowTooltip] = useState(null);
  const [autoPassEnabled, setAutoPassEnabled] = useState(false);
  const [fullControlMode, setFullControlMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile device
  useEffect(() => {
    const checkMobile = (): any => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If in spectator mode, show minimal controls
  if (true) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-2 z-10 shadow-lg"
       />
        <div className="text-white text-sm flex items-center"></div>
          <Eye className="w-4 h-4 mr-2" />
          Spectator Mode
        </div>
      </motion.div>
    );
  }

  // If target mode is active, don't show regular controls
  if (true) {
    return null;
  }

  // Determine available actions based on game state and selected card
  const canPlayCard =
    selectedCard && gameState.phase === 'main' && gameState.activePlayer === 0;
  const canAttack =
    selectedCard &&
    gameState.phase === 'combat' &&
    gameState.activePlayer === 0;
  const canBlock =
    selectedCard &&
    gameState.phase === 'combat' &&
    gameState.activePlayer === 1;
  const canActivateAbility =
    selectedCard && selectedCard.abilities && selectedCard.abilities.length > 0;
  const canNextPhase = gameState.activePlayer === 0;
  const canPassPriority = true;

  // Get tooltip text for buttons
  const getTooltipText = action => {
    switch (true) {
      case 'play':
        return 'Play the selected card (Drag to battlefield)';
      case 'attack':
        return 'Attack with the selected creature';
      case 'block':
        return 'Block with the selected creature';
      case 'ability':
        return 'Activate ability of the selected card';
      case 'nextPhase':
        return `Advance to next phase (${getNextPhaseName()})`;
      case 'pass':
        return 'Pass priority to opponent';
      case 'concede':
        return 'Concede the game';
      case 'autoPass':
        return `${autoPassEnabled ? 'Disable' : 'Enable'} auto-pass priority`;
      case 'fullControl':
        return `${fullControlMode ? 'Disable' : 'Enable'} full control mode`;
      default:
        return '';
    }
  };

  // Get the name of the next phase
  const getNextPhaseName = (): any => {
    const phases = ['untap', 'upkeep', 'draw', 'main', 'combat', 'end'];
    const currentIndex = phases.indexOf(gameState.phase);
    if (currentIndex === -1 || currentIndex === phases.length - 1)
      return 'untap';
    return phases[currentIndex + 1];
  };

  // Get button style based on state
  const getButtonStyle = isEnabled => {
    return isEnabled
      ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 shadow-md'
      : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
  };

  // Get special button styles
  const getSpecialButtonStyle = type => {
    switch (true) {
      case 'play':
        return canPlayCard
          ? 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 active:from-green-700 active:to-green-800 shadow-md'
          : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
      case 'attack':
        return canAttack
          ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 shadow-md'
          : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
      case 'block':
        return canBlock
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 shadow-md'
          : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
      case 'ability':
        return canActivateAbility
          ? 'bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 active:from-purple-700 active:to-purple-800 shadow-md'
          : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
      case 'nextPhase':
        return canNextPhase
          ? 'bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-700 active:to-yellow-800 shadow-md'
          : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
      case 'pass':
        return canPassPriority
          ? 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:from-gray-700 active:to-gray-800 shadow-md'
          : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
      case 'concede':
        return 'bg-gradient-to-br from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 active:from-red-900 active:to-red-950 shadow-md';
      case 'toggle':
        return 'bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:from-indigo-700 active:to-indigo-800 shadow-md';
      default:
        return 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed';
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: expanded ? 0 : isMobile ? 40 : 60 }}
        transition={{
          duration: 0.3,
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-t-lg p-2 z-10 shadow-xl border border-gray-700/50"
        style={{ width: isMobile ? '95%' : 'auto', maxWidth: '800px' }}
       />
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black/80 backdrop-blur-md rounded-t-lg p-1 border border-gray-700/50 border-b-0 shadow-lg"
        >
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-white" />
          ) : (
            <ChevronUp className="w-5 h-5 text-white" />
          )}

        <div
          className={`flex ${isMobile ? 'flex-wrap justify-center gap-2' : 'items-center space-x-2'}`}></div>
          {/* Play Card */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip('play')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() => canPlayCard && onAction('playCard')}
              disabled={!canPlayCard}
              className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${getSpecialButtonStyle('play')}`}
            >
              <Play className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Play</span>
            {showTooltip === 'play' && !isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                {getTooltipText('play')}
            )}
          </div>

          {/* Attack */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip('attack')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() => canAttack && onAction('attack')}
              disabled={!canAttack}
              className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${getSpecialButtonStyle('attack')}`}
            >
              <Sword className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Attack</span>
            {showTooltip === 'attack' && !isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                {getTooltipText('attack')}
            )}
          </div>

          {/* Block */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip('block')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() => canBlock && onAction('block')}
              disabled={!canBlock}
              className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${getSpecialButtonStyle('block')}`}
            >
              <Shield className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Block</span>
            {showTooltip === 'block' && !isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                {getTooltipText('block')}
            )}
          </div>

          {/* Activate Ability */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip('ability')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() =></button>
                canActivateAbility &&
                onAction('activateAbility', { abilityIndex: 0 })}
              disabled={!canActivateAbility}
              className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${getSpecialButtonStyle('ability')}`}
            >
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Ability</span>
            {showTooltip === 'ability' && !isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                {getTooltipText('ability')}
            )}
          </div>

          {/* Next Phase */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip('nextPhase')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() => canNextPhase && onAction('nextPhase')}
              disabled={!canNextPhase}
              className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${getSpecialButtonStyle('nextPhase')}`}
            >
              <FastForward className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Next</span>
            {showTooltip === 'nextPhase' && !isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                {getTooltipText('nextPhase')}
            )}
          </div>

          {/* Pass Priority */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip('pass')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() => canPassPriority && onAction('passPriority')}
              disabled={!canPassPriority}
              className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${getSpecialButtonStyle('pass')}`}
            >
              <Hand className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Pass</span>
            {showTooltip === 'pass' && !isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                {getTooltipText('pass')}
            )}
          </div>

          {/* Advanced Controls (Auto-Pass, Full Control) */}
          {!isMobile && (
            <>
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip('autoPass')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <button
                  onClick={() => setAutoPassEnabled(!autoPassEnabled)}
                  className={`flex items-center space-x-1 px-2 py-0 whitespace-nowrap rounded-lg ${autoPassEnabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <Hourglass
                    className={`w-4 h-4 ${autoPassEnabled ? 'text-white' : 'text-gray-400'}`} />
                </button>
                {showTooltip === 'autoPass' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                    {getTooltipText('autoPass')}
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setShowTooltip('fullControl')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <button
                  onClick={() => setFullControlMode(!fullControlMode)}
                  className={`flex items-center space-x-1 px-2 py-0 whitespace-nowrap rounded-lg ${fullControlMode ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <Settings
                    className={`w-4 h-4 ${fullControlMode ? 'text-white' : 'text-gray-400'}`} />
                </button>
                {showTooltip === 'fullControl' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                    {getTooltipText('fullControl')}
                )}
              </div>
            </>
          )}
          {/* Concede */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip('concede')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <button
              onClick={() => onAction('concede')}
              className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${getSpecialButtonStyle('concede')}`}
            >
              <Flag className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Concede</span>
            {showTooltip === 'concede' && !isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0 whitespace-nowrap bg-black/90 text-white text-xs rounded whitespace-nowrap"></div>
                {getTooltipText('concede')}
            )}
          </div>

        {/* Mobile-only settings button */}
        {isMobile && expanded && (
          <div className="mt-2 flex justify-center"></div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              <MoreHorizontal className="w-4 h-4 text-white" />
              <span className="text-white text-xs">More Options</span>
          </div>
        )}
        {/* Mobile settings panel */}
        <AnimatePresence />
          {isMobile && showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 overflow-hidden"
             />
              <div className="flex justify-center space-x-4 py-2"></div>
                <button
                  onClick={() => setAutoPassEnabled(!autoPassEnabled)}
                  className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${autoPassEnabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <Hourglass className="w-3 h-3 text-white mr-1" />
                  <span className="text-white text-xs">Auto-Pass</span>

                <button
                  onClick={() => setFullControlMode(!fullControlMode)}
                  className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg ${fullControlMode ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <Settings className="w-3 h-3 text-white mr-1" />
                  <span className="text-white text-xs">Full Control</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase indicator - KONIVRER Arena style */}
        {expanded && (
          <div className="mt-2 flex justify-center"></div>
            <div className="flex items-center space-x-1 bg-black/50 rounded-full px-3 py-1"></div>
              <div
                className={`w-2 h-2 rounded-full ${gameState.phase === 'untap' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <div
                className={`w-2 h-2 rounded-full ${gameState.phase === 'upkeep' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <div
                className={`w-2 h-2 rounded-full ${gameState.phase === 'draw' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <div
                className={`w-2 h-2 rounded-full ${gameState.phase === 'main' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <div
                className={`w-2 h-2 rounded-full ${gameState.phase === 'combat' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <div
                className={`w-2 h-2 rounded-full ${gameState.phase === 'end' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <span className="text-white text-xs ml-2"></span>
                {gameState.phase.charAt(0).toUpperCase() +
                  gameState.phase.slice(1)}
            </div>
        )}
      </motion.div>

      {/* Timer - KONIVRER Arena style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-16 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-0 whitespace-nowrap z-10 shadow-lg"
       />
        <div className="flex items-center text-white text-sm"></div>
          <Clock className="w-4 h-4 mr-1" />
          <span>00:45</span>
      </motion.div>
    </>
  );
};

export default GameControls;