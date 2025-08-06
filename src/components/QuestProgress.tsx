import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Quest and Achievement Types
export type QuestType = 'daily' | 'weekly' | 'special';
export type QuestCategory = 'play' | 'win' | 'deck_building' | 'collection' | 'social' | 'exploration';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  progress: number;
  target: number;
  reward: {
    type: 'cards' | 'gold' | 'experience' | 'title';
    amount: number;
    specificCards?: string[];
  };
  isCompleted: boolean;
  expiresAt?: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  tier: AchievementTier;
  progress: number;
  target: number;
  reward: {
    type: 'cards' | 'gold' | 'experience' | 'title' | 'avatar';
    amount: number;
    specificReward?: string;
  };
  isCompleted: boolean;
  isSecret: boolean;
  unlockedAt?: Date;
  icon: string;
  prerequisites?: string[]; // Other achievement IDs required
}

export interface PlayerProgress {
  level: number;
  experience: number;
  experienceToNext: number;
  totalGames: number;
  totalWins: number;
  winRate: number;
  cardsOwned: number;
  decksCreated: number;
  questsCompleted: number;
  achievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  favoriteOpponent?: string;
  playtime: number; // in minutes
}

// Daily Quest Templates
const DAILY_QUEST_TEMPLATES: Omit<Quest, 'id' | 'progress' | 'isCompleted' | 'expiresAt'>[] = [
  {
    title: 'First Steps',
    description: 'Play 3 games',
    type: 'daily',
    category: 'play',
    target: 3,
    reward: { type: 'gold', amount: 50 },
    difficulty: 'easy',
    icon: '🎮',
  },
  {
    title: 'Victory Path',
    description: 'Win 2 games',
    type: 'daily',
    category: 'win',
    target: 2,
    reward: { type: 'gold', amount: 100 },
    difficulty: 'medium',
    icon: '🏆',
  },
  {
    title: 'Deck Architect',
    description: 'Create or modify a deck',
    type: 'daily',
    category: 'deck_building',
    target: 1,
    reward: { type: 'cards', amount: 2 },
    difficulty: 'easy',
    icon: '🔧',
  },
  {
    title: 'Element Master',
    description: 'Play 5 cards with different elements',
    type: 'daily',
    category: 'play',
    target: 5,
    reward: { type: 'experience', amount: 100 },
    difficulty: 'medium',
    icon: '⚡',
  },
  {
    title: 'Spell Weaver',
    description: 'Cast 8 spells in a single game',
    type: 'daily',
    category: 'play',
    target: 8,
    reward: { type: 'gold', amount: 75 },
    difficulty: 'hard',
    icon: '🔮',
  },
  {
    title: 'Creature Summoner',
    description: 'Summon 10 creatures across multiple games',
    type: 'daily',
    category: 'play',
    target: 10,
    reward: { type: 'cards', amount: 3 },
    difficulty: 'medium',
    icon: '🐲',
  },
  {
    title: 'Perfect Victory',
    description: 'Win a game without losing life',
    type: 'daily',
    category: 'win',
    target: 1,
    reward: { type: 'gold', amount: 150 },
    difficulty: 'hard',
    icon: '💎',
  },
  {
    title: 'AI Challenger',
    description: 'Defeat an Expert-level AI opponent',
    type: 'daily',
    category: 'win',
    target: 1,
    reward: { type: 'experience', amount: 200 },
    difficulty: 'hard',
    icon: '🤖',
  },
];

