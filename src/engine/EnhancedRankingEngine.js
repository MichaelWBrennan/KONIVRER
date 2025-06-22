/**
 * Enhanced Competitive Ranking Engine for KONIVRER
 * Advanced Bayesian TrueSkill system with multi-factor matchmaking, contextual analysis,
 * and adaptive difficulty adjustment
 */
export class EnhancedRankingEngine {
  constructor(options = {}) {
    this.options = {
      enableRankedPlay: true,
      enableSeasons: true,
      enableRewards: true,
      enableDecaySystem: true,
      enablePlacementMatches: true,
      enableContextualMatchmaking: true,
      enableAdaptiveDifficulty: true,
      enablePlaystyleMatching: true,
      enableDynamicKFactor: true,
      enableMetaAdaptation: true,
      enableTimeWeightedPerformance: true,
      enableConfidenceBasedMatching: true,
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

    // Enhanced Bayesian TrueSkill parameters
    this.bayesianParams = {
      BETA: 200, // Skill class width (half the default uncertainty)
      TAU: 6, // Additive dynamics factor
      DRAW_PROBABILITY: 0.1, // Probability of a draw
      INITIAL_RATING: 1500, // mu (mean skill)
      INITIAL_UNCERTAINTY: 350, // sigma (uncertainty)
      MIN_UNCERTAINTY: 25, // Minimum uncertainty
      MAX_UNCERTAINTY: 350, // Maximum uncertainty
      DYNAMIC_K_FACTOR: true, // Enable dynamic K-factor
      K_FACTOR_BASE: 32, // Base K-factor
      K_FACTOR_MIN: 16, // Minimum K-factor
      K_FACTOR_MAX: 64, // Maximum K-factor
      CONFIDENCE_THRESHOLD: 0.8, // Confidence threshold for matchmaking
      TIME_DECAY_FACTOR: 0.95, // Time decay factor for historical performance
      PERFORMANCE_WINDOW: 30, // Number of days to consider for recent performance
      ADAPTIVE_DIFFICULTY_TARGET: 0.5, // Target win rate for adaptive difficulty
      ADAPTIVE_DIFFICULTY_STRENGTH: 0.2, // Strength of adaptive difficulty adjustment
      PLAYSTYLE_WEIGHT: 0.3, // Weight of playstyle compatibility in matchmaking
      META_ADAPTATION_WEIGHT: 0.2, // Weight of meta adaptation in matchmaking
      CONTEXTUAL_FACTORS_WEIGHT: 0.25 // Weight of contextual factors in matchmaking
    };

    // Player data (Enhanced Bayesian model)
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
      volatility: 0.06, // How much the rating changes
      playstyleFactors: {
        aggression: 0.5, // 0 = very defensive, 1 = very aggressive
        consistency: 0.5, // 0 = high variance, 1 = very consistent
        complexity: 0.5, // 0 = simple plays, 1 = complex plays
        adaptability: 0.5, // 0 = rigid strategy, 1 = highly adaptable
        riskTaking: 0.5 // 0 = risk-averse, 1 = risk-seeking
      },
      contextualFactors: {
        timeOfDay: {}, // Performance by time of day
        dayOfWeek: {}, // Performance by day of week
        sessionLength: {}, // Performance by session length
        opponentTypes: {}, // Performance against different opponent types
        metaPositioning: {} // Performance against the current meta
      },
      recentPerformance: [], // Recent performance with timestamps
      adaptiveDifficulty: {
        targetWinRate: 0.5,
        currentAdjustment: 0,
        adjustmentHistory: []
      },
      skillFactors: {
        deckBuilding: 0.5,
        technicalPlay: 0.5,
        metaKnowledge: 0.5,
        adaptability: 0.5,
        mentalFortitude: 0.5
      }
    };

    // Season system
    this.season = {
      current: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      rewards: new Map(),
      leaderboard: new Map(),
      metaSnapshot: {
        dominantArchetypes: [],
        risingArchetypes: [],
        fallingArchetypes: [],
        metaHealthIndex: 0.5, // 0 = unhealthy, 1 = very healthy
        lastUpdated: new Date()
      }
    };

    // Enhanced Matchmaking (Multi-factor Bayesian)
    this.matchmaking = {
      queue: [],
      activeMatches: new Map(),
      searchRange: 100, // Initial skill search range
      maxSearchRange: 500,
      searchExpansionRate: 50, // Skill range expansion per 30 seconds
      averageWaitTime: 60000, // 1 minute
      qualityThreshold: 0.7, // Minimum match quality
      maxSkillDifference: 500, // Maximum allowed skill difference
      minSkillDifference: 100, // Minimum desired skill difference
      contextualFactors: {
        timeOfDay: true, // Consider time of day in matchmaking
        dayOfWeek: true, // Consider day of week in matchmaking
        sessionLength: true, // Consider session length in matchmaking
        recentPerformance: true // Consider recent performance in matchmaking
      },
      playstyleMatching: {
        enabled: true,
        preferSimilar: false, // false = match complementary playstyles
        weight: 0.3 // Weight of playstyle in matchmaking
      },
      confidenceMatching: {
        enabled: true,
        preferSimilar: true, // true = match similar confidence levels
        weight: 0.2 // Weight of confidence in matchmaking
      },
      adaptiveDifficulty: {
        enabled: true,
        targetWinRate: 0.5, // Target win rate
        adjustmentStrength: 0.2, // Strength of adjustment
        maxAdjustment: 200 // Maximum rating adjustment
      },
      metaAdaptation: {
        enabled: true,
        encourageDiversity: true, // Encourage diverse matchups
        weight: 0.2 // Weight of meta adaptation in matchmaking
      },
      matchQualityFactors: {
        skill: 0.5, // Weight of skill in match quality
        playstyle: 0.2, // Weight of playstyle in match quality
        confidence: 0.1, // Weight of confidence in match quality
        contextual: 0.1, // Weight of contextual factors in match quality
        meta: 0.1 // Weight of meta factors in match quality
      }
    };

    // Enhanced Deck archetype matchup matrix (win rates)
    this.deckMatchups = {
      'Aggro': { 'Aggro': 0.5, 'Control': 0.65, 'Midrange': 0.55, 'Combo': 0.7, 'Tempo': 0.45, 'Ramp': 0.75 },
      'Control': { 'Aggro': 0.35, 'Control': 0.5, 'Midrange': 0.6, 'Combo': 0.4, 'Tempo': 0.55, 'Ramp': 0.45 },
      'Midrange': { 'Aggro': 0.45, 'Control': 0.4, 'Midrange': 0.5, 'Combo': 0.65, 'Tempo': 0.6, 'Ramp': 0.5 },
      'Combo': { 'Aggro': 0.3, 'Control': 0.6, 'Midrange': 0.35, 'Combo': 0.5, 'Tempo': 0.4, 'Ramp': 0.8 },
      'Tempo': { 'Aggro': 0.55, 'Control': 0.45, 'Midrange': 0.4, 'Combo': 0.6, 'Tempo': 0.5, 'Ramp': 0.65 },
      'Ramp': { 'Aggro': 0.25, 'Control': 0.55, 'Midrange': 0.5, 'Combo': 0.2, 'Tempo': 0.35, 'Ramp': 0.5 }
    };

    // Playstyle compatibility matrix
    this.playstyleCompatibility = {
      // Aggression compatibility (0 = clash, 1 = complement)
      aggression: [
        [0.5, 0.6, 0.7, 0.8, 0.9], // Very defensive
        [0.6, 0.5, 0.6, 0.7, 0.8], // Somewhat defensive
        [0.7, 0.6, 0.5, 0.6, 0.7], // Balanced
        [0.8, 0.7, 0.6, 0.5, 0.6], // Somewhat aggressive
        [0.9, 0.8, 0.7, 0.6, 0.5]  // Very aggressive
      ],
      // Consistency compatibility
      consistency: [
        [0.5, 0.6, 0.7, 0.8, 0.9], // High variance
        [0.6, 0.5, 0.6, 0.7, 0.8], // Somewhat variable
        [0.7, 0.6, 0.5, 0.6, 0.7], // Balanced
        [0.8, 0.7, 0.6, 0.5, 0.6], // Somewhat consistent
        [0.9, 0.8, 0.7, 0.6, 0.5]  // Very consistent
      ],
      // Complexity compatibility
      complexity: [
        [0.5, 0.6, 0.7, 0.8, 0.9], // Very simple
        [0.6, 0.5, 0.6, 0.7, 0.8], // Somewhat simple
        [0.7, 0.6, 0.5, 0.6, 0.7], // Balanced
        [0.8, 0.7, 0.6, 0.5, 0.6], // Somewhat complex
        [0.9, 0.8, 0.7, 0.6, 0.5]  // Very complex
      ]
    };

    // Meta adaptation factors
    this.metaAdaptation = {
      archetypeFrequency: {}, // Frequency of archetypes in the meta
      archetypeTrends: {}, // Trends in archetype popularity
      counterArchetypes: {}, // Counter relationships between archetypes
      metaHealthIndex: 0.5, // 0 = unhealthy, 1 = very healthy
      diversityIndex: 0.5, // 0 = homogeneous, 1 = very diverse
      lastUpdated: new Date()
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
      this.setupEnhancedMatchmaking();
      this.setupRewardsSystem();
      this.startDecayTimer();
      this.startMetaAnalysisTimer();
      
      console.log('Enhanced Ranking Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Enhanced Ranking Engine:', error);
    }
  }

