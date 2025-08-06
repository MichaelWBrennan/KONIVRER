import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../../data/cards';

interface CardGameUIProps {
  onClose: () => void;
}

interface GameState {
  playerHand: Card[];
  playerBoard: Card[];
  opponentBoard: Card[];
  playerHealth: number;
  opponentHealth: number;
  playerMana: number;
  maxMana: number;
  turn: 'player' | 'opponent';
  selectedCard: Card | null;
}

const CardGameUI: React.FC<CardGameUIProps> = ({ onClose }) => {
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    playerBoard: [],
    opponentBoard: [],
    playerHealth: 30,
    opponentHealth: 30,
    playerMana: 3,
    maxMana: 3,
    turn: 'player',
    selectedCard: null,
  });

  // Initialize game with random cards
  useEffect(() => {
    const shuffled = [...KONIVRER_CARDS].sort(() => Math.random() - 0.5);
    const playerStartingHand = shuffled.slice(0, 5);
    const opponentStartingBoard = shuffled.slice(5, 8); // AI starts with some cards on board
    
    setGameState(prev => ({
      ...prev,
      playerHand: playerStartingHand,
      opponentBoard: opponentStartingBoard,
    }));
  }, []);

  const playCard = (card: Card, targetArea: 'board') => {
    if (gameState.turn !== 'player' || gameState.playerMana < card.cost) return;

    setGameState(prev => ({
      ...prev,
      playerHand: prev.playerHand.filter(c => c.id !== card.id),
      playerBoard: [...prev.playerBoard, card],
      playerMana: prev.playerMana - card.cost,
      selectedCard: null,
    }));
  };

  const endTurn = () => {
    setGameState(prev => ({
      ...prev,
      turn: prev.turn === 'player' ? 'opponent' : 'player',
      playerMana: prev.turn === 'opponent' ? Math.min(prev.maxMana + 1, 10) : prev.playerMana,
      maxMana: prev.turn === 'opponent' ? Math.min(prev.maxMana + 1, 10) : prev.maxMana,
    }));

    // Simple AI turn - opponent plays a random card if possible
    if (gameState.turn === 'player') {
      setTimeout(() => {
        const shuffled = [...KONIVRER_CARDS].sort(() => Math.random() - 0.5);
        const newOpponentCard = shuffled[0];
        setGameState(prev => ({
          ...prev,
          opponentBoard: [...prev.opponentBoard, newOpponentCard],
          turn: 'player',
        }));
      }, 1500);
    }
  };

  const CardComponent: React.FC<{ 
    card: Card; 
    location: 'hand' | 'board'; 
    owner: 'player' | 'opponent';
    onClick?: () => void;
  }> = ({ card, location, owner, onClick }) => {
    const isSelected = gameState.selectedCard?.id === card.id;
    const canPlay = location === 'hand' && gameState.turn === 'player' && gameState.playerMana >= card.cost;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: location === 'hand' ? 1.05 : 1.02, y: location === 'hand' ? -10 : 0 }}
        className={`card ${location} ${owner} ${isSelected ? 'selected' : ''} ${canPlay ? 'playable' : ''}`}
        onClick={onClick}
        style={{
          width: location === 'hand' ? '120px' : '100px',
          height: location === 'hand' ? '170px' : '140px',
          background: `linear-gradient(135deg, ${getCardColor(card)} 0%, ${getCardColor(card, true)} 100%)`,
          border: `2px solid ${isSelected ? '#d4af37' : canPlay ? '#4ade80' : '#6b7280'}`,
          borderRadius: '12px',
          padding: '8px',
          margin: '4px',
          cursor: canPlay || location === 'hand' ? 'pointer' : 'default',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
          fontSize: location === 'hand' ? '11px' : '9px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          boxShadow: isSelected 
            ? '0 8px 25px rgba(212, 175, 55, 0.4)' 
            : canPlay 
            ? '0 4px 15px rgba(74, 222, 128, 0.3)'
            : '0 4px 15px rgba(0,0,0,0.3)',
          opacity: canPlay || location === 'board' ? 1 : 0.7,
        }}
      >
        {/* Cost */}
        <div style={{
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#1f2937',
          border: '2px solid #d4af37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#d4af37',
        }}>
          {card.cost}
        </div>

        {/* Strength (for Familiars) */}
        {card.strength && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#dc2626',
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
          }}>
            {card.strength}
          </div>
        )}

        {/* Card content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', lineHeight: '1.2' }}>
              {card.name}
            </div>
            <div style={{ fontSize: '8px', opacity: 0.9, marginBottom: '4px' }}>
              {card.type} • {card.rarity}
            </div>
          </div>

          <div style={{ fontSize: '8px', opacity: 0.8, lineHeight: '1.1' }}>
            {card.description.length > 60 ? card.description.substring(0, 60) + '...' : card.description}
          </div>

          {/* Elements */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '4px' }}>
            {card.elements.map((element, idx) => (
              <span key={idx} style={{
                fontSize: '7px',
                padding: '1px 4px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '4px',
                border: `1px solid ${getElementColor(element)}`,
                color: getElementColor(element),
              }}>
                {element}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
      }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#d4af37', fontSize: '24px' }}>⭐ KONIVRER ⭐</h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>❤️ {gameState.opponentHealth}</div>
            <div>Turn: {gameState.turn === 'player' ? 'Your Turn' : 'Opponent Turn'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>💧 {gameState.playerMana}/{gameState.maxMana}</div>
          <div>❤️ {gameState.playerHealth}</div>
          <button
            onClick={endTurn}
            disabled={gameState.turn !== 'player'}
            style={{
              padding: '8px 16px',
              background: gameState.turn === 'player' ? '#d4af37' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              color: gameState.turn === 'player' ? '#000' : '#fff',
              cursor: gameState.turn === 'player' ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
            }}
          >
            End Turn
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(220, 38, 38, 0.8)',
              border: '2px solid #dc2626',
              borderRadius: '50%',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/* Game Board */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
        {/* Opponent Board */}
        <div style={{
          minHeight: '160px',
          background: 'rgba(220, 38, 38, 0.1)',
          border: '2px dashed rgba(220, 38, 38, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#dc2626', fontSize: '16px' }}>Opponent Board</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {gameState.opponentBoard.map((card, index) => (
              <CardComponent key={`${card.id}-${index}`} card={card} location="board" owner="opponent" />
            ))}
            {gameState.opponentBoard.length === 0 && (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No cards on board</div>
            )}
          </div>
        </div>

        {/* Battlefield Center */}
        <div style={{
          flex: 1,
          background: 'rgba(212, 175, 55, 0.05)',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px',
          marginBottom: '16px',
        }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚔️</div>
            <div>Battlefield</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Drag cards here to play them • Click cards to select
            </div>
          </div>
        </div>

        {/* Player Board */}
        <div style={{
          minHeight: '160px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '2px dashed rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#22c55e', fontSize: '16px' }}>Your Board</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {gameState.playerBoard.map((card, index) => (
              <CardComponent key={`${card.id}-${index}`} card={card} location="board" owner="player" />
            ))}
            {gameState.playerBoard.length === 0 && (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No cards on board</div>
            )}
          </div>
        </div>

        {/* Player Hand */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#3b82f6', fontSize: '16px' }}>Your Hand</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {gameState.playerHand.map((card) => (
              <CardComponent 
                key={card.id} 
                card={card} 
                location="hand" 
                owner="player"
                onClick={() => {
                  if (gameState.turn === 'player' && gameState.playerMana >= card.cost) {
                    if (gameState.selectedCard?.id === card.id) {
                      // Double click to play card
                      playCard(card, 'board');
                    } else {
                      // Select card
                      setGameState(prev => ({ ...prev, selectedCard: card }));
                    }
                  }
                }}
              />
            ))}
            {gameState.playerHand.length === 0 && (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No cards in hand</div>
            )}
          </div>
          {gameState.selectedCard && (
            <div style={{ 
              marginTop: '12px', 
              textAlign: 'center', 
              color: '#d4af37', 
              fontSize: '14px' 
            }}>
              Selected: {gameState.selectedCard.name} • Click again to play • Cost: {gameState.selectedCard.cost} mana
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getCardColor = (card: Card, darker = false) => {
  const colors = {
    Fire: darker ? '#dc2626' : '#ef4444',
    Water: darker ? '#2563eb' : '#3b82f6', 
    Air: darker ? '#7c3aed' : '#8b5cf6',
    Earth: darker ? '#16a34a' : '#22c55e',
    Nether: darker ? '#6b21a8' : '#8b5cf6',
    Aether: darker ? '#d97706' : '#f59e0b',
    Chaos: darker ? '#be123c' : '#e11d48',
  };
  
  const element = card.elements[0] || 'Neutral';
  return colors[element as keyof typeof colors] || (darker ? '#4b5563' : '#6b7280');
};

const getElementColor = (element: string) => {
  const colors = {
    Fire: '#ef4444',
    Water: '#3b82f6',
    Air: '#8b5cf6', 
    Earth: '#22c55e',
    Nether: '#8b5cf6',
    Aether: '#f59e0b',
    Chaos: '#e11d48',
    Neutral: '#6b7280',
  };
  return colors[element as keyof typeof colors] || '#6b7280';
};

export default CardGameUI;