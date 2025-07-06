/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Keyword Rules
 *
 * This module defines the rules and behaviors for keywords in the game.
 * Each keyword has specific effects and interactions.
 */

import { Card } from '../types/Card';
import { GameState } from '../types/GameState';
import { Player } from '../types/Player';
import { Effect } from '../types/Effect';

// Keyword interface
export interface KeywordRule {
  keyword: string;
  description: string;
  staticEffect: ((card: Card, gameState: GameState) => void) | null;
  canBeBlockedBy?: (attacker: Card, blocker: Card) => boolean;
  onAttack?: (card: Card, gameState: GameState, target: Card | Player) => void;
  onBlock?: (card: Card, gameState: GameState, attacker: Card) => void;
  onDamageDealt?: (card: Card, gameState: GameState, target: Card | Player, amount: number) => void;
  onDamageTaken?: (card: Card, gameState: GameState, source: Card | Player, amount: number) => void;
  onEnterField?: (card: Card, gameState: GameState) => void;
  onLeaveField?: (card: Card, gameState: GameState) => void;
  onTurnStart?: (card: Card, gameState: GameState) => void;
  onTurnEnd?: (card: Card, gameState: GameState) => void;
  getModifiedStats?: (card: Card, gameState: GameState) => { power?: number; toughness?: number };
  getAdditionalEffects?: (card: Card, gameState: GameState) => Effect[];
  getTooltip?: (card: Card) => string;
}

/**
 * Get all keyword rules
 * @returns Array of keyword rule objects
 */
