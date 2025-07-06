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
  private events: Record<string, Function[]>;

  constructor() {
    this.events = {};
  }

  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

interface GameOptions {
  startingHandSize?: number;
  startingLifeCards?: number;
  maxAzothPerTurn?: number;
  maxFieldSize?: number;
  maxHandSize?: number;
  turnTimeLimit?: number;
  enableMulligan?: boolean;
  enableBurstCards?: boolean;
  enableFlagCards?: boolean;
  enableElementalEffects?: boolean;
  enableTributeSystem?: boolean;
  [key: string]: any;
}

interface Card {
  id: string;
  name: string;
  type: 'familiar' | 'spell' | 'azoth' | 'burst' | 'flag';
  elements: string[];
  cost: number;
  power?: number;
  health?: number;
  effects?: CardEffect[];
  description?: string;
  imageUrl?: string;
  rarity?: string;
  [key: string]: any;
}

interface CardEffect {
  type: string;
  trigger: string;
  target: string;
  value: any;
  condition?: string;
  [key: string]: any;
}

interface Player {
  id: string;
  name: string;
  deck: Card[];
  hand: Card[];
  field: Card[];
  azothZone: Card[];
  lifeCards: Card[];
  graveyard: Card[];
  removedFromGame: Card[];
  azothAvailable: number;
  azothUsedThisTurn: number;
  flagCard?: Card;
  [key: string]: any;
}

interface GameState {
  players: Player[];
  activePlayer: number;
  turn: number;
  phase: 'start' | 'main' | 'combat' | 'post-combat' | 'refresh';
  stack: any[];
  attackers: Card[];
  blockers: Record<string, Card>;
  winner: number | null;
  gameOver: boolean;
  [key: string]: any;
}

class KonivrERGameEngine extends SimpleEventEmitter {
  private options: GameOptions;
  private state: GameState | null;
  private elementTypes: string[];
  private phaseHandlers: Record<string, Function>;
  private effectHandlers: Record<string, Function>;
  private gameLog: string[];

  constructor(options: GameOptions = {}) {
    super();
    
    // Set default options
    this.options = {
      startingHandSize: 5,
      startingLifeCards: 4,
      maxAzothPerTurn: 1,
      maxFieldSize: 5,
      maxHandSize: 7,
      turnTimeLimit: 60, // seconds
      enableMulligan: true,
      enableBurstCards: true,
      enableFlagCards: true,
      enableElementalEffects: true,
      enableTributeSystem: true,
      ...options
    };
    
    // Initialize game state
    this.state = null;
    
    // Define element types
    this.elementTypes = [
      'fire',
      'water',
      'earth',
      'air',
      'light',
      'dark',
      'void'
    ];
    
    // Initialize phase handlers
    this.phaseHandlers = {
      start: this.handleStartPhase.bind(this),
      main: this.handleMainPhase.bind(this),
      combat: this.handleCombatPhase.bind(this),
      'post-combat': this.handlePostCombatPhase.bind(this),
      refresh: this.handleRefreshPhase.bind(this)
    };
    
    // Initialize effect handlers
    this.effectHandlers = {
      damage: this.handleDamageEffect.bind(this),
      draw: this.handleDrawEffect.bind(this),
      boost: this.handleBoostEffect.bind(this),
      destroy: this.handleDestroyEffect.bind(this),
      search: this.handleSearchEffect.bind(this),
      return: this.handleReturnEffect.bind(this),
      banish: this.handleBanishEffect.bind(this),
      heal: this.handleHealEffect.bind(this)
    };
    
    // Initialize game log
    this.gameLog = [];
  }

  /**
   * Initialize a new game
   */
  initGame(players: { id: string; name: string; deck: Card[] }[]): GameState {
    if (players.length !== 2) {
      throw new Error('KONIVRER requires exactly 2 players');
    }
    
    // Initialize player states
    const initializedPlayers: Player[] = players.map(player => {
      // Validate deck
      if (player.deck.length < 40) {
        throw new Error(`Player ${player.name}'s deck must contain at least 40 cards`);
      }
      
      // Shuffle deck
      const shuffledDeck = this.shuffleDeck([...player.deck]);
      
      // Extract flag card if enabled
      let flagCard: Card | undefined;
      if (this.options.enableFlagCards) {
        const flagIndex = shuffledDeck.findIndex(card => card.type === 'flag');
        if (flagIndex >= 0) {
          flagCard = shuffledDeck.splice(flagIndex, 1)[0];
        }
      }
      
      return {
        id: player.id,
        name: player.name,
        deck: shuffledDeck,
        hand: [],
        field: [],
        azothZone: [],
        lifeCards: [],
        graveyard: [],
        removedFromGame: [],
        azothAvailable: 0,
        azothUsedThisTurn: 0,
        flagCard
      };
    });
    
    // Initialize game state
    this.state = {
      players: initializedPlayers,
      activePlayer: Math.floor(Math.random() * 2), // Randomly determine first player
      turn: 1,
      phase: 'start',
      stack: [],
      attackers: [],
      blockers: {},
      winner: null,
      gameOver: false
    };
    
    // Deal starting hands and life cards
    this.dealInitialCards();
    
    // Log game start
    this.logGameEvent('Game started', {
      firstPlayer: this.state.players[this.state.activePlayer].name
    });
    
    // Emit game initialized event
    this.emit('gameInitialized', this.state);
    
    return this.state;
  }

