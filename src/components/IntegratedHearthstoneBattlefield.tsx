import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameEngine } from '../game/GameEngine';
import { EnhancedBattlefieldSystem } from './battlefield/EnhancedBattlefieldSystem';
import './battlefield/HearthstoneBattlefield.css';

interface Card {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  health?: number;
  description: string;
  cardType: 'minion' | 'spell' | 'weapon';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isPlayable?: boolean;
}

interface GameState {
  playerHealth: number;
  opponentHealth: number;
  playerMana: { current: number; max: number };
  opponentMana: { current: number; max: number };
  currentTurn: 'player' | 'opponent';
  turnTimer: number;
}

interface Props {
  onThemeChange?: (theme: string) => void;
  onQualityChange?: (quality: string) => void;
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
    description: 'Taunt. Restore 5 Health when played.',
    cardType: 'minion',
    rarity: 'rare',
    isPlayable: false,
  },
];

const IntegratedHearthstoneBattlefield: React.FC<Props> = ({
  onThemeChange,
  onQualityChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const battlefieldSystemRef = useRef<EnhancedBattlefieldSystem | null>(null);

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    playerHealth: 30,
    opponentHealth: 30,
    playerMana: { current: 4, max: 4 },
    opponentMana: { current: 3, max: 3 },
    currentTurn: 'player',
    turnTimer: 75,
  });

  // UI State
  const [playerHand, setPlayerHand] = useState<Card[]>(SAMPLE_CARDS);
  const [playerBattlefield, setPlayerBattlefield] = useState<Card[]>([]);
  const [opponentBattlefield, setOpponentBattlefield] = useState<Card[]>([
    { ...SAMPLE_CARDS[0], id: 'opp1', isPlayable: false },
    { ...SAMPLE_CARDS[2], id: 'opp2', isPlayable: false },
  ]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<string>('hearthstone');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>(
    'high',
  );

  // Interactive Props
  const [interactiveProps] = useState([
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
  ]);

  // Initialize 3D Arena and Battlefield System
  useEffect(() => {
    const initializeBattlefield = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);

        // Initialize the game engine
        await gameEngine.init(canvasRef.current);

        // Change arena theme to Hearthstone
        gameEngine.changeArenaTheme('hearthstone');
        gameEngine.updateArenaQuality(quality);

        // Get the 3D scene for battlefield system
        if (gameEngine.scene) {
          const battlefieldSystem = new EnhancedBattlefieldSystem(
            gameEngine.scene,
          );
          battlefieldSystemRef.current = battlefieldSystem;

          // Add initial cards to zones
          SAMPLE_CARDS.forEach(card => {
            battlefieldSystem.addCard(card.id, 'player-hand');
          });

          // Listen for battlefield actions
          document.addEventListener(
            'battlefieldAction',
            handleBattlefieldAction,
          );
        }

        setIsLoading(false);
        console.log(
          '[IntegratedBattlefield] Hearthstone battlefield initialized successfully',
        );
      } catch (error) {
        console.error(
          '[IntegratedBattlefield] Failed to initialize battlefield:',
          error,
        );
        setIsLoading(false);
      }
    };

    initializeBattlefield();

    return () => {
      document.removeEventListener(
        'battlefieldAction',
        handleBattlefieldAction,
      );

      if (battlefieldSystemRef.current) {
        battlefieldSystemRef.current.dispose();
        battlefieldSystemRef.current = null;
      }

      gameEngine.destroy();
    };
  }, [quality]);

  // Handle battlefield actions from 3D system
  const handleBattlefieldAction = useCallback((event: CustomEvent) => {
    const action = event.detail;
    console.log('[IntegratedBattlefield] Battlefield action:', action);

    switch (action.type) {
      case 'play_card':
        handleCardPlay(action.sourceId, action.data);
        break;
      case 'attack':
        handleCardAttack(action.sourceId, action.targetId);
        break;
      default:
        console.log('Unknown action:', action.type);
    }
  }, []);

  const handleCardPlay = useCallback(
    (cardId: string, actionData: any) => {
      const card = playerHand.find(c => c.id === cardId);
      if (
        !card ||
        !card.isPlayable ||
        gameState.playerMana.current < card.cost
      ) {
        console.log('Cannot play card:', cardId);
        return;
      }

      // Move card from hand to battlefield
      setPlayerHand(prev => prev.filter(c => c.id !== cardId));
      setPlayerBattlefield(prev => [...prev, card]);

      // Deduct mana
      setGameState(prev => ({
        ...prev,
        playerMana: {
          ...prev.playerMana,
          current: prev.playerMana.current - card.cost,
        },
      }));

      console.log(`Played ${card.name} for ${card.cost} mana`);
    },
    [playerHand, gameState.playerMana],
  );

  const handleCardAttack = useCallback(
    (attackerId: string, targetId?: string) => {
      console.log(`Card ${attackerId} attacks ${targetId || 'opponent hero'}`);
    },
    [],
  );

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (selectedCard === cardId) {
        setSelectedCard(null);
        return;
      }

      setSelectedCard(cardId);

      // Notify 3D battlefield system
      if (battlefieldSystemRef.current) {
        battlefieldSystemRef.current.selectCard(cardId);
      }
    },
    [selectedCard],
  );

  const handleEndTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTurn: prev.currentTurn === 'player' ? 'opponent' : 'player',
      turnTimer: 75,
    }));
  }, []);

  const handleThemeChange = useCallback(
    (theme: string) => {
      setCurrentTheme(theme);
      gameEngine.changeArenaTheme(theme as any);
      onThemeChange?.(theme);
    },
    [onThemeChange],
  );

  const handleQualityChange = useCallback(
    (newQuality: 'low' | 'medium' | 'high' | 'ultra') => {
      setQuality(newQuality);
      gameEngine.updateArenaQuality(newQuality);
      onQualityChange?.(newQuality);
    },
    [onQualityChange],
  );

  // Turn timer effect
  useEffect(() => {
    if (gameState.turnTimer > 0 && gameState.currentTurn === 'player') {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, turnTimer: prev.turnTimer - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.turnTimer, gameState.currentTurn]);

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
            <p>Loading Hearthstone Battlefield...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Props Overlay */}
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
          <div className="battlefield opponent-battlefield">
            <AnimatePresence>
              {opponentBattlefield.map((card, index) => (
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
          </div>
        </div>

        {/* Central Playmat */}
        <div className="central-playmat">
          <div className="battlefield-divider" />
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
          <div className="battlefield player-battlefield">
            <AnimatePresence>
              {playerBattlefield.map((card, index) => (
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
          </div>

          {/* Player Hand */}
          <div className="player-hand">
            <AnimatePresence>
              {playerHand.map((card, index) => (
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
                    x: index * 15 - playerHand.length * 7.5,
                  }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    y: -10,
                    rotateZ: 0,
                    scale: 1.05,
                    zIndex: 10,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                >
                  <CardComponent card={card} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isOpponent = false,
}) => (
  <motion.div
    className={`game-card ${card.rarity} ${card.cardType} ${isOpponent ? 'opponent' : 'player'}`}
    whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="card-cost">{card.cost}</div>
    <div className="card-art">
      <div className={`card-art-placeholder ${card.cardType}`} />
    </div>
    <div className="card-name">{card.name}</div>
    <div className="card-description">{card.description}</div>
    {card.cardType === 'minion' && (
      <div className="card-stats">
        <span className="attack">{card.attack}</span>
        <span className="health">{card.health}</span>
      </div>
    )}
  </motion.div>
);

export default IntegratedHearthstoneBattlefield;
