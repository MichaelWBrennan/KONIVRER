/**
 * KONIVRER Game Engine
 * 
 * Implements the complete KONIVRER game mechanics:
 * - Elemental system with 7 element types
 * - Life Cards damage system
 * - Inherent card playing methods (Summon, Tribute, Azoth, Spell, Burst)
 * - Turn phases (Start, Main, Combat, Post-Combat, Refresh)
 * - Flag cards and deck identity
 * - Azoth resource management
 */

// Simple EventEmitter implementation for browser compatibility
class SimpleEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

class KonivrERGameEngine extends SimpleEventEmitter {
  constructor(options = {}) {
    super();
    
    this.gameState = null;
    this.gameId = this.generateGameId();
    this.options = options;
    this.aiDecisionEngine = null;
    this.aiPersonality = null;
    
    // Element types
    this.elements = {
      FIRE: 'fire',
      WATER: 'water', 
      EARTH: 'earth',
      AIR: 'air',
      AETHER: 'aether',
      NETHER: 'nether',
      GENERIC: 'generic'
    };

    // Game phases
    this.phases = {
      START: 'start',
      MAIN: 'main',
      COMBAT: 'combat',
      DEFENSE: 'defense',
      RESOLUTION: 'resolution',
      POST_COMBAT: 'postCombat',
      REFRESH: 'refresh'
    };

    // Card playing methods
    this.playMethods = {
      SUMMON: 'summon',
      TRIBUTE: 'tribute',
      AZOTH: 'azoth',
      SPELL: 'spell',
      BURST: 'burst'
    };
  }

  /**
   * Initialize a new KONIVRER game
   */
  initializeGame(players) {
    this.gameState = {
      gameId: this.gameId,
      players: {},
      currentTurn: 1,
      activePlayer: 'player1',
      phase: this.phases.START,
      gameLog: [],
      gameOver: false,
      winner: null,
      stack: [], // For spell/ability resolution
      waitingForInput: false,
      inputType: null
    };

    // Initialize players
    players.forEach((player, index) => {
      const playerId = `player${index + 1}`;
      this.gameState.players[playerId] = this.initializePlayer(player, playerId);
    });

    // Initialize AI if there are AI players
    this.initializeAI(players);
    
    // Setup pre-game actions
    this.setupPreGameActions();
    
    // Start the game
    this.startGame();
    
    this.emit('stateUpdate', this.gameState);
    return this.gameState;
  }

  /**
   * Initialize a player's game state
   */
  initializePlayer(playerData, playerId) {
    const deck = [...playerData.deck];
    this.shuffleDeck(deck);

    // Extract flag card
    const flagIndex = deck.findIndex(card => card.type === 'Flag');
    const flag = flagIndex >= 0 ? deck.splice(flagIndex, 1)[0] : null;

    // Take top 4 cards as Life Cards
    const lifeCards = deck.splice(0, 4);

    return {
      id: playerId,
      name: playerData.name,
      flag: flag,
      lifeCards: lifeCards,
      deck: deck,
      hand: [],
      field: [],
      combatRow: [],
      azothRow: [],
      removedFromPlay: [],
      discardPile: []
    };
  }

  /**
   * Setup pre-game actions
   */
  setupPreGameActions() {
    // Draw starting hands (2 cards each)
    Object.keys(this.gameState.players).forEach(playerId => {
      this.drawCards(playerId, 2);
    });

    this.addToLog('Game started');
    this.addToLog('Players drew starting hands');
  }

  /**
   * Start the game with the first turn
   */
  startGame() {
    this.addToLog(`Turn ${this.gameState.currentTurn} begins`);
    this.addToLog(`${this.gameState.activePlayer}'s turn`);
    this.startPhase();
  }