// Weekly Quest Templates
const WEEKLY_QUEST_TEMPLATES: Omit<Quest, 'id' | 'progress' | 'isCompleted' | 'expiresAt'>[] = [
  {
    title: 'Dedicated Player',
    description: 'Play games on 5 different days',
    type: 'weekly',
    category: 'play',
    target: 5,
    reward: { type: 'cards', amount: 5 },
    difficulty: 'medium',
    icon: '📅',
  },
  {
    title: 'Winning Streak',
    description: 'Win 10 games this week',
    type: 'weekly',
    category: 'win',
    target: 10,
    reward: { type: 'gold', amount: 500 },
    difficulty: 'hard',
    icon: '🔥',
  },
  {
    title: 'Collection Explorer',
    description: 'Use 20 different cards in games',
    type: 'weekly',
    category: 'collection',
    target: 20,
    reward: { type: 'cards', amount: 8 },
    difficulty: 'medium',
    icon: '📚',
  },
  {
    title: 'Deck Master',
    description: 'Create 3 different viable decks',
    type: 'weekly',
    category: 'deck_building',
    target: 3,
    reward: { type: 'title', amount: 1 },
    difficulty: 'hard',
    icon: '🏗️',
  },
];

// Achievement Templates
const ACHIEVEMENT_TEMPLATES: Omit<Achievement, 'id' | 'progress' | 'isCompleted' | 'unlockedAt'>[] = [
  {
    title: 'First Victory',
    description: 'Win your first game',
    category: 'win',
    tier: 'bronze',
    target: 1,
    reward: { type: 'gold', amount: 100 },
    isSecret: false,
    icon: '🥇',
  },
  {
    title: 'Novice Duelist',
    description: 'Win 10 games',
    category: 'win',
    tier: 'bronze',
    target: 10,
    reward: { type: 'title', amount: 1, specificReward: 'Novice Duelist' },
    isSecret: false,
    icon: '⚔️',
  },
  {
    title: 'Skilled Combatant',
    description: 'Win 50 games',
    category: 'win',
    tier: 'silver',
    target: 50,
    reward: { type: 'cards', amount: 10 },
    isSecret: false,
    icon: '🛡️',
    prerequisites: ['novice_duelist'],
  },
  {
    title: 'Master Strategist',
    description: 'Win 100 games',
    category: 'win',
    tier: 'gold',
    target: 100,
    reward: { type: 'avatar', amount: 1, specificReward: 'Golden Crown' },
    isSecret: false,
    icon: '👑',
    prerequisites: ['skilled_combatant'],
  },
  {
    title: 'Legendary Champion',
    description: 'Win 500 games',
    category: 'win',
    tier: 'legendary',
    target: 500,
    reward: { type: 'title', amount: 1, specificReward: 'Legendary Champion' },
    isSecret: false,
    icon: '🌟',
    prerequisites: ['master_strategist'],
  },
  {
    title: 'Deck Architect',
    description: 'Create your first deck',
    category: 'deck_building',
    tier: 'bronze',
    target: 1,
    reward: { type: 'cards', amount: 3 },
    isSecret: false,
    icon: '📐',
  },
  {
    title: 'Collection Starter',
    description: 'Collect 25 different cards',
    category: 'collection',
    tier: 'bronze',
    target: 25,
    reward: { type: 'gold', amount: 200 },
    isSecret: false,
    icon: '📦',
  },
  {
    title: 'Card Collector',
    description: 'Collect 100 different cards',
    category: 'collection',
    tier: 'silver',
    target: 100,
    reward: { type: 'cards', amount: 15 },
    isSecret: false,
    icon: '🗂️',
  },
  {
    title: 'Perfect Game',
    description: 'Win a game in under 5 turns',
    category: 'win',
    tier: 'gold',
    target: 1,
    reward: { type: 'title', amount: 1, specificReward: 'Speed Demon' },
    isSecret: true,
    icon: '⚡',
  },
  {
    title: 'AI Destroyer',
    description: 'Defeat every AI opponent difficulty',
    category: 'win',
    tier: 'platinum',
    target: 5,
    reward: { type: 'avatar', amount: 1, specificReward: 'AI Slayer Badge' },
    isSecret: false,
    icon: '🤖💀',
  },
  {
    title: 'Marathon Player',
    description: 'Play for 10 hours total',
    category: 'play',
    tier: 'silver',
    target: 600, // minutes
    reward: { type: 'cards', amount: 8 },
    isSecret: false,
    icon: '⏰',
  },
  {
    title: 'Element Master',
    description: 'Play cards from all 5 elements in a single game',
    category: 'play',
    tier: 'gold',
    target: 1,
    reward: { type: 'title', amount: 1, specificReward: 'Element Master' },
    isSecret: true,
    icon: '🌈',
  },
];

