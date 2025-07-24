/**
 * Advanced Rules Engine for KONIVRER
 * Handles complete rules automation, stack management, and AI-powered assistance
 */
export class AdvancedRulesEngine {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    
    // Core game state
    this.gameState = {
      phase: 'setup',
      turn: 1,
      activePlayer: 1,
      priority: 1,
      stack: [],
      zones: {
        1: { hand: [], battlefield: [], graveyard: [], library: [], exile: [] },
        2: { hand: [], battlefield: [], graveyard: [], library: [], exile: [] }
      },
      players: {
        1: { health: 100, mana: { current: 0, max: 0 }, resources: {} },
        2: { health: 100, mana: { current: 0, max: 0 }, resources: {} }
      }
    };

    // Rules database
    this.rules = new Map();
    this.triggers = new Map();
    this.replacementEffects = new Map();
    this.staticAbilities = new Map();

    // Stack management
    this.stackHistory = [];
    this.pendingTriggers = [];
    
    // AI assistant
    this.aiAssistant = {
      enabled: true,
      suggestionLevel: 'intermediate', // beginner, intermediate, advanced
      explanationDepth: 'detailed' // brief, detailed, comprehensive
    };

    // Performance tracking
    this.rulesChecks = 0;
    this.automatedActions = 0;
    