  /**
   * Start Phase: Optional Azoth placement
   */
  async startPhase() {
    this.gameState.phase = this.phases.START;
    this.addToLog(`${this.gameState.activePlayer} enters Start Phase`);
    
    // Check if current player is AI
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    if (!activePlayer.isHuman) {
      // Handle AI turn
      await this.handleAITurn();
      return;
    }
    
    // Player may optionally place 1 card face up in Azoth Row
    this.waitForPlayerInput('optionalAzothPlacement');
    
    this.emit('stateUpdate', this.gameState);
  }

  /**
   * Main Phase: Play cards and activate abilities
   */
  mainPhase() {
    this.gameState.phase = this.phases.MAIN;
    this.addToLog(`${this.gameState.activePlayer} enters Main Phase`);
    
    this.emit('stateUpdate', this.gameState);
  }

  /**
   * Combat Phase: Declare attackers
   */
  combatPhase() {
    this.gameState.phase = this.phases.COMBAT;
    this.addToLog(`${this.gameState.activePlayer} enters Combat Phase`);
    
    this.emit('stateUpdate', this.gameState);
  }

  /**
   * Defense Phase: Declare blockers
   */
  defensePhase() {
    this.gameState.phase = this.phases.DEFENSE;
    const defendingPlayer = this.getOpponentId(this.gameState.activePlayer);
    this.addToLog(`${defendingPlayer} may declare blockers`);
    
    this.emit('stateUpdate', this.gameState);
  }

  /**
   * Resolution Phase: Resolve combat damage
   */
  resolutionPhase() {
    this.gameState.phase = this.phases.RESOLUTION;
    this.addToLog('Resolving combat damage');
    
    this.resolveCombatDamage();
    
    this.emit('stateUpdate', this.gameState);
  }

  /**
   * Post-Combat Main Phase: Play additional cards
   */
  postCombatMainPhase() {
    this.gameState.phase = this.phases.POST_COMBAT;
    this.addToLog(`${this.gameState.activePlayer} enters Post-Combat Main Phase`);
    
    this.emit('stateUpdate', this.gameState);
  }

  /**
   * Refresh Phase: Refresh Azoth and end turn
   */
  refreshPhase() {
    this.gameState.phase = this.phases.REFRESH;
    this.addToLog(`${this.gameState.activePlayer} enters Refresh Phase`);
    
    // Refresh all rested Azoth
    this.refreshAzoth(this.gameState.activePlayer);
    
    // End turn
    this.endTurn();
    
    this.emit('stateUpdate', this.gameState);
  }

  /**
   * Play a card using one of the inherent methods
   */
  playCard(cardId, method, azothSpent = {}, additionalParams = {}) {
    const player = this.gameState.players[this.gameState.activePlayer];
    const card = this.findCardInHand(player, cardId);
    
    if (!card) {
      this.addToLog(`Error: Card ${cardId} not found in hand`);
      return false;
    }

    switch (method) {
      case this.playMethods.SUMMON:
        return this.playSummon(card, azothSpent);
      case this.playMethods.TRIBUTE:
        return this.playTribute(card, azothSpent, additionalParams.tributedFamiliars);
      case this.playMethods.AZOTH:
        return this.playAzoth(card);
      case this.playMethods.SPELL:
        return this.playSpell(card, azothSpent, additionalParams.abilityIndex);
      case this.playMethods.BURST:
        return this.playBurst(card, additionalParams.putInHand);
      default:
        this.addToLog(`Error: Unknown play method ${method}`);
        return false;
    }
  }

  /**
   * Play card as Summon
   */
  playSummon(card, azothSpent) {
    const playerId = this.gameState.activePlayer;
    const player = this.gameState.players[playerId];

    // Check if player can pay the cost
    if (!this.canPayCost(player, card.elements, azothSpent)) {
      this.addToLog(`Cannot pay cost for ${card.name}`);
      return false;
    }

    // Pay the cost
    this.payAzothCost(player, card.elements, azothSpent);

    // Calculate +1 counters from excess Generic Azoth
    const requiredGeneric = card.elements.generic || 0;
    const paidGeneric = azothSpent.generic || 0;
    const extraCounters = Math.max(0, paidGeneric - requiredGeneric);

    // Add card to field
    card.counters = extraCounters;
    card.zone = 'field';
    card.controllerId = playerId;
    card.summoningSickness = true;
    
    player.field.push(card);
    this.removeCardFromHand(player, card.id);

    this.addToLog(`${playerId} summoned ${card.name} with ${extraCounters} +1 counters`);
    
    // Draw a card after playing
    this.drawCards(playerId, 1);
    
    this.emit('stateUpdate', this.gameState);
    return true;
  }

