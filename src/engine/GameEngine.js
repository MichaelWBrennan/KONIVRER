/**
 * KONIVRER Game Engine
 *
 * This class handles the core game logic for the KONIVRER card game.
 * It manages game state, enforces rules, and processes player actions.
 */

class GameEngine {
  constructor() {
    this.gameState = null;
    this.eventListeners = {};
    this.gameId = this.generateGameId();
  }

  /**
   * Initialize a new game with the given players and decks
   * @param {Object} options Game initialization options
   * @param {Array} options.players Array of player objects with name and deck
   * @param {boolean} options.isOnline Whether this is an online game
   * @param {boolean} options.isAI Whether one player is an AI
   */
  initializeGame(options) {
    const { players, isOnline = false, isAI = false } = options;

    if (!players || players.length !== 2) {
      throw new Error('Game requires exactly 2 players');
    }

    // Initialize game state
    this.gameState = {
      gameId: this.gameId,
      turn: 1,
      phase: 'setup', // setup, start, main, combat, post-combat, refresh, end
      currentPlayer: 0, // Index of the current player (0 or 1)
      activePlayer: 0, // Player with priority
      players: players.map((player, index) => ({
        id: index,
        name: player.name,
        deck: this.shuffleDeck([...player.deck]),
        hand: [],
        lifeCards: [],
        field: [],
        azothRow: [],
        graveyard: [],
        removedZone: [],
        flag: player.flag || null,
      })),
      stack: [], // For resolving abilities and effects
      gameLog: [],
      isOnline,
      isAI,
      winner: null,
      waitingFor: null,
      timer: 0,
    };

    // Initial setup - draw life cards
    this.gameState.players.forEach(player => {
      // Draw 4 life cards
      for (let i = 0; i < 4; i++) {
        const card = player.deck.pop();
        if (card) {
          player.lifeCards.push({ ...card, faceDown: true });
        }
      }

      // Draw initial hand (7 cards)
      for (let i = 0; i < 7; i++) {
        const card = player.deck.pop();
        if (card) {
          player.hand.push(card);
        }
      }
    });

    // Log game start
    this.addToGameLog('game', 'Game started');

    // Emit game initialized event
    this.emitEvent('gameInitialized', this.gameState);

    return this.gameState;
  }

  /**
   * Start the game after setup is complete
   */
  startGame() {
    if (this.gameState.phase !== 'setup') {
      throw new Error('Game has already started');
    }

    this.gameState.phase = 'start';
    this.addToGameLog(
      'phase',
      `${this.getCurrentPlayer().name}'s turn 1 has begun`,
    );

    // Emit game started event
    this.emitEvent('gameStarted', this.gameState);

    // Start first turn
    this.startPhase();

    return this.gameState;
  }