  /**
   * Enhanced Bayesian TrueSkill Rating System with Dynamic K-Factor
   */
  calculateEnhancedTrueSkillUpdate(playerRating, playerUncertainty, opponentRating, opponentUncertainty, gameResult, contextualFactors = {}) {
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
    
    // Calculate dynamic K-factor based on contextual factors
    const kFactor = this.calculateDynamicKFactor(
      playerRating, 
      playerUncertainty, 
      opponentRating, 
      opponentUncertainty,
      contextualFactors
    );
    
    // Update ratings with dynamic K-factor
    const baseRatingChange = (playerUncertainty * playerUncertainty / c) * v;
    const scaledRatingChange = baseRatingChange * (kFactor / this.bayesianParams.K_FACTOR_BASE);
    
    const newPlayerRating = playerRating + scaledRatingChange;
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
    
    // Calculate confidence in the new rating
    const confidencePlayer = 1 - (newPlayerUncertainty / this.bayesianParams.MAX_UNCERTAINTY);
    const confidenceOpponent = 1 - (newOpponentUncertainty / this.bayesianParams.MAX_UNCERTAINTY);
    
    // Calculate surprise factor (how unexpected the result was)
    const surpriseFactor = Math.abs(actualOutcome - winProbability);
    
    return {
      player: {
        oldRating: playerRating,
        newRating: newPlayerRating,
        oldUncertainty: playerUncertainty,
        newUncertainty: newPlayerUncertainty,
        ratingChange: newPlayerRating - playerRating,
        confidence: confidencePlayer,
        kFactor
      },
      opponent: {
        oldRating: opponentRating,
        newRating: newOpponentRating,
        oldUncertainty: opponentUncertainty,
        newUncertainty: newOpponentUncertainty,
        ratingChange: newOpponentRating - opponentRating,
        confidence: confidenceOpponent
      },
      winProbability,
      actualOutcome,
      surpriseFactor,
      contextualImpact: this.calculateContextualImpact(contextualFactors, surpriseFactor)
    };
  }

  /**
   * Calculate dynamic K-factor based on multiple factors
   */
  calculateDynamicKFactor(playerRating, playerUncertainty, opponentRating, opponentUncertainty, contextualFactors = {}) {
    if (!this.bayesianParams.DYNAMIC_K_FACTOR) {
      return this.bayesianParams.K_FACTOR_BASE;
    }
    
    let kFactor = this.bayesianParams.K_FACTOR_BASE;
    
    // Factor 1: Uncertainty - higher uncertainty means higher K-factor
    const uncertaintyFactor = playerUncertainty / this.bayesianParams.INITIAL_UNCERTAINTY;
    kFactor *= Math.min(1.5, Math.max(0.5, uncertaintyFactor));
    
    // Factor 2: Rating difference - larger difference means lower K-factor
    const ratingDifference = Math.abs(playerRating - opponentRating);
    const ratingDifferenceFactor = Math.max(0.5, 1 - (ratingDifference / 1000));
    kFactor *= ratingDifferenceFactor;
    
    // Factor 3: Games played - fewer games means higher K-factor
    const gamesPlayed = this.playerData.wins + this.playerData.losses + this.playerData.draws;
    const gamesFactor = Math.max(0.5, Math.min(1.5, 30 / Math.max(10, gamesPlayed)));
    kFactor *= gamesFactor;
    
    // Factor 4: Tournament importance (if provided)
    if (contextualFactors.tournamentImportance) {
      const tournamentFactor = 1 + (contextualFactors.tournamentImportance - 0.5);
      kFactor *= tournamentFactor;
    }
    
    // Factor 5: Streak factor - winning/losing streaks affect K-factor
    const streakFactor = this.calculateStreakFactor();
    kFactor *= streakFactor;
    
    // Clamp K-factor to reasonable bounds
    return Math.max(
      this.bayesianParams.K_FACTOR_MIN,
      Math.min(this.bayesianParams.K_FACTOR_MAX, kFactor)
    );
  }

  /**
   * Calculate streak factor for K-factor adjustment
   */
  calculateStreakFactor() {
    const winStreak = this.playerData.winStreak;
    const lossStreak = this.playerData.lossStreak;
    
    if (winStreak >= 3) {
      // Reduce K-factor for players on winning streaks (they're likely underrated)
      return 1 + (winStreak * 0.05);
    } else if (lossStreak >= 3) {
      // Reduce K-factor for players on losing streaks (they're likely overrated)
      return 1 + (lossStreak * 0.05);
    }
    
    return 1.0;
  }

  /**
   * Calculate the impact of contextual factors on rating change
   */
  calculateContextualImpact(contextualFactors, surpriseFactor) {
    if (!contextualFactors || Object.keys(contextualFactors).length === 0) {
      return {};
    }
    
    const impact = {};
    
    // Time of day impact
    if (contextualFactors.timeOfDay) {
      impact.timeOfDay = this.calculateTimeOfDayImpact(contextualFactors.timeOfDay, surpriseFactor);
    }
    
    // Day of week impact
    if (contextualFactors.dayOfWeek) {
      impact.dayOfWeek = this.calculateDayOfWeekImpact(contextualFactors.dayOfWeek, surpriseFactor);
    }
    
    // Session length impact
    if (contextualFactors.sessionLength) {
      impact.sessionLength = this.calculateSessionLengthImpact(contextualFactors.sessionLength, surpriseFactor);
    }
    
    // Deck archetype impact
    if (contextualFactors.deckArchetype && contextualFactors.opponentDeckArchetype) {
      impact.deckMatchup = this.calculateDeckMatchupImpact(
        contextualFactors.deckArchetype,
        contextualFactors.opponentDeckArchetype,
        surpriseFactor
      );
    }
    
    return impact;
  }

  /**
   * Calculate time of day impact on performance
   */
  calculateTimeOfDayImpact(timeOfDay, surpriseFactor) {
    // Get historical performance at this time of day
    const hourOfDay = timeOfDay.getHours();
    const timePerformance = this.playerData.contextualFactors.timeOfDay[hourOfDay] || {
      games: 0,
      wins: 0,
      rating: 0
    };
    
    // Calculate impact based on historical performance and surprise factor
    const performanceRatio = timePerformance.games > 0 
      ? timePerformance.wins / timePerformance.games 
      : 0.5;
    
    // Higher impact for surprising results at times with established performance patterns
    const impact = timePerformance.games > 5 
      ? (performanceRatio - 0.5) * surpriseFactor * 2
      : 0;
    
    return {
      hourOfDay,
      historicalPerformance: performanceRatio,
      impact
    };
  }

  /**
   * Calculate day of week impact on performance
   */
  calculateDayOfWeekImpact(date, surpriseFactor) {
    const dayOfWeek = date.getDay();
    const dayPerformance = this.playerData.contextualFactors.dayOfWeek[dayOfWeek] || {
      games: 0,
      wins: 0,
      rating: 0
    };
    
    const performanceRatio = dayPerformance.games > 0 
      ? dayPerformance.wins / dayPerformance.games 
      : 0.5;
    
    const impact = dayPerformance.games > 5 
      ? (performanceRatio - 0.5) * surpriseFactor * 2
      : 0;
    
    return {
      dayOfWeek,
      historicalPerformance: performanceRatio,
      impact
    };
  }

  /**
   * Calculate session length impact on performance
   */
  calculateSessionLengthImpact(sessionLength, surpriseFactor) {
    // Group session length into buckets (0-30min, 30-60min, 60-90min, etc.)
    const sessionBucket = Math.floor(sessionLength / 30);
    const sessionPerformance = this.playerData.contextualFactors.sessionLength[sessionBucket] || {
      games: 0,
      wins: 0,
      rating: 0
    };
    
    const performanceRatio = sessionPerformance.games > 0 
      ? sessionPerformance.wins / sessionPerformance.games 
      : 0.5;
    
    // Calculate fatigue factor (longer sessions may lead to fatigue)
    const fatigueFactor = Math.max(0, Math.min(1, (sessionBucket - 2) * 0.1));
    
    const impact = sessionPerformance.games > 5 
      ? ((performanceRatio - 0.5) * surpriseFactor * 2) - fatigueFactor
      : -fatigueFactor;
    
    return {
      sessionBucket,
      sessionLengthMinutes: sessionBucket * 30,
      historicalPerformance: performanceRatio,
      fatigueFactor,
      impact
    };
  }

