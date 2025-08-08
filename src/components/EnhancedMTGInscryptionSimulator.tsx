import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../data/cards';
import { audioManager } from '../game/GameEngine';
import FirstPersonBattlefield from './battlefield/FirstPersonBattlefield';
import { HybridMapTheme } from './battlefield/HybridBattlefieldMap';

// Enhanced game card interface that bridges MTG Arena and Inscryption styles
interface EnhancedGameCard extends Card {
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
  gridPosition?: { row: number; col: number };
  mysteryValue?: number; // Inscryption-style hidden value
  environmentalBonus?: string; // Bonus from environmental interactions
}

// Game state combining both systems
interface HybridGameState {
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
    hand: EnhancedGameCard[];
    battlefield: EnhancedGameCard[];
    graveyard: EnhancedGameCard[];
    library: EnhancedGameCard[];
    mysteryScore: number; // Inscryption-inspired scoring
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
    hand: EnhancedGameCard[];
    battlefield: EnhancedGameCard[];
    graveyard: EnhancedGameCard[];
    library: EnhancedGameCard[];
    mysteryScore: number;
  };
  turn: 'player' | 'opponent';
  phase: 'untap' | 'upkeep' | 'draw' | 'main1' | 'combat' | 'main2' | 'end';
  mapTheme: HybridMapTheme;
  environmentalEffects: string[]; // Active environmental bonuses
  atmosphericState: 'calm' | 'tense' | 'mysterious' | 'dramatic';
}

interface EnhancedMTGInscryptionSimulatorProps {
  initialTheme?: HybridMapTheme;
  enableAtmosphericEffects?: boolean;
  enableMysteryMechanics?: boolean;
  className?: string;
}

const EnhancedMTGInscryptionSimulator: React.FC<
  EnhancedMTGInscryptionSimulatorProps
