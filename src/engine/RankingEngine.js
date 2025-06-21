/**
 * Competitive Ranking Engine for KONIVRER
 * Handles MMR/ELO system, seasonal rankings, matchmaking, and rewards
 */
export class RankingEngine {
  constructor(options = {}) {
    this.options = {
      enableRankedPlay: true,
      enableSeasons: true,
      enableRewards: true,
      enableDecaySystem: true,
      enablePlacementMatches: true,
      ...options
    };

    // Ranking tiers
    this.tiers = {
      bronze: { name: 'Bronze', divisions: 4, mmrRange: [0, 1199], color: '#CD7F32' },
      silver: { name: 'Silver', divisions: 4, mmrRange: [1200, 1599], color: '#C0C0C0' },
      gold: { name: 'Gold', divisions: 4, mmrRange: [1600, 1999], color: '#FFD700' },
      platinum: { name: 'Platinum', divisions: 4, mmrRange: [2000, 2399], color: '#E5E4E2' },
      diamond: { name: 'Diamond', divisions: 4, mmrRange: [2400, 2799], color: '#B9F2FF' },
      master: { name: 'Master', divisions: 1, mmrRange: [2800, 3199], color: '#FF6B6B' },
      grandmaster: { name: 'Grandmaster', divisions: 1, mmrRange: [3200, 3599], color: '#4ECDC4' },
      mythic: { name: 'Mythic', divisions: 1, mmrRange: [3600, Infinity], color: '#9B59B6' }
    };

    // Player data
    this.playerData = {
      mmr: 1200,
      tier: 'silver',
      division: 1,
      lp: 0, // League Points within division
      wins: 0,
      losses: 0,
      winStreak: 0,
      lossStreak: 0,
      placementMatches: 0,
      isPlacement: true,
      peakMMR: 1200,
      seasonStats: {}
    };

    // Season system
    this.season = {
      current: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      rewards: new Map(),
      leaderboard: new Map()
    };

    // Matchmaking
    this.matchmaking = {
      queue: [],
      activeMatches: new Map(),
      searchRange: 100, // Initial MMR search range
      maxSearchRange: 500,
      searchExpansionRate: 50, // MMR range expansion per 30 seconds
      averageWaitTime: 60000 // 1 minute
    };

    // ELO calculation constants
    this.eloConstants = {
      kFactor: 32,
      placementKFactor: 50,
      provisionalGames: 10,
      decayThreshold: 14, // days of inactivity
      decayRate: 25, // MMR lost per week of inactivity
      winStreakBonus: 5, // Extra LP for win streaks
      maxWinStreakBonus: 25
    };

    // Rewards system
    this.rewards = {
      daily: new Map(),
      weekly: new Map(),
      seasonal: new Map(),
      achievements: new Map()
    };

    this.init();
  }

  async init() {
    try {
      await this.loadPlayerData();
      this.initializeSeasonData();
      this.setupMatchmaking();
      this.setupRewardsSystem();
      this.startDecayTimer();
      
      console.log('Ranking Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Ranking Engine:', error);
    }
  }

  /**
   * MMR and Ranking System
   */
  calculateMMRChange(playerMMR, opponentMMR, gameResult, isPlacement = false) {
    // Calculate expected score using ELO formula
    const expectedScore = 1 / (1 + Math.pow(10, (opponentMMR - playerMMR) / 400));
    
    // Actual score (1 for win, 0.5 for draw, 0 for loss)
    const actualScore = gameResult === 'win' ? 1 : gameResult === 'draw' ? 0.5 : 0;
    
    // K-factor (higher for placement matches)
    const kFactor = isPlacement ? this.eloConstants.placementKFactor : this.eloConstants.kFactor;
    
    // Calculate MMR change
    const mmrChange = Math.round(kFactor * (actualScore - expectedScore));
    
    return {
      mmrChange,
      expectedScore,
      actualScore,
      kFactor
    };
  }