  /**
   * Calculate deck matchup impact on performance
   */
  calculateDeckMatchupImpact(playerArchetype, opponentArchetype, surpriseFactor) {
    // Get expected matchup win rate from matchup table
    const expectedWinRate = this.deckMatchups[playerArchetype]?.[opponentArchetype] || 0.5;
    
    // Calculate impact based on how surprising the result was given the matchup
    const impact = (expectedWinRate - 0.5) * surpriseFactor * 2;
    
    return {
      playerArchetype,
      opponentArchetype,
      expectedWinRate,
      impact
    };
  }

  /**
   * Normal cumulative distribution function
   */
  normalCDF(x) {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  /**
   * Error function approximation
   */
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

  /**
   * TrueSkill v function
   */
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

  /**
   * TrueSkill w function
   */
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

  /**
   * Normal probability density function
   */
  normalPDF(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }

  /**
   * Inverse normal CDF (approximation)
   */
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

  /**
   * Calculate enhanced win probability between two players
   * Considers multiple factors beyond just rating
   */
  calculateEnhancedWinProbability(playerData, opponentData, contextualFactors = {}) {
    // Base win probability from ratings
    const baseWinProb = this.calculateBaseWinProbability(
      playerData.rating, 
      playerData.uncertainty, 
      opponentData.rating, 
      opponentData.uncertainty
    );
    
    // Adjustments based on contextual factors
    let adjustedWinProb = baseWinProb;
    
    // 1. Deck matchup adjustment
    if (contextualFactors.deckArchetype && contextualFactors.opponentDeckArchetype) {
      const matchupWinRate = this.deckMatchups[contextualFactors.deckArchetype]?.[contextualFactors.opponentDeckArchetype] || 0.5;
      adjustedWinProb = this.weightedAverage(adjustedWinProb, matchupWinRate, 0.3);
    }
    
    // 2. Time of day adjustment
    if (contextualFactors.timeOfDay) {
      const hourOfDay = contextualFactors.timeOfDay.getHours();
      const timePerformance = playerData.contextualFactors.timeOfDay[hourOfDay];
      
      if (timePerformance && timePerformance.games > 5) {
        const timeWinRate = timePerformance.wins / timePerformance.games;
        adjustedWinProb = this.weightedAverage(adjustedWinProb, timeWinRate, 0.1);
      }
    }
    
    // 3. Session length adjustment
    if (contextualFactors.sessionLength) {
      const sessionBucket = Math.floor(contextualFactors.sessionLength / 30);
      const sessionPerformance = playerData.contextualFactors.sessionLength[sessionBucket];
      
      if (sessionPerformance && sessionPerformance.games > 5) {
        const sessionWinRate = sessionPerformance.wins / sessionPerformance.games;
        adjustedWinProb = this.weightedAverage(adjustedWinProb, sessionWinRate, 0.1);
      }
    }
    
    // 4. Playstyle compatibility adjustment
    if (playerData.playstyleFactors && opponentData.playstyleFactors) {
      const playstyleCompat = this.calculatePlaystyleCompatibility(
        playerData.playstyleFactors,
        opponentData.playstyleFactors
      );
      
      // Adjust win probability based on playstyle advantage
      adjustedWinProb += (playstyleCompat.advantage * 0.1);
    }
    
    // 5. Recent performance adjustment (momentum)
    if (playerData.recentPerformance && playerData.recentPerformance.length > 0) {
      const recentWinRate = this.calculateRecentWinRate(playerData.recentPerformance);
      adjustedWinProb = this.weightedAverage(adjustedWinProb, recentWinRate, 0.1);
    }
    
    // Ensure probability is between 0 and 1
    return Math.max(0.01, Math.min(0.99, adjustedWinProb));
  }

  /**
   * Calculate base win probability from ratings
   */
  calculateBaseWinProbability(playerRating, playerUncertainty, opponentRating, opponentUncertainty) {
    const combinedUncertainty = Math.sqrt(playerUncertainty * playerUncertainty + 
                                        opponentUncertainty * opponentUncertainty);
    const ratingDifference = playerRating - opponentRating;
    const c = Math.sqrt(2) * combinedUncertainty;
    
    return 0.5 * (1 + this.erf(ratingDifference / c));
  }

  /**
   * Calculate weighted average of two values
   */
  weightedAverage(value1, value2, weight2) {
    return (value1 * (1 - weight2)) + (value2 * weight2);
  }

  /**
   * Calculate playstyle compatibility between two players
   */
  calculatePlaystyleCompatibility(playstyle1, playstyle2) {
    // Convert continuous playstyle values to discrete indices (0-4)
    const getIndex = (value) => Math.min(4, Math.max(0, Math.floor(value * 5)));
    
    const aggressionIdx1 = getIndex(playstyle1.aggression);
    const aggressionIdx2 = getIndex(playstyle2.aggression);
    
    const consistencyIdx1 = getIndex(playstyle1.consistency);
    const consistencyIdx2 = getIndex(playstyle2.consistency);
    
    const complexityIdx1 = getIndex(playstyle1.complexity);
    const complexityIdx2 = getIndex(playstyle2.complexity);
    
    // Get compatibility scores from matrices
    const aggressionCompat = this.playstyleCompatibility.aggression[aggressionIdx1][aggressionIdx2];
    const consistencyCompat = this.playstyleCompatibility.consistency[consistencyIdx1][consistencyIdx2];
    const complexityCompat = this.playstyleCompatibility.complexity[complexityIdx1][complexityIdx2];
    
    // Calculate overall compatibility
    const overallCompat = (aggressionCompat + consistencyCompat + complexityCompat) / 3;
    
    // Calculate advantage (positive means player1 has advantage, negative means player2 has advantage)
    const advantage = (playstyle1.aggression - playstyle2.aggression) * 0.2 +
                     (playstyle1.consistency - playstyle2.consistency) * 0.2 +
                     (playstyle1.complexity - playstyle2.complexity) * 0.1 +
                     (playstyle1.adaptability - playstyle2.adaptability) * 0.3 +
                     (playstyle1.riskTaking - playstyle2.riskTaking) * 0.2;
    
    return {
      compatibility: overallCompat,
      advantage,
      factors: {
        aggression: aggressionCompat,
        consistency: consistencyCompat,
        complexity: complexityCompat
      }
    };
  }

  /**
   * Calculate recent win rate from performance history
   */
  calculateRecentWinRate(recentPerformance, daysToConsider = 7) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - (daysToConsider * 24 * 60 * 60 * 1000));
    
    // Filter recent matches
    const recentMatches = recentPerformance.filter(match => 
      new Date(match.date) >= cutoff
    );
    
    if (recentMatches.length === 0) {
      return 0.5; // Default to 50% if no recent matches
    }
    
    // Calculate win rate with time decay (more recent matches have higher weight)
    let totalWeight = 0;
    let weightedWins = 0;
    
    recentMatches.forEach(match => {
      const daysAgo = (now.getTime() - new Date(match.date).getTime()) / (24 * 60 * 60 * 1000);
      const weight = Math.pow(this.bayesianParams.TIME_DECAY_FACTOR, daysAgo);
      
      totalWeight += weight;
      if (match.result === 'win') {
        weightedWins += weight;
      } else if (match.result === 'draw') {
        weightedWins += (weight * 0.5);
      }
    });
    
