/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Card-Specific Rules
 *
 * This module defines the rules and behaviors for specific cards in the game.
 * Each card can have unique effects, abilities, and interactions.
 */

import { GameState } from '../types/GameState';
import { Card } from '../types/Card';
import { Player } from '../types/Player';
import { EffectTrigger } from '../types/Effects';
import { CardType, Element, Rarity } from '../types/Enums';

// Card ability types
export enum AbilityType {
  STATIC = 'static',
  TRIGGERED = 'triggered',
  ACTIVATED = 'activated',
  CONTINUOUS = 'continuous',
  ENTER_PLAY = 'enterPlay',
  LEAVE_PLAY = 'leavePlay',
  AZOTH_EFFECT = 'azothEffect'
}

// Card effect types
export enum EffectType {
  BUFF = 'buff',
  DEBUFF = 'debuff',
  DAMAGE = 'damage',
  HEAL = 'heal',
  DRAW = 'draw',
  DISCARD = 'discard',
  SEARCH = 'search',
  SUMMON = 'summon',
  DESTROY = 'destroy',
  TRANSFORM = 'transform',
  COPY = 'copy',
  MOVE = 'move',
  PROTECT = 'protect',
  COUNTER = 'counter',
  NEGATE = 'negate',
  REDIRECT = 'redirect',
  GAIN_AZOTH = 'gainAzoth',
  LOSE_AZOTH = 'loseAzoth',
  GAIN_ENERGY = 'gainEnergy',
  LOSE_ENERGY = 'loseEnergy'
}

// Card target types
export enum TargetType {
  SELF = 'self',
  PLAYER = 'player',
  OPPONENT = 'opponent',
  ANY_PLAYER = 'anyPlayer',
  FRIENDLY_CARD = 'friendlyCard',
  ENEMY_CARD = 'enemyCard',
  ANY_CARD = 'anyCard',
  FRIENDLY_AZOTH = 'friendlyAzoth',
  ENEMY_AZOTH = 'enemyAzoth',
  ANY_AZOTH = 'anyAzoth',
  FRIENDLY_HAND = 'friendlyHand',
  ENEMY_HAND = 'enemyHand',
  FRIENDLY_DECK = 'friendlyDeck',
  ENEMY_DECK = 'enemyDeck',
  FRIENDLY_DISCARD = 'friendlyDiscard',
  ENEMY_DISCARD = 'enemyDiscard'
}

// Card condition types
export enum ConditionType {
  ELEMENT_MATCH = 'elementMatch',
  TYPE_MATCH = 'typeMatch',
  POWER_THRESHOLD = 'powerThreshold',
  HEALTH_THRESHOLD = 'healthThreshold',
  AZOTH_COUNT = 'azothCount',
  CARD_COUNT = 'cardCount',
  TURN_COUNT = 'turnCount',
  CARD_PLAYED = 'cardPlayed',
  CARD_DESTROYED = 'cardDestroyed',
  PLAYER_HEALTH = 'playerHealth',
  SPECIFIC_CARD = 'specificCard'
}

// Card rule interface
export interface CardRule {
  name: string;
  description: string;
  staticEffect?: (gameState: GameState, card: Card, player: Player) => void;
  triggeredEffect?: {
    trigger: EffectTrigger;
    effect: (gameState: GameState, card: Card, player: Player, triggerData?: any) => void;
    condition?: (gameState: GameState, card: Card, player: Player, triggerData?: any) => boolean;
  };
  activatedEffect?: {
    cost: any;
    effect: (gameState: GameState, card: Card, player: Player, targets?: any[]) => void;
    targeting?: {
      type: TargetType | TargetType[];
      count: number;
      filter?: (gameState: GameState, card: Card, player: Player, target: any) => boolean;
    };
    usageLimit?: number;
  };
  enterPlayEffect?: (gameState: GameState, card: Card, player: Player) => void;
  leavePlayEffect?: (gameState: GameState, card: Card, player: Player) => void;
  azothEffect?: (gameState: GameState, card: Card, player: Player) => void;
  continuousEffect?: (gameState: GameState, card: Card, player: Player) => void;
  specialRules?: Record<string, any>;
}

