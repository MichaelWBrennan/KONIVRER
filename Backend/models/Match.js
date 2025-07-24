const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  gameNumber: { type: Number, required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  player1Score: { type: Number, default: 0 },
  player2Score: { type: Number, default: 0 },
  duration: { type: Number }, // Duration in minutes
  notes: { type: String },
  startTime: { type: Date },
  endTime: { type: Date }
});

const matchSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  round: { type: Number, required: true },
  table: { type: Number },
  
  // Players
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Deck information
  player1Deck: {
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck' },
    archetype: { type: String, enum: ['Aggro', 'Control', 'Midrange', 'Combo', 'Tempo', 'Ramp'] },
    hero: { type: String },
    deckList: { type: String } // Optional deck list hash or identifier
  },
  player2Deck: {
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck' },
    archetype: { type: String, enum: ['Aggro', 'Control', 'Midrange', 'Combo', 'Tempo', 'Ramp'] },
    hero: { type: String },
    deckList: { type: String }
  },
  
  // Match results
  status: { 
    type: String, 
    enum: ['pending', 'ongoing', 'completed', 'bye', 'no_show', 'disqualified'], 
    default: 'pending' 
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  result: { type: String, enum: ['1-0', '2-0', '2-1', '1-2', '0-2', '0-1', 'draw', 'bye'] },
  
  // Individual games
  games: [gameResultSchema],
  
  // Timing
  scheduledTime: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  totalDuration: { type: Number }, // Total match duration in minutes
  
  // Matchmaking data
  matchmakingData: {
    qualityScore: { type: Number }, // How good this match was predicted to be (0-1)
    skillDifference: { type: Number }, // Rating difference between players
    predictedWinProbability: { type: Number }, // Predicted win probability for player1
    actualOutcome: { type: Number }, // Actual outcome (1 for player1 win, 0 for player2 win, 0.5 for draw)
    surpriseFactor: { type: Number }, // How surprising the result was
    deckMatchupFactor: { type: Number }, // Deck archetype matchup consideration
    algorithm: { type: String, enum: ['bayesian', 'elo', 'random'] }
  },
  
  // Rating changes
  ratingChanges: {
    player1: {
      ratingBefore: { type: Number },
      ratingAfter: { type: Number },
      uncertaintyBefore: { type: Number },
      uncertaintyAfter: { type: Number },
      change: { type: Number }
    },
    player2: {
      ratingBefore: { type: Number },
      ratingAfter: { type: Number },
      uncertaintyBefore: { type: Number },
      uncertaintyAfter: { type: Number },
      change: { type: Number }
    }
  },
  
  // Judge/Admin notes
  judgeNotes: { type: String },
  adminNotes: { type: String },
  
  // Penalties or warnings
  penalties: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['warning', 'game_loss', 'match_loss', 'disqualification'] },
    reason: { type: String },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
matchSchema.index({ tournamentId: 1, round: 1 });
matchSchema.index({ player1: 1 });
matchSchema.index({ player2: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ scheduledTime: 1 });

// Update the updatedAt field before saving
matchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate match duration
matchSchema.methods.calculateDuration = function() {
  if (this.startTime && this.endTime) {
    this.totalDuration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // Minutes
  }
};

// Determine winner based on games
matchSchema.methods.determineWinner = function() {
  if (this.games.length === 0) return null;
  
  let player1Wins = 0;
  let player2Wins = 0;
  
  this.games.forEach(game => {
    if (game.winner) {
      if (game.winner.toString() === this.player1.toString()) {
        player1Wins++;
      } else if (game.winner.toString() === this.player2.toString()) {
        player2Wins++;
      }
    }
  });
  
  // Determine result string
  if (player1Wins > player2Wins) {
    this.winner = this.player1;
    this.result = `${player1Wins}-${player2Wins}`;
  } else if (player2Wins > player1Wins) {
    this.winner = this.player2;
    this.result = `${player1Wins}-${player2Wins}`;
  } else {
    this.winner = null;
    this.result = 'draw';
  }
  
  return this.winner;
};

// Calculate match quality score based on how close the match was
matchSchema.methods.calculateQualityScore = function() {
  if (!this.matchmakingData.predictedWinProbability || this.status !== 'completed') {
    return null;
  }
  
  const predicted = this.matchmakingData.predictedWinProbability;
  const actual = this.matchmakingData.actualOutcome;
  
  // Quality is higher when the match was close to 50/50 and the prediction was accurate
  const closeness = 1 - Math.abs(0.5 - predicted); // How close to 50/50 the prediction was
  const accuracy = 1 - Math.abs(predicted - actual); // How accurate the prediction was
  
  // Combine closeness and accuracy
  return (closeness * 0.6 + accuracy * 0.4);
};

// Calculate surprise factor (how unexpected the result was)
matchSchema.methods.calculateSurpriseFactor = function() {
  if (!this.matchmakingData.predictedWinProbability || this.status !== 'completed') {
    return null;
  }
  
  const predicted = this.matchmakingData.predictedWinProbability;
  const actual = this.matchmakingData.actualOutcome;
  
  // Surprise is higher when the actual result was very different from prediction
  return Math.abs(predicted - actual);
};

// Check if match is a bye
matchSchema.methods.isBye = function() {
  return this.status === 'bye' || !this.player2;
};

// Get opponent for a given player
matchSchema.methods.getOpponent = function(playerId) {
  if (this.player1.toString() === playerId.toString()) {
    return this.player2;
  } else if (this.player2.toString() === playerId.toString()) {
    return this.player1;
  }
  return null;
};

// Check if player won the match
matchSchema.methods.didPlayerWin = function(playerId) {
  return this.winner && this.winner.toString() === playerId.toString();
};

module.exports = mongoose.model('Match', matchSchema);