  processGameResult(opponentMMR, gameResult, gameDuration, performanceMetrics = {}) {
    const isPlacement = this.playerData.isPlacement;
    
    // Calculate base MMR change
    const mmrCalculation = this.calculateMMRChange(
      this.playerData.mmr,
      opponentMMR,
      gameResult,
      isPlacement
    );

    let mmrChange = mmrCalculation.mmrChange;
    
    // Apply performance modifiers
    mmrChange = this.applyPerformanceModifiers(mmrChange, performanceMetrics, gameResult);
    
    // Apply streak bonuses/penalties
    mmrChange = this.applyStreakModifiers(mmrChange, gameResult);
    
    // Update player stats
    this.updatePlayerStats(gameResult, mmrChange, gameDuration);
    
    // Calculate LP and tier changes
    const tierChange = this.updateTierAndLP(mmrChange);
    
    // Check for achievements
    this.checkAchievements(gameResult, performanceMetrics);
    
    // Save data
    this.savePlayerData();
    
    return {
      mmrChange,
      newMMR: this.playerData.mmr,
      lpChange: tierChange.lpChange,
      tierChange: tierChange.tierChanged,
      newTier: this.playerData.tier,
      newDivision: this.playerData.division,
      calculation: mmrCalculation,
      achievements: tierChange.achievements || []
    };
  }

  applyPerformanceModifiers(baseMmrChange, metrics, gameResult) {
    let modifier = 1.0;
    
    // Performance metrics that can affect MMR
    const {
      damageDealt = 0,
      damageReceived = 0,
      cardsPlayed = 0,
      optimalPlays = 0,
      totalPlays = 1,
      gameLength = 600 // 10 minutes default
    } = metrics;

    // Efficiency modifier (optimal plays ratio)
    const efficiency = optimalPlays / totalPlays;
    if (efficiency > 0.8) {
      modifier += 0.1; // 10% bonus for high efficiency
    } else if (efficiency < 0.4) {
      modifier -= 0.1; // 10% penalty for low efficiency
    }

    // Game length modifier (prevent farming short games)
    if (gameLength < 180) { // Less than 3 minutes
      modifier -= 0.2;
    } else if (gameLength > 1800) { // More than 30 minutes
      modifier += 0.1; // Bonus for long, strategic games
    }

    // Damage ratio modifier (for wins only)
    if (gameResult === 'win' && damageReceived > 0) {
      const damageRatio = damageDealt / damageReceived;
      if (damageRatio > 3) {
        modifier += 0.05; // Small bonus for dominant wins
      }
    }

    return Math.round(baseMmrChange * modifier);
  }

  applyStreakModifiers(mmrChange, gameResult) {
    if (gameResult === 'win') {
      // Win streak bonus
      const streakBonus = Math.min(
        this.playerData.winStreak * this.eloConstants.winStreakBonus,
        this.eloConstants.maxWinStreakBonus
      );
      return mmrChange + streakBonus;
    } else if (gameResult === 'loss') {
      // Loss streak protection (reduce MMR loss)
      if (this.playerData.lossStreak >= 3) {
        const protection = Math.min(this.playerData.lossStreak * 2, 10);
        return Math.max(mmrChange + protection, mmrChange * 0.5);
      }
    }
    
    return mmrChange;
  }

  updatePlayerStats(gameResult, mmrChange, gameDuration) {
    // Update basic stats
    if (gameResult === 'win') {
      this.playerData.wins++;
      this.playerData.winStreak++;
      this.playerData.lossStreak = 0;
    } else if (gameResult === 'loss') {
      this.playerData.losses++;
      this.playerData.lossStreak++;
      this.playerData.winStreak = 0;
    } else {
      // Draw
      this.playerData.winStreak = 0;
      this.playerData.lossStreak = 0;
    }

    // Update MMR
    this.playerData.mmr = Math.max(0, this.playerData.mmr + mmrChange);
    this.playerData.peakMMR = Math.max(this.playerData.peakMMR, this.playerData.mmr);

    // Update placement status
    if (this.playerData.isPlacement) {
      this.playerData.placementMatches++;
      if (this.playerData.placementMatches >= this.eloConstants.provisionalGames) {
        this.playerData.isPlacement = false;
      }
    }

    // Update season stats
    const seasonKey = `season_${this.season.current}`;
    if (!this.playerData.seasonStats[seasonKey]) {
      this.playerData.seasonStats[seasonKey] = {
        wins: 0,
        losses: 0,
        peakMMR: this.playerData.mmr,
        gamesPlayed: 0,
        totalGameTime: 0
      };
    }

    const seasonStats = this.playerData.seasonStats[seasonKey];
    seasonStats.gamesPlayed++;
    seasonStats.totalGameTime += gameDuration;
    seasonStats.peakMMR = Math.max(seasonStats.peakMMR, this.playerData.mmr);
    
    if (gameResult === 'win') {
      seasonStats.wins++;
    } else if (gameResult === 'loss') {
      seasonStats.losses++;
    }
  }