  /**
   * Process a player action
   * @param {number} playerId ID of the player taking the action
   * @param {string} actionType Type of action (play, summon, cast, attack, etc.)
   * @param {Object} actionData Data associated with the action
   */
  processAction(playerId, actionType, actionData) {
    // Verify it's the player's turn or they have priority
    if (playerId !== this.gameState.activePlayer) {
      throw new Error('Not your turn or priority');
    }

    // Process different action types
    switch (actionType) {
      case 'placeAzoth':
        return this.placeAzoth(playerId, actionData.cardId);

      case 'summonFamiliar':
        return this.summonFamiliar(
          playerId,
          actionData.cardId,
          actionData.azothPaid,
        );

      case 'castSpell':
        return this.castSpell(
          playerId,
          actionData.cardId,
          actionData.azothPaid,
          actionData.targets,
        );

      case 'declareAttack':
        return this.declareAttack(playerId, actionData.attackers);

      case 'declareBlock':
        return this.declareBlock(playerId, actionData.blockers);

      case 'activateAbility':
        return this.activateAbility(
          playerId,
          actionData.cardId,
          actionData.abilityIndex,
          actionData.targets,
        );

      case 'passPriority':
        return this.passPriority(playerId);

      case 'endPhase':
        return this.endPhase(playerId);

      case 'endTurn':
        return this.endTurn(playerId);

      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  }

  /**
   * Place a card as Azoth (resource)
   * @param {number} playerId Player ID
   * @param {string} cardId Card ID to place as Azoth
   */
  placeAzoth(playerId, cardId) {
    const player = this.getPlayerById(playerId);

    // Check if in the correct phase
    if (this.gameState.phase !== 'start' && this.gameState.phase !== 'main') {
      throw new Error('Can only place Azoth during Start or Main phase');
    }

    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    // Check if player has already placed Azoth this turn
    if (this.gameState.phase === 'start' && player.azothPlacedThisTurn) {
      throw new Error('Already placed Azoth this turn');
    }

    // Remove from hand and add to Azoth row
    const card = player.hand.splice(cardIndex, 1)[0];
    player.azothRow.push({ ...card, tapped: false });

    // Mark that player has placed Azoth this turn
    player.azothPlacedThisTurn = true;

    // Log the action
    this.addToGameLog('azoth', `${player.name} placed ${card.name} as Azoth`);

    // Emit event
    this.emitEvent('azothPlaced', { playerId, card });

    return this.gameState;
  }

  /**
   * Summon a Familiar
   * @param {number} playerId Player ID
   * @param {string} cardId Card ID to summon
   * @param {Array} azothPaid Array of Azoth card IDs used to pay the cost
   */
  summonFamiliar(playerId, cardId, azothPaid) {
    const player = this.getPlayerById(playerId);

    // Check if in the correct phase
    if (
      this.gameState.phase !== 'main' &&
      this.gameState.phase !== 'post-combat'
    ) {
      throw new Error(
        'Can only summon Familiars during Main or Post-Combat phase',
      );
    }

    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    const card = player.hand[cardIndex];

    // Check if card is a Familiar
    if (card.type !== 'Familiar') {
      throw new Error('Card is not a Familiar');
    }

    // Verify Azoth payment
    this.verifyAzothPayment(player, card, azothPaid);

    // Remove from hand and add to field
    player.hand.splice(cardIndex, 1);

    // Calculate strength counters based on Azoth paid
    const strengthPaid = azothPaid.reduce((total, azothId) => {
      const azoth = player.azothRow.find(a => a.id === azothId);
      return total + (azoth.elements.includes('Strength') ? 1 : 0);
    }, 0);

    // Add to field with strength counters
    player.field.push({
      ...card,
      counters: strengthPaid,
      summoningSickness: true, // Can't attack the turn it's summoned
    });

    // Tap the Azoth cards used
    azothPaid.forEach(azothId => {
      const azoth = player.azothRow.find(a => a.id === azothId);
      if (azoth) {
        azoth.tapped = true;
      }
    });

    // Log the action
    this.addToGameLog(
      'summon',
      `${player.name} summoned ${card.name} with ${strengthPaid} strength counters`,
    );

    // Emit event
    this.emitEvent('familiarSummoned', { playerId, card, strengthPaid });

    return this.gameState;
  }

  /**
   * Cast a Spell
   * @param {number} playerId Player ID
   * @param {string} cardId Card ID to cast
   * @param {Array} azothPaid Array of Azoth card IDs used to pay the cost
   * @param {Array} targets Array of target objects (if required)
   */
  castSpell(playerId, cardId, azothPaid, targets = []) {
    const player = this.getPlayerById(playerId);

    // Check if in the correct phase
    if (
      this.gameState.phase !== 'main' &&
      this.gameState.phase !== 'post-combat'
    ) {
      throw new Error('Can only cast Spells during Main or Post-Combat phase');
    }

    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    const card = player.hand[cardIndex];

    // Check if card is a Spell
    if (card.type !== 'Spell') {
      throw new Error('Card is not a Spell');
    }

    // Verify Azoth payment
    this.verifyAzothPayment(player, card, azothPaid);

    // Verify targets if required
    if (card.requiresTarget && (!targets || targets.length === 0)) {
      throw new Error('Spell requires targets');
    }

    // Remove from hand
    player.hand.splice(cardIndex, 1);

    // Tap the Azoth cards used
    azothPaid.forEach(azothId => {
      const azoth = player.azothRow.find(a => a.id === azothId);
      if (azoth) {
        azoth.tapped = true;
      }
    });

    // Add to stack for resolution
    this.gameState.stack.push({
      type: 'spell',
      card,
      controller: playerId,
      targets,
    });

    // Log the action
    this.addToGameLog('cast', `${player.name} cast ${card.name}`);

    // Resolve the stack
    this.resolveStack();

    // Emit event
    this.emitEvent('spellCast', { playerId, card, targets });

    return this.gameState;
  }

  /**
   * Declare attackers for combat
   * @param {number} playerId Player ID
   * @param {Array} attackers Array of card IDs that are attacking
   */
  declareAttack(playerId, attackers) {
    const player = this.getPlayerById(playerId);

    // Check if in the correct phase
    if (this.gameState.phase !== 'combat') {
      throw new Error('Can only declare attacks during Combat phase');
    }

    // Check if it's the player's turn
    if (this.gameState.currentPlayer !== playerId) {
      throw new Error('Not your turn to attack');
    }

    // Verify all attackers are valid
    attackers.forEach(attackerId => {
      const attacker = player.field.find(card => card.id === attackerId);

      if (!attacker) {
        throw new Error(`Attacker ${attackerId} not found on field`);
      }

      if (attacker.tapped) {
        throw new Error(`Attacker ${attacker.name} is already tapped`);
      }

      if (attacker.summoningSickness) {
        throw new Error(`Attacker ${attacker.name} has summoning sickness`);
      }
    });

    // Mark attackers as attacking and tap them
    attackers.forEach(attackerId => {
      const attacker = player.field.find(card => card.id === attackerId);
      attacker.attacking = true;
      attacker.tapped = true;
    });

    // Set game state to waiting for blocks
    this.gameState.phase = 'combat-blocks';
    this.gameState.activePlayer = 1 - playerId; // Give priority to defender
    this.gameState.waitingFor = 'blocks';

    // Log the action
    this.addToGameLog(
      'attack',
      `${player.name} declared ${attackers.length} attackers`,
    );

    // Emit event
    this.emitEvent('attackDeclared', { playerId, attackers });

    return this.gameState;
  }

  /**
   * Declare blockers for combat
   * @param {number} playerId Player ID
   * @param {Array} blockers Array of {blocker: cardId, attacker: cardId} pairs
   */
  declareBlock(playerId, blockers) {
    const player = this.getPlayerById(playerId);
    const attacker = this.getPlayerById(1 - playerId);

    // Check if in the correct phase
    if (this.gameState.phase !== 'combat-blocks') {
      throw new Error('Can only declare blocks during Combat-Blocks phase');
    }

    // Check if it's the player's priority
    if (this.gameState.activePlayer !== playerId) {
      throw new Error('Not your priority to block');
    }

    // Verify all blockers are valid
    blockers.forEach(({ blocker: blockerId, attacker: attackerId }) => {
      const blockerCard = player.field.find(card => card.id === blockerId);

      if (!blockerCard) {
        throw new Error(`Blocker ${blockerId} not found on field`);
      }

      if (blockerCard.tapped) {
        throw new Error(`Blocker ${blockerCard.name} is already tapped`);
      }

      // Verify attacker exists and is attacking
      const attackerCard = attacker.field.find(
        card => card.id === attackerId && card.attacking,
      );
      if (!attackerCard) {
        throw new Error(`Attacker ${attackerId} not found or not attacking`);
      }

      // Check if attacker is already blocked by this player
      if (attackerCard.blockedBy) {
        throw new Error(`Attacker ${attackerCard.name} is already blocked`);
      }
    });

    // Mark blockers and attackers
    blockers.forEach(({ blocker: blockerId, attacker: attackerId }) => {
      const blockerCard = player.field.find(card => card.id === blockerId);
      const attackerCard = attacker.field.find(card => card.id === attackerId);

      blockerCard.blocking = attackerId;
      attackerCard.blockedBy = blockerId;
    });

    // Move to damage resolution
    this.gameState.phase = 'combat-damage';
    this.gameState.waitingFor = 'damage';

    // Log the action
    this.addToGameLog(
      'block',
      `${player.name} declared ${blockers.length} blockers`,
    );

    // Emit event
    this.emitEvent('blockDeclared', { playerId, blockers });

    // Resolve combat damage
    this.resolveCombatDamage();

    return this.gameState;
  }

  /**
   * Resolve combat damage
   */
  resolveCombatDamage() {
    const attacker = this.getPlayerById(this.gameState.currentPlayer);
    const defender = this.getPlayerById(1 - this.gameState.currentPlayer);

    // Get all attacking creatures
    const attackingCreatures = attacker.field.filter(card => card.attacking);

    // Process each attacker
    attackingCreatures.forEach(attackingCard => {
      if (attackingCard.blockedBy) {
        // Blocked attack - creatures deal damage to each other
        const blockerCard = defender.field.find(
          card => card.id === attackingCard.blockedBy,
        );

        // Attacker deals damage to blocker
        blockerCard.damage = (blockerCard.damage || 0) + attackingCard.power;

        // Blocker deals damage to attacker
        attackingCard.damage = (attackingCard.damage || 0) + blockerCard.power;

        this.addToGameLog(
          'damage',
          `${attackingCard.name} and ${blockerCard.name} dealt damage to each other`,
        );

        // Check if creatures are destroyed
        if (blockerCard.damage >= blockerCard.toughness) {
          this.destroyCreature(
            1 - this.gameState.currentPlayer,
            blockerCard.id,
          );
        }

        if (attackingCard.damage >= attackingCard.toughness) {
          this.destroyCreature(this.gameState.currentPlayer, attackingCard.id);
        }
      } else {
        // Unblocked attack - deal damage to opponent's life cards
        this.dealDamageToPlayer(
          1 - this.gameState.currentPlayer,
          attackingCard.power,
        );
        this.addToGameLog(
          'damage',
          `${attackingCard.name} dealt ${attackingCard.power} damage to ${defender.name}`,
        );
      }
    });

    // Clean up combat flags
    attacker.field.forEach(card => {
      card.attacking = false;
    });

    defender.field.forEach(card => {
      card.blocking = null;
    });

    // Move to post-combat phase
    this.gameState.phase = 'post-combat';
    this.gameState.activePlayer = this.gameState.currentPlayer;
    this.gameState.waitingFor = null;

    this.addToGameLog('phase', 'Combat damage has been resolved');

    // Emit event
    this.emitEvent('combatDamageResolved', this.gameState);

    return this.gameState;
  }

  /**
   * Deal damage to a player's life cards
   * @param {number} playerId Player ID
   * @param {number} amount Amount of damage
   */
  dealDamageToPlayer(playerId, amount) {
    const player = this.getPlayerById(playerId);

    // Draw cards from life cards equal to damage
    for (let i = 0; i < amount; i++) {
      if (player.lifeCards.length === 0) {
        // Player loses if they have no more life cards
        this.gameState.winner = 1 - playerId;
        this.addToGameLog('game', `${player.name} has lost the game`);
        this.emitEvent('gameOver', { winner: 1 - playerId });
        break;
      }

      const lifeCard = player.lifeCards.pop();

      // Check if card has Burst ability
      if (
        lifeCard.abilities &&
        lifeCard.abilities.some(ability => ability.type === 'burst')
      ) {
        // Play the card for free
        this.addToGameLog(
          'burst',
          `${player.name} revealed ${lifeCard.name} with Burst!`,
        );

        // Add to stack for resolution
        this.gameState.stack.push({
          type: 'burst',
          card: lifeCard,
          controller: playerId,
        });

        // Resolve the stack
        this.resolveStack();
      } else {
        // Add to hand
        player.hand.push(lifeCard);
        this.addToGameLog(
          'damage',
          `${player.name} drew ${lifeCard.name} from life cards`,
        );
      }
    }

    return this.gameState;
  }

  /**
   * Destroy a creature and move it to the graveyard
   * @param {number} playerId Player ID
   * @param {string} cardId Card ID to destroy
   */
  destroyCreature(playerId, cardId) {
    const player = this.getPlayerById(playerId);

    // Find the card on the field
    const cardIndex = player.field.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found on field');
    }

    // Remove from field and add to graveyard
    const card = player.field.splice(cardIndex, 1)[0];
    player.graveyard.push(card);

    this.addToGameLog('destroy', `${card.name} was destroyed`);

    // Emit event
    this.emitEvent('creatureDestroyed', { playerId, card });

    return this.gameState;
  }

