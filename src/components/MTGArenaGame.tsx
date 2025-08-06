import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../data/cards';

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
    mana: { white: number; blue: number; black: number; red: number; green: number; colorless: number };
    hand: MTGCard[];
    battlefield: MTGCard[];
    graveyard: MTGCard[];
    library: MTGCard[];
  };
  opponent: {
    life: number;
    mana: { white: number; blue: number; black: number; red: number; green: number; colorless: number };
    hand: MTGCard[];
    battlefield: MTGCard[];
    graveyard: MTGCard[];
    library: MTGCard[];
  };
  turn: 'player' | 'opponent';
  phase: 'untap' | 'upkeep' | 'draw' | 'main1' | 'combat' | 'main2' | 'end';
  stack: MTGCard[];
}

const MTGArenaGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [selectedCard, setSelectedCard] = useState<MTGCard | null>(null);
  const [draggedCard, setDraggedCard] = useState<MTGCard | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  function initializeGame(): GameState {
    // Convert KONIVRER cards to MTG-style cards
    const convertCard = (card: Card, owner: 'player' | 'opponent', zone: MTGCard['zone']): MTGCard => ({
      ...card,
      gameId: `${card.id}-${owner}-${Math.random()}`,
      zone,
      owner,
      manaCost: card.cost,
      cardTypes: card.type === 'Familiar' ? ['Creature'] : ['Enchantment'],
      power: card.type === 'Familiar' ? Math.floor(Math.random() * 5) + 1 : undefined,
      toughness: card.type === 'Familiar' ? Math.floor(Math.random() * 5) + 1 : undefined,
      isTapped: false,
      isSelected: false,
      canPlay: false,
    });

    // Create starting hands and libraries
    const allCards = [...KONIVRER_CARDS];
    const playerLibrary = allCards.slice(0, 30).map(card => convertCard(card, 'player', 'library'));
    const opponentLibrary = allCards.slice(0, 30).map(card => convertCard(card, 'opponent', 'library'));

    // Draw starting hands
    const playerHand = playerLibrary.splice(0, 7).map(card => ({ ...card, zone: 'hand' as const }));
    const opponentHand = opponentLibrary.splice(0, 7).map(card => ({ ...card, zone: 'hand' as const }));

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
    };
  }

  const handleCardClick = (card: MTGCard) => {
    if (card.owner !== gameState.turn) return;
    
    setSelectedCard(selectedCard?.gameId === card.gameId ? null : card);
  };

  const handleCardDragStart = (card: MTGCard) => {
    if (card.owner !== gameState.turn) return;
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
      setGameState(prev => {
        const newState = { ...prev };
        const currentPlayer = newState[gameState.turn];
        
        // Remove from hand
        currentPlayer.hand = currentPlayer.hand.filter(c => c.gameId !== draggedCard.gameId);
        
        // Add to battlefield
        const playedCard = { ...draggedCard, zone: 'battlefield' as const };
        currentPlayer.battlefield.push(playedCard);
        
        return newState;
      });
    }

    setHoveredZone(null);
  };

  const nextPhase = () => {
    const phases: GameState['phase'][] = ['untap', 'upkeep', 'draw', 'main1', 'combat', 'main2', 'end'];
    const currentIndex = phases.indexOf(gameState.phase);
    const nextPhaseIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    setGameState(prev => {
      const newState = { ...prev, phase: nextPhase };
      
      // Handle phase changes
      if (nextPhase === 'untap' && prev.phase === 'end') {
        // Switch turns
        newState.turn = prev.turn === 'player' ? 'opponent' : 'player';
        
        // Untap all permanents
        const currentPlayer = newState[newState.turn];
        currentPlayer.battlefield = currentPlayer.battlefield.map(card => ({
          ...card,
          isTapped: false
        }));
      }
      
      if (nextPhase === 'draw') {
        // Draw a card
        const currentPlayer = newState[newState.turn];
        if (currentPlayer.library.length > 0) {
          const drawnCard = currentPlayer.library.shift()!;
          currentPlayer.hand.push({ ...drawnCard, zone: 'hand' });
        }
      }

      return newState;
    });
  };

  const CardComponent: React.FC<{ card: MTGCard; style?: React.CSSProperties }> = ({ card, style }) => (
    <motion.div
      style={style}
      className={`
        card mtg-card ${card.owner} ${card.zone} 
        ${card.isSelected ? 'selected' : ''} 
        ${card.isTapped ? 'tapped' : ''}
        ${card.canPlay ? 'playable' : ''}
      `}
      onClick={() => handleCardClick(card)}
      draggable
      onDragStart={() => handleCardDragStart(card)}
      onDragEnd={handleCardDragEnd}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      layout
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

  const ZoneComponent: React.FC<{
    zoneName: string;
    cards: MTGCard[];
    className?: string;
    style?: React.CSSProperties;
  }> = ({ zoneName, cards, className = '', style }) => (
    <div
      className={`zone ${zoneName} ${className} ${hoveredZone === zoneName ? 'drop-target' : ''}`}
      style={style}
      onDragOver={(e) => handleZoneDropOver(e, zoneName)}
      onDrop={(e) => handleZoneDrop(e, zoneName as MTGCard['zone'])}
    >
      <div className="zone-label">{zoneName.toUpperCase()}</div>
      <div className="zone-cards">
        <AnimatePresence>
          {cards.map((card, index) => (
            <CardComponent
              key={card.gameId}
              card={card}
              style={{
                zIndex: index,
                transform: zoneName === 'hand' ? `translateX(${index * 60}px)` : undefined,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="mtg-arena-game">
      {/* Opponent Area */}
      <div className="opponent-area">
        <div className="player-info opponent">
          <div className="life-counter">❤️ {gameState.opponent.life}</div>
          <div className="hand-count">🃏 {gameState.opponent.hand.length}</div>
          <div className="library-count">📚 {gameState.opponent.library.length}</div>
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
      </div>

      {/* Center Area - Stack and Turn Info */}
      <div className="center-area">
        <div className="game-info">
          <div className="turn-info">
            <div className={`turn-indicator ${gameState.turn}`}>
              {gameState.turn === 'player' ? '🔵 Your Turn' : '🔴 Opponent Turn'}
            </div>
            <div className="phase-indicator">
              Phase: {gameState.phase.toUpperCase()}
            </div>
            <button className="next-phase-btn" onClick={nextPhase}>
              Next Phase
            </button>
          </div>
        </div>
        
        {gameState.stack.length > 0 && (
          <ZoneComponent
            zoneName="stack"
            cards={gameState.stack}
            className="stack"
          />
        )}
      </div>

      {/* Player Area */}
      <div className="player-area">
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
          <div className="library-count">📚 {gameState.player.library.length}</div>
        </div>
      </div>

      {/* Side Zones */}
      <div className="side-zones">
        <ZoneComponent
          zoneName="graveyard"
          cards={gameState.player.graveyard}
          className="graveyard"
        />
        <ZoneComponent
          zoneName="exile"
          cards={[]}
          className="exile"
        />
      </div>
    </div>
  );
};

export default MTGArenaGame;