// Quest and Achievement Manager
export class QuestManager {
  private quests: Map<string, Quest> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private playerProgress: PlayerProgress;
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.playerProgress = {
      level: 1,
      experience: 0,
      experienceToNext: 100,
      totalGames: 0,
      totalWins: 0,
      winRate: 0,
      cardsOwned: 0,
      decksCreated: 0,
      questsCompleted: 0,
      achievementsUnlocked: 0,
      currentStreak: 0,
      longestStreak: 0,
      playtime: 0,
    };

    this.initializeQuests();
    this.initializeAchievements();
    this.loadProgress();
  }

  // Initialize daily and weekly quests
  private initializeQuests(): void {
    // Generate daily quests
    const today = new Date();
    const dailyQuests = this.generateDailyQuests(today);
    dailyQuests.forEach(quest => this.quests.set(quest.id, quest));

    // Generate weekly quests
    const weeklyQuests = this.generateWeeklyQuests(today);
    weeklyQuests.forEach(quest => this.quests.set(quest.id, quest));
  }

  // Initialize achievements
  private initializeAchievements(): void {
    ACHIEVEMENT_TEMPLATES.forEach((template, index) => {
      const achievement: Achievement = {
        ...template,
        id: template.title.toLowerCase().replace(/\s+/g, '_'),
        progress: 0,
        isCompleted: false,
      };
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Generate daily quests based on date
  private generateDailyQuests(date: Date): Quest[] {
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const rng = this.seededRandom(seed);
    
    const shuffled = [...DAILY_QUEST_TEMPLATES].sort(() => rng() - 0.5);
    const selectedQuests = shuffled.slice(0, 3); // 3 daily quests

    return selectedQuests.map((template, index) => ({
      ...template,
      id: `daily_${date.toISOString().split('T')[0]}_${index}`,
      progress: 0,
      isCompleted: false,
      expiresAt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // 24 hours
    }));
  }

  // Generate weekly quests
  private generateWeeklyQuests(date: Date): Quest[] {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week

    const seed = weekStart.getFullYear() * 100 + weekStart.getMonth() * 4 + Math.floor(weekStart.getDate() / 7);
    const rng = this.seededRandom(seed);
    
    const shuffled = [...WEEKLY_QUEST_TEMPLATES].sort(() => rng() - 0.5);
    const selectedQuests = shuffled.slice(0, 2); // 2 weekly quests

    return selectedQuests.map((template, index) => ({
      ...template,
      id: `weekly_${weekStart.toISOString().split('T')[0]}_${index}`,
      progress: 0,
      isCompleted: false,
      expiresAt: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }));
  }

  // Seeded random number generator for consistent quest generation
  private seededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  // Update quest progress
  updateQuestProgress(event: string, data: any): void {
    this.quests.forEach(quest => {
      if (quest.isCompleted) return;

      let shouldUpdate = false;
      let increment = 1;

      switch (quest.category) {
        case 'play':
          if (event === 'game_played') {
            shouldUpdate = true;
          } else if (event === 'card_played' && quest.description.includes('cards')) {
            shouldUpdate = true;
          } else if (event === 'spell_cast' && quest.description.includes('spells')) {
            shouldUpdate = true;
          }
          break;

        case 'win':
          if (event === 'game_won') {
            shouldUpdate = true;
            if (quest.description.includes('without losing life') && data.lifeLost === 0) {
              shouldUpdate = true;
            } else if (quest.description.includes('AI') && data.opponentType === 'ai') {
              shouldUpdate = true;
            }
          }
          break;

        case 'deck_building':
          if (event === 'deck_created' || event === 'deck_modified') {
            shouldUpdate = true;
          }
          break;

        case 'collection':
          if (event === 'card_obtained') {
            shouldUpdate = true;
          }
          break;
      }

      if (shouldUpdate) {
        quest.progress = Math.min(quest.progress + increment, quest.target);
        
        if (quest.progress >= quest.target && !quest.isCompleted) {
          this.completeQuest(quest.id);
        }
      }
    });
  }

  // Update achievement progress
  updateAchievementProgress(event: string, data: any): void {
    this.achievements.forEach(achievement => {
      if (achievement.isCompleted) return;
      if (achievement.prerequisites && !this.arePrerequisitesMet(achievement.prerequisites)) return;

      let shouldUpdate = false;
      let increment = 1;
      let currentValue = 0;

      switch (achievement.category) {
        case 'win':
          if (event === 'game_won') {
            shouldUpdate = true;
            currentValue = this.playerProgress.totalWins;
            
            // Special conditions
            if (achievement.description.includes('under 5 turns') && data.turnCount <= 5) {
              shouldUpdate = true;
              currentValue = 1;
            } else if (achievement.description.includes('AI opponent') && data.opponentType === 'ai') {
              shouldUpdate = true;
              currentValue = data.aiDifficultiesDefeated || 0;
            }
          }
          break;

        case 'play':
          if (event === 'game_played') {
            shouldUpdate = true;
            currentValue = this.playerProgress.totalGames;
          } else if (event === 'playtime_updated') {
            shouldUpdate = true;
            currentValue = this.playerProgress.playtime;
          } else if (event === 'elements_played' && achievement.description.includes('elements')) {
            shouldUpdate = true;
            currentValue = data.uniqueElements || 0;
          }
          break;

        case 'deck_building':
          if (event === 'deck_created') {
            shouldUpdate = true;
            currentValue = this.playerProgress.decksCreated;
          }
          break;

        case 'collection':
          if (event === 'card_obtained') {
            shouldUpdate = true;
            currentValue = this.playerProgress.cardsOwned;
          }
          break;
      }

      if (shouldUpdate) {
        achievement.progress = Math.max(achievement.progress, currentValue);
        
        if (achievement.progress >= achievement.target && !achievement.isCompleted) {
          this.completeAchievement(achievement.id);
        }
      }
    });
  }

  // Check if achievement prerequisites are met
  private arePrerequisitesMet(prerequisites: string[]): boolean {
    return prerequisites.every(prereqId => {
      const prereq = this.achievements.get(prereqId);
      return prereq && prereq.isCompleted;
    });
  }

  // Complete a quest
  private completeQuest(questId: string): void {
    const quest = this.quests.get(questId);
    if (!quest) return;

    quest.isCompleted = true;
    this.playerProgress.questsCompleted++;

    // Award rewards
    this.awardReward(quest.reward);

    // Notify listeners
    this.notifyListeners('quest_completed', quest);

    console.log(`Quest completed: ${quest.title}`);
  }

  // Complete an achievement
  private completeAchievement(achievementId: string): void {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return;

    achievement.isCompleted = true;
    achievement.unlockedAt = new Date();
    this.playerProgress.achievementsUnlocked++;

    // Award rewards
    this.awardReward(achievement.reward);

    // Notify listeners
    this.notifyListeners('achievement_unlocked', achievement);

    console.log(`Achievement unlocked: ${achievement.title}`);
  }

  // Award rewards to player
  private awardReward(reward: Quest['reward'] | Achievement['reward']): void {
    switch (reward.type) {
      case 'experience':
        this.addExperience(reward.amount);
        break;
      case 'gold':
        // Would integrate with currency system
        break;
      case 'cards':
        // Would integrate with collection system
        break;
      case 'title':
      case 'avatar':
        // Would integrate with cosmetic system
        break;
    }
  }

  // Add experience and handle level ups
  private addExperience(amount: number): void {
    this.playerProgress.experience += amount;

    while (this.playerProgress.experience >= this.playerProgress.experienceToNext) {
      this.playerProgress.experience -= this.playerProgress.experienceToNext;
      this.playerProgress.level++;
      this.playerProgress.experienceToNext = Math.floor(this.playerProgress.experienceToNext * 1.2);
      
      this.notifyListeners('level_up', { newLevel: this.playerProgress.level });
    }
  }

  // Record game events
  recordGameEvent(event: string, data: any = {}): void {
    // Update player progress
    switch (event) {
      case 'game_played':
        this.playerProgress.totalGames++;
        break;
      case 'game_won':
        this.playerProgress.totalWins++;
        this.playerProgress.currentStreak++;
        this.playerProgress.longestStreak = Math.max(
          this.playerProgress.longestStreak, 
          this.playerProgress.currentStreak
        );
        break;
      case 'game_lost':
        this.playerProgress.currentStreak = 0;
        break;
      case 'deck_created':
        this.playerProgress.decksCreated++;
        break;
    }

    // Update win rate
    this.playerProgress.winRate = this.playerProgress.totalGames > 0 
      ? this.playerProgress.totalWins / this.playerProgress.totalGames 
      : 0;

    // Update quests and achievements
    this.updateQuestProgress(event, data);
    this.updateAchievementProgress(event, data);

    // Save progress
    this.saveProgress();
  }

  // Get active quests
  getActiveQuests(): Quest[] {
    const now = new Date();
    return Array.from(this.quests.values()).filter(
      quest => !quest.isCompleted && (!quest.expiresAt || quest.expiresAt > now)
    );
  }

  // Get completed achievements
  getCompletedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(achievement => achievement.isCompleted);
  }

  // Get available achievements (not secret and prerequisites met)
  getAvailableAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(achievement => 
      !achievement.isSecret && 
      (!achievement.prerequisites || this.arePrerequisitesMet(achievement.prerequisites))
    );
  }

  // Get player progress
  getPlayerProgress(): PlayerProgress {
    return { ...this.playerProgress };
  }

  // Add event listener
  addEventListener(listener: (event: string, data: any) => void): void {
    this.listeners.push(listener);
  }

  // Remove event listener
  removeEventListener(listener: (event: string, data: any) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify all listeners
  private notifyListeners(event: string, data: any): void {
    this.listeners.forEach(listener => listener(event, data));
  }

  // Load progress from storage
  private loadProgress(): void {
    try {
      const saved = localStorage.getItem('konivrer_progress');
      if (saved) {
        const data = JSON.parse(saved);
        this.playerProgress = { ...this.playerProgress, ...data.playerProgress };
        
        // Load quest progress
        data.quests?.forEach((questData: any) => {
          const quest = this.quests.get(questData.id);
          if (quest) {
            quest.progress = questData.progress;
            quest.isCompleted = questData.isCompleted;
          }
        });

        // Load achievement progress
        data.achievements?.forEach((achievementData: any) => {
          const achievement = this.achievements.get(achievementData.id);
          if (achievement) {
            achievement.progress = achievementData.progress;
            achievement.isCompleted = achievementData.isCompleted;
            if (achievementData.unlockedAt) {
              achievement.unlockedAt = new Date(achievementData.unlockedAt);
            }
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load progress:', error);
    }
  }

  // Save progress to storage
  private saveProgress(): void {
    try {
      const data = {
        playerProgress: this.playerProgress,
        quests: Array.from(this.quests.values()).map(q => ({
          id: q.id,
          progress: q.progress,
          isCompleted: q.isCompleted,
        })),
        achievements: Array.from(this.achievements.values()).map(a => ({
          id: a.id,
          progress: a.progress,
          isCompleted: a.isCompleted,
          unlockedAt: a.unlockedAt,
        })),
      };
      localStorage.setItem('konivrer_progress', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save progress:', error);
    }
  }
}

// Global quest manager instance
export const questManager = new QuestManager();

// React component for displaying quests and achievements
interface QuestProgressProps {
  onClose?: () => void;
}

export const QuestProgress: React.FC<QuestProgressProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'achievements' | 'progress'>('quests');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(questManager.getPlayerProgress());

  // Update data when component mounts or quest manager changes
  useEffect(() => {
    const updateData = () => {
      setQuests(questManager.getActiveQuests());
      setAchievements(questManager.getAvailableAchievements());
      setPlayerProgress(questManager.getPlayerProgress());
    };

    updateData();

    const listener = (event: string, data: any) => {
      updateData();
    };

    questManager.addEventListener(listener);
    return () => questManager.removeEventListener(listener);
  }, []);

  const getTierColor = (tier: AchievementTier): string => {
    switch (tier) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      case 'legendary': return '#ff6b6b';
      default: return '#888';
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#90ee90';
      case 'medium': return '#ffd93d';
      case 'hard': return '#ff6b6b';
      default: return '#888';
    }
  };

  return (
    <div className="quest-progress-overlay">
      <style>{`
        .quest-progress-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .quest-progress-modal {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          border-radius: 12px;
          padding: 30px;
          max-width: 900px;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
          position: relative;
          border: 2px solid rgba(139, 69, 19, 0.5);
        }

        .quest-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .quest-progress-title {
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
        }

        .close-button {
          background: rgba(220, 53, 69, 0.3);
          border: 1px solid rgba(220, 53, 69, 0.5);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .close-button:hover {
          background: rgba(220, 53, 69, 0.5);
        }

        .quest-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(139, 69, 19, 0.3);
        }

        .quest-tab {
          background: transparent;
          border: none;
          color: #ccc;
          padding: 12px 20px;
          border-radius: 6px 6px 0 0;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .quest-tab.active {
          background: rgba(139, 69, 19, 0.3);
          color: #ffd700;
          border-bottom: 2px solid #ffd700;
        }

        .quest-tab:hover {
          background: rgba(139, 69, 19, 0.2);
        }

        .quest-content {
          min-height: 400px;
        }

        .quest-list {
          display: grid;
          gap: 15px;
        }

        .quest-item {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .quest-item:hover {
          background: rgba(139, 69, 19, 0.3);
        }

        .quest-item.completed {
          background: rgba(40, 167, 69, 0.2);
          border-color: rgba(40, 167, 69, 0.5);
        }

        .quest-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .quest-info {
          flex: 1;
        }

        .quest-title {
          font-size: 18px;
          font-weight: bold;
          color: #ffd700;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .quest-description {
          color: #ccc;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .quest-progress-bar {
          background: rgba(0, 0, 0, 0.3);
          height: 8px;
          border-radius: 4px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .quest-progress-fill {
          background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f);
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .quest-progress-text {
          font-size: 12px;
          color: #ccc;
          margin-bottom: 10px;
        }

        .quest-reward {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: #90ee90;
        }

        .quest-badge {
          background: rgba(0, 123, 255, 0.3);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: bold;
        }

        .difficulty-badge {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: bold;
        }

        .tier-badge {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: bold;
          color: black;
        }

        .player-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #ccc;
          font-size: 14px;
        }

        .level-progress {
          margin: 20px 0;
        }

        .level-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .level-number {
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
        }

        .experience-bar {
          background: rgba(0, 0, 0, 0.3);
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
        }

        .experience-fill {
          background: linear-gradient(90deg, #6bcf7f, #4dabf7);
          height: 100%;
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
        }

        .achievement-item {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .achievement-item:hover {
          background: rgba(139, 69, 19, 0.3);
        }

        .achievement-item.completed {
          background: rgba(40, 167, 69, 0.2);
          border-color: rgba(40, 167, 69, 0.5);
        }

        .achievement-icon {
          font-size: 32px;
          margin-bottom: 10px;
          display: block;
        }
      `}</style>

      <motion.div
        className="quest-progress-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="quest-progress-header">
          <h2 className="quest-progress-title">Quests & Achievements</h2>
          {onClose && (
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="quest-tabs">
          <button
            className={`quest-tab ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            Daily Quests
          </button>
          <button
            className={`quest-tab ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button
            className={`quest-tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
        </div>

        <div className="quest-content">
          {activeTab === 'quests' && (
            <div className="quest-list">
              {quests.map(quest => (
                <motion.div
                  key={quest.id}
                  className={`quest-item ${quest.isCompleted ? 'completed' : ''}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="quest-header">
                    <div className="quest-info">
                      <div className="quest-title">
                        <span>{quest.icon}</span>
                        <span>{quest.title}</span>
                        <span className="quest-badge">{quest.type}</span>
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(quest.difficulty) }}
                        >
                          {quest.difficulty}
                        </span>
                      </div>
                      <div className="quest-description">{quest.description}</div>
                      <div className="quest-progress-bar">
                        <div 
                          className="quest-progress-fill"
                          style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                        />
                      </div>
                      <div className="quest-progress-text">
                        Progress: {quest.progress}/{quest.target}
                      </div>
                      <div className="quest-reward">
                        🎁 {quest.reward.type === 'gold' ? '💰' : quest.reward.type === 'cards' ? '🃏' : '⭐'} 
                        {quest.reward.amount} {quest.reward.type}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  className={`achievement-item ${achievement.isCompleted ? 'completed' : ''}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="quest-title">
                    {achievement.title}
                    <span 
                      className="tier-badge"
                      style={{ backgroundColor: getTierColor(achievement.tier) }}
                    >
                      {achievement.tier}
                    </span>
                  </div>
                  <div className="quest-description">{achievement.description}</div>
                  <div className="quest-progress-bar">
                    <div 
                      className="quest-progress-fill"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                  <div className="quest-progress-text">
                    Progress: {achievement.progress}/{achievement.target}
                  </div>
                  <div className="quest-reward">
                    🏆 {achievement.reward.type === 'gold' ? '💰' : achievement.reward.type === 'cards' ? '🃏' : '⭐'} 
                    {achievement.reward.specificReward || `${achievement.reward.amount} ${achievement.reward.type}`}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <div className="level-progress">
                <div className="level-info">
                  <span className="level-number">Level {playerProgress.level}</span>
                  <span>{playerProgress.experience}/{playerProgress.experienceToNext} XP</span>
                </div>
                <div className="experience-bar">
                  <div 
                    className="experience-fill"
                    style={{ width: `${(playerProgress.experience / playerProgress.experienceToNext) * 100}%` }}
                  />
                </div>
              </div>

              <div className="player-stats">
                <div className="stat-card">
                  <div className="stat-value">{playerProgress.totalGames}</div>
                  <div className="stat-label">Games Played</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{playerProgress.totalWins}</div>
                  <div className="stat-label">Games Won</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{(playerProgress.winRate * 100).toFixed(1)}%</div>
                  <div className="stat-label">Win Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{playerProgress.questsCompleted}</div>
                  <div className="stat-label">Quests Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{playerProgress.achievementsUnlocked}</div>
                  <div className="stat-label">Achievements</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{playerProgress.currentStreak}</div>
                  <div className="stat-label">Current Streak</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{playerProgress.longestStreak}</div>
                  <div className="stat-label">Best Streak</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{Math.floor(playerProgress.playtime / 60)}h {playerProgress.playtime % 60}m</div>
                  <div className="stat-label">Total Playtime</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestProgress;