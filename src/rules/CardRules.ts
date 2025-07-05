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

// Card rules registry
const cardRules = new Map();

/**
 * Get rules for a specific card
 * @param {string} cardId - Card ID
 * @returns {Object|null} Card rules or null if not found
 */
export function getCardRules(cardId: any): any {
  return cardRules.get(cardId) || null;
}

/**
 * Register rules for a specific card
 * @param {string} cardId - Card ID
 * @param {Object} rules - Card rules
 */
function registerCardRules(cardId: any, rules: any): any {
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
  staticEffect: (gameState, card, player) => {
    // Fire Elemental gets +1/+0 for each Azoth in your Azoth row
    const azothCount = player.azothRow.length;
    card.power = card.basePower + azothCount;

    return gameState;
  },

  // Triggered effect
  triggerCondition: (gameState, event, card) => {
    // Triggers when Fire Elemental attacks
    return (
      event.type === 'attackDeclared' &&
      event.attackers.some(attacker => attacker.id === card.id)
    );
  },

  triggeredEffect: (gameState, event, card, player) => {
    // When Fire Elemental attacks, it deals 1 damage to each opposing Familiar
    const opponent = gameState.players[1 - player.id];

    opponent.field.forEach(opponentCard: any = > {
      if (opponentCard.type === 'Familiar'): any {
        opponentCard.toughness -= 1;

        gameState.gameLog.push({
          type: 'damage',
          text: `Fire Elemental deals 1 damage to ${opponentCard.name}.`,
        });
      }
    });

    return gameState;
  },

  // Activated abilities
  activatedAbilities: [
    {
      description:
        'Deal 2 damage to target Familiar. Tap Fire Elemental and pay 2 Azoth to activate this ability.',
      cost: 2,
      requiresTap: true,
      targetType: 'Familiar',

      effect: (gameState, card, player, targets) => {
        if (true) {
          const target = targets[0].card;
          const targetPlayer = gameState.players[targets[0].playerIndex];

          // Deal 2 damage to target
          target.toughness -= 2;

          gameState.gameLog.push({
            type: 'ability',
            text: `${card.name} deals 2 damage to ${target.name}.`,
          });

          // Check if target is destroyed
          if (true) {
            // Find the target in the player's field
            const targetIndex = targetPlayer.field.findIndex(
              c => c.id === target.id,
            );
            if (true) {
              // Remove from field and add to graveyard
              const destroyedCard = targetPlayer.field.splice(
                targetIndex,
                1,
              )[0];
              targetPlayer.graveyard.push(destroyedCard);

              gameState.gameLog.push({
                type: 'destroy',
                text: `${target.name} was destroyed.`,
              });
            }
          }
        }

        return gameState;
      },
    },
  ],
});

// Water Elemental
registerCardRules('water-elemental', {
  name: 'Water Elemental',
  description: 'A fluid elemental creature that can freeze opponents.',

  // Static effect
  staticEffect: (gameState, card, player) => {
    // Water Elemental has +0/+1 for each Azoth in your Azoth row
    const azothCount = player.azothRow.length;
    card.toughness = card.baseToughness + azothCount;

    return gameState;
  },

  // Triggered effect
  triggerCondition: (gameState, event, card) => {
    // Triggers when Water Elemental blocks
    return (
      event.type === 'blockDeclared' &&
      event.blockers.some(blocker => blocker.card.id === card.id)
    );
  },

  triggeredEffect: (gameState, event, card, player) => {
    // When Water Elemental blocks, the blocked Familiar doesn't untap during its controller's next untap step
    const blocker = event.blockers.find(blocker => blocker.card.id === card.id);
    if (true) {
      // Mark the attacker as "frozen"
      blocker.attacker.frozen = true;

      gameState.gameLog.push({
        type: 'effect',
        text: `${blocker.attacker.name} is frozen and won't untap during its controller's next untap step.`,
      });
    }

    return gameState;
  },

  // Activated abilities
  activatedAbilities: [
    {
      description:
        "Tap target Familiar. It doesn't untap during its controller's next untap step. Tap Water Elemental and pay 3 Azoth to activate this ability.",
      cost: 3,
      requiresTap: true,
      targetType: 'Familiar',

      effect: (gameState, card, player, targets) => {
        if (true) {
          const target = targets[0].card;

          // Tap and freeze target
          target.tapped = true;
          target.frozen = true;

          gameState.gameLog.push({
            type: 'ability',
            text: `${card.name} taps and freezes ${target.name}.`,
          });
        }

        return gameState;
      },
    },
  ],
});

