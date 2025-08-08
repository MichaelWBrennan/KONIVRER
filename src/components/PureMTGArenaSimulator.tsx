import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../data/cards';
import { audioManager } from '../game/GameEngine';
import Enhanced2_5DTableView from './battlefield/Enhanced2_5DTableView';
import './PureMTGArenaSimulator.css';

// Pure MTG Arena card interface - no Inscryption mechanics
interface MTGArenaCard extends Card {
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
  position3D?: {
    x: number;
    y: number;
    z: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scale: number;
  };
}

// Pure MTG Arena game state
interface MTGArenaGameState {
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
    hand: MTGArenaCard[];
    battlefield: MTGArenaCard[];
    graveyard: MTGArenaCard[];
    library: MTGArenaCard[];
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
    hand: MTGArenaCard[];
    battlefield: MTGArenaCard[];
    graveyard: MTGArenaCard[];
    library: MTGArenaCard[];
  };
  turn: 'player' | 'opponent';
  phase: 'untap' | 'upkeep' | 'draw' | 'main1' | 'combat' | 'main2' | 'end';
  gameLog: string[];
}

// 3D Environmental element for the MTG Arena table view
interface EnvironmentalElement3D {
  id: string;
  name: string;
  type: 'decoration' | 'ui-element';
  position3D: {
    x: number;
    y: number;
    z: number;
    scale: number;
  };
  sprite: string;
  isInteractive: boolean;
  isActivated?: boolean;
}

interface PureMTGArenaSimulatorProps {
  className?: string;
}