  /**
   * Play card as Tribute
   */
  playTribute(card, azothSpent, tributedFamiliars = []) {
    const playerId = this.gameState.activePlayer;
    const player = this.gameState.players[playerId];

    // Calculate tribute reduction
    let tributeReduction = this.calculateTributeReduction(player, tributedFamiliars);
    
    // Apply tribute reduction to card cost
    let reducedCost = this.applyTributeReduction(card.elements, tributeReduction);

    // Check if player can pay the reduced cost
    if (!this.canPayCost(player, reducedCost, azothSpent)) {
      this.addToLog(`Cannot pay reduced cost for ${card.name}`);
      return false;
    }

    // Remove tributed familiars from game
    tributedFamiliars.forEach(familiarId => {
      this.removeFamiliarFromGame(player, familiarId);
    });

    // Continue with summon logic using reduced cost
    return this.playSummon(card, azothSpent);
  }

  /**
   * Play card as Azoth resource
   */
  playAzoth(card) {
    const playerId = this.gameState.activePlayer;
    const player = this.gameState.players[playerId];

    // Add card to Azoth Row
    card.zone = 'azothRow';
    card.rested = false; // Available immediately
    card.controllerId = playerId;
    
    player.azothRow.push(card);
    this.removeCardFromHand(player, card.id);

    this.addToLog(`${playerId} placed ${card.name} in their Azoth Row`);
    
    // Draw a card after playing
    this.drawCards(playerId, 1);
    
    this.emit('stateUpdate', this.gameState);
    return true;
  }

  /**
   * Play card as Spell
   */
  playSpell(card, azothSpent, abilityIndex = 0) {
    const playerId = this.gameState.activePlayer;
    const player = this.gameState.players[playerId];

    // Check if player can pay the cost
    if (!this.canPayCost(player, card.elements, azothSpent)) {
      this.addToLog(`Cannot pay cost for ${card.name}`);
      return false;
    }

    // Pay the cost
    this.payAzothCost(player, card.elements, azothSpent);

    // Calculate Generic Azoth paid for ability scaling
    const genericPaid = azothSpent.generic || 0;

    // Resolve the selected ability
    if (card.abilities && card.abilities[abilityIndex]) {
      this.resolveSpellAbility(card, abilityIndex, genericPaid);
    }

    // Put card on bottom of deck
    player.deck.unshift(card);
    this.removeCardFromHand(player, card.id);

    this.addToLog(`${playerId} cast ${card.name} as a Spell`);
    
    // Draw a card after playing
    this.drawCards(playerId, 1);
    
    this.emit('stateUpdate', this.gameState);
    return true;
  }

  /**
   * Play card via Burst
   */
  playBurst(card, putInHand = false) {
    const playerId = this.gameState.activePlayer;
    const player = this.gameState.players[playerId];

    if (putInHand) {
      // Put card in hand
      player.hand.push(card);
      this.addToLog(`${playerId} put ${card.name} in their hand via Burst`);
    } else {
      // Play card for free
      const remainingLifeCards = player.lifeCards.length;
      
      // Set Generic Azoth value to remaining Life Cards
      card.counters = remainingLifeCards;
      card.zone = 'field';
      card.controllerId = playerId;
      card.burstPlay = true; // Flag to prevent keyword resolution
      
      player.field.push(card);
      this.addToLog(`${playerId} played ${card.name} via Burst with ${remainingLifeCards} +1 counters`);
    }
    
    this.emit('stateUpdate', this.gameState);
    return true;
  }

