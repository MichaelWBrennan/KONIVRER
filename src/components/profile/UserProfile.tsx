import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import * as s from './userProfile.css';

interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatar: string;
  banner: string;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    winRate: number;
    totalPlayTime: number;
    favoriteElement: string;
    favoriteCard: string;
    longestWinStreak: number;
    currentWinStreak: number;
    totalDecksCreated: number;
    totalCardsCollected: number;
    tournamentsEntered: number;
    tournamentsWon: number;
    highestRanking: number;
    currentRanking: number;
    lastActive: string;
  };
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    category: 'games' | 'decks' | 'tournaments' | 'collection' | 'social' | 'special';
  }>;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    category: 'achievement' | 'tournament' | 'social' | 'special';
  }>;
  socialConnections: Array<{
    platform: 'discord' | 'twitter' | 'youtube' | 'twitch' | 'reddit' | 'instagram';
    username: string;
    connectedAt: string;
    verified: boolean;
  }>;
  gameHistory: {
    recentGames: Array<{
      id: string;
      opponent: string;
      result: 'win' | 'loss' | 'draw';
      date: string;
      duration: number;
      deckUsed: string;
    }>;
    favoriteDecks: Array<{
      deckId: string;
      name: string;
      gamesPlayed: number;
      winRate: number;
    }>;
    elementStats: Record<string, {
      gamesPlayed: number;
      gamesWon: number;
      winRate: number;
    }>;
  };
  collectionStats: {
    totalCards: number;
    uniqueCards: number;
    completionRate: number;
    cardsByElement: Record<string, number>;
    cardsByRarity: Record<string, number>;
    mostValuableCard: string;
    collectionValue: number;
  };
  tournamentStats: {
    totalTournaments: number;
    tournamentsWon: number;
    topFinishes: number;
    averageFinish: number;
    bestFinish: number;
    totalPrizeMoney: number;
    currentRating: number;
    highestRating: number;
    ratingHistory: Array<{
      date: string;
      rating: number;
      change: number;
    }>;
  };
}

interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
  isNew: boolean;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    category: string;
  };
}

