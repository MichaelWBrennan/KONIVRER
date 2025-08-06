import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../data/cards';
import { gameEngine } from '../game/GameEngine';

// Enhanced MTG Arena-style card interface with 3D background
interface MTGCard extends Card {
  gameId: string;
  zone: 'hand' | 'battlefield' | 'graveyard' | 'library' | 'exile' | 'stack';
  owner: 'player' | 'opponent';
  power?: number;
  toughness?: number;
  manaCost: number;
  cardTypes: string[];
  isTapped?: boolean;
  isSelected?: boolean;
  canPlay?: boolean;
}

// Game state interface
interface GameState {
  player: {
    life: number;
    mana: {
      white: number;
      blue: number;
      black: number;
      red: number;
      green: number;
      colorless: number;
    };
    hand: MTGCard[];
    battlefield: MTGCard[];
    graveyard: MTGCard[];
    library: MTGCard[];
  };
  opponent: {
    life: number;
    mana: {
      white: number;
      blue: number;
      black: number;
      red: number;
      green: number;
      colorless: number;
    };
    hand: MTGCard[];
    battlefield: MTGCard[];
    graveyard: MTGCard[];
    library: MTGCard[];
  };
  turn: number;
  phase:
    | 'untap'
    | 'upkeep'
    | 'draw'
    | 'main1'
    | 'combat'
    | 'main2'
    | 'end'
    | 'cleanup';
  activePlayer: 'player' | 'opponent';
  priority: 'player' | 'opponent';
}

interface Enhanced3DArenaGameProps {
  onGameEnd?: (winner: 'player' | 'opponent') => void;
  gameMode?: 'casual' | 'ranked' | 'tournament';
  enableSpectator?: boolean;
}