    return weightedWins / totalWeight;
  }

  /**
   * Calculate conservative skill estimate (rating - 3 * uncertainty)
   */
  getConservativeRating(rating, uncertainty) {
    return rating - (3 * uncertainty);
  }

  /**
   * Process game result with enhanced contextual factors
   */
  processGameResult(opponentData, gameResult, gameDuration, performanceMetrics = {}) {
    const isPlacement = this.playerData.isPlacement;
    
    // Extract opponent rating data
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
    
    // Prepare contextual factors
    const contextualFactors = {
      timeOfDay: new Date(),
      dayOfWeek: new Date(),
      sessionLength: performanceMetrics.sessionLength || 0,
      deckArchetype: performanceMetrics.deckArchetype,
      opponentDeckArchetype: performanceMetrics.opponentDeckArchetype,
      tournamentImportance: performanceMetrics.tournamentImportance || 0.5
    };
    
    // Calculate Enhanced Bayesian TrueSkill update
    const skillUpdate = this.calculateEnhancedTrueSkillUpdate(
      this.playerData.rating,
      this.playerData.uncertainty,
      opponentRating,
      opponentUncertainty,
      gameResult,
      contextualFactors
    );

    // Apply performance modifiers to rating change
    let ratingChange = skillUpdate.player.ratingChange;
    ratingChange = this.applyEnhancedPerformanceModifiers(ratingChange, performanceMetrics, gameResult, contextualFactors);
    
    // Apply adaptive difficulty adjustment if enabled
    if (this.options.enableAdaptiveDifficulty) {
      ratingChange = this.applyAdaptiveDifficultyAdjustment(ratingChange, gameResult);
    }
    
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
    this.updateEnhancedPlayerStats(gameResult, ratingChange, gameDuration, contextualFactors);
    
    // Calculate LP and tier changes based on conservative rating
    const tierChange = this.updateTierAndLP(this.playerData.conservativeRating - this.getConservativeRating(oldRating, oldUncertainty));
    
    // Update deck archetype performance if available
    if (performanceMetrics.deckArchetype) {
      this.updateEnhancedDeckArchetypePerformance(
        performanceMetrics.deckArchetype, 
        gameResult, 
        skillUpdate,
        performanceMetrics.opponentDeckArchetype
      );
    }
    
    // Update playstyle factors based on performance
    if (performanceMetrics.playstyleMetrics) {
      this.updatePlaystyleFactors(performanceMetrics.playstyleMetrics, gameResult);
    }
    
    // Update contextual factors
    this.updateContextualFactors(contextualFactors, gameResult);
    
    // Store match in history with enhanced data
    this.addEnhancedMatchToHistory({
      opponentRating,
      opponentUncertainty,
      gameResult,
      ratingBefore: oldRating,
      ratingAfter: this.playerData.rating,
      uncertaintyBefore: oldUncertainty,
      uncertaintyAfter: this.playerData.uncertainty,
      winProbability: skillUpdate.winProbability,
      surpriseFactor: skillUpdate.surpriseFactor,
      performanceMetrics,
      contextualFactors,
      contextualImpact: skillUpdate.contextualImpact
    });
    
    // Check for achievements
    this.checkEnhancedAchievements(gameResult, performanceMetrics, contextualFactors);
    
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
      contextualImpact: skillUpdate.contextualImpact,
      achievements: tierChange.achievements || []
    };
  }

  /**
   * Apply enhanced performance modifiers to rating change
   */
  applyEnhancedPerformanceModifiers(ratingChange, performanceMetrics, gameResult, contextualFactors) {
    if (!performanceMetrics) {
      return ratingChange;
    }
    
    let modifiedRatingChange = ratingChange;
    
    // 1. Game duration modifier
    if (performanceMetrics.gameDuration) {
      // Longer games are more significant for rating changes
      const durationFactor = Math.min(1.5, Math.max(0.8, performanceMetrics.gameDuration / 600)); // Normalize around 10 minutes
      modifiedRatingChange *= durationFactor;
    }
    
    // 2. Performance quality modifier
    if (performanceMetrics.performanceQuality !== undefined) {
      // Higher quality performances deserve more rating change
      const qualityFactor = Math.min(1.5, Math.max(0.5, performanceMetrics.performanceQuality));
      modifiedRatingChange *= qualityFactor;
    }
    
    // 3. Opponent strength modifier
    if (performanceMetrics.opponentStrength !== undefined) {
      // Beating stronger opponents or losing to weaker ones has more impact
      const strengthImpact = (performanceMetrics.opponentStrength - 0.5) * 0.5;
      if (gameResult === 'win') {
        modifiedRatingChange *= (1 + strengthImpact);
      } else if (gameResult === 'loss') {
        modifiedRatingChange *= (1 - strengthImpact);
      }
    }
    
    // 4. Contextual factors modifier
    if (contextualFactors) {
      // Time of day performance
      if (contextualFactors.timeOfDay) {
        const hourOfDay = contextualFactors.timeOfDay.getHours();
        const timePerformance = this.playerData.contextualFactors.timeOfDay[hourOfDay];
        
        if (timePerformance && timePerformance.games > 5) {
          const expectedWinRate = timePerformance.wins / timePerformance.games;
          const unexpectedness = gameResult === 'win' 
            ? 1 - expectedWinRate 
            : expectedWinRate;
          
          modifiedRatingChange *= (1 + (unexpectedness * 0.2));
        }
      }
      
      // Session length impact
      if (contextualFactors.sessionLength) {
        const sessionBucket = Math.floor(contextualFactors.sessionLength / 30);
        if (sessionBucket > 4) { // More than 2 hours of play
          // Fatigue factor - reduce rating changes for very long sessions
          modifiedRatingChange *= Math.max(0.8, 1 - ((sessionBucket - 4) * 0.05));
        }
      }
    }
    
    // 5. Tournament importance modifier
    if (performanceMetrics.tournamentImportance !== undefined) {
      // More important tournaments have bigger rating impacts
      const importanceFactor = Math.min(2.0, Math.max(1.0, performanceMetrics.tournamentImportance * 2));
      modifiedRatingChange *= importanceFactor;
    }
    
    return modifiedRatingChange;
  }

  /**
   * Apply adaptive difficulty adjustment to rating change
   */
  applyAdaptiveDifficultyAdjustment(ratingChange, gameResult) {
    if (!this.options.enableAdaptiveDifficulty) {
      return ratingChange;
    }
    
    // Get current win rate
    const totalGames = this.playerData.wins + this.playerData.losses;
    if (totalGames < 10) {
      return ratingChange; // Not enough games to apply adaptive difficulty
    }
    
    const currentWinRate = this.playerData.wins / totalGames;
    const targetWinRate = this.bayesianParams.ADAPTIVE_DIFFICULTY_TARGET;
    const winRateDifference = currentWinRate - targetWinRate;
    
    // Calculate adjustment factor
    const adjustmentStrength = this.bayesianParams.ADAPTIVE_DIFFICULTY_STRENGTH;
    let adjustmentFactor = 1.0;
    
    if (gameResult === 'win') {
      // If winning too much, reduce rating gains
      if (winRateDifference > 0.05) {
        adjustmentFactor = 1.0 - (winRateDifference * adjustmentStrength);
      }
      // If winning too little, increase rating gains
      else if (winRateDifference < -0.05) {
        adjustmentFactor = 1.0 + (Math.abs(winRateDifference) * adjustmentStrength);
      }
    } else if (gameResult === 'loss') {
      // If winning too much, increase rating losses
      if (winRateDifference > 0.05) {
        adjustmentFactor = 1.0 + (winRateDifference * adjustmentStrength);
      }
      // If winning too little, reduce rating losses
      else if (winRateDifference < -0.05) {
        adjustmentFactor = 1.0 - (Math.abs(winRateDifference) * adjustmentStrength);
      }
    }
    
    // Apply adjustment
    const adjustedRatingChange = ratingChange * adjustmentFactor;
    
    // Store adjustment for analytics
    this.playerData.adaptiveDifficulty.currentAdjustment = adjustmentFactor;
    this.playerData.adaptiveDifficulty.adjustmentHistory.push({
      date: new Date(),
      winRate: currentWinRate,
      targetWinRate,
      adjustmentFactor,
      originalChange: ratingChange,
      adjustedChange: adjustedRatingChange
    });
    
    // Keep history manageable
    if (this.playerData.adaptiveDifficulty.adjustmentHistory.length > 100) {
      this.playerData.adaptiveDifficulty.adjustmentHistory = 
        this.playerData.adaptiveDifficulty.adjustmentHistory.slice(-100);
    }
    
    return adjustedRatingChange;
  }

  /**
   * Update enhanced player stats
   */
  updateEnhancedPlayerStats(gameResult, ratingChange, gameDuration, contextualFactors) {
    // Update basic stats
    if (gameResult === 'win') {
      this.playerData.wins += 1;
      this.playerData.winStreak += 1;
      this.playerData.lossStreak = 0;
    } else if (gameResult === 'loss') {
      this.playerData.losses += 1;
      this.playerData.lossStreak += 1;
      this.playerData.winStreak = 0;
    } else if (gameResult === 'draw') {
      this.playerData.draws += 1;
      // Draws don't affect streaks
    }
    
    // Update peak rating if applicable
    if (this.playerData.rating > this.playerData.peakRating) {
      this.playerData.peakRating = this.playerData.rating;
    }
    
    // Update placement match counter if in placement
    if (this.playerData.isPlacement) {
      this.playerData.placementMatches += 1;
      if (this.playerData.placementMatches >= 10) {
        this.playerData.isPlacement = false;
      }
    }
    
    // Update season stats
    const currentSeason = this.season.current;
    if (!this.playerData.seasonStats[currentSeason]) {
      this.playerData.seasonStats[currentSeason] = {
        wins: 0,
        losses: 0,
        draws: 0,
        peakRating: this.playerData.rating,
        gamesPlayed: 0,
        startDate: new Date(),
        startRating: this.playerData.rating
      };
    }
    
    const seasonStats = this.playerData.seasonStats[currentSeason];
    seasonStats.gamesPlayed += 1;
    
    if (gameResult === 'win') seasonStats.wins += 1;
    else if (gameResult === 'loss') seasonStats.losses += 1;
    else if (gameResult === 'draw') seasonStats.draws += 1;
    
    if (this.playerData.rating > seasonStats.peakRating) {
      seasonStats.peakRating = this.playerData.rating;
    }
    
    // Update recent performance
    this.playerData.recentPerformance.push({
      date: new Date(),
      result: gameResult,
      ratingChange,
      rating: this.playerData.rating,
      contextualFactors
    });
    
    // Keep recent performance manageable
    if (this.playerData.recentPerformance.length > 50) {
      this.playerData.recentPerformance = this.playerData.recentPerformance.slice(-50);
    }
  }

  /**
   * Update enhanced deck archetype performance
   */
  updateEnhancedDeckArchetypePerformance(archetype, gameResult, skillUpdate, opponentArchetype) {
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
        lastPlayed: new Date(),
        matchups: {} // Matchup-specific performance
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
    
    // Update matchup-specific data if opponent archetype is known
    if (opponentArchetype) {
      if (!deckData.matchups[opponentArchetype]) {
        deckData.matchups[opponentArchetype] = {
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0
        };
      }
      
      const matchupData = deckData.matchups[opponentArchetype];
      matchupData.gamesPlayed += 1;
      
      if (gameResult === 'win') matchupData.wins += 1;
      else if (gameResult === 'loss') matchupData.losses += 1;
      else if (gameResult === 'draw') matchupData.draws += 1;
      
      matchupData.winRate = matchupData.wins / matchupData.gamesPlayed;
      
      // Update global matchup table based on player experience
      if (matchupData.gamesPlayed >= 5) {
        // Gradually adjust the global matchup table based on player experience
        const currentMatchupWinRate = this.deckMatchups[archetype]?.[opponentArchetype] || 0.5;
        const experienceWeight = Math.min(0.1, matchupData.gamesPlayed / 100); // Cap at 10% influence
        
        this.deckMatchups[archetype] = this.deckMatchups[archetype] || {};
        this.deckMatchups[archetype][opponentArchetype] = 
          (currentMatchupWinRate * (1 - experienceWeight)) + 
          (matchupData.winRate * experienceWeight);
      }
    }
  }

  /**
   * Update playstyle factors based on performance
   */
  updatePlaystyleFactors(playstyleMetrics, gameResult) {
    if (!playstyleMetrics) return;
    
    // Gradually adjust playstyle factors based on observed metrics
    const learningRate = 0.05; // How quickly to adjust playstyle factors
    
    // Update aggression factor
    if (playstyleMetrics.aggression !== undefined) {
      this.playerData.playstyleFactors.aggression = 
        (this.playerData.playstyleFactors.aggression * (1 - learningRate)) + 
        (playstyleMetrics.aggression * learningRate);
    }
    
    // Update consistency factor
    if (playstyleMetrics.consistency !== undefined) {
      this.playerData.playstyleFactors.consistency = 
        (this.playerData.playstyleFactors.consistency * (1 - learningRate)) + 
        (playstyleMetrics.consistency * learningRate);
    }
    
    // Update complexity factor
    if (playstyleMetrics.complexity !== undefined) {
      this.playerData.playstyleFactors.complexity = 
        (this.playerData.playstyleFactors.complexity * (1 - learningRate)) + 
        (playstyleMetrics.complexity * learningRate);
    }
    
    // Update adaptability factor
    if (playstyleMetrics.adaptability !== undefined) {
      this.playerData.playstyleFactors.adaptability = 
        (this.playerData.playstyleFactors.adaptability * (1 - learningRate)) + 
        (playstyleMetrics.adaptability * learningRate);
    }
    
    // Update risk-taking factor
    if (playstyleMetrics.riskTaking !== undefined) {
      this.playerData.playstyleFactors.riskTaking = 
        (this.playerData.playstyleFactors.riskTaking * (1 - learningRate)) + 
        (playstyleMetrics.riskTaking * learningRate);
    }
    
    // Ensure all factors are within bounds
    for (const factor in this.playerData.playstyleFactors) {
      this.playerData.playstyleFactors[factor] = 
        Math.max(0, Math.min(1, this.playerData.playstyleFactors[factor]));
    }
  }

  /**
   * Update contextual factors based on game result
   */
  updateContextualFactors(contextualFactors, gameResult) {
    if (!contextualFactors) return;
    
    // Update time of day performance
    if (contextualFactors.timeOfDay) {
      const hourOfDay = contextualFactors.timeOfDay.getHours();
      
      if (!this.playerData.contextualFactors.timeOfDay[hourOfDay]) {
        this.playerData.contextualFactors.timeOfDay[hourOfDay] = {
          games: 0,
          wins: 0,
          rating: 0
        };
      }
      
      const timeData = this.playerData.contextualFactors.timeOfDay[hourOfDay];
      timeData.games += 1;
      if (gameResult === 'win') timeData.wins += 1;
      timeData.rating = this.playerData.rating;
    }
    
    // Update day of week performance
    if (contextualFactors.dayOfWeek) {
      const dayOfWeek = contextualFactors.dayOfWeek.getDay();
      
      if (!this.playerData.contextualFactors.dayOfWeek[dayOfWeek]) {
        this.playerData.contextualFactors.dayOfWeek[dayOfWeek] = {
          games: 0,
          wins: 0,
          rating: 0
        };
      }
      
      const dayData = this.playerData.contextualFactors.dayOfWeek[dayOfWeek];
      dayData.games += 1;
      if (gameResult === 'win') dayData.wins += 1;
      dayData.rating = this.playerData.rating;
    }
    
    // Update session length performance
    if (contextualFactors.sessionLength) {
      const sessionBucket = Math.floor(contextualFactors.sessionLength / 30);
      
      if (!this.playerData.contextualFactors.sessionLength[sessionBucket]) {
        this.playerData.contextualFactors.sessionLength[sessionBucket] = {
          games: 0,
          wins: 0,
          rating: 0
        };
      }
      
      const sessionData = this.playerData.contextualFactors.sessionLength[sessionBucket];
      sessionData.games += 1;
      if (gameResult === 'win') sessionData.wins += 1;
      sessionData.rating = this.playerData.rating;
    }
    
    // Update opponent type performance
    if (contextualFactors.opponentDeckArchetype) {
      const archetype = contextualFactors.opponentDeckArchetype;
      
      if (!this.playerData.contextualFactors.opponentTypes[archetype]) {
        this.playerData.contextualFactors.opponentTypes[archetype] = {
          games: 0,
          wins: 0,
          rating: 0
        };
      }
      
      const archetypeData = this.playerData.contextualFactors.opponentTypes[archetype];
      archetypeData.games += 1;
      if (gameResult === 'win') archetypeData.wins += 1;
      archetypeData.rating = this.playerData.rating;
    }
  }

  /**
   * Add enhanced match to history
   */
  addEnhancedMatchToHistory(matchData) {
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

  /**
   * Check for enhanced achievements
   */
  checkEnhancedAchievements(gameResult, performanceMetrics, contextualFactors) {
    // Implementation would check for various achievements based on
    // game result, performance metrics, and contextual factors
  }

  /**
   * Setup enhanced matchmaking system
   */
  setupEnhancedMatchmaking() {
    // Initialize matchmaking queue
    this.matchmaking.queue = [];
    this.matchmaking.activeMatches = new Map();
    
    // Setup matchmaking parameters based on player data
    this.updateMatchmakingParameters();
    
    // Setup periodic matchmaking parameter updates
    setInterval(() => {
      this.updateMatchmakingParameters();
    }, 3600000); // Update every hour
    
    // Setup meta adaptation
    if (this.options.enableMetaAdaptation) {
      this.updateMetaAdaptation();
      
      // Update meta adaptation periodically
      setInterval(() => {
        this.updateMetaAdaptation();
      }, 86400000); // Update daily
    }
  }

  /**
   * Update matchmaking parameters based on player data
   */
  updateMatchmakingParameters() {
    // Adjust search range based on player uncertainty
    this.matchmaking.searchRange = 100 + (this.playerData.uncertainty - this.bayesianParams.MIN_UNCERTAINTY);
    
    // Adjust quality threshold based on queue time
    const queueTimes = Array.from(this.matchmaking.activeMatches.values())
      .map(match => match.queueTime)
      .filter(time => time !== undefined);
    
    if (queueTimes.length > 0) {
      const avgQueueTime = queueTimes.reduce((sum, time) => sum + time, 0) / queueTimes.length;
      this.matchmaking.averageWaitTime = avgQueueTime;
      
      // Lower quality threshold if queue times are long
      if (avgQueueTime > 120000) { // 2 minutes
        this.matchmaking.qualityThreshold = Math.max(0.5, this.matchmaking.qualityThreshold - 0.05);
      } else if (avgQueueTime < 30000) { // 30 seconds
        this.matchmaking.qualityThreshold = Math.min(0.8, this.matchmaking.qualityThreshold + 0.05);
      }
    }
    
    // Adjust playstyle matching based on player preferences
    if (this.playerData.playstyleFactors.adaptability > 0.7) {
      // Highly adaptable players prefer diverse matchups
      this.matchmaking.playstyleMatching.preferSimilar = false;
      this.matchmaking.playstyleMatching.weight = 0.2;
    } else if (this.playerData.playstyleFactors.adaptability < 0.3) {
      // Less adaptable players prefer similar matchups
      this.matchmaking.playstyleMatching.preferSimilar = true;
      this.matchmaking.playstyleMatching.weight = 0.4;
    }
  }

  /**
   * Update meta adaptation parameters
   */
  updateMetaAdaptation() {
    // Calculate archetype frequency
    const archetypeCounts = {};
    let totalMatches = 0;
    
    // Analyze recent matches to determine meta
    this.playerData.matchHistory.forEach(match => {
      if (match.performanceMetrics?.opponentDeckArchetype) {
        const archetype = match.performanceMetrics.opponentDeckArchetype;
        archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
        totalMatches++;
      }
    });
    
    // Calculate frequency
    for (const archetype in archetypeCounts) {
      this.metaAdaptation.archetypeFrequency[archetype] = archetypeCounts[archetype] / totalMatches;
    }
    
    // Calculate diversity index (Shannon entropy)
    let entropy = 0;
    for (const archetype in this.metaAdaptation.archetypeFrequency) {
      const p = this.metaAdaptation.archetypeFrequency[archetype];
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }
    
    // Normalize entropy to 0-1 range (assuming max of 6 archetypes)
    const maxEntropy = Math.log2(Object.keys(this.deckMatchups).length);
    this.metaAdaptation.diversityIndex = entropy / maxEntropy;
    
    // Calculate meta health index
    // A healthy meta has good diversity and balanced matchups
    this.metaAdaptation.metaHealthIndex = 
      (this.metaAdaptation.diversityIndex * 0.7) + 
      (this.calculateMatchupBalance() * 0.3);
    
    this.metaAdaptation.lastUpdated = new Date();
  }

  /**
   * Calculate matchup balance (how balanced the meta is)
   */
  calculateMatchupBalance() {
    // Calculate how balanced the matchups are in the current meta
    // 1.0 means perfectly balanced, 0.0 means completely imbalanced
    
    const archetypes = Object.keys(this.deckMatchups);
    let totalImbalance = 0;
    let matchupCount = 0;
    
    for (let i = 0; i < archetypes.length; i++) {
      for (let j = i + 1; j < archetypes.length; j++) {
        const archetype1 = archetypes[i];
        const archetype2 = archetypes[j];
        
        const winRate1vs2 = this.deckMatchups[archetype1]?.[archetype2] || 0.5;
        const winRate2vs1 = this.deckMatchups[archetype2]?.[archetype1] || 0.5;
        
        // In a perfectly balanced meta, these would sum to 1.0
        const imbalance = Math.abs((winRate1vs2 + winRate2vs1) - 1.0);
        totalImbalance += imbalance;
        matchupCount++;
      }
    }
    
    // Calculate average imbalance and convert to balance score
    const avgImbalance = matchupCount > 0 ? totalImbalance / matchupCount : 0;
    return 1.0 - avgImbalance;
  }

  /**
   * Find match with enhanced multi-factor matchmaking
   */
  async findEnhancedMatch(gameMode = 'ranked', matchPreferences = {}) {
    if (gameMode !== 'ranked') {
      // For non-ranked modes, use simpler matchmaking
      return this.findCasualMatch(matchPreferences);
    }
    
    const searchStartTime = Date.now();
    let searchRange = this.matchmaking.searchRange;
    
    // Prepare contextual factors for matchmaking
    const contextualFactors = {
      timeOfDay: new Date(),
      dayOfWeek: new Date(),
      sessionLength: matchPreferences.sessionLength || 0,
      deckArchetype: matchPreferences.deckArchetype
    };
    
    return new Promise((resolve, reject) => {
      const searchInterval = setInterval(() => {
        const matchResult = this.findEnhancedOpponentInRange(
          this.playerData,
          searchRange,
          contextualFactors,
          matchPreferences
        );
        
        if (matchResult.opponent) {
          clearInterval(searchInterval);
          resolve({
            opponent: matchResult.opponent,
            estimatedRating: matchResult.opponent.rating,
            searchTime: Date.now() - searchStartTime,
            searchRange,
            matchQuality: matchResult.matchQuality,
            matchFactors: matchResult.matchFactors
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

  /**
   * Find enhanced opponent in range with multi-factor matching
   */
  findEnhancedOpponentInRange(playerData, range, contextualFactors, preferences = {}) {
    // In a real implementation, this would query a matchmaking service
    // For now, simulate finding an opponent
    
    // Get potential opponents from the queue
    const potentialOpponents = this.matchmaking.queue.filter(opponent => {
      // Basic skill range check
      const ratingDifference = Math.abs(playerData.rating - opponent.rating);
      return ratingDifference <= range;
    });
    
    if (potentialOpponents.length === 0) {
      return { opponent: null, matchQuality: 0, matchFactors: {} };
    }
    
    // Calculate match quality for each potential opponent
    const matchQualities = potentialOpponents.map(opponent => {
      const matchQuality = this.calculateMatchQuality(
        playerData,
        opponent,
        contextualFactors,
        preferences
      );
      
      return {
        opponent,
        matchQuality: matchQuality.overall,
        matchFactors: matchQuality.factors
      };
    });
    
    // Sort by match quality
    matchQualities.sort((a, b) => b.matchQuality - a.matchQuality);
    
    // Return the best match if it meets the quality threshold
    if (matchQualities[0].matchQuality >= this.matchmaking.qualityThreshold) {
      return matchQualities[0];
    }
    
    // No suitable opponent found
    return { opponent: null, matchQuality: 0, matchFactors: {} };
  }

  /**
   * Calculate match quality between two players
   */
  calculateMatchQuality(player1, player2, contextualFactors, preferences = {}) {
    const factors = {};
    
    // 1. Skill factor - how close are the players in skill
    const ratingDifference = Math.abs(player1.rating - player2.rating);
    const maxAllowedDifference = this.matchmaking.maxSkillDifference;
    const minDesiredDifference = this.matchmaking.minSkillDifference;
    
    // Skill factor is 1.0 for perfect skill match, decreasing as difference increases
    factors.skill = Math.max(0, 1 - (ratingDifference / maxAllowedDifference));
    
    // 2. Uncertainty factor - prefer opponents with similar uncertainty
    const uncertaintyDifference = Math.abs(player1.uncertainty - player2.uncertainty);
    const maxUncertaintyDifference = this.bayesianParams.MAX_UNCERTAINTY - this.bayesianParams.MIN_UNCERTAINTY;
    
    factors.uncertainty = Math.max(0, 1 - (uncertaintyDifference / maxUncertaintyDifference));
    
    // 3. Playstyle compatibility factor
    if (this.matchmaking.playstyleMatching.enabled && 
        player1.playstyleFactors && 
        player2.playstyleFactors) {
      
      const playstyleCompat = this.calculatePlaystyleCompatibility(
        player1.playstyleFactors,
        player2.playstyleFactors
      );
      
      // If preferSimilar is true, higher compatibility is better
      // If preferSimilar is false, we want complementary playstyles (lower compatibility)
      factors.playstyle = this.matchmaking.playstyleMatching.preferSimilar 
        ? playstyleCompat.compatibility
        : 1 - playstyleCompat.compatibility;
    } else {
      factors.playstyle = 0.5; // Neutral if playstyle matching is disabled
    }
    
    // 4. Deck archetype factor - consider matchup balance
    if (contextualFactors.deckArchetype && player2.deckArchetype) {
      const expectedWinRate = this.deckMatchups[contextualFactors.deckArchetype]?.[player2.deckArchetype] || 0.5;
      
      // Prefer balanced matchups (close to 50%)
      factors.deckMatchup = 1 - Math.abs(expectedWinRate - 0.5) * 2;
      
      // If meta adaptation is enabled, consider meta diversity
      if (this.matchmaking.metaAdaptation.enabled) {
        // If encouraging diversity, prefer underrepresented archetypes
        if (this.matchmaking.metaAdaptation.encourageDiversity) {
          const archetypeFrequency = this.metaAdaptation.archetypeFrequency[player2.deckArchetype] || 0.1;
          factors.metaDiversity = 1 - archetypeFrequency;
        }
      }
    } else {
      factors.deckMatchup = 0.5; // Neutral if deck archetypes are unknown
    }
    
    // 5. Contextual factors
    if (this.matchmaking.contextualFactors.timeOfDay && 
        player1.contextualFactors.timeOfDay && 
        player2.contextualFactors.timeOfDay) {
      
      const hourOfDay = contextualFactors.timeOfDay.getHours();
      const player1TimePerf = player1.contextualFactors.timeOfDay[hourOfDay];
      const player2TimePerf = player2.contextualFactors.timeOfDay[hourOfDay];
      
      if (player1TimePerf && player2TimePerf && 
          player1TimePerf.games > 5 && player2TimePerf.games > 5) {
        
        const player1WinRate = player1TimePerf.wins / player1TimePerf.games;
        const player2WinRate = player2TimePerf.wins / player2TimePerf.games;
        
        // Prefer matches where both players perform well at this time
        factors.timeOfDay = (player1WinRate + player2WinRate) / 2;
      }
    }
    
    // 6. Recent performance (momentum)
    if (this.matchmaking.contextualFactors.recentPerformance && 
        player1.recentPerformance && 
        player2.recentPerformance) {
      
      const player1Recent = this.calculateRecentWinRate(player1.recentPerformance);
      const player2Recent = this.calculateRecentWinRate(player2.recentPerformance);
      
      // Prefer matches between players with similar recent performance
      factors.recentPerformance = 1 - Math.abs(player1Recent - player2Recent);
    }
    
    // Calculate overall match quality
    let overallQuality = 0;
    let totalWeight = 0;
    
    // Apply weights from matchQualityFactors
    for (const factor in factors) {
      const weight = this.matchmaking.matchQualityFactors[factor] || 0.1;
      overallQuality += factors[factor] * weight;
      totalWeight += weight;
    }
    
    // Normalize
    overallQuality = totalWeight > 0 ? overallQuality / totalWeight : 0.5;
    
    return {
      overall: overallQuality,
      factors
    };
  }

  /**
   * Start meta analysis timer
   */
  startMetaAnalysisTimer() {
    // Update meta analysis daily
    setInterval(() => {
      this.updateMetaAnalysis();
    }, 86400000); // 24 hours
    
    // Initial update
    this.updateMetaAnalysis();
  }

  /**
   * Update meta analysis
   */
  updateMetaAnalysis() {
    // Analyze recent matches to determine meta trends
    const recentMatches = this.playerData.matchHistory.filter(match => 
      new Date(match.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    // Count archetype frequency
    const archetypeCounts = {};
    recentMatches.forEach(match => {
      if (match.performanceMetrics?.opponentDeckArchetype) {
        const archetype = match.performanceMetrics.opponentDeckArchetype;
        archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
      }
    });
    
    // Calculate frequency
    const totalMatches = recentMatches.length;
    const archetypeFrequency = {};
    
    for (const archetype in archetypeCounts) {
      archetypeFrequency[archetype] = archetypeCounts[archetype] / totalMatches;
    }
    
    // Compare with previous meta snapshot to identify trends
    const previousFrequency = this.metaAdaptation.archetypeFrequency;
    const trends = {};
    
    for (const archetype in archetypeFrequency) {
      const currentFreq = archetypeFrequency[archetype];
      const previousFreq = previousFrequency[archetype] || 0;
      
      trends[archetype] = currentFreq - previousFreq;
    }
    
    // Update meta adaptation data
    this.metaAdaptation.archetypeFrequency = archetypeFrequency;
    this.metaAdaptation.archetypeTrends = trends;
    
    // Identify dominant, rising, and falling archetypes
    const dominantArchetypes = Object.entries(archetypeFrequency)
      .filter(([_, freq]) => freq > 0.15) // More than 15% of meta
      .sort(([_, a], [__, b]) => b - a)
      .map(([archetype]) => archetype);
    
    const risingArchetypes = Object.entries(trends)
      .filter(([_, trend]) => trend > 0.05) // Rising by more than 5%
      .sort(([_, a], [__, b]) => b - a)
      .map(([archetype]) => archetype);
    
    const fallingArchetypes = Object.entries(trends)
      .filter(([_, trend]) => trend < -0.05) // Falling by more than 5%
      .sort(([_, a], [__, b]) => a - b)
      .map(([archetype]) => archetype);
    
    // Update season meta snapshot
    this.season.metaSnapshot = {
      dominantArchetypes,
      risingArchetypes,
      fallingArchetypes,
      metaHealthIndex: this.metaAdaptation.metaHealthIndex,
      lastUpdated: new Date()
    };
  }

  /**
   * Get meta analysis report
   */
  getMetaAnalysisReport() {
    return {
      metaSnapshot: this.season.metaSnapshot,
      archetypeFrequency: this.metaAdaptation.archetypeFrequency,
      archetypeTrends: this.metaAdaptation.archetypeTrends,
      metaHealthIndex: this.metaAdaptation.metaHealthIndex,
      diversityIndex: this.metaAdaptation.diversityIndex,
      matchupBalance: this.calculateMatchupBalance(),
      lastUpdated: this.metaAdaptation.lastUpdated
    };
  }

  /**
   * Get player performance analysis
   */
  getPlayerPerformanceAnalysis() {
    // Calculate overall stats
    const totalGames = this.playerData.wins + this.playerData.losses + this.playerData.draws;
    const winRate = totalGames > 0 ? this.playerData.wins / totalGames : 0;
    
    // Calculate performance by archetype
    const archetypePerformance = this.playerData.deckArchetypes.map(deck => ({
      archetype: deck.archetype,
      gamesPlayed: deck.gamesPlayed,
      winRate: deck.gamesPlayed > 0 ? deck.wins / deck.gamesPlayed : 0,
      rating: deck.rating,
      uncertainty: deck.uncertainty,
      lastPlayed: deck.lastPlayed,
      matchups: Object.entries(deck.matchups || {}).map(([opponent, data]) => ({
        opponent,
        gamesPlayed: data.gamesPlayed,
        winRate: data.winRate
      }))
    }));
    
    // Calculate contextual performance
    const contextualPerformance = {
      timeOfDay: Object.entries(this.playerData.contextualFactors.timeOfDay || {}).map(([hour, data]) => ({
        hour: parseInt(hour),
        gamesPlayed: data.games,
        winRate: data.games > 0 ? data.wins / data.games : 0
      })),
      dayOfWeek: Object.entries(this.playerData.contextualFactors.dayOfWeek || {}).map(([day, data]) => ({
        day: parseInt(day),
        gamesPlayed: data.games,
        winRate: data.games > 0 ? data.wins / data.games : 0
      })),
      sessionLength: Object.entries(this.playerData.contextualFactors.sessionLength || {}).map(([bucket, data]) => ({
        lengthMinutes: parseInt(bucket) * 30,
        gamesPlayed: data.games,
        winRate: data.games > 0 ? data.wins / data.games : 0
      }))
    };
    
    // Calculate playstyle analysis
    const playstyleAnalysis = {
      ...this.playerData.playstyleFactors,
      strengths: this.identifyPlaystyleStrengths(),
      weaknesses: this.identifyPlaystyleWeaknesses(),
      recommendations: this.generatePlaystyleRecommendations()
    };
    
    // Calculate skill progression
    const skillProgression = this.calculateSkillProgression();
    
    return {
      overallStats: {
        rating: this.playerData.rating,
        uncertainty: this.playerData.uncertainty,
        conservativeRating: this.playerData.conservativeRating,
        tier: this.playerData.tier,
        division: this.playerData.division,
        wins: this.playerData.wins,
        losses: this.playerData.losses,
        draws: this.playerData.draws,
        winRate,
        peakRating: this.playerData.peakRating,
        confidence: 1 - (this.playerData.uncertainty / this.bayesianParams.MAX_UNCERTAINTY)
      },
      archetypePerformance,
      contextualPerformance,
      playstyleAnalysis,
      skillProgression,
      adaptiveDifficulty: this.playerData.adaptiveDifficulty,
      metaPositioning: this.calculateMetaPositioning()
    };
  }

  /**
   * Identify playstyle strengths
   */
  identifyPlaystyleStrengths() {
    const strengths = [];
    const factors = this.playerData.playstyleFactors;
    
    // Identify top 2 playstyle strengths
    const factorValues = [
      { name: 'aggression', value: factors.aggression },
      { name: 'consistency', value: factors.consistency },
      { name: 'complexity', value: factors.complexity },
      { name: 'adaptability', value: factors.adaptability },
      { name: 'riskTaking', value: factors.riskTaking }
    ];
    
    // Sort by value (descending)
    factorValues.sort((a, b) => b.value - a.value);
    
    // Add top 2 as strengths if they're above 0.6
    for (let i = 0; i < 2; i++) {
      if (factorValues[i].value >= 0.6) {
        strengths.push(factorValues[i].name);
      }
    }
    
    return strengths;
  }

  /**
   * Identify playstyle weaknesses
   */
  identifyPlaystyleWeaknesses() {
    const weaknesses = [];
    const factors = this.playerData.playstyleFactors;
    
    // Identify bottom 2 playstyle weaknesses
    const factorValues = [
      { name: 'aggression', value: factors.aggression },
      { name: 'consistency', value: factors.consistency },
      { name: 'complexity', value: factors.complexity },
      { name: 'adaptability', value: factors.adaptability },
      { name: 'riskTaking', value: factors.riskTaking }
    ];
    
    // Sort by value (ascending)
    factorValues.sort((a, b) => a.value - b.value);
    
    // Add bottom 2 as weaknesses if they're below 0.4
    for (let i = 0; i < 2; i++) {
      if (factorValues[i].value <= 0.4) {
        weaknesses.push(factorValues[i].name);
      }
    }
    
    return weaknesses;
  }

  /**
   * Generate playstyle recommendations
   */
  generatePlaystyleRecommendations() {
    const recommendations = [];
    const factors = this.playerData.playstyleFactors;
    
    // Generate recommendations based on playstyle factors
    if (factors.consistency < 0.4) {
      recommendations.push('Focus on improving play consistency');
    }
    
    if (factors.adaptability < 0.4) {
      recommendations.push('Practice with a wider variety of decks to improve adaptability');
    }
    
    if (factors.complexity < 0.3 && factors.aggression > 0.7) {
      recommendations.push('Consider more complex aggressive strategies');
    }
    
    if (factors.complexity > 0.7 && factors.consistency < 0.5) {
      recommendations.push('Simplify decision-making to improve consistency');
    }
    
    if (factors.riskTaking > 0.8) {
      recommendations.push('Consider more conservative plays in critical situations');
    }
    
    if (factors.riskTaking < 0.2) {
      recommendations.push('Look for higher-reward plays when ahead');
    }
    
    return recommendations;
  }

  /**
   * Calculate skill progression over time
   */
  calculateSkillProgression() {
    // Extract rating history from match history
    const ratingHistory = this.playerData.matchHistory.map(match => ({
      date: new Date(match.date),
      rating: match.ratingAfter,
      uncertainty: match.uncertaintyAfter
    }));
    
    // Sort by date
    ratingHistory.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate skill growth rate
    let skillGrowthRate = 0;
    if (ratingHistory.length >= 2) {
      const firstRating = ratingHistory[0].rating;
      const lastRating = ratingHistory[ratingHistory.length - 1].rating;
      const daysDifference = (ratingHistory[ratingHistory.length - 1].date.getTime() - 
                             ratingHistory[0].date.getTime()) / (24 * 60 * 60 * 1000);
      
      if (daysDifference > 0) {
        skillGrowthRate = (lastRating - firstRating) / daysDifference;
      }
    }
    
    // Calculate uncertainty reduction rate
    let uncertaintyReductionRate = 0;
    if (ratingHistory.length >= 2) {
      const firstUncertainty = ratingHistory[0].uncertainty;
      const lastUncertainty = ratingHistory[ratingHistory.length - 1].uncertainty;
      const daysDifference = (ratingHistory[ratingHistory.length - 1].date.getTime() - 
                             ratingHistory[0].date.getTime()) / (24 * 60 * 60 * 1000);
      
      if (daysDifference > 0) {
        uncertaintyReductionRate = (firstUncertainty - lastUncertainty) / daysDifference;
      }
    }
    
    return {
      ratingHistory,
      skillGrowthRate,
      uncertaintyReductionRate,
      projectedRating: this.playerData.rating + (skillGrowthRate * 30), // Projected 30 days ahead
      projectedUncertainty: Math.max(
        this.bayesianParams.MIN_UNCERTAINTY,
        this.playerData.uncertainty - (uncertaintyReductionRate * 30)
      )
    };
  }

  /**
   * Calculate meta positioning
   */
  calculateMetaPositioning() {
    // Calculate how well the player's preferred archetypes position against the current meta
    const preferredArchetypes = this.playerData.deckArchetypes
      .filter(deck => deck.gamesPlayed >= 5)
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
      .slice(0, 3)
      .map(deck => deck.archetype);
    
    const metaPositioning = {};
    
    for (const archetype of preferredArchetypes) {
      const matchups = {};
      let overallWinRate = 0;
      let totalWeight = 0;
      
      // Calculate expected win rate against each meta archetype
      for (const metaArchetype in this.metaAdaptation.archetypeFrequency) {
        const frequency = this.metaAdaptation.archetypeFrequency[metaArchetype];
        const expectedWinRate = this.deckMatchups[archetype]?.[metaArchetype] || 0.5;
        
        matchups[metaArchetype] = {
          frequency,
          expectedWinRate
        };
        
        overallWinRate += expectedWinRate * frequency;
        totalWeight += frequency;
      }
      
      // Normalize overall win rate
      if (totalWeight > 0) {
        overallWinRate /= totalWeight;
      }
      
      metaPositioning[archetype] = {
        matchups,
        overallWinRate,
        metaPosition: overallWinRate > 0.55 ? 'favorable' : 
                     overallWinRate < 0.45 ? 'unfavorable' : 'neutral'
      };
    }
    
    return {
      preferredArchetypes,
      archetypePositioning: metaPositioning,
      recommendedArchetypes: this.recommendArchetypesForMeta()
    };
  }

  /**
   * Recommend archetypes for current meta
   */
  recommendArchetypesForMeta() {
    const recommendations = [];
    
    // Calculate expected win rate for each archetype against the current meta
    const archetypeScores = {};
    
    for (const archetype in this.deckMatchups) {
      let weightedWinRate = 0;
      let totalWeight = 0;
      
      for (const metaArchetype in this.metaAdaptation.archetypeFrequency) {
        const frequency = this.metaAdaptation.archetypeFrequency[metaArchetype];
        const expectedWinRate = this.deckMatchups[archetype]?.[metaArchetype] || 0.5;
        
        weightedWinRate += expectedWinRate * frequency;
        totalWeight += frequency;
      }
      
      if (totalWeight > 0) {
        archetypeScores[archetype] = weightedWinRate / totalWeight;
      }
    }
    
    // Sort archetypes by expected win rate
    const sortedArchetypes = Object.entries(archetypeScores)
      .sort(([_, a], [__, b]) => b - a)
      .map(([archetype, score]) => ({
        archetype,
        expectedWinRate: score,
        playerExperience: this.getPlayerArchetypeExperience(archetype)
      }));
    
    // Recommend top 3 archetypes
    return sortedArchetypes.slice(0, 3);
  }

  /**
   * Get player experience with an archetype
   */
  getPlayerArchetypeExperience(archetype) {
    const deckData = this.playerData.deckArchetypes.find(d => d.archetype === archetype);
    
    if (!deckData) {
      return {
        gamesPlayed: 0,
        winRate: 0,
        experienceLevel: 'none'
      };
    }
    
    const winRate = deckData.gamesPlayed > 0 ? deckData.wins / deckData.gamesPlayed : 0;
    
    let experienceLevel = 'none';
    if (deckData.gamesPlayed >= 50) {
      experienceLevel = 'expert';
    } else if (deckData.gamesPlayed >= 20) {
      experienceLevel = 'experienced';
    } else if (deckData.gamesPlayed >= 5) {
      experienceLevel = 'familiar';
    } else if (deckData.gamesPlayed > 0) {
      experienceLevel = 'novice';
    }
    
    return {
      gamesPlayed: deckData.gamesPlayed,
      winRate,
      experienceLevel
    };
  }
}

export default EnhancedRankingEngine;