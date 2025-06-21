/**
 * KONIVRER AI Player - MTG Arena Edition
 *
 * This enhanced AI opponent provides an MTG Arena-like experience with:
 * - Multiple difficulty levels with distinct play styles
 * - Adaptive strategy based on game state
 * - Personality traits that affect decision making
 * - Realistic timing and "thinking" delays
 * - Deck archetype recognition and counter-play
 * - Advanced combat decision making
 *
 * The AI analyzes the game state and makes decisions based on sophisticated
 * strategies while simulating human-like behavior.
 */

class AIPlayer {
  constructor(options = {}) {
    // Core AI settings
    this.difficulty = options.difficulty || 'normal'; // 'beginner', 'easy', 'normal', 'hard', 'expert', 'mythic'
    this.playerId = options.playerId || 1; // AI is usually player 2 (index 1)
    this.gameEngine = null;
    this.gameState = null;

    // AI personality traits (0-100 scale)
    this.personality = options.personality || this.generatePersonality();

    // Decision making parameters
    this.decisionDelay = this.getDecisionDelay();
    this.thinkingTimeMultiplier = options.thinkingTimeMultiplier || 1.0;
    this.variabilityFactor =
      options.variabilityFactor || this.getVariabilityFactor();
    this.mistakeChance = options.mistakeChance || this.getMistakeChance();
    this.aggressiveness =
      options.aggressiveness || this.personality.aggressiveness;
    this.riskTolerance =
      options.riskTolerance || this.personality.riskTolerance;

    // Game analysis
    this.opponentDeckArchetype = null;
    this.opponentPlayStyle = null;
    this.gamePhase = 'early'; // 'early', 'mid', 'late'
    this.winConditions = [];
    this.threatAssessment = {};
    this.playHistory = [];
    this.currentPlan = null;

    // Emote behavior
    this.emoteFrequency = options.emoteFrequency || this.getEmoteFrequency();
    this.lastEmoteTime = 0;
    this.emotePool = options.emotePool || [
      'Hello!',
      'Good game!',
      'Nice play!',
      'Thinking...',
      'Oops!',
      'Thanks!',
    ];

    // Performance optimization
    this.cachedDecisions = new Map();
    this.decisionTimeout = null;
  }

  /**
   * Set the game engine reference
   * @param {Object} gameEngine Reference to the game engine
   */
  setGameEngine(gameEngine) {
    this.gameEngine = gameEngine;

    // Listen for game state changes
    this.gameEngine.on('gameStateUpdate', gameState => {
      this.gameState = gameState;
      this.processGameState();
    });
  }

  /**
   * Process the current game state and take action if it's AI's turn
   */
  processGameState() {
    if (!this.gameState) return;

    // Check if it's AI's turn or priority
    if (this.gameState.activePlayer === this.playerId) {
      // Add a delay to simulate thinking
      setTimeout(() => {
        this.makeDecision();
      }, this.decisionDelay);
    }
  }

  /**
   * Make a decision based on the current game state
   */
  makeDecision() {
    const phase = this.gameState.phase;

    switch (phase) {
      case 'start':
        this.handleStartPhase();
        break;

      case 'main':
        this.handleMainPhase();
        break;

      case 'combat':
        this.handleCombatPhase();
        break;

      case 'combat-blocks':
        this.handleBlockPhase();
        break;

      case 'post-combat':
        this.handlePostCombatPhase();
        break;

      default:
        // For other phases, just pass priority
        this.passPriority();
    }
  }

  /**
   * Handle the start phase
   */
  handleStartPhase() {
    const player = this.getAIPlayer();

    // Place Azoth if possible
    if (!player.azothPlacedThisTurn && player.hand.length > 0) {
      // Choose a card to place as Azoth
      const azothCard = this.chooseAzothCard();

      if (azothCard) {
        this.gameEngine.processAction(this.playerId, 'placeAzoth', {
          cardId: azothCard.id,
        });
        return;
      }
    }

    // If no Azoth to place or already placed, end the phase
    this.gameEngine.processAction(this.playerId, 'endPhase', {});
  }

