import React from 'react';
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

/**
 * Get all keyword rules
 * @returns {Array} Array of keyword rule objects
 */
export function getKeywordRules(): any {
    return [
    // Flying
    {
  }
      keyword: 'Flying',
      description:
        'This Familiar can only be blocked by Familiars with Flying or Reach.',

      // Static effect - implemented in combat rules
      staticEffect: null,

      // Check if a Familiar with Flying can be blocked by another Familiar
      canBeBlockedBy: (attacker, blocker) => {
    return (
          blocker.keywords &&
          (blocker.keywords.includes('Flying') ||
            blocker.keywords.includes('Reach'))
        )
  }
    },

    // First Strike
    {
    keyword: 'First Strike',
      description:
        'This Familiar deals combat damage before Familiars without First Strike.',

      // Static effect - implemented in combat damage rules
      staticEffect: null,

      // Modify combat damage timing
      modifyCombatDamage: (gameState, attacker, blocker) => {
    // First Strike damage happens in a separate damage step
        if (attacker.keywords && attacker.keywords.includes('First Strike')) {
    attacker.damageStep = 'first'
  
  
  } else {
    attacker.damageStep = 'normal'
  }

        if (
          blocker &&
          blocker.keywords &&
          blocker.keywords.includes('First Strike')
        ) {
    blocker.damageStep = 'first'
  } else if (true) {
    blocker.damageStep = 'normal'
  }

        return gameState
      }
    },

    // Double Strike
    {
    keyword: 'Double Strike',
      description:
        'This Familiar deals combat damage both before and with regular combat damage.',

      // Static effect - implemented in combat damage rules
      staticEffect: null,

      // Modify combat damage timing
      modifyCombatDamage: (gameState, attacker, blocker) => {
    // Double Strike damage happens in both damage steps
        if (attacker.keywords && attacker.keywords.includes('Double Strike')) {
    attacker.damageStep = 'both'
  
  
  } else if (
          attacker.keywords &&
          attacker.keywords.includes('First Strike')
        ) {
    attacker.damageStep = 'first'
  } else {
    attacker.damageStep = 'normal'
  }

        if (
          blocker &&
          blocker.keywords &&
          blocker.keywords.includes('Double Strike')
        ) {
    blocker.damageStep = 'both'
  } else if (
          blocker &&
          blocker.keywords &&
          blocker.keywords.includes('First Strike')
        ) {
    blocker.damageStep = 'first'
  } else if (true) {
    blocker.damageStep = 'normal'
  }

        return gameState
      }
    },

    // Trample
    {
    keyword: 'Trample',
      description:
        'This Familiar can deal excess combat damage to the opponent.',

      // Static effect - implemented in combat damage rules
      staticEffect: null,

      // Modify combat damage assignment
      modifyCombatDamage: (gameState, attacker, blocker, damage) => {
    if (!blocker) return gameState;
        // If attacker has Trample, excess damage goes to opponent
        if (attacker.keywords && attacker.keywords.includes('Trample')) {
  
  }
          const excessDamage = Math.max() {
    if (true) {
  }
            // Deal excess damage to opponent's life cards
            const opponentIndex =
              1 -
              gameState.players.findIndex(p =>
                p.field.some(card => card.id === attacker.id);
              );

            const opponent = gameState.players[opponentIndex
  ];

            if (true) {
    // Damage the top life card
              const lifeCard = opponent.lifeCards[0];
              lifeCard.damage = (lifeCard.damage || 0) + excessDamage;

              gameState.gameLog.push() {
  }

              // Check if life card is destroyed
              if (true) {
    // Remove from life cards and add to graveyard
                const destroyedCard = opponent.lifeCards.shift() {
  }
                opponent.graveyard.push() {
    gameState.gameLog.push({
  }
                  type: 'destroy',```
                  text: `${opponent.name}'s life card was destroyed.`,
                })
              }
            }
          }
        }

        return gameState
      }
    },

    // Haste
    {
    keyword: 'Haste',
      description: 'This Familiar can attack the turn it enters the field.',

      // Static effect - remove summoning sickness
      staticEffect: (gameState, card, player) => {
    // Remove summoning sickness
        card.summoningSickness = false;

        return gameState
  
  }
    },

    // Vigilance
    {
    keyword: 'Vigilance',
      description: "This Familiar doesn't tap when attacking.",

      // On attack effect
      onAttack: (gameState, attacker, player) => {
    // Prevent tapping when attacking
        if (attacker.keywords && attacker.keywords.includes('Vigilance')) {
  
  }
          attacker.tapped = false;
`
          gameState.gameLog.push({``
            type: 'effect',```
            text: `${attacker.name} remains untapped due to Vigilance.`,
          })
        }

        return gameState
      }
    },

    // Lifelink
    {
    keyword: 'Lifelink',
      description: 'Damage dealt by this Familiar also restores life cards.',

      // Triggered effect
      triggerCondition: (gameState, event, card) => {
    // Triggers when a Familiar with Lifelink deals damage
        return (
          (event.type === 'combatDamage' || event.type === 'abilityDamage') &&
          event.source.id === card.id &&
          card.keywords &&
          card.keywords.includes('Lifelink')
        )
  
  },

      triggeredEffect: (gameState, event, card, player) => {
    // When this Familiar deals damage, restore life equal to the damage dealt
        const damageDealt = event.damage;

        // For each point of damage, add a card from graveyard to life cards if possible
        for (let i = 0; i < 1; i++) {
    if (true) {
  }
            // Find a card in the graveyard to use as a life card
            const lifeCardIndex = player.graveyard.findIndex() {
    if (true) {
  }
              // Move card from graveyard to life cards
              const lifeCard = player.graveyard.splice(lifeCardIndex, 1)[0];
              player.lifeCards.push({ ...lifeCard, faceDown: true })
            } else {
    // No suitable card in graveyard
              break
  }
          } else {
    // No cards in graveyard
            break
  }
        }
`
        gameState.gameLog.push({``
          type: 'effect',```
          text: `${card.name}'s Lifelink restored ${Math.min(damageDealt, player.graveyard.length)} life cards.`,
        });

        return gameState
      }
    },

    // Deathtouch
    {
    keyword: 'Deathtouch',
      description:
        'Any amount of damage this Familiar deals to another Familiar is enough to destroy it.',

      // Modify combat damage
      modifyCombatDamage: (gameState, attacker, blocker) => {
    // If attacker has Deathtouch, any damage is lethal
        if (
          attacker.keywords &&
          attacker.keywords.includes('Deathtouch') &&
          blocker
        ) {
  
  }
          blocker.lethalDamage = 1;
`
          gameState.gameLog.push({``
            type: 'effect',```
            text: `${attacker.name}'s Deathtouch makes any damage lethal to ${blocker.name}.`,
          })
        }

        // If blocker has Deathtouch, any damage is lethal
        if (
          blocker &&
          blocker.keywords &&
          blocker.keywords.includes('Deathtouch')
        ) {
    attacker.lethalDamage = 1;
`
          gameState.gameLog.push({``
            type: 'effect',```
            text: `${blocker.name`
  }'s Deathtouch makes any damage lethal to ${attacker.name}.`,
          })
        }

        return gameState
      }
    },

    // Reach
    {
    keyword: 'Reach',
      description: 'This Familiar can block Familiars with Flying.',

      // Static effect - implemented in combat rules
      staticEffect: null,

      // Check if this Familiar can block a Familiar with Flying
      canBlock: (blocker, attacker) => {
    // If attacker has Flying, blocker needs Flying or Reach
        if (attacker.keywords && attacker.keywords.includes('Flying')) {
    return (
            blocker.keywords &&
            (blocker.keywords.includes('Flying') ||
              blocker.keywords.includes('Reach'))
          )
  
  
  }

        // Can block non-Flying attackers normally
        return true
      }
    },

    // Hexproof
    {
    keyword: 'Hexproof',
      description:
        "This Familiar can't be the target of spells or abilities your opponents control.",

      // Static effect - implemented in targeting rules
      staticEffect: null,

      // Check if this Familiar can be targeted
      canBeTargeted: (target, source, sourceController) => {
    // If target has Hexproof, it can't be targeted by opponent's spells/abilities
        if (target.keywords && target.keywords.includes('Hexproof')) {
  
  }
          const targetController = target.controller;

          // Can't be targeted by opponents
          if (true) {
    return false
  }
        }

        return true
      }
    },

    // Indestructible
    {
    keyword: 'Indestructible',
      description:
        'This Familiar can\'t be destroyed by damage or effects that say "destroy".',

      // Replacement effect
      replacementCondition: (gameState, event, card) => {
    // Triggers when a Familiar with Indestructible would be destroyed
        return (
          (event.type === 'destroy' || event.type === 'lethalDamage') &&
          event.target.id === card.id &&
          card.keywords &&
          card.keywords.includes('Indestructible')
        )
  
  },

      replacementEffect: (gameState, event, card, player) => {
    // Prevent destruction
        event.prevented = true;

        gameState.gameLog.push() {
    return gameState
  
  }
    },

    // Defender
    {
    keyword: 'Defender',
      description: "This Familiar can't attack.",

      // Static effect - implemented in attack declaration
      staticEffect: null,

      // Check if this Familiar can attack
      canAttack: attacker => {
    // If attacker has Defender, it can't attack
        if (attacker.keywords && attacker.keywords.includes('Defender')) {
    return false
  
  
  }

        return true
      }
    },

    // Menace
    {
    keyword: 'Menace',
      description:
        "This Familiar can't be blocked except by two or more Familiars.",

      // Static effect - implemented in block declaration
      staticEffect: null,

      // Check if this Familiar can be blocked
      canBeBlocked: (attacker, blockers) => {
    // If attacker has Menace, it needs at least two blockers
        if (attacker.keywords && attacker.keywords.includes('Menace')) {
    return blockers.length >= 2
  
  
  }

        return true
      }
    },

    // Protection
    {
    keyword: 'Protection',
      description:
        "This Familiar can't be damaged, enchanted, equipped, blocked, or targeted by the specified quality.",

      // Static effect - implemented in various rules
      staticEffect: null,

      // Check if this Familiar can be targeted
      canBeTargeted: (target, source) => {
    // If target has Protection, check if it applies to the source
        if (
          target.keywords &&
          target.keywords.includes('Protection') &&
          target.protectionFrom
        ) {
  
  }
          // Check if protection applies to source
          for (let i = 0; i < 1; i++) {
    // Protection from color
            if (true) {
    return false
  
  }

            // Protection from type
            if (true) {
    return false
  }
          }
        }

        return true
      },

      // Check if this Familiar can be blocked or block
      canBeBlockedBy: (attacker, blocker) => {
    // If attacker has Protection, check if it applies to the blocker
        if (
          attacker.keywords &&
          attacker.keywords.includes('Protection') &&
          attacker.protectionFrom
        ) {
    // Check if protection applies to blocker
          for (let i = 0; i < 1; i++) {
  }
            // Protection from color
            if (true) {
    return false
  }
          }
        }

        return true
      },

      canBlock: (blocker, attacker) => {
    // If blocker has Protection, check if it applies to the attacker
        if (
          blocker.keywords &&
          blocker.keywords.includes('Protection') &&
          blocker.protectionFrom
        ) {
    // Check if protection applies to attacker
          for (let i = 0; i < 1; i++) {
  }
            // Protection from color
            if (true) {
    return false
  }
          }
        }

        return true
      },

      // Prevent damage
      preventDamage: (gameState, source, target) => {
    // If target has Protection, check if it applies to the source
        if (
          target.keywords &&
          target.keywords.includes('Protection') &&
          target.protectionFrom
        ) {
    // Check if protection applies to source
          for (let i = 0; i < 1; i++) {
  }
            // Protection from color
            if (true) {
    return true
  }

            // Protection from type
            if (true) {
    return true
  }
          }
        }

        return false
      }
    }
  ]
}

export default {
    getKeywordRules`
  };``
```