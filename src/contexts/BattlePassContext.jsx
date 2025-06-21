import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Battle Pass System Context - Industry standard monetization
const BattlePassContext = createContext();

// Battle Pass Types
const PASS_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium',
  PREMIUM_PLUS: 'premium_plus'
};

// Reward Types
const REWARD_TYPES = {
  CARDS: 'cards',
  WILDCARDS: 'wildcards',
  COSMETICS: 'cosmetics',
  CURRENCY: 'currency',
  EXPERIENCE: 'experience',
  CARD_BACKS: 'card_backs',
  AVATARS: 'avatars',
  EMOTES: 'emotes',
  BOARD_THEMES: 'board_themes',
  ANIMATIONS: 'animations'
};

// Quest Types
const QUEST_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  SEASONAL: 'seasonal',
  SPECIAL_EVENT: 'special_event'
};

// Initial state
const initialState = {
  // Current Season
  currentSeason: {
    id: 'season_1_2024',
    name: 'Elemental Convergence',
    theme: 'elemental',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    maxLevel: 100,
    premiumPrice: 999, // In game currency
    premiumPlusPrice: 1999
  },

  // Player Progress
  playerProgress: {
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    passType: PASS_TYPES.FREE,
    purchaseDate: null,
    claimedRewards: [],
    premiumClaimed: []
  },

  // Rewards Structure
  rewards: {
    free: [], // Free track rewards
    premium: [], // Premium track rewards
    premiumPlus: [] // Premium+ exclusive rewards
  },

  // Quests System
  quests: {
    daily: [],
    weekly: [],
    seasonal: [],
    completed: []
  },

  // Experience Sources
  experienceSources: {
    gameWin: 100,
    gameLoss: 50,
    firstWinOfDay: 500,
    questCompletion: 1000,
    weeklyQuestCompletion: 2500,
    tournamentParticipation: 1500,
    tournamentWin: 5000
  },

  // Cosmetic Inventory
  cosmetics: {
    cardBacks: ['default'],
    avatars: ['default'],
    emotes: ['gg', 'thinking'],
    boardThemes: ['classic'],
    cardAnimations: [],
    victoryAnimations: []
  },

  // Analytics
  analytics: {
    totalExperienceEarned: 0,
    questsCompleted: 0,
    seasonsCompleted: 0,
    premiumPurchases: 0,
    favoriteRewardType: null
  }
};

// Action types
const ACTIONS = {
  // Progress
  GAIN_EXPERIENCE: 'GAIN_EXPERIENCE',
  LEVEL_UP: 'LEVEL_UP',
  CLAIM_REWARD: 'CLAIM_REWARD',
  
  // Pass Management
  PURCHASE_PREMIUM: 'PURCHASE_PREMIUM',
  PURCHASE_PREMIUM_PLUS: 'PURCHASE_PREMIUM_PLUS',
  
  // Quests
  ADD_QUEST: 'ADD_QUEST',
  COMPLETE_QUEST: 'COMPLETE_QUEST',
  REFRESH_DAILY_QUESTS: 'REFRESH_DAILY_QUESTS',
  
  // Season Management
  START_NEW_SEASON: 'START_NEW_SEASON',
  END_SEASON: 'END_SEASON',
  
  // Cosmetics
  UNLOCK_COSMETIC: 'UNLOCK_COSMETIC',
  EQUIP_COSMETIC: 'EQUIP_COSMETIC',
  
  // Analytics
  TRACK_PURCHASE: 'TRACK_PURCHASE',
  UPDATE_ANALYTICS: 'UPDATE_ANALYTICS'
};