  /**
   * Shuffle a deck of cards
   */
  private shuffleDeck(deck: Card[]): Card[] {
    // Fisher-Yates shuffle algorithm
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * Deal initial cards to players
   */
  private dealInitialCards(): void {
    if (!this.state) return;
    
    // Deal life cards first
    this.state.players.forEach(player => {
      for (let i = 0; i < this.options.startingLifeCards!; i++) {
        if (player.deck.length > 0) {
          const card = player.deck.pop()!;
          player.lifeCards.push(card);
        }
      }
    });
    
    // Deal starting hands
    this.state.players.forEach(player => {
      for (let i = 0; i < this.options.startingHandSize!; i++) {
        if (player.deck.length > 0) {
          const card = player.deck.pop()!;
          player.hand.push(card);
        }
      }
    });
  }

  /**
   * Start the game
   */
  startGame(): GameState {
    if (!this.state) {
      throw new Error('Game not initialized');
    }
    
    // Start first turn
    this.startTurn();
    
    return this.state;
  }

  /**
   * Start a new turn
   */
  private startTurn(): void {
    if (!this.state) return;
    
    // Set phase to start
    this.state.phase = 'start';
    
    // Log turn start
    this.logGameEvent('Turn started', {
      turn: this.state.turn,
      player: this.state.players[this.state.activePlayer].name
    });
    
    // Handle start phase
    this.phaseHandlers.start();
    
    // Emit turn started event
    this.emit('turnStarted', {
      turn: this.state.turn,
      player: this.state.activePlayer
    });
  }

  /**
   * Handle the start phase
   */
  private handleStartPhase(): void {
    if (!this.state) return;
    
    const activePlayer = this.state.players[this.state.activePlayer];
    
    // Draw a card at the start of turn (except first turn for first player)
    if (!(this.state.turn === 1 && this.state.activePlayer === 0)) {
      this.drawCard(this.state.activePlayer, 1);
    }
    
    // Reset azoth used this turn
    activePlayer.azothUsedThisTurn = 0;
    
    // Apply start-of-turn effects
    this.applyTriggerEffects('turnStart', this.state.activePlayer);
    
    // Move to main phase
    this.state.phase = 'main';
    
    // Emit phase change event
    this.emit('phaseChanged', {
      phase: this.state.phase,
      player: this.state.activePlayer
    });
  }

  /**
   * Handle the main phase
   */
  private handleMainPhase(): void {
    // Main phase is handled by player actions
    // This method is called when entering the main phase
    if (!this.state) return;
    
    // Apply main phase start effects
    this.applyTriggerEffects('mainPhaseStart', this.state.activePlayer);
    
    // Emit phase change event
    this.emit('phaseChanged', {
      phase: this.state.phase,
      player: this.state.activePlayer
    });
  }

  /**
   * Handle the combat phase
   */
  private handleCombatPhase(): void {
    if (!this.state) return;
    
    // Reset attackers and blockers
    this.state.attackers = [];
    this.state.blockers = {};
    
    // Apply combat phase start effects
    this.applyTriggerEffects('combatPhaseStart', this.state.activePlayer);
    
    // Emit phase change event
    this.emit('phaseChanged', {
      phase: this.state.phase,
      player: this.state.activePlayer
    });
  }

  /**
   * Handle the post-combat phase
   */
  private handlePostCombatPhase(): void {
    if (!this.state) return;
    
    // Apply post-combat phase effects
    this.applyTriggerEffects('postCombatPhaseStart', this.state.activePlayer);
    
    // Emit phase change event
    this.emit('phaseChanged', {
      phase: this.state.phase,
      player: this.state.activePlayer
    });
  }

  /**
   * Handle the refresh phase
   */
  private handleRefreshPhase(): void {
    if (!this.state) return;
    
    const activePlayer = this.state.players[this.state.activePlayer];
    
    // Untap all cards
    activePlayer.field.forEach(card => {
      card.tapped = false;
    });
    
    activePlayer.azothZone.forEach(card => {
      card.tapped = false;
    });
    
    // Reset any turn-based flags
    activePlayer.field.forEach(card => {
      card.attackedThisTurn = false;
      card.usedEffectThisTurn = false;
    });
    
    // Apply end of turn effects
    this.applyTriggerEffects('turnEnd', this.state.activePlayer);
    
    // Switch active player
    this.state.activePlayer = 1 - this.state.activePlayer;
    
    // Increment turn counter if we've gone through both players
    if (this.state.activePlayer === 0) {
      this.state.turn++;
    }
    
    // Start next turn
    this.startTurn();
  }

  /**
   * Draw cards for a player
   */
  drawCard(playerId: number, count: number = 1): Card[] {
    if (!this.state) throw new Error('Game not initialized');
    
    const player = this.state.players[playerId];
    const drawnCards: Card[] = [];
    
    for (let i = 0; i < count; i++) {
      if (player.deck.length === 0) {
        // Player loses if they can't draw
        this.handlePlayerLoss(playerId, 'deckout');
        break;
      }
      
      const card = player.deck.pop()!;
      player.hand.push(card);
      drawnCards.push(card);
      
      // Log card draw
      this.logGameEvent('Card drawn', {
        player: player.name,
        card: card.name
      });
    }
    
    // Emit card drawn event
    this.emit('cardsDrawn', {
      player: playerId,
      cards: drawnCards
    });
    
    return drawnCards;
  }

  /**
   * Play an Azoth card
   */
  playAzoth(playerId: number, cardId: string): boolean {
    if (!this.state) throw new Error('Game not initialized');
    
    const player = this.state.players[playerId];
    
    // Check if it's the player's turn and main phase
    if (this.state.activePlayer !== playerId || this.state.phase !== 'main') {
      throw new Error('Can only play Azoth during your main phase');
    }
    
    // Check if player has already played max Azoth this turn
    if (player.azothUsedThisTurn >= this.options.maxAzothPerTurn!) {
      throw new Error(`Can only play ${this.options.maxAzothPerTurn} Azoth per turn`);
    }
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }
    
    const card = player.hand[cardIndex];
    
    // Check if card is an Azoth
    if (card.type !== 'azoth') {
      throw new Error('Card is not an Azoth');
    }
    
    // Remove from hand and add to Azoth zone
    player.hand.splice(cardIndex, 1);
    player.azothZone.push(card);
    
    // Increment Azoth used this turn
    player.azothUsedThisTurn++;
    
    // Increment available Azoth
    player.azothAvailable++;
    
    // Log Azoth play
    this.logGameEvent('Azoth played', {
      player: player.name,
      card: card.name,
      elements: card.elements.join(', ')
    });
    
    // Emit Azoth played event
    this.emit('azothPlayed', {
      player: playerId,
      card
    });
    
    return true;
  }

