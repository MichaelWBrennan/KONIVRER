/**
 * KONIVRER Card Actions
 * This file implements the five card playing methods: Summon, Tribute, Azoth, Spell, and Burst
 */

import { drawCard } from './gameState';
import { canPayCost, payCardCost, playCardAsAzoth, calculateStrength } from './elementalSystem';
import { applyKeywordEffects, checkKeywordSynergies } from './keywordSystem';

/**
 * Summon: Play card as Familiar with +1 counters
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {string} cardId - Card identifier
 * @param {number} azothSpent - Total Azoth spent
 * @returns {Object} Updated game state
 */
export function playSummon(gameState, playerId, cardId, azothSpent) {
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
    gameState.gameLog.push(`Error: ${card.name} with Quintessence cannot be summoned as a Familiar`);
    return gameState;
  }
  
  // Check if player can pay the elemental costs
  if (!canPayCost(gameState.players[playerId].azoth, card.elements)) {
    gameState.gameLog.push(`Error: Cannot pay elemental cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the cost
  gameState = payCardCost(gameState, playerId, card.elements);
  
  if (!gameState) {
    return gameState; // Cost payment failed
  }
  
  // Calculate +1 counters based on generic Azoth spent
  const genericCost = card.elements.generic || 0;
  const counters = Math.max(0, azothSpent - genericCost);
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set card strength and health with counters
  playedCard.strength = playedCard.baseStrength + counters;
  playedCard.health = playedCard.baseHealth;
  playedCard.counters = counters;
  playedCard.summoningSickness = true;
  playedCard.tapped = false;
  playedCard.controllerId = playerId;
  
  // Add to field
  gameState.players[playerId].field.push(playedCard);
  
  // Apply keyword effects
  gameState = applyKeywordEffects(gameState, playerId, playedCard, 'summon');
  
  // Check for keyword synergies
  gameState = checkKeywordSynergies(gameState, playerId);
  
  // Log the action
  gameState.gameLog.push(`${playerId} summons ${playedCard.name} with ${counters} +1 counters`);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

/**
 * Tribute: Reduce cost by sacrificing Familiars
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {string} cardId - Card identifier
 * @param {Array} tributeCardIds - Array of card IDs to tribute
 * @returns {Object} Updated game state
 */
export function playTribute(gameState, playerId, cardId, tributeCardIds) {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Calculate cost reduction from tributes
  let costReduction = 0;
  const tributeCards = [];
  
  for (const tributeId of tributeCardIds) {
    const fieldIndex = gameState.players[playerId].field.findIndex(c => c.id === tributeId);
    
    if (fieldIndex === -1) {
      gameState.gameLog.push(`Error: Tribute card ${tributeId} not found on field`);
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
  if (reducedElements.generic) {
    const reduction = Math.min(reducedElements.generic, remainingReduction);
    reducedElements.generic -= reduction;
    remainingReduction -= reduction;
  }
  
  // Reduce other elements if there's still reduction left
  for (const element in reducedElements) {
    if (element === 'generic') continue;
    
    if (remainingReduction > 0 && reducedElements[element] > 0) {
      const reduction = Math.min(reducedElements[element], remainingReduction);
      reducedElements[element] -= reduction;
      remainingReduction -= reduction;
    }
  }
  
  // Check if player can pay the reduced cost
  if (!canPayCost(gameState.players[playerId].azoth, reducedElements)) {
    gameState.gameLog.push(`Error: Cannot pay reduced cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the reduced cost
  gameState = payCardCost(gameState, playerId, reducedElements);
  
  if (!gameState) {
    return gameState; // Cost payment failed
  }
  
  // Remove tributed cards from field and add to removed from play
  for (const tributeCard of tributeCards) {
    const fieldIndex = gameState.players[playerId].field.findIndex(c => c.id === tributeCard.id);
    const removedCard = gameState.players[playerId].field.splice(fieldIndex, 1)[0];
    gameState.players[playerId].removedFromPlay.push(removedCard);
    
    gameState.gameLog.push(`${playerId} tributes ${removedCard.name}`);
  }
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set card properties
  playedCard.strength = playedCard.baseStrength;
  playedCard.health = playedCard.baseHealth;
  playedCard.counters = 0;
  playedCard.summoningSickness = true;
  playedCard.tapped = false;
  playedCard.controllerId = playerId;
  
  // Add to field
  gameState.players[playerId].field.push(playedCard);
  
  // Apply keyword effects
  gameState = applyKeywordEffects(gameState, playerId, playedCard, 'tribute');
  
  // Check for keyword synergies
  gameState = checkKeywordSynergies(gameState, playerId);
  
  // Log the action
  gameState.gameLog.push(`${playerId} plays ${playedCard.name} via Tribute`);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

/**
 * Azoth: Place card in Azoth Row
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {string} cardId - Card identifier
 * @param {string} elementType - Element type for the Azoth
 * @returns {Object} Updated game state
 */
export function playAzoth(gameState, playerId, cardId, elementType) {
  // Use the elemental system function
  gameState = playCardAsAzoth(gameState, playerId, cardId, elementType);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

/**
 * Spell: Play card as one-time effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {string} cardId - Card identifier
 * @param {number} azothSpent - Total Azoth spent
 * @param {number} abilityIndex - Index of the ability to use
 * @returns {Object} Updated game state
 */
export function playSpell(gameState, playerId, cardId, azothSpent, abilityIndex) {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Check if player can pay the elemental costs
  if (!canPayCost(gameState.players[playerId].azoth, card.elements)) {
    gameState.gameLog.push(`Error: Cannot pay elemental cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the cost
  gameState = payCardCost(gameState, playerId, card.elements);
  
  if (!gameState) {
    return gameState; // Cost payment failed
  }
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Calculate generic Azoth spent for ability
  const genericValue = azothSpent - (playedCard.elements.generic || 0);
  
  // Apply the selected ability
  if (playedCard.abilities && playedCard.abilities[abilityIndex]) {
    const ability = playedCard.abilities[abilityIndex];
    
    // Replace ✡︎⃝ in ability text with genericValue
    const resolvedEffect = ability.effect.replace('✡︎⃝', genericValue.toString());
    
    // Log the spell effect
    gameState.gameLog.push(`${playerId} casts ${playedCard.name}: ${resolvedEffect}`);
    
    // Apply the ability effect
    gameState = applySpellEffect(gameState, playerId, ability, genericValue);
  }
  
  // Apply keyword effects (but not for Burst)
  gameState = applyKeywordEffects(gameState, playerId, playedCard, 'spell');
  
  // Put card on bottom of deck
  gameState.players[playerId].deck.unshift(playedCard);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

/**
 * Burst: Play card for free from Life Cards
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {string} cardId - Card identifier
 * @returns {Object} Updated game state
 */
export function playBurst(gameState, playerId, cardId) {
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
      gameState.gameLog.push(`${playerId} casts ${playedCard.name}: ${resolvedEffect}`);
      
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
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} ability - Ability object
 * @param {number} genericValue - Value of ✡︎⃝
 * @returns {Object} Updated game state
 */
export function applySpellEffect(gameState, playerId, ability, genericValue) {
  // This is a placeholder for the actual spell effect implementation
  // In a real implementation, this would handle different effect types
  
  // For now, just log that the effect was applied
  gameState.gameLog.push(`Applied spell effect with ✡︎⃝ = ${genericValue}`);
  
  return gameState;
}