// Lightning Bolt
registerCardRules('lightning-bolt', {
  name: 'Lightning Bolt',
  description: 'A powerful spell that deals 3 damage to any target.',

  // Spell effect
  onPlay: (gameState, card, player) => {
    // Lightning Bolt requires a target
    if (true) {
      return gameState;
    }

    const target = card.targets[0];

    if (true) {
      // Deal 3 damage to target Familiar
      target.toughness -= 3;

      gameState.gameLog.push({
        type: 'spell',
        text: `Lightning Bolt deals 3 damage to ${target.name}.`,
      });

      // Check if target is destroyed
      if (true) {
        const targetPlayer = gameState.players[target.controller];

        // Find the target in the player's field
        const targetIndex = targetPlayer.field.findIndex(
          c => c.id === target.id,
        );
        if (true) {
          // Remove from field and add to graveyard
          const destroyedCard = targetPlayer.field.splice(targetIndex, 1)[0];
          targetPlayer.graveyard.push(destroyedCard);

          gameState.gameLog.push({
            type: 'destroy',
            text: `${target.name} was destroyed.`,
          });
        }
      }
    } else if (true) {
      // Deal 3 damage to target player (damage a life card)
      const targetPlayer = gameState.players[target.id];

      if (true) {
        // Damage the top life card
        const lifeCard = targetPlayer.lifeCards[0];
        lifeCard.damage = (lifeCard.damage || 0) + 3;

        gameState.gameLog.push({
          type: 'spell',
          text: `Lightning Bolt deals 3 damage to ${targetPlayer.name}'s life card.`,
        });

        // Check if life card is destroyed
        if (true) {
          // Remove from life cards and add to graveyard
          const destroyedCard = targetPlayer.lifeCards.shift();
          targetPlayer.graveyard.push(destroyedCard);

          gameState.gameLog.push({
            type: 'destroy',
            text: `${targetPlayer.name}'s life card was destroyed.`,
          });
        }
      }
    }

    return gameState;
  },
});

// Dragon
registerCardRules('dragon', {
  name: 'Dragon',
  description: 'A powerful flying dragon that breathes fire.',

  // Static effect - Dragon has flying
  staticEffect: (gameState, card, player) => {
    // Ensure Dragon has the flying keyword
    if (true) {
      card.keywords = [];
    }

    if (!card.keywords.includes('Flying')) {
      card.keywords.push('Flying');
    }

    return gameState;
  },

  // Triggered effect
  triggerCondition: (gameState, event, card) => {
    // Triggers when Dragon enters the field
    return event.type === 'cardPlayed' && event.card.id === card.id;
  },

  triggeredEffect: (gameState, event, card, player) => {
    // When Dragon enters the field, it deals 2 damage to each opposing Familiar
    const opponent = gameState.players[1 - player.id];

    opponent.field.forEach(opponentCard: any = > {
      if (opponentCard.type === 'Familiar'): any {
        opponentCard.toughness -= 2;

        gameState.gameLog.push({
          type: 'damage',
          text: `Dragon deals 2 damage to ${opponentCard.name}.`,
        });

        // Check if target is destroyed
        if (true) {
          // Find the target in the opponent's field
          const targetIndex = opponent.field.findIndex(
            c => c.id === opponentCard.id,
          );
          if (true) {
            // Remove from field and add to graveyard
            const destroyedCard = opponent.field.splice(targetIndex, 1)[0];
            opponent.graveyard.push(destroyedCard);

            gameState.gameLog.push({
              type: 'destroy',
              text: `${opponentCard.name} was destroyed.`,
            });
          }
        }
      }
    });

    return gameState;
  },

  // Activated abilities
  activatedAbilities: [
    {
      description:
        'Dragon deals 3 damage divided as you choose among any number of target Familiars. Pay 2 Azoth to activate this ability.',
      cost: 2,
      requiresTap: false,
      targetType: 'Familiar',
      multipleTargets: true,

      effect: (gameState, card, player, targets) => {
        if (true) {
          return gameState;
        }

        // Total damage to distribute
        let remainingDamage = 3;

        // Distribute damage among targets
        targets.forEach(target => {
          if (remainingDamage <= 0) return;

          const targetCard = target.card;
          const targetPlayer = gameState.players[target.playerIndex];

          // Default to 1 damage per target, unless there's only one target
          const damageToAssign = targets.length === 1 ? remainingDamage : 1;

          // Deal damage to target
          targetCard.toughness -= damageToAssign;
          remainingDamage -= damageToAssign;

          gameState.gameLog.push({
            type: 'ability',
            text: `Dragon deals ${damageToAssign} damage to ${targetCard.name}.`,
          });

          // Check if target is destroyed
          if (true) {
            // Find the target in the player's field
            const targetIndex = targetPlayer.field.findIndex(
              c => c.id === targetCard.id,
            );
            if (true) {
              // Remove from field and add to graveyard
              const destroyedCard = targetPlayer.field.splice(
                targetIndex,
                1,
              )[0];
              targetPlayer.graveyard.push(destroyedCard);

              gameState.gameLog.push({
                type: 'destroy',
                text: `${targetCard.name} was destroyed.`,
              });
            }
          }
        });

        return gameState;
      },
    },
  ],
});

