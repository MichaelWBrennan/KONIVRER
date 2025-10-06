import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ type: 'json', default: '{}' })
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      social: boolean;
      tournaments: boolean;
      marketplace: boolean;
    };
    privacy: {
      profilePublic: boolean;
      deckPublic: boolean;
      statsPublic: boolean;
    };
  };

  @Column({ type: 'json', default: '{}' })
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    winRate: number;
    totalPlayTime: number; // in minutes
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
    lastActive: Date;
  };

  @Column({ type: 'json', default: '[]' })
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    category: 'games' | 'decks' | 'tournaments' | 'collection' | 'social' | 'special';
  }>;

  @Column({ type: 'json', default: '[]' })
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
    category: 'achievement' | 'tournament' | 'social' | 'special';
  }>;

  @Column({ type: 'json', default: '[]' })
  socialConnections: Array<{
    platform: 'discord' | 'twitter' | 'youtube' | 'twitch' | 'reddit' | 'instagram';
    username: string;
    connectedAt: Date;
    verified: boolean;
  }>;

  @Column({ type: 'json', default: '{}' })
  gameHistory: {
    recentGames: Array<{
      id: string;
      opponent: string;
      result: 'win' | 'loss' | 'draw';
      date: Date;
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

  @Column({ type: 'json', default: '{}' })
  collectionStats: {
    totalCards: number;
    uniqueCards: number;
    completionRate: number;
    cardsByElement: Record<string, number>;
    cardsByRarity: Record<string, number>;
    mostValuableCard: string;
    collectionValue: number;
  };

  @Column({ type: 'json', default: '{}' })
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
      date: Date;
      rating: number;
      change: number;
    }>;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}