export function getKeywordRules(): KeywordRule[] {
  return [
    // Flying
    {
      keyword: 'Flying',
      description:
        'This Familiar can only be blocked by Familiars with Flying or Reach.',

      // Static effect - implemented in combat rules
      staticEffect: null,

      // Check if a Familiar with Flying can be blocked by another Familiar
      canBeBlockedBy: (attacker: Card, blocker: Card): boolean => {
        return (
          blocker.keywords &&
          (blocker.keywords.includes('Flying') ||
            blocker.keywords.includes('Reach'))
        );
      }
    },

    // First Strike
    {
      keyword: 'First Strike',
      description:
        'This Familiar deals combat damage before Familiars without First Strike.',

      // Static effect - implemented in combat damage rules
      staticEffect: null,

      // No special implementation needed here as it's handled in the combat system
    },

    // Double Strike
    {
      keyword: 'Double Strike',
      description:
        'This Familiar deals both First Strike and normal combat damage.',

      // Static effect - implemented in combat damage rules
      staticEffect: null,

      // No special implementation needed here as it's handled in the combat system
    },

    // Reach
    {
      keyword: 'Reach',
      description: 'This Familiar can block Familiars with Flying.',

      // Static effect - no direct effect, just enables blocking flyers
      staticEffect: null,

      // No special implementation needed here as it's handled in the Flying keyword
    },

    // Vigilance
    {
      keyword: 'Vigilance',
      description: "This Familiar doesn't tap when attacking.",

      // Static effect - implemented in attack rules
      staticEffect: null,

      // Override the normal attack behavior
      onAttack: (card: Card, gameState: GameState, target: Card | Player): void => {
        // Don't tap the card when attacking
        // The default behavior is to tap, but we override it here
      }
    },

    // Trample
    {
      keyword: 'Trample',
      description:
        'This Familiar can deal excess combat damage to the opponent when blocked.',

      // Static effect - implemented in combat damage rules
      staticEffect: null,

      // Special damage handling
      onDamageDealt: (card: Card, gameState: GameState, target: Card | Player, amount: number): void => {
        // If the target is a card (blocker) and the damage exceeds its toughness
        if ('toughness' in target && amount > target.toughness) {
          const excessDamage = amount - target.toughness;
          const defendingPlayer = gameState.players.find(
            (p) => p.field.some((c) => c.id === target.id)
          );
          
          if (defendingPlayer) {
            // Deal excess damage to the player
            defendingPlayer.health -= excessDamage;
          }
        }
      }
    },

    // Haste
    {
      keyword: 'Haste',
      description:
        'This Familiar can attack and use abilities with the tap symbol the turn it enters the field.',

      // Static effect - implemented in summoning sickness rules
      staticEffect: (card: Card): void => {
        card.hasSummoningSickness = false;
      }
    },

    // Lifelink
    {
      keyword: 'Lifelink',
      description:
        'Damage dealt by this Familiar also causes you to gain that much health.',

      // Static effect - no direct effect
      staticEffect: null,

      // When damage is dealt, gain life
      onDamageDealt: (card: Card, gameState: GameState, target: Card | Player, amount: number): void => {
        const controller = gameState.players.find(
          (p) => p.field.some((c) => c.id === card.id)
        );
        
        if (controller) {
          controller.health += amount;
        }
      }
    },

    // Deathtouch
    {
      keyword: 'Deathtouch',
      description:
        'Any amount of damage this Familiar deals to a creature is enough to destroy it.',

      // Static effect - no direct effect
      staticEffect: null,

      // When damage is dealt to a creature, destroy it
      onDamageDealt: (card: Card, gameState: GameState, target: Card | Player, amount: number): void => {
        // If the target is a card and any damage was dealt
        if ('toughness' in target && amount > 0) {
          // Mark the card for destruction
          target.markedForDestruction = true;
        }
      }
    },

    // Defender
    {
      keyword: 'Defender',
      description: "This Familiar can't attack.",

      // Static effect - implemented in attack rules
      staticEffect: (card: Card): void => {
        card.canAttack = false;
      }
    },

    // Hexproof
    {
      keyword: 'Hexproof',
      description:
        "This Familiar can't be the target of spells or abilities your opponent controls.",

      // Static effect - implemented in targeting rules
      staticEffect: null,

      // This is typically checked in the targeting system
      // No direct implementation here
    },

    // Indestructible
    {
      keyword: 'Indestructible',
      description:
        "This Familiar can't be destroyed by damage or effects that say 'destroy'.",

      // Static effect - implemented in destruction rules
      staticEffect: (card: Card): void => {
        card.isIndestructible = true;
      }
    },

    // Menace
    {
      keyword: 'Menace',
      description: "This Familiar can't be blocked except by two or more creatures.",

      // Static effect - no direct effect
      staticEffect: null,

      // This is checked in the blocking rules
      canBeBlockedBy: (attacker: Card, blocker: Card): boolean => {
        // This is a placeholder - the actual implementation would check if there are multiple blockers
        // In the real game, this would be handled by the combat system
        return false; // Simplified for this example
      }
    },

    // Shroud
    {
      keyword: 'Shroud',
      description:
        "This Familiar can't be the target of spells or abilities (including your own).",

      // Static effect - implemented in targeting rules
      staticEffect: (card: Card): void => {
        card.hasTargetImmunity = true;
      }
    },

    // Unblockable
    {
      keyword: 'Unblockable',
      description: "This Familiar can't be blocked.",

      // Static effect - no direct effect
      staticEffect: null,

      // Check if the Familiar can be blocked
      canBeBlockedBy: (attacker: Card, blocker: Card): boolean => {
        return false; // Cannot be blocked by anything
      }
    },

    // Regenerate
    {
      keyword: 'Regenerate',
      description:
        'When this Familiar would be destroyed, you may pay 2 Azoth to prevent it.',

      // Static effect - no direct effect
      staticEffect: null,

      // This would be implemented in the destruction handling system
      onDamageTaken: (card: Card, gameState: GameState, source: Card | Player, amount: number): void => {
        // If the damage would destroy the Familiar
        if (card.health - amount <= 0) {
          const controller = gameState.players.find(
            (p) => p.field.some((c) => c.id === card.id)
          );
          
          if (controller && controller.azoth >= 2) {
            // Offer the player a chance to regenerate
            // This would typically be handled by the game UI
            // For this example, we'll just assume they always choose to regenerate if possible
            controller.azoth -= 2;
            card.health = 1; // Set health to 1 instead of dying
          }
        }
      }
    },

    // Provoke
    {
      keyword: 'Provoke',
      description:
        'When this Familiar attacks, you may have target Familiar controlled by the defending player block it if able.',

      // Static effect - no direct effect
      staticEffect: null,

      // When attacking, force a blocker
      onAttack: (card: Card, gameState: GameState, target: Card | Player): void => {
        // This would be implemented in the combat system
        // For this example, we'll just note that it would force a block
      }
    },

    // Flanking
    {
      keyword: 'Flanking',
      description:
        'Whenever a Familiar without flanking blocks this Familiar, the blocking Familiar gets -1/-1 until end of turn.',

      // Static effect - no direct effect
      staticEffect: null,

      // When blocked, apply the effect
      onBlock: (card: Card, gameState: GameState, attacker: Card): void => {
        // If the blocker doesn't have flanking
        if (!card.keywords?.includes('Flanking')) {
          // Apply -1/-1 until end of turn
          card.temporaryEffects = card.temporaryEffects || [];
          card.temporaryEffects.push({
            type: 'statModifier',
            powerModifier: -1,
            toughnessModifier: -1,
            duration: 'endOfTurn'
          });
        }
      }
    },

    // Banding
    {
      keyword: 'Banding',
      description:
        'Any Familiars with banding, and up to one without, can attack as a band. You assign combat damage for Familiars blocking or blocked by a band.',

      // Static effect - no direct effect
      staticEffect: null,

      // This would be implemented in the combat system
      // It's a complex keyword that affects how damage is assigned
    },

    // Shadow
    {
      keyword: 'Shadow',
      description:
        'This Familiar can block or be blocked only by Familiars with shadow.',

      // Static effect - no direct effect
      staticEffect: null,

      // Check if the Familiar can be blocked
      canBeBlockedBy: (attacker: Card, blocker: Card): boolean => {
        return blocker.keywords?.includes('Shadow') || false;
      }
    },

    // Phasing
    {
      keyword: 'Phasing',
      description:
        'This Familiar phases in or out at the beginning of each of your turns. While phased out, it\'s treated as if it doesn\'t exist.',

      // Static effect - no direct effect
      staticEffect: null,

      // Handle phasing at the start of turn
      onTurnStart: (card: Card, gameState: GameState): void => {
        card.isPhasedOut = !card.isPhasedOut;
      }
    },

    // Rampage
    {
      keyword: 'Rampage',
      description:
        'Whenever this Familiar becomes blocked, it gets +1/+1 until end of turn for each Familiar blocking it beyond the first.',

      // Static effect - no direct effect
      staticEffect: null,

      // When blocked, apply the effect
      onBlock: (card: Card, gameState: GameState, attacker: Card): void => {
        // Count the number of blockers
        const blockers = gameState.combat?.blockers[attacker.id] || [];
        const extraBlockers = blockers.length - 1;
        
        if (extraBlockers > 0) {
          // Apply +1/+1 for each extra blocker
          attacker.temporaryEffects = attacker.temporaryEffects || [];
          attacker.temporaryEffects.push({
            type: 'statModifier',
            powerModifier: extraBlockers,
            toughnessModifier: extraBlockers,
            duration: 'endOfTurn'
          });
        }
      }
    },

    // Cumulative Upkeep
    {
      keyword: 'Cumulative Upkeep',
      description:
        'At the beginning of your upkeep, put an age counter on this Familiar, then sacrifice it unless you pay its upkeep cost for each age counter on it.',

      // Static effect - no direct effect
      staticEffect: null,

      // Handle upkeep at the start of turn
      onTurnStart: (card: Card, gameState: GameState): void => {
        const controller = gameState.players.find(
          (p) => p.field.some((c) => c.id === card.id)
        );
        
        if (controller && gameState.activePlayer === controller.id) {
          // Add an age counter
          card.counters = card.counters || {};
          card.counters.age = (card.counters.age || 0) + 1;
          
          // Calculate upkeep cost
          const upkeepCost = (card.upkeepCost || 1) * card.counters.age;
          
          // Check if the player can pay
          if (controller.azoth >= upkeepCost) {
            // Offer the player a chance to pay
            // This would typically be handled by the game UI
            // For this example, we'll just assume they always choose to pay if possible
            controller.azoth -= upkeepCost;
          } else {
            // Sacrifice the Familiar
            card.markedForDestruction = true;
          }
        }
      }
    }
  ];
}

