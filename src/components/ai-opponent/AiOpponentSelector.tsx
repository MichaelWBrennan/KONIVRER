import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import * as s from './aiOpponentSelector.css';

interface AiOpponent {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  personality: {
    aggression: number;
    riskTolerance: number;
    adaptability: number;
    bluffing: number;
    patience: number;
    creativity: number;
  };
  preferredElements: string[];
  preferredStrategies: string[];
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    averageGameLength: number;
    favoriteCards: string[];
    mostUsedStrategies: string[];
    lastPlayed: string;
  };
  avatar?: string;
  isUnlocked: boolean;
  unlockRequirements?: {
    type: 'win_streak' | 'games_played' | 'achievement' | 'rating';
    value: number;
    description: string;
  };
}

interface AiOpponentSelectorProps {
  onOpponentSelect: (opponent: AiOpponent) => void;
  onStartGame: (opponentId: string) => void;
}

export const AiOpponentSelector: React.FC<AiOpponentSelectorProps> = ({
  onOpponentSelect,
  onStartGame,
}) => {
  const [opponents, setOpponents] = useState<AiOpponent[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<AiOpponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    loadOpponents();
  }, []);

  const loadOpponents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/ai-opponent/opponents', {
        params: { userId: 'current-user' }, // This should come from auth context
      });

      if (response.data.success) {
        setOpponents(response.data.data);
      } else {
        setError('Failed to load opponents');
      }
    } catch (err) {
      setError('Failed to load AI opponents');
      console.error('Opponents load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpponentSelect = (opponent: AiOpponent) => {
    setSelectedOpponent(opponent);
    onOpponentSelect(opponent);
  };

  const handleStartGame = () => {
    if (selectedOpponent) {
      onStartGame(selectedOpponent.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      case 'expert':
        return '#9C27B0';
      case 'master':
        return '#E91E63';
      default:
        return '#9E9E9E';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '⚡';
      case 'advanced':
        return '🔥';
      case 'expert':
        return '💎';
      case 'master':
        return '👑';
      default:
        return '❓';
    }
  };

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Fire':
        return '🔥';
      case 'Water':
        return '💧';
      case 'Earth':
        return '🌍';
      case 'Air':
        return '💨';
      case 'Light':
        return '✨';
      case 'Dark':
        return '🌑';
      case 'Chaos':
        return '🌀';
      case 'Neutral':
        return '⚪';
      default:
        return '❓';
    }
  };

  const filteredOpponents = opponents.filter(opponent => {
    if (filter === 'unlocked') return opponent.isUnlocked;
    if (filter === 'locked') return !opponent.isUnlocked;
    return true;
  });

  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.spinner} />
        <p>Loading AI opponents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.error}>
        <p>{error}</p>
        <button onClick={loadOpponents} className={s.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>Choose Your AI Opponent</h2>
        <p className={s.subtitle}>Select an AI opponent to challenge</p>
      </div>

      <div className={s.filters}>
        <button
          className={`${s.filterButton} ${filter === 'all' ? s.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All Opponents
        </button>
        <button
          className={`${s.filterButton} ${filter === 'unlocked' ? s.active : ''}`}
          onClick={() => setFilter('unlocked')}
        >
          Unlocked
        </button>
        <button
          className={`${s.filterButton} ${filter === 'locked' ? s.active : ''}`}
          onClick={() => setFilter('locked')}
        >
          Locked
        </button>
      </div>

      <div className={s.opponentsGrid}>
        {filteredOpponents.map((opponent) => (
          <div
            key={opponent.id}
            className={`${s.opponentCard} ${
              selectedOpponent?.id === opponent.id ? s.selected : ''
            } ${!opponent.isUnlocked ? s.locked : ''}`}
            onClick={() => opponent.isUnlocked && handleOpponentSelect(opponent)}
          >
            <div className={s.opponentHeader}>
              <div className={s.opponentAvatar}>
                {opponent.avatar ? (
                  <img src={opponent.avatar} alt={opponent.name} />
                ) : (
                  <div className={s.defaultAvatar}>
                    {getDifficultyIcon(opponent.difficulty)}
                  </div>
                )}
              </div>
              <div className={s.opponentInfo}>
                <h3 className={s.opponentName}>{opponent.name}</h3>
                <div className={s.difficulty}>
                  <span
                    className={s.difficultyIcon}
                    style={{ color: getDifficultyColor(opponent.difficulty) }}
                  >
                    {getDifficultyIcon(opponent.difficulty)}
                  </span>
                  <span
                    className={s.difficultyText}
                    style={{ color: getDifficultyColor(opponent.difficulty) }}
                  >
                    {opponent.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>
              {!opponent.isUnlocked && (
                <div className={s.lockedIcon}>🔒</div>
              )}
            </div>

            <div className={s.opponentDescription}>
              <p>{opponent.description}</p>
            </div>

            <div className={s.opponentDetails}>
              <div className={s.elements}>
                <h4>Preferred Elements</h4>
                <div className={s.elementList}>
                  {opponent.preferredElements.map((element) => (
                    <span key={element} className={s.elementTag}>
                      {getElementIcon(element)} {element}
                    </span>
                  ))}
                </div>
              </div>

              <div className={s.strategies}>
                <h4>Strategies</h4>
                <div className={s.strategyList}>
                  {opponent.preferredStrategies.map((strategy) => (
                    <span key={strategy} className={s.strategyTag}>
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={s.opponentStats}>
              <div className={s.statItem}>
                <span className={s.statLabel}>Games Played</span>
                <span className={s.statValue}>{opponent.stats.gamesPlayed}</span>
              </div>
              <div className={s.statItem}>
                <span className={s.statLabel}>Win Rate</span>
                <span className={s.statValue}>
                  {opponent.stats.winRate.toFixed(1)}%
                </span>
              </div>
              <div className={s.statItem}>
                <span className={s.statLabel}>Avg Game Length</span>
                <span className={s.statValue}>
                  {Math.round(opponent.stats.averageGameLength)}m
                </span>
              </div>
            </div>

            {!opponent.isUnlocked && opponent.unlockRequirements && (
              <div className={s.unlockRequirements}>
                <h4>Unlock Requirements</h4>
                <p>{opponent.unlockRequirements.description}</p>
              </div>
            )}

            {opponent.isUnlocked && (
              <div className={s.personality}>
                <h4>AI Personality</h4>
                <div className={s.personalityBars}>
                  <div className={s.personalityBar}>
                    <span>Aggression</span>
                    <div className={s.bar}>
                      <div
                        className={s.barFill}
                        style={{ width: `${opponent.personality.aggression}%` }}
                      />
                    </div>
                  </div>
                  <div className={s.personalityBar}>
                    <span>Risk Tolerance</span>
                    <div className={s.bar}>
                      <div
                        className={s.barFill}
                        style={{ width: `${opponent.personality.riskTolerance}%` }}
                      />
                    </div>
                  </div>
                  <div className={s.personalityBar}>
                    <span>Creativity</span>
                    <div className={s.bar}>
                      <div
                        className={s.barFill}
                        style={{ width: `${opponent.personality.creativity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedOpponent && selectedOpponent.isUnlocked && (
        <div className={s.actionPanel}>
          <div className={s.selectedOpponent}>
            <h3>Selected: {selectedOpponent.name}</h3>
            <p>{selectedOpponent.description}</p>
          </div>
          <button
            onClick={handleStartGame}
            className={s.startGameButton}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};