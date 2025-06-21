/**
 * Competitive Ranking Engine for KONIVRER
 * Handles Bayesian TrueSkill system, seasonal rankings, matchmaking, and rewards
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

    // Ranking tiers (based on conservative skill estimate)
    this.tiers = {
      bronze: { name: 'Bronze', divisions: 4, skillRange: [0, 1199], color: '#CD7F32' },
      silver: { name: 'Silver', divisions: 4, skillRange: [1200, 1599], color: '#C0C0C0' },
      gold: { name: 'Gold', divisions: 4, skillRange: [1600, 1999], color: '#FFD700' },
      platinum: { name: 'Platinum', divisions: 4, skillRange: [2000, 2399], color: '#E5E4E2' },
      diamond: { name: 'Diamond', divisions: 4, skillRange: [2400, 2799], color: '#B9F2FF' },
      master: { name: 'Master', divisions: 1, skillRange: [2800, 3199], color: '#FF6B6B' },
      grandmaster: { name: 'Grandmaster', divisions: 1, skillRange: [3200, 3599], color: '#4ECDC4' },
      mythic: { name: 'Mythic', divisions: 1, skillRange: [3600, Infinity], color: '#9B59B6' }
    };

    // Bayesian TrueSkill parameters
    this.bayesianParams = {
      BETA: 200, // Skill class width (half the default uncertainty)
      TAU: 6, // Additive dynamics factor
      DRAW_PROBABILITY: 0.1, // Probability of a draw
      INITIAL_RATING: 1500, // mu (mean skill)
      INITIAL_UNCERTAINTY: 350, // sigma (uncertainty)
      MIN_UNCERTAINTY: 25, // Minimum uncertainty
      MAX_UNCERTAINTY: 350 // Maximum uncertainty
    };

    // Player data (Bayesian model)
    this.playerData = {
      rating: this.bayesianParams.INITIAL_RATING, // mu (skill mean)
      uncertainty: this.bayesianParams.INITIAL_UNCERTAINTY, // sigma (skill uncertainty)
      conservativeRating: 0, // rating - 3 * uncertainty
      tier: 'bronze',
      division: 1,
      lp: 0, // League Points within division
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      lossStreak: 0,
      placementMatches: 0,
      isPlacement: true,
      peakRating: this.bayesianParams.INITIAL_RATING,
      seasonStats: {},
      formatRatings: {}, // Format-specific ratings
      deckArchetypes: [], // Deck archetype performance
      matchHistory: [], // Match history for learning
      confidence: 0.1, // How confident we are in the rating
      volatility: 0.06 // How much the rating changes
    };

    // Season system
    this.season = {
      current: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      rewards: new Map(),
      leaderboard: new Map()
    };

    // Matchmaking (Bayesian-based)
    this.matchmaking = {
      queue: [],
      activeMatches: new Map(),
      searchRange: 100, // Initial skill search range
      maxSearchRange: 500,
      searchExpansionRate: 50, // Skill range expansion per 30 seconds
      averageWaitTime: 60000, // 1 minute
      qualityThreshold: 0.7, // Minimum match quality
      maxSkillDifference: 500, // Maximum allowed skill difference
      minSkillDifference: 100 // Minimum desired skill difference
    };

    // Deck archetype matchup matrix (win rates)
    this.deckMatchups = {
      'Aggro': { 'Aggro': 0.5, 'Control': 0.65, 'Midrange': 0.55, 'Combo': 0.7, 'Tempo': 0.45, 'Ramp': 0.75 },
      'Control': { 'Aggro': 0.35, 'Control': 0.5, 'Midrange': 0.6, 'Combo': 0.4, 'Tempo': 0.55, 'Ramp': 0.45 },
      'Midrange': { 'Aggro': 0.45, 'Control': 0.4, 'Midrange': 0.5, 'Combo': 0.65, 'Tempo': 0.6, 'Ramp': 0.5 },
      'Combo': { 'Aggro': 0.3, 'Control': 0.6, 'Midrange': 0.35, 'Combo': 0.5, 'Tempo': 0.4, 'Ramp': 0.8 },
      'Tempo': { 'Aggro': 0.55, 'Control': 0.45, 'Midrange': 0.4, 'Combo': 0.6, 'Tempo': 0.5, 'Ramp': 0.65 },
      'Ramp': { 'Aggro': 0.25, 'Control': 0.55, 'Midrange': 0.5, 'Combo': 0.2, 'Tempo': 0.35, 'Ramp': 0.5 }
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
   * Bayesian TrueSkill Rating System
   */
  calculateTrueSkillUpdate(playerRating, playerUncertainty, opponentRating, opponentUncertainty, gameResult, format = null) {
    // TrueSkill calculations
    const c = Math.sqrt(2 * this.bayesianParams.BETA * this.bayesianParams.BETA + 
                       playerUncertainty * playerUncertainty + 
                       opponentUncertainty * opponentUncertainty);
    
    const winProbability = this.normalCDF((playerRating - opponentRating) / c);
    const drawProbability = this.bayesianParams.DRAW_PROBABILITY;
    
    // Actual outcome (1 for win, 0.5 for draw, 0 for loss)
    const actualOutcome = gameResult === 'win' ? 1.0 : gameResult === 'draw' ? 0.5 : 0.0;
    
    // Calculate v and w functions
    const v = this.vFunction(winProbability, drawProbability, actualOutcome);
    const w = this.wFunction(winProbability, drawProbability, actualOutcome);
    
    // Update ratings
    const newPlayerRating = playerRating + (playerUncertainty * playerUncertainty / c) * v;
    const newOpponentRating = opponentRating - (opponentUncertainty * opponentUncertainty / c) * v;
    
    // Update uncertainties
    const newPlayerUncertainty = Math.sqrt(Math.max(
      playerUncertainty * playerUncertainty * (1 - (playerUncertainty * playerUncertainty / (c * c)) * w),
      this.bayesianParams.MIN_UNCERTAINTY
    ));
    const newOpponentUncertainty = Math.sqrt(Math.max(
      opponentUncertainty * opponentUncertainty * (1 - (opponentUncertainty * opponentUncertainty / (c * c)) * w),
      this.bayesianParams.MIN_UNCERTAINTY
    ));
    
    return {
      player: {
        oldRating: playerRating,
        newRating: newPlayerRating,
        oldUncertainty: playerUncertainty,
        newUncertainty: newPlayerUncertainty,
        ratingChange: newPlayerRating - playerRating
      },
      opponent: {
        oldRating: opponentRating,
        newRating: newOpponentRating,
        oldUncertainty: opponentUncertainty,
        newUncertainty: newOpponentUncertainty,
        ratingChange: newOpponentRating - opponentRating
      },
      winProbability,
      actualOutcome,
      surpriseFactor: Math.abs(actualOutcome - winProbability)
    };
  }

  // Normal cumulative distribution function
  normalCDF(x) {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  // Error function approximation
  erf(x) {
    // Abramowitz and Stegun approximation
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  // TrueSkill v function
  vFunction(winProb, drawProb, actualOutcome) {
    if (actualOutcome === 1.0) { // Win
      return this.normalPDF(this.normalInverseCDF(winProb)) / (1 - this.normalCDF(this.normalInverseCDF(winProb)));
    } else if (actualOutcome === 0.0) { // Loss
      return -this.normalPDF(this.normalInverseCDF(winProb)) / this.normalCDF(this.normalInverseCDF(winProb));
    } else { // Draw
      const alpha = this.normalInverseCDF((drawProb - winProb) / 2 + winProb);
      const beta = this.normalInverseCDF((drawProb + winProb) / 2);
      return (this.normalPDF(alpha) - this.normalPDF(beta)) / (this.normalCDF(beta) - this.normalCDF(alpha));
    }
  }

  // TrueSkill w function
  wFunction(winProb, drawProb, actualOutcome) {
    const v = this.vFunction(winProb, drawProb, actualOutcome);
    if (actualOutcome === 1.0) { // Win
      const t = this.normalInverseCDF(winProb);
      return v * (v + t);
    } else if (actualOutcome === 0.0) { // Loss
      const t = this.normalInverseCDF(winProb);
      return v * (v - t);
    } else { // Draw
      const alpha = this.normalInverseCDF((drawProb - winProb) / 2 + winProb);
      const beta = this.normalInverseCDF((drawProb + winProb) / 2);
      return ((alpha * this.normalPDF(alpha) - beta * this.normalPDF(beta)) / 
              (this.normalCDF(beta) - this.normalCDF(alpha))) - Math.pow(v, 2);
    }
  }

  // Normal probability density function
  normalPDF(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }

  // Inverse normal CDF (approximation)
  normalInverseCDF(p) {
    // Beasley-Springer-Moro algorithm
    const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

    if (p < 0.02425) {
      const q = Math.sqrt(-2 * Math.log(p));
      return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
             ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    } else if (p <= 0.97575) {
      const q = p - 0.5;
      const r = q * q;
      return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q /
             (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
    } else {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
              ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    }
  }

  // Calculate win probability between two players
  calculateWinProbability(playerRating, playerUncertainty, opponentRating, opponentUncertainty) {
    const combinedUncertainty = Math.sqrt(playerUncertainty * playerUncertainty + 
                                        opponentUncertainty * opponentUncertainty);
    const ratingDifference = playerRating - opponentRating;
    const c = Math.sqrt(2) * combinedUncertainty;
    
    return 0.5 * (1 + this.erf(ratingDifference / c));
  }

  // Calculate conservative skill estimate (rating - 3 * uncertainty)
  getConservativeRating(rating, uncertainty) {
    return rating - (3 * uncertainty);
  }

  processGameResult(opponentData, gameResult, gameDuration, performanceMetrics = {}) {
    const isPlacement = this.playerData.isPlacement;
    
    // Extract opponent rating data (support both old MMR format and new Bayesian format)
    let opponentRating, opponentUncertainty;
    if (typeof opponentData === 'number') {
      // Legacy MMR format - convert to Bayesian
      opponentRating = opponentData;
      opponentUncertainty = this.bayesianParams.INITIAL_UNCERTAINTY;
    } else {
      // New Bayesian format
      opponentRating = opponentData.rating || opponentData.mmr || this.bayesianParams.INITIAL_RATING;
      opponentUncertainty = opponentData.uncertainty || this.bayesianParams.INITIAL_UNCERTAINTY;
    }
    
    // Calculate Bayesian TrueSkill update
    const skillUpdate = this.calculateTrueSkillUpdate(
      this.playerData.rating,
      this.playerData.uncertainty,
      opponentRating,
      opponentUncertainty,
      gameResult
    );

    // Apply performance modifiers to rating change
    let ratingChange = skillUpdate.player.ratingChange;
    ratingChange = this.applyPerformanceModifiers(ratingChange, performanceMetrics, gameResult);
    
    // Apply streak bonuses/penalties
    ratingChange = this.applyStreakModifiers(ratingChange, gameResult);
    
    // Update player rating and uncertainty
    const oldRating = this.playerData.rating;
    const oldUncertainty = this.playerData.uncertainty;
    
    this.playerData.rating = skillUpdate.player.newRating + (ratingChange - skillUpdate.player.ratingChange);
    this.playerData.uncertainty = skillUpdate.player.newUncertainty;
    
    // Add time-based uncertainty increase (TAU)
    this.playerData.uncertainty = Math.min(
      this.playerData.uncertainty + this.bayesianParams.TAU,
      this.bayesianParams.MAX_UNCERTAINTY
    );
    
    // Calculate conservative rating for tier placement
    this.playerData.conservativeRating = this.getConservativeRating(
      this.playerData.rating, 
      this.playerData.uncertainty
    );
    
    // Update player stats
    this.updatePlayerStats(gameResult, ratingChange, gameDuration);
    
    // Calculate LP and tier changes based on conservative rating
    const tierChange = this.updateTierAndLP(this.playerData.conservativeRating - this.getConservativeRating(oldRating, oldUncertainty));
    
    // Update deck archetype performance if available
    if (performanceMetrics.deckArchetype) {
      this.updateDeckArchetypePerformance(performanceMetrics.deckArchetype, gameResult, skillUpdate);
    }
    
    // Store match in history
    this.addMatchToHistory({
      opponentRating,
      opponentUncertainty,
      gameResult,
      ratingBefore: oldRating,
      ratingAfter: this.playerData.rating,
      uncertaintyBefore: oldUncertainty,
      uncertaintyAfter: this.playerData.uncertainty,
      winProbability: skillUpdate.winProbability,
      surpriseFactor: skillUpdate.surpriseFactor,
      performanceMetrics
    });
    
    // Check for achievements
    this.checkAchievements(gameResult, performanceMetrics);
    
    // Save data
    this.savePlayerData();
    
    return {
      ratingChange,
      newRating: this.playerData.rating,
      newUncertainty: this.playerData.uncertainty,
      conservativeRating: this.playerData.conservativeRating,
      lpChange: tierChange.lpChange,
      tierChange: tierChange.tierChanged,
      newTier: this.playerData.tier,
      newDivision: this.playerData.division,
      winProbability: skillUpdate.winProbability,
      surpriseFactor: skillUpdate.surpriseFactor,
      skillUpdate: skillUpdate,
      achievements: tierChange.achievements || []
    };
  }

  // Update deck archetype performance
  updateDeckArchetypePerformance(archetype, gameResult, skillUpdate) {
    let deckData = this.playerData.deckArchetypes.find(d => d.archetype === archetype);
    
    if (!deckData) {
      deckData = {
        archetype: archetype,
        rating: this.playerData.rating,
        uncertainty: Math.max(this.playerData.uncertainty, 300), // Higher uncertainty for new archetype
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        lastPlayed: new Date()
      };
      this.playerData.deckArchetypes.push(deckData);
    }
    
    // Update archetype-specific rating
    deckData.rating = skillUpdate.player.newRating;
    deckData.uncertainty = skillUpdate.player.newUncertainty;
    deckData.gamesPlayed += 1;
    
    if (gameResult === 'win') deckData.wins += 1;
    else if (gameResult === 'loss') deckData.losses += 1;
    else if (gameResult === 'draw') deckData.draws += 1;
    
    deckData.lastPlayed = new Date();
  }

  // Add match to history
  addMatchToHistory(matchData) {
    this.playerData.matchHistory.push({
      ...matchData,
      date: new Date(),
      matchId: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    // Keep only last 100 matches
    if (this.playerData.matchHistory.length > 100) {
      this.playerData.matchHistory = this.playerData.matchHistory.slice(-100);
    }
  }

  // Get deck archetype rating
  getDeckArchetypeRating(archetype) {
    const deckData = this.playerData.deckArchetypes.find(d => d.archetype === archetype);
    if (deckData) {
      return {
        rating: deckData.rating,
        uncertainty: deckData.uncertainty,
        gamesPlayed: deckData.gamesPlayed
      };
    }
    
    // Return default values for new archetype
    return {
      rating: this.playerData.rating,
      uncertainty: Math.max(this.playerData.uncertainty, 300), // Higher uncertainty for new archetype
      gamesPlayed: 0
    };
  }

  // Get preferred/most played archetype
  getPreferredArchetype() {
    if (this.playerData.deckArchetypes.length === 0) return null;
    
    // Return archetype with most games played
    return this.playerData.deckArchetypes.reduce((prev, current) => 
      (prev.gamesPlayed > current.gamesPlayed) ? prev : current
    ).archetype;
  }

  applyPerformanceModifiers(baseRatingChange, metrics, gameResult) {
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

  updateTierAndLP(skillChange) {
    const oldTier = this.playerData.tier;
    const oldDivision = this.playerData.division;
    
    // Determine new tier based on conservative skill rating
    const newTierData = this.getTierFromSkill(this.playerData.conservativeRating);
    
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

  getTierFromSkill(conservativeRating) {
    for (const [tierKey, tierData] of Object.entries(this.tiers)) {
      if (conservativeRating >= tierData.skillRange[0] && conservativeRating < tierData.skillRange[1]) {
        // Calculate division within tier
        const skillRange = tierData.skillRange[1] - tierData.skillRange[0];
        const divisionRange = skillRange / tierData.divisions;
        const division = Math.min(
          tierData.divisions,
          Math.floor((conservativeRating - tierData.skillRange[0]) / divisionRange) + 1
        );
        
        return { tier: tierKey, division };
      }
    }
    
    // Default to highest tier if skill exceeds all ranges
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
      rating: Math.round(opponentMMR),
      uncertainty: this.bayesianParams.INITIAL_UNCERTAINTY,
      tier: this.getTierFromSkill(Math.round(opponentMMR) - (3 * this.bayesianParams.INITIAL_UNCERTAINTY)).tier,
      division: this.getTierFromSkill(Math.round(opponentMMR) - (3 * this.bayesianParams.INITIAL_UNCERTAINTY)).division
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
    // Soft reset: move rating towards initial rating and increase uncertainty
    const resetTarget = this.bayesianParams.INITIAL_RATING;
    const resetStrength = 0.3; // 30% reset
    
    this.playerData.rating = Math.round(
      this.playerData.rating + (resetTarget - this.playerData.rating) * resetStrength
    );
    
    // Increase uncertainty for new season (but not to full initial uncertainty)
    this.playerData.uncertainty = Math.min(
      this.playerData.uncertainty + 100, // Add 100 uncertainty points
      this.bayesianParams.INITIAL_UNCERTAINTY
    );
    
    // Recalculate conservative rating
    this.playerData.conservativeRating = this.getConservativeRating(
      this.playerData.rating, 
      this.playerData.uncertainty
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
    const oldRating = this.playerData.rating;
    const oldUncertainty = this.playerData.uncertainty;
    
    // Apply decay by reducing rating and increasing uncertainty
    this.playerData.rating = Math.max(0, this.playerData.rating - amount);
    this.playerData.uncertainty = Math.min(
      this.playerData.uncertainty + (amount * 0.5), // Increase uncertainty proportionally
      this.bayesianParams.MAX_UNCERTAINTY
    );
    
    // Recalculate conservative rating
    this.playerData.conservativeRating = this.getConservativeRating(
      this.playerData.rating, 
      this.playerData.uncertainty
    );
    
    // Update tier based on new conservative rating
    const newTierData = this.getTierFromSkill(this.playerData.conservativeRating);
    this.playerData.tier = newTierData.tier;
    this.playerData.division = newTierData.division;

    this.dispatchEvent('ratingDecay', {
      oldRating,
      newRating: this.playerData.rating,
      oldUncertainty,
      newUncertainty: this.playerData.uncertainty,
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
        
        // Migrate old MMR data to new Bayesian format
        if (data.mmr && !data.rating) {
          this.playerData.rating = data.mmr;
          this.playerData.uncertainty = this.bayesianParams.INITIAL_UNCERTAINTY;
        }
        
        // Ensure conservative rating is calculated
        if (!this.playerData.conservativeRating) {
          this.playerData.conservativeRating = this.getConservativeRating(
            this.playerData.rating, 
            this.playerData.uncertainty
          );
        }
        
        // Initialize arrays if they don't exist
        if (!this.playerData.deckArchetypes) {
          this.playerData.deckArchetypes = [];
        }
        if (!this.playerData.matchHistory) {
          this.playerData.matchHistory = [];
        }
        if (!this.playerData.formatRatings) {
          this.playerData.formatRatings = {};
        }
        
      } catch (error) {
        console.warn('Failed to load ranking data:', error);
      }
    }
    
    // Always ensure conservative rating is calculated
    this.playerData.conservativeRating = this.getConservativeRating(
      this.playerData.rating, 
      this.playerData.uncertainty
    );
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
   * Integration with Bayesian Matchmaking Service
   */
  getBayesianPlayerData() {
    return {
      userId: this.playerData.userId || 'local_player',
      overallRating: this.playerData.rating,
      overallUncertainty: this.playerData.uncertainty,
      conservativeRating: this.playerData.conservativeRating,
      formatRatings: this.playerData.formatRatings,
      deckArchetypes: this.playerData.deckArchetypes,
      matchHistory: this.playerData.matchHistory,
      totalGames: this.playerData.wins + this.playerData.losses + this.playerData.draws,
      totalWins: this.playerData.wins,
      totalLosses: this.playerData.losses,
      totalDraws: this.playerData.draws,
      confidence: this.playerData.confidence,
      volatility: this.playerData.volatility,
      lastActive: new Date()
    };
  }

  // Calculate match quality between two players
  calculateMatchQuality(opponentData) {
    const myRating = this.playerData.rating;
    const myUncertainty = this.playerData.uncertainty;
    const oppRating = opponentData.rating || opponentData.overallRating;
    const oppUncertainty = opponentData.uncertainty || opponentData.overallUncertainty;
    
    // Calculate skill difference
    const skillDifference = Math.abs(myRating - oppRating);
    const maxAllowedDifference = this.matchmaking.maxSkillDifference;
    const minDesiredDifference = this.matchmaking.minSkillDifference;
    
    // Skill balance score (prefer closer matches)
    let skillScore = 1.0;
    if (skillDifference > maxAllowedDifference) {
      skillScore = 0.1; // Heavily penalize mismatched skills
    } else if (skillDifference < minDesiredDifference) {
      skillScore = 0.8; // Slightly penalize too-close matches
    } else {
      // Optimal range
      skillScore = 1.0 - (skillDifference / maxAllowedDifference) * 0.5;
    }
    
    // Uncertainty consideration (prefer matches with lower combined uncertainty)
    const combinedUncertainty = myUncertainty + oppUncertainty;
    const uncertaintyScore = Math.max(0.1, 1.0 - (combinedUncertainty / 700));
    
    // Win probability (prefer matches close to 50/50)
    const winProbability = this.calculateWinProbability(myRating, myUncertainty, oppRating, oppUncertainty);
    const balanceScore = 1.0 - Math.abs(0.5 - winProbability);
    
    // Combine scores
    const finalScore = (skillScore * 0.4 + uncertaintyScore * 0.3 + balanceScore * 0.3);
    
    return {
      score: finalScore,
      skillDifference,
      combinedUncertainty,
      winProbability,
      skillScore,
      uncertaintyScore,
      balanceScore
    };
  }

  /**
   * Public API
   */
  getPlayerRank() {
    return {
      rating: this.playerData.rating,
      uncertainty: this.playerData.uncertainty,
      conservativeRating: this.playerData.conservativeRating,
      tier: this.playerData.tier,
      division: this.playerData.division,
      lp: this.playerData.lp,
      isPlacement: this.playerData.isPlacement,
      placementMatches: this.playerData.placementMatches,
      wins: this.playerData.wins,
      losses: this.playerData.losses,
      draws: this.playerData.draws,
      winRate: this.playerData.wins / (this.playerData.wins + this.playerData.losses + this.playerData.draws) || 0,
      winStreak: this.playerData.winStreak,
      peakRating: this.playerData.peakRating,
      confidence: this.playerData.confidence,
      volatility: this.playerData.volatility,
      // Legacy MMR for backward compatibility
      mmr: this.playerData.conservativeRating,
      peakMMR: this.playerData.peakRating
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