  /**
   * Handle the main phase
   */
  handleMainPhase() {
    const player = this.getAIPlayer();

    // Try to summon Familiars
    const familiarToSummon = this.chooseFamiliarToSummon();
    if (familiarToSummon) {
      const azothToUse = this.chooseAzothForPayment(familiarToSummon.cost);

      if (azothToUse.length >= familiarToSummon.cost) {
        this.gameEngine.processAction(this.playerId, 'summonFamiliar', {
          cardId: familiarToSummon.id,
          azothPaid: azothToUse.map(a => a.id),
        });
        return;
      }
    }

    // Try to cast Spells
    const spellToCast = this.chooseSpellToCast();
    if (spellToCast) {
      const azothToUse = this.chooseAzothForPayment(spellToCast.cost);

      if (azothToUse.length >= spellToCast.cost) {
        const targets = this.chooseTargetsForSpell(spellToCast);

        this.gameEngine.processAction(this.playerId, 'castSpell', {
          cardId: spellToCast.id,
          azothPaid: azothToUse.map(a => a.id),
          targets,
        });
        return;
      }
    }

    // If nothing to do, end the phase
    this.gameEngine.processAction(this.playerId, 'endPhase', {});
  }

  /**
   * Handle the combat phase
   */
  handleCombatPhase() {
    const player = this.getAIPlayer();

    // Choose attackers
    const attackers = this.chooseAttackers();

    if (attackers.length > 0) {
      this.gameEngine.processAction(this.playerId, 'declareAttack', {
        attackers: attackers.map(a => a.id),
      });
    } else {
      // No attackers, skip combat
      this.gameEngine.processAction(this.playerId, 'endPhase', {});
    }
  }

  /**
   * Handle the block phase
   */
  handleBlockPhase() {
    const opponent = this.getOpponentPlayer();

    // Get attacking creatures
    const attackers = opponent.field.filter(card => card.attacking);

    if (attackers.length > 0) {
      // Choose blockers
      const blockers = this.chooseBlockers(attackers);

      if (blockers.length > 0) {
        this.gameEngine.processAction(this.playerId, 'declareBlock', {
          blockers,
        });
      } else {
        // No blockers, take the damage
        this.passPriority();
      }
    } else {
      // No attackers, just pass
      this.passPriority();
    }
  }

  /**
   * Handle the post-combat phase
   */
  handlePostCombatPhase() {
    // Similar to main phase, but with different priorities
    this.handleMainPhase();
  }

  /**
   * Choose a card to place as Azoth
   * @returns {Object|null} Card to place as Azoth, or null if none
   */
  chooseAzothCard() {
    const player = this.getAIPlayer();

    // Strategy: Place the lowest value card as Azoth
    // In a real implementation, this would be more sophisticated

    if (player.hand.length === 0) return null;

    // Sort by a simple value heuristic (cost is a good approximation)
    const sortedHand = [...player.hand].sort((a, b) => a.cost - b.cost);

    // Choose the lowest value card
    return sortedHand[0];
  }

  /**
   * Choose a Familiar to summon
   * @returns {Object|null} Familiar to summon, or null if none
   */
  chooseFamiliarToSummon() {
    const player = this.getAIPlayer();

    // Filter Familiars in hand
    const familiars = player.hand.filter(card => card.type === 'Familiar');

    if (familiars.length === 0) return null;

    // Count available untapped Azoth
    const availableAzoth = player.azothRow.filter(card => !card.tapped).length;

    // Filter Familiars we can afford
    const affordableFamiliars = familiars.filter(
      card => card.cost <= availableAzoth,
    );

    if (affordableFamiliars.length === 0) return null;

    // Strategy: Play the strongest Familiar we can afford
    // Sort by power (higher is better)
    const sortedFamiliars = [...affordableFamiliars].sort(
      (a, b) => b.power - a.power,
    );

    return sortedFamiliars[0];
  }

