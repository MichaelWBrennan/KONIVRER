import { useState, useCallback } from "react";
import {
  GameState,
  Card,
  PlayerState,
  GameZone,
  DragState,
  KonivrverZoneType,
  KonivrverPhase,
} from "../types/game";

// TODO: Load actual card data from the card database instead of demo cards

const createInitialZones = (): Record<KonivrverZoneType, GameZone> => ({
  hand: {
    id: "hand",
    name: "Hand",
    cards: [], // TODO: Populate with actual player cards
    isVisible: true,
    allowDrop: true,
    layout: "fan",
  },
  field: {
    id: "field",
    name: "Field",
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: "grid",
  },
  combatRow: {
    id: "combatRow",
    name: "Combat Row",
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: "row",
  },
  azothRow: {
    id: "azothRow",
    name: "Azoth Row",
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: "row",
  },
  deck: {
    id: "deck",
    name: "Deck",
    cards: [], // TODO: Initialize with player's deck cards
    isVisible: false,
    allowDrop: false,
    layout: "stack",
  },
  lifeCards: {
    id: "lifeCards",
    name: "Life Cards",
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: "stack",
  },
  flag: {
    id: "flag",
    name: "Flag",
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: "stack",
  },
  removedFromPlay: {
    id: "removedFromPlay",
    name: "Removed From Play",
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: "stack",
  },
  stack: {
    id: "stack",
    name: "Stack",
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: "stack",
  },
});

