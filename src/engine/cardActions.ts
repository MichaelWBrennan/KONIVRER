/**
 * KONIVRER Card Actions
 * This file implements the five card playing methods: Summon, Tribute, Azoth, Spell, and Burst
 */

import { drawCard, GameState } from './gameState';
import { canPayCost, payCardCost, playCardAsAzoth, calculateStrength } from './elementalSystem';
import { applyKeywordEffects, checkKeywordSynergies } from './keywordSystem';

interface Card {
  id: string;
  name: string;
  type?: string;
  keywords?: string[];
  elements: {
    generic?: number;
    [key: string]: number | undefined;
  };
  baseStrength?: number;
  baseHealth?: number;
  strength?: number;
  health?: number;
  counters?: number;
  summoningSickness?: boolean;
  tapped?: boolean;
  controllerId?: string;
  burstPlayed?: boolean;
  abilities?: Ability[];
  [key: string]: any;
}

interface Ability {
  name: string;
  effect: string;
  target?: string;
  [key: string]: any;
}

/**
 * Summon: Play card as Familiar with +1 counters
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param cardId - Card identifier
 * @param azothSpent - Total Azoth spent
 * @returns Updated game state
 */
export function playSummon(gameState: GameState, playerId: string, cardId: string, azothSpent: number): GameState {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Check if card can be played as Familiar
  if (card.type !== 'Familiar') {
    gameState.gameLog.push(`Error: ${card.name} cannot be summoned (not a Familiar)`);
    return gameState;
  }
  
  // Check if card has Quintessence keyword (prevents summoning)
  if (card.keywords && card.keywords.includes('QUINTESSENCE')) {
    gameState.gameLog.push(`Error: ${card.name} cannot be summoned (has Quintessence)`);
    return gameState;
  }
  
  // Check if player can pay the elemental costs
  if (!canPayCost(gameState.players[playerId].azoth, card.elements)) {
    gameState.gameLog.push(`Error: ${playerId} cannot pay the cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the cost
  let updatedGameState = payCardCost(gameState, playerId, card.elements);
  if (updatedGameState === gameState) {
    return gameState; // Cost payment failed
  }
  
  // Calculate +1 counters based on generic Azoth spent
  const genericCost = card.elements.generic || 0;
  const counters = Math.max(0, azothSpent - genericCost);
  
  // Remove card from hand
  const playedCard = updatedGameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set card strength and health with counters
  playedCard.strength = (playedCard.baseStrength || 0) + counters;
  playedCard.health = playedCard.baseHealth;
  playedCard.counters = counters;
  playedCard.summoningSickness = true;
  playedCard.tapped = false;
  playedCard.controllerId = playerId;
  
  // Add to field
  updatedGameState.players[playerId].field.push(playedCard);
  
  // Apply keyword effects
  updatedGameState = applyKeywordEffects(updatedGameState, playerId, playedCard, 'summon');
  
  // Check for keyword synergies
  updatedGameState = checkKeywordSynergies(updatedGameState, playerId);
  
  // Log the action
  updatedGameState.gameLog.push(`${playerId} summons ${playedCard.name} with ${counters} +1 counters`);
  
  // Draw a card after playing
  updatedGameState = drawCard(updatedGameState, playerId);
  
  return updatedGameState;
}

/**
 * Tribute: Reduce cost by sacrificing Familiars
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param cardId - Card identifier
 * @param tributeCardIds - Array of card IDs to tribute
 * @returns Updated game state
 */
export function playTribute(gameState: GameState, playerId: string, cardId: string, tributeCardIds: string[]): GameState {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Calculate cost reduction from tributes
  let costReduction = 0;
  const tributeCards: Card[] = [];
  
  for (const tributeId of tributeCardIds) {
    const fieldIndex = gameState.players[playerId].field.findIndex(card => card && card.id === tributeId);
    
    if (fieldIndex === -1) {
      gameState.gameLog.push(`Error: Tribute card ${tributeId} not found on ${playerId}'s field`);
      return gameState;
    }
    
    const tributeCard = gameState.players[playerId].field[fieldIndex];
    
    // Cost reduction = sum of element costs + counters
    const elementCosts = Object.values(tributeCard.elements).reduce((sum, cost) => sum + (cost || 0), 0);
    costReduction += elementCosts + (tributeCard.counters || 0);
    
    tributeCards.push(tributeCard);
  }
  
  // Apply cost reduction
  const reducedElements = {...card.elements};
  let remainingReduction = costReduction;
  
  // Reduce generic cost first
  if (reducedElements.generic && reducedElements.generic > 0) {
    const reduction = Math.min(reducedElements.generic, remainingReduction);
    reducedElements.generic -= reduction;
    remainingReduction -= reduction;
  }
  
  // Reduce other elements if there's still reduction left
  for (const element in reducedElements) {
    if (element === 'generic') continue;
    
    if (reducedElements[element] && reducedElements[element]! > 0 && remainingReduction > 0) {
      const reduction = Math.min(reducedElements[element]!, remainingReduction);
      reducedElements[element] = (reducedElements[element] || 0) - reduction;
      remainingReduction -= reduction;
    }
  }
  
  // Check if player can pay the reduced cost
  if (!canPayCost(gameState.players[playerId].azoth, reducedElements)) {
    gameState.gameLog.push(`Error: ${playerId} cannot pay the reduced cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the reduced cost
  let updatedGameState = payCardCost(gameState, playerId, reducedElements);
  if (updatedGameState === gameState) {
    return gameState; // Cost payment failed
  }
  
  // Remove tributed cards from field and add to removed from play
  for (const tributeCard of tributeCards) {
    const fieldIndex = updatedGameState.players[playerId].field.findIndex(card => card && card.id === tributeCard.id);
    const removedCard = updatedGameState.players[playerId].field.splice(fieldIndex, 1)[0];
    updatedGameState.players[playerId].removedFromPlay.push(removedCard);
    
    updatedGameState.gameLog.push(`${playerId} tributes ${removedCard.name}`);
  }
  
  // Remove card from hand
  const playedCard = updatedGameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set card properties
  playedCard.strength = playedCard.baseStrength;
  playedCard.health = playedCard.baseHealth;
  playedCard.counters = 0;
  playedCard.summoningSickness = true;
  playedCard.tapped = false;
  playedCard.controllerId = playerId;
  
  // Add to field
  updatedGameState.players[playerId].field.push(playedCard);
  
  // Apply keyword effects
  updatedGameState = applyKeywordEffects(updatedGameState, playerId, playedCard, 'summon');
  
  // Check for keyword synergies
  updatedGameState = checkKeywordSynergies(updatedGameState, playerId);
  
  // Log the action
  updatedGameState.gameLog.push(`${playerId} plays ${playedCard.name} with tribute (cost reduced by ${costReduction})`);
  
  // Draw a card after playing
  updatedGameState = drawCard(updatedGameState, playerId);
  
  return updatedGameState;
}

/**
 * Azoth: Place card in Azoth Row
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param cardId - Card identifier
 * @param elementType - Element type for the Azoth
 * @returns Updated game state
 */
export function playAzoth(gameState: GameState, playerId: string, cardId: string, elementType: string): GameState {
  // Use the elemental system function
  let updatedGameState = playCardAsAzoth(gameState, playerId, cardId, elementType);
  
  // Draw a card after playing
  updatedGameState = drawCard(updatedGameState, playerId);
  
  return updatedGameState;
}

/**
 * Spell: Play card as one-time effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param cardId - Card identifier
 * @param azothSpent - Total Azoth spent
 * @param abilityIndex - Index of the ability to use
 * @returns Updated game state
 */
export function playSpell(gameState: GameState, playerId: string, cardId: string, azothSpent: number, abilityIndex: number): GameState {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Check if player can pay the elemental costs
  if (!canPayCost(gameState.players[playerId].azoth, card.elements)) {
    gameState.gameLog.push(`Error: ${playerId} cannot pay the cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the cost
  let updatedGameState = payCardCost(gameState, playerId, card.elements);
  if (updatedGameState === gameState) {
    return gameState; // Cost payment failed
  }
  
  // Remove card from hand
  const playedCard = updatedGameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Calculate generic Azoth spent for ability
  const genericValue = azothSpent - (playedCard.elements.generic || 0);
  
  // Apply the selected ability
  if (playedCard.abilities && playedCard.abilities.length > abilityIndex) {
    const ability = playedCard.abilities[abilityIndex];
    
    // Replace ✡︎⃝ in ability text with genericValue
    const resolvedEffect = ability.effect.replace('✡︎⃝', genericValue.toString());
    
    // Log the spell effect
    updatedGameState.gameLog.push(`${playerId} casts ${playedCard.name}: ${resolvedEffect}`);
    
    // Apply the ability effect
    updatedGameState = applySpellEffect(updatedGameState, playerId, ability, genericValue);
  }
  
  // Apply keyword effects (but not for Burst)
  updatedGameState = applyKeywordEffects(updatedGameState, playerId, playedCard, 'spell');
  
  // Put card on bottom of deck
  updatedGameState.players[playerId].deck.unshift(playedCard);
  
  // Draw a card after playing
  updatedGameState = drawCard(updatedGameState, playerId);
  
  return updatedGameState;
}

/**
 * Burst: Play card for free from Life Cards
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param cardId - Card identifier
 * @returns Updated game state
 */
export function playBurst(gameState: GameState, playerId: string, cardId: string): GameState {
  // This is called when a Life Card is revealed due to damage
  // The card should already be in the player's hand at this point
  
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Calculate ✡︎⃝ value based on remaining Life Cards
  const genericValue = gameState.players[playerId].lifeCards.length;
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Log the action
  gameState.gameLog.push(`${playerId} plays ${playedCard.name} as Burst (✡︎⃝ = ${genericValue})`);
  
  // Apply card effect based on type
  if (playedCard.type === 'Familiar') {
    // Add to field with strength/health but no keywords
    playedCard.strength = playedCard.baseStrength;
    playedCard.health = playedCard.baseHealth;
    playedCard.burstPlayed = true; // Mark as played via Burst (keywords don't resolve)
    playedCard.summoningSickness = true;
    playedCard.tapped = false;
    playedCard.controllerId = playerId;
    
    gameState.players[playerId].field.push(playedCard);
    
    // NOTE: Keywords do NOT resolve when played via Burst
    gameState.gameLog.push(`${playedCard.name} keywords do not resolve (played via Burst)`);
  } else if (playedCard.type === 'Spell') {
    // Apply spell effect with ✡︎⃝ = remaining Life Cards
    // But keywords don't resolve
    if (playedCard.abilities && playedCard.abilities.length > 0) {
      const ability = playedCard.abilities[0];
      
      // Replace ✡︎⃝ in ability text with genericValue
      const resolvedEffect = ability.effect.replace('✡︎⃝', genericValue.toString());
      
      // Log the spell effect
      gameState.gameLog.push(`${playerId} casts ${playedCard.name} as Burst: ${resolvedEffect}`);
      
      // Apply the ability effect
      gameState = applySpellEffect(gameState, playerId, ability, genericValue);
    }
    
    // Put card on bottom of deck
    gameState.players[playerId].deck.unshift(playedCard);
  }
  
  // No card draw for Burst plays
  
  return gameState;
}

/**
 * Apply a spell effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param ability - Ability object
 * @param genericValue - Value of ✡︎⃝
 * @returns Updated game state
 */
export function applySpellEffect(gameState: GameState, playerId: string, ability: Ability, genericValue: number): GameState {
  // This is a placeholder for the actual spell effect implementation
  // In a real implementation, this would handle different effect types
  
  // For now, just log that the effect was applied
  gameState.gameLog.push(`Applied spell effect: ${ability.name} with ✡︎⃝ = ${genericValue}`);
  
  return gameState;
}

export default {
  playSummon,
  playTribute,
  playAzoth,
  playSpell,
  playBurst,
  applySpellEffect
};