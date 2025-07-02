/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Advanced Rules Engine
 * 
 * A comprehensive rules engine that automatically handles:
 * - Card interactions and effects
 * - Game state validation
 * - Turn structure and phases
 * - Triggered abilities
 * - State-based actions
 * - Priority and the stack
 * 
 * This engine is designed to be MTG Arena-like in its automation and precision.
 */

import { getCardRules } from './CardRules';
import { getKeywordRules } from './KeywordRules';
import { getTriggerConditions } from './TriggerConditions';

// Rule types
const RULE_TYPES = {
  STATIC: 'static',       // Always-on effects
  TRIGGERED: 'triggered', // Triggered abilities
  ACTIVATED: 'activated', // Activated abilities
  REPLACEMENT: 'replacement', // Replacement effects
  STATE_BASED: 'state-based', // State-based actions
  TURN_STRUCTURE: 'turn-structure', // Turn structure rules
  COST: 'cost',           // Cost calculation rules
  TARGETING: 'targeting', // Targeting rules
  RESOLUTION: 'resolution' // Resolution rules
};

// Game zones
const ZONES = {
  HAND: 'hand',
  FIELD: 'field',
  AZOTH_ROW: 'azothRow',
  GRAVEYARD: 'graveyard',
  REMOVED: 'removedZone',
  LIFE_CARDS: 'lifeCards',
  DECK: 'deck',
  STACK: 'stack'
};

// Game phases
const PHASES = {
  SETUP: 'setup',
  START: 'start',
  MAIN: 'main',
  COMBAT: 'combat',
  COMBAT_DECLARE_ATTACKERS: 'combat-attackers',
  COMBAT_DECLARE_BLOCKERS: 'combat-blockers',
  COMBAT_DAMAGE: 'combat-damage',
  POST_COMBAT: 'post-combat',
  REFRESH: 'refresh',
  END: 'end'
};

class RulesEngine {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    
    // Rules registry
    this.rules = {
      static: [],
      triggered: [],
      activated: [],
      replacement: [],
      stateBased: [],
      turnStructure: [],
      cost: [],
      targeting: [],
      resolution: []
    };
    
    // Card-specific rules
    this.cardRules = new Map();
    
    // Keyword rules
    this.keywordRules = new Map();
    
    // Trigger conditions
    this.triggerConditions = new Map();
    
    // Initialize rules
    this.initializeRules();
    