const Enhanced3DArenaGame: React.FC<Enhanced3DArenaGameProps> = ({
  onGameEnd,
  gameMode = 'casual',
  enableSpectator = false,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [arenaTheme, setArenaTheme] = useState<
    'mystical' | 'ancient' | 'ethereal' | 'cosmic'
  >('mystical');
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [selectedCard, setSelectedCard] = useState<MTGCard | null>(null);
  const [hoveredCard, setHoveredCard] = useState<MTGCard | null>(null);

  // Initialize 3D arena
  useEffect(() => {
    if (canvasRef.current && is3DEnabled && !gameInitialized) {
      console.log('[Enhanced3DArenaGame] Initializing 3D arena...');

      const initializeArena = async () => {
        try {
          await gameEngine.init(canvasRef.current!);
          setGameInitialized(true);
          console.log(
            '[Enhanced3DArenaGame] 3D arena initialized successfully',
          );
        } catch (error) {
          console.warn(
            '[Enhanced3DArenaGame] Failed to initialize 3D arena:',
            error,
          );
          setIs3DEnabled(false);
        }
      };

      initializeArena();
    }

    return () => {
      if (gameInitialized && is3DEnabled) {
        gameEngine.destroy();
        setGameInitialized(false);
      }
    };
  }, [is3DEnabled, gameInitialized]);

  // Convert KONIVRER_CARDS to MTGCard format
  const convertToMTGCard = (
    card: Card,
    owner: 'player' | 'opponent',
    zone: MTGCard['zone'],
  ): MTGCard => {
    return {
      ...card,
      gameId: `${card.id}_${owner}_${Math.random().toString(36).substr(2, 9)}`,
      zone,
      owner,
      power: card.strength || Math.floor(Math.random() * 6) + 1,
      toughness: Math.floor(Math.random() * 6) + 1,
      manaCost: card.cost,
      cardTypes: ['Creature'],
      isTapped: false,
      isSelected: false,
      canPlay: owner === 'player',
    };
  };

  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(() => {
    const playerHand = KONIVRER_CARDS.slice(0, 7).map(card =>
      convertToMTGCard(card, 'player', 'hand'),
    );
    const opponentHand = KONIVRER_CARDS.slice(7, 14).map(card =>
      convertToMTGCard(card, 'opponent', 'hand'),
    );

    return {
      player: {
        life: 20,
        mana: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 1 },
        hand: playerHand,
        battlefield: [],
        graveyard: [],
        library: KONIVRER_CARDS.slice(14).map(card =>
          convertToMTGCard(card, 'player', 'library'),
        ),
      },
      opponent: {
        life: 20,
        mana: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 1 },
        hand: opponentHand,
        battlefield: [],
        graveyard: [],
        library: KONIVRER_CARDS.slice(21).map(card =>
          convertToMTGCard(card, 'opponent', 'library'),
        ),
      },
      turn: 1,
      phase: 'main1',
      activePlayer: 'player',
      priority: 'player',
    };
  });

  // Theme change handler
  const handleThemeChange = (newTheme: typeof arenaTheme) => {
    setArenaTheme(newTheme);
    if (gameInitialized && is3DEnabled) {
      gameEngine.changeArenaTheme(newTheme);
    }
  };

  // Toggle 3D arena
  const toggle3DArena = () => {
    if (is3DEnabled && gameInitialized) {
      gameEngine.destroy();
      setGameInitialized(false);
    }
    setIs3DEnabled(!is3DEnabled);
  };

  // Card interaction handlers
  const handleCardClick = (card: MTGCard) => {
    if (card.owner === 'player' && card.canPlay) {
      setSelectedCard(card === selectedCard ? null : card);
    }
  };

  const handleCardHover = (card: MTGCard | null) => {
    setHoveredCard(card);
  };

  // Next phase handler
  const handleNextPhase = () => {
    setGameState(prev => {
      const phases = [
        'untap',
        'upkeep',
        'draw',
        'main1',
        'combat',
        'main2',
        'end',
        'cleanup',
      ] as const;
      const currentIndex = phases.indexOf(prev.phase);
      const nextIndex = (currentIndex + 1) % phases.length;

      if (nextIndex === 0) {
        // New turn
        return {
          ...prev,
          turn: prev.turn + 1,
          phase: phases[nextIndex],
          activePlayer: prev.activePlayer === 'player' ? 'opponent' : 'player',
        };
      }

      return {
        ...prev,
        phase: phases[nextIndex],
      };
    });
  };

  // Card component
  const CardComponent: React.FC<{
    card: MTGCard;
    isHovered?: boolean;
    isSelected?: boolean;
  }> = ({ card, isHovered = false, isSelected = false }) => (
    <motion.div
      className={`konivrer-card ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      whileHover={{ scale: 1.05, z: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleCardClick(card)}
      onMouseEnter={() => handleCardHover(card)}
      onMouseLeave={() => handleCardHover(null)}
      layout
    >
      <div className="card-header">
        <div className="card-name">{card.name}</div>
        <div className="card-cost">{card.manaCost}</div>
      </div>
      <div className="card-type">{card.cardTypes.join(' ')}</div>
      <div className="card-power-toughness">
        {card.power}/{card.toughness}
      </div>
      <div className="card-description">{card.description}</div>
    </motion.div>
  );

  return (
    <div
      className="enhanced-3d-arena-game"
      style={{ position: 'relative', width: '100%', height: '100vh' }}
    >
      {/* 3D Arena Background */}
      {is3DEnabled && (
        <div
          ref={canvasRef}
          className="arena-3d-background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none', // Allow UI interactions to pass through
          }}
        />
      )}

      {/* Game Controls Overlay */}
      <div
        className="game-controls"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 100,
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '8px',
          color: 'white',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={is3DEnabled}
              onChange={toggle3DArena}
              style={{ marginRight: '5px' }}
            />
            Enable 3D Arena
          </label>
        </div>

        {is3DEnabled && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Arena Theme:
            </label>
            <select
              value={arenaTheme}
              onChange={e =>
                handleThemeChange(e.target.value as typeof arenaTheme)
              }
              style={{ width: '100%', padding: '5px', borderRadius: '4px' }}
            >
              <option value="mystical">Mystical</option>
              <option value="ancient">Ancient</option>
              <option value="ethereal">Ethereal</option>
              <option value="cosmic">Cosmic</option>
            </select>
          </div>
        )}
      </div>

      {/* Game UI Overlay */}
      <div
        className="game-ui-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: 'none', // Only allow specific elements to receive interactions
        }}
      >
        {/* Opponent's area */}
        <div
          className="opponent-area"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            pointerEvents: 'auto',
          }}
        >
          <div
            className="opponent-stats"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              background: 'rgba(139, 0, 0, 0.8)',
              padding: '10px',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            <div>❤️ {gameState.opponent.life}</div>
            <div>🃏 {gameState.opponent.hand.length}</div>
            <div>📚 {gameState.opponent.library.length}</div>
          </div>

          <div
            className="opponent-battlefield"
            style={{
              minHeight: '100px',
              background: 'rgba(139, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <div style={{ color: 'white', marginBottom: '10px' }}>
              OPPONENT-BATTLEFIELD
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {gameState.opponent.battlefield.map(card => (
                <CardComponent key={card.gameId} card={card} />
              ))}
            </div>
          </div>

          <div
            className="opponent-hand"
            style={{
              background: 'rgba(139, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            <div style={{ color: 'white', marginBottom: '10px' }}>
              OPPONENT-HAND
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {gameState.opponent.hand.map(card => (
                <CardComponent key={card.gameId} card={card} />
              ))}
            </div>
          </div>
        </div>

        {/* Turn indicator */}
        <div
          className="turn-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 139, 0.9)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            🔵{' '}
            {gameState.activePlayer === 'player'
              ? 'Your Turn'
              : 'Opponent Turn'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            Phase: {gameState.phase.toUpperCase()}
          </div>
          <button
            onClick={handleNextPhase}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Next Phase
          </button>
        </div>

        {/* Player's area */}
        <div
          className="player-area"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            pointerEvents: 'auto',
          }}
        >
          <div
            className="player-hand"
            style={{
              background: 'rgba(0, 139, 0, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <div style={{ color: 'white', marginBottom: '10px' }}>
              PLAYER-HAND
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {gameState.player.hand.map(card => (
                <CardComponent
                  key={card.gameId}
                  card={card}
                  isSelected={selectedCard?.gameId === card.gameId}
                  isHovered={hoveredCard?.gameId === card.gameId}
                />
              ))}
            </div>
          </div>

          <div
            className="player-battlefield"
            style={{
              minHeight: '100px',
              background: 'rgba(0, 139, 0, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <div style={{ color: 'white', marginBottom: '10px' }}>
              BATTLEFIELD
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {gameState.player.battlefield.map(card => (
                <CardComponent key={card.gameId} card={card} />
              ))}
            </div>
          </div>

          <div
            className="player-stats"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: 'rgba(0, 139, 0, 0.8)',
              padding: '10px',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            <div>❤️ {gameState.player.life}</div>
            <div>
              ⚡{' '}
              {Object.values(gameState.player.mana).reduce((a, b) => a + b, 0)}
            </div>
            <div>📚 {gameState.player.library.length}</div>
          </div>
        </div>

        {/* Side areas */}
        <div
          className="side-areas"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'auto',
          }}
        >
          <div
            className="graveyard"
            style={{
              background: 'rgba(100, 100, 100, 0.8)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              color: 'white',
              minWidth: '100px',
              textAlign: 'center',
            }}
          >
            <div>GRAVEYARD</div>
            <div>
              {gameState.player.graveyard.length +
                gameState.opponent.graveyard.length}
            </div>
          </div>

          <div
            className="exile"
            style={{
              background: 'rgba(100, 100, 100, 0.8)',
              padding: '10px',
              borderRadius: '8px',
              color: 'white',
              minWidth: '100px',
              textAlign: 'center',
            }}
          >
            <div>EXILE</div>
            <div>0</div>
          </div>
        </div>
      </div>

      {/* Card preview for hovered card */}
      {hoveredCard && (
        <div
          className="card-preview"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 200,
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '15px',
            borderRadius: '8px',
            color: 'white',
            maxWidth: '300px',
            pointerEvents: 'none',
          }}
        >
          <h3>{hoveredCard.name}</h3>
          <p>
            <strong>Cost:</strong> {hoveredCard.manaCost}
          </p>
          <p>
            <strong>Type:</strong> {hoveredCard.cardTypes.join(' ')}
          </p>
          <p>
            <strong>Power/Toughness:</strong> {hoveredCard.power}/
            {hoveredCard.toughness}
          </p>
          <p>{hoveredCard.description}</p>
        </div>
      )}
    </div>
  );
};

export default Enhanced3DArenaGame;