    this.initializeRules();
  }

  initializeRules() {
    this.loadCoreRules();
    this.loadCardRules();
    this.loadTriggerRules();
    this.loadReplacementEffects();
  }

  loadCoreRules() {
    // Phase structure rules
    this.rules.set('phase_structure', {
      phases: ['draw', 'main1', 'combat', 'main2', 'end'],
      transitions: {
        draw: ['main1'],
        main1: ['combat', 'main2'],
        combat: ['main2'],
        main2: ['end'],
        end: ['draw']
      },
      priority: {
        draw: ['active'],
        main1: ['active', 'nonactive'],
        combat: ['active', 'nonactive'],
        main2: ['active', 'nonactive'],
        end: ['active', 'nonactive']
      }
    });

    // Mana rules
    this.rules.set('mana_system', {
      types: ['fire', 'water', 'earth', 'air', 'neutral'],
      generation: {
        automatic: true,
        perTurn: 1,
        maximum: 10
      },
      spending: {
        timing: ['main1', 'main2', 'combat'],
        restrictions: []
      }
    });

    // Combat rules
    this.rules.set('combat_system', {
      phases: ['declare_attackers', 'declare_blockers', 'damage'],
      restrictions: {
        attacking: ['summoning_sickness', 'tapped', 'defender'],
        blocking: ['tapped', 'flying_restriction']
      },
      damage: {
        assignment: 'ordered',
        prevention: true,
        redirection: true
      }
    });

    // Zone transfer rules
    this.rules.set('zone_transfers', {
      allowed: {
        hand: ['battlefield', 'graveyard', 'exile'],
        battlefield: ['graveyard', 'exile', 'hand'],
        graveyard: ['battlefield', 'exile', 'hand'],
        library: ['hand', 'graveyard', 'exile'],
        exile: ['battlefield', 'graveyard', 'hand']
      },
      triggers: ['enters', 'leaves', 'dies']
    });
  }

  loadCardRules() {
    // Card type rules
    this.rules.set('card_types', {
      creature: {
        zones: ['battlefield'],
        properties: ['power', 'toughness', 'abilities'],
        rules: ['summoning_sickness', 'combat_participation']
      },
      spell: {
        zones: ['stack', 'graveyard'],
        properties: ['effects', 'targets'],
        rules: ['immediate_effect', 'stack_resolution']
      },
      artifact: {
        zones: ['battlefield'],
        properties: ['abilities'],
        rules: ['persistent_effects']
      },
      enchantment: {
        zones: ['battlefield'],
        properties: ['abilities'],
        rules: ['persistent_effects', 'aura_attachment']
      }
    });

    // Ability types
    this.rules.set('ability_types', {
      activated: {
        structure: ['cost', 'effect'],
        timing: 'any_time_priority',
        stack: true
      },
      triggered: {
        structure: ['trigger', 'effect'],
        timing: 'automatic',
        stack: true
      },
      static: {
        structure: ['condition', 'effect'],
        timing: 'continuous',
        stack: false
      }
    });
  }

  loadTriggerRules() {
    // Common trigger events
    const triggerEvents = [
      'enters_battlefield',
      'leaves_battlefield',
      'dies',
      'attacks',
      'blocks',
      'deals_damage',
      'takes_damage',
      'draws_card',
      'discards_card',
      'casts_spell',
      'phase_begins',
      'phase_ends',
      'turn_begins',
      'turn_ends'
    ];

    triggerEvents.forEach(event => {
      this.triggers.set(event, []);
    });
  }

  loadReplacementEffects() {
    // Replacement effect patterns
    this.replacementEffects.set('damage_prevention', {
      pattern: 'prevent_damage',
      priority: 1,
      applies: (event) => event.type === 'damage'
    });

    this.replacementEffects.set('card_draw_replacement', {
      pattern: 'instead_draw',
      priority: 2,
      applies: (event) => event.type === 'draw_card'
    });
  }

  /**
   * Process a game action with full rules checking
   */
  async processAction(action, player) {
    this.rulesChecks++;
    
    try {
      // Validate action legality
      const validation = await this.validateAction(action, player);
      if (!validation.legal) {
        return {
          success: false,
          error: validation.reason,
          suggestions: validation.suggestions
        };
      }

      // Apply replacement effects
      const modifiedAction = this.applyReplacementEffects(action);

      // Execute the action
      const result = await this.executeAction(modifiedAction, player);

      // Check for triggered abilities
      await this.checkTriggers(modifiedAction, result);

      // Update game state
      this.updateGameState(modifiedAction, result);

      // Provide AI assistance if enabled
      const assistance = this.aiAssistant.enabled ? 
        await this.generateAssistance(modifiedAction, result) : null;

      return {
        success: true,
        result,
        assistance,
        gameState: this.getPublicGameState()
      };

    } catch (error) {
      console.error('Error processing action:', error);
      return {
        success: false,
        error: 'Internal rules engine error',
        details: error.message
      };
    }
  }

  /**
   * Validate if an action is legal in the current game state
   */
  async validateAction(action, player) {
    const { type, target, source, cost } = action;

    // Check basic legality
    if (!this.isPlayersTurn(player) && !this.hasInstantSpeed(action)) {
      return {
        legal: false,
        reason: 'Can only act during your turn or at instant speed',
        suggestions: ['Wait for your turn', 'Use instant-speed abilities']
      };
    }

    // Check priority
    if (!this.hasPriority(player)) {
      return {
        legal: false,
        reason: 'You do not have priority',
        suggestions: ['Wait for priority to pass to you']
      };
    }

    // Validate specific action types
    switch (type) {
      case 'play_card':
        return this.validatePlayCard(action, player);
      case 'activate_ability':
        return this.validateActivateAbility(action, player);
      case 'declare_attackers':
        return this.validateDeclareAttackers(action, player);
      case 'declare_blockers':
        return this.validateDeclareBlockers(action, player);
      default:
        return { legal: true };
    }
  }

  validatePlayCard(action, player) {
    const { card, targets } = action;
    const playerState = this.gameState.players[player];

    // Check if card is in hand
    if (!this.gameState.zones[player].hand.includes(card.id)) {
      return {
        legal: false,
        reason: 'Card is not in your hand',
        suggestions: []
      };
    }

    // Check mana cost
    if (!this.canPayCost(card.cost, player)) {
      return {
        legal: false,
        reason: 'Insufficient mana to play this card',
        suggestions: [
          `Need ${this.formatManaCost(card.cost)}`,
          'Generate more mana or wait for next turn'
        ]
      };
    }

    // Check timing restrictions
    if (!this.isValidTiming(card, this.gameState.phase)) {
      return {
        legal: false,
        reason: `Cannot play ${card.type} during ${this.gameState.phase} phase`,
        suggestions: [`Play during ${this.getValidPhases(card).join(' or ')} phase`]
      };
    }

    // Check targets
    if (card.requiresTargets && (!targets || targets.length === 0)) {
      return {
        legal: false,
        reason: 'This card requires valid targets',
        suggestions: this.suggestValidTargets(card)
      };
    }

    // Validate each target
    if (targets) {
      for (const target of targets) {
        if (!this.isValidTarget(target, card, player)) {
          return {
            legal: false,
            reason: `Invalid target: ${target.name}`,
            suggestions: this.suggestValidTargets(card)
          };
        }
      }
    }

    return { legal: true };
  }

  validateActivateAbility(action, player) {
    const { ability, source, targets } = action;

    // Check if source is controlled by player
    if (!this.controlsSource(player, source)) {
      return {
        legal: false,
        reason: 'You do not control the source of this ability',
        suggestions: []
      };
    }

    // Check activation restrictions
    if (ability.restrictions) {
      for (const restriction of ability.restrictions) {
        if (!this.checkRestriction(restriction, source, player)) {
          return {
            legal: false,
            reason: `Cannot activate: ${restriction.description}`,
            suggestions: restriction.suggestions || []
          };
        }
      }
    }

    // Check costs
    if (!this.canPayCost(ability.cost, player)) {
      return {
        legal: false,
        reason: 'Cannot pay activation cost',
        suggestions: ['Generate required resources']
      };
    }

    return { legal: true };
  }

  /**
   * Execute a validated action
   */
  async executeAction(action, player) {
    const { type } = action;

    switch (type) {
      case 'play_card':
        return this.executePlayCard(action, player);
      case 'activate_ability':
        return this.executeActivateAbility(action, player);
      case 'declare_attackers':
        return this.executeDeclareAttackers(action, player);
      case 'declare_blockers':
        return this.executeDeclareBlockers(action, player);
      case 'pass_priority':
        return this.executePassPriority(player);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  async executePlayCard(action, player) {
    const { card, targets } = action;

    // Pay costs
    this.payCosts(card.cost, player);

    // Move card to appropriate zone
    if (card.type === 'creature' || card.type === 'artifact' || card.type === 'enchantment') {
      this.moveCard(card.id, player, 'hand', 'battlefield');
    } else {
      // Spells go to stack
      this.addToStack({
        type: 'spell',
        card,
        controller: player,
        targets,
        timestamp: Date.now()
      });
    }

    this.automatedActions++;
    
    return {
      type: 'card_played',
      card,
      player,
      targets,
      newZone: card.type === 'spell' ? 'stack' : 'battlefield'
    };
  }

  /**
   * Stack management
   */
  addToStack(stackObject) {
    this.gameState.stack.push(stackObject);
    this.stackHistory.push({
      action: 'add',
      object: stackObject,
      timestamp: Date.now(),
      stackSize: this.gameState.stack.length
    });
  }

  async resolveStack() {
    while (this.gameState.stack.length > 0) {
      const topObject = this.gameState.stack.pop();
      
      // Check if targets are still valid
      if (topObject.targets && !this.areTargetsValid(topObject.targets)) {
        // Spell fizzles
        this.moveCard(topObject.card.id, topObject.controller, 'stack', 'graveyard');
        continue;
      }

      // Resolve the effect
      await this.resolveEffect(topObject);
      
      // Move spell to graveyard if it was a spell
      if (topObject.type === 'spell') {
        this.moveCard(topObject.card.id, topObject.controller, 'stack', 'graveyard');
      }

      // Check for new triggered abilities
      await this.checkTriggers({ type: 'spell_resolved', spell: topObject });
    }
  }

  /**
   * Trigger system
   */
  async checkTriggers(event, context = {}) {
    const eventType = event.type;
    const triggeredAbilities = this.triggers.get(eventType) || [];

    for (const trigger of triggeredAbilities) {
      if (this.triggerConditionMet(trigger, event, context)) {
        this.pendingTriggers.push({
          ability: trigger,
          event,
          context,
          controller: trigger.controller,
          timestamp: Date.now()
        });
      }
    }

    // Process pending triggers in APNAP order
    await this.processPendingTriggers();
  }

  async processPendingTriggers() {
    // Sort triggers by APNAP (Active Player, Non-Active Player) order
    this.pendingTriggers.sort((a, b) => {
      if (a.controller === this.gameState.activePlayer) return -1;
      if (b.controller === this.gameState.activePlayer) return 1;
      return a.timestamp - b.timestamp;
    });

    // Add all triggers to stack
    for (const trigger of this.pendingTriggers) {
      this.addToStack({
        type: 'triggered_ability',
        ability: trigger.ability,
        controller: trigger.controller,
        event: trigger.event,
        targets: await this.chooseTargets(trigger.ability, trigger.controller)
      });
    }

    this.pendingTriggers = [];
  }

  /**
   * AI Assistant functionality
   */
  async generateAssistance(action, result) {
    if (!this.aiAssistant.enabled) return null;

    const assistance = {
      suggestions: [],
      explanations: [],
      warnings: [],
      optimizations: []
    };

    // Generate contextual suggestions
    assistance.suggestions = await this.generateSuggestions(action, result);

    // Provide rule explanations
    if (this.aiAssistant.explanationDepth !== 'brief') {
      assistance.explanations = this.generateExplanations(action, result);
    }

    // Identify potential issues
    assistance.warnings = this.identifyWarnings(action, result);

    // Suggest optimizations
    if (this.aiAssistant.suggestionLevel === 'advanced') {
      assistance.optimizations = this.suggestOptimizations(action, result);
    }

    return assistance;
  }

  async generateSuggestions(action, result) {
    const suggestions = [];
    const gameState = this.gameState;
    const currentPlayer = gameState.activePlayer;

    // Analyze current board state
    const boardAnalysis = this.analyzeBoardState(currentPlayer);

    // Suggest based on game phase
    switch (gameState.phase) {
      case 'main1':
        if (boardAnalysis.canAttack) {
          suggestions.push({
            type: 'tactical',
            priority: 'high',
            text: 'Consider moving to combat phase - you have creatures that can attack',
            action: { type: 'advance_phase', to: 'combat' }
          });
        }
        break;

      case 'combat':
        if (boardAnalysis.shouldBlock) {
          suggestions.push({
            type: 'defensive',
            priority: 'critical',
            text: 'Incoming damage detected - consider declaring blockers',
            action: { type: 'suggest_blockers', creatures: boardAnalysis.blockers }
          });
        }
        break;

      case 'main2':
        if (boardAnalysis.unusedMana > 2) {
          suggestions.push({
            type: 'resource',
            priority: 'medium',
            text: 'You have unused mana - consider playing more cards',
            action: { type: 'suggest_cards', cards: boardAnalysis.playableCards }
          });
        }
        break;
    }

    // Suggest based on hand analysis
    const handAnalysis = this.analyzeHand(currentPlayer);
    if (handAnalysis.hasCounterspells && gameState.stack.length > 0) {
      suggestions.push({
        type: 'reactive',
        priority: 'high',
        text: 'You have counterspells available for the current stack',
        action: { type: 'suggest_counterspells', spells: handAnalysis.counterspells }
      });
    }

    return suggestions;
  }

  generateExplanations(action, result) {
    const explanations = [];

    // Explain the action that was taken
    explanations.push({
      type: 'action_explanation',
      title: `Why ${action.type} worked`,
      content: this.explainActionLegality(action)
    });

    // Explain any triggered abilities
    if (this.pendingTriggers.length > 0) {
      explanations.push({
        type: 'trigger_explanation',
        title: 'Triggered Abilities',
        content: this.explainTriggeredAbilities(this.pendingTriggers)
      });
    }

    // Explain stack interactions
    if (this.gameState.stack.length > 0) {
      explanations.push({
        type: 'stack_explanation',
        title: 'Stack Resolution Order',
        content: this.explainStackOrder()
      });
    }

    return explanations;
  }

  /**
   * Performance and state management
   */
  getPublicGameState() {
    return {
      phase: this.gameState.phase,
      turn: this.gameState.turn,
      activePlayer: this.gameState.activePlayer,
      priority: this.gameState.priority,
      stackSize: this.gameState.stack.length,
      players: {
        1: {
          health: this.gameState.players[1].health,
          mana: this.gameState.players[1].mana,
          handSize: this.gameState.zones[1].hand.length,
          battlefieldSize: this.gameState.zones[1].battlefield.length
        },
        2: {
          health: this.gameState.players[2].health,
          mana: this.gameState.players[2].mana,
          handSize: this.gameState.zones[2].hand.length,
          battlefieldSize: this.gameState.zones[2].battlefield.length
        }
      }
    };
  }

  getPerformanceStats() {
    return {
      rulesChecks: this.rulesChecks,
      automatedActions: this.automatedActions,
      stackOperations: this.stackHistory.length,
      triggersProcessed: this.triggers.size
    };
  }

  /**
   * Utility methods
   */
  isPlayersTurn(player) {
    return this.gameState.activePlayer === player;
  }

  hasPriority(player) {
    return this.gameState.priority === player;
  }

  hasInstantSpeed(action) {
    return action.speed === 'instant' || action.type === 'activate_ability';
  }

  canPayCost(cost, player) {
    const playerState = this.gameState.players[player];
    
    for (const [resource, amount] of Object.entries(cost)) {
      if (resource === 'mana') {
        if (playerState.mana.current < amount) return false;
      } else if (playerState.resources[resource] < amount) {
        return false;
      }
    }
    
    return true;
  }

  moveCard(cardId, player, fromZone, toZone) {
    const zones = this.gameState.zones[player];
    const cardIndex = zones[fromZone].findIndex(id => id === cardId);
    
    if (cardIndex !== -1) {
      zones[fromZone].splice(cardIndex, 1);
      zones[toZone].push(cardId);
      
      // Trigger zone change events
      this.checkTriggers({
        type: 'zone_change',
        card: cardId,
        from: fromZone,
        to: toZone,
        player
      });
    }
  }

  formatManaCost(cost) {
    return Object.entries(cost)
      .map(([type, amount]) => `${amount} ${type}`)
      .join(', ');
  }

  /**
   * Reset and cleanup
   */
  reset() {
    this.gameState = {
      phase: 'setup',
      turn: 1,
      activePlayer: 1,
      priority: 1,
      stack: [],
      zones: {
        1: { hand: [], battlefield: [], graveyard: [], library: [], exile: [] },
        2: { hand: [], battlefield: [], graveyard: [], library: [], exile: [] }
      },
      players: {
        1: { health: 100, mana: { current: 0, max: 0 }, resources: {} },
        2: { health: 100, mana: { current: 0, max: 0 }, resources: {} }
      }
    };

    this.stackHistory = [];
    this.pendingTriggers = [];
    this.rulesChecks = 0;
    this.automatedActions = 0;
  }
}

export default AdvancedRulesEngine;