  /**
   * Activate an ability on a card
   * @param {number} playerId Player ID
   * @param {string} cardId Card ID with the ability
   * @param {number} abilityIndex Index of the ability to activate
   * @param {Array} targets Array of target objects (if required)
   */
  activateAbility(playerId, cardId, abilityIndex, targets = []) {
    const player = this.getPlayerById(playerId);

    // Find the card on the field
    const card = player.field.find(c => c.id === cardId);
    if (!card) {
      throw new Error('Card not found on field');
    }

    // Check if card has abilities
    if (!card.abilities || !card.abilities[abilityIndex]) {
      throw new Error('Ability not found on card');
    }

    const ability = card.abilities[abilityIndex];

    // Check if ability can be activated (not tapped, etc.)
    if (card.tapped && ability.tapCost) {
      throw new Error('Card is already tapped');
    }

    // Check if ability requires targets
    if (ability.requiresTarget && (!targets || targets.length === 0)) {
      throw new Error('Ability requires targets');
    }

    // Pay costs (tap, etc.)
    if (ability.tapCost) {
      card.tapped = true;
    }

    // Add to stack for resolution
    this.gameState.stack.push({
      type: 'ability',
      card,
      ability,
      controller: playerId,
      targets,
    });

    this.addToGameLog(
      'ability',
      `${player.name} activated ${card.name}'s ability`,
    );

    // Resolve the stack
    this.resolveStack();

    // Emit event
    this.emitEvent('abilityActivated', { playerId, card, ability, targets });

    return this.gameState;
  }

