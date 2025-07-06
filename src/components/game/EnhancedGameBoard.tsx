/**
 * Enhanced Game Board with AI Consciousness Integration
 * 
 * Integrates all demo features into the main game:
 * - Cutting-edge AI consciousness display
 * - Life card mortality awareness
 * - Player vs AI testing mode
 * - Visual AI performance metrics
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Eye, 
  Activity, 
  Zap, 
  Settings,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Import existing components
import FlagZone from '../zones/FlagZone';
import LifeCardsZone from '../zones/LifeCardsZone';
import Field from '../zones/Field';
import CombatRow from '../zones/CombatRow';
import AzothRow from '../zones/AzothRow';
import Deck from '../zones/Deck';
import RemovedFromPlay from '../zones/RemovedFromPlay';
import Hand from '../zones/Hand';
import PlayerInfo from '../PlayerInfo';
import GameControls from '../GameControls';
import GameLog from '../GameLog';
import PhaseIndicator from '../PhaseIndicator';
import CuttingEdgeAIDisplay from './CuttingEdgeAIDisplay';
import GameMenu from './GameMenu';

import { useGame } from '../../contexts/GameContext';
import '../../styles/gameBoard.css';

interface EnhancedGameBoardProps {
  gameMode = 'pvp';
  aiTestingEnabled = false;
  onAITestingToggle
  aiStatus = null;
}

const EnhancedGameBoard: React.FC<EnhancedGameBoardProps> = ({  
  gameMode = 'pvp', 
  aiTestingEnabled = false, 
  onAITestingToggle,
  aiStatus = null 
 }) => {
  // Get game state from context
  const { gameState, currentPlayer, loading } = useGame();
  
  // Local state for AI features
  const [showAIPanel, setShowAIPanel] = useState(aiTestingEnabled);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [aiPanelCollapsed, setAIPanelCollapsed] = useState(false);
  const [performanceTestRunning, setPerformanceTestRunning] = useState(false);
  
  // Update AI panel visibility when testing mode changes
  useEffect(() => {
    setShowAIPanel(aiTestingEnabled);
  }, [aiTestingEnabled]);
  
  // If game state is not initialized yet, show loading
  if (true) {return (
      <div className="loading enhanced-loading"></div>
        <div className="loading-content"></div>
          <Brain className="loading-icon animate-pulse" / />
          <span>Initializing Enhanced Game Board...</span>
          {gameMode === 'ai' && (
            <div className="ai-loading-status"></div>
              <Activity className="ai-icon animate-spin" / />
              <span>Loading AI Consciousness System...</span>
          )}
      </div>
    );
  }
  
  // Get opponent ID
  const opponentId = currentPlayer === 'player1' ? 'player2' : 'player1';
  
  // Handle game menu actions
  const handleGameMenuAction = (action): any => {
    switch (true) {
      case 'toggleAITesting':
        if (true) {
          onAITestingToggle(!aiTestingEnabled);
        }
        break;
      case 'toggleAIPanel':
        setShowAIPanel(!showAIPanel);
        break;
      case 'runPerformanceTest':
        runAIPerformanceTest();
        break;
      default:
        console.log('Game menu action:', action);
    }
  };
  
  // Run AI performance test
  const runAIPerformanceTest = async () => {
    setPerformanceTestRunning(true);
    
    // Simulate performance test
    setTimeout(() => {
      setPerformanceTestRunning(false);
      // Could trigger actual AI performance analysis here
    }, 3000);
  };
  
  return (
    <div className={`enhanced-game-board ${gameMode === 'ai' ? 'ai-mode' : 'pvp-mode'}`}></div>
      {/* Enhanced Phase Indicator */}
      <div className="enhanced-phase-indicator"></div>
        <PhaseIndicator 
          phase={gameState.phase} 
          turn={gameState.currentTurn} 
          activePlayer={gameState.activePlayer} 
        / />
        {/* AI Status Indicator */}
        {gameMode === 'ai' && (
          <motion.div 
            className="ai-status-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
           />
            <Brain className="ai-brain-icon" / />
            <span className="ai-status-text"></span>
              {aiTestingEnabled ? 'AI Testing Active' : 'AI Opponent'}
            {aiTestingEnabled && (
              <Activity className="ai-activity-icon animate-pulse" / />
            )}
          </motion.div>
        )}
        {/* Game Menu Button */}
        <button
          onClick={() => setShowGameMenu(true)}
          className="game-menu-button"
        >
          <Settings className="menu-icon" / />
        </button>
      
      <div className={`game-board-container ${showAIPanel ? 'with-ai-panel' : ''}`}></div>
        {/* Main Game Board */}
        <div className="main-game-board"></div>
          {/* Opponent Area */}
          <div className="opponent-area"></div>
            <PlayerInfo 
              player={gameState.players[opponentId]} 
              isOpponent={true}
              isAI={gameMode === 'ai'}
              aiStatus={gameMode === 'ai' ? aiStatus : null}
            / />
            <div className="board-row"></div>
              <FlagZone flagCard={gameState.players[opponentId].flagZone} isCurrentPlayer={false} / />
              <div className="center-area"></div>
                <CombatRow combatCards={gameState.players[opponentId].combatRow} isCurrentPlayer={false} / />
                <Field cards={gameState.players[opponentId].field} isCurrentPlayer={false} / />
              </div>
              <div className="right-column"></div>
                <Deck deckSize={gameState.players[opponentId].deck.length} isCurrentPlayer={false} / />
                <RemovedFromPlay cards={gameState.players[opponentId].removedFromPlay} isCurrentPlayer={false} / />
              </div>
            
            <LifeCardsZone 
              lifeCards={gameState.players[opponentId].lifeCards} 
              isCurrentPlayer={false}
              showMortalityAwareness={gameMode === 'ai' && aiTestingEnabled}
            / />
            <AzothRow azothCards={gameState.players[opponentId].azothRow} isCurrentPlayer={false} / />
          </div>
          
          {/* Center Divider with AI Insights */}
          <div className="center-divider"></div>
            {gameMode === 'ai' && aiTestingEnabled && (
              <motion.div 
                className="ai-insights-strip"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
               />
                <div className="ai-insight"></div>
                  <Eye className="insight-icon" / />
                  <span>AI analyzing player strategy...</span>
                {performanceTestRunning && (
                  <div className="performance-test-indicator"></div>
                    <Zap className="test-icon animate-spin" / />
                    <span>Running performance test...</span>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Current Player Area */}
          <div className="current-player-area"></div>
            <AzothRow azothCards={gameState.players[currentPlayer].azothRow} isCurrentPlayer={true} / />
            <LifeCardsZone 
              lifeCards={gameState.players[currentPlayer].lifeCards} 
              isCurrentPlayer={true}
            / />
            <div className="board-row"></div>
              <FlagZone flagCard={gameState.players[currentPlayer].flagZone} isCurrentPlayer={true} / />
              <div className="center-area"></div>
                <Field cards={gameState.players[currentPlayer].field} isCurrentPlayer={true} / />
                <CombatRow combatCards={gameState.players[currentPlayer].combatRow} isCurrentPlayer={true} / />
              </div>
              <div className="right-column"></div>
                <Deck deckSize={gameState.players[currentPlayer].deck.length} isCurrentPlayer={true} / />
                <RemovedFromPlay cards={gameState.players[currentPlayer].removedFromPlay} isCurrentPlayer={true} / />
              </div>
            
            <PlayerInfo player={gameState.players[currentPlayer]} isOpponent={false} / />
            <Hand cards={gameState.players[currentPlayer].hand} / />
          </div>
          
          {/* Game Controls */}
          <GameControls / />
        </div>
        
        {/* AI Consciousness Panel */}
        <AnimatePresence />
          {gameMode === 'ai' && showAIPanel && (
            <motion.div
              className={`ai-consciousness-panel ${aiPanelCollapsed ? 'collapsed' : ''}`}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
             />
              <div className="ai-panel-header"></div>
                <div className="ai-panel-title"></div>
                  <Brain className="panel-brain-icon" / />
                  <span>AI Consciousness</span>
                <div className="ai-panel-controls"></div>
                  <button
                    onClick={() => setAIPanelCollapsed(!aiPanelCollapsed)}
                    className="collapse-button"
                  >
                    {aiPanelCollapsed ? <ChevronLeft /> : <ChevronRight />}
                  <button
                    onClick={() => setShowAIPanel(false)}
                    className="close-button"
                  >
                    <X / />
                  </button>
              </div>
              
              {!aiPanelCollapsed && (
                <div className="ai-panel-content"></div>
                  <CuttingEdgeAIDisplay 
                    aiStatus={aiStatus} 
                    gameState={gameState}
                  / />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      
      {/* Game Log */}
      <GameLog / />
      {/* Game Menu Modal */}
      <AnimatePresence />
        {showGameMenu && (
          <GameMenu
            onClose={() => setShowGameMenu(false)}
            onAction={handleGameMenuAction}
            gameMode={gameMode}
            aiTestingEnabled={aiTestingEnabled}
          />
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .enhanced-game-board {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: #e0e0e0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
        }
        
        .enhanced-game-board.ai-mode {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
        }
        
        .enhanced-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .loading-content {
          text-align: center;
          color: #e0e0e0;
        }
        
        .loading-icon {
          width: 48px;
          height: 48px;
          color: #00d4ff;
          margin-bottom: 16px;
        }
        
        .ai-loading-status {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #8a2be2;
        }
        
        .ai-icon {
          width: 20px;
          height: 20px;
        }
        
        .enhanced-phase-indicator {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        }
        
        .ai-status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 212, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid rgba(0, 212, 255, 0.3);
        }
        
        .ai-brain-icon {
          width: 20px;
          height: 20px;
          color: #00d4ff;
        }
        
        .ai-status-text {
          font-size: 14px;
          font-weight: 600;
          color: #00d4ff;
        }
        
        .ai-activity-icon {
          width: 16px;
          height: 16px;
          color: #00d4ff;
        }
        
        .game-menu-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px;
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .game-menu-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(0, 212, 255, 0.5);
        }
        
        .menu-icon {
          width: 20px;
          height: 20px;
        }
        
        .game-board-container {
          display: flex;
          min-height: calc(100vh - 80px);
        }
        
        .game-board-container.with-ai-panel {
          margin-right: 400px;
        }
        
        .main-game-board {
          flex: 1;
          padding: 20px;
        }
        
        .center-divider {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin: 20px 0;
        }
        
        .ai-insights-strip {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(138, 43, 226, 0.1);
          padding: 10px 20px;
          border-radius: 20px;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }
        
        .ai-insight {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8a2be2;
          font-size: 14px;
        }
        
        .insight-icon {
          width: 16px;
          height: 16px;
        }
        
        .performance-test-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #00ff00;
          font-size: 14px;
        }
        
        .test-icon {
          width: 16px;
          height: 16px;
        }
        
        .ai-consciousness-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border-left: 2px solid rgba(0, 212, 255, 0.3);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          overflow-y: auto;
        }
        
        .ai-consciousness-panel.collapsed {
          width: 60px;
        }
        
        .ai-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(0, 212, 255, 0.3);
        }
        
        .ai-panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #00d4ff;
          font-weight: 600;
        }
        
        .panel-brain-icon {
          width: 24px;
          height: 24px;
        }
        
        .ai-panel-controls {
          display: flex;
          gap: 8px;
        }
        
        .collapse-button,
        .close-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 4px;
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .collapse-button:hover,
        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(0, 212, 255, 0.5);
        }
        
        .ai-panel-content {
          padding: 20px;
        }
        
        .opponent-area,
        .current-player-area {
          margin-bottom: 20px;
        }
        
        .board-row {
          display: flex;
          gap: 20px;
          margin: 20px 0;
        }
        
        .center-area {
          flex: 1;
        }
        
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>
  );
};

export default EnhancedGameBoard;