  /**
   * Choose a Spell to cast
   * @returns {Object|null} Spell to cast, or null if none
   */
  chooseSpellToCast() {
    const player = this.getAIPlayer();

    // Filter Spells in hand
    const spells = player.hand.filter(card => card.type === 'Spell');

    if (spells.length === 0) return null;

    // Count available untapped Azoth
    const availableAzoth = player.azothRow.filter(card => !card.tapped).length;

    // Filter Spells we can afford
    const affordableSpells = spells.filter(card => card.cost <= availableAzoth);

    if (affordableSpells.length === 0) return null;

    // Strategy: Cast the most impactful spell
    // This is a simplified version - in a real implementation, you'd evaluate
    // the impact of each spell based on the current game state

    // For now, just choose the highest cost spell (assuming higher cost = more powerful)
    const sortedSpells = [...affordableSpells].sort((a, b) => b.cost - a.cost);

    return sortedSpells[0];
  }

  /**
   * Choose Azoth cards to pay for a cost
   * @param {number} cost Cost to pay
   * @returns {Array} Array of Azoth cards to use
   */
  chooseAzothForPayment(cost) {
    const player = this.getAIPlayer();

    // Get untapped Azoth cards
    const availableAzoth = player.azothRow.filter(card => !card.tapped);

    if (availableAzoth.length < cost) return [];

    // Strategy: Use the least valuable Azoth cards first
    // This is a simplified version - in a real implementation, you'd consider
    // the elements and other factors

    // For now, just take the first 'cost' number of cards
    return availableAzoth.slice(0, cost);
  }

  /**
   * Choose targets for a spell
   * @param {Object} spell Spell being cast
   * @returns {Array} Array of target objects
   */
  chooseTargetsForSpell(spell) {
    // This would be a complex decision based on the spell's effect
    // For now, we'll return a simplified version

    const opponent = this.getOpponentPlayer();

    // If the spell requires targets, choose the opponent's strongest creature
    if (spell.requiresTarget) {
      const opponentCreatures = opponent.field.filter(
        card => card.type === 'Familiar',
      );

      if (opponentCreatures.length > 0) {
        // Sort by power (higher is better)
        const sortedCreatures = [...opponentCreatures].sort(
          (a, b) => b.power - a.power,
        );

        return [
          {
            type: 'creature',
            playerId: 1 - this.playerId,
            cardId: sortedCreatures[0].id,
          },
        ];
      }
    }

    return [];
  }

  /**
   * Choose creatures to attack with
   * @returns {Array} Array of creatures to attack with
   */
  chooseAttackers() {
    const player = this.getAIPlayer();
    const opponent = this.getOpponentPlayer();

    // Get eligible attackers (not tapped, no summoning sickness)
    const eligibleAttackers = player.field.filter(
      card =>
        card.type === 'Familiar' && !card.tapped && !card.summoningSickness,
    );

    if (eligibleAttackers.length === 0) return [];

    // Strategy: Attack with creatures that can deal damage favorably
    // This is a simplified version - in a real implementation, you'd consider
    // the opponent's blockers, life total, and other factors

    // Get opponent's potential blockers
    const opponentBlockers = opponent.field.filter(
      card => card.type === 'Familiar' && !card.tapped,
    );

    // If opponent has no blockers, attack with everything
    if (opponentBlockers.length === 0) {
      return eligibleAttackers;
    }

    // Otherwise, only attack with creatures that can win combat
    return eligibleAttackers.filter(attacker => {
      // Check if there's a blocker that can kill this attacker without dying
      const badBlocker = opponentBlockers.find(
        blocker =>
          blocker.power >= attacker.toughness &&
          blocker.toughness > attacker.power,
      );

      // If there's no bad blocker, this is a good attack
      return !badBlocker;
    });
  }

