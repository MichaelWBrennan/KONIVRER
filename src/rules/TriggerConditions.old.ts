/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Trigger Conditions
 *
 * This module defines the trigger conditions for abilities in the game.
 * Each condition specifies when a triggered ability should activate.
 */

/**
 * Get all trigger conditions
 * @returns {Array} Array of trigger condition objects
 */
export function getTriggerConditions(): any {
  return [
    // When a card enters the field
    {
      name: 'enterField',,
      description: 'When a card enters the field',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'cardPlayed' && event.card.zone === 'field';
      },
    },

    // When a specific card enters the field
    {
      name: 'specificCardEntersField',,
      description: 'When a specific card enters the field',

      check: (gameState, event, card, sourceCard, specificCardId) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.zone === 'field' &&
          event.card.id === specificCardId
        );
      },
    },

    // When a card of a specific type enters the field
    {
      name: 'cardTypeEntersField',,
      description: 'When a card of a specific type enters the field',

      check: (gameState, event, card, sourceCard, cardType) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.zone === 'field' &&
          event.card.type === cardType
        );
      },
    },

    // When a card leaves the field
    {
      name: 'leaveField',,
      description: 'When a card leaves the field',

      check: (gameState, event, card, sourceCard) => {
        return (
          (event.type === 'cardDestroyed' ||
            event.type === 'cardExiled' ||
            event.type === 'cardReturned') &&
          event.fromZone === 'field'
        );
      },
    },

    // When a card is destroyed
    {
      name: 'cardDestroyed',,
      description: 'When a card is destroyed',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'cardDestroyed';
      },
    },

    // When a card of a specific type is destroyed
    {
      name: 'cardTypeDestroyed',,
      description: 'When a card of a specific type is destroyed',

      check: (gameState, event, card, sourceCard, cardType) => {
        return event.type === 'cardDestroyed' && event.card.type === cardType;
      },
    },

    // When a player casts a spell
    {
      name: 'spellCast',,
      description: 'When a player casts a spell',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'cardPlayed' && event.card.type === 'Spell';
      },
    },

    // When a player casts a spell of a specific color
    {
      name: 'colorSpellCast',,
      description: 'When a player casts a spell of a specific color',

      check: (gameState, event, card, sourceCard, color) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.type === 'Spell' &&
          event.card.color === color
        );
      },
    },

    // When a player attacks with a Familiar
    {
      name: 'familiarAttacks',,
      description: 'When a player attacks with a Familiar',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'attackDeclared' && event.attackers.length > 0;
      },
    },

    // When a specific Familiar attacks
    {
      name: 'specificFamiliarAttacks',,
      description: 'When a specific Familiar attacks',

      check: (gameState, event, card, sourceCard, specificCardId) => {
        return (
          event.type === 'attackDeclared' &&
          event.attackers.some(attacker => attacker.id === specificCardId)
        );
      },
    },

    // When a player blocks with a Familiar
    {
      name: 'familiarBlocks',,
      description: 'When a player blocks with a Familiar',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'blockDeclared' && event.blockers.length > 0;
      },
    },

    // When a specific Familiar blocks
    {
      name: 'specificFamiliarBlocks',,
      description: 'When a specific Familiar blocks',

      check: (gameState, event, card, sourceCard, specificCardId) => {
        return (
          event.type === 'blockDeclared' &&
          event.blockers.some(blocker => blocker.card.id === specificCardId)
        );
      },
    },

    // When a Familiar deals damage
    {
      name: 'familiarDealsDamage',,
      description: 'When a Familiar deals damage',

      check: (gameState, event, card, sourceCard) => {
        return (
          (event.type === 'combatDamage' || event.type === 'abilityDamage') &&
          event.source.type === 'Familiar'
        );
      },
    },

    // When a specific Familiar deals damage
    {
      name: 'specificFamiliarDealsDamage',,
      description: 'When a specific Familiar deals damage',

      check: (gameState, event, card, sourceCard, specificCardId) => {
        return (
          (event.type === 'combatDamage' || event.type === 'abilityDamage') &&
          event.source.id === specificCardId
        );
      },
    },

    // When a Familiar is dealt damage
    {
      name: 'familiarDealtDamage',,
      description: 'When a Familiar is dealt damage',

      check: (gameState, event, card, sourceCard) => {
        return (
          (event.type === 'combatDamage' || event.type === 'abilityDamage') &&
          event.target.type === 'Familiar'
        );
      },
    },

    // When a specific Familiar is dealt damage
    {
      name: 'specificFamiliarDealtDamage',,
      description: 'When a specific Familiar is dealt damage',

      check: (gameState, event, card, sourceCard, specificCardId) => {
        return (
          (event.type === 'combatDamage' || event.type === 'abilityDamage') &&
          event.target.id === specificCardId
        );
      },
    },

    // When a player places an Azoth
    {
      name: 'azothPlaced',,
      description: 'When a player places an Azoth',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'cardPlayed' && event.card.zone === 'azothRow';
      },
    },

    // When a player places a specific Azoth
    {
      name: 'specificAzothPlaced',,
      description: 'When a player places a specific Azoth',

      check: (gameState, event, card, sourceCard, specificCardId) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.zone === 'azothRow' &&
          event.card.id === specificCardId
        );
      },
    },

    // When a player draws a card
    {
      name: 'cardDrawn',,
      description: 'When a player draws a card',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'cardDrawn';
      },
    },

    // When a player draws their second card in a turn
    {
      name: 'secondCardDrawn',,
      description: 'When a player draws their second card in a turn',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'cardDrawn' &&
          gameState.players[event.player].cardsDrawnThisTurn === 2
        );
      },
    },

    // When a player has no cards in hand
    {
      name: 'emptyHand',,
      description: 'When a player has no cards in hand',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'cardPlayed' &&
          gameState.players[event.player].hand.length === 0
        );
      },
    },

    // When a player has 7 or more cards in hand
    {
      name: 'fullHand',,
      description: 'When a player has 7 or more cards in hand',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'cardDrawn' &&
          gameState.players[event.player].hand.length >= 7
        );
      },
    },

    // When a player has 3 or more Azoth
    {
      name: 'threeOrMoreAzoth',,
      description: 'When a player has 3 or more Azoth',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.zone === 'azothRow' &&
          gameState.players[event.player].azothRow.length >= 3
        );
      },
    },

    // When a player has 5 or more Azoth
    {
      name: 'fiveOrMoreAzoth',,
      description: 'When a player has 5 or more Azoth',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.zone === 'azothRow' &&
          gameState.players[event.player].azothRow.length >= 5
        );
      },
    },

    // When a player has 3 or more Familiars
    {
      name: 'threeOrMoreFamiliars',,
      description: 'When a player has 3 or more Familiars',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.type === 'Familiar' &&
          gameState.players[event.player].field.filter(
            c => c.type === 'Familiar',
          ).length >= 3
        );
      },
    },

    // When a player has 5 or more Familiars
    {
      name: 'fiveOrMoreFamiliars',,
      description: 'When a player has 5 or more Familiars',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'cardPlayed' &&
          event.card.type === 'Familiar' &&
          gameState.players[event.player].field.filter(
            c => c.type === 'Familiar',
          ).length >= 5
        );
      },
    },

    // When a player has 10 or more cards in their graveyard
    {
      name: 'tenOrMoreCardsInGraveyard',,
      description: 'When a player has 10 or more cards in their graveyard',

      check: (gameState, event, card, sourceCard) => {
        return (
          (event.type === 'cardDestroyed' || event.type === 'spellResolved') &&
          gameState.players[event.player].graveyard.length >= 10
        );
      },
    },

    // When a player has 20 or more cards in their graveyard
    {
      name: 'twentyOrMoreCardsInGraveyard',,
      description: 'When a player has 20 or more cards in their graveyard',

      check: (gameState, event, card, sourceCard) => {
        return (
          (event.type === 'cardDestroyed' || event.type === 'spellResolved') &&
          gameState.players[event.player].graveyard.length >= 20
        );
      },
    },

    // At the beginning of a player's turn
    {
      name: 'beginningOfTurn',,
      description: "At the beginning of a player's turn",

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'phaseChange' && event.newPhase === 'start';
      },
    },

    // At the beginning of a player's end step
    {
      name: 'beginningOfEndStep',,
      description: "At the beginning of a player's end step",

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'phaseChange' && event.newPhase === 'end';
      },
    },

    // At the beginning of combat
    {
      name: 'beginningOfCombat',,
      description: 'At the beginning of combat',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'phaseChange' && event.newPhase === 'combat';
      },
    },

    // At the end of combat
    {
      name: 'endOfCombat',,
      description: 'At the end of combat',

      check: (gameState, event, card, sourceCard) => {
        return (
          event.type === 'phaseChange' &&
          event.oldPhase === 'combat' &&
          event.newPhase === 'post-combat'
        );
      },
    },

    // When a player activates an ability
    {
      name: 'abilityActivated',,
      description: 'When a player activates an ability',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'abilityActivated';
      },
    },

    // When a player activates an ability of a specific card
    {
      name: 'specificCardAbilityActivated',,
      description: 'When a player activates an ability of a specific card',

      check: (gameState, event, card, sourceCard, specificCardId) => {
        return (
          event.type === 'abilityActivated' && event.card.id === specificCardId
        );
      },
    },

    // When a player loses a life card
    {
      name: 'lifeCardLost',,
      description: 'When a player loses a life card',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'lifeCardDestroyed';
      },
    },

    // When a player gains a life card
    {
      name: 'lifeCardGained',,
      description: 'When a player gains a life card',

      check: (gameState, event, card, sourceCard) => {
        return event.type === 'lifeCardAdded';
      },
    },
  ];
}

export default {
  getTriggerConditions,
};