// Card rules registry
const cardRules = new Map<string, CardRule>();

/**
 * Get rules for a specific card
 * @param cardId - Card ID
 * @returns Card rules or null if not found
 */
export function getCardRules(cardId: string): CardRule | null {
  return cardRules.get(cardId) || null;
}

/**
 * Register rules for a specific card
 * @param cardId - Card ID
 * @param rules - Card rules
 */
function registerCardRules(cardId: string, rules: CardRule): void {
  cardRules.set(cardId, rules);
}

// ============================================================================
// CARD-SPECIFIC RULES
// ============================================================================

// Fire Elemental
registerCardRules('fire-elemental', {
  name: 'Fire Elemental',
  description: 'A powerful elemental creature of pure flame.',

  // Static effect
  staticEffect: (gameState: GameState, card: Card, player: Player) => {
    // Fire Elemental gets +1/+0 for each Azoth in your Azoth row
    const azothCount = player.azothRow.length;
    card.power = card.basePower + azothCount;
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_ATTACK,
    effect: (gameState: GameState, card: Card, player: Player) => {
      // Deal 1 damage to all enemy creatures when this attacks
      const opponent = gameState.players.find(p => p.id !== player.id);
      if (opponent) {
        opponent.field.forEach(enemyCard => {
          enemyCard.health -= 1;
          // Check if card is destroyed
          if (enemyCard.health <= 0) {
            gameState.triggerCardDestroyed(enemyCard, opponent);
          }
        });
      }
    }
  }
});

// Water Guardian
registerCardRules('water-guardian', {
  name: 'Water Guardian',
  description: 'A protective water spirit that shields allies.',

  // Static effect
  staticEffect: (gameState: GameState, card: Card, player: Player) => {
    // Water Guardian has +0/+1 for each other Water card on your field
    const waterCardCount = player.field.filter(c => 
      c.id !== card.id && c.element === Element.WATER
    ).length;
    card.health = card.baseHealth + waterCardCount;
  },

  // Continuous effect
  continuousEffect: (gameState: GameState, card: Card, player: Player) => {
    // All friendly Water creatures gain +0/+1
    player.field.forEach(fieldCard => {
      if (fieldCard.element === Element.WATER) {
        fieldCard.health += 1;
      }
    });
  },

  // Enter play effect
  enterPlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // Heal all friendly creatures for 1 when this enters play
    player.field.forEach(fieldCard => {
      fieldCard.health = Math.min(fieldCard.health + 1, fieldCard.baseHealth + fieldCard.healthModifier);
    });
  }
});

// Earth Colossus
registerCardRules('earth-colossus', {
  name: 'Earth Colossus',
  description: 'A massive elemental that grows stronger over time.',

  // Static effect
  staticEffect: (gameState: GameState, card: Card, player: Player) => {
    // Earth Colossus gains +1/+1 for each turn it has been on the field
    const turnsOnField = card.metadata?.turnsOnField || 0;
    card.power = card.basePower + turnsOnField;
    card.health = card.baseHealth + turnsOnField;
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_TURN_END,
    effect: (gameState: GameState, card: Card, player: Player) => {
      // Increment turns on field counter
      if (!card.metadata) card.metadata = {};
      card.metadata.turnsOnField = (card.metadata.turnsOnField || 0) + 1;
    }
  },

  // Activated effect
  activatedEffect: {
    cost: { azoth: 2 },
    effect: (gameState: GameState, card: Card, player: Player, targets: Card[]) => {
      // Destroy target creature with power less than Earth Colossus
      if (targets && targets.length > 0) {
        const target = targets[0];
        if (target.power < card.power) {
          const targetPlayer = gameState.players.find(p => 
            p.field.some(c => c.id === target.id)
          );
          if (targetPlayer) {
            targetPlayer.field = targetPlayer.field.filter(c => c.id !== target.id);
            targetPlayer.discard.push(target);
            gameState.triggerCardDestroyed(target, targetPlayer);
          }
        }
      }
    },
    targeting: {
      type: TargetType.ANY_CARD,
      count: 1,
      filter: (gameState: GameState, card: Card, player: Player, target: Card) => {
        return target.power < card.power;
      }
    },
    usageLimit: 1
  }
});