const PureMTGArenaSimulator: React.FC<PureMTGArenaSimulatorProps> = ({ className = '' }) => {
  const [gameState, setGameState] = useState<MTGArenaGameState>(() => initializeMTGArenaGame());
  const [selectedCard, setSelectedCard] = useState<MTGArenaCard | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([]);

  // Initialize pure MTG Arena game - no hybrid mechanics
  function initializeMTGArenaGame(): MTGArenaGameState {
    const convertCard = (
      card: Card,
      owner: 'player' | 'opponent',
      zone: MTGArenaCard['zone'],
      index: number
    ): MTGArenaCard => ({
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
      position3D: {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1
      }
    });

    const allCards = [...KONIVRER_CARDS];
    const playerLibrary = allCards.slice(0, 30).map((card, index) => convertCard(card, 'player', 'library', index));
    const opponentLibrary = allCards.slice(0, 30).map((card, index) => convertCard(card, 'opponent', 'library', index));

    const playerHand = playerLibrary.splice(0, 7).map(card => ({ ...card, zone: 'hand' as const }));
    const opponentHand = opponentLibrary.splice(0, 7).map(card => ({ ...card, zone: 'hand' as const }));

    return {
      player: {
        life: 20,
        mana: { white: 1, blue: 1, black: 0, red: 0, green: 0, colorless: 2 },
        hand: playerHand,
        battlefield: [],
        graveyard: [],
        library: playerLibrary,
      },
      opponent: {
        life: 20,
        mana: { white: 1, blue: 1, black: 0, red: 0, green: 0, colorless: 2 },
        hand: opponentHand,
        battlefield: [],
        graveyard: [],
        library: opponentLibrary,
      },
      turn: 'player',
      phase: 'main1',
      gameLog: ['Game started']
    };
  }

  // Handle card selection
  const handleCardSelect = useCallback((card: MTGArenaCard) => {
    setSelectedCard(selectedCard?.gameId === card.gameId ? null : card);
    addToGameLog(`Selected ${card.name}`);
  }, [selectedCard]);

  // Handle card play - standard MTG Arena mechanics only
  const handleCardPlay = useCallback((card: MTGArenaCard) => {
    if (!card.canPlay || card.owner !== gameState.turn) return;

    setGameState(prev => {
      const newState = { ...prev };
      const currentPlayer = newState[gameState.turn];
      
      // Remove from hand
      currentPlayer.hand = currentPlayer.hand.filter(c => c.gameId !== card.gameId);
      
      // Add to battlefield
      const playedCard = { 
        ...card, 
        zone: 'battlefield' as const,
        position3D: {
          x: Math.random() * 100 - 50,
          y: 0,
          z: Math.random() * 20 - 10,
          rotationX: -5,
          rotationY: Math.random() * 10 - 5,
          rotationZ: Math.random() * 5 - 2.5,
          scale: 1
        }
      };
      
      currentPlayer.battlefield.push(playedCard);
      
      return newState;
    });

    addToGameLog(`${card.owner} played ${card.name}`);
    audioManager.playCardPlay();
  }, [gameState.turn]);

  // Add message to game log
  const addToGameLog = useCallback((message: string) => {
    setGameLog(prev => [...prev.slice(-9), message]);
  }, []);

  // Next phase - standard MTG Arena phase system
  const nextPhase = useCallback(() => {
    const phases: MTGArenaGameState['phase'][] = ['untap', 'upkeep', 'draw', 'main1', 'combat', 'main2', 'end'];
    const currentIndex = phases.indexOf(gameState.phase);
    const nextPhaseIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    setGameState(prev => {
      const newState = { ...prev, phase: nextPhase };

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

    addToGameLog(`${gameState.turn} ${nextPhase} phase`);
    audioManager.playCardFlip();
  }, [gameState.phase, gameState.turn]);

  // Create environmental elements for the 3D table (decorative only)
  const environmentalElements: EnvironmentalElement3D[] = [
    {
      id: 'life-counter-1',
      name: 'Player Life Counter',
      type: 'ui-element',
      position3D: { x: -200, y: 150, z: 10, scale: 1 },
      sprite: '🛡️',
      isInteractive: false
    },
    {
      id: 'life-counter-2', 
      name: 'Opponent Life Counter',
      type: 'ui-element',
      position3D: { x: -200, y: -200, z: 10, scale: 1 },
      sprite: '🛡️',
      isInteractive: false
    },
    {
      id: 'mana-pool',
      name: 'Mana Pool',
      type: 'ui-element',
      position3D: { x: 200, y: 150, z: 5, scale: 0.8 },
      sprite: '💎',
      isInteractive: false
    }
  ];

  return (
    <div className={`pure-mtg-arena-simulator ${className}`}>
      {/* Main game interface */}
      <div className="game-interface" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Top status bar - MTG Arena style */}
        <motion.div 
          className="status-bar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(40, 40, 50, 0.95) 100%)',
            borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="player-status" style={{ color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>❤️ {gameState.player.life}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Object.entries(gameState.player.mana).map(([color, amount]) => (
                amount > 0 && (
                  <span key={color} style={{ 
                    background: color === 'white' ? '#FFFBD5' : 
                              color === 'blue' ? '#0E68AB' :
                              color === 'black' ? '#150B00' :
                              color === 'red' ? '#D3202A' :
                              color === 'green' ? '#00733E' : '#BDC0C1',
                    color: color === 'white' || color === 'colorless' ? '#000' : '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: '24px',
                    textAlign: 'center'
                  }}>
                    {amount}
                  </span>
                )
              ))}
            </div>
          </div>

          <div className="game-controls" style={{ display: 'flex', gap: '12px' }}>
            <motion.button
              onClick={nextPhase}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              {gameState.phase.toUpperCase()} → Next Phase
            </motion.button>
          </div>

          <div className="opponent-status" style={{ color: '#F44336', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>❤️ {gameState.opponent.life}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Object.entries(gameState.opponent.mana).map(([color, amount]) => (
                amount > 0 && (
                  <span key={color} style={{ 
                    background: color === 'white' ? '#FFFBD5' : 
                              color === 'blue' ? '#0E68AB' :
                              color === 'black' ? '#150B00' :
                              color === 'red' ? '#D3202A' :
                              color === 'green' ? '#00733E' : '#BDC0C1',
                    color: color === 'white' || color === 'colorless' ? '#000' : '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: '24px',
                    textAlign: 'center'
                  }}>
                    {amount}
                  </span>
                )
              ))}
            </div>
          </div>
        </motion.div>

        {/* MTG Arena 2.5D Table View */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Enhanced2_5DTableView
            playerCards={gameState.player.hand.concat(gameState.player.battlefield)}
            opponentCards={gameState.opponent.hand.concat(gameState.opponent.battlefield)}
            environmentalElements={environmentalElements}
            selectedCard={selectedCard}
            onCardSelect={handleCardSelect}
            onElementInteraction={() => {}} // No interactions in pure MTG Arena
          />
        </div>

        {/* Game log - MTG Arena style */}
        <motion.div
          className="game-log"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '300px',
            maxHeight: '200px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            overflowY: 'auto',
            fontSize: '12px',
            color: '#fff',
            zIndex: 100,
          }}
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '8px', 
            color: '#FFD700',
            borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
            paddingBottom: '4px'
          }}>
            Game Log
          </div>
          {gameLog.map((entry, index) => (
            <div key={index} style={{ 
              marginBottom: '4px',
              opacity: 1 - (index * 0.1),
              fontSize: '11px'
            }}>
              {entry}
            </div>
          ))}
        </motion.div>

        {/* Turn indicator */}
        <motion.div
          className="turn-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            background: gameState.turn === 'player' ? 
              'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 
              'linear-gradient(135deg, #F44336 0%, #da190b 100%)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 100,
            border: '2px solid rgba(255, 215, 0, 0.5)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 4px 12px rgba(0, 0, 0, 0.3)',
              '0 6px 20px rgba(255, 215, 0, 0.4)',
              '0 4px 12px rgba(0, 0, 0, 0.3)'
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          {gameState.turn === 'player' ? 'YOUR TURN' : 'OPPONENT\'S TURN'}
          <br />
          <span style={{ fontSize: '12px', opacity: 0.9 }}>
            {gameState.phase.toUpperCase()}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default PureMTGArenaSimulator;