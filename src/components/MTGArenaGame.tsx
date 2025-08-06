import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../data/cards';
import { audioManager } from '../game/GameEngine';

// MTG Arena-style card interface
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
  turn: 'player' | 'opponent';
  phase: 'untap' | 'upkeep' | 'draw' | 'main1' | 'combat' | 'main2' | 'end';
  stack: MTGCard[];
  revealedOpponentCards: string[]; // gameIds of opponent cards that are revealed by effects
}

const MTGArenaGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [selectedCard, setSelectedCard] = useState<MTGCard | null>(null);
  const [draggedCard, setDraggedCard] = useState<MTGCard | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  function initializeGame(): GameState {
    // Convert KONIVRER cards to MTG-style cards
    const convertCard = (
      card: Card,
      owner: 'player' | 'opponent',
      zone: MTGCard['zone'],
    ): MTGCard => ({
      ...card,
      gameId: `${card.id}-${owner}-${Math.random()}`,
      zone,
      owner,
      manaCost: card.cost,
      cardTypes: card.type === 'Familiar' ? ['Creature'] : ['Enchantment'],
      power:
        card.type === 'Familiar'
          ? Math.floor(Math.random() * 5) + 1
          : undefined,
      toughness:
        card.type === 'Familiar'
          ? Math.floor(Math.random() * 5) + 1
          : undefined,
      isTapped: false,
      isSelected: false,
      canPlay: false,
    });

    // Create starting hands and libraries
    const allCards = [...KONIVRER_CARDS];
    const playerLibrary = allCards
      .slice(0, 30)
      .map(card => convertCard(card, 'player', 'library'));
    const opponentLibrary = allCards
      .slice(0, 30)
      .map(card => convertCard(card, 'opponent', 'library'));

    // Draw starting hands
    const playerHand = playerLibrary
      .splice(0, 7)
      .map(card => ({ ...card, zone: 'hand' as const }));
    const opponentHand = opponentLibrary
      .splice(0, 7)
      .map(card => ({ ...card, zone: 'hand' as const }));

    return {
      player: {
        life: 20,
        mana: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 1 },
        hand: playerHand,
        battlefield: [],
        graveyard: [],
        library: playerLibrary,
      },
      opponent: {
        life: 20,
        mana: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 1 },
        hand: opponentHand,
        battlefield: [],
        graveyard: [],
        library: opponentLibrary,
      },
      turn: 'player',
      phase: 'main1',
      stack: [],
      revealedOpponentCards: [], // No opponent cards are revealed by default
    };
  }

  const handleCardClick = (card: MTGCard) => {
    if (card.owner !== gameState.turn) return;

    // Play card selection audio
    audioManager.playCardHover();

    setSelectedCard(selectedCard?.gameId === card.gameId ? null : card);
  };

  const handleCardDragStart = (card: MTGCard) => {
    if (card.owner !== gameState.turn) return;

    // Play card pickup audio
    audioManager.playCardFlip();

    setDraggedCard(card);
  };

  const handleCardDragEnd = () => {
    setDraggedCard(null);
    setHoveredZone(null);
  };

  const handleZoneDropOver = (e: React.DragEvent, zoneName: string) => {
    e.preventDefault();
    setHoveredZone(zoneName);
  };

  const handleZoneDrop = (e: React.DragEvent, targetZone: MTGCard['zone']) => {
    e.preventDefault();
    if (!draggedCard) return;

    // Simple card play logic - can be expanded
    if (targetZone === 'battlefield' && draggedCard.zone === 'hand') {
      // Play card placement audio
      audioManager.playCardPlay();

      setGameState(prev => {
        const newState = { ...prev };
        const currentPlayer = newState[gameState.turn];

        // Remove from hand
        currentPlayer.hand = currentPlayer.hand.filter(
          c => c.gameId !== draggedCard.gameId,
        );

        // Add to battlefield
        const playedCard = { ...draggedCard, zone: 'battlefield' as const };
        currentPlayer.battlefield.push(playedCard);

        return newState;
      });
    }

    setHoveredZone(null);
  };

  // Function to reveal opponent cards (for testing card effects)
  const toggleRevealOpponentHand = () => {
    setGameState(prev => ({
      ...prev,
      revealedOpponentCards:
        prev.revealedOpponentCards.length === 0
          ? prev.opponent.hand.map(card => card.gameId) // Reveal all
          : [], // Hide all
    }));
  };

  const nextPhase = () => {
    // Play phase transition audio
    audioManager.playCardFlip();

    const phases: GameState['phase'][] = [
      'untap',
      'upkeep',
      'draw',
      'main1',
      'combat',
      'main2',
      'end',
    ];
    const currentIndex = phases.indexOf(gameState.phase);
    const nextPhaseIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    setGameState(prev => {
      const newState = { ...prev, phase: nextPhase };

      // Handle phase changes
      if (nextPhase === 'untap' && prev.phase === 'end') {
        // Switch turns - play turn transition audio
        audioManager.playManaTap('colorless');

        newState.turn = prev.turn === 'player' ? 'opponent' : 'player';

        // Untap all permanents
        const currentPlayer = newState[newState.turn];
        currentPlayer.battlefield = currentPlayer.battlefield.map(card => ({
          ...card,
          isTapped: false,
        }));
      }

      if (nextPhase === 'draw') {
        // Draw a card - play draw audio
        audioManager.playCardDraw();

        const currentPlayer = newState[newState.turn];
        if (currentPlayer.library.length > 0) {
          const drawnCard = currentPlayer.library.shift()!;
          currentPlayer.hand.push({ ...drawnCard, zone: 'hand' });
        }
      }

      return newState;
    });
  };

  // Card Back Component for hidden cards
  const CardBack: React.FC<{
    style?: React.CSSProperties;
  }> = ({ style }) => (
    <motion.div
      style={style}
      className="card mtg-card card-back opponent hand"
      whileHover={{
        scale: 1.05,
        rotateX: -5,
        translateZ: 30,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="card-back-content">
        <div className="card-back-pattern">
          <div className="konivrer-logo">⭐</div>
          <div className="card-back-title">KONIVRER</div>
          <div className="card-back-subtitle">Trading Card Game</div>
          <div className="card-back-design">
            <div className="pattern-line"></div>
            <div className="pattern-line"></div>
            <div className="pattern-line"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const CardComponent: React.FC<{
    card: MTGCard;
    style?: React.CSSProperties;
    index?: number;
  }> = ({ card, style, index = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate 3D positioning based on card index and zone
    const get3DStyle = (): React.CSSProperties => {
      const baseStyle = { ...style };

      if (card.zone === 'hand') {
        // Hand cards fan out with perspective
        const fanAngle = (index - 3) * 3; // Fan from -9 to +9 degrees
        const fanOffset = Math.abs(index - 3) * 2; // Slight curve
        return {
          ...baseStyle,
          transform: `translateX(${index * 60}px) rotateY(${fanAngle}deg) translateZ(${fanOffset}px)`,
          transformOrigin:
            card.owner === 'player' ? 'center bottom' : 'center top',
        };
      }

      if (card.zone === 'battlefield') {
        // Battlefield cards have depth variation
        const depthOffset = (index % 3) * 5 + 5;
        const rotationY = index % 2 === 0 ? 1 : -1;
        return {
          ...baseStyle,
          transform: `translateZ(${depthOffset}px) rotateY(${rotationY}deg)`,
        };
      }

      return baseStyle;
    };

    // Check if this opponent hand card should be hidden
    const shouldShowCardBack =
      card.owner === 'opponent' &&
      card.zone === 'hand' &&
      !gameState.revealedOpponentCards.includes(card.gameId);

    // If card should be hidden, show card back
    if (shouldShowCardBack) {
      return <CardBack style={get3DStyle()} />;
    }

    return (
      <motion.div
        style={get3DStyle()}
        className={`
          card mtg-card ${card.owner} ${card.zone} 
          ${card.isSelected ? 'selected' : ''} 
          ${card.isTapped ? 'tapped' : ''}
          ${card.canPlay ? 'playable' : ''}
          ${isHovered ? 'hovered' : ''}
        `}
        onClick={() => handleCardClick(card)}
        onMouseEnter={() => {
          setIsHovered(true);
          // Play subtle hover audio
          audioManager.playCardHover();
        }}
        onMouseLeave={() => setIsHovered(false)}
        draggable
        onDragStart={() => handleCardDragStart(card)}
        onDragEnd={handleCardDragEnd}
        whileHover={{
          scale: card.zone === 'hand' ? 1.1 : 1.05,
          rotateX: card.owner === 'player' ? 10 : -5,
          translateZ: 30,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.95 }}
        layout
        initial={{ rotateY: 0, translateZ: 0 }}
        animate={{
          rotateY: card.zone === 'hand' ? (index - 3) * 3 : 0,
          translateZ: card.zone === 'battlefield' ? (index % 3) * 5 + 5 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-content">
          <div className="card-header">
            <span className="card-name">{card.name}</span>
            <span className="mana-cost">{card.manaCost}</span>
          </div>
          <div className="card-types">{card.cardTypes.join(' ')}</div>
          {card.power !== undefined && card.toughness !== undefined && (
            <div className="power-toughness">
              {card.power}/{card.toughness}
            </div>
          )}
          <div className="card-description">{card.description}</div>
        </div>
      </motion.div>
    );
  };

  const ZoneComponent: React.FC<{
    zoneName: string;
    cards: MTGCard[];
    className?: string;
    style?: React.CSSProperties;
  }> = ({ zoneName, cards, className = '', style }) => (
    <motion.div
      className={`zone ${zoneName} ${className} ${hoveredZone === zoneName ? 'drop-target' : ''}`}
      style={style}
      onDragOver={e => handleZoneDropOver(e, zoneName)}
      onDrop={e => handleZoneDrop(e, zoneName as MTGCard['zone'])}
      initial={{ rotateX: 0, translateZ: 0 }}
      animate={{
        rotateX: zoneName.includes('battlefield') ? 2 : 0,
        translateZ: zoneName.includes('battlefield') ? 10 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="zone-label">{zoneName.toUpperCase()}</div>
      <div className="zone-cards">
        <AnimatePresence>
          {cards.map((card, index) => (
            <CardComponent
              key={card.gameId}
              card={card}
              index={index}
              style={{
                zIndex: index + 1,
                // Remove the old transform style as it's now handled by CardComponent
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className="mtg-arena-game">
      {/* Opponent Area - Enhanced 3D */}
      <motion.div
        className="opponent-area"
        initial={{ rotateX: 0, translateZ: 0, scale: 1 }}
        animate={{ rotateX: 20, translateZ: -100, scale: 0.85 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="player-info opponent">
          <div className="life-counter">❤️ {gameState.opponent.life}</div>
          <div className="hand-count">🃏 {gameState.opponent.hand.length}</div>
          <div className="library-count">
            📚 {gameState.opponent.library.length}
          </div>
        </div>
        <ZoneComponent
          zoneName="opponent-battlefield"
          cards={gameState.opponent.battlefield}
          className="battlefield opponent-battlefield"
        />
        <ZoneComponent
          zoneName="opponent-hand"
          cards={gameState.opponent.hand}
          className="hand opponent-hand"
        />
      </motion.div>

      {/* Center Area - Stack and Turn Info */}
      <motion.div
        className="center-area"
        initial={{ translateZ: 0 }}
        animate={{ translateZ: 5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="game-info">
          <div className="turn-info">
            <motion.div
              className={`turn-indicator ${gameState.turn}`}
              whileHover={{ scale: 1.05, translateZ: 10 }}
              transition={{ duration: 0.2 }}
            >
              {gameState.turn === 'player'
                ? '🔵 Your Turn'
                : '🔴 Opponent Turn'}
            </motion.div>
            <div className="phase-indicator">
              Phase: {gameState.phase.toUpperCase()}
            </div>
            <motion.button
              className="next-phase-btn"
              onClick={nextPhase}
              whileHover={{ scale: 1.05, translateZ: 15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Next Phase
            </motion.button>
            <motion.button
              className="reveal-btn"
              onClick={toggleRevealOpponentHand}
              whileHover={{ scale: 1.05, translateZ: 15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                marginLeft: '10px',
                background:
                  gameState.revealedOpponentCards.length > 0
                    ? '#dc3545'
                    : '#28a745',
              }}
            >
              {gameState.revealedOpponentCards.length > 0 ? 'Hide' : 'Reveal'}{' '}
              Opponent Hand
            </motion.button>
          </div>
        </div>

        {gameState.stack.length > 0 && (
          <ZoneComponent
            zoneName="stack"
            cards={gameState.stack}
            className="stack"
          />
        )}
      </motion.div>

      {/* Player Area - Enhanced 3D */}
      <motion.div
        className="player-area"
        initial={{ rotateX: 0, translateZ: 0, scale: 1 }}
        animate={{ rotateX: -15, translateZ: 50, scale: 1.1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <ZoneComponent
          zoneName="player-hand"
          cards={gameState.player.hand}
          className="hand player-hand"
        />
        <ZoneComponent
          zoneName="battlefield"
          cards={gameState.player.battlefield}
          className="battlefield player-battlefield"
        />
        <div className="player-info player">
          <div className="life-counter">❤️ {gameState.player.life}</div>
          <div className="mana-pool">
            ⚡ {Object.values(gameState.player.mana).reduce((a, b) => a + b, 0)}
          </div>
          <div className="library-count">
            📚 {gameState.player.library.length}
          </div>
        </div>
      </motion.div>

      {/* Side Zones - Enhanced 3D */}
      <motion.div
        className="side-zones"
        initial={{ translateZ: 0 }}
        animate={{ translateZ: 40 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ZoneComponent
          zoneName="graveyard"
          cards={gameState.player.graveyard}
          className="graveyard"
        />
        <ZoneComponent zoneName="exile" cards={[]} className="exile" />
      </motion.div>
    </div>
  );
};

export default MTGArenaGame;
