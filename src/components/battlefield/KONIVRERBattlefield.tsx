import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { GameEngine } from '../../game/GameEngine';
import { MysticalArena, ArenaConfig } from '../../game/3d/MysticalArena';
import './KONIVRERBattlefield.css';

interface Card {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  health?: number;
  description: string;
  cardType: 'familiar' | 'spell' | 'flag' | 'azoth';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image?: string;
  isPlayable?: boolean;
  canAttack?: boolean;
  position?: { x: number; y: number };
}

interface GameZone {
  id: string;
  name: string;
  cards: Card[];
  maxCards: number;
  type: 'flag' | 'life' | 'deck' | 'removed' | 'combat' | 'azoth' | 'field' | 'hand';
  isPlayerOwned: boolean;
  position: { x: number; y: number; width: number; height: number };
  isDropZone: boolean;
}

interface GameState {
  playerHealth: number;
  opponentHealth: number;
  playerAzoth: { current: number; max: number };
  opponentAzoth: { current: number; max: number };
  currentTurn: 'player' | 'opponent';
  turnPhase: 'start' | 'main' | 'combat' | 'end';
  turnTimer: number;
  flagZone: Card | null; // Special zone for flag cards
}

interface KONIVRERBattlefieldProps {
  onGameStateChange?: (state: GameState) => void;
  onThemeChange?: (theme: string) => void;
  onQualityChange?: (quality: string) => void;
  onGameAction?: (action: any) => void;
  enableInteractiveElements?: boolean;
  enablePerformanceMonitoring?: boolean;
  className?: string;
}

// Sample cards for KONIVRER
const SAMPLE_KONIVRER_CARDS: Card[] = [
  {
    id: '1',
    name: 'Lightning Familiar',
    cost: 3,
    attack: 2,
    health: 3,
    description: 'A swift familiar that crackles with electric energy.',
    cardType: 'familiar',
    rarity: 'common',
    isPlayable: true,
  },
  {
    id: '2',
    name: 'Azoth Surge',
    cost: 2,
    description: 'Draw 2 cards and gain 1 Azoth.',
    cardType: 'spell',
    rarity: 'common',
    isPlayable: true,
  },
  {
    id: '3',
    name: 'Banner of Victory',
    cost: 4,
    description: 'Win the game if you control 3 or more familiars.',
    cardType: 'flag',
    rarity: 'epic',
    isPlayable: true,
  },
  {
    id: '4',
    name: 'Mystical Conduit',
    cost: 1,
    description: 'Generate 2 Azoth at the start of your turn.',
    cardType: 'azoth',
    rarity: 'rare',
    isPlayable: true,
  },
  {
    id: '5',
    name: 'Earth Guardian',
    cost: 5,
    attack: 4,
    health: 6,
    description: 'Taunt. When played, heal 3 life.',
    cardType: 'familiar',
    rarity: 'rare',
    isPlayable: true,
  },
];