const createInitialPlayer = (id: string, name: string): PlayerState => ({
  id,
  name,
  azothPool: {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    light: 0,
    dark: 0,
    neutral: 0,
  },
  zones: createInitialZones(),
  flag: undefined,
  // Legacy compatibility
  life: 20,
  manaPool: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 0 },
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [
      createInitialPlayer("player1", "You"),
      createInitialPlayer("player2", "Opponent"),
    ],
    currentPlayer: 0,
    turn: 1,
    phase: "main",
    stack: [],
    activePlayer: 0,
    priorityPlayer: 0,
    deckConstructionRules: {
      totalCards: 40,
      commonCards: 25,
      uncommonCards: 13,
      rareCards: 2,
      flagRequired: true,
      maxCopiesPerCard: 1,
    },
  });

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedCard: undefined,
    dragOffset: { x: 0, y: 0 },
    validDropZones: [],
  });

  const selectCard = useCallback((card: Card) => {
    setGameState((prev) => {
      const newState = { ...prev };
      // Find and update the card's selection state
      for (const player of newState.players) {
        for (const zone of Object.values(player.zones)) {
          const cardIndex = zone.cards.findIndex((c) => c.id === card.id);
          if (cardIndex !== -1) {
            zone.cards[cardIndex] = {
              ...zone.cards[cardIndex],
              isSelected: !zone.cards[cardIndex].isSelected,
            };

            if (zone.cards[cardIndex].isSelected) {
              setSelectedCards((prev) => [...prev, zone.cards[cardIndex]]);
            } else {
              setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
            }
            break;
          }
        }
      }
      return newState;
    });
  }, []);

  const findCardZone = useCallback(
    (cardId: string): string | undefined => {
      for (const player of gameState.players) {
        for (const [zoneId, zone] of Object.entries(player.zones)) {
          if (zone.cards.some((c) => c.id === cardId)) {
            return zoneId;
          }
        }
      }
      return undefined;
    },
    [gameState],
  );

  const moveCard = useCallback(
    (cardId: string, targetZoneId: string, playerIndex: number = 0) => {
      // Type guard to check if targetZoneId is a valid KonivrverZoneType
      const isValidZoneType = (zoneId: string): zoneId is KonivrverZoneType => {
        const validZones: KonivrverZoneType[] = [
          "field",
          "combatRow",
          "azothRow",
          "hand",
          "deck",
          "lifeCards",
          "flag",
          "removedFromPlay",
          "stack",
        ];
        return validZones.includes(zoneId as KonivrverZoneType);
      };

      setGameState((prev) => {
        const newState = { ...prev };
        let sourceCard: Card | undefined;

        // Find and remove card from source zone
        for (const player of newState.players) {
          for (const [, zone] of Object.entries(player.zones)) {
            const cardIndex = zone.cards.findIndex((c) => c.id === cardId);
            if (cardIndex !== -1) {
              sourceCard = zone.cards[cardIndex];
              zone.cards.splice(cardIndex, 1);
              break;
            }
          }
          if (sourceCard) break;
        }

        // Add card to target zone
        if (
          sourceCard &&
          isValidZoneType(targetZoneId) &&
          newState.players[playerIndex].zones[targetZoneId]
        ) {
          // Reset card state when moving
          const resetCard = {
            ...sourceCard,
            isSelected: false,
            isTapped: targetZoneId === "field" ? sourceCard.isTapped : undefined,
          };
          newState.players[playerIndex].zones[targetZoneId].cards.push(
            resetCard,
          );
        }

        return newState;
      });

      // Clear drag state
      setDragState((prev) => ({
        ...prev,
        isDragging: false,
        draggedCard: undefined,
      }));
    },
    [],
  );

  const doubleClickCard = useCallback((card: Card) => {
    // Auto-play logic: move to appropriate zone
    const cardType = card.type || card.lesserType;
    if (cardType && cardType.toLowerCase().includes("land")) {
      moveCard(card.id, "field");
    } else if (
      cardType &&
      (cardType.toLowerCase().includes("creature") ||
        cardType.toLowerCase().includes("familiar"))
    ) {
      moveCard(card.id, "field");
    } else {
      moveCard(card.id, "stack");
    }
  }, [moveCard]);

  const rightClickCard = useCallback((card: Card) => {
    // Toggle tap state for mobile long-press or desktop right-click
    setGameState((prev) => {
      const newState = { ...prev };
      for (const player of newState.players) {
        for (const zone of Object.values(player.zones)) {
          const cardIndex = zone.cards.findIndex((c) => c.id === card.id);
          if (cardIndex !== -1) {
            zone.cards[cardIndex] = {
              ...zone.cards[cardIndex],
              isTapped: !zone.cards[cardIndex].isTapped,
            };
            break;
          }
        }
      }
      return newState;
    });
  }, []);

  const startDrag = useCallback(
    (card: Card, position: { x: number; y: number }) => {
      // Determine valid drop zones based on card type and current zone
      const validDropZones: KonivrverZoneType[] = [
        "field",
        "removedFromPlay",
        "hand",
      ];
      const cardType = card.type || card.lesserType;
      if (
        cardType &&
        (cardType.toLowerCase().includes("instant") ||
          cardType.toLowerCase().includes("sorcery"))
      ) {
        validDropZones.push("stack");
      }

      const sourceZone = findCardZone(card.id);
      setDragState({
        isDragging: true,
        draggedCard: card,
        dragOffset: position,
        sourceZone: sourceZone as KonivrverZoneType,
        validDropZones,
      });
    },
    [findCardZone],
  );

  const endDrag = useCallback(() => {
    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      draggedCard: undefined,
    }));
  }, []);

  const handleZoneDrop = useCallback(
    (zoneId: string) => {
      if (dragState.draggedCard) {
        moveCard(dragState.draggedCard.id, zoneId);
      }
    },
    [dragState.draggedCard, moveCard],
  );

  const nextTurn = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentPlayer: 1 - prev.currentPlayer,
      turn: prev.currentPlayer === 1 ? prev.turn + 1 : prev.turn,
      phase: "start" as KonivrverPhase,
    }));
  }, []);

  const nextPhase = useCallback(() => {
    const phases: KonivrverPhase[] = [
      "preGame",
      "start",
      "main",
      "combat",
      "postCombat",
      "refresh",
    ];
    const currentIndex = phases.indexOf(gameState.phase);
    const nextIndex = (currentIndex + 1) % phases.length;

    setGameState((prev) => ({
      ...prev,
      phase: phases[nextIndex],
    }));
  }, [gameState.phase]);

  return {
    gameState,
    selectedCards,
    dragState,
    selectCard,
    doubleClickCard,
    rightClickCard,
    startDrag,
    endDrag,
    handleZoneDrop,
    moveCard,
    nextTurn,
    nextPhase,
  };
};