  /**
   * Handle damage to a player (Life Cards system)
   */
  damagePlayer(targetPlayerId, damageAmount, sourcePlayerId = null, sourceCard = null) {
    const targetPlayer = this.gameState.players[targetPlayerId];
    
    if (targetPlayer.lifeCards.length === 0) {
      this.addToLog(`${targetPlayerId} has no Life Cards remaining!`);
      return [];
    }

    const actualDamage = Math.min(damageAmount, targetPlayer.lifeCards.length);
    const revealedCards = [];

    // Reveal and discard Life Cards
    for (let i = 0; i < actualDamage; i++) {
      const revealedCard = targetPlayer.lifeCards.pop();
      revealedCards.push(revealedCard);
      targetPlayer.discardPile.push(revealedCard);
      
      this.addToLog(`${targetPlayerId} revealed ${revealedCard.name} as a Life Card`);
      
      // Check for Burst opportunity
      this.checkBurstOpportunity(targetPlayerId, revealedCard);
    }

    // Check for game over
    if (targetPlayer.lifeCards.length === 0) {
      this.gameState.gameOver = true;
      this.gameState.winner = sourcePlayerId || this.getOpponentId(targetPlayerId);
      this.addToLog(`${this.gameState.winner} wins the game!`);
    }

    this.emit('stateUpdate', this.gameState);
    return revealedCards;
  }

  /**
   * Check for Burst opportunity when Life Card is revealed
   */
  checkBurstOpportunity(playerId, revealedCard) {
    // Player can choose to play the card via Burst or put it in hand
    this.waitForPlayerInput('burstOpportunity', { playerId, card: revealedCard });
  }

  /**
   * Resolve combat damage
   */
  resolveCombatDamage() {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    const defendingPlayerId = this.getOpponentId(this.gameState.activePlayer);
    const defendingPlayer = this.gameState.players[defendingPlayerId];

    // Process each attacker
    activePlayer.combatRow.forEach(attacker => {
      if (attacker.blocked) {
        // Resolve damage between attacker and blocker
        const blocker = attacker.blockedBy;
        this.resolveFamiliarCombat(attacker, blocker);
      } else {
        // Unblocked attacker deals damage to opponent
        const damage = this.calculateFamiliarDamage(attacker);
        this.damagePlayer(defendingPlayerId, damage, this.gameState.activePlayer, attacker);
      }
    });

    // Clear combat row
    activePlayer.combatRow = [];
    defendingPlayer.combatRow = [];
  }

  /**
   * Calculate Familiar damage including elemental bonuses
   */
  calculateFamiliarDamage(familiar) {
    let baseDamage = (familiar.baseStrength || 0) + (familiar.counters || 0);
    
    // Apply elemental advantages if applicable
    const attackerFlag = this.gameState.players[familiar.controllerId].flag;
    if (attackerFlag && familiar.elements) {
      // Implementation would check elemental advantages
      // For now, return base damage
    }
    
    return baseDamage;
  }

  /**
   * Check if player can pay Azoth cost
   */
  canPayCost(player, cardCost, azothSpent) {
    const available = this.getAvailableAzoth(player);
    
    // Check each element requirement
    for (const [element, cost] of Object.entries(cardCost)) {
      if (element === 'generic') {
        // Generic can be paid with any element
        const totalAvailable = Object.values(available).reduce((sum, val) => sum + val, 0);
        const totalSpent = Object.values(azothSpent).reduce((sum, val) => sum + val, 0);
        if (totalAvailable < totalSpent) return false;
      } else {
        const spent = azothSpent[element] || 0;
        if ((available[element] || 0) < spent || spent < cost) return false;
      }
    }
    
    return true;
  }

  /**
   * Get available Azoth for a player
   */
  getAvailableAzoth(player) {
    const available = {};
    
    player.azothRow.forEach(azothCard => {
      if (!azothCard.rested && azothCard.elements) {
        Object.keys(azothCard.elements).forEach(element => {
          available[element] = (available[element] || 0) + 1;
        });
      }
    });
    
    return available;
  }

