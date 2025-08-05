import { Card, Deck } from '../../ai/DeckOptimizer';

export interface PlayerProgression {
  playerId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalExperience: number;
  masteryTracks: Map<string, MasteryTrack>;
  achievements: Map<string, PlayerAchievement>;
  cosmetics: PlayerCosmetics;
  seasonalProgress: SeasonalProgress;
  prestige: PrestigeData;
}

export interface MasteryTrack {
  archetype: string;
  name: string;
  level: number;
  currentExperience: number;
  maxLevel: number;
  milestones: Milestone[];
  completedMilestones: Set<string>;
  rewards: CosmeticReward[];
  unlockedRewards: Set<string>;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  requirement: MilestoneRequirement;
  experienceReward: number;
  cosmeticReward?: CosmeticReward;
  isSecret: boolean;
}

export interface MilestoneRequirement {
  type:
    | 'games-played'
    | 'games-won'
    | 'cards-played'
    | 'specific-combo'
    | 'deck-building'
    | 'tournament'
    | 'training';
  count?: number;
  specificCards?: string[];
  conditions?: { [key: string]: any };
}

export interface PlayerAchievement {
  id: string;
  name: string;
  description: string;
  category:
    | 'strategic'
    | 'collection'
    | 'social'
    | 'competitive'
    | 'creative'
    | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
  rewards: CosmeticReward[];
  hidden: boolean;
}

export interface CosmeticReward {
  id: string;
  type:
    | 'card-back'
    | 'board-theme'
    | 'avatar-frame'
    | 'title'
    | 'emote'
    | 'particle-effect'
    | 'sound-pack';
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  previewUrl?: string;
  unlockCondition: string;
  category: string;
}

export interface PlayerCosmetics {
  equippedCardBack: string;
  equippedBoardTheme: string;
  equippedAvatarFrame: string;
  equippedTitle: string;
  equippedEmotes: string[];
  equippedParticleEffect: string;
  equippedSoundPack: string;
  unlockedCosmetics: Set<string>;
  favoritedCosmetics: Set<string>;
}

export interface SeasonalProgress {
  currentSeason: SeasonInfo;
  seasonLevel: number;
  seasonExperience: number;
  completedChallenges: Set<string>;
  availableChallenges: SeasonalChallenge[];
  seasonRewards: SeasonalReward[];
  unlockedSeasonalRewards: Set<string>;
}

export interface SeasonInfo {
  id: string;
  name: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  description: string;
  specialFeatures: string[];
}

export interface SeasonalChallenge {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  category: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  requirement: ChallengeRequirement;
  rewards: SeasonalReward[];
  expiresAt?: Date; // null = never expires
  isActive: boolean;
}

export interface ChallengeRequirement {
  type:
    | 'win-games'
    | 'play-archetype'
    | 'use-card'
    | 'complete-combo'
    | 'deck-build'
    | 'social';
  target: number;
  current: number;
  conditions: { [key: string]: any };
}

export interface SeasonalReward {
  id: string;
  type: 'experience' | 'cosmetic' | 'title' | 'special';
  amount?: number;
  cosmeticId?: string;
  description: string;
  tier: number;
}

export interface PrestigeData {
  level: number;
  totalPrestigePoints: number;
  prestigeBenefits: PrestigeBenefit[];
  prestigeHistory: PrestigeLevel[];
  nextPrestigeRequirement: number;
}

export interface PrestigeBenefit {
  id: string;
  name: string;
  description: string;
  type: 'cosmetic' | 'gameplay' | 'social' | 'collection';
  effect: string;
  isActive: boolean;
}

export interface PrestigeLevel {
  level: number;
  achievedAt: Date;
  rewards: CosmeticReward[];
  specialTitle: string;
}

export class ProgressionSystem {
  private playerProgressions: Map<string, PlayerProgression> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private cosmetics: Map<string, CosmeticReward> = new Map();
  private currentSeason: SeasonInfo;
  private seasonalChallenges: Map<string, SeasonalChallenge> = new Map();

  constructor() {
    this.initializeAchievements();
    this.initializeCosmetics();
    this.initializeCurrentSeason();
    this.initializeSeasonalChallenges();
  }