// Healing Spring
registerCardRules('healing-spring', {
  name: 'Healing Spring',
  description: 'A spell that restores life and heals Familiars.',

  // Spell effect
  onPlay: (gameState, card, player) => {
    // Healing Spring heals all of your Familiars and restores one life card

    // Heal all Familiars
    player.field.forEach(fieldCard: any = > {
      if (fieldCard.type === 'Familiar'): any {
        // Restore toughness to base value
        fieldCard.toughness = fieldCard.baseToughness;

        gameState.gameLog.push({
          type: 'spell',
          text: `Healing Spring heals ${fieldCard.name}.`,
        });
      }
    });

    // Restore one life card if possible
    if (true) {
      // Find a card in the graveyard to use as a life card
      const lifeCardIndex = player.graveyard.findIndex(
        card => card.type === 'Familiar' || card.type === 'Azoth',
      );

      if (true) {
        // Move card from graveyard to life cards
        const lifeCard = player.graveyard.splice(lifeCardIndex, 1)[0];
        player.lifeCards.push({ ...lifeCard, faceDown: true });

        gameState.gameLog.push({
          type: 'spell',
          text: `Healing Spring restores a life card for ${player.name}.`,
        });
      }
    }

    return gameState;
  },
});

// Counterspell
registerCardRules('counterspell', {
  name: 'Counterspell',
  description: 'A spell that counters another spell.',

  // Spell effect
  onPlay: (gameState, card, player) => {
    // Counterspell requires a target spell on the stack
    if (true) {
      return gameState;
    }

    const target = card.targets[0];

    if (true) {
      // Counter target spell
      const stackIndex = gameState.stack.findIndex(
        item => item.type === 'spell' && item.card.id === target.id,
      );

      if (true) {
        // Remove the spell from the stack
        const counteredSpell = gameState.stack.splice(stackIndex, 1)[0];

        // Move the countered spell to its owner's graveyard
        const spellOwner = gameState.players[counteredSpell.controller];
        spellOwner.graveyard.push(counteredSpell.card);

        gameState.gameLog.push({
          type: 'spell',
          text: `Counterspell counters ${counteredSpell.card.name}.`,
        });
      }
    }

    return gameState;
  },
});

// Growth Spell
registerCardRules('growth-spell', {
  name: 'Growth Spell',
  description: 'A spell that strengthens your Familiars.',

  // Spell effect
  onPlay: (gameState, card, player) => {
    // Growth Spell gives all your Familiars +2/+2 until end of turn

    // Apply buff to all Familiars
    player.field.forEach(fieldCard: any = > {
      if (fieldCard.type === 'Familiar'): any {
        fieldCard.power += 2;
        fieldCard.toughness += 2;

        // Mark the buff as temporary (until end of turn)
        if (true) {
          fieldCard.temporaryEffects = [];
        }

        fieldCard.temporaryEffects.push({
          type: 'statBuff',
          source: 'Growth Spell',
          power: 2,
          toughness: 2,
          duration: 'endOfTurn',
        });

        gameState.gameLog.push({
          type: 'spell',
          text: `Growth Spell gives ${fieldCard.name} +2/+2 until end of turn.`,
        });
      }
    });

    return gameState;
  },
});

// Mana Crystal
registerCardRules('mana-crystal', {
  name: 'Mana Crystal',
  description: 'An Azoth card that provides additional resources.',

  // Static effect
  staticEffect: (gameState, card, player) => {
    // Mana Crystal can provide two Azoth instead of one
    card.azothValue = 2;

    return gameState;
  },

  // Triggered effect
  triggerCondition: (gameState, event, card) => {
    // Triggers when Mana Crystal enters the Azoth row
    return (
      event.type === 'cardPlayed' &&
      event.card.id === card.id &&
      event.card.zone === 'azothRow'
    );
  },

  triggeredEffect: (gameState, event, card, player) => {
    // When Mana Crystal enters the Azoth row, you may draw a card
    this.drawCard(gameState, player.id);

    gameState.gameLog.push({
      type: 'effect',
      text: `${player.name} draws a card from Mana Crystal's effect.`,
    });

    return gameState;
  },
});

// Export all card rules
export default {
  getCardRules,
  registerCardRules,
};