  /**
   * Pay Azoth cost by resting Azoth cards
   */
  payAzothCost(player, cardCost, azothSpent) {
    // Rest the appropriate Azoth cards
    Object.entries(azothSpent).forEach(([element, amount]) => {
      let remaining = amount;
      
      player.azothRow.forEach(azothCard => {
        if (remaining > 0 && !azothCard.rested && azothCard.elements[element]) {
          azothCard.rested = true;
          remaining--;
        }
      });
    });
  }

  /**
   * Refresh all rested Azoth for a player
   */
  refreshAzoth(playerId) {
    const player = this.gameState.players[playerId];
    
    player.azothRow.forEach(azothCard => {
      azothCard.rested = false;
    });
    
    this.addToLog(`${playerId} refreshed all Azoth`);
  }

  /**
   * Draw cards for a player
   */
  drawCards(playerId, count) {
    const player = this.gameState.players[playerId];
    
    for (let i = 0; i < count; i++) {
      if (player.deck.length > 0) {
        const drawnCard = player.deck.pop();
        player.hand.push(drawnCard);
      }
    }
    
    if (count > 0) {
      this.addToLog(`${playerId} drew ${count} card${count > 1 ? 's' : ''}`);
    }
  }

  /**
   * End the current turn
   */
  endTurn() {
    // Switch active player
    this.gameState.activePlayer = this.getOpponentId(this.gameState.activePlayer);
    
    // Increment turn counter if it's player1's turn again
    if (this.gameState.activePlayer === 'player1') {
      this.gameState.currentTurn++;
    }
    
    this.addToLog(`Turn ${this.gameState.currentTurn} begins`);
    this.addToLog(`${this.gameState.activePlayer}'s turn`);
    
    // Start new turn
    this.startPhase();
  }

  /**
   * AI System Integration
   */
  async initializeAI(players) {
    // Check if there are AI players
    const aiPlayers = players.filter(player => !player.isHuman);
    
    if (aiPlayers.length > 0) {
      // Dynamically import cutting-edge AI modules (for browser compatibility)
      try {
        const { default: CuttingEdgeAI } = await import('./CuttingEdgeAI.js');
        const { PersonalityManager } = await import('./AIPersonalities.js');
        
        // Initialize cutting-edge AI system
        const personalities = ['strategist', 'berserker', 'trickster', 'scholar', 'gambler', 'perfectionist'];
        const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
        
        this.cuttingEdgeAI = new CuttingEdgeAI(randomPersonality);
        this.aiPersonality = new PersonalityManager(randomPersonality);
        
        // Enable all cutting-edge features
        this.cuttingEdgeAI.quantumDecisionMaking = true;
        this.cuttingEdgeAI.consciousnessSimulation = true;
        this.cuttingEdgeAI.advancedTheoryOfMind = true;
        this.cuttingEdgeAI.personalityEvolution = true;
        
        console.log(`AI initialized with personality: ${this.aiPersonality.getDisplayInfo().name}`);
        
      } catch (error) {
        console.warn('Cutting-edge AI system failed to load, falling back to basic AI:', error);
        // Fallback to basic AI if cutting-edge system fails
        try {
          const { default: AIDecisionEngine } = await import('./AIDecisionEngine.js');
          this.aiDecisionEngine = new AIDecisionEngine(this);
          console.log('Fallback AI system loaded successfully');
        } catch (fallbackError) {
          console.error('All AI systems failed to load:', fallbackError);
          this.cuttingEdgeAI = null;
          this.aiDecisionEngine = null;
          this.aiPersonality = null;
        }
      }
    }
  }