  /**
   * Summon a Familiar
   */
  summonFamiliar(playerId: number, cardId: string, azothIds: string[]): boolean {
    if (!this.state) throw new Error('Game not initialized');
    
    const player = this.state.players[playerId];
    
    // Check if it's the player's turn and main phase
    if (this.state.activePlayer !== playerId || this.state.phase !== 'main') {
      throw new Error('Can only summon Familiars during your main phase');
    }
    
    // Check if field is full
    if (player.field.length >= this.options.maxFieldSize!) {
      throw new Error(`Field is full (max ${this.options.maxFieldSize} cards)`);
    }
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }
    
    const card = player.hand[cardIndex];
    
    // Check if card is a Familiar
    if (card.type !== 'familiar') {
      throw new Error('Card is not a Familiar');
    }
    
    // Verify Azoth payment
    if (!this.verifyAzothPayment(playerId, card.cost, azothIds)) {
      throw new Error('Invalid Azoth payment');
    }
    
    // Remove from hand and add to field
    player.hand.splice(cardIndex, 1);
    
    // Add summoning sickness
    const fieldCard = { ...card, summoningSickness: true };
    player.field.push(fieldCard);
    
    // Pay Azoth cost
    this.payAzoth(playerId, azothIds);
    
    // Apply summon effects
    this.applyCardEffects(fieldCard, 'onSummon', playerId);
    
    // Log Familiar summon
    this.logGameEvent('Familiar summoned', {
      player: player.name,
      card: card.name,
      cost: card.cost,
      power: card.power,
      health: card.health
    });
    
    // Emit Familiar summoned event
    this.emit('familiarSummoned', {
      player: playerId,
      card: fieldCard
    });
    