  /**
   * Pass priority to the opponent
   * @param {number} playerId Player ID
   */
  passPriority(playerId) {
    // Check if it's the player's priority
    if (this.gameState.activePlayer !== playerId) {
      throw new Error('Not your priority to pass');
    }

    // Pass priority to opponent
    this.gameState.activePlayer = 1 - playerId;

    this.addToGameLog(
      'pass',
      `${this.getPlayerById(playerId).name} passed priority`,
    );

    // If both players pass in succession, move to the next phase
    if (this.gameState.lastPass === 1 - playerId) {
      this.endPhase(playerId);
    } else {
      this.gameState.lastPass = playerId;
    }

    // Emit event
    this.emitEvent('priorityPassed', { from: playerId, to: 1 - playerId });

    return this.gameState;
  }

  /**
   * End the current phase and move to the next one
   * @param {number} playerId Player ID
   */
  endPhase(playerId) {
    // Check if it's the player's turn
    if (this.gameState.currentPlayer !== playerId) {
      throw new Error('Not your turn to end phase');
    }

    // Determine next phase based on current phase
    switch (this.gameState.phase) {
      case 'start':
        this.gameState.phase = 'main';
        this.addToGameLog('phase', 'Main Phase');
        break;

      case 'main':
        this.gameState.phase = 'combat';
        this.addToGameLog('phase', 'Combat Phase');
        break;

      case 'combat':
      case 'combat-blocks':
      case 'combat-damage':
        this.gameState.phase = 'post-combat';
        this.addToGameLog('phase', 'Post-Combat Phase');
        break;

      case 'post-combat':
        this.gameState.phase = 'refresh';
        this.addToGameLog('phase', 'Refresh Phase');
        this.refreshPhase();
        break;

      case 'refresh':
        this.endTurn(playerId);
        break;

      default:
        throw new Error(`Unknown phase: ${this.gameState.phase}`);
    }

    // Reset priority to current player
    this.gameState.activePlayer = this.gameState.currentPlayer;
    this.gameState.lastPass = null;

    // Emit event
    this.emitEvent('phaseEnded', { phase: this.gameState.phase });

    return this.gameState;
  }