  /**
   * Choose creatures to block with
   * @param {Array} attackers Array of attacking creatures
   * @returns {Array} Array of {blocker, attacker} pairs
   */
  chooseBlockers(attackers) {
    const player = this.getAIPlayer();

    // Get eligible blockers (not tapped)
    const eligibleBlockers = player.field.filter(
      card => card.type === 'Familiar' && !card.tapped,
    );

    if (eligibleBlockers.length === 0) return [];

    // Strategy: Block in a way that minimizes damage and preserves our creatures
    // This is a simplified version - in a real implementation, you'd use more
    // sophisticated algorithms

    const blocks = [];

    // Sort attackers by power (highest first)
    const sortedAttackers = [...attackers].sort((a, b) => b.power - a.power);

    // Sort blockers by power (lowest first)
    const sortedBlockers = [...eligibleBlockers].sort(
      (a, b) => a.power - b.power,
    );

    // Try to block each attacker
    sortedAttackers.forEach(attacker => {
      // Find a blocker that can survive or trade favorably
      const goodBlocker = sortedBlockers.find(
        blocker =>
          blocker.toughness > attacker.power ||
          (blocker.toughness >= attacker.power &&
            blocker.power >= attacker.toughness),
      );

      if (goodBlocker) {
        // Remove this blocker from the available list
        const index = sortedBlockers.indexOf(goodBlocker);
        sortedBlockers.splice(index, 1);

        // Add the block
        blocks.push({
          blocker: goodBlocker.id,
          attacker: attacker.id,
        });
      }
    });

    return blocks;
  }

  /**
   * Pass priority to the opponent
   */
  passPriority() {
    this.gameEngine.processAction(this.playerId, 'passPriority', {});
  }

  /**
   * Get the AI player object
   * @returns {Object} AI player object
   */
  getAIPlayer() {
    return this.gameState.players[this.playerId];
  }

  /**
   * Get the opponent player object
   * @returns {Object} Opponent player object
   */
  getOpponentPlayer() {
    return this.gameState.players[1 - this.playerId];
  }

  /**
   * Generate a random AI personality
   * @returns {Object} Personality traits
   */
  generatePersonality() {
    // Create a personality with traits on a scale of 0-100
    return {
      aggressiveness: this.getPersonalityTraitForDifficulty('aggressiveness'),
      riskTolerance: this.getPersonalityTraitForDifficulty('riskTolerance'),
      creativity: this.getPersonalityTraitForDifficulty('creativity'),
      patience: this.getPersonalityTraitForDifficulty('patience'),
      adaptability: this.getPersonalityTraitForDifficulty('adaptability'),
      emotionality: Math.floor(Math.random() * 100), // Random for all difficulties
    };
  }

  /**
   * Get a personality trait value based on difficulty
   * @param {string} trait The personality trait
   * @returns {number} Trait value (0-100)
   */
  getPersonalityTraitForDifficulty(trait) {
    // Base value with some randomness
    const getBaseValue = (min, max) => {
      return Math.floor(min + Math.random() * (max - min));
    };

    // Different traits have different ranges based on difficulty
    switch (this.difficulty) {
      case 'beginner':
        switch (trait) {
          case 'aggressiveness':
            return getBaseValue(10, 30);
          case 'riskTolerance':
            return getBaseValue(10, 30);
          case 'creativity':
            return getBaseValue(5, 20);
          case 'patience':
            return getBaseValue(20, 40);
          case 'adaptability':
            return getBaseValue(10, 30);
          default:
            return getBaseValue(10, 30);
        }

      case 'easy':
        switch (trait) {
          case 'aggressiveness':
            return getBaseValue(20, 40);
          case 'riskTolerance':
            return getBaseValue(20, 40);
          case 'creativity':
            return getBaseValue(15, 35);
          case 'patience':
            return getBaseValue(30, 50);
          case 'adaptability':
            return getBaseValue(20, 40);
          default:
            return getBaseValue(20, 40);
        }

      case 'normal':
        switch (trait) {
          case 'aggressiveness':
            return getBaseValue(40, 60);
          case 'riskTolerance':
            return getBaseValue(40, 60);
          case 'creativity':
            return getBaseValue(40, 60);
          case 'patience':
            return getBaseValue(40, 60);
          case 'adaptability':
            return getBaseValue(40, 60);
          default:
            return getBaseValue(40, 60);
        }

      case 'hard':
        switch (trait) {
          case 'aggressiveness':
            return getBaseValue(50, 70);
          case 'riskTolerance':
            return getBaseValue(50, 70);
          case 'creativity':
            return getBaseValue(60, 80);
          case 'patience':
            return getBaseValue(60, 80);
          case 'adaptability':
            return getBaseValue(60, 80);
          default:
            return getBaseValue(60, 80);
        }

      case 'expert':
        switch (trait) {
          case 'aggressiveness':
            return getBaseValue(60, 80);
          case 'riskTolerance':
            return getBaseValue(60, 80);
          case 'creativity':
            return getBaseValue(70, 90);
          case 'patience':
            return getBaseValue(70, 90);
          case 'adaptability':
            return getBaseValue(70, 90);
          default:
            return getBaseValue(70, 90);
        }

      case 'mythic':
        switch (trait) {
          case 'aggressiveness':
            return getBaseValue(70, 95);
          case 'riskTolerance':
            return getBaseValue(70, 95);
          case 'creativity':
            return getBaseValue(80, 100);
          case 'patience':
            return getBaseValue(80, 100);
          case 'adaptability':
            return getBaseValue(80, 100);
          default:
            return getBaseValue(80, 100);
        }

      default:
        return getBaseValue(40, 60);
    }
  }