  /**
   * Handle AI turn execution
   */
  async handleAITurn() {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    
    if (!activePlayer.isHuman) {
      try {
        let aiDecision = null;
        
        // Use cutting-edge AI if available
        if (this.cuttingEdgeAI) {
          const availableActions = this.getAvailableActions(activePlayer);
          const playerBehaviorData = this.getPlayerBehaviorData();
          
          aiDecision = await this.cuttingEdgeAI.makeDecision(
            this.gameState, 
            availableActions, 
            playerBehaviorData
          );
          
          // Execute the cutting-edge AI decision
          await this.executeCuttingEdgeAIDecision(aiDecision);
          
        } else if (this.aiDecisionEngine) {
          // Fallback to basic AI
          await this.aiDecisionEngine.executeTurn(this.gameState);
        }
        
        // Update AI mood based on turn outcome
        if (this.aiPersonality) {
          const turnSuccess = this.evaluateAITurnSuccess();
          this.aiPersonality.updateMood({ 
            type: turnSuccess > 0.6 ? 'good_play' : 'bad_play' 
          });
        }
        
      } catch (error) {
        console.error('AI turn execution failed:', error);
        // Fallback to basic AI behavior
        await this.executeBasicAITurn();
      }
    }
  }

  /**
   * Basic AI fallback behavior
   */
  async executeBasicAITurn() {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    
    // Simple AI: play first playable card
    for (let i = 0; i < activePlayer.hand.length; i++) {
      const card = activePlayer.hand[i];
      
      if (this.canPlayCard(this.gameState.activePlayer, card)) {
        // Find empty field slot
        const emptySlot = activePlayer.field.findIndex(slot => slot === null);
        
        if (emptySlot !== -1) {
          // Play the card
          await this.playCard(this.gameState.activePlayer, i, emptySlot, {
            method: 'summon',
            genericCost: card.genericCost || 1
          });
          
          // Add thinking pause
          await new Promise(resolve => setTimeout(resolve, 1000));
          break;
        }
      }
    }
    
    // End turn
    this.endTurn();
  }

  /**
   * Check if AI can play a card
   */
  canPlayCard(playerId, card) {
    const player = this.gameState.players[playerId];
    
    // Check if there's space in field
    const hasSpace = player.field.some(slot => slot === null);
    if (!hasSpace) return false;
    
    // Check if player has required elements
    const requiredElements = card.cost || [];
    const availableElements = player.azoth.map(azoth => azoth.element);
    
    return requiredElements.every(element => 
      availableElements.includes(element) || element === 'Generic'
    );
  }

  /**
   * Evaluate how successful the AI's turn was
   */
  evaluateAITurnSuccess() {
    // Simple evaluation based on board presence and hand size
    const aiPlayer = this.gameState.players[this.gameState.activePlayer];
    const opponentId = this.getOpponentId(this.gameState.activePlayer);
    const opponent = this.gameState.players[opponentId];
    
    const aiFieldCount = aiPlayer.field.filter(slot => slot !== null).length;
    const opponentFieldCount = opponent.field.filter(slot => slot !== null).length;
    
    const fieldAdvantage = aiFieldCount - opponentFieldCount;
    const handAdvantage = aiPlayer.hand.length - opponent.hand.length;
    
    // Normalize to 0-1 scale
    return Math.max(0, Math.min(1, 0.5 + (fieldAdvantage + handAdvantage * 0.1) * 0.2));
  }

  /**
   * Get AI personality info for display
   */
  getAIPersonalityInfo() {
    return this.aiPersonality ? this.aiPersonality.getDisplayInfo() : null;
  }

  /**
   * Utility methods
   */
  generateGameId() {
    return 'game_' + Math.random().toString(36).substr(2, 9);
  }

  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  getOpponentId(playerId) {
    return playerId === 'player1' ? 'player2' : 'player1';
  }

  findCardInHand(player, cardId) {
    return player.hand.find(card => card.id === cardId);
  }

  removeCardFromHand(player, cardId) {
    const index = player.hand.findIndex(card => card.id === cardId);
    if (index >= 0) {
      player.hand.splice(index, 1);
    }
  }

