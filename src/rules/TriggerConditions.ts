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

import { GameState } from '../types/GameState';
import { Card } from '../types/Card';
import { Player } from '../types/Player';
import { CardType, Element, Zone } from '../types/Enums';

// Event types
export enum EventType {
  CARD_PLAYED = 'cardPlayed',
  CARD_DRAWN = 'cardDrawn',
  CARD_DISCARDED = 'cardDiscarded',
  CARD_DESTROYED = 'cardDestroyed',
  CARD_ATTACKED = 'cardAttacked',
  CARD_DAMAGED = 'cardDamaged',
  TURN_START = 'turnStart',
  TURN_END = 'turnEnd',
  PHASE_CHANGE = 'phaseChange',
  AZOTH_GAINED = 'azothGained',
  AZOTH_LOST = 'azothLost',
  ENERGY_GAINED = 'energyGained',
  ENERGY_LOST = 'energyLost',
  PLAYER_DAMAGED = 'playerDamaged',
  SPELL_CAST = 'spellCast',
  ABILITY_ACTIVATED = 'abilityActivated'
}

// Game event interface
export interface GameEvent {
  type: EventType;
  player?: Player;
  card?: Card;
  target?: Card | Player;
  source?: Card | Player;
  amount?: number;
  zone?: Zone;
  phase?: string;
  metadata?: Record<string, any>;
}

// Trigger condition interface
export interface TriggerCondition {
  name: string;
  description: string;
  check: (
    gameState: GameState,
    event: GameEvent,
    card: Card,
    sourceCard: Card,
    ...args: any[]
  ) => boolean;
}

/**
 * Get all trigger conditions
 * @returns Array of trigger condition objects
 */