    // Bind to game engine events
    this.bindEvents();
  }
  
  /**
   * Initialize the rules engine with core rules
   */
  initializeRules() {
    // Register core rules
    this.registerCoreRules();
    
    // Register keyword rules
    this.registerKeywordRules();
    
    // Register trigger conditions
    this.registerTriggerConditions();
    
    console.log('Rules Engine initialized with:');
    console.log(`- ${this.rules.static.length} static rules`);
    console.log(`- ${this.rules.triggered.length} triggered rules`);
    console.log(`- ${this.rules.activated.length} activated rules`);
    console.log(`- ${this.rules.replacement.length} replacement rules`);
    console.log(`- ${this.rules.stateBased.length} state-based rules`);
    console.log(`- ${this.rules.turnStructure.length} turn structure rules`);
    console.log(`- ${this.rules.cost.length} cost rules`);
    console.log(`- ${this.rules.targeting.length} targeting rules`);
    console.log(`- ${this.rules.resolution.length} resolution rules`);
    console.log(`- ${this.cardRules.size} card-specific rules`);
    console.log(`- ${this.keywordRules.size} keyword rules`);
    console.log(`- ${this.triggerConditions.size} trigger conditions`);
  }
  
  /**
   * Register core game rules
   */
  registerCoreRules() {
    // Turn structure rules
    this.registerRule({
      type: RULE_TYPES.TURN_STRUCTURE,
      name: 'Start Phase',
      description: 'At the beginning of the Start phase, untap all cards in the active player\'s field and Azoth row.',
      condition: (gameState) => gameState.phase === PHASES.START,
      apply: (gameState) => {
        const activePlayer = gameState.players[gameState.currentPlayer];
        
        // Untap all cards in field and Azoth row
        activePlayer.field.forEach(card => {
          card.tapped = false;
          card.summoningSickness = false; // Remove summoning sickness from previous turn
        });
        
        activePlayer.azothRow.forEach(card => {
          card.tapped = false;
        });
        
        // Reset azothPlacedThisTurn flag
        activePlayer.azothPlacedThisTurn = false;
        
        // Draw a card
        if (gameState.turn > 1 || gameState.currentPlayer > 0) { // First player doesn't draw on first turn
          this.drawCard(gameState, gameState.currentPlayer);
        }
        
        return gameState;
      }
    });
    
    // State-based actions
    this.registerRule({
      type: RULE_TYPES.STATE_BASED,
      name: 'Check Life Cards',
      description: 'If a player has no life cards left, they lose the game.',
      condition: (gameState) => true, // Always check
      apply: (gameState) => {
        gameState.players.forEach((player, index) => {
          if (player.lifeCards.length === 0 && !gameState.winner) {
            gameState.winner = 1 - index; // Opponent wins
            gameState.gameLog.push({
              type: 'game',
              text: `${player.name} has no life cards left and loses the game!`
            });
          }
        });
        
        return gameState;
      }
    });
    
    this.registerRule({
      type: RULE_TYPES.STATE_BASED,
      name: 'Check Familiar Toughness',
      description: 'If a Familiar has 0 or less toughness, it is put into the graveyard.',
      condition: (gameState) => true, // Always check
      apply: (gameState) => {
        gameState.players.forEach(player => {
          const deadFamiliars = [];
          
          player.field.forEach((card, index) => {
            if (card.type === 'Familiar' && card.toughness <= 0) {
              deadFamiliars.push({ card, index });
            }
          });
          
          // Remove dead familiars in reverse order to maintain correct indices
          deadFamiliars.sort((a, b) => b.index - a.index).forEach(({ card, index }) => {
            const deadCard = player.field.splice(index, 1)[0];
            player.graveyard.push(deadCard);
            
            gameState.gameLog.push({
              type: 'destroy',
              text: `${card.name} was destroyed due to having 0 or less toughness.`
            });
          });
        });
        
        return gameState;
      }
    });
    
    // Cost calculation rules
    this.registerRule({
      type: RULE_TYPES.COST,
      name: 'Familiar Azoth Cost',
      description: 'Calculate the Azoth cost for playing a Familiar.',
      condition: (gameState, card) => card.type === 'Familiar',
      apply: (gameState, card, player) => {
        // Base cost is the card's azothCost
        let cost = card.azothCost || 0;
        
        // Apply any cost modifiers from effects
        const costModifiers = this.getActiveCostModifiers(gameState, card, player);
        cost = costModifiers.reduce((total, modifier) => modifier.apply(total, card, player, gameState), cost);
        
        return Math.max(0, cost); // Cost can't be negative
      }
    });
    
    // Targeting rules
    this.registerRule({
      type: RULE_TYPES.TARGETING,
      name: 'Valid Familiar Targets',
      description: 'Determine valid targets for abilities that target Familiars.',
      condition: (gameState, ability) => ability.targetType === 'Familiar',
      apply: (gameState, ability, sourceCard, sourcePlayer) => {
        const validTargets = [];
        
        // Check both players' fields for valid targets
        gameState.players.forEach((player, playerIndex) => {
          player.field.forEach(card => {
            if (card.type === 'Familiar') {
              // Check if this target is valid based on ability restrictions
              if (this.isValidTarget(card, ability, sourceCard, sourcePlayer, playerIndex, gameState)) {
                validTargets.push({
                  card,
                  playerIndex,
                  zone: ZONES.FIELD
                });
              }
            }
          });
        });
        
        return validTargets;
      }
    });
    
    // Resolution rules
    this.registerRule({
      type: RULE_TYPES.RESOLUTION,
      name: 'Spell Resolution',
      description: 'Resolve a spell from the stack.',
      condition: (gameState, stackItem) => stackItem.type === 'spell',
      apply: (gameState, stackItem) => {
        const { card, controller, targets } = stackItem;
        const player = gameState.players[controller];
        
        // Apply spell effect
        if (card.effect) {
          card.effect(gameState, player, targets);
        }
        
        // Move spell to graveyard after resolution
        player.graveyard.push(card);
        
        gameState.gameLog.push({
          type: 'resolve',
          text: `${card.name} resolved.`
        });
        
        return gameState;
      }
    });
  }
  
  /**
   * Register keyword rules
   */
  registerKeywordRules() {
    const keywordRules = getKeywordRules();
    
    keywordRules.forEach(rule => {
      this.keywordRules.set(rule.keyword, rule);
      
      // Register appropriate rule types based on the keyword
      if (rule.staticEffect) {
        this.registerRule({
          type: RULE_TYPES.STATIC,
          name: `${rule.keyword} Static Effect`,
          description: rule.description,
          condition: (gameState, card) => this.hasKeyword(card, rule.keyword),
          apply: (gameState, card, player) => rule.staticEffect(gameState, card, player)
        });
      }
      
      if (rule.triggeredEffect) {
        this.registerRule({
          type: RULE_TYPES.TRIGGERED,
          name: `${rule.keyword} Triggered Effect`,
          description: rule.description,
          condition: (gameState, event, card) => 
            this.hasKeyword(card, rule.keyword) && rule.triggerCondition(gameState, event, card),
          apply: (gameState, event, card, player) => rule.triggeredEffect(gameState, event, card, player)
        });
      }
      
      if (rule.replacementEffect) {
        this.registerRule({
          type: RULE_TYPES.REPLACEMENT,
          name: `${rule.keyword} Replacement Effect`,
          description: rule.description,
          condition: (gameState, event, card) => 
            this.hasKeyword(card, rule.keyword) && rule.replacementCondition(gameState, event, card),
          apply: (gameState, event, card, player) => rule.replacementEffect(gameState, event, card, player)
        });
      }
    });
  }
  
  /**
   * Register trigger conditions
   */
  registerTriggerConditions() {
    const triggerConditions = getTriggerConditions();
    
    triggerConditions.forEach(condition => {
      this.triggerConditions.set(condition.name, condition);
    });
  }
  
  /**
   * Register a rule with the rules engine
   * @param {Object} rule - Rule definition
   */
  registerRule(rule) {
    if (!rule.type || !rule.name || !rule.condition || !rule.apply) {
      console.error('Invalid rule definition:', rule);
      return;
    }
    
    switch (rule.type) {
      case RULE_TYPES.STATIC:
        this.rules.static.push(rule);
        break;
      case RULE_TYPES.TRIGGERED:
        this.rules.triggered.push(rule);
        break;
      case RULE_TYPES.ACTIVATED:
        this.rules.activated.push(rule);
        break;
      case RULE_TYPES.REPLACEMENT:
        this.rules.replacement.push(rule);
        break;
      case RULE_TYPES.STATE_BASED:
        this.rules.stateBased.push(rule);
        break;
      case RULE_TYPES.TURN_STRUCTURE:
        this.rules.turnStructure.push(rule);
        break;
      case RULE_TYPES.COST:
        this.rules.cost.push(rule);
        break;
      case RULE_TYPES.TARGETING:
        this.rules.targeting.push(rule);
        break;
      case RULE_TYPES.RESOLUTION:
        this.rules.resolution.push(rule);
        break;
      default:
        console.error('Unknown rule type:', rule.type);
    }
  }
  
  /**
   * Register rules for a specific card
   * @param {string} cardId - Card ID
   * @param {Object} rules - Card-specific rules
   */
  registerCardRules(cardId, rules) {
    this.cardRules.set(cardId, rules);
    
    // Register appropriate rule types based on the card rules
    if (rules.staticEffect) {
      this.registerRule({
        type: RULE_TYPES.STATIC,
        name: `${rules.name} Static Effect`,
        description: rules.description || `Static effect for ${rules.name}`,
        condition: (gameState, card) => card.id === cardId,
        apply: (gameState, card, player) => rules.staticEffect(gameState, card, player)
      });
    }
    
    if (rules.triggeredEffect) {
      this.registerRule({
        type: RULE_TYPES.TRIGGERED,
        name: `${rules.name} Triggered Effect`,
        description: rules.description || `Triggered effect for ${rules.name}`,
        condition: (gameState, event, card) => 
          card.id === cardId && rules.triggerCondition(gameState, event, card),
        apply: (gameState, event, card, player) => rules.triggeredEffect(gameState, event, card, player)
      });
    }
    
    if (rules.activatedAbilities) {
      rules.activatedAbilities.forEach((ability, index) => {
        this.registerRule({
          type: RULE_TYPES.ACTIVATED,
          name: `${rules.name} Activated Ability ${index + 1}`,
          description: ability.description || `Activated ability ${index + 1} for ${rules.name}`,
          condition: (gameState, card, abilityIndex) => 
            card.id === cardId && abilityIndex === index,
          apply: (gameState, card, player, abilityIndex, targets) => 
            ability.effect(gameState, card, player, targets)
        });
      });
    }
  }
  
  /**
   * Bind to game engine events
   */
  bindEvents() {
    if (!this.gameEngine) return;
    
    // Phase change event
    this.gameEngine.on('phaseChange', (gameState, oldPhase, newPhase) => {
      this.handlePhaseChange(gameState, oldPhase, newPhase);
    });
    
    // Card played event
    this.gameEngine.on('cardPlayed', (gameState, card, player) => {
      this.handleCardPlayed(gameState, card, player);
    });
    
    // Attack declared event
    this.gameEngine.on('attackDeclared', (gameState, attackers, player) => {
      this.handleAttackDeclared(gameState, attackers, player);
    });
    
    // Block declared event
    this.gameEngine.on('blockDeclared', (gameState, blockers, player) => {
      this.handleBlockDeclared(gameState, blockers, player);
    });
    
    // Ability activated event
    this.gameEngine.on('abilityActivated', (gameState, card, player, abilityIndex, targets) => {
      this.handleAbilityActivated(gameState, card, player, abilityIndex, targets);
    });
    
    // Card destroyed event
    this.gameEngine.on('cardDestroyed', (gameState, card, player) => {
      this.handleCardDestroyed(gameState, card, player);
    });
    
    // Stack resolved event
    this.gameEngine.on('stackResolved', (gameState, stackItem) => {
      this.handleStackResolved(gameState, stackItem);
    });
  }
  
  /**
   * Handle phase change
   * @param {Object} gameState - Current game state
   * @param {string} oldPhase - Previous phase
   * @param {string} newPhase - New phase
   */
  handlePhaseChange(gameState, oldPhase, newPhase) {
    // Apply turn structure rules for the new phase
    this.rules.turnStructure.forEach(rule => {
      if (rule.condition(gameState)) {
        gameState = rule.apply(gameState);
      }
    });
    
    // Check for phase-based triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'phaseChange',
      oldPhase,
      newPhase
    });
    
    // Check state-based actions
    this.checkStateBased(gameState);
    
    // Update game state
    this.gameEngine.updateState(gameState);
  }
  
  /**
   * Handle card played
   * @param {Object} gameState - Current game state
   * @param {Object} card - Card that was played
   * @param {Object} player - Player who played the card
   */
  handleCardPlayed(gameState, card, player) {
    // Check for triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'cardPlayed',
      card,
      player: player.id
    });
    
    // Apply card-specific rules if any
    if (this.cardRules.has(card.id)) {
      const cardRule = this.cardRules.get(card.id);
      if (cardRule.onPlay) {
        gameState = cardRule.onPlay(gameState, card, player);
      }
    }
    
    // Check state-based actions
    this.checkStateBased(gameState);
    
    // Update game state
    this.gameEngine.updateState(gameState);
  }
  
  /**
   * Handle attack declared
   * @param {Object} gameState - Current game state
   * @param {Array} attackers - Attacking cards
   * @param {Object} player - Attacking player
   */
  handleAttackDeclared(gameState, attackers, player) {
    // Check for triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'attackDeclared',
      attackers,
      player: player.id
    });
    
    // Apply attack-specific rules for each attacker
    attackers.forEach(attacker => {
      // Apply card-specific rules if any
      if (this.cardRules.has(attacker.id)) {
        const cardRule = this.cardRules.get(attacker.id);
        if (cardRule.onAttack) {
          gameState = cardRule.onAttack(gameState, attacker, player);
        }
      }
      
      // Apply keyword rules for attacking
      this.applyKeywordRulesForAttack(gameState, attacker, player);
    });
    
    // Check state-based actions
    this.checkStateBased(gameState);
    
    // Update game state
    this.gameEngine.updateState(gameState);
  }
  
  /**
   * Handle block declared
   * @param {Object} gameState - Current game state
   * @param {Array} blockers - Blocking cards
   * @param {Object} player - Blocking player
   */
  handleBlockDeclared(gameState, blockers, player) {
    // Check for triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'blockDeclared',
      blockers,
      player: player.id
    });
    
    // Apply block-specific rules for each blocker
    blockers.forEach(blocker => {
      // Apply card-specific rules if any
      if (this.cardRules.has(blocker.card.id)) {
        const cardRule = this.cardRules.get(blocker.card.id);
        if (cardRule.onBlock) {
          gameState = cardRule.onBlock(gameState, blocker.card, player, blocker.attacker);
        }
      }
      
      // Apply keyword rules for blocking
      this.applyKeywordRulesForBlock(gameState, blocker.card, player, blocker.attacker);
    });
    
    // Check state-based actions
    this.checkStateBased(gameState);
    
    // Update game state
    this.gameEngine.updateState(gameState);
  }
  
  /**
   * Handle ability activated
   * @param {Object} gameState - Current game state
   * @param {Object} card - Card with the ability
   * @param {Object} player - Player who activated the ability
   * @param {number} abilityIndex - Index of the activated ability
   * @param {Array} targets - Targets of the ability
   */
  handleAbilityActivated(gameState, card, player, abilityIndex, targets) {
    // Find the activated ability rule
    const abilityRule = this.rules.activated.find(rule => 
      rule.condition(gameState, card, abilityIndex)
    );
    
    if (abilityRule) {
      // Apply the ability effect
      gameState = abilityRule.apply(gameState, card, player, abilityIndex, targets);
    }
    
    // Check for triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'abilityActivated',
      card,
      player: player.id,
      abilityIndex,
      targets
    });
    
    // Check state-based actions
    this.checkStateBased(gameState);
    
    // Update game state
    this.gameEngine.updateState(gameState);
  }
  
  /**
   * Handle card destroyed
   * @param {Object} gameState - Current game state
   * @param {Object} card - Card that was destroyed
   * @param {Object} player - Player who controlled the card
   */
  handleCardDestroyed(gameState, card, player) {
    // Check for triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'cardDestroyed',
      card,
      player: player.id
    });
    
    // Apply card-specific rules if any
    if (this.cardRules.has(card.id)) {
      const cardRule = this.cardRules.get(card.id);
      if (cardRule.onDestroy) {
        gameState = cardRule.onDestroy(gameState, card, player);
      }
    }
    
    // Check state-based actions
    this.checkStateBased(gameState);
    
    // Update game state
    this.gameEngine.updateState(gameState);
  }
  
  /**
   * Handle stack resolved
   * @param {Object} gameState - Current game state
   * @param {Object} stackItem - Item that was resolved from the stack
   */
  handleStackResolved(gameState, stackItem) {
    // Find the resolution rule
    const resolutionRule = this.rules.resolution.find(rule => 
      rule.condition(gameState, stackItem)
    );
    
    if (resolutionRule) {
      // Apply the resolution effect
      gameState = resolutionRule.apply(gameState, stackItem);
    }
    
    // Check for triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'stackResolved',
      stackItem
    });
    
    // Check state-based actions
    this.checkStateBased(gameState);
    
    // Update game state
    this.gameEngine.updateState(gameState);
  }
  
  /**
   * Check for triggered abilities
   * @param {Object} gameState - Current game state
   * @param {Object} event - Event that may trigger abilities
   */
  checkTriggeredAbilities(gameState, event) {
    // Check all cards in play for triggered abilities
    gameState.players.forEach((player, playerIndex) => {
      // Check cards in field
      player.field.forEach(card => {
        this.checkCardForTriggers(gameState, event, card, player, playerIndex);
      });
      
      // Check cards in Azoth row
      player.azothRow.forEach(card => {
        this.checkCardForTriggers(gameState, event, card, player, playerIndex);
      });
    });
  }
  
  /**
   * Check a card for triggered abilities
   * @param {Object} gameState - Current game state
   * @param {Object} event - Event that may trigger abilities
   * @param {Object} card - Card to check
   * @param {Object} player - Player who controls the card
   * @param {number} playerIndex - Index of the player
   */
  checkCardForTriggers(gameState, event, card, player, playerIndex) {
    // Check card-specific triggered abilities
    if (this.cardRules.has(card.id)) {
      const cardRule = this.cardRules.get(card.id);
      if (cardRule.triggeredEffect && cardRule.triggerCondition(gameState, event, card)) {
        // Add triggered ability to the stack
        this.addTriggeredAbilityToStack(gameState, card, player, cardRule);
      }
    }
    
    // Check for keyword-based triggered abilities
    if (card.keywords) {
      card.keywords.forEach(keyword => {
        if (this.keywordRules.has(keyword)) {
          const keywordRule = this.keywordRules.get(keyword);
          if (keywordRule.triggeredEffect && keywordRule.triggerCondition(gameState, event, card)) {
            // Add triggered ability to the stack
            this.addTriggeredAbilityToStack(gameState, card, player, keywordRule);
          }
        }
      });
    }
    
    // Check general triggered abilities
    this.rules.triggered.forEach(rule => {
      if (rule.condition(gameState, event, card)) {
        // Create a stack item for the triggered ability
        const stackItem = {
          type: 'triggered',
          card,
          controller: playerIndex,
          rule,
          event
        };
        
        // Add to stack
        gameState.stack.push(stackItem);
        
        // Log the trigger
        gameState.gameLog.push({
          type: 'trigger',
          text: `${card.name}'s ability triggered: ${rule.description}`
        });
      }
    });
  }
  
  /**
   * Add a triggered ability to the stack
   * @param {Object} gameState - Current game state
   * @param {Object} card - Card with the triggered ability
   * @param {Object} player - Player who controls the card
   * @param {Object} rule - Rule for the triggered ability
   */
  addTriggeredAbilityToStack(gameState, card, player, rule) {
    // Create a stack item for the triggered ability
    const stackItem = {
      type: 'triggered',
      card,
      controller: player.id,
      rule,
      description: rule.description || `Triggered ability of ${card.name}`
    };
    
    // Add to stack
    gameState.stack.push(stackItem);
    
    // Log the trigger
    gameState.gameLog.push({
      type: 'trigger',
      text: `${card.name}'s ability triggered: ${stackItem.description}`
    });
  }
  
  /**
   * Check state-based actions
   * @param {Object} gameState - Current game state
   */
  checkStateBased(gameState) {
    let actionsApplied = false;
    
    // Apply all state-based action rules
    this.rules.stateBased.forEach(rule => {
      if (rule.condition(gameState)) {
        const newState = rule.apply(gameState);
        if (newState !== gameState) {
          gameState = newState;
          actionsApplied = true;
        }
      }
    });
    
    // If any state-based actions were applied, check again
    if (actionsApplied) {
      this.checkStateBased(gameState);
    }
  }
  
  /**
   * Apply keyword rules for attacking
   * @param {Object} gameState - Current game state
   * @param {Object} attacker - Attacking card
   * @param {Object} player - Attacking player
   */
  applyKeywordRulesForAttack(gameState, attacker, player) {
    if (!attacker.keywords) return;
    
    attacker.keywords.forEach(keyword => {
      if (this.keywordRules.has(keyword)) {
        const keywordRule = this.keywordRules.get(keyword);
        if (keywordRule.onAttack) {
          gameState = keywordRule.onAttack(gameState, attacker, player);
        }
      }
    });
  }
  
  /**
   * Apply keyword rules for blocking
   * @param {Object} gameState - Current game state
   * @param {Object} blocker - Blocking card
   * @param {Object} player - Blocking player
   * @param {Object} attacker - Attacking card
   */
  applyKeywordRulesForBlock(gameState, blocker, player, attacker) {
    if (!blocker.keywords) return;
    
    blocker.keywords.forEach(keyword => {
      if (this.keywordRules.has(keyword)) {
        const keywordRule = this.keywordRules.get(keyword);
        if (keywordRule.onBlock) {
          gameState = keywordRule.onBlock(gameState, blocker, player, attacker);
        }
      }
    });
  }
  
  /**
   * Get active cost modifiers
   * @param {Object} gameState - Current game state
   * @param {Object} card - Card being played
   * @param {Object} player - Player playing the card
   * @returns {Array} Array of cost modifiers
   */
  getActiveCostModifiers(gameState, card, player) {
    const modifiers = [];
    
    // Check static effects that modify costs
    this.rules.static.forEach(rule => {
      if (rule.modifiesCost && rule.condition(gameState, card)) {
        modifiers.push({
          source: rule.name,
          apply: (cost, card, player, gameState) => rule.modifyCost(cost, card, player, gameState)
        });
      }
    });
    
    // Check card-specific cost modifiers
    gameState.players.forEach(p => {
      p.field.forEach(fieldCard => {
        if (this.cardRules.has(fieldCard.id)) {
          const cardRule = this.cardRules.get(fieldCard.id);
          if (cardRule.modifiesCost && cardRule.costModifierCondition(gameState, card, player)) {
            modifiers.push({
              source: fieldCard.name,
              apply: (cost, card, player, gameState) => cardRule.modifyCost(cost, card, player, gameState)
            });
          }
        }
      });
    });
    
    return modifiers;
  }
  
  /**
   * Check if a card has a specific keyword
   * @param {Object} card - Card to check
   * @param {string} keyword - Keyword to check for
   * @returns {boolean} True if the card has the keyword
   */
  hasKeyword(card, keyword) {
    return card.keywords && card.keywords.includes(keyword);
  }
  
  /**
   * Check if a target is valid for an ability
   * @param {Object} target - Target card
   * @param {Object} ability - Ability being used
   * @param {Object} sourceCard - Card with the ability
   * @param {Object} sourcePlayer - Player using the ability
   * @param {number} targetPlayerIndex - Index of the player who controls the target
   * @param {Object} gameState - Current game state
   * @returns {boolean} True if the target is valid
   */
  isValidTarget(target, ability, sourceCard, sourcePlayer, targetPlayerIndex, gameState) {
    // Check basic targeting restrictions
    if (ability.targetRestriction === 'own' && targetPlayerIndex !== sourcePlayer.id) {
      return false;
    }
    
    if (ability.targetRestriction === 'opponent' && targetPlayerIndex === sourcePlayer.id) {
      return false;
    }
    
    // Check for protection
    if (this.hasKeyword(target, 'Protection')) {
      // Check if the target has protection from the source
      const protectionTypes = target.protectionFrom || [];
      
      // Protection from card type
      if (protectionTypes.includes(sourceCard.type)) {
        return false;
      }
      
      // Protection from color
      if (sourceCard.color && protectionTypes.includes(sourceCard.color)) {
        return false;
      }
    }
    
    // Check for hexproof
    if (this.hasKeyword(target, 'Hexproof') && targetPlayerIndex !== sourcePlayer.id) {
      return false;
    }
    
    // Check for shroud
    if (this.hasKeyword(target, 'Shroud')) {
      return false;
    }
    
    // Check ability-specific targeting conditions
    if (ability.canTarget && !ability.canTarget(target, sourceCard, sourcePlayer, gameState)) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Draw a card for a player
   * @param {Object} gameState - Current game state
   * @param {number} playerIndex - Index of the player
   * @returns {Object} Updated game state
   */
  drawCard(gameState, playerIndex) {
    const player = gameState.players[playerIndex];
    
    // Check if deck is empty
    if (player.deck.length === 0) {
      // Player loses if they can't draw
      gameState.winner = 1 - playerIndex;
      gameState.gameLog.push({
        type: 'game',
        text: `${player.name} has no cards left to draw and loses the game!`
      });
      return gameState;
    }
    
    // Draw a card
    const card = player.deck.pop();
    player.hand.push(card);
    player.cardsDrawn++;
    
    gameState.gameLog.push({
      type: 'draw',
      text: `${player.name} drew a card.`
    });
    
    // Check for triggered abilities
    this.checkTriggeredAbilities(gameState, {
      type: 'cardDrawn',
      player: playerIndex,
      card
    });
    
    return gameState;
  }
}

export default RulesEngine;