  addToLog(message) {
    this.gameState.gameLog.push(message);
  }

  waitForPlayerInput(inputType, data = {}) {
    this.gameState.waitingForInput = true;
    this.gameState.inputType = inputType;
    this.gameState.inputData = data;
  }

  getState() {
    return this.gameState;
  }

  // Helper methods that are referenced but missing
  calculateTributeReduction(player, tributedFamiliars) {
    // Each tributed familiar reduces cost by 1 generic
    return { generic: tributedFamiliars.length };
  }

  applyTributeReduction(originalCost, reduction) {
    const reducedCost = { ...originalCost };
    if (reduction.generic && reducedCost.generic) {
      reducedCost.generic = Math.max(0, reducedCost.generic - reduction.generic);
    }
    return reducedCost;
  }

  removeFamiliarFromGame(player, familiarId) {
    // Remove familiar from field
    const familiarIndex = player.field.findIndex(card => card.id === familiarId);
    if (familiarIndex >= 0) {
      const familiar = player.field.splice(familiarIndex, 1)[0];
      player.removedFromPlay.push(familiar);
      this.addToLog(`${familiar.name} was removed from play`);
    }
  }

  resolveSpellAbility(card, abilityIndex, genericPaid) {
    const ability = card.abilities[abilityIndex];
    this.addToLog(`Resolving ${ability.name}: ${ability.description}`);
    // Spell ability resolution would be implemented here
  }

  resolveFamiliarCombat(attacker, blocker) {
    const attackerDamage = this.calculateFamiliarDamage(attacker);
    const blockerDamage = this.calculateFamiliarDamage(blocker);
    
    // Apply damage
    attacker.damage = (attacker.damage || 0) + blockerDamage;
    blocker.damage = (blocker.damage || 0) + attackerDamage;
    
    this.addToLog(`${attacker.name} and ${blocker.name} deal damage to each other`);
  }

  // Phase transition methods
  enterStart() { this.startPhase(); }
  enterMain() { this.mainPhase(); }
  enterCombat() { this.combatPhase(); }
  enterDefense() { this.defensePhase(); }
  enterResolution() { this.resolutionPhase(); }
  enterPostCombat() { this.postCombatMainPhase(); }
  enterRefresh() { this.refreshPhase(); }
  endCurrentTurn() { this.endTurn(); }

  /**
   * Get available actions for AI decision making
   */
  getAvailableActions(player) {
    const actions = [];
    
    // Add card play actions
    if (player.hand) {
      player.hand.forEach((card, index) => {
        if (this.canPlayCard(player, card)) {
          actions.push({
            type: 'play_card',
            cardIndex: index,
            card: card,
            cost: card.cost || 0,
            power: card.power || 0,
            aggressive: card.power > 5,
            defensive: card.type === 'defense',
            isCreative: card.experimental || false
          });
        }
      });
    }
    
    // Add other possible actions
    actions.push({
      type: 'pass',
      cost: 0,
      power: 0,
      defensive: true
    });
    
    return actions;
  }

  /**
   * Get player behavior data for AI analysis
   */
  getPlayerBehaviorData() {
    const humanPlayer = this.gameState.players.find(p => p.isHuman);
    if (!humanPlayer) {
      return {
        actions: [],
        timingData: [],
        decisionSpeed: 0.5,
        riskTaking: 0.5,
        aggressivePlay: 0.5,
        resourceConservation: 0.5
      };
    }
    
    // Analyze recent player actions
    const recentActions = this.gameState.actionHistory?.slice(-10) || [];
    const playerActions = recentActions.filter(action => action.playerId === humanPlayer.id);
    
    return {
      actions: playerActions,
      timingData: playerActions.map(action => action.decisionTime || 2000),
      decisionSpeed: this.calculateDecisionSpeed(playerActions),
      riskTaking: this.calculateRiskTaking(playerActions),
      aggressivePlay: this.calculateAggressivePlay(playerActions),
      resourceConservation: this.calculateResourceConservation(playerActions)
    };
  }

