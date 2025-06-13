const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const PlayerRating = require('../models/PlayerRating');
const BayesianMatchmaking = require('../services/bayesianMatchmaking');

class TournamentController {
  // Create a new tournament
  async createTournament(req, res) {
    try {
      const {
        name,
        format,
        date,
        time,
        location,
        maxPlayers,
        entryFee,
        prizePool,
        description,
        matchmakingSettings
      } = req.body;

      const tournament = new Tournament({
        name,
        format,
        date: new Date(date),
        time,
        location,
        maxPlayers,
        entryFee,
        prizePool,
        description,
        organizer: req.user.id,
        matchmakingSettings: matchmakingSettings || {}
      });

      await tournament.save();

      res.status(201).json({
        success: true,
        data: tournament,
        message: 'Tournament created successfully'
      });
    } catch (error) {
      console.error('Error creating tournament:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating tournament',
        error: error.message
      });
    }
  }

  // Get all tournaments
  async getTournaments(req, res) {
    try {
      const { status, format, limit = 20, page = 1 } = req.query;
      
      const filter = {};
      if (status) filter.status = status;
      if (format) filter.format = format;

      const tournaments = await Tournament.find(filter)
        .populate('organizer', 'username email')
        .populate('participants', 'username')
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Tournament.countDocuments(filter);

      res.json({
        success: true,
        data: tournaments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching tournaments',
        error: error.message
      });
    }
  }

  // Get tournament by ID
  async getTournament(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id)
        .populate('organizer', 'username email')
        .populate('participants', 'username')
        .populate('matches');

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      res.json({
        success: true,
        data: tournament
      });
    } catch (error) {
      console.error('Error fetching tournament:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching tournament',
        error: error.message
      });
    }
  }

  // Update tournament
  async updateTournament(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id);

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      // Check if user is organizer
      if (tournament.organizer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this tournament'
        });
      }

      // Update fields
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          tournament[key] = req.body[key];
        }
      });

      await tournament.save();

      res.json({
        success: true,
        data: tournament,
        message: 'Tournament updated successfully'
      });
    } catch (error) {
      console.error('Error updating tournament:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating tournament',
        error: error.message
      });
    }
  }

  // Join tournament
  async joinTournament(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id);

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      // Check if tournament is open for registration
      if (tournament.status !== 'upcoming') {
        return res.status(400).json({
          success: false,
          message: 'Tournament registration is closed'
        });
      }

      // Check if tournament is full
      if (tournament.participants.length >= tournament.maxPlayers) {
        return res.status(400).json({
          success: false,
          message: 'Tournament is full'
        });
      }

      // Check if user is already registered
      if (tournament.participants.includes(req.user.id)) {
        return res.status(400).json({
          success: false,
          message: 'Already registered for this tournament'
        });
      }

      tournament.participants.push(req.user.id);
      await tournament.save();

      res.json({
        success: true,
        message: 'Successfully joined tournament',
        data: tournament
      });
    } catch (error) {
      console.error('Error joining tournament:', error);
      res.status(500).json({
        success: false,
        message: 'Error joining tournament',
        error: error.message
      });
    }
  }

  // Start tournament and generate first round pairings
  async startTournament(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id);

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      // Check if user is organizer
      if (tournament.organizer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to start this tournament'
        });
      }

      // Check if tournament can start
      if (!tournament.canStart()) {
        return res.status(400).json({
          success: false,
          message: 'Tournament cannot start yet'
        });
      }

      // Calculate rounds
      tournament.rounds = tournament.calculateRounds();
      tournament.currentRound = 1;
      tournament.status = 'ongoing';

      // Generate first round pairings using Bayesian matchmaking
      const matches = await BayesianMatchmaking.generatePairings(
        tournament._id,
        tournament.participants,
        tournament.matchmakingSettings,
        tournament.format,
        1
      );

      // Save matches
      const savedMatches = [];
      for (const match of matches) {
        const savedMatch = await match.save();
        savedMatches.push(savedMatch);
        tournament.matches.push(savedMatch._id);
      }

      await tournament.save();

      res.json({
        success: true,
        message: 'Tournament started successfully',
        data: {
          tournament,
          matches: savedMatches
        }
      });
    } catch (error) {
      console.error('Error starting tournament:', error);
      res.status(500).json({
        success: false,
        message: 'Error starting tournament',
        error: error.message
      });
    }
  }

  // Generate next round pairings
  async generateNextRound(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id);

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      // Check if user is organizer
      if (tournament.organizer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to manage this tournament'
        });
      }

      // Check if current round is complete
      const currentRoundMatches = await Match.find({
        tournamentId: tournament._id,
        round: tournament.currentRound
      });

      const incompleteMatches = currentRoundMatches.filter(
        match => match.status !== 'completed' && match.status !== 'bye'
      );

      if (incompleteMatches.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Current round is not complete',
          incompleteMatches: incompleteMatches.length
        });
      }

      // Check if tournament is finished
      if (tournament.currentRound >= tournament.rounds) {
        tournament.status = 'completed';
        await tournament.save();
        
        return res.status(400).json({
          success: false,
          message: 'Tournament is already complete'
        });
      }

      // Get active players (those who haven't dropped)
      const activePlayers = tournament.participants; // TODO: Implement drop functionality

      // Generate next round pairings
      tournament.currentRound += 1;
      const matches = await BayesianMatchmaking.generatePairings(
        tournament._id,
        activePlayers,
        tournament.matchmakingSettings,
        tournament.format,
        tournament.currentRound
      );

      // Save matches
      const savedMatches = [];
      for (const match of matches) {
        const savedMatch = await match.save();
        savedMatches.push(savedMatch);
        tournament.matches.push(savedMatch._id);
      }

      await tournament.save();

      res.json({
        success: true,
        message: `Round ${tournament.currentRound} pairings generated`,
        data: {
          tournament,
          matches: savedMatches
        }
      });
    } catch (error) {
      console.error('Error generating next round:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating next round',
        error: error.message
      });
    }
  }

  // Update matchmaking settings
  async updateMatchmakingSettings(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id);

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      // Check if user is organizer
      if (tournament.organizer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this tournament'
        });
      }

      // Update matchmaking settings
      tournament.matchmakingSettings = {
        ...tournament.matchmakingSettings,
        ...req.body
      };

      await tournament.save();

      res.json({
        success: true,
        message: 'Matchmaking settings updated successfully',
        data: tournament.matchmakingSettings
      });
    } catch (error) {
      console.error('Error updating matchmaking settings:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating matchmaking settings',
        error: error.message
      });
    }
  }

  // Get tournament standings
  async getStandings(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id)
        .populate('participants', 'username');

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      // Get all matches for this tournament
      const matches = await Match.find({ tournamentId: tournament._id })
        .populate('player1 player2', 'username');

      // Calculate standings
      const standings = this.calculateStandings(tournament.participants, matches);

      res.json({
        success: true,
        data: standings
      });
    } catch (error) {
      console.error('Error getting standings:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting standings',
        error: error.message
      });
    }
  }

  // Calculate tournament standings
  calculateStandings(participants, matches) {
    const standings = participants.map(player => ({
      player: player,
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      gameWins: 0,
      gameLosses: 0,
      opponents: [],
      opponentWinPercentage: 0,
      gameWinPercentage: 0
    }));

    // Process each match
    matches.forEach(match => {
      if (match.status !== 'completed') return;

      const player1Standing = standings.find(s => 
        s.player._id.toString() === match.player1._id.toString()
      );
      const player2Standing = standings.find(s => 
        s.player._id.toString() === match.player2._id.toString()
      );

      if (!player1Standing || !player2Standing) return;

      // Add opponents
      player1Standing.opponents.push(match.player2._id);
      player2Standing.opponents.push(match.player1._id);

      // Calculate game wins/losses
      const games = match.games || [];
      let p1GameWins = 0, p2GameWins = 0;

      games.forEach(game => {
        if (game.winner) {
          if (game.winner.toString() === match.player1._id.toString()) {
            p1GameWins++;
          } else {
            p2GameWins++;
          }
        }
      });

      player1Standing.gameWins += p1GameWins;
      player1Standing.gameLosses += p2GameWins;
      player2Standing.gameWins += p2GameWins;
      player2Standing.gameLosses += p1GameWins;

      // Calculate match results and points
      if (match.winner) {
        if (match.winner.toString() === match.player1._id.toString()) {
          player1Standing.wins++;
          player1Standing.points += 3;
          player2Standing.losses++;
        } else {
          player2Standing.wins++;
          player2Standing.points += 3;
          player1Standing.losses++;
        }
      } else {
        // Draw
        player1Standing.draws++;
        player2Standing.draws++;
        player1Standing.points += 1;
        player2Standing.points += 1;
      }
    });

    // Calculate tiebreakers
    standings.forEach(standing => {
      // Game win percentage
      const totalGames = standing.gameWins + standing.gameLosses;
      standing.gameWinPercentage = totalGames > 0 ? 
        (standing.gameWins / totalGames) * 100 : 0;

      // Opponent win percentage (simplified)
      let opponentWins = 0, opponentMatches = 0;
      standing.opponents.forEach(opponentId => {
        const opponent = standings.find(s => 
          s.player._id.toString() === opponentId.toString()
        );
        if (opponent) {
          opponentWins += opponent.wins;
          opponentMatches += opponent.wins + opponent.losses + opponent.draws;
        }
      });
      
      standing.opponentWinPercentage = opponentMatches > 0 ? 
        (opponentWins / opponentMatches) * 100 : 0;
    });

    // Sort standings
    standings.sort((a, b) => {
      // Primary: Points
      if (a.points !== b.points) return b.points - a.points;
      
      // Tiebreaker 1: Opponent Win Percentage
      if (Math.abs(a.opponentWinPercentage - b.opponentWinPercentage) > 0.01) {
        return b.opponentWinPercentage - a.opponentWinPercentage;
      }
      
      // Tiebreaker 2: Game Win Percentage
      return b.gameWinPercentage - a.gameWinPercentage;
    });

    return standings.map((standing, index) => ({
      rank: index + 1,
      ...standing
    }));
  }

  // Get matchmaking analytics
  async getMatchmakingAnalytics(req, res) {
    try {
      const tournament = await Tournament.findById(req.params.id);

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Tournament not found'
        });
      }

      // Get all completed matches
      const matches = await Match.find({
        tournamentId: tournament._id,
        status: 'completed'
      });

      // Calculate analytics
      const analytics = {
        totalMatches: matches.length,
        averageQualityScore: 0,
        averageProcessingTime: 1.2, // Simulated
        predictionAccuracy: 0,
        surpriseFactorAverage: 0,
        skillDifferenceAverage: 0,
        deckArchetypeDistribution: {},
        roundAnalytics: []
      };

      if (matches.length > 0) {
        // Calculate averages
        let totalQuality = 0;
        let totalSurprise = 0;
        let totalSkillDiff = 0;
        let correctPredictions = 0;

        matches.forEach(match => {
          if (match.matchmakingData) {
            if (match.matchmakingData.qualityScore) {
              totalQuality += match.matchmakingData.qualityScore;
            }
            if (match.matchmakingData.surpriseFactor) {
              totalSurprise += match.matchmakingData.surpriseFactor;
            }
            if (match.matchmakingData.skillDifference) {
              totalSkillDiff += match.matchmakingData.skillDifference;
            }
            
            // Check prediction accuracy
            if (match.matchmakingData.predictedWinProbability && 
                match.matchmakingData.actualOutcome !== undefined) {
              const predicted = match.matchmakingData.predictedWinProbability > 0.5 ? 1 : 0;
              const actual = match.matchmakingData.actualOutcome > 0.5 ? 1 : 0;
              if (predicted === actual) correctPredictions++;
            }
          }

          // Track deck archetypes
          if (match.player1Deck?.archetype) {
            analytics.deckArchetypeDistribution[match.player1Deck.archetype] = 
              (analytics.deckArchetypeDistribution[match.player1Deck.archetype] || 0) + 1;
          }
          if (match.player2Deck?.archetype) {
            analytics.deckArchetypeDistribution[match.player2Deck.archetype] = 
              (analytics.deckArchetypeDistribution[match.player2Deck.archetype] || 0) + 1;
          }
        });

        analytics.averageQualityScore = (totalQuality / matches.length) * 100;
        analytics.surpriseFactorAverage = (totalSurprise / matches.length) * 100;
        analytics.skillDifferenceAverage = totalSkillDiff / matches.length;
        analytics.predictionAccuracy = (correctPredictions / matches.length) * 100;
      }

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error getting matchmaking analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting matchmaking analytics',
        error: error.message
      });
    }
  }
}

module.exports = new TournamentController();