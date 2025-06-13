const mongoose = require('mongoose');

const deckArchetypeSchema = new mongoose.Schema({
  archetype: { 
    type: String, 
    enum: ['Aggro', 'Control', 'Midrange', 'Combo', 'Tempo', 'Ramp'], 
    required: true 
  },
  rating: { type: Number, default: 1500 },
  uncertainty: { type: Number, default: 350 }, // Bayesian uncertainty (sigma)
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: Date.now }
});

const matchHistorySchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  opponentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  result: { type: String, enum: ['win', 'loss', 'draw'], required: true },
  playerDeck: { type: String, required: true }, // Deck archetype
  opponentDeck: { type: String, required: true }, // Opponent's deck archetype
  ratingBefore: { type: Number, required: true },
  ratingAfter: { type: Number, required: true },
  uncertaintyBefore: { type: Number, required: true },
  uncertaintyAfter: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const playerRatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Overall Bayesian TrueSkill rating
  overallRating: { type: Number, default: 1500 }, // mu (mean skill)
  overallUncertainty: { type: Number, default: 350 }, // sigma (uncertainty)
  
  // Format-specific ratings
  formatRatings: {
    'Classic Constructed': {
      rating: { type: Number, default: 1500 },
      uncertainty: { type: Number, default: 350 },
      gamesPlayed: { type: Number, default: 0 }
    },
    'Blitz': {
      rating: { type: Number, default: 1500 },
      uncertainty: { type: Number, default: 350 },
      gamesPlayed: { type: Number, default: 0 }
    },
    'Booster Draft': {
      rating: { type: Number, default: 1500 },
      uncertainty: { type: Number, default: 350 },
      gamesPlayed: { type: Number, default: 0 }
    },
    'Sealed Deck': {
      rating: { type: Number, default: 1500 },
      uncertainty: { type: Number, default: 350 },
      gamesPlayed: { type: Number, default: 0 }
    },
    'Legacy': {
      rating: { type: Number, default: 1500 },
      uncertainty: { type: Number, default: 350 },
      gamesPlayed: { type: Number, default: 0 }
    }
  },
  
  // Deck archetype performance
  deckArchetypes: [deckArchetypeSchema],
  
  // Match history for learning
  matchHistory: [matchHistorySchema],
  
  // Performance metrics
  totalGames: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  totalDraws: { type: Number, default: 0 },
  
  // Streak tracking
  currentWinStreak: { type: Number, default: 0 },
  currentLossStreak: { type: Number, default: 0 },
  longestWinStreak: { type: Number, default: 0 },
  longestLossStreak: { type: Number, default: 0 },
  
  // Activity tracking
  lastActive: { type: Date, default: Date.now },
  inactivityPenalty: { type: Number, default: 0 }, // Increases uncertainty over time
  
  // Confidence metrics
  ratingConfidence: { type: Number, default: 0.1 }, // How confident we are in the rating
  volatility: { type: Number, default: 0.06 }, // How much the rating changes
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
playerRatingSchema.index({ userId: 1 });
playerRatingSchema.index({ overallRating: -1 });
playerRatingSchema.index({ 'formatRatings.Classic Constructed.rating': -1 });
playerRatingSchema.index({ lastActive: -1 });

// Update the updatedAt field before saving
playerRatingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate conservative skill estimate (rating - 3 * uncertainty)
playerRatingSchema.methods.getConservativeRating = function(format = null) {
  if (format && this.formatRatings[format]) {
    const formatRating = this.formatRatings[format];
    return formatRating.rating - (3 * formatRating.uncertainty);
  }
  return this.overallRating - (3 * this.overallUncertainty);
};

// Calculate win probability against another player using Bayesian model
playerRatingSchema.methods.calculateWinProbability = function(opponent, format = null) {
  let myRating, myUncertainty, oppRating, oppUncertainty;
  
  if (format && this.formatRatings[format] && opponent.formatRatings[format]) {
    myRating = this.formatRatings[format].rating;
    myUncertainty = this.formatRatings[format].uncertainty;
    oppRating = opponent.formatRatings[format].rating;
    oppUncertainty = opponent.formatRatings[format].uncertainty;
  } else {
    myRating = this.overallRating;
    myUncertainty = this.overallUncertainty;
    oppRating = opponent.overallRating;
    oppUncertainty = opponent.overallUncertainty;
  }
  
  // Calculate combined uncertainty
  const combinedUncertainty = Math.sqrt(myUncertainty * myUncertainty + oppUncertainty * oppUncertainty);
  
  // Calculate win probability using normal distribution
  const ratingDifference = myRating - oppRating;
  const c = Math.sqrt(2) * combinedUncertainty;
  
  // Use error function approximation for normal CDF
  return 0.5 * (1 + this.erf(ratingDifference / c));
};

// Error function approximation
playerRatingSchema.methods.erf = function(x) {
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
};

// Get deck archetype rating
playerRatingSchema.methods.getDeckArchetypeRating = function(archetype) {
  const deckData = this.deckArchetypes.find(d => d.archetype === archetype);
  if (deckData) {
    return {
      rating: deckData.rating,
      uncertainty: deckData.uncertainty,
      gamesPlayed: deckData.gamesPlayed
    };
  }
  
  // Return default values for new archetype
  return {
    rating: this.overallRating,
    uncertainty: Math.max(this.overallUncertainty, 300), // Higher uncertainty for new archetype
    gamesPlayed: 0
  };
};

// Update deck archetype performance
playerRatingSchema.methods.updateDeckArchetype = function(archetype, newRating, newUncertainty, result) {
  let deckData = this.deckArchetypes.find(d => d.archetype === archetype);
  
  if (!deckData) {
    deckData = {
      archetype: archetype,
      rating: newRating,
      uncertainty: newUncertainty,
      gamesPlayed: 1,
      wins: result === 'win' ? 1 : 0,
      losses: result === 'loss' ? 1 : 0,
      lastPlayed: new Date()
    };
    this.deckArchetypes.push(deckData);
  } else {
    deckData.rating = newRating;
    deckData.uncertainty = newUncertainty;
    deckData.gamesPlayed += 1;
    if (result === 'win') deckData.wins += 1;
    if (result === 'loss') deckData.losses += 1;
    deckData.lastPlayed = new Date();
  }
};

// Apply inactivity penalty (increases uncertainty over time)
playerRatingSchema.methods.applyInactivityPenalty = function() {
  const daysSinceLastActive = (Date.now() - this.lastActive) / (1000 * 60 * 60 * 24);
  
  if (daysSinceLastActive > 30) {
    // Increase uncertainty by 1 point per day after 30 days of inactivity
    const penalty = Math.min(daysSinceLastActive - 30, 100); // Cap at 100 points
    this.overallUncertainty = Math.min(this.overallUncertainty + penalty, 350);
    this.inactivityPenalty = penalty;
    
    // Apply to format ratings as well
    Object.keys(this.formatRatings).forEach(format => {
      this.formatRatings[format].uncertainty = Math.min(
        this.formatRatings[format].uncertainty + penalty, 
        350
      );
    });
  }
};

module.exports = mongoose.model('PlayerRating', playerRatingSchema);