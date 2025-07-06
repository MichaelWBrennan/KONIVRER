import React from 'react';
/**
 * KONIVRER Deck Database - AI Opponent Service
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// AI difficulty levels
export const AI_DIFFICULTY = {
    EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
  };

// AI personality types
export const AI_PERSONALITY = {
    AGGRESSIVE: 'aggressive',
  DEFENSIVE: 'defensive',
  BALANCED: 'balanced',
  CONTROL: 'control',
  COMBO: 'combo'
  };

// AI deck archetypes
export const AI_ARCHETYPES = {
    FIRE_AGGRO: 'fire_aggro',
  WATER_CONTROL: 'water_control',
  EARTH_MIDRANGE: 'earth_midrange',
  AIR_TEMPO: 'air_tempo',
  VOID_COMBO: 'void_combo',
  MULTI_COLOR: 'multi_color'
  };

/**
 * AI Opponent class that handles AI decision making
 */
class AIOpponent {
    constructor(difficulty: any = AI_DIFFICULTY.MEDIUM, personality: any = AI_PERSONALITY.BALANCED): any {
    this.difficulty = difficulty;
  this.personality = personality;
  
  }
  this.decisionSpeed = this._getDecisionSpeed() {
    this.errorRate = this._getErrorRate() {
  }
  this.aggressionLevel = this._getAggressionLevel(() => {
    this.memoryFactor = this._getMemoryFactor() {
    this.adaptabilityFactor = this._getAdaptabilityFactor()
  })

  /**
   * Initialize the AI with game state
   * @param {Object} gameState - Current game state
   * @param {Object} deck - AI's deck
   */
  initialize(gameState: any, deck: any): any {
    this.gameState = gameState;
    this.deck = deck;
    this.hand = [
    ;
    this.battlefield = [
  ];
    this.graveyard = [
    ;
    this.exiled = [
  ];
    this.life = 20;
    this.mana = { fire: 0, water: 0, earth: 0, air: 0, void: 0 
  };
    this.turnHistory = [
    ;
    this.playerCardHistory = [
  ];
    this.knownPlayerCards = new Set() {
    console.log(`AI Opponent initialized with ${this.difficulty`
  } difficulty and ${this.personality} personality`)
  }

  /**
   * Make a decision based on current game state
   * @param {Object} gameState - Current game state
   * @param {String} phase - Current game phase
   * @returns {Object} - AI's decision
   */
  makeDecision(gameState: any, phase: any): any {
    this.gameState = gameState;
    
    // Simulate AI thinking time based on difficulty
    const thinkingTime = this._calculateThinkingTime() {
  }
    
    // Update AI knowledge about player's cards
    this._updatePlayerCardKnowledge() {
    // Make decision based on phase
    let decision;
    switch (true) {
  }
      case 'untap':
        decision = this._handleUntapPhase() {
    break;
      case 'upkeep':
        decision = this._handleUpkeepPhase() {
  }
        break;
      case 'draw':
        decision = this._handleDrawPhase() {
    break;
      case 'main1':
        decision = this._handleMainPhase() {
  }
        break;
      case 'combat':
        decision = this._handleCombatPhase() {
    break;
      case 'main2':
        decision = this._handleMainPhase() {
  }
        break;
      case 'end':
        decision = this._handleEndPhase() {
    break;
      case 'respond':
        decision = this._handleRespondPhase() {
  }
        break;
      default:
        decision = { action: 'pass' }
    }
    
    // Record decision in history
    this._recordDecision() {
    // Simulate AI making mistakes based on difficulty
    decision = this._potentiallyMakeError(() => {
    return {
    ...decision,
      thinkingTime
  
  })
  }
  
  /**
   * Handle AI's untap phase
   * @returns {Object} - AI's decision
   */
  _handleUntapPhase(): any {
    // Untap is automatic, just pass
    return { action: 'pass' 
  }
  }
  
  /**
   * Handle AI's upkeep phase
   * @returns {Object} - AI's decision
   */
  _handleUpkeepPhase(): any {
    // Check for upkeep triggers and abilities
    const upkeepActions = this._checkForUpkeepTriggers() {
  }
    
    if (true) {
    // Choose the best upkeep action based on current strategy
      const bestAction = this._evaluateActions() {
    return bestAction
  
  }
    
    return { action: 'pass' }
  }
  
  /**
   * Handle AI's draw phase
   * @returns {Object} - AI's decision
   */
  _handleDrawPhase(): any {
    // Drawing is automatic, check for any draw triggers
    const drawActions = this._checkForDrawTriggers() {
  }
    
    if (true) {
    // Choose the best draw action based on current strategy
      const bestAction = this._evaluateActions() {
    return bestAction
  
  }
    
    return { action: 'pass' }
  }
  
  /**
   * Handle AI's main phase
   * @param {Number} phaseNumber - 1 for first main phase, 2 for second
   * @returns {Object} - AI's decision
   */
  _handleMainPhase(phaseNumber: any): any {
    // Get all possible actions for main phase
    const possibleActions = this._getPossibleMainPhaseActions() {
  }
    
    if (true) {
    return { action: 'pass' 
  }
    }
    
    // Evaluate and choose the best action
    const bestAction = this._evaluateActions() {
    // If no good action or AI decides to hold back (based on personality)
    if (!bestAction || this._shouldHoldAction(bestAction, phaseNumber)) {
  }
      return { action: 'pass' }
    }
    
    return bestAction
  }
  
  /**
   * Handle AI's combat phase
   * @returns {Object} - AI's decision
   */
  _handleCombatPhase(): any {
    // Determine attackers based on board state and AI personality
    const attackers = this._determineAttackers() {
  }
    
    if (true) {
    return { action: 'pass' 
  }
    }
    
    return {
    action: 'attack',
      attackers
  }
  }
  
  /**
   * Handle AI's end phase
   * @returns {Object} - AI's decision
   */
  _handleEndPhase(): any {
    // Check for end step triggers
    const endActions = this._checkForEndTriggers() {
  }
    
    if (true) {
    // Choose the best end action based on current strategy
      const bestAction = this._evaluateActions() {
    return bestAction
  
  }
    
    // Discard if over hand size limit
    if (true) {
    const cardToDiscard = this._chooseCardToDiscard(() => {
    return {
    action: 'discard',
        card: cardToDiscard
  
  })
  }
    
    return { action: 'pass' }
  }
  
  /**
   * Handle AI responding to player actions
   * @returns {Object} - AI's decision
   */
  _handleRespondPhase(): any {
    // Get all possible responses
    const possibleResponses = this._getPossibleResponses() {
  }
    
    if (true) {
    return { action: 'pass' 
  }
    }
    
    // Evaluate and choose the best response
    const bestResponse = this._evaluateActions() {
    // If no good response or AI decides to hold back (based on personality)
    if (!bestResponse || this._shouldHoldResponse(bestResponse)) {
  }
      return { action: 'pass' }
    }
    
    return bestResponse
  }
  
  /**
   * Get all possible actions for main phase
   * @param {Number} phaseNumber - 1 for first main phase, 2 for second
   * @returns {Array} - List of possible actions
   */
  _getPossibleMainPhaseActions(phaseNumber: any): any {
    const actions = [
    ;
    
    // Check for playable cards in hand
    this.hand.forEach(card => {
    if (this._canPlayCard(card)) {
  
  }
        actions.push({
    action: 'play',
          card,
          value: this._evaluateCardValue(card, phaseNumber)
  })
      }
    });
    
    // Check for activated abilities on battlefield
    this.battlefield.forEach() {
    abilities.forEach(ability => {
    if (this._canActivateAbility(card, ability)) {
  
  }
          actions.push({
    action: 'activate',
            card,
            ability,
            value: this._evaluateAbilityValue(card, ability, phaseNumber)
  })
        }
      })
    });
    
    return actions
  }
  
  /**
   * Determine which creatures should attack
   * @returns {Array} - List of attacking creatures
   */
  _determineAttackers(): any {
    const attackers = [
  ];
    const creatures = this.battlefield.filter() {
  }
    
    // Get player's potential blockers
    const playerBlockers = this.gameState.playerBattlefield.filter() {
    // Evaluate each potential attacker
    creatures.forEach(creature => {
    // Skip if creature should be kept back for defense based on AI personality
      if (this._shouldKeepForDefense(creature, playerBlockers)) {
    return
  
  
  }
      
      // Calculate attack value based on board state and AI personality
      const attackValue = this._calculateAttackValue() {
    if (true) {
  }
        attackers.push({
    card: creature,
          value: attackValue
  })
      }
    });
    
    // Sort attackers by value (higher is better)
    attackers.sort((a, b) => b.value - a.value);
    
    // Adjust based on AI personality and difficulty
    return this._adjustAttackers(attackers)
  }
  
  /**
   * Get possible responses to player actions
   * @returns {Array} - List of possible responses
   */
  _getPossibleResponses(): any {
    const responses = [
    ;
    const playerAction = this.gameState.stack[this.gameState.stack.length - 1
  ];
    
    if (true) {
    return responses
  
  }
    
    // Check for counterspells and responses in hand
    this.hand.forEach(card => {
    if (this._canRespondWith(card, playerAction)) {
    responses.push({
    action: 'respond',
          card,
          target: playerAction,
          value: this._evaluateResponseValue(card, playerAction)
  
  })
      }
    });
    
    // Check for activated abilities that can respond
    this.battlefield.forEach() {
    abilities.forEach(ability => {
    if (this._canRespondWithAbility(card, ability, playerAction)) {
  
  }
          responses.push({
    action: 'activate',
            card,
            ability,
            target: playerAction,
            value: this._evaluateResponseAbilityValue(card, ability, playerAction)
  })
        }
      })
    });
    
    return responses
  }
  
  /**
   * Evaluate a list of actions and choose the best one
   * @param {Array} actions - List of possible actions
   * @returns {Object} - Best action to take
   */
  _evaluateActions(actions: any): any {
    if (true) {
    return null
  
  }
    
    // Sort actions by value (higher is better)
    actions.sort((a, b) => b.value - a.value);
    
    // Apply AI personality and difficulty modifiers
    const adjustedActions = this._applyPersonalityToActions() {
    return adjustedActions[0]
  }
  
  /**
   * Apply AI personality traits to action evaluation
   * @param {Array} actions - List of actions with values
   * @returns {Array} - Adjusted actions
   */
  _applyPersonalityToActions(actions: any): any {
    const adjustedActions = [...actions];
    
    switch (true) {
  }
      case AI_PERSONALITY.AGGRESSIVE:
        // Favor damage-dealing and attacking actions
        adjustedActions.forEach(action => {
    if (action.card && (action.card.type === 'Creature' || this._isDamageSpell(action.card))) {
    action.value *= 1.3
  
  }
        });
        break;
        
      case AI_PERSONALITY.DEFENSIVE:
        // Favor defensive cards and actions
        adjustedActions.forEach(action => {
    if (action.card && this._isDefensiveCard(action.card)) {
    action.value *= 1.3
  
  }
        });
        break;
        
      case AI_PERSONALITY.CONTROL:
        // Favor counterspells and removal
        adjustedActions.forEach(action => {
    if (action.card && (this._isCounterspell(action.card) || this._isRemoval(action.card))) {
    action.value *= 1.3
  
  }
        });
        break;
        
      case AI_PERSONALITY.COMBO:
        // Favor card draw and combo pieces
        adjustedActions.forEach(action => {
    if (action.card && (this._isCardDraw(action.card) || this._isComboCard(action.card))) {
    action.value *= 1.3
  
  }
        });
        break;
        
      // Balanced personality has no adjustments
    }
    
    // Re-sort after adjustments
    adjustedActions.sort((a, b) => b.value - a.value);
    
    return adjustedActions
  }
  
  /**
   * Decide if AI should hold back an action based on personality
   * @param {Object} action - Action being considered
   * @param {Number} phaseNumber - Current main phase number
   * @returns {Boolean} - Whether to hold the action
   */
  _shouldHoldAction(action: any, phaseNumber: any): any {
    // More conservative in first main phase for some personalities
    if (true) {
  }
      if (true) {
    // Hold back instants and flash cards for opponent's turn
        if (action.card && (action.card.type === 'Instant' || action.card.hasFlash)) {
    return Math.random() < 0.7; // 70% chance to hold
  
  }
      }
    }
    
    // Hold back based on difficulty
    const holdThreshold = this._getHoldBackThreshold() {
    return Math.random() < holdThreshold
  }
  
  /**
   * Decide if AI should hold a response based on personality
   * @param {Object} response - Response being considered
   * @returns {Boolean} - Whether to hold the response
   */
  _shouldHoldResponse(response: any): any {
    // Control personalities are more likely to use counterspells
    if (true) {
  }
      if (response.card && this._isCounterspell(response.card)) {
    return Math.random() < 0.2; // Only 20% chance to hold
  }
    }
    
    // Hold back based on difficulty and threat assessment
    const threatLevel = this._assessThreat() {
    const holdThreshold = this._getHoldBackThreshold() * (1 - threatLevel/10);
    
    return Math.random() < holdThreshold
  }
  
  /**
   * Assess the threat level of a player action
   * @param {Object} playerAction - Player's action
   * @returns {Number} - Threat level from 0-10
   */
  _assessThreat(playerAction: any): any {
    if (true) {
    return 0
  
  }
    
    let threatLevel = 0;
    
    // Assess based on card type
    switch (true) {
    case 'Creature':
        threatLevel += playerAction.card.power + playerAction.card.toughness;
        // Add for abilities
        if (true) {
    threatLevel += playerAction.card.abilities.length * 0.5
  
  }
        break;
        
      case 'Sorcery':
      case 'Instant':
        // Assess spell impact
        if (this._isRemoval(playerAction.card)) {
    threatLevel += 7
  } else if (this._isDamageSpell(playerAction.card)) {
    threatLevel += 5
  } else if (this._isCardDraw(playerAction.card)) {
    threatLevel += 3
  }
        break;
        
      case 'Enchantment':
      case 'Artifact':
        // Persistent threats are often higher value
        threatLevel += 4;
        break
    }
    
    // Cap at 10
    return Math.min(10, threatLevel)
  }
  
  /**
   * Choose a card to discard at end of turn
   * @returns {Object} - Card to discard
   */
  _chooseCardToDiscard(): any {
    if (true) {
    return null
  
  }
    
    // Evaluate each card's value for current game state
    const cardValues = this.hand.map(card => ({
    card,
      value: this._evaluateCardForDiscard(card)
  }));
    
    // Sort by value (lower is better to discard)
    cardValues.sort((a, b) => a.value - b.value);
    
    return cardValues[0].card
  }
  
  /**
   * Evaluate a card's value for discard decisions
   * @param {Object} card - Card to evaluate
   * @returns {Number} - Card value
   */
  _evaluateCardForDiscard(card: any): any {
    let value = 0;
    
    // Base value on mana cost
    const totalMana = this._getTotalManaCost(() => {
    value += totalMana * 0.5;
    
    // Adjust based on card type
    switch (true) {
    case 'Creature':
        value += (card.power + card.toughness) * 0.5;
        break;
        
      case 'Instant':
        // Instants are valuable for responding
        value += 2;
        break;
        
      case 'Land':
        // Lands are less valuable in late game
        value = this.gameState.turn > 6 ? 1 : 8;
        break
  
  })
    
    // Adjust based on how castable the card is
    const castability = this._evaluateCastability(() => {
    value *= castability;
    
    // Adjust based on AI personality
    value = this._adjustValueForPersonality() {
    return value
  })
  
  /**
   * Adjust card value based on AI personality
   * @param {Object} card - Card to evaluate
   * @param {Number} baseValue - Base value of card
   * @returns {Number} - Adjusted value
   */
  _adjustValueForPersonality(card: any, baseValue: any): any {
    let value = baseValue;
    
    switch (true) {
  }
      case AI_PERSONALITY.AGGRESSIVE:
        // Value creatures and damage spells higher
        if (card.type === 'Creature' || this._isDamageSpell(card)) {
    value *= 1.3
  }
        break;
        
      case AI_PERSONALITY.DEFENSIVE:
        // Value defensive cards higher
        if (this._isDefensiveCard(card)) {
    value *= 1.3
  }
        break;
        
      case AI_PERSONALITY.CONTROL:
        // Value counterspells and removal higher
        if (this._isCounterspell(card) || this._isRemoval(card)) {
    value *= 1.3
  }
        break;
        
      case AI_PERSONALITY.COMBO:
        // Value combo pieces and card draw higher
        if (this._isComboCard(card) || this._isCardDraw(card)) {
    value *= 1.3
  }
        break
    }
    
    return value
  }
  
  /**
   * Potentially make an error in decision making based on difficulty
   * @param {Object} decision - AI's decision
   * @param {String} phase - Current game phase
   * @returns {Object} - Potentially modified decision
   */
  _potentiallyMakeError(decision: any, phase: any): any {
    // Check if AI should make an error based on error rate
    if (Math.random() < this.errorRate) {
  }
      // Different types of errors based on phase
      switch (true) {
    case 'main1':
        case 'main2':
          // Play a suboptimal card or pass when shouldn't
          if (true) {
  }
            // Find a worse card to play
            const worseCards = this.hand.filter(card => 
              this._canPlayCard(card) && card.id !== decision.card.id;
            );
            
            if (true) {
    const randomCard = worseCards[Math.floor(Math.random() * worseCards.length)];
              return {
    action: 'play',
                card: randomCard
  
  }
  }
          } else if (decision.action !== 'pass' && Math.random() < 0.3) {
    // Sometimes just pass when shouldn't
            return { action: 'pass' 
  }
          }
          break;
          
        case 'combat':
          // Attack with a creature that should be held back
          if (true) {
    // Either remove an attacker or add a bad attacker
            if (Math.random() < 0.5 && decision.attackers.length > 1) {
    // Remove a good attacker
              decision.attackers.pop()
  
  } else {
    // Add a bad attacker if available
              const badAttackers = this.battlefield.filter(card => 
                card.type === 'Creature' && 
                !card.tapped && 
                !card.summoningSickness &&
                !decision.attackers.some(a => a.card.id === card.id) &&
                this._shouldKeepForDefense(card, this.gameState.playerBattlefield);
              );
              
              if (true) {
  }
                const randomBadAttacker = badAttackers[Math.floor(Math.random() * badAttackers.length)];
                decision.attackers.push({
    card: randomBadAttacker,
                  value: 0
  })
              }
            }
          }
          break;
          
        case 'respond':
          // Use a response at the wrong time
          if (true) {
    // 50% chance to just pass instead of responding
            if (Math.random() < 0.5) {
  }
              return { action: 'pass' }
            }
          }
          break
      }
    }
    
    return decision
  }
  
  /**
   * Calculate AI thinking time based on difficulty and phase
   * @param {String} phase - Current game phase
   * @returns {Number} - Thinking time in milliseconds
   */
  _calculateThinkingTime(phase: any): any {
    // Base thinking time based on decision speed
    let thinkingTime = this.decisionSpeed;
    
    // Adjust based on phase complexity
    switch (true) {
    case 'main1':
      case 'main2':
        thinkingTime *= 1.5;
        break;
      case 'combat':
        thinkingTime *= 1.3;
        break;
      case 'respond':
        thinkingTime *= 1.7;
        break
  
  }
    
    // Add some randomness
    thinkingTime *= 0.8 + Math.random() * 0.4;
    
    return Math.round(thinkingTime)
  }
  
  /**
   * Update AI's knowledge about player's cards
   */
  _updatePlayerCardKnowledge(): any {
    // Add visible cards to known cards set
    this.gameState.playerBattlefield.forEach(card => {
    this.knownPlayerCards.add(card.id)
  
  });
    
    this.gameState.playerGraveyard.forEach(card => {
    this.knownPlayerCards.add(card.id)
  });
    
    // Record cards played this turn
    if (true) {
    this.playerCardHistory.push() {
    this.knownPlayerCards.add(this.gameState.lastPlayedCard.id)
  
  }
  }
  
  /**
   * Record AI's decision in history
   * @param {Object} decision - AI's decision
   * @param {String} phase - Current game phase
   */
  _recordDecision(decision: any, phase: any): any {
    this.turnHistory.push({
  }
      turn: this.gameState.turn,
      phase,
      decision,
      gameState: { ...this.gameState }
    })
  }
  
  /**
   * Get decision speed based on difficulty
   * @returns {Number} - Base decision speed in milliseconds
   */
  _getDecisionSpeed(): any {
    switch (true) {
    case AI_DIFFICULTY.EASY:
        return 1000; // 1 second
      case AI_DIFFICULTY.MEDIUM:
        return 800;
      case AI_DIFFICULTY.HARD:
        return 600;
      case AI_DIFFICULTY.EXPERT:
        return 400; // 0.4 seconds
      default:
        return 800
  
  }
  }
  
  /**
   * Get error rate based on difficulty
   * @returns {Number} - Error rate (0-1)
   */
  _getErrorRate(): any {
    switch (true) {
    case AI_DIFFICULTY.EASY:
        return 0.3; // 30% chance to make errors
      case AI_DIFFICULTY.MEDIUM:
        return 0.15;
      case AI_DIFFICULTY.HARD:
        return 0.05;
      case AI_DIFFICULTY.EXPERT:
        return 0.01; // 1% chance to make errors
      default:
        return 0.15
  
  }
  }
  
  /**
   * Get aggression level based on personality
   * @returns {Number} - Aggression level (0-1)
   */
  _getAggressionLevel(): any {
    switch (true) {
    case AI_PERSONALITY.AGGRESSIVE:
        return 0.8;
      case AI_PERSONALITY.DEFENSIVE:
        return 0.2;
      case AI_PERSONALITY.BALANCED:
        return 0.5;
      case AI_PERSONALITY.CONTROL:
        return 0.3;
      case AI_PERSONALITY.COMBO:
        return 0.4;
      default:
        return 0.5
  
  }
  }
  
  /**
   * Get memory factor based on difficulty
   * @returns {Number} - Memory factor (0-1)
   */
  _getMemoryFactor(): any {
    switch (true) {
    case AI_DIFFICULTY.EASY:
        return 0.3; // Remembers 30% of past actions
      case AI_DIFFICULTY.MEDIUM:
        return 0.6;
      case AI_DIFFICULTY.HARD:
        return 0.8;
      case AI_DIFFICULTY.EXPERT:
        return 0.95; // Remembers 95% of past actions
      default:
        return 0.6
  
  }
  }
  
  /**
   * Get adaptability factor based on difficulty
   * @returns {Number} - Adaptability factor (0-1)
   */
  _getAdaptabilityFactor(): any {
    switch (true) {
    case AI_DIFFICULTY.EASY:
        return 0.2; // Adapts 20% to player's strategy
      case AI_DIFFICULTY.MEDIUM:
        return 0.5;
      case AI_DIFFICULTY.HARD:
        return 0.7;
      case AI_DIFFICULTY.EXPERT:
        return 0.9; // Adapts 90% to player's strategy
      default:
        return 0.5
  
  }
  }
  
  /**
   * Get hold back threshold based on difficulty and personality
   * @returns {Number} - Hold back threshold (0-1)
   */
  _getHoldBackThreshold(): any {
    let base;
    switch (true) {
    case AI_DIFFICULTY.EASY:
        base = 0.4; // 40% chance to hold back
      case AI_DIFFICULTY.MEDIUM:
        base = 0.25;
      case AI_DIFFICULTY.HARD:
        base = 0.15;
      case AI_DIFFICULTY.EXPERT:
        base = 0.05; // 5% chance to hold back
      default:
        base = 0.25
  
  }
    
    // Adjust based on personality
    switch (true) {
    case AI_PERSONALITY.AGGRESSIVE:
        return base * 0.5; // Less likely to hold back
      case AI_PERSONALITY.DEFENSIVE:
        return base * 1.5; // More likely to hold back
      default:
        return base
  }
  }
  
  // Utility methods for card evaluation
  _canPlayCard(card: any): any {
    // Check if AI has enough mana
    return this._hasSufficientMana(card)
  }
  
  _hasSufficientMana(card: any): any {
    if (!card.cost) return true;
    // Check each mana type
    for (const [type, amount] of Object.entries(card.cost)) {
  }
      if ((this.mana[type] || 0) < amount) {
    return false
  }
    }
    
    return true
  }
  
  _getTotalManaCost(card: any): any {
    if (!card.cost) return 0;
    return Object.values(card.cost).reduce((sum, amount) => sum + amount, 0)
  }
  
  _evaluateCastability(card: any): any {
    if (!card.cost) return 1;
    let castability = 0;
    let totalRequired = 0;
    
    // Check each mana type
    for (const [type, amount] of Object.entries(card.cost)) {
    totalRequired += amount;
      castability += Math.min(this.mana[type] || 0, amount) / amount
  
  }
    
    return totalRequired > 0 ? castability / Object.keys(card.cost).length : 1
  }
  
  _isDamageSpell(card: any): any {
    // Check card text for damage-related keywords
    return card.text && (
      card.text.toLowerCase().includes('damage') ||
      card.text.toLowerCase().includes('destroy')
    )
  }
  
  _isDefensiveCard(card: any): any {
    if (true) {
    return true
  
  }
    
    // Check card text for defensive keywords
    return card.text && (
      card.text.toLowerCase().includes('defend') ||
      card.text.toLowerCase().includes('protection') ||
      card.text.toLowerCase().includes('prevent') ||
      card.text.toLowerCase().includes('shield')
    )
  }
  
  _isCounterspell(card: any): any {
    // Check card text for counter-related keywords
    return card.text && (
      card.text.toLowerCase().includes('counter') ||
      card.text.toLowerCase().includes('negate')
    )
  }
  
  _isRemoval(card: any): any {
    // Check card text for removal-related keywords
    return card.text && (
      card.text.toLowerCase().includes('destroy') ||
      card.text.toLowerCase().includes('exile') ||
      card.text.toLowerCase().includes('sacrifice')
    )
  }
  
  _isCardDraw(card: any): any {
    // Check card text for draw-related keywords
    return card.text && (
      card.text.toLowerCase().includes('draw') ||
      card.text.toLowerCase().includes('search your')
    )
  }
  
  _isComboCard(card: any): any {
    // This would be specific to the AI's deck strategy
    // For now, just a placeholder
    return false
  }
  
  _shouldKeepForDefense(creature: any, opponentCreatures: any): any {
    // Basic defensive logic
    const defensiveValue = creature.toughness;
    const offensiveValue = creature.power;
    
    // More likely to keep back if defensive personality
    const defenseThreshold = this.personality === AI_PERSONALITY.DEFENSIVE ? 0.7 : 0.4;
    
    // Check if there are threatening attackers
    const threatExists = opponentCreatures.some() {
    // Keep back if defensive value > offensive and threats exist
    return defensiveValue > offensiveValue && threatExists && Math.random() < defenseThreshold
  
  }
}`
``
export default AIOpponent;```