> = ({
  initialTheme = 'mysterious-cabin',
  enableAtmosphericEffects = true,
  enableMysteryMechanics = true,
  className = '',
}) => {
  const [gameState, setGameState] = useState<HybridGameState>(() =>
    initializeHybridGame(initialTheme),
  );
  const [selectedCard, setSelectedCard] = useState<EnhancedGameCard | null>(
    null,
  );
  const [draggedCard, setDraggedCard] = useState<EnhancedGameCard | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [showMysteryValues, setShowMysteryValues] = useState(false);
  const [narrativeText, setNarrativeText] = useState<string>('');
  const [currentScale, setCurrentScale] = useState<
    'balanced' | 'player-advantage' | 'opponent-advantage'
  >('balanced');

  function initializeHybridGame(theme: HybridMapTheme): HybridGameState {
    const convertCard = (
      card: Card,
      owner: 'player' | 'opponent',
      zone: EnhancedGameCard['zone'],
      index: number,
    ): EnhancedGameCard => ({
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
      gridPosition: {
        row: zone === 'hand' ? 0 : Math.floor(index / 4),
        col: index % 4,
      },
      mysteryValue: enableMysteryMechanics
        ? Math.floor(Math.random() * 10) + 1
        : undefined,
      environmentalBonus: undefined,
    });

    const allCards = [...KONIVRER_CARDS];
    const playerLibrary = allCards
      .slice(0, 30)
      .map((card, index) => convertCard(card, 'player', 'library', index));
    const opponentLibrary = allCards
      .slice(0, 30)
      .map((card, index) => convertCard(card, 'opponent', 'library', index));

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
        mysteryScore: 0,
      },
      opponent: {
        life: 20,
        mana: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 1 },
        hand: opponentHand,
        battlefield: [],
        graveyard: [],
        library: opponentLibrary,
        mysteryScore: 0,
      },
      turn: 'player',
      phase: 'main1',
      mapTheme: theme,
      environmentalEffects: [],
      atmosphericState: 'calm',
    };
  }

  // Handle environmental interactions from the map
  const handleEnvironmentalInteraction = useCallback((element: any) => {
    setGameState(prev => {
      const newState = { ...prev };

      // Update environmental effects
      newState.environmentalEffects.push(element.name);

      // Apply thematic narrative
      const narratives: Record<string, string> = {
        'Ancient Tome':
          'The ancient knowledge flows through you, revealing the secrets of card synergy...',
        'Flickering Candle':
          "The candle's light reveals what was hidden in shadow...",
        "Merchant's Scale":
          'The scales tip in your favor, bringing balance to the game...',
        'Mystical Scroll':
          'The scroll unfurls, showing you the path to victory...',
        'Wisdom Totem': 'The totem whispers ancient strategies...',
        'Scrying Crystal': 'The crystal shows glimpses of cards yet to come...',
        'Ritual Brazier': 'The sacred flames empower your next play...',
        'Stone Guardian': 'The guardian nods approvingly at your tactics...',
        'Golden Scale': "The merchant's tools favor your transaction...",
        'Ledger of Trades': 'Past exchanges guide your current choices...',
      };

      setNarrativeText(
        narratives[element.name] ||
          'The environment responds to your presence...',
      );

      // Update atmospheric state based on theme and interaction
      if (element.type === 'candle' || element.type === 'brazier') {
        newState.atmosphericState = 'dramatic';
      } else if (element.type === 'totem' || element.type === 'artifact') {
        newState.atmosphericState = 'mysterious';
      } else {
        newState.atmosphericState = 'tense';
      }

      return newState;
    });

    // Clear narrative after a delay
    setTimeout(() => setNarrativeText(''), 5000);

    // Play thematic audio
    audioManager.playCardHover();
  }, []);

  // Handle theme changes from the map
  const handleThemeChange = useCallback((newTheme: HybridMapTheme) => {
    setGameState(prev => ({
      ...prev,
      mapTheme: newTheme,
      environmentalEffects: [], // Reset environmental effects when changing themes
      atmosphericState: 'calm',
    }));

    // Update background music/ambiance (simulated)
    console.log(`🎵 Switching to ${newTheme} ambiance...`);
  }, []);

  // Enhanced card play with Inscryption-style mechanics
  const handleCardPlay = useCallback(
    (card: EnhancedGameCard, targetZone: string) => {
      if (!card.canPlay || card.owner !== gameState.turn) return;

      setGameState(prev => {
        const newState = { ...prev };
        const currentPlayer = newState[gameState.turn];

        // Remove from hand
        currentPlayer.hand = currentPlayer.hand.filter(
          c => c.gameId !== card.gameId,
        );

        // Add to battlefield with potential environmental bonuses
        const playedCard = {
          ...card,
          zone: 'battlefield' as const,
          environmentalBonus:
            newState.environmentalEffects.length > 0
              ? `+${newState.environmentalEffects.length} from environment`
              : undefined,
        };

        currentPlayer.battlefield.push(playedCard);

        // Update mystery score if enabled
        if (enableMysteryMechanics && card.mysteryValue) {
          currentPlayer.mysteryScore += card.mysteryValue;

          // Update scale based on mystery scores
          const scoreDiff =
            newState.player.mysteryScore - newState.opponent.mysteryScore;
          setCurrentScale(
            scoreDiff > 5
              ? 'player-advantage'
              : scoreDiff < -5
                ? 'opponent-advantage'
                : 'balanced',
          );
        }

        return newState;
      });

      // Play enhanced audio with environmental reverb
      audioManager.playCardPlay();
    },
    [gameState.turn, enableMysteryMechanics],
  );

  const nextPhase = useCallback(() => {
    const phases: HybridGameState['phase'][] = [
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

      if (nextPhase === 'untap' && prev.phase === 'end') {
        // Switch turns
        newState.turn = prev.turn === 'player' ? 'opponent' : 'player';

        // Untap all permanents
        const currentPlayer = newState[newState.turn];
        currentPlayer.battlefield = currentPlayer.battlefield.map(card => ({
          ...card,
          isTapped: false,
        }));

        // Reset atmospheric state
        newState.atmosphericState = 'calm';
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

    audioManager.playCardFlip();
  }, [gameState.phase]);

  // Inscryption-style mystery card reveal
  const toggleMysteryValues = useCallback(() => {
    setShowMysteryValues(prev => !prev);
    setNarrativeText(
      showMysteryValues
        ? 'The veil of mystery returns...'
        : 'The true nature of your cards is revealed...',
    );
    setTimeout(() => setNarrativeText(''), 3000);
  }, [showMysteryValues]);

  return (
    <div className={`enhanced-mtg-inscryption-simulator ${className}`}>
      {/* Narrative overlay */}
      <AnimatePresence>
        {narrativeText && (
          <motion.div
            className="narrative-overlay"
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.9)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontStyle: 'italic',
              maxWidth: '400px',
              textAlign: 'center',
              zIndex: 1000,
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {narrativeText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main game interface */}
      <div
        className="game-interface"
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        {/* Top status bar with Inscryption-style elements */}
        <motion.div
          className="status-bar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="player-status" style={{ color: '#4CAF50' }}>
            <span>❤️ {gameState.player.life}</span>
            <span style={{ marginLeft: '20px' }}>
              ⚡{' '}
              {Object.values(gameState.player.mana).reduce((a, b) => a + b, 0)}
            </span>
            {enableMysteryMechanics && (
              <span style={{ marginLeft: '20px', color: '#FFD700' }}>
                🔮 {gameState.player.mysteryScore}
              </span>
            )}
          </div>

          <div
            className="game-controls"
            style={{ display: 'flex', gap: '10px' }}
          >
            <motion.button
              onClick={nextPhase}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Phase ({gameState.phase})
            </motion.button>

            {enableMysteryMechanics && (
              <motion.button
                onClick={toggleMysteryValues}
                style={{
                  background: showMysteryValues
                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showMysteryValues ? 'Hide' : 'Reveal'} Mystery
              </motion.button>
            )}
          </div>

          <div className="opponent-status" style={{ color: '#F44336' }}>
            <span>❤️ {gameState.opponent.life}</span>
            <span style={{ marginLeft: '20px' }}>
              ⚡{' '}
              {Object.values(gameState.opponent.mana).reduce(
                (a, b) => a + b,
                0,
              )}
            </span>
            {enableMysteryMechanics && (
              <span style={{ marginLeft: '20px', color: '#FFD700' }}>
                🔮 {gameState.opponent.mysteryScore}
              </span>
            )}
          </div>
        </motion.div>

        {/* Mystery Scale Indicator (Inscryption-inspired) */}
        {enableMysteryMechanics && (
          <motion.div
            className="mystery-scale"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 100,
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div
              style={{
                width: '60px',
                height: '200px',
                background: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '30px',
                border: '2px solid #FFD700',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>⚖️</div>
              <motion.div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background:
                    currentScale === 'balanced'
                      ? '#FFD700'
                      : currentScale === 'player-advantage'
                        ? '#4CAF50'
                        : '#F44336',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
                animate={{
                  y:
                    currentScale === 'balanced'
                      ? 0
                      : currentScale === 'player-advantage'
                        ? -20
                        : 20,
                }}
                transition={{ duration: 0.5 }}
              >
                {currentScale === 'balanced'
                  ? '⚖️'
                  : currentScale === 'player-advantage'
                    ? '↑'
                    : '↓'}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* 2.5D First-Person Battlefield */}
        <div style={{ flex: 1, position: 'relative' }}>
          <FirstPersonBattlefield
            theme={gameState.mapTheme}
            onThemeChange={handleThemeChange}
            onEnvironmentalInteraction={handleEnvironmentalInteraction}
            onCardAction={handleCardPlay}
            className="main-battlefield-fp"
          />
        </div>

        {/* Enhanced atmospheric state indicator */}
        {enableAtmosphericEffects && (
          <motion.div
            className="atmospheric-indicator"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              zIndex: 100,
            }}
            animate={{
              boxShadow:
                gameState.atmosphericState === 'dramatic'
                  ? '0 0 20px rgba(255, 69, 0, 0.5)'
                  : gameState.atmosphericState === 'mysterious'
                    ? '0 0 20px rgba(138, 43, 226, 0.5)'
                    : gameState.atmosphericState === 'tense'
                      ? '0 0 20px rgba(220, 20, 60, 0.5)'
                      : '0 0 10px rgba(255, 255, 255, 0.2)',
            }}
            transition={{ duration: 1 }}
          >
            Atmosphere: {gameState.atmosphericState.toUpperCase()}
            <br />
            Effects: {gameState.environmentalEffects.length}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMTGInscryptionSimulator;
