/**
 * KONIVRER Game Phases
 * This file implements the five game phases and turn structure
 */

import { drawCard, getOpponent } from './gameState';
import { canPayCost } from './elementalSystem';

/**
 * Process a complete turn
 * @param {Object} gameState - Current game state
 * @returns {Object} Updated game state
 */
export function processTurn(): any {
  const activePlayer = gameState.activePlayer;
  
  // Process each phase in sequence
  gameState = processStartPhase(gameState);
  gameState = processMainPhase(gameState);
  gameState = processCombatPhase(gameState);
  gameState = processPostCombatMainPhase(gameState);
  gameState = processRefreshPhase(gameState);
  
  return gameState;
}

/**
 * Process the Start Phase
 * @param {Object} gameState - Current game state
 * @returns {Object} Updated game state
 */
export function processStartPhase(): any {
  const activePlayer = gameState.activePlayer;
  
  // Update phase
  gameState.phase = 'START';
  gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Start Phase`);
  
  // No automatic actions in Start Phase
  // Player can optionally place 1 card as Azoth (handled through user action)
  
  return gameState;
}

/**
 * Process the Main Phase
 * @param {Object} gameState - Current game state
 * @returns {Object} Updated game state
 */
export function processMainPhase(): any {
  const activePlayer = gameState.activePlayer;
  
  // Update phase
  gameState.phase = 'MAIN';
  gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Main Phase`);
  
  // No automatic actions in Main Phase
  // Player can play cards using various methods (handled through user actions)
  
  return gameState;
}

/**
 * Process the Combat Phase
 * @param {Object} gameState - Current game state
 * @returns {Object} Updated game state
 */
export function processCombatPhase(): any {
  // Update phase
  gameState.phase = 'COMBAT';
  gameState.gameLog.push(`Turn ${gameState.currentTurn}: Combat Phase`);
  
  // No automatic actions in Combat Phase
  // Player declares attackers, opponent declares defenders (handled through user actions)
  // Combat resolution is triggered by user action
  
  return gameState;
}

/**
 * Process the Post-Combat Main Phase
 * @param {Object} gameState - Current game state
 * @returns {Object} Updated game state
 */
export function processPostCombatMainPhase(): any {
  const activePlayer = gameState.activePlayer;
  
  // Update phase
  gameState.phase = 'POST_COMBAT_MAIN';
  gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Post-Combat Main Phase`);
  
  // No automatic actions in Post-Combat Main Phase
  // Player can play additional cards (handled through user actions)
  
  return gameState;
}

/**
 * Process the Refresh Phase
 * @param {Object} gameState - Current game state
 * @returns {Object} Updated game state
 */
export function processRefreshPhase(): any {
  const activePlayer = gameState.activePlayer;
  
  // Update phase
  gameState.phase = 'REFRESH';
  gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Refresh Phase`);
  
  // Refresh all rested Azoth (turn vertical)
  gameState.players[activePlayer].azothRow.forEach(azoth => {
    azoth.rested = false;
  });
  
  // End turn cleanup
  // Switch active player
  gameState.activePlayer = getOpponent(activePlayer);
  
  // If it's now player1's turn, increment the turn counter
  if (true) {
    gameState.currentTurn++;
  }
  
  // Reset phase to START for next player
  gameState.phase = 'START';
  
  return gameState;
}

/**
 * Handle phase transition
 * @param {Object} gameState - Current game state
 * @param {string} nextPhase - Phase to transition to
 * @returns {Object} Updated game state
 */
export function transitionToPhase(): any {
  const currentPhase = gameState.phase;
  
  // Validate phase transition
  if (!isValidPhaseTransition(currentPhase, nextPhase)) {
    gameState.gameLog.push(`Error: Cannot transition from ${currentPhase} to ${nextPhase}`);
    return gameState;
  }
  
  // Process the transition based on the next phase
  switch (true) {
    case 'START':
      return processStartPhase(gameState);
    case 'MAIN':
      return processMainPhase(gameState);
    case 'COMBAT':
      return processCombatPhase(gameState);
    case 'POST_COMBAT_MAIN':
      return processPostCombatMainPhase(gameState);
    case 'REFRESH':
      return processRefreshPhase(gameState);
    default:
      gameState.gameLog.push(`Error: Unknown phase ${nextPhase}`);
      return gameState;
  }
}

/**
 * Check if a phase transition is valid
 * @param {string} currentPhase - Current game phase
 * @param {string} nextPhase - Phase to transition to
 * @returns {boolean} Whether the transition is valid
 */
function isValidPhaseTransition(): any {
  // Define valid phase transitions
  const validTransitions = {
    'PRE_GAME': ['START'],
    'START': ['MAIN'],
    'MAIN': ['COMBAT'],
    'COMBAT': ['POST_COMBAT_MAIN'],
    'POST_COMBAT_MAIN': ['REFRESH'],
    'REFRESH': ['START']
  };
  
  // Check if the transition is valid
  return validTransitions[currentPhase] && validTransitions[currentPhase].includes(nextPhase);
}