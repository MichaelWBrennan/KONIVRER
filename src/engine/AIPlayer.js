/**
 * KONIVRER AI Player
 * 
 * This class implements an AI opponent for single-player games.
 * It analyzes the game state and makes decisions based on predefined strategies.
 */

class AIPlayer {
  constructor(options = {}) {
    this.difficulty = options.difficulty || 'normal'; // 'easy', 'normal', 'hard'
    this.playerId = 1; // AI is always player 2 (index 1)
    this.gameEngine = null;
    this.decisionDelay = this.getDecisionDelay();
    this.gameState = null;
  }

  /**
   * Set the game engine reference
   * @param {Object} gameEngine Reference to the game engine
   */
  setGameEngine(gameEngine) {
    this.gameEngine = gameEngine;
    
    // Listen for game state changes
    this.gameEngine.on('gameStateUpdate', (gameState) => {
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
    const affordableFamiliars = familiars.filter(card => card.cost <= availableAzoth);
    
    if (affordableFamiliars.length === 0) return null;
    
    // Strategy: Play the strongest Familiar we can afford
    // Sort by power (higher is better)
    const sortedFamiliars = [...affordableFamiliars].sort((a, b) => b.power - a.power);
    
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
      const opponentCreatures = opponent.field.filter(card => card.type === 'Familiar');
      
      if (opponentCreatures.length > 0) {
        // Sort by power (higher is better)
        const sortedCreatures = [...opponentCreatures].sort((a, b) => b.power - a.power);
        
        return [{
          type: 'creature',
          playerId: 1 - this.playerId,
          cardId: sortedCreatures[0].id,
        }];
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
    const eligibleAttackers = player.field.filter(card => 
      card.type === 'Familiar' && !card.tapped && !card.summoningSickness
    );
    
    if (eligibleAttackers.length === 0) return [];
    
    // Strategy: Attack with creatures that can deal damage favorably
    // This is a simplified version - in a real implementation, you'd consider
    // the opponent's blockers, life total, and other factors
    
    // Get opponent's potential blockers
    const opponentBlockers = opponent.field.filter(card => 
      card.type === 'Familiar' && !card.tapped
    );
    
    // If opponent has no blockers, attack with everything
    if (opponentBlockers.length === 0) {
      return eligibleAttackers;
    }
    
    // Otherwise, only attack with creatures that can win combat
    return eligibleAttackers.filter(attacker => {
      // Check if there's a blocker that can kill this attacker without dying
      const badBlocker = opponentBlockers.find(blocker => 
        blocker.power >= attacker.toughness && blocker.toughness > attacker.power
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
    const eligibleBlockers = player.field.filter(card => 
      card.type === 'Familiar' && !card.tapped
    );
    
    if (eligibleBlockers.length === 0) return [];
    
    // Strategy: Block in a way that minimizes damage and preserves our creatures
    // This is a simplified version - in a real implementation, you'd use more
    // sophisticated algorithms
    
    const blocks = [];
    
    // Sort attackers by power (highest first)
    const sortedAttackers = [...attackers].sort((a, b) => b.power - a.power);
    
    // Sort blockers by power (lowest first)
    const sortedBlockers = [...eligibleBlockers].sort((a, b) => a.power - b.power);
    
    // Try to block each attacker
    sortedAttackers.forEach(attacker => {
      // Find a blocker that can survive or trade favorably
      const goodBlocker = sortedBlockers.find(blocker => 
        blocker.toughness > attacker.power || 
        (blocker.toughness >= attacker.power && blocker.power >= attacker.toughness)
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
   * Get the decision delay based on difficulty
   * @returns {number} Delay in milliseconds
   */
  getDecisionDelay() {
    switch (this.difficulty) {
      case 'easy':
        return 2000; // 2 seconds
      case 'normal':
        return 1500; // 1.5 seconds
      case 'hard':
        return 1000; // 1 second
      default:
        return 1500;
    }
  }

  /**
   * Set the AI difficulty
   * @param {string} difficulty Difficulty level ('easy', 'normal', 'hard')
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.decisionDelay = this.getDecisionDelay();
  }
}

export default AIPlayer;