// Battle Pass Reducer
function battlePassReducer(state, action) {
  switch (action.type) {
    case ACTIONS.GAIN_EXPERIENCE:
      const newExperience = state.playerProgress.experience + action.payload.amount;
      const experienceToNext = state.playerProgress.experienceToNext;
      
      if (newExperience >= experienceToNext) {
        // Level up!
        return {
          ...state,
          playerProgress: {
            ...state.playerProgress,
            level: state.playerProgress.level + 1,
            experience: newExperience - experienceToNext,
            experienceToNext: calculateExperienceToNext(state.playerProgress.level + 1)
          },
          analytics: {
            ...state.analytics,
            totalExperienceEarned: state.analytics.totalExperienceEarned + action.payload.amount
          }
        };
      }
      
      return {
        ...state,
        playerProgress: {
          ...state.playerProgress,
          experience: newExperience
        },
        analytics: {
          ...state.analytics,
          totalExperienceEarned: state.analytics.totalExperienceEarned + action.payload.amount
        }
      };

    case ACTIONS.CLAIM_REWARD:
      const { level, track } = action.payload;
      const rewardKey = track === 'free' ? 'claimedRewards' : 'premiumClaimed';
      
      return {
        ...state,
        playerProgress: {
          ...state.playerProgress,
          [rewardKey]: [...state.playerProgress[rewardKey], level]
        }
      };

    case ACTIONS.PURCHASE_PREMIUM:
      return {
        ...state,
        playerProgress: {
          ...state.playerProgress,
          passType: PASS_TYPES.PREMIUM,
          purchaseDate: Date.now()
        },
        analytics: {
          ...state.analytics,
          premiumPurchases: state.analytics.premiumPurchases + 1
        }
      };

    case ACTIONS.PURCHASE_PREMIUM_PLUS:
      return {
        ...state,
        playerProgress: {
          ...state.playerProgress,
          passType: PASS_TYPES.PREMIUM_PLUS,
          purchaseDate: Date.now()
        },
        analytics: {
          ...state.analytics,
          premiumPurchases: state.analytics.premiumPurchases + 1
        }
      };

    case ACTIONS.COMPLETE_QUEST:
      const quest = action.payload.quest;
      return {
        ...state,
        quests: {
          ...state.quests,
          completed: [...state.quests.completed, quest.id],
          [quest.type]: state.quests[quest.type].filter(q => q.id !== quest.id)
        },
        analytics: {
          ...state.analytics,
          questsCompleted: state.analytics.questsCompleted + 1
        }
      };

    case ACTIONS.REFRESH_DAILY_QUESTS:
      return {
        ...state,
        quests: {
          ...state.quests,
          daily: generateDailyQuests()
        }
      };

    case ACTIONS.UNLOCK_COSMETIC:
      const { type, item } = action.payload;
      return {
        ...state,
        cosmetics: {
          ...state.cosmetics,
          [type]: [...state.cosmetics[type], item]
        }
      };

    case ACTIONS.START_NEW_SEASON:
      return {
        ...state,
        currentSeason: action.payload.season,
        playerProgress: {
          level: 1,
          experience: 0,
          experienceToNext: 1000,
          passType: PASS_TYPES.FREE,
          purchaseDate: null,
          claimedRewards: [],
          premiumClaimed: []
        },
        rewards: action.payload.rewards,
        quests: {
          daily: generateDailyQuests(),
          weekly: generateWeeklyQuests(),
          seasonal: generateSeasonalQuests(),
          completed: []
        }
      };

    default:
      return state;
  }
}

