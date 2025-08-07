import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { GameEngine } from '../../game/GameEngine';
import { MysticalArena, ArenaConfig } from '../../game/3d/MysticalArena';
import './HearthstoneBattlefield.css';

interface Card {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  health?: number;
  description: string;
  cardType: 'minion' | 'spell' | 'weapon';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image?: string;
  isPlayable?: boolean;
  canAttack?: boolean;
  hasShield?: boolean;
  isTaunted?: boolean;
  position?: { x: number; y: number };
}

interface PlayerZone {
  id: string;
  name: string;
  cards: Card[];
  maxCards: number;
  type: 'hand' | 'battlefield' | 'deck' | 'discard';
  isPlayerOwned: boolean;
}

interface GameState {
  playerHealth: number;
  opponentHealth: number;
  playerMana: { current: number; max: number };
  opponentMana: { current: number; max: number };
  currentTurn: 'player' | 'opponent';
  turnPhase: 'start' | 'main' | 'end';
  turnTimer: number;
}

interface HearthstoneBattlefieldProps {
  onGameStateChange?: (state: GameState) => void;
  onThemeChange?: (theme: string) => void;
  onQualityChange?: (quality: string) => void;
  enableInteractiveElements?: boolean;
  className?: string;
}

const SAMPLE_CARDS: Card[] = [
  {
    id: '1',
    name: 'Fire Elemental',
    cost: 4,
    attack: 4,
    health: 3,
    description: 'Battlecry: Deal 3 damage to any target.',
    cardType: 'minion',
    rarity: 'common',
    isPlayable: true,
  },
  {
    id: '2',
    name: 'Lightning Bolt',
    cost: 1,
    description: 'Deal 3 damage to any target.',
    cardType: 'spell',
    rarity: 'common',
    isPlayable: true,
  },
  {
    id: '3',
    name: 'Ancient Guardian',
    cost: 6,
    attack: 5,
    health: 8,
    description: 'Taunt. When played, restore 5 Health to your hero.',
    cardType: 'minion',
    rarity: 'rare',
    isTaunted: true,
    isPlayable: false,
  },
  {
    id: '4',
    name: 'Frost Bolt',
    cost: 2,
    description: 'Deal 3 damage and Freeze target.',
    cardType: 'spell',
    rarity: 'common',
    isPlayable: true,
  },
  {
    id: '5',
    name: 'Silver Hand Recruit',
    cost: 1,
    attack: 1,
    health: 1,
    description: 'A brave recruit of the Silver Hand.',
    cardType: 'minion',
    rarity: 'common',
    isPlayable: true,
  },
];

const HearthstoneBattlefield: React.FC<HearthstoneBattlefieldProps> = ({
  onGameStateChange,
  onThemeChange,
  onQualityChange,
  enableInteractiveElements = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const arenaRef = useRef<MysticalArena | null>(null);
  const dragControls = useDragControls();

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    playerHealth: 30,
    opponentHealth: 30,
    playerMana: { current: 4, max: 4 },
    opponentMana: { current: 3, max: 3 },
    currentTurn: 'player',
    turnPhase: 'main',
    turnTimer: 75,
  });

  // Player Zones
  const [playerZones, setPlayerZones] = useState<PlayerZone[]>([
    {
      id: 'player-hand',
      name: 'Hand',
      cards: [...SAMPLE_CARDS],
      maxCards: 10,
      type: 'hand',
      isPlayerOwned: true,
    },
    {
      id: 'player-battlefield',
      name: 'Battlefield',
      cards: [],
      maxCards: 7,
      type: 'battlefield',
      isPlayerOwned: true,
    },
    {
      id: 'opponent-battlefield',
      name: 'Opponent Battlefield',
      cards: [
        { ...SAMPLE_CARDS[0], id: 'opp1', isPlayable: false },
        { ...SAMPLE_CARDS[2], id: 'opp2', isPlayable: false },
      ],
      maxCards: 7,
      type: 'battlefield',
      isPlayerOwned: false,
    },
  ]);

  // UI State
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<string>('hearthstone');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>(
    'high',
  );

  // Interactive Elements
  const [interactiveProps, setInteractiveProps] = useState([
    {
      id: 'torch-left',
      name: 'Flickering Torch',
      active: true,
      x: 15,
      y: 25,
      animation: 'flicker',
      onClick: () => console.log('Left torch clicked!'),
    },
    {
      id: 'torch-right',
      name: 'Flickering Torch',
      active: true,
      x: 85,
      y: 25,
      animation: 'flicker',
      onClick: () => console.log('Right torch clicked!'),
    },
    {
      id: 'water-wheel',
      name: 'Water Wheel',
      active: true,
      x: 50,
      y: 75,
      animation: 'rotate',
      onClick: () => console.log('Water wheel activated!'),
    },
    {
      id: 'crystal-left',
      name: 'Mystical Crystal',
      active: false,
      x: 25,
      y: 50,
      animation: 'pulse',
      onClick: () => activateCrystal('crystal-left'),
    },
    {
      id: 'crystal-right',
      name: 'Mystical Crystal',
      active: false,
      x: 75,
      y: 50,
      animation: 'pulse',
      onClick: () => activateCrystal('crystal-right'),
    },
  ]);

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

        // Configure arena for Hearthstone theme
        const arenaConfig: ArenaConfig = {
          theme: 'hearthstone',
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
        console.log('[HearthstoneBattlefield] Arena initialized successfully');
      } catch (error) {
        console.error(
          '[HearthstoneBattlefield] Failed to initialize arena:',
          error,
        );
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

  // Crystal activation handler
  const activateCrystal = useCallback(
    (crystalId: string) => {
      setInteractiveProps(prev =>
        prev.map(prop =>
          prop.id === crystalId ? { ...prop, active: !prop.active } : prop,
        ),
      );
      console.log(
        `Crystal ${crystalId} ${interactiveProps.find(p => p.id === crystalId)?.active ? 'deactivated' : 'activated'}!`,
      );
    },
    [interactiveProps],
  );

  // Card drag handlers
  const handleCardDragStart = useCallback((card: Card) => {
    setDraggedCard(card);
    setSelectedCard(card.id);
  }, []);

  const handleCardDragEnd = useCallback(
    (targetZone: string) => {
      if (!draggedCard) return;

      // Handle card play logic
      if (targetZone === 'player-battlefield' && draggedCard.isPlayable) {
        // Move card from hand to battlefield
        setPlayerZones(prev =>
          prev.map(zone => {
            if (zone.id === 'player-hand') {
              return {
                ...zone,
                cards: zone.cards.filter(c => c.id !== draggedCard.id),
              };
            }
            if (zone.id === 'player-battlefield') {
              return {
                ...zone,
                cards: [...zone.cards, draggedCard],
              };
            }
            return zone;
          }),
        );

        // Deduct mana cost
        setGameState(prev => ({
          ...prev,
          playerMana: {
            ...prev.playerMana,
            current: Math.max(0, prev.playerMana.current - draggedCard.cost),
          },
        }));

        console.log(`Played ${draggedCard.name} for ${draggedCard.cost} mana`);
      }

      setDraggedCard(null);
      setSelectedCard(null);
    },
    [draggedCard],
  );

  const handleZoneHover = useCallback((zoneId: string | null) => {
    setHoveredZone(zoneId);
  }, []);

  const handleEndTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTurn: prev.currentTurn === 'player' ? 'opponent' : 'player',
      turnTimer: 75,
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
    [onQualityChange],
  );

  return (
    <div className={`hearthstone-battlefield ${className}`}>
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
            <p>Loading Battlefield...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Props Overlay */}
      {enableInteractiveElements && (
        <div className="interactive-props-overlay">
          {interactiveProps.map(prop => (
            <motion.div
              key={prop.id}
              className={`interactive-prop ${prop.animation} ${prop.active ? 'active' : ''}`}
              style={{ left: `${prop.x}%`, top: `${prop.y}%` }}
              onClick={prop.onClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: prop.animation === 'rotate' ? 360 : 0,
                scale: prop.animation === 'pulse' ? [1, 1.2, 1] : 1,
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity },
              }}
              title={prop.name}
            >
              <div className={`prop-icon prop-${prop.id}`} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Game UI Overlay */}
      <div className="game-ui-overlay">
        {/* Opponent Area */}
        <div className="opponent-area">
          <div className="opponent-hero">
            <div className="hero-portrait">
              <div className="health-indicator">{gameState.opponentHealth}</div>
            </div>
            <div className="mana-crystals">
              {Array.from({ length: gameState.opponentMana.max }).map(
                (_, i) => (
                  <div
                    key={i}
                    className={`mana-crystal ${i < gameState.opponentMana.current ? 'full' : 'empty'}`}
                  />
                ),
              )}
            </div>
          </div>

          {/* Opponent Battlefield */}
          <motion.div
            className="battlefield opponent-battlefield"
            onHoverStart={() => handleZoneHover('opponent-battlefield')}
            onHoverEnd={() => handleZoneHover(null)}
          >
            <AnimatePresence>
              {playerZones
                .find(z => z.id === 'opponent-battlefield')
                ?.cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className="battlefield-card opponent-card"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ left: `${index * 120 + 20}px` }}
                  >
                    <CardComponent card={card} isOpponent />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Central Playmat Area */}
        <div className="central-playmat">
          <div className="battlefield-divider" />

          {/* Turn Indicator */}
          <div className="turn-indicator">
            <div
              className={`turn-timer ${gameState.turnTimer < 15 ? 'urgent' : ''}`}
            >
              {gameState.turnTimer}s
            </div>
            <div className="current-turn">
              {gameState.currentTurn === 'player'
                ? 'Your Turn'
                : "Opponent's Turn"}
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
        </div>

        {/* Player Area */}
        <div className="player-area">
          {/* Player Battlefield */}
          <motion.div
            className={`battlefield player-battlefield ${hoveredZone === 'player-battlefield' ? 'hovered' : ''}`}
            onHoverStart={() => handleZoneHover('player-battlefield')}
            onHoverEnd={() => handleZoneHover(null)}
            onDrop={() => handleCardDragEnd('player-battlefield')}
          >
            <AnimatePresence>
              {playerZones
                .find(z => z.id === 'player-battlefield')
                ?.cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className="battlefield-card player-card"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ left: `${index * 120 + 20}px` }}
                  >
                    <CardComponent card={card} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* Player Hand */}
          <motion.div className="player-hand">
            <AnimatePresence>
              {playerZones
                .find(z => z.id === 'player-hand')
                ?.cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className={`hand-card ${selectedCard === card.id ? 'selected' : ''} ${!card.isPlayable ? 'unplayable' : ''}`}
                    initial={{
                      y: 100,
                      opacity: 0,
                      rotateZ: Math.random() * 10 - 5,
                    }}
                    animate={{
                      y: selectedCard === card.id ? -20 : 0,
                      opacity: 1,
                      rotateZ: index * 3 - 9,
                      x:
                        index * 15 -
                        (playerZones.find(z => z.id === 'player-hand')?.cards
                          .length || 1) *
                          7.5,
                    }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    drag={card.isPlayable}
                    dragControls={dragControls}
                    onDragStart={() => handleCardDragStart(card)}
                    onDragEnd={(_, info) => {
                      if (info.point.y < -50) {
                        handleCardDragEnd('player-battlefield');
                      }
                    }}
                    whileHover={{
                      y: -10,
                      rotateZ: 0,
                      scale: 1.05,
                      zIndex: 10,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CardComponent
                      card={card}
                      onClick={() =>
                        setSelectedCard(
                          selectedCard === card.id ? null : card.id,
                        )
                      }
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* Player Hero */}
          <div className="player-hero">
            <div className="hero-portrait">
              <div className="health-indicator">{gameState.playerHealth}</div>
            </div>
            <div className="mana-crystals">
              {Array.from({ length: gameState.playerMana.max }).map((_, i) => (
                <div
                  key={i}
                  className={`mana-crystal ${i < gameState.playerMana.current ? 'full' : 'empty'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Theme and Quality Controls */}
      <div className="battlefield-controls">
        <div className="theme-selector">
          <label>Theme:</label>
          <select
            value={currentTheme}
            onChange={e => handleThemeChange(e.target.value)}
          >
            <option value="hearthstone">Hearthstone Tavern</option>
            <option value="forest">Jungle Map</option>
            <option value="desert">Desert Map</option>
            <option value="volcano">Volcano Map</option>
            <option value="mystical">Mystical Map</option>
            <option value="cosmic">Cosmic Map</option>
          </select>
        </div>

        <div className="quality-selector">
          <label>Quality:</label>
          <select
            value={quality}
            onChange={e => handleQualityChange(e.target.value as any)}
          >
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
  isOpponent?: boolean;
  onClick?: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isOpponent = false,
  onClick,
}) => {
  return (
    <motion.div
      className={`game-card ${card.rarity} ${card.cardType} ${isOpponent ? 'opponent' : 'player'}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}
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
      {card.cardType === 'minion' && (
        <div className="card-stats">
          <span className="attack">{card.attack}</span>
          <span className="health">{card.health}</span>
        </div>
      )}
      {card.isTaunted && <div className="taunt-indicator">🛡️</div>}
      {card.hasShield && <div className="shield-indicator">✨</div>}
    </motion.div>
  );
};

export default HearthstoneBattlefield;