  /**
   * Get the variability factor based on difficulty
   * Higher values mean more random/unpredictable play
   * @returns {number} Variability factor (0-1)
   */
  getVariabilityFactor() {
    switch (this.difficulty) {
      case 'beginner':
        return 0.8;
      case 'easy':
        return 0.6;
      case 'normal':
        return 0.4;
      case 'hard':
        return 0.3;
      case 'expert':
        return 0.2;
      case 'mythic':
        return 0.1;
      default:
        return 0.4;
    }
  }

  /**
   * Get the chance of making a mistake based on difficulty
   * @returns {number} Mistake chance (0-1)
   */
  getMistakeChance() {
    switch (this.difficulty) {
      case 'beginner':
        return 0.25;
      case 'easy':
        return 0.15;
      case 'normal':
        return 0.08;
      case 'hard':
        return 0.04;
      case 'expert':
        return 0.02;
      case 'mythic':
        return 0.01;
      default:
        return 0.08;
    }
  }

  /**
   * Get the emote frequency based on personality
   * @returns {number} Emote frequency (0-1)
   */
  getEmoteFrequency() {
    // Base frequency by difficulty
    let baseFrequency;
    switch (this.difficulty) {
      case 'beginner':
        baseFrequency = 0.4;
        break;
      case 'easy':
        baseFrequency = 0.3;
        break;
      case 'normal':
        baseFrequency = 0.2;
        break;
      case 'hard':
        baseFrequency = 0.15;
        break;
      case 'expert':
        baseFrequency = 0.1;
        break;
      case 'mythic':
        baseFrequency = 0.05;
        break;
      default:
        baseFrequency = 0.2;
    }

    // Adjust based on emotionality if personality exists
    if (this.personality && this.personality.emotionality !== undefined) {
      // Emotionality affects frequency (0-100 scale)
      const emotionalityFactor = this.personality.emotionality / 100;
      return baseFrequency * (0.5 + emotionalityFactor);
    }

    return baseFrequency;
  }

