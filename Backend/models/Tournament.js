const mongoose = require('mongoose');

const matchmakingSettingsSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  algorithm: { 
    type: String, 
    enum: ['bayesian', 'elo'], 
    default: 'bayesian' 
  },
  skillVariance: { type: Number, default: 0.3, min: 0.1, max: 1.0 },
  deckDiversityWeight: { type: Number, default: 0.4, min: 0.1, max: 1.0 },
  historicalWeight: { type: Number, default: 0.6, min: 0.1, max: 1.0 },
  uncertaintyFactor: { type: Number, default: 0.2, min: 0.1, max: 0.5 },
  minSkillDifference: { type: Number, default: 100, min: 50, max: 300 },
  maxSkillDifference: { type: Number, default: 500, min: 300, max: 1000 },
  preferredMatchupBalance: { type: Number, default: 0.7, min: 0.5, max: 1.0 },
  learningRate: { type: Number, default: 0.1, min: 0.05, max: 0.3 },
  confidenceThreshold: { type: Number, default: 0.8, min: 0.5, max: 0.95 }
});

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  format: { 
    type: String, 
    required: true,
    enum: ['Classic Constructed', 'Blitz', 'Booster Draft', 'Sealed Deck', 'Legacy']
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  maxPlayers: { type: Number, required: true, min: 4, max: 512 },
  entryFee: { type: String, default: '$0' },
  prizePool: { type: String, default: '$0' },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rounds: { type: Number, default: 0 },
  currentRound: { type: Number, default: 0 },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
  matchmakingSettings: { type: matchmakingSettingsSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
tournamentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate number of rounds based on participants
tournamentSchema.methods.calculateRounds = function() {
  const playerCount = this.participants.length;
  if (playerCount <= 1) return 0;
  
  // Swiss system rounds calculation
  return Math.ceil(Math.log2(playerCount));
};

// Check if tournament is ready to start
tournamentSchema.methods.canStart = function() {
  return this.participants.length >= 4 && 
         this.status === 'upcoming' && 
         new Date() >= this.date;
};

module.exports = mongoose.model('Tournament', tournamentSchema);