const KONIVRERBattlefield: React.FC<KONIVRERBattlefieldProps> = ({
  onGameStateChange,
  onThemeChange,
  onQualityChange,
  onGameAction,
  enableInteractiveElements = true,
  enablePerformanceMonitoring = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const arenaRef = useRef<MysticalArena | null>(null);
  const dragControls = useDragControls();

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    playerHealth: 20,
    opponentHealth: 20,
    playerAzoth: { current: 3, max: 3 },
    opponentAzoth: { current: 2, max: 2 },
    currentTurn: 'player',
    turnPhase: 'main',
    turnTimer: 90,
    flagZone: null,
  });

  // Define KONIVRER zones with proper positioning
  const [gameZones, setGameZones] = useState<GameZone[]>([
    // Player zones
    {
      id: 'player-hand',
      name: 'Hand',
      cards: [...SAMPLE_KONIVRER_CARDS],
      maxCards: 7,
      type: 'hand',
      isPlayerOwned: true,
      position: { x: 10, y: 85, width: 80, height: 12 },
      isDropZone: false,
    },
    {
      id: 'player-deck',
      name: 'Deck',
      cards: [],
      maxCards: 60,
      type: 'deck',
      isPlayerOwned: true,
      position: { x: 2, y: 70, width: 8, height: 12 },
      isDropZone: false,
    },
    {
      id: 'player-life',
      name: 'Life',
      cards: [],
      maxCards: 1,
      type: 'life',
      isPlayerOwned: true,
      position: { x: 2, y: 55, width: 8, height: 8 },
      isDropZone: false,
    },
    {
      id: 'player-azoth-row',
      name: 'Azoth Row',
      cards: [],
      maxCards: 3,
      type: 'azoth',
      isPlayerOwned: true,
      position: { x: 15, y: 70, width: 70, height: 8 },
      isDropZone: true,
    },
    {
      id: 'player-combat-row',
      name: 'Combat Row',
      cards: [],
      maxCards: 5,
      type: 'combat',
      isPlayerOwned: true,
      position: { x: 15, y: 60, width: 70, height: 8 },
      isDropZone: true,
    },
    {
      id: 'field-zone',
      name: 'Field',
      cards: [],
      maxCards: 10,
      type: 'field',
      isPlayerOwned: false, // Shared zone
      position: { x: 15, y: 45, width: 70, height: 10 },
      isDropZone: true,
    },
    {
      id: 'flag-zone',
      name: 'Flag',
      cards: [],
      maxCards: 1,
      type: 'flag',
      isPlayerOwned: false, // Shared zone
      position: { x: 45, y: 2, width: 10, height: 8 },
      isDropZone: true,
    },
    {
      id: 'removed-zone',
      name: 'Removed from Play',
      cards: [],
      maxCards: 100,
      type: 'removed',
      isPlayerOwned: false, // Shared zone
      position: { x: 90, y: 45, width: 8, height: 20 },
      isDropZone: false,
    },
    // Opponent zones
    {
      id: 'opponent-combat-row',
      name: 'Opponent Combat',
      cards: [
        { ...SAMPLE_KONIVRER_CARDS[0], id: 'opp1', isPlayable: false },
        { ...SAMPLE_KONIVRER_CARDS[4], id: 'opp2', isPlayable: false },
      ],
      maxCards: 5,
      type: 'combat',
      isPlayerOwned: false,
      position: { x: 15, y: 30, width: 70, height: 8 },
      isDropZone: false,
    },
    {
      id: 'opponent-azoth-row',
      name: 'Opponent Azoth',
      cards: [],
      maxCards: 3,
      type: 'azoth',
      isPlayerOwned: false,
      position: { x: 15, y: 20, width: 70, height: 8 },
      isDropZone: false,
    },
    {
      id: 'opponent-life',
      name: 'Opponent Life',
      cards: [],
      maxCards: 1,
      type: 'life',
      isPlayerOwned: false,
      position: { x: 90, y: 25, width: 8, height: 8 },
      isDropZone: false,
    },
    {
      id: 'opponent-deck',
      name: 'Opponent Deck',
      cards: [],
      maxCards: 60,
      type: 'deck',
      isPlayerOwned: false,
      position: { x: 90, y: 10, width: 8, height: 12 },
      isDropZone: false,
    },
  ]);

  // UI State
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<string>('konivrer');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');

  // Initialize 3D Arena
  useEffect(() => {
    const initializeArena = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);

        // Initialize GameEngine
        const engine = new GameEngine();
        await engine.init(canvasRef.current);
        gameEngineRef.current = engine;

        // Configure arena for KONIVRER theme
        const arenaConfig: ArenaConfig = {
          theme: 'mystical',
          quality: quality,
          enableParticles: true,
          enableLighting: true,
          enablePostProcessing: quality === 'ultra',
          isMobile: window.innerWidth < 768,
          enableInteractiveElements: enableInteractiveElements,
          enableIdleAnimations: true,
        };

        // Initialize and configure arena if available
        if (engine.isArenaInitialized()) {
          engine.updateArenaQuality(quality);
        }

        setIsLoading(false);
        console.log('[KONIVRERBattlefield] Arena initialized successfully');
      } catch (error) {
        console.error('[KONIVRERBattlefield] Failed to initialize arena:', error);
        setIsLoading(false);
      }
    };

    initializeArena();

    // Cleanup on unmount
    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
        gameEngineRef.current = null;
      }
    };
  }, [quality, enableInteractiveElements]);

  // Handle theme changes
  useEffect(() => {
    if (gameEngineRef.current && currentTheme) {
      gameEngineRef.current.changeArenaTheme(currentTheme as any);
      onThemeChange?.(currentTheme);
    }
  }, [currentTheme, onThemeChange]);

  // Game state change handler
  useEffect(() => {
    onGameStateChange?.(gameState);
  }, [gameState, onGameStateChange]);

  // Turn timer effect
  useEffect(() => {
    if (gameState.turnTimer > 0 && gameState.currentTurn === 'player') {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          turnTimer: prev.turnTimer - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.turnTimer, gameState.currentTurn]);

  // Card drag handlers
  const handleCardDragStart = useCallback((card: Card) => {
    setDraggedCard(card);
    setSelectedCard(card.id);
  }, []);

  const handleCardDragEnd = useCallback(
    (targetZone: string) => {
      if (!draggedCard) return;

      const zone = gameZones.find(z => z.id === targetZone);
      if (!zone || !zone.isDropZone) {
        console.log(`[KONIVRERBattlefield] Invalid drop zone: ${targetZone}`);
        setDraggedCard(null);
        setSelectedCard(null);
        return;
      }

      // Handle card play logic based on zone type
      if (zone.type === 'combat' && zone.isPlayerOwned && draggedCard.cardType === 'familiar') {
        playCardToZone(draggedCard, targetZone);
      } else if (zone.type === 'azoth' && zone.isPlayerOwned && draggedCard.cardType === 'azoth') {
        playCardToZone(draggedCard, targetZone);
      } else if (zone.type === 'flag' && draggedCard.cardType === 'flag') {
        playCardToZone(draggedCard, targetZone);
      } else if (zone.type === 'field') {
        playCardToZone(draggedCard, targetZone);
      }

      setDraggedCard(null);
      setSelectedCard(null);
    },
    [draggedCard, gameZones]
  );

  const playCardToZone = useCallback((card: Card, targetZoneId: string) => {
    setGameZones(prev =>
      prev.map(zone => {
        if (zone.id === 'player-hand') {
          return {
            ...zone,
            cards: zone.cards.filter(c => c.id !== card.id),
          };
        }
        if (zone.id === targetZoneId) {
          if (zone.cards.length < zone.maxCards) {
            return {
              ...zone,
              cards: [...zone.cards, card],
            };
          }
        }
        return zone;
      })
    );

    // Deduct azoth cost
    setGameState(prev => ({
      ...prev,
      playerAzoth: {
        ...prev.playerAzoth,
        current: Math.max(0, prev.playerAzoth.current - card.cost),
      },
    }));

    // Trigger game action
    onGameAction?.({
      type: 'play_card',
      cardId: card.id,
      sourceZone: 'player-hand',
      targetZone: targetZoneId,
      cost: card.cost,
    });

    console.log(`[KONIVRERBattlefield] Played ${card.name} to ${targetZoneId}`);
  }, [onGameAction]);

  const handleZoneHover = useCallback((zoneId: string | null) => {
    setHoveredZone(zoneId);
  }, []);

  const handleEndTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTurn: prev.currentTurn === 'player' ? 'opponent' : 'player',
      turnTimer: 90,
      turnPhase: 'start',
    }));
  }, []);

  const handleThemeChange = useCallback((theme: string) => {
    setCurrentTheme(theme);
  }, []);

  const handleQualityChange = useCallback(
    (newQuality: 'low' | 'medium' | 'high' | 'ultra') => {
      setQuality(newQuality);
      onQualityChange?.(newQuality);
    },
    [onQualityChange]
  );

  return (
    <div className={`konivrer-battlefield ${className}`}>
      {/* 3D Arena Canvas */}
      <div ref={canvasRef} className="arena-canvas" />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-spinner" />
            <p>Loading KONIVRER Battlefield...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game UI Overlay */}
      <div className="game-ui-overlay">
        {/* Zone Layout */}
        {gameZones.map((zone) => (
          <motion.div
            key={zone.id}
            className={`game-zone zone-${zone.type} ${zone.isPlayerOwned ? 'player-owned' : 'shared'} ${
              hoveredZone === zone.id ? 'hovered' : ''
            } ${zone.isDropZone ? 'drop-zone' : ''}`}
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
              width: `${zone.position.width}%`,
              height: `${zone.position.height}%`,
            }}
            onHoverStart={() => handleZoneHover(zone.id)}
            onHoverEnd={() => handleZoneHover(null)}
            onDrop={() => handleCardDragEnd(zone.id)}
          >
            {/* Zone Label */}
            <div className="zone-label">
              {zone.name}
              {zone.cards.length > 0 && ` (${zone.cards.length}/${zone.maxCards})`}
            </div>

            {/* Zone Cards */}
            <div className="zone-cards">
              <AnimatePresence>
                {zone.cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className={`zone-card card-${card.cardType} ${card.isPlayable ? 'playable' : 'unplayable'}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      transform: `translateX(${index * (zone.type === 'hand' ? 15 : 10)}px)`,
                      zIndex: index + 1,
                    }}
                  >
                    <CardComponent
                      card={card}
                      isInZone={zone.type !== 'hand'}
                      onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                      onDragStart={zone.type === 'hand' ? () => handleCardDragStart(card) : undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        {/* Game Status HUD */}
        <div className="game-status-hud">
          {/* Player Stats */}
          <div className="player-stats">
            <div className="stat-group">
              <span className="stat-label">Health:</span>
              <span className="stat-value health">{gameState.playerHealth}</span>
            </div>
            <div className="stat-group">
              <span className="stat-label">Azoth:</span>
              <div className="azoth-crystals">
                {Array.from({ length: gameState.playerAzoth.max }).map((_, i) => (
                  <div
                    key={i}
                    className={`azoth-crystal ${i < gameState.playerAzoth.current ? 'full' : 'empty'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="turn-indicator">
            <div className={`turn-timer ${gameState.turnTimer < 15 ? 'urgent' : ''}`}>
              {gameState.turnTimer}s
            </div>
            <div className="current-turn">
              {gameState.currentTurn === 'player' ? 'Your Turn' : "Opponent's Turn"}
            </div>
            <motion.button
              className="end-turn-btn"
              onClick={handleEndTurn}
              disabled={gameState.currentTurn !== 'player'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              End Turn
            </motion.button>
          </div>

          {/* Opponent Stats */}
          <div className="opponent-stats">
            <div className="stat-group">
              <span className="stat-label">Health:</span>
              <span className="stat-value health">{gameState.opponentHealth}</span>
            </div>
            <div className="stat-group">
              <span className="stat-label">Azoth:</span>
              <div className="azoth-crystals">
                {Array.from({ length: gameState.opponentAzoth.max }).map((_, i) => (
                  <div
                    key={i}
                    className={`azoth-crystal ${i < gameState.opponentAzoth.current ? 'full' : 'empty'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme and Quality Controls */}
      <div className="battlefield-controls">
        <div className="theme-selector">
          <label>Theme:</label>
          <select value={currentTheme} onChange={(e) => handleThemeChange(e.target.value)}>
            <option value="konivrer">KONIVRER Mystical</option>
            <option value="forest">Forest Realm</option>
            <option value="desert">Desert Ruins</option>
            <option value="volcano">Volcanic Crater</option>
            <option value="cosmic">Cosmic Void</option>
          </select>
        </div>

        <div className="quality-selector">
          <label>Quality:</label>
          <select value={quality} onChange={(e) => handleQualityChange(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="ultra">Ultra</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Card Component
interface CardComponentProps {
  card: Card;
  isInZone?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isInZone = false,
  onClick,
  onDragStart,
}) => {
  return (
    <motion.div
      className={`konivrer-card ${card.rarity} ${card.cardType} ${isInZone ? 'in-zone' : 'in-hand'}`}
      onClick={onClick}
      drag={!!onDragStart}
      onDragStart={onDragStart}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)' }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="card-cost">{card.cost}</div>
      <div className="card-art">
        {card.image ? (
          <img src={card.image} alt={card.name} />
        ) : (
          <div className={`card-art-placeholder ${card.cardType}`} />
        )}
      </div>
      <div className="card-name">{card.name}</div>
      <div className="card-description">{card.description}</div>
      {card.cardType === 'familiar' && (
        <div className="card-stats">
          <span className="attack">{card.attack}</span>
          <span className="health">{card.health}</span>
        </div>
      )}
    </motion.div>
  );
};

export default KONIVRERBattlefield;