  /**
   * Handle the refresh phase
   */
  refreshPhase() {
    const player = this.getCurrentPlayer();

    // Untap all Azoth
    player.azothRow.forEach(card => {
      card.tapped = false;
    });

    // Remove summoning sickness from creatures
    player.field.forEach(card => {
      card.summoningSickness = false;
    });

    // Reset Azoth placement for next turn
    player.azothPlacedThisTurn = false;

    this.addToGameLog('refresh', `${player.name} refreshed their cards`);

    return this.gameState;
  }

  /**
   * End the current turn and start the next one
   * @param {number} playerId Player ID
   */
  endTurn(playerId) {
    // Check if it's the player's turn
    if (this.gameState.currentPlayer !== playerId) {
      throw new Error('Not your turn to end');
    }

    // Switch to the other player
    this.gameState.currentPlayer = 1 - playerId;
    this.gameState.activePlayer = 1 - playerId;

    // Increment turn counter if it's back to the first player
    if (this.gameState.currentPlayer === 0) {
      this.gameState.turn++;
    }

    // Reset phase to start
    this.gameState.phase = 'start';

    // Reset other turn-based flags
    this.gameState.lastPass = null;

    this.addToGameLog(
      'turn',
      `${this.getCurrentPlayer().name}'s turn ${this.gameState.turn} has begun`,
    );

    // Emit event
    this.emitEvent('turnEnded', {
      previousPlayer: playerId,
      currentPlayer: 1 - playerId,
      turn: this.gameState.turn,
    });

    return this.gameState;
  }