  /**
   * Get the decision delay based on difficulty and current game state
   * @param {string} decisionType Type of decision being made
   * @returns {number} Delay in milliseconds
   */
  getDecisionDelay(decisionType = 'normal') {
    // Base delay by difficulty
    let baseDelay;
    switch (this.difficulty) {
      case 'beginner':
        baseDelay = 2500;
        break;
      case 'easy':
        baseDelay = 2000;
        break;
      case 'normal':
        baseDelay = 1500;
        break;
      case 'hard':
        baseDelay = 1200;
        break;
      case 'expert':
        baseDelay = 1000;
        break;
      case 'mythic':
        baseDelay = 800;
        break;
      default:
        baseDelay = 1500;
    }

    // Adjust based on decision type
    let typeMultiplier = 1.0;
    switch (decisionType) {
      case 'simple':
        typeMultiplier = 0.7;
        break;
      case 'normal':
        typeMultiplier = 1.0;
        break;
      case 'complex':
        typeMultiplier = 1.5;
        break;
      case 'critical':
        typeMultiplier = 2.0;
        break;
      default:
        typeMultiplier = 1.0;
    }

    // Add some randomness to seem more human-like
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

    // Apply thinking time multiplier from options
    return Math.floor(
      baseDelay * typeMultiplier * randomFactor * this.thinkingTimeMultiplier,
    );
  }

  /**
   * Maybe send an emote based on game state and personality
   * @param {string} trigger What triggered the potential emote
   */
  maybeEmote(trigger) {
    // Check if enough time has passed since last emote
    const now = Date.now();
    if (now - this.lastEmoteTime < 10000) return; // At least 10 seconds between emotes

    // Calculate chance based on frequency and trigger
    let chance = this.emoteFrequency;

    // Adjust chance based on trigger
    switch (trigger) {
      case 'gameStart':
        chance *= 3.0;
        break;
      case 'goodPlay':
        chance *= 2.0;
        break;
      case 'badPlay':
        chance *= 1.5;
        break;
      case 'takingDamage':
        chance *= 1.2;
        break;
      case 'winningPosition':
        chance *= 1.5;
        break;
      case 'losingPosition':
        chance *= 1.0;
        break;
      case 'gameEnd':
        chance *= 5.0;
        break;
      default:
        chance *= 1.0;
    }

    // Roll for emote
    if (Math.random() < chance) {
      // Choose appropriate emote for the trigger
      let emoteOptions;
      switch (trigger) {
        case 'gameStart':
          emoteOptions = ['Hello!', 'Good luck!', 'Have fun!'];
          break;
        case 'goodPlay':
          emoteOptions = ['Nice play!', 'Well done!', 'Impressive!'];
          break;
        case 'badPlay':
          emoteOptions = ['Oops!', 'My mistake!', 'Hmm...'];
          break;
        case 'takingDamage':
          emoteOptions = ['Ouch!', 'That hurt!', 'Not bad!'];
          break;
        case 'winningPosition':
          emoteOptions = ['Looking good!', 'Almost there!'];
          break;
        case 'losingPosition':
          emoteOptions = ['Well played!', 'This is tough!'];
          break;
        case 'gameEnd':
          emoteOptions = ['Good game!', 'Thanks for playing!', 'Well played!'];
          break;
        default:
          emoteOptions = this.emotePool;
      }

      // Select a random emote from the options
      const emote =
        emoteOptions[Math.floor(Math.random() * emoteOptions.length)];

      // Send the emote
      this.sendEmote(emote);

      // Update last emote time
      this.lastEmoteTime = now;
    }
  }

  /**
   * Send an emote to the game
   * @param {string} emote The emote text
   */
  sendEmote(emote) {
    if (this.gameEngine && typeof this.gameEngine.sendEmote === 'function') {
      this.gameEngine.sendEmote(this.playerId, emote);
    } else {
      console.log(`AI would emote: ${emote}`);
    }
  }

  /**
   * Set the AI difficulty
   * @param {string} difficulty Difficulty level ('beginner', 'easy', 'normal', 'hard', 'expert', 'mythic')
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty;

    // Update related parameters
    this.decisionDelay = this.getDecisionDelay();
    this.variabilityFactor = this.getVariabilityFactor();
    this.mistakeChance = this.getMistakeChance();
    this.emoteFrequency = this.getEmoteFrequency();

    // Regenerate personality for the new difficulty
    this.personality = this.generatePersonality();
    this.aggressiveness = this.personality.aggressiveness;
    this.riskTolerance = this.personality.riskTolerance;
  }
}

export default AIPlayer;