// Air Elemental
registerCardRules('air-elemental', {
  name: 'Air Elemental',
  description: 'A swift elemental that can attack immediately.',

  // Special rules
  specialRules: {
    haste: true, // Can attack the turn it's played
    evasion: 0.3 // 30% chance to evade attacks
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_DAMAGE_TAKEN,
    effect: (gameState: GameState, card: Card, player: Player, triggerData: any) => {
      // Check for evasion
      const evasionChance = card.specialRules?.evasion || 0;
      if (Math.random() < evasionChance) {
        // Cancel the damage
        triggerData.cancelled = true;
      }
    }
  },

  // Activated effect
  activatedEffect: {
    cost: { energy: 1 },
    effect: (gameState: GameState, card: Card, player: Player) => {
      // Return Air Elemental to hand and draw a card
      player.field = player.field.filter(c => c.id !== card.id);
      player.hand.push(card);
      player.drawCard();
    },
    usageLimit: 1
  }
});

// Void Manipulator
registerCardRules('void-manipulator', {
  name: 'Void Manipulator',
  description: 'A mysterious entity that manipulates the fabric of reality.',

  // Enter play effect
  enterPlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // Look at the top 3 cards of your deck and rearrange them
    const topCards = player.deck.slice(0, 3);
    // The actual rearrangement would be handled by the UI
    // This is just a placeholder for the effect
    gameState.pendingEffect = {
      type: 'rearrangeDeck',
      player: player.id,
      cards: topCards
    };
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_CARD_DRAWN,
    effect: (gameState: GameState, card: Card, player: Player, triggerData: any) => {
      // When you draw a card, gain 1 energy if it's a Void card
      if (triggerData.card.element === Element.VOID) {
        player.energy += 1;
      }
    },
    condition: (gameState: GameState, card: Card, player: Player, triggerData: any) => {
      // Only trigger if the drawn card is a Void card
      return triggerData.card.element === Element.VOID;
    }
  },

  // Azoth effect
  azothEffect: (gameState: GameState, card: Card, player: Player) => {
    // When used as Azoth, all your Void cards cost 1 less energy
    player.hand.forEach(handCard => {
      if (handCard.element === Element.VOID) {
        handCard.energyCost = Math.max(0, handCard.energyCost - 1);
      }
    });
  }
});

// Nature's Blessing
registerCardRules('natures-blessing', {
  name: "Nature's Blessing",
  description: 'A spell that nurtures and strengthens natural forces.',

  // Enter play effect (for spells, this is when the spell is cast)
  enterPlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // All friendly Nature creatures gain +2/+2 until end of turn
    player.field.forEach(fieldCard => {
      if (fieldCard.element === Element.NATURE) {
        fieldCard.power += 2;
        fieldCard.health += 2;
        
        // Add temporary effect that will be removed at end of turn
        if (!fieldCard.temporaryEffects) fieldCard.temporaryEffects = [];
        fieldCard.temporaryEffects.push({
          type: 'statBoost',
          power: 2,
          health: 2,
          duration: 1, // 1 turn
          source: card.id
        });
      }
    });
    
    // Draw a card if you control at least 2 Nature creatures
    const natureCreatureCount = player.field.filter(c => 
      c.element === Element.NATURE && c.type === CardType.CREATURE
    ).length;
    
    if (natureCreatureCount >= 2) {
      player.drawCard();
    }
  }
});

// Mystic Scholar
registerCardRules('mystic-scholar', {
  name: 'Mystic Scholar',
  description: 'A learned sage who studies the arcane arts.',

  // Enter play effect
  enterPlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // When this enters play, draw a card
    player.drawCard();
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_SPELL_CAST,
    effect: (gameState: GameState, card: Card, player: Player) => {
      // When you cast a spell, gain 1 energy
      player.energy += 1;
    }
  },

  // Static effect
  staticEffect: (gameState: GameState, card: Card, player: Player) => {
    // Mystic Scholar has +1/+0 for each spell in your hand
    const spellCount = player.hand.filter(c => c.type === CardType.SPELL).length;
    card.power = card.basePower + spellCount;
  }
});