  private initializeAchievements(): void {
    const coreAchievements: Achievement[] = [
      {
        id: 'first-victory',
        name: 'First Victory',
        description: 'Win your first game',
        category: 'strategic',
        rarity: 'common',
        requirement: {
          type: 'games-won',
          count: 1,
          conditions: {},
        },
        rewards: [
          {
            id: 'victory-frame',
            type: 'avatar-frame',
            name: 'Victory Frame',
            description: 'A golden frame celebrating your first win',
            rarity: 'common',
            unlockCondition: 'Win your first game',
            category: 'frames',
          },
        ],
        hidden: false,
        experienceReward: 100,
      },
      {
        id: 'combo-master',
        name: 'Combo Master',
        description: 'Execute 50 successful card combinations',
        category: 'mastery',
        rarity: 'rare',
        requirement: {
          type: 'specific-combo',
          count: 50,
          conditions: { comboType: 'any' },
        },
        rewards: [
          {
            id: 'combo-particle',
            type: 'particle-effect',
            name: 'Combo Sparks',
            description: 'Magical sparks appear when you play combinations',
            rarity: 'rare',
            unlockCondition: 'Execute 50 combos',
            category: 'effects',
          },
        ],
        hidden: false,
        experienceReward: 500,
      },
      {
        id: 'deck-architect',
        name: 'Deck Architect',
        description: 'Create and save 10 different deck compositions',
        category: 'creative',
        rarity: 'rare',
        requirement: {
          type: 'deck-building',
          count: 10,
          conditions: {},
        },
        rewards: [
          {
            id: 'architect-title',
            type: 'title',
            name: 'Deck Architect',
            description: 'Title showing your deck building prowess',
            rarity: 'rare',
            unlockCondition: 'Create 10 different decks',
            category: 'titles',
          },
        ],
        hidden: false,
        experienceReward: 300,
      },
      {
        id: 'tournament-champion',
        name: 'Tournament Champion',
        description: 'Win a tournament event',
        category: 'competitive',
        rarity: 'epic',
        requirement: {
          type: 'tournament',
          count: 1,
          conditions: { placement: 1 },
        },
        rewards: [
          {
            id: 'champion-crown',
            type: 'avatar-frame',
            name: 'Champion Crown',
            description: 'Prestigious crown frame for tournament winners',
            rarity: 'epic',
            unlockCondition: 'Win a tournament',
            category: 'frames',
          },
        ],
        hidden: false,
        experienceReward: 1000,
      },
      {
        id: 'legend-slayer',
        name: 'Legend Slayer',
        description: 'Defeat a legendary-tier AI opponent',
        category: 'mastery',
        rarity: 'legendary',
        requirement: {
          type: 'training',
          count: 1,
          conditions: { aiDifficulty: 'legendary', result: 'win' },
        },
        rewards: [
          {
            id: 'legend-aura',
            type: 'particle-effect',
            name: 'Legendary Aura',
            description: 'Golden aura effect surrounding your avatar',
            rarity: 'legendary',
            unlockCondition: 'Defeat legendary AI',
            category: 'effects',
          },
        ],
        hidden: true,
        experienceReward: 2000,
      },
    ];

    coreAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  private initializeCosmetics(): void {
    const coreCosmetics: CosmeticReward[] = [
      // Card Backs
      {
        id: 'mystic-stars',
        type: 'card-back',
        name: 'Mystic Stars',
        description: 'Card back featuring swirling mystical stars',
        rarity: 'common',
        unlockCondition: 'Starting cosmetic',
        category: 'card-backs',
      },
      {
        id: 'void-energy',
        type: 'card-back',
        name: 'Void Energy',
        description: 'Dark energy patterns with purple accents',
        rarity: 'rare',
        unlockCondition: 'Win 25 games',
        category: 'card-backs',
      },
      {
        id: 'crystal-prism',
        type: 'card-back',
        name: 'Crystal Prism',
        description: 'Refracting crystal patterns in multiple colors',
        rarity: 'epic',
        unlockCondition: 'Reach level 20',
        category: 'card-backs',
      },

      // Board Themes
      {
        id: 'enchanted-forest',
        type: 'board-theme',
        name: 'Enchanted Forest',
        description: 'Mystical forest with glowing mushrooms and fireflies',
        rarity: 'rare',
        unlockCondition: 'Complete Nature mastery track',
        category: 'boards',
      },
      {
        id: 'cosmic-void',
        type: 'board-theme',
        name: 'Cosmic Void',
        description: 'Deep space with swirling galaxies and nebulae',
        rarity: 'epic',
        unlockCondition: 'Win 100 games',
        category: 'boards',
      },

      // Avatar Frames
      {
        id: 'apprentice-circle',
        type: 'avatar-frame',
        name: 'Apprentice Circle',
        description: 'Simple circular frame for new players',
        rarity: 'common',
        unlockCondition: 'Starting cosmetic',
        category: 'frames',
      },
      {
        id: 'master-hexagon',
        type: 'avatar-frame',
        name: 'Master Hexagon',
        description: 'Intricate hexagonal frame with runes',
        rarity: 'rare',
        unlockCondition: 'Master any archetype',
        category: 'frames',
      },

      // Titles
      {
        id: 'novice-summoner',
        type: 'title',
        name: 'Novice Summoner',
        description: 'Entry-level title for new players',
        rarity: 'common',
        unlockCondition: 'Complete tutorial',
        category: 'titles',
      },
      {
        id: 'mystic-scholar',
        type: 'title',
        name: 'Mystic Scholar',
        description: 'For players who study the arcane arts',
        rarity: 'rare',
        unlockCondition: 'Read all archetype guides',
        category: 'titles',
      },
    ];

    coreCosmetics.forEach(cosmetic => {
      this.cosmetics.set(cosmetic.id, cosmetic);
    });
  }

  private initializeCurrentSeason(): void {
    this.currentSeason = {
      id: 'season-1',
      name: 'The Mystic Awakening',
      theme: 'Ancient mystical powers emerge from the forgotten realms',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-04-01'),
      description:
        'Discover the secrets of ancient magic in this inaugural season',
      specialFeatures: [
        'New mystical card backs',
        'Exclusive seasonal challenges',
        'Limited-time board themes',
      ],
    };
  }

  private initializeSeasonalChallenges(): void {
    const challenges: SeasonalChallenge[] = [
      {
        id: 'daily-victory',
        name: 'Daily Victory',
        description: 'Win 1 game today',
        difficulty: 'easy',
        category: 'daily',
        requirement: {
          type: 'win-games',
          target: 1,
          current: 0,
          conditions: { timeframe: 'daily' },
        },
        rewards: [
          {
            id: 'daily-exp',
            type: 'experience',
            amount: 50,
            description: '50 Experience Points',
            tier: 1,
          },
        ],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isActive: true,
      },
      {
        id: 'weekly-mastery',
        name: 'Weekly Mastery',
        description: 'Play 20 games with any archetype',
        difficulty: 'medium',
        category: 'weekly',
        requirement: {
          type: 'play-archetype',
          target: 20,
          current: 0,
          conditions: { archetype: 'any' },
        },
        rewards: [
          {
            id: 'weekly-cosmetic',
            type: 'cosmetic',
            cosmeticId: 'mystic-emote',
            description: 'Mystic Gesture Emote',
            tier: 2,
          },
        ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isActive: true,
      },
      {
        id: 'seasonal-legend',
        name: 'Seasonal Legend',
        description: 'Reach the top of the seasonal leaderboard',
        difficulty: 'legendary',
        category: 'seasonal',
        requirement: {
          type: 'win-games',
          target: 100,
          current: 0,
          conditions: { ranked: true, season: 'season-1' },
        },
        rewards: [
          {
            id: 'legend-title',
            type: 'special',
            description: 'Exclusive "Seasonal Legend" title',
            tier: 4,
          },
        ],
        isActive: true,
      },
    ];

    challenges.forEach(challenge => {
      this.seasonalChallenges.set(challenge.id, challenge);
    });
  }

  getPlayerProgression(playerId: string): PlayerProgression {
    if (!this.playerProgressions.has(playerId)) {
      const newProgression = this.createNewPlayerProgression(playerId);
      this.playerProgressions.set(playerId, newProgression);
      return newProgression;
    }
    return this.playerProgressions.get(playerId)!;
  }

  private createNewPlayerProgression(playerId: string): PlayerProgression {
    return {
      playerId,
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      totalExperience: 0,
      masteryTracks: this.initializeMasteryTracks(),
      achievements: new Map(),
      cosmetics: this.initializePlayerCosmetics(),
      seasonalProgress: this.initializeSeasonalProgress(),
      prestige: {
        level: 0,
        totalPrestigePoints: 0,
        prestigeBenefits: [],
        prestigeHistory: [],
        nextPrestigeRequirement: 1000000, // 1 million XP for first prestige
      },
    };
  }

  private initializeMasteryTracks(): Map<string, MasteryTrack> {
    const tracks = new Map<string, MasteryTrack>();

    const archetypes = ['aggro', 'control', 'combo', 'midrange', 'tempo'];

    archetypes.forEach(archetype => {
      const track: MasteryTrack = {
        archetype,
        name: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Mastery`,
        level: 0,
        currentExperience: 0,
        maxLevel: 50,
        milestones: this.generateMasteryMilestones(archetype),
        completedMilestones: new Set(),
        rewards: this.generateMasteryRewards(archetype),
        unlockedRewards: new Set(),
      };
      tracks.set(archetype, track);
    });

    return tracks;
  }

  private generateMasteryMilestones(archetype: string): Milestone[] {
    return [
      {
        id: `${archetype}-novice`,
        name: `${archetype} Novice`,
        description: `Play 10 games with ${archetype} decks`,
        requirement: {
          type: 'games-played',
          count: 10,
          conditions: { archetype },
        },
        experienceReward: 200,
        isSecret: false,
      },
      {
        id: `${archetype}-adept`,
        name: `${archetype} Adept`,
        description: `Win 25 games with ${archetype} decks`,
        requirement: {
          type: 'games-won',
          count: 25,
          conditions: { archetype },
        },
        experienceReward: 500,
        cosmeticReward: {
          id: `${archetype}-card-back`,
          type: 'card-back',
          name: `${archetype} Card Back`,
          description: `Exclusive card back for ${archetype} masters`,
          rarity: 'rare',
          unlockCondition: `Master ${archetype} archetype`,
          category: 'card-backs',
        },
        isSecret: false,
      },
      {
        id: `${archetype}-master`,
        name: `${archetype} Master`,
        description: `Win 100 games with ${archetype} decks`,
        requirement: {
          type: 'games-won',
          count: 100,
          conditions: { archetype },
        },
        experienceReward: 1000,
        cosmeticReward: {
          id: `${archetype}-master-title`,
          type: 'title',
          name: `${archetype} Master`,
          description: `Prestigious title for ${archetype} mastery`,
          rarity: 'epic',
          unlockCondition: `Complete ${archetype} mastery track`,
          category: 'titles',
        },
        isSecret: false,
      },
    ];
  }

  private generateMasteryRewards(archetype: string): CosmeticReward[] {
    return [
      {
        id: `${archetype}-badge`,
        type: 'avatar-frame',
        name: `${archetype} Badge`,
        description: `Badge showing your ${archetype} expertise`,
        rarity: 'common',
        unlockCondition: `Reach level 10 in ${archetype} mastery`,
        category: 'frames',
      },
    ];
  }

  private initializePlayerCosmetics(): PlayerCosmetics {
    return {
      equippedCardBack: 'mystic-stars',
      equippedBoardTheme: 'default',
      equippedAvatarFrame: 'apprentice-circle',
      equippedTitle: 'novice-summoner',
      equippedEmotes: [],
      equippedParticleEffect: 'none',
      equippedSoundPack: 'default',
      unlockedCosmetics: new Set([
        'mystic-stars',
        'apprentice-circle',
        'novice-summoner',
      ]),
      favoritedCosmetics: new Set(),
    };
  }

  private initializeSeasonalProgress(): SeasonalProgress {
    return {
      currentSeason: this.currentSeason,
      seasonLevel: 1,
      seasonExperience: 0,
      completedChallenges: new Set(),
      availableChallenges: Array.from(this.seasonalChallenges.values()),
      seasonRewards: this.generateSeasonalRewards(),
      unlockedSeasonalRewards: new Set(),
    };
  }

  private generateSeasonalRewards(): SeasonalReward[] {
    return [
      {
        id: 'season-1-tier-1',
        type: 'cosmetic',
        cosmeticId: 'mystic-awakening-card-back',
        description: 'Mystic Awakening Card Back',
        tier: 1,
      },
      {
        id: 'season-1-tier-5',
        type: 'cosmetic',
        cosmeticId: 'awakening-board-theme',
        description: 'Awakening Board Theme',
        tier: 5,
      },
      {
        id: 'season-1-tier-10',
        type: 'title',
        description: 'Awakened One Title',
        tier: 10,
      },
    ];
  }

  awardExperience(
    playerId: string,
    amount: number,
    source: string,
    category?: string,
  ): LevelUpResult {
    const progression = this.getPlayerProgression(playerId);

    progression.experience += amount;
    progression.totalExperience += amount;

    // Update mastery track if applicable
    if (category && progression.masteryTracks.has(category)) {
      const track = progression.masteryTracks.get(category)!;
      track.currentExperience += amount;
    }

    const levelUpResult = this.checkLevelUp(progression);
    this.checkAchievements(playerId, { type: 'experience', amount, source });

    return levelUpResult;
  }

  private checkLevelUp(progression: PlayerProgression): LevelUpResult {
    const result: LevelUpResult = {
      leveledUp: false,
      newLevel: progression.level,
      rewardsUnlocked: [],
    };

    while (progression.experience >= progression.experienceToNextLevel) {
      progression.experience -= progression.experienceToNextLevel;
      progression.level++;
      result.leveledUp = true;
      result.newLevel = progression.level;

      // Calculate next level requirement (exponential growth)
      progression.experienceToNextLevel = Math.floor(
        100 * Math.pow(1.15, progression.level - 1),
      );

      // Check for level-based rewards
      const levelRewards = this.getLevelRewards(progression.level);
      result.rewardsUnlocked.push(...levelRewards);
    }

    return result;
  }

  private getLevelRewards(level: number): CosmeticReward[] {
    const rewards: CosmeticReward[] = [];

    // Milestone levels
    if (level === 5) {
      rewards.push(this.cosmetics.get('void-energy')!);
    } else if (level === 10) {
      rewards.push(this.cosmetics.get('master-hexagon')!);
    } else if (level === 20) {
      rewards.push(this.cosmetics.get('crystal-prism')!);
    }

    return rewards.filter(reward => reward !== undefined);
  }

  recordGameResult(
    playerId: string,
    result: 'win' | 'loss' | 'draw',
    deck: Deck,
    gameData: any,
  ): void {
    const progression = this.getPlayerProgression(playerId);

    // Award base experience
    const baseExp = result === 'win' ? 100 : result === 'draw' ? 50 : 25;
    this.awardExperience(playerId, baseExp, 'game-result');

    // Update mastery tracks
    const archetype = this.determineArchetype(deck);
    if (archetype && progression.masteryTracks.has(archetype)) {
      const masteryExp = result === 'win' ? 50 : 25;
      this.awardExperience(playerId, masteryExp, 'mastery', archetype);
    }

    // Check achievements
    this.checkAchievements(playerId, {
      type: 'game-result',
      result,
      deck,
      archetype,
    });

    // Update seasonal progress
    this.updateSeasonalProgress(playerId, result, gameData);
  }

  private determineArchetype(deck: Deck): string | null {
    // Simplified archetype detection based on average mana cost and card types
    const avgCost =
      deck.cards.reduce((sum, card) => sum + card.cost, 0) / deck.cards.length;
    const creatureRatio =
      deck.cards.filter(card => card.type === 'creature').length /
      deck.cards.length;

    if (avgCost <= 3 && creatureRatio >= 0.6) return 'aggro';
    if (avgCost >= 5 && creatureRatio <= 0.4) return 'control';
    if (avgCost >= 3 && avgCost <= 5) return 'midrange';

    return 'tempo';
  }

  private checkAchievements(playerId: string, eventData: any): void {
    const progression = this.getPlayerProgression(playerId);

    this.achievements.forEach((achievement, achievementId) => {
      if (progression.achievements.has(achievementId)) return; // Already unlocked

      if (
        this.meetsAchievementRequirement(achievement, eventData, progression)
      ) {
        this.unlockAchievement(playerId, achievementId);
      }
    });
  }

  private meetsAchievementRequirement(
    achievement: Achievement,
    eventData: any,
    progression: PlayerProgression,
  ): boolean {
    const req = achievement.requirement;

    switch (req.type) {
      case 'games-won':
        return eventData.type === 'game-result' && eventData.result === 'win';
      case 'games-played':
        return eventData.type === 'game-result';
      case 'specific-combo':
        return eventData.type === 'combo-executed';
      case 'deck-building':
        return eventData.type === 'deck-created';
      case 'tournament':
        return (
          eventData.type === 'tournament-result' &&
          eventData.placement <= (req.conditions?.placement || 1)
        );
      case 'training':
        return (
          eventData.type === 'training-result' &&
          eventData.aiDifficulty === req.conditions?.aiDifficulty &&
          eventData.result === req.conditions?.result
        );
      default:
        return false;
    }
  }

  private unlockAchievement(playerId: string, achievementId: string): void {
    const progression = this.getPlayerProgression(playerId);
    const achievement = this.achievements.get(achievementId)!;

    const playerAchievement: PlayerAchievement = {
      id: achievementId,
      name: achievement.name,
      description: achievement.description,
      category: achievement.category,
      rarity: achievement.rarity,
      unlockedAt: new Date(),
      progress: achievement.requirement.count || 1,
      maxProgress: achievement.requirement.count || 1,
      rewards: achievement.rewards,
      hidden: achievement.hidden,
    };

    progression.achievements.set(achievementId, playerAchievement);

    // Award experience
    this.awardExperience(playerId, achievement.experienceReward, 'achievement');

    // Unlock cosmetic rewards
    achievement.rewards.forEach(reward => {
      progression.cosmetics.unlockedCosmetics.add(reward.id);
    });
  }

  private updateSeasonalProgress(
    playerId: string,
    result: string,
    gameData: any,
  ): void {
    const progression = this.getPlayerProgression(playerId);
    const seasonalProgress = progression.seasonalProgress;

    // Award seasonal experience
    const seasonExp = result === 'win' ? 30 : 15;
    seasonalProgress.seasonExperience += seasonExp;

    // Check for seasonal level up
    const expNeeded = seasonalProgress.seasonLevel * 100;
    if (seasonalProgress.seasonExperience >= expNeeded) {
      seasonalProgress.seasonLevel++;
      seasonalProgress.seasonExperience -= expNeeded;

      // Check for seasonal rewards
      const rewards = seasonalProgress.seasonRewards.filter(
        r => r.tier === seasonalProgress.seasonLevel,
      );
      rewards.forEach(reward => {
        seasonalProgress.unlockedSeasonalRewards.add(reward.id);
        if (reward.cosmeticId) {
          progression.cosmetics.unlockedCosmetics.add(reward.cosmeticId);
        }
      });
    }

    // Update challenge progress
    this.updateChallengeProgress(playerId, {
      type: 'game-result',
      result,
      gameData,
    });
  }

  private updateChallengeProgress(playerId: string, eventData: any): void {
    const progression = this.getPlayerProgression(playerId);

    progression.seasonalProgress.availableChallenges.forEach(challenge => {
      if (
        !challenge.isActive ||
        progression.seasonalProgress.completedChallenges.has(challenge.id)
      ) {
        return;
      }

      if (this.meetsChallengeRequirement(challenge, eventData)) {
        challenge.requirement.current++;

        if (challenge.requirement.current >= challenge.requirement.target) {
          this.completeChallenge(playerId, challenge.id);
        }
      }
    });
  }

  private meetsChallengeRequirement(
    challenge: SeasonalChallenge,
    eventData: any,
  ): boolean {
    const req = challenge.requirement;

    switch (req.type) {
      case 'win-games':
        return eventData.type === 'game-result' && eventData.result === 'win';
      case 'play-archetype':
        return (
          eventData.type === 'game-result' &&
          (req.conditions.archetype === 'any' ||
            eventData.archetype === req.conditions.archetype)
        );
      default:
        return false;
    }
  }

  private completeChallenge(playerId: string, challengeId: string): void {
    const progression = this.getPlayerProgression(playerId);
    const challenge = this.seasonalChallenges.get(challengeId)!;

    progression.seasonalProgress.completedChallenges.add(challengeId);

    // Award rewards
    challenge.rewards.forEach(reward => {
      if (reward.type === 'experience') {
        this.awardExperience(playerId, reward.amount!, 'seasonal-challenge');
      } else if (reward.type === 'cosmetic' && reward.cosmeticId) {
        progression.cosmetics.unlockedCosmetics.add(reward.cosmeticId);
      }
    });
  }

  getAvailableCosmetics(playerId: string): CosmeticReward[] {
    const progression = this.getPlayerProgression(playerId);
    return Array.from(this.cosmetics.values()).filter(cosmetic =>
      progression.cosmetics.unlockedCosmetics.has(cosmetic.id),
    );
  }

  equipCosmetic(playerId: string, cosmeticId: string, slot: string): boolean {
    const progression = this.getPlayerProgression(playerId);
    const cosmetic = this.cosmetics.get(cosmeticId);

    if (!cosmetic || !progression.cosmetics.unlockedCosmetics.has(cosmeticId)) {
      return false;
    }

    switch (cosmetic.type) {
      case 'card-back':
        progression.cosmetics.equippedCardBack = cosmeticId;
        break;
      case 'board-theme':
        progression.cosmetics.equippedBoardTheme = cosmeticId;
        break;
      case 'avatar-frame':
        progression.cosmetics.equippedAvatarFrame = cosmeticId;
        break;
      case 'title':
        progression.cosmetics.equippedTitle = cosmeticId;
        break;
      case 'particle-effect':
        progression.cosmetics.equippedParticleEffect = cosmeticId;
        break;
      case 'sound-pack':
        progression.cosmetics.equippedSoundPack = cosmeticId;
        break;
      default:
        return false;
    }

    return true;
  }

  getCurrentSeason(): SeasonInfo {
    return this.currentSeason;
  }

  getSeasonalChallenges(playerId: string): SeasonalChallenge[] {
    const progression = this.getPlayerProgression(playerId);
    return progression.seasonalProgress.availableChallenges.filter(
      challenge =>
        challenge.isActive &&
        !progression.seasonalProgress.completedChallenges.has(challenge.id),
    );
  }

  getLeaderboard(
    category: 'level' | 'seasonal' | 'mastery',
    archetype?: string,
  ): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = [];

    this.playerProgressions.forEach((progression, playerId) => {
      let score = 0;

      switch (category) {
        case 'level':
          score = progression.totalExperience;
          break;
        case 'seasonal':
          score = progression.seasonalProgress.seasonExperience;
          break;
        case 'mastery':
          if (archetype && progression.masteryTracks.has(archetype)) {
            score = progression.masteryTracks.get(archetype)!.currentExperience;
          }
          break;
      }

      entries.push({
        playerId,
        playerName: playerId, // Would get from player profile
        score,
        rank: 0, // Will be calculated
        title: progression.cosmetics.equippedTitle,
        avatarFrame: progression.cosmetics.equippedAvatarFrame,
      });
    });

    entries.sort((a, b) => b.score - a.score);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries.slice(0, 100); // Top 100
  }
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category:
    | 'strategic'
    | 'collection'
    | 'social'
    | 'competitive'
    | 'creative'
    | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: string;
    count?: number;
    conditions: { [key: string]: any };
  };
  rewards: CosmeticReward[];
  hidden: boolean;
  experienceReward: number;
}

interface LevelUpResult {
  leveledUp: boolean;
  newLevel: number;
  rewardsUnlocked: CosmeticReward[];
}

interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  rank: number;
  title: string;
  avatarFrame: string;
}

export const progressionSystem = new ProgressionSystem();
