import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../data/cards';
import { audioManager } from '../game/GameEngine';

// Enhanced MTG Arena-style card interface with full stack support
interface MTGCard extends Card {
  gameId: string;
  zone:
    | 'hand'
    | 'battlefield'
    | 'graveyard'
    | 'library'
    | 'exile'
    | 'stack'
    | 'command';
  owner: 'player' | 'opponent';
  power?: number;
  toughness?: number;
  manaCost: number;
  cardTypes: string[];
  isTapped?: boolean;
  isSelected?: boolean;
  canPlay?: boolean;
  hasSummoningSickness?: boolean;
  stackOrder?: number;
  targets?: string[];
  abilities?: string[];
  keywords?: string[];
}

// Enhanced game state with full MTG Arena functionality
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
    exile: MTGCard[];
    commandZone: MTGCard[];
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
    exile: MTGCard[];
    commandZone: MTGCard[];
  };
  turn: 'player' | 'opponent';
  phase:
    | 'untap'
    | 'upkeep'
    | 'draw'
    | 'main1'
    | 'begin_combat'
    | 'declare_attackers'
    | 'declare_blockers'
    | 'first_strike_damage'
    | 'combat_damage'
    | 'end_combat'
    | 'main2'
    | 'end'
    | 'cleanup';
  step: string;
  stack: MTGCard[];
  priority: 'player' | 'opponent';
  hasFullControl: boolean;
  autoPass: boolean;
  revealedOpponentCards: string[];
  triggers: {
    source: string;
    ability: string;
    controller: 'player' | 'opponent';
  }[];
  combatState: {
    attackers: string[];
    blockers: { attacker: string; blockers: string[] }[];
    damageAssignment: { creature: string; damage: number }[];
  };
}

// Hover preview interface
interface HoverPreview {
  card: MTGCard;
  position: { x: number; y: number };
  isFullArt: boolean;
}

const AdvancedMTGArenaGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [selectedCard, setSelectedCard] = useState<MTGCard | null>(null);
  const [draggedCard, setDraggedCard] = useState<MTGCard | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [hoverPreview, setHoverPreview] = useState<HoverPreview | null>(null);
  const [tooltipCard, setTooltipCard] = useState<MTGCard | null>(null);
  const [showKeywordTooltip, setShowKeywordTooltip] = useState<{
    keyword: string;
    position: { x: number; y: number };
  } | null>(null);

  const gameContainerRef = useRef<HTMLDivElement>(null);

  function initializeGame(): GameState {
    // Convert KONIVRER cards to MTG-style cards with enhanced properties
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
      hasSummoningSickness: false,
      abilities: card.keywords || [],
      keywords: card.keywords || [],
    });

    // Create starting hands and libraries
    const allCards = [...KONIVRER_CARDS];
    const playerLibrary = allCards
      .slice(0, 40)
      .map(card => convertCard(card, 'player', 'library'));
    const opponentLibrary = allCards
      .slice(0, 40)
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
        exile: [],
        commandZone: [],
      },
      opponent: {
        life: 20,
        mana: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 1 },
        hand: opponentHand,
        battlefield: [],
        graveyard: [],
        library: opponentLibrary,
        exile: [],
        commandZone: [],
      },
      turn: 'player',
      phase: 'main1',
      step: 'main',
      stack: [],
      priority: 'player',
      hasFullControl: false,
      autoPass: true,
      revealedOpponentCards: [],
      triggers: [],
      combatState: {
        attackers: [],
        blockers: [],
        damageAssignment: [],
      },
    };
  }

  // Enhanced card interaction with hover preview
  const handleCardHover = useCallback((e: React.MouseEvent, card: MTGCard) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPreview({
      card,
      position: { x: rect.right + 10, y: rect.top },
      isFullArt: false,
    });

    // Show keyword tooltips if applicable
    if (card.keywords && card.keywords.length > 0) {
      setTooltipCard(card);
    }
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoverPreview(null);
    setTooltipCard(null);
    setShowKeywordTooltip(null);
  }, []);

  // Enhanced card click with full control mode
  const handleCardClick = (card: MTGCard) => {
    if (card.owner !== gameState.turn && !gameState.hasFullControl) return;

    audioManager.playCardHover();
    setSelectedCard(selectedCard?.gameId === card.gameId ? null : card);
  };

  // Stack resolution system
  const resolveStack = useCallback(() => {
    if (gameState.stack.length === 0) return;

    audioManager.playCardPlay();

    setGameState(prev => {
      const newState = { ...prev };
      const topCard = newState.stack.pop()!;

      // Resolve the top card's effect
      // For now, just move it to graveyard (simplified)
      const owner = newState[topCard.owner];
      owner.graveyard.push({ ...topCard, zone: 'graveyard' });

      // Check for triggers after resolution
      // This would be expanded with actual trigger checking

      return newState;
    });
  }, [gameState.stack]);

  // Priority passing system
  const passePriority = useCallback(() => {
    audioManager.playCardFlip();

    setGameState(prev => {
      const newState = { ...prev };

      if (newState.stack.length > 0) {
        // Pass priority, if both players pass, resolve stack
        if (newState.priority === 'player') {
          newState.priority = 'opponent';
        } else {
          // Both players passed, resolve top of stack
          if (newState.stack.length > 0) {
            const topCard = newState.stack.pop()!;
            const owner = newState[topCard.owner];
            owner.graveyard.push({ ...topCard, zone: 'graveyard' });
          }

          newState.priority = 'player'; // Active player gets priority back
        }
      } else {
        // No stack, move to next phase/step
        advancePhase(newState);
      }

      return newState;
    });
  }, []);

  // Enhanced phase advancement with full MTG timing
  const advancePhase = (state: GameState) => {
    const phases: GameState['phase'][] = [
      'untap',
      'upkeep',
      'draw',
      'main1',
      'begin_combat',
      'declare_attackers',
      'declare_blockers',
      'first_strike_damage',
      'combat_damage',
      'end_combat',
      'main2',
      'end',
      'cleanup',
    ];

    const currentIndex = phases.indexOf(state.phase);
    const nextPhaseIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    state.phase = nextPhase;

    // Handle phase-specific actions
    if (nextPhase === 'untap' && state.phase === 'cleanup') {
      // Switch turns
      state.turn = state.turn === 'player' ? 'opponent' : 'player';
      state.priority = state.turn;

      // Untap all permanents
      const currentPlayer = state[state.turn];
      currentPlayer.battlefield = currentPlayer.battlefield.map(card => ({
        ...card,
        isTapped: false,
        hasSummoningSickness: false,
      }));
    }

    if (nextPhase === 'draw') {
      // Draw a card
      const currentPlayer = state[state.turn];
      if (currentPlayer.library.length > 0) {
        const drawnCard = currentPlayer.library.shift()!;
        currentPlayer.hand.push({ ...drawnCard, zone: 'hand' });
      }
    }
  };

  // Auto-passing logic
  const shouldAutoPass = useCallback((state: GameState): boolean => {
    if (!state.autoPass) return false;
    if (state.hasFullControl) return false;
    if (state.stack.length > 0) return false;
    if (state.triggers.length > 0) return false;

    // Check if player has any instant-speed responses
    const currentPlayer = state[state.priority];
    const hasInstantResponse = currentPlayer.hand.some(
      card =>
        card.cardTypes.includes('Instant') ||
        card.abilities?.some(ability => ability.includes('Flash')),
    );

    return !hasInstantResponse;
  }, []);

  // Toggle full control mode
  const toggleFullControl = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hasFullControl: !prev.hasFullControl,
    }));
  }, []);

  // Toggle auto-pass
  const toggleAutoPass = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      autoPass: !prev.autoPass,
    }));
  }, []);

  // Enhanced Card Component with hover previews and tooltips
  const CardComponent: React.FC<{
    card: MTGCard;
    style?: React.CSSProperties;
    index?: number;
    showBack?: boolean;
  }> = ({ card, style, index = 0, showBack = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Check if this opponent hand card should be hidden
    const shouldShowCardBack =
      showBack ||
      (card.owner === 'opponent' &&
        card.zone === 'hand' &&
        !gameState.revealedOpponentCards.includes(card.gameId));

    // Card Back Component
    if (shouldShowCardBack) {
      return (
        <motion.div
          style={style}
          className="card mtg-card card-back opponent hand"
          whileHover={{ scale: 1.05, translateZ: 30 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="card-back-content">
            <div className="card-back-pattern">
              <div className="konivrer-logo">⭐</div>
              <div className="card-back-title">KONIVRER</div>
              <div className="card-back-subtitle">Trading Card Game</div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        style={style}
        className={`
          card mtg-card ${card.owner} ${card.zone} 
          ${card.isSelected ? 'selected' : ''} 
          ${card.isTapped ? 'tapped' : ''}
          ${card.canPlay ? 'playable' : ''}
          ${isHovered ? 'hovered' : ''}
          ${card.hasSummoningSickness ? 'summoning-sick' : ''}
        `}
        onClick={() => handleCardClick(card)}
        onMouseEnter={e => {
          setIsHovered(true);
          handleCardHover(e, card);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          handleCardLeave();
        }}
        whileHover={{
          scale: card.zone === 'hand' ? 1.1 : 1.05,
          rotateX: card.owner === 'player' ? 10 : -5,
          translateZ: 30,
          transition: { duration: 0.2 },
        }}
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
          <div className="card-text">
            {card.keywords && card.keywords.length > 0 && (
              <div className="keywords">
                {card.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="keyword"
                    onMouseEnter={e => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setShowKeywordTooltip({
                        keyword,
                        position: { x: rect.left, y: rect.bottom + 5 },
                      });
                    }}
                    onMouseLeave={() => setShowKeywordTooltip(null)}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            <div className="card-description">{card.description}</div>
          </div>
          {card.zone === 'stack' && (
            <div className="stack-order">Stack: {card.stackOrder}</div>
          )}
        </div>
      </motion.div>
    );
  };

  // Hover Preview Component
  const HoverPreviewComponent: React.FC<{ preview: HoverPreview }> = ({
    preview,
  }) => (
    <motion.div
      className="hover-preview"
      style={{
        position: 'fixed',
        left: preview.position.x,
        top: preview.position.y,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <CardComponent card={preview.card} />
      {preview.isFullArt && (
        <div className="full-art-overlay">
          <img
            src={`/images/cards/full-art/${preview.card.id}.jpg`}
            alt={preview.card.name}
            onError={e => {
              // Fallback to regular card if full art not available
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </motion.div>
  );

  // Keyword Tooltip Component
  const KeywordTooltip: React.FC<{
    keyword: string;
    position: { x: number; y: number };
  }> = ({ keyword, position }) => {
    const getKeywordDescription = (keyword: string): string => {
      const descriptions: Record<string, string> = {
        Flying:
          'This creature can only be blocked by creatures with flying or reach.',
        Trample:
          'If this creature would assign enough damage to destroy all creatures blocking it, excess damage is dealt to the defending player.',
        Haste:
          'This creature can attack and tap on the turn it enters the battlefield.',
        'First Strike':
          'This creature deals combat damage before creatures without first strike.',
        Vigilance: "Attacking with this creature doesn't cause it to tap.",
        Lifelink:
          'Damage dealt by this creature also causes its controller to gain that much life.',
        Deathtouch:
          'Any amount of damage this creature deals to another creature is enough to destroy it.',
      };

      return descriptions[keyword] || 'Unknown keyword ability.';
    };

    return (
      <motion.div
        className="keyword-tooltip"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1001,
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="tooltip-content">
          <strong>{keyword}</strong>
          <p>{getKeywordDescription(keyword)}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="advanced-mtg-arena-game" ref={gameContainerRef}>
      {/* Game Controls */}
      <div className="game-controls">
        <button
          className={`control-btn ${gameState.hasFullControl ? 'active' : ''}`}
          onClick={toggleFullControl}
        >
          Full Control {gameState.hasFullControl ? 'ON' : 'OFF'}
        </button>
        <button
          className={`control-btn ${gameState.autoPass ? 'active' : ''}`}
          onClick={toggleAutoPass}
        >
          Auto-Pass {gameState.autoPass ? 'ON' : 'OFF'}
        </button>
        <button
          className="control-btn priority"
          onClick={passePriority}
          disabled={gameState.priority !== 'player'}
        >
          Pass Priority
        </button>
        {gameState.stack.length > 0 && (
          <button className="control-btn resolve" onClick={resolveStack}>
            Resolve ({gameState.stack.length})
          </button>
        )}
      </div>

      {/* Enhanced MTG Arena Layout */}
      {/* Content continues... */}

      {/* Hover Previews */}
      <AnimatePresence>
        {hoverPreview && <HoverPreviewComponent preview={hoverPreview} />}
      </AnimatePresence>

      {/* Keyword Tooltips */}
      <AnimatePresence>
        {showKeywordTooltip && (
          <KeywordTooltip
            keyword={showKeywordTooltip.keyword}
            position={showKeywordTooltip.position}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedMTGArenaGame;