// Battle Pass Provider
export const BattlePassProvider = ({ children }) => {
  const [state, dispatch] = useReducer(battlePassReducer, initialState);
  const { user } = useAuth();

  // Initialize rewards on mount
  useEffect(() => {
    initializeSeasonRewards();
    initializeQuests();
  }, []);

  // Daily quest refresh
  useEffect(() => {
    const now = new Date();
    const lastRefresh = localStorage.getItem('lastQuestRefresh');
    
    if (!lastRefresh || new Date(lastRefresh).getDate() !== now.getDate()) {
      dispatch({ type: ACTIONS.REFRESH_DAILY_QUESTS });
      localStorage.setItem('lastQuestRefresh', now.toISOString());
    }
  }, []);

  // Initialize season rewards
  const initializeSeasonRewards = () => {
    const rewards = generateSeasonRewards();
    dispatch({
      type: ACTIONS.START_NEW_SEASON,
      payload: {
        season: state.currentSeason,
        rewards
      }
    });
  };

  // Initialize quests
  const initializeQuests = () => {
    dispatch({
      type: ACTIONS.ADD_QUEST,
      payload: {
        quests: [
          ...generateDailyQuests(),
          ...generateWeeklyQuests(),
          ...generateSeasonalQuests()
        ]
      }
    });
  };

  // Battle Pass API
  const battlePass = {
    // State
    ...state,

    // Experience Management
    gainExperience: (source, amount) => {
      const experienceAmount = amount || state.experienceSources[source] || 0;
      
      dispatch({
        type: ACTIONS.GAIN_EXPERIENCE,
        payload: { amount: experienceAmount, source }
      });

      // Track analytics
      dispatch({
        type: ACTIONS.UPDATE_ANALYTICS,
        payload: { source, amount: experienceAmount }
      });
    },

    // Reward Management
    claimReward: (level, track = 'free') => {
      // Validate claim eligibility
      if (level > state.playerProgress.level) return false;
      if (track !== 'free' && state.playerProgress.passType === PASS_TYPES.FREE) return false;
      
      const rewardKey = track === 'free' ? 'claimedRewards' : 'premiumClaimed';
      if (state.playerProgress[rewardKey].includes(level)) return false;

      dispatch({
        type: ACTIONS.CLAIM_REWARD,
        payload: { level, track }
      });

      // Apply reward
      const reward = state.rewards[track][level - 1];
      if (reward) {
        applyReward(reward);
      }

      return true;
    },

    // Pass Purchases
    purchasePremium: () => {
      // Validate purchase (check currency, etc.)
      dispatch({ type: ACTIONS.PURCHASE_PREMIUM });
      
      // Track purchase
      dispatch({
        type: ACTIONS.TRACK_PURCHASE,
        payload: {
          type: 'premium_pass',
          price: state.currentSeason.premiumPrice,
          currency: 'gems'
        }
      });
    },

    purchasePremiumPlus: () => {
      dispatch({ type: ACTIONS.PURCHASE_PREMIUM_PLUS });
      
      dispatch({
        type: ACTIONS.TRACK_PURCHASE,
        payload: {
          type: 'premium_plus_pass',
          price: state.currentSeason.premiumPlusPrice,
          currency: 'gems'
        }
      });
    },

    // Quest Management
    completeQuest: (questId) => {
      const quest = findQuestById(questId, state.quests);
      if (!quest) return false;

      dispatch({
        type: ACTIONS.COMPLETE_QUEST,
        payload: { quest }
      });

      // Award quest experience
      battlePass.gainExperience('questCompletion', quest.experience);

      return true;
    },

    // Cosmetic Management
    unlockCosmetic: (type, item) => {
      dispatch({
        type: ACTIONS.UNLOCK_COSMETIC,
        payload: { type, item }
      });
    },

    // Utility Functions
    getAvailableRewards: () => {
      const available = [];
      
      for (let level = 1; level <= state.playerProgress.level; level++) {
        // Free rewards
        if (!state.playerProgress.claimedRewards.includes(level)) {
          available.push({
            level,
            track: 'free',
            reward: state.rewards.free[level - 1]
          });
        }
        
        // Premium rewards
        if (state.playerProgress.passType !== PASS_TYPES.FREE && 
            !state.playerProgress.premiumClaimed.includes(level)) {
          available.push({
            level,
            track: 'premium',
            reward: state.rewards.premium[level - 1]
          });
        }
      }
      
      return available;
    },

    getProgressPercentage: () => {
      return (state.playerProgress.experience / state.playerProgress.experienceToNext) * 100;
    },

    getDaysRemaining: () => {
      const endDate = new Date(state.currentSeason.endDate);
      const now = new Date();
      const diffTime = endDate - now;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  };

  return (
    <BattlePassContext.Provider value={battlePass}>
      {children}
    </BattlePassContext.Provider>
  );
};

// Utility Functions
function calculateExperienceToNext(level) {
  // Exponential scaling
  return Math.floor(1000 * Math.pow(1.1, level - 1));
}

function generateSeasonRewards() {
  const rewards = {
    free: [],
    premium: [],
    premiumPlus: []
  };

  for (let level = 1; level <= 100; level++) {
    // Free track rewards
    if (level % 5 === 0) {
      rewards.free.push({
        type: REWARD_TYPES.WILDCARDS,
        amount: 1,
        rarity: level % 20 === 0 ? 'mythic' : 'rare'
      });
    } else {
      rewards.free.push({
        type: REWARD_TYPES.CURRENCY,
        amount: 50,
        currency: 'gold'
      });
    }

    // Premium track rewards
    if (level % 10 === 0) {
      rewards.premium.push({
        type: REWARD_TYPES.COSMETICS,
        item: `premium_card_back_${level}`,
        rarity: 'epic'
      });
    } else if (level % 3 === 0) {
      rewards.premium.push({
        type: REWARD_TYPES.WILDCARDS,
        amount: 2,
        rarity: 'rare'
      });
    } else {
      rewards.premium.push({
        type: REWARD_TYPES.CURRENCY,
        amount: 100,
        currency: 'gems'
      });
    }

    // Premium+ exclusive rewards
    if (level % 25 === 0) {
      rewards.premiumPlus.push({
        type: REWARD_TYPES.ANIMATIONS,
        item: `legendary_victory_animation_${level}`,
        rarity: 'legendary'
      });
    }
  }

  return rewards;
}

function generateDailyQuests() {
  const questTemplates = [
    { id: 'win_games', name: 'Win 3 Games', target: 3, experience: 500 },
    { id: 'play_cards', name: 'Play 15 Cards', target: 15, experience: 300 },
    { id: 'deal_damage', name: 'Deal 20 Damage', target: 20, experience: 400 },
    { id: 'use_abilities', name: 'Use 5 Abilities', target: 5, experience: 350 }
  ];

  return questTemplates.slice(0, 3).map((template, index) => ({
    ...template,
    id: `daily_${Date.now()}_${index}`,
    type: QUEST_TYPES.DAILY,
    progress: 0,
    completed: false,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
}

function generateWeeklyQuests() {
  return [
    {
      id: `weekly_${Date.now()}`,
      name: 'Win 15 Games',
      target: 15,
      progress: 0,
      experience: 2000,
      type: QUEST_TYPES.WEEKLY,
      completed: false,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  ];
}

function generateSeasonalQuests() {
  return [
    {
      id: `seasonal_${Date.now()}`,
      name: 'Reach Level 50',
      target: 50,
      progress: 0,
      experience: 5000,
      type: QUEST_TYPES.SEASONAL,
      completed: false,
      expiresAt: new Date('2024-03-31').getTime()
    }
  ];
}

function findQuestById(questId, quests) {
  for (const questType of Object.keys(quests)) {
    if (questType === 'completed') continue;
    const quest = quests[questType].find(q => q.id === questId);
    if (quest) return quest;
  }
  return null;
}

function applyReward(reward) {
  // Apply the reward to the player's account
  // This would integrate with the main game systems
  console.log('Applying reward:', reward);
}

// Hook to use the battle pass
export const useBattlePass = () => {
  const context = useContext(BattlePassContext);
  if (!context) {
    throw new Error('useBattlePass must be used within a BattlePassProvider');
  }
  return context;
};

// Export constants
export { PASS_TYPES, REWARD_TYPES, QUEST_TYPES, ACTIONS };