// Inferno Dragon
registerCardRules('inferno-dragon', {
  name: 'Inferno Dragon',
  description: 'A mighty dragon that breathes devastating flames.',

  // Activated effect
  activatedEffect: {
    cost: { energy: 2 },
    effect: (gameState: GameState, card: Card, player: Player, targets: any[]) => {
      // Deal 3 damage to target creature or player
      if (targets && targets.length > 0) {
        const target = targets[0];
        
        if (typeof target === 'object' && 'health' in target) {
          // Target is a card
          target.health -= 3;
          
          // Check if card is destroyed
          if (target.health <= 0) {
            const targetPlayer = gameState.players.find(p => 
              p.field.some(c => c.id === target.id)
            );
            if (targetPlayer) {
              gameState.triggerCardDestroyed(target, targetPlayer);
            }
          }
        } else if (typeof target === 'object' && 'id' in target) {
          // Target is a player
          target.health -= 3;
          
          // Check if player is defeated
          if (target.health <= 0) {
            gameState.triggerPlayerDefeated(target);
          }
        }
      }
    },
    targeting: {
      type: [TargetType.ANY_CARD, TargetType.ANY_PLAYER],
      count: 1
    },
    usageLimit: 1
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_DAMAGE_DEALT,
    effect: (gameState: GameState, card: Card, player: Player, triggerData: any) => {
      // When this deals damage to a creature, deal 1 additional damage to that creature's controller
      if (triggerData.target && 'health' in triggerData.target) {
        const targetPlayer = gameState.players.find(p => 
          p.field.some(c => c.id === triggerData.target.id)
        );
        if (targetPlayer) {
          targetPlayer.health -= 1;
          
          // Check if player is defeated
          if (targetPlayer.health <= 0) {
            gameState.triggerPlayerDefeated(targetPlayer);
          }
        }
      }
    }
  }
});

// Time Weaver
registerCardRules('time-weaver', {
  name: 'Time Weaver',
  description: 'A mysterious entity that can manipulate the flow of time.',

  // Enter play effect
  enterPlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // When this enters play, you may take an extra action this turn
    player.extraActions = (player.extraActions || 0) + 1;
  },

  // Activated effect
  activatedEffect: {
    cost: { azoth: 1, energy: 2 },
    effect: (gameState: GameState, card: Card, player: Player, targets: Card[]) => {
      // Return target card to its owner's hand
      if (targets && targets.length > 0) {
        const target = targets[0];
        const targetPlayer = gameState.players.find(p => 
          p.field.some(c => c.id === target.id)
        );
        
        if (targetPlayer) {
          targetPlayer.field = targetPlayer.field.filter(c => c.id !== target.id);
          targetPlayer.hand.push(target);
        }
      }
    },
    targeting: {
      type: TargetType.ANY_CARD,
      count: 1
    }
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_TURN_START,
    effect: (gameState: GameState, card: Card, player: Player) => {
      // At the start of your turn, look at the top card of your deck
      const topCard = player.deck[0];
      if (topCard) {
        gameState.pendingEffect = {
          type: 'viewCard',
          player: player.id,
          card: topCard
        };
      }
    }
  }
});

// Soul Harvester
registerCardRules('soul-harvester', {
  name: 'Soul Harvester',
  description: 'A dark entity that grows stronger by consuming the souls of the fallen.',

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_CARD_DESTROYED,
    effect: (gameState: GameState, card: Card, player: Player, triggerData: any) => {
      // When a creature dies, Soul Harvester gains +1/+1
      card.power += 1;
      card.health += 1;
      
      // Add counter to track souls harvested
      if (!card.metadata) card.metadata = {};
      card.metadata.soulsHarvested = (card.metadata.soulsHarvested || 0) + 1;
    }
  },

  // Activated effect
  activatedEffect: {
    cost: { special: 'sacrifice' }, // Special cost: sacrifice another creature
    effect: (gameState: GameState, card: Card, player: Player, targets: Card[]) => {
      // Sacrifice a creature: Draw cards equal to its power
      if (targets && targets.length > 0) {
        const target = targets[0];
        const cardsToDraw = target.power;
        
        // Remove the sacrificed creature
        player.field = player.field.filter(c => c.id !== target.id);
        player.discard.push(target);
        
        // Draw cards
        for (let i = 0; i < cardsToDraw; i++) {
          player.drawCard();
        }
      }
    },
    targeting: {
      type: TargetType.FRIENDLY_CARD,
      count: 1,
      filter: (gameState: GameState, card: Card, player: Player, target: Card) => {
        return target.id !== card.id && target.type === CardType.CREATURE;
      }
    }
  },

  // Special rules
  specialRules: {
    deathtouch: true // Destroys any creature it damages
  }
});

// Crystal Guardian
registerCardRules('crystal-guardian', {
  name: 'Crystal Guardian',
  description: 'A powerful construct made of enchanted crystals.',

  // Static effect
  staticEffect: (gameState: GameState, card: Card, player: Player) => {
    // Crystal Guardian has +0/+1 for each Azoth you control
    const azothCount = player.azothRow.length;
    card.health = card.baseHealth + azothCount;
  },

  // Triggered effect
  triggeredEffect: {
    trigger: EffectTrigger.ON_DAMAGE_TAKEN,
    effect: (gameState: GameState, card: Card, player: Player, triggerData: any) => {
      // When Crystal Guardian takes damage, it deals 1 damage to the source
      if (triggerData.source && 'health' in triggerData.source) {
        triggerData.source.health -= 1;
        
        // Check if source is destroyed
        if (triggerData.source.health <= 0) {
          const sourcePlayer = gameState.players.find(p => 
            p.field.some(c => c.id === triggerData.source.id)
          );
          if (sourcePlayer) {
            gameState.triggerCardDestroyed(triggerData.source, sourcePlayer);
          }
        }
      }
    }
  },

  // Special rules
  specialRules: {
    ward: true // Prevents the first instance of damage each turn
  }
});

// Dimensional Rift
registerCardRules('dimensional-rift', {
  name: 'Dimensional Rift',
  description: 'A spell that tears open the fabric of reality.',

  // Enter play effect
  enterPlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // Each player sacrifices a creature
    gameState.players.forEach(p => {
      if (p.field.length > 0) {
        // In a real implementation, this would prompt the player to choose
        // For now, we'll just sacrifice the first creature
        const sacrificed = p.field[0];
        p.field = p.field.filter(c => c.id !== sacrificed.id);
        p.discard.push(sacrificed);
        gameState.triggerCardDestroyed(sacrificed, p);
      }
    });
    
    // Draw a card for each creature sacrificed this way
    player.drawCard();
  }
});

// Celestial Arbiter
registerCardRules('celestial-arbiter', {
  name: 'Celestial Arbiter',
  description: 'A divine entity that judges all with perfect fairness.',

  // Enter play effect
  enterPlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // When this enters play, each player discards their hand and draws 3 cards
    gameState.players.forEach(p => {
      // Move hand to discard
      p.discard = [...p.discard, ...p.hand];
      p.hand = [];
      
      // Draw 3 cards
      for (let i = 0; i < 3; i++) {
        p.drawCard();
      }
    });
  },

  // Continuous effect
  continuousEffect: (gameState: GameState, card: Card, player: Player) => {
    // Players can't draw more than one card per turn
    gameState.players.forEach(p => {
      p.maxDrawsPerTurn = 1;
    });
  },

  // Leave play effect
  leavePlayEffect: (gameState: GameState, card: Card, player: Player) => {
    // When this leaves play, remove the card draw restriction
    gameState.players.forEach(p => {
      delete p.maxDrawsPerTurn;
    });
  }
});

// Export all card rules
export default cardRules;