  updateTierAndLP(mmrChange) {
    const oldTier = this.playerData.tier;
    const oldDivision = this.playerData.division;
    
    // Determine new tier based on MMR
    const newTierData = this.getTierFromMMR(this.playerData.mmr);
    
    let lpChange = 0;
    let tierChanged = false;
    const achievements = [];

    if (newTierData.tier !== oldTier || newTierData.division !== oldDivision) {
      // Tier or division changed
      tierChanged = true;
      
      if (this.compareTiers(newTierData.tier, newTierData.division, oldTier, oldDivision) > 0) {
        // Promotion
        achievements.push({
          type: 'promotion',
          message: `Promoted to ${this.tiers[newTierData.tier].name} ${newTierData.division}!`,
          tier: newTierData.tier,
          division: newTierData.division
        });
        
        // Award promotion rewards
        this.awardPromotionRewards(newTierData.tier, newTierData.division);
      } else {
        // Demotion
        achievements.push({
          type: 'demotion',
          message: `Demoted to ${this.tiers[newTierData.tier].name} ${newTierData.division}`,
          tier: newTierData.tier,
          division: newTierData.division
        });
      }
    }

    // Calculate LP change within division
    const tierInfo = this.tiers[newTierData.tier];
    const mmrRange = tierInfo.mmrRange[1] - tierInfo.mmrRange[0];
    const divisionRange = mmrRange / tierInfo.divisions;
    const divisionStart = tierInfo.mmrRange[0] + (newTierData.division - 1) * divisionRange;
    
    this.playerData.lp = Math.round(((this.playerData.mmr - divisionStart) / divisionRange) * 100);
    this.playerData.tier = newTierData.tier;
    this.playerData.division = newTierData.division;
    
    lpChange = mmrChange; // Simplified LP change

    return {
      lpChange,
      tierChanged,
      achievements
    };
  }

  getTierFromMMR(mmr) {
    for (const [tierKey, tierData] of Object.entries(this.tiers)) {
      if (mmr >= tierData.mmrRange[0] && mmr < tierData.mmrRange[1]) {
        // Calculate division within tier
        const mmrRange = tierData.mmrRange[1] - tierData.mmrRange[0];
        const divisionRange = mmrRange / tierData.divisions;
        const division = Math.min(
          tierData.divisions,
          Math.floor((mmr - tierData.mmrRange[0]) / divisionRange) + 1
        );
        
        return { tier: tierKey, division };
      }
    }
    
    // Default to highest tier if MMR exceeds all ranges
    return { tier: 'mythic', division: 1 };
  }

  compareTiers(tier1, division1, tier2, division2) {
    const tierOrder = Object.keys(this.tiers);
    const tier1Index = tierOrder.indexOf(tier1);
    const tier2Index = tierOrder.indexOf(tier2);
    
    if (tier1Index !== tier2Index) {
      return tier1Index - tier2Index;
    }
    
    return division1 - division2;
  }