    return true;
  }

  /**
   * Cast a Spell
   */
  castSpell(playerId: number, cardId: string, azothIds: string[], targets: string[] = []): boolean {
    if (!this.state) throw new Error('Game not initialized');
    
    const player = this.state.players[playerId];
    
    // Check if it's the player's turn and main phase
    if (this.state.activePlayer !== playerId || this.state.phase !== 'main') {
      throw new Error('Can only cast Spells during your main phase');
    }
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }
    
    const card = player.hand[cardIndex];
    
    // Check if card is a Spell
    if (card.type !== 'spell') {
      throw new Error('Card is not a Spell');
    }
    
    // Verify Azoth payment
    if (!this.verifyAzothPayment(playerId, card.cost, azothIds)) {
      throw new Error('Invalid Azoth payment');
    }
    
    // Verify targets if required
    if (card.requiresTarget && (!targets || targets.length === 0)) {
      throw new Error('Spell requires targets');
    }
    
    // Remove from hand
    player.hand.splice(cardIndex, 1);
    
    // Pay Azoth cost
    this.payAzoth(playerId, azothIds);
    
    // Apply spell effects
    this.applySpellEffects(card, playerId, targets);
    
    // Move to graveyard after resolution
    player.graveyard.push(card);
    
    // Log Spell cast
    this.logGameEvent('Spell cast', {
      player: player.name,
      card: card.name,
      cost: card.cost,
      targets: targets.length > 0 ? 'Yes' : 'None'
    });
    
    // Emit Spell cast event
    this.emit('spellCast', {
      player: playerId,
      card,
      targets
    });
    
    return true;
  }

  /**
   * Activate a Burst card
   */
  activateBurst(playerId: number, cardId: string, targets: string[] = []): boolean {
    if (!this.state || !this.options.enableBurstCards) {
      throw new Error('Burst cards not enabled or game not initialized');
    }
    
    const player = this.state.players[playerId];
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }
    
    const card = player.hand[cardIndex];
    
    // Check if card is a Burst
    if (card.type !== 'burst') {
      throw new Error('Card is not a Burst');
    }
    
    // Verify targets if required
    if (card.requiresTarget && (!targets || targets.length === 0)) {
      throw new Error('Burst requires targets');
    }
    
    // Remove from hand
    player.hand.splice(cardIndex, 1);
    
    // Apply burst effects
    this.applyBurstEffects(card, playerId, targets);
    
    // Move to graveyard after resolution
    player.graveyard.push(card);
    
    // Log Burst activation
    this.logGameEvent('Burst activated', {
      player: player.name,
      card: card.name,
      targets: targets.length > 0 ? 'Yes' : 'None'
    });
    
    // Emit Burst activated event
    this.emit('burstActivated', {
      player: playerId,
      card,
      targets
    });
    
    return true;
  }

  /**
   * Declare attackers
   */
  declareAttackers(playerId: number, cardIds: string[]): boolean {
    if (!this.state) throw new Error('Game not initialized');
    
    // Check if it's the player's turn and combat phase
    if (this.state.activePlayer !== playerId || this.state.phase !== 'combat') {
      throw new Error('Can only declare attackers during your combat phase');
    }
    
    const player = this.state.players[playerId];
    
    // Validate each attacker
    const attackers: Card[] = [];
    
    for (const cardId of cardIds) {
      const card = player.field.find(c => c.id === cardId);
      
      if (!card) {
        throw new Error(`Card ${cardId} not found on field`);
      }
      
      if (card.tapped) {
        throw new Error(`Card ${card.name} is already tapped`);
      }
      
      if (card.summoningSickness) {
        throw new Error(`Card ${card.name} has summoning sickness`);
      }
      
      attackers.push(card);
    }
    
    // Set attackers in game state
    this.state.attackers = attackers;
    
    // Tap attacking cards
    attackers.forEach(card => {
      card.tapped = true;
      card.attackedThisTurn = true;
    });
    
    // Apply attack trigger effects
    attackers.forEach(card => {
      this.applyCardEffects(card, 'onAttack', playerId);
    });
    
    // Log attack declaration
    this.logGameEvent('Attackers declared', {
      player: player.name,
      count: attackers.length,
      attackers: attackers.map(a => a.name).join(', ')
    });
    
    // Emit attackers declared event
    this.emit('attackersDeclared', {
      player: playerId,
      attackers
    });
    
    return true;
  }

  /**
   * Declare blockers
   */
  declareBlockers(playerId: number, blocks: { blockerId: string; attackerId: string }[]): boolean {
    if (!this.state) throw new Error('Game not initialized');
    
    // Check if it's the opponent's turn and combat phase
    if (this.state.activePlayer === playerId || this.state.phase !== 'combat') {
      throw new Error('Can only declare blockers during opponent\'s combat phase');
    }
    
    const player = this.state.players[playerId];
    const blockers: Record<string, Card> = {};
    
    // Validate each blocker
    for (const block of blocks) {
      const blocker = player.field.find(c => c.id === block.blockerId);
      
      if (!blocker) {
        throw new Error(`Blocker ${block.blockerId} not found on field`);
      }
      
      if (blocker.tapped) {
        throw new Error(`Blocker ${blocker.name} is already tapped`);
      }
      
      // Check if attacker exists
      const attacker = this.state.attackers.find(a => a.id === block.attackerId);
      if (!attacker) {
        throw new Error(`Attacker ${block.attackerId} not found`);
      }
      
      // Add to blockers map
      blockers[block.attackerId] = blocker;
      
      // Tap blocker
      blocker.tapped = true;
    }
    
    // Set blockers in game state
    this.state.blockers = blockers;
    
    // Apply block trigger effects
    Object.values(blockers).forEach(blocker => {
      this.applyCardEffects(blocker, 'onBlock', playerId);
    });
    
    // Log block declaration
    this.logGameEvent('Blockers declared', {
      player: player.name,
      count: Object.keys(blockers).length,
      blockers: Object.values(blockers).map(b => b.name).join(', ')
    });
    
    // Emit blockers declared event
    this.emit('blockersDeclared', {
      player: playerId,
      blockers
    });
    
    return true;
  }

  /**
   * Resolve combat
   */
  resolveCombat(): void {
    if (!this.state) throw new Error('Game not initialized');
    
    const attackingPlayerId = this.state.activePlayer;
    const defendingPlayerId = 1 - attackingPlayerId;
    
    // Process each attacker
    for (const attacker of this.state.attackers) {
      const blocker = this.state.blockers[attacker.id];
      
      if (blocker) {
        // Blocked attack - creatures deal damage to each other
        this.resolveCombatDamage(attacker, blocker, attackingPlayerId, defendingPlayerId);
      } else {
        // Unblocked attack - deal damage to defending player
        this.dealDamageToPlayer(defendingPlayerId, attacker.power || 0);
      }
    }
    
    // Apply post-combat effects
    this.applyTriggerEffects('afterCombat', attackingPlayerId);
    
    // Move to post-combat phase
    this.state.phase = 'post-combat';
    this.handlePostCombatPhase();
  }

  /**
   * Resolve combat damage between two cards
   */
  private resolveCombatDamage(attacker: Card, blocker: Card, attackerId: number, blockerId: number): void {
    // Apply pre-damage effects
    this.applyCardEffects(attacker, 'beforeDamage', attackerId);
    this.applyCardEffects(blocker, 'beforeDamage', blockerId);
    
    // Deal damage simultaneously
    const attackerDamage = attacker.power || 0;
    const blockerDamage = blocker.power || 0;
    
    // Apply damage
    blocker.health = (blocker.health || 0) - attackerDamage;
    attacker.health = (attacker.health || 0) - blockerDamage;
    
    // Log combat damage
    this.logGameEvent('Combat damage', {
      attacker: attacker.name,
      attackerDamage,
      blocker: blocker.name,
      blockerDamage
    });
    
    // Check for destroyed cards
    if (blocker.health <= 0) {
      this.destroyCard(blockerId, blocker);
    }
    
    if (attacker.health <= 0) {
      this.destroyCard(attackerId, attacker);
    }
  }

  /**
   * Deal damage to a player
   */
  dealDamageToPlayer(playerId: number, amount: number): void {
    if (!this.state) return;
    
    const player = this.state.players[playerId];
    
    // Log player damage
    this.logGameEvent('Player damaged', {
      player: player.name,
      amount
    });
    
    // Damage is applied to life cards
    for (let i = 0; i < amount; i++) {
      if (player.lifeCards.length === 0) {
        // Player loses if they run out of life cards
        this.handlePlayerLoss(playerId, 'damage');
        break;
      }
      
      // Remove a life card
      const lostCard = player.lifeCards.pop()!;
      player.graveyard.push(lostCard);
      
      // Log life card loss
      this.logGameEvent('Life card lost', {
        player: player.name,
        card: lostCard.name,
        remaining: player.lifeCards.length
      });
    }
    
    // Emit player damaged event
    this.emit('playerDamaged', {
      player: playerId,
      amount,
      remainingLifeCards: player.lifeCards.length
    });
  }

  /**
   * Destroy a card
   */
  destroyCard(playerId: number, card: Card): void {
    if (!this.state) return;
    
    const player = this.state.players[playerId];
    
    // Apply on-destroy effects
    this.applyCardEffects(card, 'onDestroy', playerId);
    
    // Remove from field
    const cardIndex = player.field.findIndex(c => c.id === card.id);
    if (cardIndex !== -1) {
      player.field.splice(cardIndex, 1);
      
      // Move to graveyard
      player.graveyard.push(card);
      
      // Log card destruction
      this.logGameEvent('Card destroyed', {
        player: player.name,
        card: card.name
      });
      
      // Emit card destroyed event
      this.emit('cardDestroyed', {
        player: playerId,
        card
      });
    }
  }

  /**
   * Verify Azoth payment
   */
  private verifyAzothPayment(playerId: number, cost: number, azothIds: string[]): boolean {
    if (!this.state) return false;
    
    const player = this.state.players[playerId];
    
    // Check if player has enough untapped Azoth
    const untappedAzoth = player.azothZone.filter(card => !card.tapped);
    if (untappedAzoth.length < cost) {
      return false;
    }
    
    // Check if the provided Azoth IDs are valid
    if (azothIds.length !== cost) {
      return false;
    }
    
    // Verify each Azoth card
    for (const azothId of azothIds) {
      const azoth = untappedAzoth.find(a => a.id === azothId);
      if (!azoth) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Pay Azoth cost
   */
  private payAzoth(playerId: number, azothIds: string[]): void {
    if (!this.state) return;
    
    const player = this.state.players[playerId];
    
    // Tap the specified Azoth cards
    for (const azothId of azothIds) {
      const azoth = player.azothZone.find(a => a.id === azothId);
      if (azoth) {
        azoth.tapped = true;
      }
    }
    
    // Decrement available Azoth
    player.azothAvailable -= azothIds.length;
  }

  /**
   * Apply card effects
   */
  private applyCardEffects(card: Card, trigger: string, playerId: number): void {
    if (!card.effects) return;
    
    // Find effects with matching trigger
    const matchingEffects = card.effects.filter(effect => effect.trigger === trigger);
    
    // Apply each effect
    for (const effect of matchingEffects) {
      const handler = this.effectHandlers[effect.type];
      if (handler) {
        handler(playerId, effect, card);
      }
    }
  }

  /**
   * Apply spell effects
   */
  private applySpellEffects(card: Card, playerId: number, targets: string[]): void {
    if (!card.effects) return;
    
    // Apply each effect
    for (const effect of card.effects) {
      const handler = this.effectHandlers[effect.type];
      if (handler) {
        handler(playerId, effect, card, targets);
      }
    }
  }

  /**
   * Apply burst effects
   */
  private applyBurstEffects(card: Card, playerId: number, targets: string[]): void {
    if (!card.effects) return;
    
    // Apply each effect
    for (const effect of card.effects) {
      const handler = this.effectHandlers[effect.type];
      if (handler) {
        handler(playerId, effect, card, targets);
      }
    }
  }

  /**
   * Apply trigger effects across all cards
   */
  private applyTriggerEffects(trigger: string, activePlayerId: number): void {
    if (!this.state) return;
    
    // Check field cards for both players
    for (let playerId = 0; playerId < this.state.players.length; playerId++) {
      const player = this.state.players[playerId];
      
      // Check field cards
      player.field.forEach(card => {
        this.applyCardEffects(card, trigger, playerId);
      });
      
      // Check flag card if enabled
      if (this.options.enableFlagCards && player.flagCard) {
        this.applyCardEffects(player.flagCard, trigger, playerId);
      }
    }
  }

  /**
   * Handle damage effect
   */
  private handleDamageEffect(playerId: number, effect: CardEffect, sourceCard: Card, targets?: string[]): void {
    if (!this.state) return;
    
    const amount = effect.value || 1;
    
    // Determine targets
    let targetCards: { playerId: number; card?: Card }[] = [];
    
    if (targets && targets.length > 0) {
      // Explicit targets provided
      for (const targetId of targets) {
        // Check if target is a player
        if (targetId === 'player0' || targetId === 'player1') {
          const targetPlayerId = parseInt(targetId.replace('player', ''));
          targetCards.push({ playerId: targetPlayerId });
        } else {
          // Find target card
          for (let pid = 0; pid < this.state.players.length; pid++) {
            const player = this.state.players[pid];
            const card = player.field.find(c => c.id === targetId);
            if (card) {
              targetCards.push({ playerId: pid, card });
              break;
            }
          }
        }
      }
    } else if (effect.target === 'opponent') {
      // Target opponent
      targetCards.push({ playerId: 1 - playerId });
    } else if (effect.target === 'all_opponents_creatures') {
      // Target all opponent's creatures
      const opponentId = 1 - playerId;
      this.state.players[opponentId].field.forEach(card => {
        targetCards.push({ playerId: opponentId, card });
      });
    } else if (effect.target === 'all_creatures') {
      // Target all creatures
      for (let pid = 0; pid < this.state.players.length; pid++) {
        this.state.players[pid].field.forEach(card => {
          targetCards.push({ playerId: pid, card });
        });
      }
    }
    
    // Apply damage to each target
    targetCards.forEach(target => {
      if (target.card) {
        // Damage to creature
        target.card.health = (target.card.health || 0) - amount;
        
        // Log card damage
        this.logGameEvent('Card damaged', {
          source: sourceCard.name,
          target: target.card.name,
          amount
        });
        
        // Check if destroyed
        if (target.card.health <= 0) {
          this.destroyCard(target.playerId, target.card);
        }
      } else {
        // Damage to player
        this.dealDamageToPlayer(target.playerId, amount);
      }
    });
  }

  /**
   * Handle draw effect
   */
  private handleDrawEffect(playerId: number, effect: CardEffect, sourceCard: Card): void {
    const amount = effect.value || 1;
    
    // Determine target player
    let targetPlayerId = playerId;
    if (effect.target === 'opponent') {
      targetPlayerId = 1 - playerId;
    }
    
    // Draw cards
    this.drawCard(targetPlayerId, amount);
  }

  /**
   * Handle boost effect
   */
  private handleBoostEffect(playerId: number, effect: CardEffect, sourceCard: Card, targets?: string[]): void {
    if (!this.state) return;
    
    const powerBoost = effect.value?.power || 0;
    const healthBoost = effect.value?.health || 0;
    
    // Determine targets
    let targetCards: Card[] = [];
    
    if (targets && targets.length > 0) {
      // Explicit targets provided
      for (const targetId of targets) {
        // Find target card
        for (let pid = 0; pid < this.state.players.length; pid++) {
          const player = this.state.players[pid];
          const card = player.field.find(c => c.id === targetId);
          if (card) {
            targetCards.push(card);
            break;
          }
        }
      }
    } else if (effect.target === 'self' && sourceCard.type === 'familiar') {
      // Target self
      targetCards.push(sourceCard);
    } else if (effect.target === 'all_friendly_creatures') {
      // Target all friendly creatures
      this.state.players[playerId].field.forEach(card => {
        targetCards.push(card);
      });
    }
    
    // Apply boost to each target
    targetCards.forEach(card => {
      card.power = (card.power || 0) + powerBoost;
      card.health = (card.health || 0) + healthBoost;
      
      // Log boost
      this.logGameEvent('Card boosted', {
        source: sourceCard.name,
        target: card.name,
        powerBoost,
        healthBoost
      });
    });
  }

  /**
   * Handle destroy effect
   */
  private handleDestroyEffect(playerId: number, effect: CardEffect, sourceCard: Card, targets?: string[]): void {
    if (!this.state) return;
    
    // Determine targets
    let targetCards: { playerId: number; card: Card }[] = [];
    
    if (targets && targets.length > 0) {
      // Explicit targets provided
      for (const targetId of targets) {
        // Find target card
        for (let pid = 0; pid < this.state.players.length; pid++) {
          const player = this.state.players[pid];
          const card = player.field.find(c => c.id === targetId);
          if (card) {
            targetCards.push({ playerId: pid, card });
            break;
          }
        }
      }
    } else if (effect.target === 'all_opponents_creatures') {
      // Target all opponent's creatures
      const opponentId = 1 - playerId;
      this.state.players[opponentId].field.forEach(card => {
        targetCards.push({ playerId: opponentId, card });
      });
    }
    
    // Destroy each target
    targetCards.forEach(target => {
      this.destroyCard(target.playerId, target.card);
    });
  }

  /**
   * Handle search effect
   */
  private handleSearchEffect(playerId: number, effect: CardEffect, sourceCard: Card): void {
    // This would be implemented in a real game with UI interaction
    // For now, just log that search would happen
    this.logGameEvent('Search effect', {
      player: this.state?.players[playerId].name,
      source: sourceCard.name,
      target: effect.target
    });
  }

  /**
   * Handle return effect
   */
  private handleReturnEffect(playerId: number, effect: CardEffect, sourceCard: Card, targets?: string[]): void {
    if (!this.state) return;
    
    // Determine targets
    let targetCards: { playerId: number; card: Card }[] = [];
    
    if (targets && targets.length > 0) {
      // Explicit targets provided
      for (const targetId of targets) {
        // Find target card
        for (let pid = 0; pid < this.state.players.length; pid++) {
          const player = this.state.players[pid];
          const card = player.field.find(c => c.id === targetId);
          if (card) {
            targetCards.push({ playerId: pid, card });
            break;
          }
        }
      }
    }
    
    // Return each target to hand
    targetCards.forEach(target => {
      const player = this.state.players[target.playerId];
      
      // Remove from field
      const cardIndex = player.field.findIndex(c => c.id === target.card.id);
      if (cardIndex !== -1) {
        player.field.splice(cardIndex, 1);
        
        // Add to hand
        player.hand.push(target.card);
        
        // Log return to hand
        this.logGameEvent('Card returned to hand', {
          source: sourceCard.name,
          target: target.card.name,
          player: player.name
        });
      }
    });
  }

  /**
   * Handle banish effect
   */
  private handleBanishEffect(playerId: number, effect: CardEffect, sourceCard: Card, targets?: string[]): void {
    if (!this.state) return;
    
    // Determine targets
    let targetCards: { playerId: number; card: Card; zone: 'field' | 'graveyard' }[] = [];
    
    if (targets && targets.length > 0) {
      // Explicit targets provided
      for (const targetId of targets) {
        // Find target card
        for (let pid = 0; pid < this.state.players.length; pid++) {
          const player = this.state.players[pid];
          
          // Check field
          const fieldCard = player.field.find(c => c.id === targetId);
          if (fieldCard) {
            targetCards.push({ playerId: pid, card: fieldCard, zone: 'field' });
            continue;
          }
          
          // Check graveyard
          const graveyardCard = player.graveyard.find(c => c.id === targetId);
          if (graveyardCard) {
            targetCards.push({ playerId: pid, card: graveyardCard, zone: 'graveyard' });
          }
        }
      }
    }
    
    // Banish each target
    targetCards.forEach(target => {
      const player = this.state.players[target.playerId];
      
      if (target.zone === 'field') {
        // Remove from field
        const cardIndex = player.field.findIndex(c => c.id === target.card.id);
        if (cardIndex !== -1) {
          player.field.splice(cardIndex, 1);
        }
      } else if (target.zone === 'graveyard') {
        // Remove from graveyard
        const cardIndex = player.graveyard.findIndex(c => c.id === target.card.id);
        if (cardIndex !== -1) {
          player.graveyard.splice(cardIndex, 1);
        }
      }
      
      // Add to removed from game zone
      player.removedFromGame.push(target.card);
      
      // Log banish
      this.logGameEvent('Card banished', {
        source: sourceCard.name,
        target: target.card.name,
        player: player.name,
        fromZone: target.zone
      });
    });
  }

  /**
   * Handle heal effect
   */
  private handleHealEffect(playerId: number, effect: CardEffect, sourceCard: Card, targets?: string[]): void {
    if (!this.state) return;
    
    const amount = effect.value || 1;
    
    // Determine targets
    let targetCards: { playerId: number; card?: Card }[] = [];
    
    if (targets && targets.length > 0) {
      // Explicit targets provided
      for (const targetId of targets) {
        // Check if target is a player
        if (targetId === 'player0' || targetId === 'player1') {
          const targetPlayerId = parseInt(targetId.replace('player', ''));
          targetCards.push({ playerId: targetPlayerId });
        } else {
          // Find target card
          for (let pid = 0; pid < this.state.players.length; pid++) {
            const player = this.state.players[pid];
            const card = player.field.find(c => c.id === targetId);
            if (card) {
              targetCards.push({ playerId: pid, card });
              break;
            }
          }
        }
      }
    } else if (effect.target === 'self' && sourceCard.type === 'familiar') {
      // Target self
      targetCards.push({ playerId, card: sourceCard });
    } else if (effect.target === 'player') {
      // Target controlling player
      targetCards.push({ playerId });
    }
    
    // Apply heal to each target
    targetCards.forEach(target => {
      if (target.card) {
        // Heal creature
        const maxHealth = target.card.originalHealth || target.card.health || 0;
        target.card.health = Math.min(maxHealth, (target.card.health || 0) + amount);
        
        // Log card heal
        this.logGameEvent('Card healed', {
          source: sourceCard.name,
          target: target.card.name,
          amount
        });
      } else {
        // Heal player (restore life cards from graveyard)
        const player = this.state.players[target.playerId];
        
        for (let i = 0; i < amount; i++) {
          if (player.graveyard.length > 0) {
            // Find a card that can be used as a life card
            const cardIndex = player.graveyard.findIndex(c => 
              c.type !== 'familiar' && c.type !== 'spell' && c.type !== 'burst'
            );
            
            if (cardIndex !== -1) {
              const card = player.graveyard.splice(cardIndex, 1)[0];
              player.lifeCards.push(card);
              
              // Log life card restoration
              this.logGameEvent('Life card restored', {
                source: sourceCard.name,
                player: player.name,
                card: card.name
              });
            }
          }
        }
      }
    });
  }

  /**
   * Handle player loss
   */
  private handlePlayerLoss(playerId: number, reason: 'damage' | 'deckout' | 'concede'): void {
    if (!this.state) return;
    
    // Set winner
    this.state.winner = 1 - playerId;
    this.state.gameOver = true;
    
    // Log game end
    this.logGameEvent('Game over', {
      winner: this.state.players[this.state.winner].name,
      loser: this.state.players[playerId].name,
      reason
    });
    
    // Emit game over event
    this.emit('gameOver', {
      winner: this.state.winner,
      loser: playerId,
      reason
    });
  }

  /**
   * Log a game event
   */
  private logGameEvent(event: string, data: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${event}: ${JSON.stringify(data)}`;
    
    this.gameLog.push(logEntry);
    
    // Emit log event
    this.emit('log', { event, data, timestamp });
  }

  /**
   * Get the current game state
   */
  getGameState(): GameState | null {
    return this.state;
  }

  /**
   * Get the game log
   */
  getGameLog(): string[] {
    return this.gameLog;
  }

  /**
   * End the current phase and move to the next
   */
  endPhase(): void {
    if (!this.state) return;
    
    const currentPhase = this.state.phase;
    
    // Determine next phase
    let nextPhase: 'start' | 'main' | 'combat' | 'post-combat' | 'refresh';
    
    switch (currentPhase) {
      case 'start':
        nextPhase = 'main';
        break;
      case 'main':
        nextPhase = 'combat';
        break;
      case 'combat':
        nextPhase = 'post-combat';
        break;
      case 'post-combat':
        nextPhase = 'refresh';
        break;
      case 'refresh':
        nextPhase = 'start';
        break;
      default:
        nextPhase = 'main';
    }
    
    // Set new phase
    this.state.phase = nextPhase;
    
    // Handle phase change
    if (this.phaseHandlers[nextPhase]) {
      this.phaseHandlers[nextPhase]();
    }
    
    // Log phase change
    this.logGameEvent('Phase changed', {
      from: currentPhase,
      to: nextPhase,
      player: this.state.players[this.state.activePlayer].name
    });
  }

  /**
   * End the current turn
   */
  endTurn(): void {
    if (!this.state) return;
    
    // Move to refresh phase which will handle turn transition
    this.state.phase = 'refresh';
    this.handleRefreshPhase();
  }

  /**
   * Concede the game
   */
  concede(playerId: number): void {
    this.handlePlayerLoss(playerId, 'concede');
  }
}

export default KonivrERGameEngine;