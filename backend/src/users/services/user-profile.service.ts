import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { Achievement } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';

interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  preferences?: Partial<UserProfile['preferences']>;
}

interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  percentage: number;
}

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepository: Repository<UserAchievement>,
  ) {}

  async createUserProfile(userId: string): Promise<UserProfile> {
    const existingProfile = await this.userProfileRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      return existingProfile;
    }

    const profile = this.userProfileRepository.create({
      userId,
      displayName: null,
      bio: null,
      avatar: null,
      banner: null,
      preferences: {
        theme: 'auto',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          push: true,
          social: true,
          tournaments: true,
          marketplace: true,
        },
        privacy: {
          profilePublic: true,
          deckPublic: true,
          statsPublic: true,
        },
      },
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        winRate: 0,
        totalPlayTime: 0,
        favoriteElement: null,
        favoriteCard: null,
        longestWinStreak: 0,
        currentWinStreak: 0,
        totalDecksCreated: 0,
        totalCardsCollected: 0,
        tournamentsEntered: 0,
        tournamentsWon: 0,
        highestRanking: 0,
        currentRanking: 0,
        lastActive: new Date(),
      },
      achievements: [],
      badges: [],
      socialConnections: [],
      gameHistory: {
        recentGames: [],
        favoriteDecks: [],
        elementStats: {},
      },
      collectionStats: {
        totalCards: 0,
        uniqueCards: 0,
        completionRate: 0,
        cardsByElement: {},
        cardsByRarity: {},
        mostValuableCard: null,
        collectionValue: 0,
      },
      tournamentStats: {
        totalTournaments: 0,
        tournamentsWon: 0,
        topFinishes: 0,
        averageFinish: 0,
        bestFinish: 0,
        totalPrizeMoney: 0,
        currentRating: 1000,
        highestRating: 1000,
        ratingHistory: [],
      },
    });

    return this.userProfileRepository.save(profile);
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      return this.createUserProfile(userId);
    }

    return profile;
  }

  async updateUserProfile(userId: string, data: ProfileUpdateData): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);

    Object.assign(profile, data);

    return this.userProfileRepository.save(profile);
  }

  async updateUserStats(userId: string, stats: Partial<UserProfile['stats']>): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);

    Object.assign(profile.stats, stats);

    // Recalculate win rate
    if (stats.gamesPlayed !== undefined || stats.gamesWon !== undefined) {
      profile.stats.winRate = profile.stats.gamesPlayed > 0 
        ? (profile.stats.gamesWon / profile.stats.gamesPlayed) * 100 
        : 0;
    }

    // Update last active
    profile.stats.lastActive = new Date();

    return this.userProfileRepository.save(profile);
  }

  async addGameResult(userId: string, gameData: {
    opponent: string;
    result: 'win' | 'loss' | 'draw';
    duration: number;
    deckUsed: string;
    elementUsed: string;
  }): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);

    // Update basic stats
    profile.stats.gamesPlayed++;
    if (gameData.result === 'win') {
      profile.stats.gamesWon++;
      profile.stats.currentWinStreak++;
      if (profile.stats.currentWinStreak > profile.stats.longestWinStreak) {
        profile.stats.longestWinStreak = profile.stats.currentWinStreak;
      }
    } else if (gameData.result === 'loss') {
      profile.stats.gamesLost++;
      profile.stats.currentWinStreak = 0;
    }

    // Update win rate
    profile.stats.winRate = (profile.stats.gamesWon / profile.stats.gamesPlayed) * 100;

    // Add to game history
    profile.gameHistory.recentGames.unshift({
      id: `game_${Date.now()}`,
      opponent: gameData.opponent,
      result: gameData.result,
      date: new Date(),
      duration: gameData.duration,
      deckUsed: gameData.deckUsed,
    });

    // Keep only last 50 games
    if (profile.gameHistory.recentGames.length > 50) {
      profile.gameHistory.recentGames = profile.gameHistory.recentGames.slice(0, 50);
    }

    // Update element stats
    if (!profile.gameHistory.elementStats[gameData.elementUsed]) {
      profile.gameHistory.elementStats[gameData.elementUsed] = {
        gamesPlayed: 0,
        gamesWon: 0,
        winRate: 0,
      };
    }

    const elementStats = profile.gameHistory.elementStats[gameData.elementUsed];
    elementStats.gamesPlayed++;
    if (gameData.result === 'win') {
      elementStats.gamesWon++;
    }
    elementStats.winRate = (elementStats.gamesWon / elementStats.gamesPlayed) * 100;

    // Update favorite element
    const elementStatsArray = Object.entries(profile.gameHistory.elementStats);
    if (elementStatsArray.length > 0) {
      const favoriteElement = elementStatsArray.reduce((a, b) => 
        a[1].gamesPlayed > b[1].gamesPlayed ? a : b
      )[0];
      profile.stats.favoriteElement = favoriteElement;
    }

    // Update total play time
    profile.stats.totalPlayTime += gameData.duration;

    // Check for achievements
    await this.checkAchievements(userId);

    return this.userProfileRepository.save(profile);
  }

  async addDeckCreated(userId: string, deckName: string): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);

    profile.stats.totalDecksCreated++;

    // Add to favorite decks
    const existingDeck = profile.gameHistory.favoriteDecks.find(d => d.name === deckName);
    if (existingDeck) {
      existingDeck.gamesPlayed++;
    } else {
      profile.gameHistory.favoriteDecks.push({
        deckId: `deck_${Date.now()}`,
        name: deckName,
        gamesPlayed: 0,
        winRate: 0,
      });
    }

    await this.checkAchievements(userId);

    return this.userProfileRepository.save(profile);
  }

  async addCardCollected(userId: string, cardId: string): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);

    profile.stats.totalCardsCollected++;
    profile.collectionStats.totalCards++;
    profile.collectionStats.uniqueCards = new Set([
      ...(profile.collectionStats.uniqueCards || []),
      cardId
    ]).size;

    await this.checkAchievements(userId);

    return this.userProfileRepository.save(profile);
  }

  async addTournamentResult(userId: string, tournamentData: {
    tournamentId: string;
    result: 'win' | 'loss' | 'draw';
    finish: number;
    prizeMoney: number;
  }): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);

    profile.tournamentStats.totalTournaments++;
    if (tournamentData.result === 'win') {
      profile.tournamentStats.tournamentsWon++;
    }

    if (tournamentData.finish <= 3) {
      profile.tournamentStats.topFinishes++;
    }

    if (tournamentData.finish < profile.tournamentStats.bestFinish || profile.tournamentStats.bestFinish === 0) {
      profile.tournamentStats.bestFinish = tournamentData.finish;
    }

    profile.tournamentStats.totalPrizeMoney += tournamentData.prizeMoney;

    // Update average finish
    const totalFinish = profile.tournamentStats.averageFinish * (profile.tournamentStats.totalTournaments - 1) + tournamentData.finish;
    profile.tournamentStats.averageFinish = totalFinish / profile.tournamentStats.totalTournaments;

    await this.checkAchievements(userId);

    return this.userProfileRepository.save(profile);
  }

  async checkAchievements(userId: string): Promise<void> {
    const profile = await this.getUserProfile(userId);
    const achievements = await this.achievementRepository.find({
      where: { isActive: true },
    });

    for (const achievement of achievements) {
      const existingUserAchievement = await this.userAchievementRepository.findOne({
        where: { userId, achievementId: achievement.id },
      });

      if (existingUserAchievement) continue;

      let shouldUnlock = false;
      let progress = 0;

      switch (achievement.requirements.type) {
        case 'games_played':
          progress = profile.stats.gamesPlayed;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
        case 'games_won':
          progress = profile.stats.gamesWon;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
        case 'win_streak':
          progress = profile.stats.longestWinStreak;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
        case 'decks_created':
          progress = profile.stats.totalDecksCreated;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
        case 'cards_collected':
          progress = profile.stats.totalCardsCollected;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
        case 'tournaments_entered':
          progress = profile.tournamentStats.totalTournaments;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
        case 'tournaments_won':
          progress = profile.tournamentStats.tournamentsWon;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
        case 'social_connections':
          progress = profile.socialConnections.length;
          shouldUnlock = progress >= achievement.requirements.value;
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
      } else {
        // Update progress
        await this.updateAchievementProgress(userId, achievement.id, progress, achievement.requirements.value);
      }
    }
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const achievement = await this.achievementRepository.findOne({
      where: { id: achievementId },
    });

    if (!achievement) return;

    const userAchievement = this.userAchievementRepository.create({
      userId,
      achievementId,
      unlockedAt: new Date(),
      isNew: true,
    });

    await this.userAchievementRepository.save(userAchievement);

    // Add to profile achievements
    const profile = await this.getUserProfile(userId);
    profile.achievements.push({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      unlockedAt: new Date(),
      rarity: achievement.rarity,
      category: achievement.category,
    });

    await this.userProfileRepository.save(profile);

    this.logger.log(`Achievement unlocked: ${achievement.name} for user ${userId}`);
  }

  async updateAchievementProgress(userId: string, achievementId: string, current: number, target: number): Promise<void> {
    const userAchievement = await this.userAchievementRepository.findOne({
      where: { userId, achievementId },
    });

    if (userAchievement) {
      userAchievement.progress = {
        current,
        target,
        percentage: (current / target) * 100,
      };
      await this.userAchievementRepository.save(userAchievement);
    }
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementRepository.find({
      where: { userId },
      relations: ['achievement'],
      order: { unlockedAt: 'DESC' },
    });
  }

  async getLeaderboard(limit = 10): Promise<Array<{
    userId: string;
    displayName: string;
    avatar: string;
    stats: UserProfile['stats'];
    rank: number;
  }>> {
    const profiles = await this.userProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .orderBy('profile.stats->winRate', 'DESC')
      .addOrderBy('profile.stats->gamesPlayed', 'DESC')
      .limit(limit)
      .getMany();

    return profiles.map((profile, index) => ({
      userId: profile.userId,
      displayName: profile.displayName || profile.user.username,
      avatar: profile.avatar,
      stats: profile.stats,
      rank: index + 1,
    }));
  }

  async getProfileStats(userId: string): Promise<{
    profile: UserProfile;
    achievements: UserAchievement[];
    leaderboardPosition: number;
  }> {
    const profile = await this.getUserProfile(userId);
    const achievements = await this.getUserAchievements(userId);
    
    // Get leaderboard position
    const leaderboard = await this.getLeaderboard(1000);
    const leaderboardPosition = leaderboard.findIndex(p => p.userId === userId) + 1;

    return {
      profile,
      achievements,
      leaderboardPosition: leaderboardPosition || 0,
    };
  }
}