  /**
   * Matchmaking System
   */
  async findMatch(gameMode = 'ranked') {
    if (gameMode !== 'ranked') {
      // For non-ranked modes, use simpler matchmaking
      return this.findCasualMatch();
    }

    const searchStartTime = Date.now();
    let searchRange = this.matchmaking.searchRange;
    
    return new Promise((resolve, reject) => {
      const searchInterval = setInterval(() => {
        const opponent = this.findOpponentInRange(
          this.playerData.mmr,
          searchRange
        );

        if (opponent) {
          clearInterval(searchInterval);
          resolve({
            opponent,
            estimatedMMR: opponent.mmr,
            searchTime: Date.now() - searchStartTime,
            searchRange
          });
        } else {
          // Expand search range
          searchRange += this.matchmaking.searchExpansionRate;
          
          if (searchRange > this.matchmaking.maxSearchRange) {
            clearInterval(searchInterval);
            reject(new Error('No suitable opponent found'));
          }
        }
      }, 5000); // Check every 5 seconds

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(searchInterval);
        reject(new Error('Matchmaking timeout'));
      }, 300000);
    });
  }

  findOpponentInRange(playerMMR, range) {
    // In a real implementation, this would query a matchmaking service
    // For now, simulate finding an opponent
    const minMMR = playerMMR - range;
    const maxMMR = playerMMR + range;
    
    // Simulate opponent with MMR in range
    const opponentMMR = minMMR + Math.random() * (maxMMR - minMMR);
    
    return {
      id: `opponent_${Date.now()}`,
      mmr: Math.round(opponentMMR),
      tier: this.getTierFromMMR(opponentMMR).tier,
      division: this.getTierFromMMR(opponentMMR).division
    };
  }

  /**
   * Season System
   */
  initializeSeasonData() {
    // Load current season data
    const savedSeason = localStorage.getItem('konivrer_current_season');
    if (savedSeason) {
      try {
        this.season = { ...this.season, ...JSON.parse(savedSeason) };
      } catch (error) {
        console.warn('Failed to load season data:', error);
      }
    }

    // Check if season has ended
    if (new Date() > new Date(this.season.endDate)) {
      this.endSeason();
    }

    this.setupSeasonRewards();
  }

  setupSeasonRewards() {
    // Define rewards for each tier
    const seasonRewards = {
      bronze: { currency: 100, packs: 1, cosmetics: [] },
      silver: { currency: 200, packs: 2, cosmetics: ['silver_border'] },
      gold: { currency: 400, packs: 4, cosmetics: ['gold_border', 'gold_avatar'] },
      platinum: { currency: 800, packs: 6, cosmetics: ['platinum_border', 'platinum_avatar'] },
      diamond: { currency: 1200, packs: 8, cosmetics: ['diamond_border', 'diamond_avatar', 'diamond_cardback'] },
      master: { currency: 1600, packs: 12, cosmetics: ['master_border', 'master_avatar', 'master_cardback'] },
      grandmaster: { currency: 2000, packs: 16, cosmetics: ['gm_border', 'gm_avatar', 'gm_cardback', 'gm_title'] },
      mythic: { currency: 2500, packs: 20, cosmetics: ['mythic_border', 'mythic_avatar', 'mythic_cardback', 'mythic_title', 'mythic_emote'] }
    };

    this.season.rewards = new Map(Object.entries(seasonRewards));
  }

  endSeason() {
    // Award season-end rewards
    const playerTier = this.playerData.tier;
    const rewards = this.season.rewards.get(playerTier);
    
    if (rewards) {
      this.awardSeasonRewards(rewards);
    }

    // Reset for new season
    this.startNewSeason();
  }

  startNewSeason() {
    this.season.current++;
    this.season.startDate = new Date();
    this.season.endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    // Soft MMR reset
    this.performSoftReset();
    
    // Save new season data
    localStorage.setItem('konivrer_current_season', JSON.stringify(this.season));
  }

  performSoftReset() {
    // Soft reset: move MMR towards 1200 (starting MMR)
    const resetTarget = 1200;
    const resetStrength = 0.3; // 30% reset
    
    this.playerData.mmr = Math.round(
      this.playerData.mmr + (resetTarget - this.playerData.mmr) * resetStrength
    );
    
    // Reset placement status for new season
    this.playerData.isPlacement = true;
    this.playerData.placementMatches = 0;
    
    // Reset streaks
    this.playerData.winStreak = 0;
    this.playerData.lossStreak = 0;
  }

  /**
   * Rewards System
   */
  setupRewardsSystem() {
    // Daily rewards
    this.rewards.daily.set('first_win', {
      name: 'First Win of the Day',
      currency: 50,
      experience: 100
    });

    // Weekly rewards
    this.rewards.weekly.set('weekly_wins', {
      name: 'Weekly Victories',
      requirements: { wins: 10 },
      currency: 200,
      packs: 1
    });

    // Achievement rewards
    this.setupAchievements();
  }

  setupAchievements() {
    const achievements = [
      {
        id: 'first_win',
        name: 'First Victory',
        description: 'Win your first ranked game',
        requirements: { wins: 1 },
        rewards: { currency: 100, title: 'Novice' }
      },
      {
        id: 'win_streak_5',
        name: 'Hot Streak',
        description: 'Win 5 games in a row',
        requirements: { winStreak: 5 },
        rewards: { currency: 250, emote: 'fire' }
      },
      {
        id: 'reach_gold',
        name: 'Golden Ascension',
        description: 'Reach Gold tier',
        requirements: { tier: 'gold' },
        rewards: { currency: 500, cardback: 'gold_ascension' }
      },
      {
        id: 'perfect_season',
        name: 'Flawless Victory',
        description: 'Complete placement matches with 10 wins',
        requirements: { placementWins: 10 },
        rewards: { currency: 1000, title: 'Flawless', avatar: 'perfect' }
      }
    ];

    achievements.forEach(achievement => {
      this.rewards.achievements.set(achievement.id, achievement);
    });
  }

  checkAchievements(gameResult, performanceMetrics) {
    const unlockedAchievements = [];

    this.rewards.achievements.forEach((achievement, id) => {
      if (this.isAchievementUnlocked(id)) return; // Already unlocked

      if (this.checkAchievementRequirements(achievement.requirements)) {
        this.unlockAchievement(id);
        unlockedAchievements.push(achievement);
      }
    });

    return unlockedAchievements;
  }

  checkAchievementRequirements(requirements) {
    for (const [key, value] of Object.entries(requirements)) {
      switch (key) {
        case 'wins':
          if (this.playerData.wins < value) return false;
          break;
        case 'winStreak':
          if (this.playerData.winStreak < value) return false;
          break;
        case 'tier':
          if (this.compareTiers(this.playerData.tier, this.playerData.division, value, 1) < 0) return false;
          break;
        case 'placementWins':
          const seasonStats = this.playerData.seasonStats[`season_${this.season.current}`];
          if (!seasonStats || seasonStats.wins < value) return false;
          break;
      }
    }
    return true;
  }

  unlockAchievement(achievementId) {
    const achievement = this.rewards.achievements.get(achievementId);
    if (!achievement) return;

    // Mark as unlocked
    if (!this.playerData.unlockedAchievements) {
      this.playerData.unlockedAchievements = new Set();
    }
    this.playerData.unlockedAchievements.add(achievementId);

    // Award rewards
    this.awardRewards(achievement.rewards);

    // Dispatch event
    this.dispatchEvent('achievementUnlocked', {
      achievement,
      rewards: achievement.rewards
    });
  }

  isAchievementUnlocked(achievementId) {
    return this.playerData.unlockedAchievements?.has(achievementId) || false;
  }

  awardRewards(rewards) {
    // In a real implementation, this would update the player's inventory
    console.log('Rewards awarded:', rewards);
  }

  awardPromotionRewards(tier, division) {
    const promotionRewards = {
      currency: 100 * this.getTierLevel(tier),
      experience: 200 * this.getTierLevel(tier)
    };

    this.awardRewards(promotionRewards);
  }

  awardSeasonRewards(rewards) {
    this.awardRewards(rewards);
    
    this.dispatchEvent('seasonRewardsAwarded', {
      tier: this.playerData.tier,
      rewards
    });
  }

  getTierLevel(tier) {
    const tierOrder = Object.keys(this.tiers);
    return tierOrder.indexOf(tier) + 1;
  }

  /**
   * Decay System
   */
  startDecayTimer() {
    if (!this.options.enableDecaySystem) return;

    setInterval(() => {
      this.checkForDecay();
    }, 24 * 60 * 60 * 1000); // Check daily
  }

  checkForDecay() {
    const lastGameTime = this.playerData.lastGameTime || Date.now();
    const daysSinceLastGame = (Date.now() - lastGameTime) / (24 * 60 * 60 * 1000);

    if (daysSinceLastGame >= this.eloConstants.decayThreshold) {
      const weeksOfInactivity = Math.floor(daysSinceLastGame / 7);
      const decayAmount = weeksOfInactivity * this.eloConstants.decayRate;
      
      if (decayAmount > 0) {
        this.applyDecay(decayAmount);
      }
    }
  }

  applyDecay(amount) {
    const oldMMR = this.playerData.mmr;
    this.playerData.mmr = Math.max(0, this.playerData.mmr - amount);
    
    // Update tier based on new MMR
    const newTierData = this.getTierFromMMR(this.playerData.mmr);
    this.playerData.tier = newTierData.tier;
    this.playerData.division = newTierData.division;

    this.dispatchEvent('mmrDecay', {
      oldMMR,
      newMMR: this.playerData.mmr,
      decayAmount: amount
    });

    this.savePlayerData();
  }

  /**
   * Data Management
   */
  async loadPlayerData() {
    const saved = localStorage.getItem('konivrer_ranking_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.playerData = { ...this.playerData, ...data };
        
        // Convert Set back from array
        if (data.unlockedAchievements) {
          this.playerData.unlockedAchievements = new Set(data.unlockedAchievements);
        }
      } catch (error) {
        console.warn('Failed to load ranking data:', error);
      }
    }
  }

  savePlayerData() {
    const dataToSave = { ...this.playerData };
    
    // Convert Set to array for JSON serialization
    if (dataToSave.unlockedAchievements) {
      dataToSave.unlockedAchievements = Array.from(dataToSave.unlockedAchievements);
    }

    localStorage.setItem('konivrer_ranking_data', JSON.stringify(dataToSave));
  }

  /**
   * Public API
   */
  getPlayerRank() {
    return {
      mmr: this.playerData.mmr,
      tier: this.playerData.tier,
      division: this.playerData.division,
      lp: this.playerData.lp,
      isPlacement: this.playerData.isPlacement,
      placementMatches: this.playerData.placementMatches,
      wins: this.playerData.wins,
      losses: this.playerData.losses,
      winRate: this.playerData.wins / (this.playerData.wins + this.playerData.losses) || 0,
      winStreak: this.playerData.winStreak,
      peakMMR: this.playerData.peakMMR
    };
  }

  getSeasonInfo() {
    return {
      current: this.season.current,
      startDate: this.season.startDate,
      endDate: this.season.endDate,
      daysRemaining: Math.ceil((new Date(this.season.endDate) - new Date()) / (24 * 60 * 60 * 1000)),
      playerStats: this.playerData.seasonStats[`season_${this.season.current}`] || {}
    };
  }

  getLeaderboard(tier = null, limit = 100) {
    // In a real implementation, this would fetch from server
    // For now, return mock data
    return Array.from({ length: limit }, (_, i) => ({
      rank: i + 1,
      username: `Player${i + 1}`,
      mmr: 3000 - i * 10,
      tier: 'master',
      division: 1
    }));
  }

  getTierInfo(tier = null) {
    if (tier) {
      return this.tiers[tier];
    }
    return this.tiers;
  }

  getUnlockedAchievements() {
    if (!this.playerData.unlockedAchievements) return [];
    
    return Array.from(this.playerData.unlockedAchievements).map(id => 
      this.rewards.achievements.get(id)
    ).filter(Boolean);
  }

  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`ranking:${eventName}`, {
      detail,
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  reset() {
    this.playerData = {
      mmr: 1200,
      tier: 'silver',
      division: 1,
      lp: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      lossStreak: 0,
      placementMatches: 0,
      isPlacement: true,
      peakMMR: 1200,
      seasonStats: {},
      unlockedAchievements: new Set()
    };
    
    this.savePlayerData();
  }
}

export default RankingEngine;