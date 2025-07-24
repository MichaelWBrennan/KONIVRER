const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const BayesianMatchmaking = require('../services/bayesianMatchmaking');

class MatchController {
  // Get match by ID
  async getMatch(req, res) {
    try {
      const match = await Match.findById(req.params.id)
        .populate('player1 player2', 'username')
        .populate('tournamentId', 'name format');

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }

      res.json({
        success: true,
        data: match
      });
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching match',
        error: error.message
      });
    }
  }

  // Get matches for a tournament
  async getTournamentMatches(req, res) {
    try {
      const { round } = req.query;
      const filter = { tournamentId: req.params.tournamentId };
      
      if (round) {
        filter.round = parseInt(round);
      }

      const matches = await Match.find(filter)
        .populate('player1 player2', 'username')
        .sort({ round: 1, table: 1 });

      res.json({
        success: true,
        data: matches
      });
    } catch (error) {
      console.error('Error fetching tournament matches:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching tournament matches',
        error: error.message
      });
    }
  }

  // Update match result
  async updateMatchResult(req, res) {
    try {
      const match = await Match.findById(req.params.id);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }

      // Get tournament to check permissions
      const tournament = await Tournament.findById(match.tournamentId);
      
      // Check if user is organizer or one of the players
      const isOrganizer = tournament.organizer.toString() === req.user.id;
      const isPlayer = match.player1.toString() === req.user.id || 
                      match.player2.toString() === req.user.id;

      if (!isOrganizer && !isPlayer) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this match'
        });
      }

      const { 
        games, 
        winner, 
        result, 
        player1Deck, 
        player2Deck,
        judgeNotes,
        penalties 
      } = req.body;

      // Update match data
      if (games) match.games = games;
      if (winner) match.winner = winner;
      if (result) match.result = result;
      if (player1Deck) match.player1Deck = { ...match.player1Deck, ...player1Deck };
      if (player2Deck) match.player2Deck = { ...match.player2Deck, ...player2Deck };
      if (judgeNotes) match.judgeNotes = judgeNotes;
      if (penalties) match.penalties = penalties;

      // If games are provided, determine winner automatically
      if (games && games.length > 0) {
        match.determineWinner();
      }

      // Set match as completed if winner is determined
      if (match.winner || match.result === 'draw') {
        match.status = 'completed';
        match.endTime = new Date();
        match.calculateDuration();
      }

      await match.save();

      // Update player ratings if match is completed
      if (match.status === 'completed') {
        try {
          await BayesianMatchmaking.updateRatingsAfterMatch(match);
        } catch (ratingError) {
          console.error('Error updating ratings:', ratingError);
          // Don't fail the request if rating update fails
        }
      }

      res.json({
        success: true,
        data: match,
        message: 'Match updated successfully'
      });
    } catch (error) {
      console.error('Error updating match:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating match',
        error: error.message
      });
    }
  }

  // Start a match
  async startMatch(req, res) {
    try {
      const match = await Match.findById(req.params.id);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }

      // Check if user is one of the players or tournament organizer
      const tournament = await Tournament.findById(match.tournamentId);
      const isOrganizer = tournament.organizer.toString() === req.user.id;
      const isPlayer = match.player1.toString() === req.user.id || 
                      match.player2.toString() === req.user.id;

      if (!isOrganizer && !isPlayer) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to start this match'
        });
      }

      if (match.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Match cannot be started'
        });
      }

      match.status = 'ongoing';
      match.startTime = new Date();
      await match.save();

      res.json({
        success: true,
        data: match,
        message: 'Match started successfully'
      });
    } catch (error) {
      console.error('Error starting match:', error);
      res.status(500).json({
        success: false,
        message: 'Error starting match',
        error: error.message
      });
    }
  }

  // Report match result (for players)
  async reportResult(req, res) {
    try {
      const match = await Match.findById(req.params.id);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }

      // Check if user is one of the players
      const isPlayer = match.player1.toString() === req.user.id || 
                      match.player2.toString() === req.user.id;

      if (!isPlayer) {
        return res.status(403).json({
          success: false,
          message: 'Only players can report match results'
        });
      }

      const { games, winner, myDeck } = req.body;

      // Update deck information for the reporting player
      if (myDeck) {
        if (match.player1.toString() === req.user.id) {
          match.player1Deck = { ...match.player1Deck, ...myDeck };
        } else {
          match.player2Deck = { ...match.player2Deck, ...myDeck };
        }
      }

      // Add games if provided
      if (games && Array.isArray(games)) {
        match.games = games;
        match.determineWinner();
      } else if (winner) {
        match.winner = winner;
      }

      // Mark as completed if winner is determined
      if (match.winner) {
        match.status = 'completed';
        match.endTime = new Date();
        match.calculateDuration();
        
        // Update ratings
        try {
          await BayesianMatchmaking.updateRatingsAfterMatch(match);
        } catch (ratingError) {
          console.error('Error updating ratings:', ratingError);
        }
      }

      await match.save();

      res.json({
        success: true,
        data: match,
        message: 'Match result reported successfully'
      });
    } catch (error) {
      console.error('Error reporting match result:', error);
      res.status(500).json({
        success: false,
        message: 'Error reporting match result',
        error: error.message
      });
    }
  }

  // Get player's matches
  async getPlayerMatches(req, res) {
    try {
      const { status, limit = 20, page = 1 } = req.query;
      
      const filter = {
        $or: [
          { player1: req.user.id },
          { player2: req.user.id }
        ]
      };

      if (status) {
        filter.status = status;
      }

      const matches = await Match.find(filter)
        .populate('player1 player2', 'username')
        .populate('tournamentId', 'name format')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Match.countDocuments(filter);

      res.json({
        success: true,
        data: matches,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      console.error('Error fetching player matches:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching player matches',
        error: error.message
      });
    }
  }

  // Get match statistics
  async getMatchStatistics(req, res) {
    try {
      const { tournamentId } = req.query;
      
      const filter = {};
      if (tournamentId) {
        filter.tournamentId = tournamentId;
      }

      const matches = await Match.find(filter);
      
      const stats = {
        total: matches.length,
        completed: matches.filter(m => m.status === 'completed').length,
        ongoing: matches.filter(m => m.status === 'ongoing').length,
        pending: matches.filter(m => m.status === 'pending').length,
        averageDuration: 0,
        qualityMetrics: {
          averageQualityScore: 0,
          averageSurpriseFactor: 0,
          predictionAccuracy: 0
        }
      };

      const completedMatches = matches.filter(m => m.status === 'completed');
      
      if (completedMatches.length > 0) {
        // Calculate average duration
        const durationsSum = completedMatches
          .filter(m => m.totalDuration)
          .reduce((sum, m) => sum + m.totalDuration, 0);
        const matchesWithDuration = completedMatches.filter(m => m.totalDuration).length;
        
        if (matchesWithDuration > 0) {
          stats.averageDuration = durationsSum / matchesWithDuration;
        }

        // Calculate quality metrics
        let qualitySum = 0, surpriseSum = 0, correctPredictions = 0;
        let qualityCount = 0, surpriseCount = 0, predictionCount = 0;

        completedMatches.forEach(match => {
          if (match.matchmakingData) {
            if (match.matchmakingData.qualityScore) {
              qualitySum += match.matchmakingData.qualityScore;
              qualityCount++;
            }
            if (match.matchmakingData.surpriseFactor) {
              surpriseSum += match.matchmakingData.surpriseFactor;
              surpriseCount++;
            }
            if (match.matchmakingData.predictedWinProbability !== undefined && 
                match.matchmakingData.actualOutcome !== undefined) {
              const predicted = match.matchmakingData.predictedWinProbability > 0.5 ? 1 : 0;
              const actual = match.matchmakingData.actualOutcome > 0.5 ? 1 : 0;
              if (predicted === actual) correctPredictions++;
              predictionCount++;
            }
          }
        });

        if (qualityCount > 0) {
          stats.qualityMetrics.averageQualityScore = qualitySum / qualityCount;
        }
        if (surpriseCount > 0) {
          stats.qualityMetrics.averageSurpriseFactor = surpriseSum / surpriseCount;
        }
        if (predictionCount > 0) {
          stats.qualityMetrics.predictionAccuracy = correctPredictions / predictionCount;
        }
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching match statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching match statistics',
        error: error.message
      });
    }
  }
}

module.exports = new MatchController();