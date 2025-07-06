import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeGame } from '../engine/gameState';
import { transitionToPhase } from '../engine/gamePhases';
import {
  playSummon, 
  playTribute, 
  playAzoth, 
  playSpell, 
  playBurst 
} from '../engine/cardActions';
import { sampleDecks } from '../data/cardData';

// Create context with a default value
const GameContext = createContext<any>(null);

// Custom hook to use the game context
export const useGame = (): any => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Provider component
export interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Game state
  const [gameState, setGameState] = useState<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string>('player1');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Initialize game on component mount
  useEffect(() => {
    const initialGameState = initializeGame();
    setGameState(initialGameState);
    setLoading(false);
  }, []);
  
  // Game actions
  const actions = {
    // Phase transitions
    nextPhase: () => {
      if (!gameState) return;
      
      // Determine next phase based on current phase
      const phaseTransitions = {
        'START': 'MAIN',
        'MAIN': 'COMBAT',
        'COMBAT': 'POST_COMBAT_MAIN',
        'POST_COMBAT_MAIN': 'REFRESH',
        'REFRESH': 'START'
      };
      
      const nextPhase = phaseTransitions[gameState.phase];
      
      if (nextPhase) {
        const newState = transitionToPhase(gameState, nextPhase);
        setGameState(newState);
      }
    },
    
    // Card playing methods
    playSummon: (cardId: string, azothSpent: number) => {
      if (!gameState) return;
      
      const newState = playSummon(gameState, cardId, azothSpent);
      setGameState(newState);
    },
    
    playTribute: (cardId: string, tributeCardIds: string[]) => {
      if (!gameState) return;
      
      const newState = playTribute(gameState, cardId, tributeCardIds);
      setGameState(newState);
    },
    
    playAzoth: (cardId: string, elementType: string) => {
      if (!gameState) return;
      
      const newState = playAzoth(gameState, cardId, elementType);
      setGameState(newState);
    },
    
    playSpell: (cardId: string, azothSpent: number, abilityIndex: number) => {
      if (!gameState) return;
      
      const newState = playSpell(gameState, cardId, azothSpent, abilityIndex);
      setGameState(newState);
    },
    
    playBurst: (cardId: string) => {
      if (!gameState) return;
      
      const newState = playBurst(gameState, cardId);
      setGameState(newState);
    },
    
    // Combat actions
    declareAttacker: (cardId: string, targetId: string) => {
      // Implementation would go here
    },
    
    declareDefender: (cardId: string, attackerCardId: string) => {
      // Implementation would go here
    },
    
    resolveCombat: () => {
      // Implementation would go here
    }
  };
  
  // Context value
  const value = {
    gameState,
    setGameState,
    currentPlayer,
    setCurrentPlayer,
    loading,
    actions
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export { GameProvider };
export default GameContext;