  /**
   * Resolve the top item on the stack
   */
  resolveStack() {
    if (this.gameState.stack.length === 0) {
      return this.gameState;
    }

    const stackItem = this.gameState.stack.pop();
    const player = this.getPlayerById(stackItem.controller);

    switch (stackItem.type) {
      case 'spell':
        // Resolve spell effect
        this.resolveSpellEffect(stackItem);

        // Move to bottom of deck
        player.deck.unshift(stackItem.card);

        this.addToGameLog('resolve', `${stackItem.card.name} resolved`);
        break;

      case 'ability':
        // Resolve ability effect
        this.resolveAbilityEffect(stackItem);

        this.addToGameLog(
          'resolve',
          `${stackItem.card.name}'s ability resolved`,
        );
        break;

      case 'burst':
        // Resolve burst effect
        this.resolveBurstEffect(stackItem);

        this.addToGameLog(
          'resolve',
          `${stackItem.card.name}'s burst ability resolved`,
        );
        break;
    }

    // Emit event
    this.emitEvent('stackItemResolved', stackItem);

    // Check if there are more items on the stack
    if (this.gameState.stack.length > 0) {
      this.resolveStack();
    }

    return this.gameState;
  }

  /**
   * Resolve a spell effect
   * @param {Object} stackItem Stack item to resolve
   */
  resolveSpellEffect(stackItem) {
    // This would contain the actual implementation of spell effects
    // For now, we'll just log that it resolved
    console.log(`Resolving spell: ${stackItem.card.name}`);

    // In a real implementation, this would apply the spell's effect based on its rules text

    return this.gameState;
  }

  /**
   * Resolve an ability effect
   * @param {Object} stackItem Stack item to resolve
   */
  resolveAbilityEffect(stackItem) {
    // This would contain the actual implementation of ability effects
    // For now, we'll just log that it resolved
    console.log(
      `Resolving ability: ${stackItem.card.name} - ${stackItem.ability.text}`,
    );

    // In a real implementation, this would apply the ability's effect based on its rules text

    return this.gameState;
  }