export function getTriggerConditions(): TriggerCondition[] {
  return [
    // When a card enters the field
    {
      name: 'enterField',
      description: 'When a card enters the field',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return event.type === EventType.CARD_PLAYED && event.zone === Zone.FIELD;
      }
    },

    // When a specific card enters the field
    {
      name: 'specificCardEntersField',
      description: 'When a specific card enters the field',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        specificCardId: string
      ): boolean => {
        return (
          event.type === EventType.CARD_PLAYED &&
          event.zone === Zone.FIELD &&
          event.card?.id === specificCardId
        );
      }
    },

    // When a card of a specific type enters the field
    {
      name: 'cardTypeEntersField',
      description: 'When a card of a specific type enters the field',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        cardType: CardType
      ): boolean => {
        return (
          event.type === EventType.CARD_PLAYED &&
          event.zone === Zone.FIELD &&
          event.card?.type === cardType
        );
      }
    },

    // When a card of a specific element enters the field
    {
      name: 'elementEntersField',
      description: 'When a card of a specific element enters the field',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        element: Element
      ): boolean => {
        return (
          event.type === EventType.CARD_PLAYED &&
          event.zone === Zone.FIELD &&
          event.card?.element === element
        );
      }
    },

    // When a card leaves the field
    {
      name: 'leaveField',
      description: 'When a card leaves the field',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return (
          (event.type === EventType.CARD_DESTROYED ||
            event.type === EventType.CARD_DISCARDED) &&
          event.card?.zone === Zone.FIELD
        );
      }
    },

    // When a card is destroyed
    {
      name: 'cardDestroyed',
      description: 'When a card is destroyed',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return event.type === EventType.CARD_DESTROYED;
      }
    },

    // When a specific card is destroyed
    {
      name: 'specificCardDestroyed',
      description: 'When a specific card is destroyed',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        specificCardId: string
      ): boolean => {
        return event.type === EventType.CARD_DESTROYED && event.card?.id === specificCardId;
      }
    },

    // When a card of a specific type is destroyed
    {
      name: 'cardTypeDestroyed',
      description: 'When a card of a specific type is destroyed',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        cardType: CardType
      ): boolean => {
        return event.type === EventType.CARD_DESTROYED && event.card?.type === cardType;
      }
    },

    // When a card of a specific element is destroyed
    {
      name: 'elementDestroyed',
      description: 'When a card of a specific element is destroyed',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        element: Element
      ): boolean => {
        return event.type === EventType.CARD_DESTROYED && event.card?.element === element;
      }
    },

    // When a card attacks
    {
      name: 'cardAttacks',
      description: 'When a card attacks',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return event.type === EventType.CARD_ATTACKED && event.card?.id === card.id;
      }
    },

    // When a card is attacked
    {
      name: 'cardIsAttacked',
      description: 'When a card is attacked',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return (
          event.type === EventType.CARD_ATTACKED &&
          event.target &&
          'id' in event.target &&
          event.target.id === card.id
        );
      }
    },

    // When a card deals damage
    {
      name: 'cardDealsDamage',
      description: 'When a card deals damage',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return (
          event.type === EventType.CARD_DAMAGED &&
          event.source &&
          'id' in event.source &&
          event.source.id === card.id
        );
      }
    },

    // When a card takes damage
    {
      name: 'cardTakesDamage',
      description: 'When a card takes damage',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return (
          event.type === EventType.CARD_DAMAGED &&
          event.card?.id === card.id &&
          event.amount !== undefined &&
          event.amount > 0
        );
      }
    },

    // When a player takes damage
    {
      name: 'playerTakesDamage',
      description: 'When a player takes damage',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        playerId?: string
      ): boolean => {
        if (event.type !== EventType.PLAYER_DAMAGED) return false;
        
        // If playerId is specified, check if it matches
        if (playerId && event.player) {
          return event.player.id === playerId;
        }
        
        // Otherwise, check if it's the card's controller
        const cardController = gameState.players.find(p =>
          p.field.some(c => c.id === card.id)
        );
        
        return event.player?.id === cardController?.id;
      }
    },

    // When a card is drawn
    {
      name: 'cardDrawn',
      description: 'When a card is drawn',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return event.type === EventType.CARD_DRAWN;
      }
    },

    // When a specific card is drawn
    {
      name: 'specificCardDrawn',
      description: 'When a specific card is drawn',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        specificCardId: string
      ): boolean => {
        return event.type === EventType.CARD_DRAWN && event.card?.id === specificCardId;
      }
    },

    // When a card of a specific type is drawn
    {
      name: 'cardTypeDrawn',
      description: 'When a card of a specific type is drawn',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        cardType: CardType
      ): boolean => {
        return event.type === EventType.CARD_DRAWN && event.card?.type === cardType;
      }
    },

    // When a card of a specific element is drawn
    {
      name: 'elementDrawn',
      description: 'When a card of a specific element is drawn',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        element: Element
      ): boolean => {
        return event.type === EventType.CARD_DRAWN && event.card?.element === element;
      }
    },

    // When a card is discarded
    {
      name: 'cardDiscarded',
      description: 'When a card is discarded',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return event.type === EventType.CARD_DISCARDED;
      }
    },

    // When a specific card is discarded
    {
      name: 'specificCardDiscarded',
      description: 'When a specific card is discarded',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        specificCardId: string
      ): boolean => {
        return event.type === EventType.CARD_DISCARDED && event.card?.id === specificCardId;
      }
    },

    // When a card of a specific type is discarded
    {
      name: 'cardTypeDiscarded',
      description: 'When a card of a specific type is discarded',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        cardType: CardType
      ): boolean => {
        return event.type === EventType.CARD_DISCARDED && event.card?.type === cardType;
      }
    },

    // When a card of a specific element is discarded
    {
      name: 'elementDiscarded',
      description: 'When a card of a specific element is discarded',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        element: Element
      ): boolean => {
        return event.type === EventType.CARD_DISCARDED && event.card?.element === element;
      }
    },

    // When a spell is cast
    {
      name: 'spellCast',
      description: 'When a spell is cast',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return event.type === EventType.SPELL_CAST;
      }
    },

    // When a specific spell is cast
    {
      name: 'specificSpellCast',
      description: 'When a specific spell is cast',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        specificCardId: string
      ): boolean => {
        return event.type === EventType.SPELL_CAST && event.card?.id === specificCardId;
      }
    },

    // When a spell of a specific element is cast
    {
      name: 'elementSpellCast',
      description: 'When a spell of a specific element is cast',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        element: Element
      ): boolean => {
        return (
          event.type === EventType.SPELL_CAST &&
          event.card?.type === CardType.SPELL &&
          event.card?.element === element
        );
      }
    },

    // When an ability is activated
    {
      name: 'abilityActivated',
      description: 'When an ability is activated',
      check: (gameState: GameState, event: GameEvent, card: Card, sourceCard: Card): boolean => {
        return event.type === EventType.ABILITY_ACTIVATED;
      }
    },

    // When a specific card's ability is activated
    {
      name: 'specificAbilityActivated',
      description: "When a specific card's ability is activated",
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        specificCardId: string
      ): boolean => {
        return (
          event.type === EventType.ABILITY_ACTIVATED &&
          event.source &&
          'id' in event.source &&
          event.source.id === specificCardId
        );
      }
    },

    // When a turn starts
    {
      name: 'turnStart',
      description: 'When a turn starts',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        playerId?: string
      ): boolean => {
        if (event.type !== EventType.TURN_START) return false;
        
        // If playerId is specified, check if it matches
        if (playerId && event.player) {
          return event.player.id === playerId;
        }
        
        // Otherwise, check if it's the card's controller
        const cardController = gameState.players.find(p =>
          p.field.some(c => c.id === card.id)
        );
        
        return event.player?.id === cardController?.id;
      }
    },

    // When a turn ends
    {
      name: 'turnEnd',
      description: 'When a turn ends',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        playerId?: string
      ): boolean => {
        if (event.type !== EventType.TURN_END) return false;
        
        // If playerId is specified, check if it matches
        if (playerId && event.player) {
          return event.player.id === playerId;
        }
        
        // Otherwise, check if it's the card's controller
        const cardController = gameState.players.find(p =>
          p.field.some(c => c.id === card.id)
        );
        
        return event.player?.id === cardController?.id;
      }
    },

    // When a phase changes
    {
      name: 'phaseChange',
      description: 'When a phase changes',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        phaseName?: string
      ): boolean => {
        if (event.type !== EventType.PHASE_CHANGE) return false;
        
        // If phaseName is specified, check if it matches
        if (phaseName && event.phase) {
          return event.phase === phaseName;
        }
        
        return true;
      }
    },

    // When Azoth is gained
    {
      name: 'azothGained',
      description: 'When Azoth is gained',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        playerId?: string
      ): boolean => {
        if (event.type !== EventType.AZOTH_GAINED) return false;
        
        // If playerId is specified, check if it matches
        if (playerId && event.player) {
          return event.player.id === playerId;
        }
        
        // Otherwise, check if it's the card's controller
        const cardController = gameState.players.find(p =>
          p.field.some(c => c.id === card.id)
        );
        
        return event.player?.id === cardController?.id;
      }
    },

    // When Azoth is lost
    {
      name: 'azothLost',
      description: 'When Azoth is lost',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        playerId?: string
      ): boolean => {
        if (event.type !== EventType.AZOTH_LOST) return false;
        
        // If playerId is specified, check if it matches
        if (playerId && event.player) {
          return event.player.id === playerId;
        }
        
        // Otherwise, check if it's the card's controller
        const cardController = gameState.players.find(p =>
          p.field.some(c => c.id === card.id)
        );
        
        return event.player?.id === cardController?.id;
      }
    },

    // When Energy is gained
    {
      name: 'energyGained',
      description: 'When Energy is gained',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        playerId?: string
      ): boolean => {
        if (event.type !== EventType.ENERGY_GAINED) return false;
        
        // If playerId is specified, check if it matches
        if (playerId && event.player) {
          return event.player.id === playerId;
        }
        
        // Otherwise, check if it's the card's controller
        const cardController = gameState.players.find(p =>
          p.field.some(c => c.id === card.id)
        );
        
        return event.player?.id === cardController?.id;
      }
    },

    // When Energy is lost
    {
      name: 'energyLost',
      description: 'When Energy is lost',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        playerId?: string
      ): boolean => {
        if (event.type !== EventType.ENERGY_LOST) return false;
        
        // If playerId is specified, check if it matches
        if (playerId && event.player) {
          return event.player.id === playerId;
        }
        
        // Otherwise, check if it's the card's controller
        const cardController = gameState.players.find(p =>
          p.field.some(c => c.id === card.id)
        );
        
        return event.player?.id === cardController?.id;
      }
    },

    // When a specific condition is met
    {
      name: 'customCondition',
      description: 'When a custom condition is met',
      check: (
        gameState: GameState,
        event: GameEvent,
        card: Card,
        sourceCard: Card,
        conditionFn: (gameState: GameState, event: GameEvent, card: Card) => boolean
      ): boolean => {
        return conditionFn(gameState, event, card);
      }
    }
  ];
}

// Export a map of trigger conditions for easier lookup
export const triggerConditionMap: Record<string, TriggerCondition> = getTriggerConditions().reduce(
  (map, condition) => {
    map[condition.name] = condition;
    return map;
  },
  {} as Record<string, TriggerCondition>
);

/**
 * Check if a trigger condition is met
 * @param conditionName - Name of the condition to check
 * @param gameState - Current game state
 * @param event - Event that triggered the check
 * @param card - Card that has the trigger
 * @param sourceCard - Card that is the source of the trigger
 * @param args - Additional arguments for the condition
 * @returns Whether the condition is met
 */
export function checkTriggerCondition(
  conditionName: string,
  gameState: GameState,
  event: GameEvent,
  card: Card,
  sourceCard: Card,
  ...args: any[]
): boolean {
  const condition = triggerConditionMap[conditionName];
  if (!condition) {
    console.error(`Trigger condition '${conditionName}' not found`);
    return false;
  }
  
  return condition.check(gameState, event, card, sourceCard, ...args);
}

export default {
  getTriggerConditions,
  triggerConditionMap,
  checkTriggerCondition
};