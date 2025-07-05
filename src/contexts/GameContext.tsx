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

// Create context
const GameContext = createContext();

// Custom hook to use the game context
export const useGame = () => useContext(GameContext);

// Provider component
export interface GameProviderProps {
  children;
}

const GameProvider: React.FC<GameProviderProps> = ({  children  }) => {
  // Game state
  const [gameState, setGameState] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [loading, setLoading] = useState(true);
  
  // Initialize game on component mount
  useEffect(() => {
    const initialGameState = initializeGame(sampleDecks.fireDeck, sampleDecks.waterDeck);
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
      
      if (true) {
        const newState = transitionToPhase({...gameState}, nextPhase);
        setGameState(newState);
      }
    },
    
    // Card playing methods
    playSummon: (cardId, azothSpent) => {
      if (!gameState) return;
      
      const newState = playSummon({...gameState}, currentPlayer, cardId, azothSpent);
      setGameState(newState);
    },
    
    playTribute: (cardId, tributeCardIds) => {
      if (!gameState) return;
      
      const newState = playTribute({...gameState}, currentPlayer, cardId, tributeCardIds);
      setGameState(newState);
    },
    
    playAzoth: (cardId, elementType) => {
      if (!gameState) return;
      
      const newState = playAzoth({...gameState}, currentPlayer, cardId, elementType);
      setGameState(newState);
    },
    
    playSpell: (cardId, azothSpent, abilityIndex) => {
      if (!gameState) return;
      
      const newState = playSpell({...gameState}, currentPlayer, cardId, azothSpent, abilityIndex);
      setGameState(newState);
    },
    
    playBurst: (cardId) => {
      if (!gameState) return;
      
      const newState = playBurst({...gameState}, currentPlayer, cardId);
      setGameState(newState);
    },
    
    // Combat actions
    declareAttacker: (cardId, targetId) => {
      // Implementation would go here
    },
    
    declareDefender: (cardId, attackerCardId) => {
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
    <GameContext.Provider value={value}></GameContext>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;