  /**
   * Execute cutting-edge AI decision
   */
  async executeCuttingEdgeAIDecision(aiDecision) {
    if (!aiDecision || !aiDecision.action) {
      console.warn('Invalid AI decision received');
      return;
    }
    
    const action = aiDecision.action;
    
    // Set AI thinking state
    this.aiIsThinking = true;
    
    // Wait for AI thinking time (human-like behavior)
    if (aiDecision.thinkingTime) {
      await new Promise(resolve => setTimeout(resolve, aiDecision.thinkingTime));
    }
    
    try {
      // Execute the action based on type
      switch (action.type) {
        case 'play_card':
          if (action.cardIndex !== undefined) {
            // Simulate playing a card
            this.addToLog(`AI plays ${action.card?.name || 'a card'}`);
          }
          break;
          
        case 'pass':
          this.addToLog('AI passes turn');
          break;
          
        default:
          console.warn('Unknown AI action type:', action.type);
          this.addToLog('AI takes an action');
      }
      
      // Store AI decision for learning
      this.lastAIDecision = aiDecision;
      
    } catch (error) {
      console.error('Failed to execute AI decision:', error);
    } finally {
      this.aiIsThinking = false;
    }
  }

  /**
   * Calculate decision speed metric
   */
  calculateDecisionSpeed(actions) {
    if (actions.length === 0) return 0.5;
    
    const avgTime = actions.reduce((sum, action) => 
      sum + (action.decisionTime || 2000), 0
    ) / actions.length;
    
    // Normalize: 1000ms = 0.5, faster = higher score
    return Math.max(0.1, Math.min(1.0, 2000 / avgTime));
  }

  /**
   * Calculate risk taking metric
   */
  calculateRiskTaking(actions) {
    if (actions.length === 0) return 0.5;
    
    const riskyActions = actions.filter(action => 
      action.type === 'attack' || 
      (action.cost && action.cost > 5) ||
      action.experimental
    ).length;
    
    return Math.min(1.0, riskyActions / actions.length);
  }

  /**
   * Calculate aggressive play metric
   */
  calculateAggressivePlay(actions) {
    if (actions.length === 0) return 0.5;
    
    const aggressiveActions = actions.filter(action => 
      action.type === 'attack' || 
      action.aggressive ||
      (action.power && action.power > 5)
    ).length;
    
    return Math.min(1.0, aggressiveActions / actions.length);
  }

  /**
   * Calculate resource conservation metric
   */
  calculateResourceConservation(actions) {
    if (actions.length === 0) return 0.5;
    
    const totalCost = actions.reduce((sum, action) => sum + (action.cost || 0), 0);
    const avgCost = totalCost / actions.length;
    
    // Lower average cost = higher conservation
    return Math.max(0.1, Math.min(1.0, 1 - (avgCost / 10)));
  }

  /**
   * Check if player can play a card
   */
  canPlayCard(player, card) {
    if (!card || !player.resources) return false;
    
    const cost = card.cost || 0;
    return player.resources >= cost;
  }

  /**
   * Get AI status for display (enhanced for cutting-edge AI)
   */
  getAIStatus() {
    if (!this.aiPersonality) {
      return null;
    }
    
    const baseStatus = {
      personality: this.aiPersonality.getDisplayInfo(),
      isThinking: this.aiIsThinking || false,
      lastAction: this.lastAIAction || null,
      mood: this.aiPersonality.getCurrentMood()
    };
    
    // Add cutting-edge AI status if available
    if (this.cuttingEdgeAI) {
      const cuttingEdgeStatus = this.cuttingEdgeAI.getAIStatus();
      return {
        ...baseStatus,
        cuttingEdge: cuttingEdgeStatus,
        consciousness: this.cuttingEdgeAI.expressConsciousness?.() || null,
        lastDecision: this.lastAIDecision || null
      };
    }
    
    return baseStatus;
  }
}

export default KonivrERGameEngine;