export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats' | 'history'>('overview');

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/users/${userId}/profile`);
      if (response.data.success) {
        setProfile(response.data.data.profile);
        setAchievements(response.data.data.achievements);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#9E9E9E';
      case 'uncommon':
        return '#4CAF50';
      case 'rare':
        return '#2196F3';
      case 'epic':
        return '#9C27B0';
      case 'legendary':
        return '#FF9800';
      default:
        return '#9E9E9E';
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
      default:
        return '⚪';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'discord':
        return '💬';
      case 'twitter':
        return '🐦';
      case 'youtube':
        return '📺';
      case 'twitch':
        return '🎮';
      case 'reddit':
        return '🤖';
      case 'instagram':
        return '📷';
      default:
        return '🔗';
    }
  };

  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.spinner} />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={s.error}>
        <p>{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.banner}>
          {profile.banner && (
            <img src={profile.banner} alt="Banner" className={s.bannerImage} />
          )}
        </div>
        <div className={s.profileInfo}>
          <div className={s.avatarSection}>
            <img
              src={profile.avatar || '/assets/default-avatar.png'}
              alt="Avatar"
              className={s.avatar}
            />
          </div>
          <div className={s.userInfo}>
            <h1 className={s.displayName}>
              {profile.displayName || 'Anonymous Player'}
            </h1>
            <p className={s.bio}>{profile.bio || 'No bio available'}</p>
            <div className={s.socialConnections}>
              {profile.socialConnections.map((connection) => (
                <a
                  key={connection.platform}
                  href={`https://${connection.platform}.com/${connection.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.socialLink}
                >
                  {getPlatformIcon(connection.platform)}
                  <span>{connection.username}</span>
                  {connection.verified && <span className={s.verified}>✓</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={s.tabs}>
        <button
          className={`${s.tab} ${activeTab === 'overview' ? s.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`${s.tab} ${activeTab === 'achievements' ? s.active : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button
          className={`${s.tab} ${activeTab === 'stats' ? s.active : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Stats
        </button>
        <button
          className={`${s.tab} ${activeTab === 'history' ? s.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      <div className={s.content}>
        {activeTab === 'overview' && (
          <div className={s.overview}>
            <div className={s.statsGrid}>
              <div className={s.statCard}>
                <div className={s.statIcon}>🎮</div>
                <div className={s.statContent}>
                  <h3>Games Played</h3>
                  <p className={s.statValue}>{profile.stats.gamesPlayed}</p>
                </div>
              </div>
              <div className={s.statCard}>
                <div className={s.statIcon}>🏆</div>
                <div className={s.statContent}>
                  <h3>Win Rate</h3>
                  <p className={s.statValue}>{profile.stats.winRate.toFixed(1)}%</p>
                </div>
              </div>
              <div className={s.statCard}>
                <div className={s.statIcon}>🔥</div>
                <div className={s.statContent}>
                  <h3>Current Streak</h3>
                  <p className={s.statValue}>{profile.stats.currentWinStreak}</p>
                </div>
              </div>
              <div className={s.statCard}>
                <div className={s.statIcon}>⏱️</div>
                <div className={s.statContent}>
                  <h3>Play Time</h3>
                  <p className={s.statValue}>{formatPlayTime(profile.stats.totalPlayTime)}</p>
                </div>
              </div>
              <div className={s.statCard}>
                <div className={s.statIcon}>🃏</div>
                <div className={s.statContent}>
                  <h3>Decks Created</h3>
                  <p className={s.statValue}>{profile.stats.totalDecksCreated}</p>
                </div>
              </div>
              <div className={s.statCard}>
                <div className={s.statIcon}>💎</div>
                <div className={s.statContent}>
                  <h3>Cards Collected</h3>
                  <p className={s.statValue}>{profile.stats.totalCardsCollected}</p>
                </div>
              </div>
            </div>

            <div className={s.favoriteElement}>
              <h3>Favorite Element</h3>
              <div className={s.elementDisplay}>
                <span className={s.elementIcon}>
                  {getElementIcon(profile.stats.favoriteElement)}
                </span>
                <span className={s.elementName}>
                  {profile.stats.favoriteElement || 'None'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className={s.achievements}>
            <div className={s.achievementsGrid}>
              {profile.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={s.achievementCard}
                  style={{ borderColor: getRarityColor(achievement.rarity) }}
                >
                  <div className={s.achievementIcon}>
                    {achievement.icon || '🏆'}
                  </div>
                  <div className={s.achievementInfo}>
                    <h4 className={s.achievementName}>{achievement.name}</h4>
                    <p className={s.achievementDescription}>{achievement.description}</p>
                    <div className={s.achievementMeta}>
                      <span
                        className={s.achievementRarity}
                        style={{ color: getRarityColor(achievement.rarity) }}
                      >
                        {achievement.rarity}
                      </span>
                      <span className={s.achievementDate}>
                        {formatDate(achievement.unlockedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className={s.stats}>
            <div className={s.statsSection}>
              <h3>Game Statistics</h3>
              <div className={s.statsTable}>
                <div className={s.statsRow}>
                  <span>Games Won</span>
                  <span>{profile.stats.gamesWon}</span>
                </div>
                <div className={s.statsRow}>
                  <span>Games Lost</span>
                  <span>{profile.stats.gamesLost}</span>
                </div>
                <div className={s.statsRow}>
                  <span>Longest Win Streak</span>
                  <span>{profile.stats.longestWinStreak}</span>
                </div>
                <div className={s.statsRow}>
                  <span>Total Play Time</span>
                  <span>{formatPlayTime(profile.stats.totalPlayTime)}</span>
                </div>
              </div>
            </div>

            <div className={s.statsSection}>
              <h3>Element Statistics</h3>
              <div className={s.elementStats}>
                {Object.entries(profile.gameHistory.elementStats).map(([element, stats]) => (
                  <div key={element} className={s.elementStat}>
                    <div className={s.elementStatHeader}>
                      <span className={s.elementStatIcon}>
                        {getElementIcon(element)}
                      </span>
                      <span className={s.elementStatName}>{element}</span>
                    </div>
                    <div className={s.elementStatDetails}>
                      <span>{stats.gamesPlayed} games</span>
                      <span>{stats.winRate.toFixed(1)}% win rate</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.statsSection}>
              <h3>Tournament Statistics</h3>
              <div className={s.statsTable}>
                <div className={s.statsRow}>
                  <span>Tournaments Entered</span>
                  <span>{profile.tournamentStats.totalTournaments}</span>
                </div>
                <div className={s.statsRow}>
                  <span>Tournaments Won</span>
                  <span>{profile.tournamentStats.tournamentsWon}</span>
                </div>
                <div className={s.statsRow}>
                  <span>Best Finish</span>
                  <span>#{profile.tournamentStats.bestFinish}</span>
                </div>
                <div className={s.statsRow}>
                  <span>Current Rating</span>
                  <span>{profile.tournamentStats.currentRating}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={s.history}>
            <div className={s.historySection}>
              <h3>Recent Games</h3>
              <div className={s.gamesList}>
                {profile.gameHistory.recentGames.slice(0, 10).map((game) => (
                  <div key={game.id} className={s.gameItem}>
                    <div className={s.gameResult}>
                      <span className={`${s.resultBadge} ${s[game.result]}`}>
                        {game.result.toUpperCase()}
                      </span>
                    </div>
                    <div className={s.gameDetails}>
                      <span className={s.gameOpponent}>vs {game.opponent}</span>
                      <span className={s.gameDeck}>{game.deckUsed}</span>
                      <span className={s.gameDate}>{formatDate(game.date)}</span>
                    </div>
                    <div className={s.gameDuration}>
                      {formatPlayTime(game.duration)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.historySection}>
              <h3>Favorite Decks</h3>
              <div className={s.decksList}>
                {profile.gameHistory.favoriteDecks.map((deck) => (
                  <div key={deck.deckId} className={s.deckItem}>
                    <div className={s.deckName}>{deck.name}</div>
                    <div className={s.deckStats}>
                      <span>{deck.gamesPlayed} games</span>
                      <span>{deck.winRate.toFixed(1)}% win rate</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};