  /**
   * Resolve a burst effect
   * @param {Object} stackItem Stack item to resolve
   */
  resolveBurstEffect(stackItem) {
    // This would contain the actual implementation of burst effects
    // For now, we'll just log that it resolved
    console.log(`Resolving burst: ${stackItem.card.name}`);

    // In a real implementation, this would apply the burst effect based on its rules text

    return this.gameState;
  }

  /**
   * Start the current phase
   */
  startPhase() {
    const player = this.getCurrentPlayer();

    switch (this.gameState.phase) {
      case 'start':
        // First player on first turn doesn't draw
        if (this.gameState.turn === 1 && this.gameState.currentPlayer === 0) {
          this.addToGameLog('phase', 'Start Phase - no draw on first turn');
        } else {
          // Draw a card
          if (player.deck.length > 0) {
            const card = player.deck.pop();
            player.hand.push(card);
            this.addToGameLog('draw', `${player.name} drew a card`);
          }
        }
        break;

      case 'main':
        this.addToGameLog(
          'phase',
          'Main Phase - play cards and summon Familiars',
        );
        break;

      case 'combat':
        this.addToGameLog('phase', 'Combat Phase - declare attackers');
        break;

      case 'post-combat':
        this.addToGameLog('phase', 'Post-Combat Phase - play additional cards');
        break;

      case 'refresh':
        this.addToGameLog('phase', 'Refresh Phase - untap resources');
        break;
    }

    // Emit event
    this.emitEvent('phaseStarted', { phase: this.gameState.phase });

    return this.gameState;
  }

  /**
   * Verify that Azoth payment is valid
   * @param {Object} player Player object
   * @param {Object} card Card being cast/summoned
   * @param {Array} azothPaid Array of Azoth card IDs used to pay
   */
  verifyAzothPayment(player, card, azothPaid) {
    // Check if all Azoth cards exist and are untapped
    azothPaid.forEach(azothId => {
      const azoth = player.azothRow.find(a => a.id === azothId);

      if (!azoth) {
        throw new Error(`Azoth card ${azothId} not found`);
      }

      if (azoth.tapped) {
        throw new Error(`Azoth card ${azoth.name} is already tapped`);
      }
    });

    // Check if the correct elements are being paid
    // This is a simplified version - in a real implementation, you'd need to check
    // that the specific element requirements are met

    // For now, just check that enough Azoth is being paid
    if (azothPaid.length < card.cost) {
      throw new Error(
        `Not enough Azoth paid. Required: ${card.cost}, Paid: ${azothPaid.length}`,
      );
    }

    return true;
  }

  /**
   * Get the current player object
   * @returns {Object} Player object
   */
  getCurrentPlayer() {
    return this.gameState.players[this.gameState.currentPlayer];
  }

  /**
   * Get a player by ID
   * @param {number} playerId Player ID
   * @returns {Object} Player object
   */
  getPlayerById(playerId) {
    const player = this.gameState.players[playerId];
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }
    return player;
  }

  /**
   * Add an entry to the game log
   * @param {string} type Type of log entry
   * @param {string} text Log message
   */
  addToGameLog(type, text) {
    this.gameState.gameLog.push({
      type,
      text,
      timestamp: Date.now(),
    });

    // Keep log at a reasonable size
    if (this.gameState.gameLog.length > 100) {
      this.gameState.gameLog.shift();
    }

    return this.gameState;
  }

  /**
   * Shuffle a deck of cards
   * @param {Array} deck Array of cards to shuffle
   * @returns {Array} Shuffled deck
   */
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * Generate a unique game ID
   * @returns {string} Game ID
   */
  generateGameId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Register an event listener
   * @param {string} event Event name
   * @param {Function} callback Callback function
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Emit an event
   * @param {string} event Event name
   * @param {*} data Event data
   */
  emitEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Get the current game state
   * @returns {Object} Game state
   */
  getGameState() {
    return this.gameState;
  }
}

export default GameEngine;