// Export a map of keyword rules for easier lookup
export const keywordRuleMap: Record<string, KeywordRule> = getKeywordRules().reduce(
  (map, rule) => {
    map[rule.keyword] = rule;
    return map;
  },
  {} as Record<string, KeywordRule>
);

/**
 * Check if a card has a specific keyword
 * @param card - Card to check
 * @param keyword - Keyword to check for
 * @returns Whether the card has the keyword
 */
export function hasKeyword(card: Card, keyword: string): boolean {
  return card.keywords?.includes(keyword) || false;
}

/**
 * Apply all keyword static effects to a card
 * @param card - Card to apply effects to
 * @param gameState - Current game state
 */
export function applyKeywordStaticEffects(card: Card, gameState: GameState): void {
  if (!card.keywords) return;
  
  for (const keyword of card.keywords) {
    const rule = keywordRuleMap[keyword];
    if (rule && rule.staticEffect) {
      rule.staticEffect(card, gameState);
    }
  }
}

/**
 * Get modified stats from keywords
 * @param card - Card to get stats for
 * @param gameState - Current game state
 * @returns Modified power and toughness
 */
export function getKeywordModifiedStats(
  card: Card,
  gameState: GameState
): { power: number; toughness: number } {
  let power = card.power || 0;
  let toughness = card.toughness || 0;
  
  if (!card.keywords) {
    return { power, toughness };
  }
  
  for (const keyword of card.keywords) {
    const rule = keywordRuleMap[keyword];
    if (rule && rule.getModifiedStats) {
      const mods = rule.getModifiedStats(card, gameState);
      if (mods.power !== undefined) power += mods.power;
      if (mods.toughness !== undefined) toughness += mods.toughness;
    }
  }
  
  return { power, toughness };
}

/**
 * Check if a card can be blocked by another card, considering keywords
 * @param attacker - Attacking card
 * @param blocker - Blocking card
 * @returns Whether the blocker can block the attacker
 */
export function canBeBlockedByWithKeywords(attacker: Card, blocker: Card): boolean {
  if (!attacker.keywords) return true;
  
  for (const keyword of attacker.keywords) {
    const rule = keywordRuleMap[keyword];
    if (rule && rule.canBeBlockedBy) {
      if (!rule.canBeBlockedBy(attacker, blocker)) {
        return false;
      }
    }
  }
  
  return true;
}

export default {
  getKeywordRules,
  keywordRuleMap,
  hasKeyword,
  applyKeywordStaticEffects,
  getKeywordModifiedStats,
  canBeBlockedByWithKeywords
};