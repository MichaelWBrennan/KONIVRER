import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingEngine } from '../engine/RankingEngine';

// Advanced analytics and ML utilities
class AdvancedAnalytics {
  constructor() {
    this.metaBreakdown = {};
    this.playerPerformance = {};
    this.matchupMatrix = {};
    this.confidenceIntervals = {};
    this.trendData = {};
  }

  // Analyze meta breakdown by deck archetype
  analyzeMetaBreakdown(matches, players) {
    const deckCounts = {};
    const deckWins = {};
    const deckLosses = {};
    let totalDecks = 0;

    // Count deck occurrences and results
    matches.forEach(match => {
      if (!match.player1Deck || !match.player2Deck) return;
      
      // Count player 1 deck
      deckCounts[match.player1Deck] = (deckCounts[match.player1Deck] || 0) + 1;
      totalDecks++;
      
      // Count player 2 deck
      deckCounts[match.player2Deck] = (deckCounts[match.player2Deck] || 0) + 1;
      totalDecks++;
      
      // Track wins/losses
      if (match.result === 'player1') {
        deckWins[match.player1Deck] = (deckWins[match.player1Deck] || 0) + 1;
        deckLosses[match.player2Deck] = (deckLosses[match.player2Deck] || 0) + 1;
      } else if (match.result === 'player2') {
        deckWins[match.player2Deck] = (deckWins[match.player2Deck] || 0) + 1;
        deckLosses[match.player1Deck] = (deckLosses[match.player1Deck] || 0) + 1;
      }
    });

    // Calculate meta percentages and win rates
    const metaBreakdown = Object.keys(deckCounts).map(deck => {
      const count = deckCounts[deck];
      const wins = deckWins[deck] || 0;
      const losses = deckLosses[deck] || 0;
      const metaPercentage = totalDecks > 0 ? (count / totalDecks) * 100 : 0;
      const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;
      
      return {
        archetype: deck,
        count,
        metaPercentage,
        wins,
        losses,
        winRate,
        adjustedWinRate: this.calculateBayesianWinRate(wins, losses),
        trend: this.calculateTrend(deck, matches)
      };
    });

    // Sort by meta percentage
    metaBreakdown.sort((a, b) => b.metaPercentage - a.metaPercentage);
    
    this.metaBreakdown = metaBreakdown;
    return metaBreakdown;
  }

  // Calculate Bayesian-adjusted win rate to account for small sample sizes
  calculateBayesianWinRate(wins, losses) {
    const alpha = 1; // Prior alpha (pseudo-wins)
    const beta = 1;  // Prior beta (pseudo-losses)
    
    return ((wins + alpha) / (wins + losses + alpha + beta)) * 100;
  }

  // Calculate trend over time for a deck
  calculateTrend(deck, matches) {
    // Sort matches by date
    const deckMatches = matches
      .filter(m => m.player1Deck === deck || m.player2Deck === deck)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (deckMatches.length < 5) return 'neutral'; // Not enough data
    
    // Split into two halves to compare performance
    const halfIndex = Math.floor(deckMatches.length / 2);
    const firstHalf = deckMatches.slice(0, halfIndex);
    const secondHalf = deckMatches.slice(halfIndex);
    
    // Calculate win rates for both halves
    const firstHalfWins = firstHalf.filter(m => 
      (m.player1Deck === deck && m.result === 'player1') || 
      (m.player2Deck === deck && m.result === 'player2')
    ).length;
    
    const secondHalfWins = secondHalf.filter(m => 
      (m.player1Deck === deck && m.result === 'player1') || 
      (m.player2Deck === deck && m.result === 'player2')
    ).length;
    
    const firstHalfWinRate = firstHalfWins / firstHalf.length;
    const secondHalfWinRate = secondHalfWins / secondHalf.length;
    
    // Determine trend
    const difference = secondHalfWinRate - firstHalfWinRate;
    if (difference > 0.1) return 'rising';
    if (difference < -0.1) return 'falling';
    return 'neutral';
  }

  // Generate matchup matrix between archetypes
  generateMatchupMatrix(matches) {
    const matchups = {};
    const totalMatchups = {};
    
    // Count wins for each matchup
    matches.forEach(match => {
      if (!match.player1Deck || !match.player2Deck || !match.result) return;
      
      const deck1 = match.player1Deck;
      const deck2 = match.player2Deck;
      
      // Initialize matchup counters if needed
      if (!matchups[deck1]) matchups[deck1] = {};
      if (!matchups[deck2]) matchups[deck2] = {};
      if (!totalMatchups[deck1]) totalMatchups[deck1] = {};
      if (!totalMatchups[deck2]) totalMatchups[deck2] = {};
      
      if (!matchups[deck1][deck2]) matchups[deck1][deck2] = 0;
      if (!matchups[deck2][deck1]) matchups[deck2][deck1] = 0;
      if (!totalMatchups[deck1][deck2]) totalMatchups[deck1][deck2] = 0;
      if (!totalMatchups[deck2][deck1]) totalMatchups[deck2][deck1] = 0;
      
      // Increment win counters based on result
      if (match.result === 'player1') {
        matchups[deck1][deck2]++;
      } else if (match.result === 'player2') {
        matchups[deck2][deck1]++;
      }
      
      // Increment total matchup counters
      totalMatchups[deck1][deck2]++;
      totalMatchups[deck2][deck1]++;
    });
    
    // Calculate win percentages
    const archetypes = Object.keys(matchups);
    const matrix = {};
    
    archetypes.forEach(deck1 => {
      matrix[deck1] = {};
      
      archetypes.forEach(deck2 => {
        if (deck1 === deck2) {
          matrix[deck1][deck2] = 50; // Mirror match is always 50%
        } else {
          const wins = matchups[deck1][deck2] || 0;
          const total = totalMatchups[deck1][deck2] || 0;
          
          // Use Bayesian adjustment for small sample sizes
          matrix[deck1][deck2] = this.calculateBayesianWinRate(wins, total - wins);
        }
      });
    });
    
    this.matchupMatrix = matrix;
    return matrix;
  }

  // Analyze player performance and generate insights
  analyzePlayerPerformance(players, matches) {
    const performance = {};
    
    players.forEach(player => {
      const playerMatches = matches.filter(m => 
        m.player1Id === player.id || m.player2Id === player.id
      );
      
      if (playerMatches.length === 0) return;
      
      // Calculate basic stats
      const wins = playerMatches.filter(m => 
        (m.player1Id === player.id && m.result === 'player1') || 
        (m.player2Id === player.id && m.result === 'player2')
      ).length;
      
      const losses = playerMatches.filter(m => 
        (m.player1Id === player.id && m.result === 'player2') || 
        (m.player2Id === player.id && m.result === 'player1')
      ).length;
      
      const draws = playerMatches.filter(m => m.result === 'draw').length;
      
      // Calculate advanced stats
      const winRate = (wins / playerMatches.length) * 100;
      const consistency = this.calculateConsistency(playerMatches, player.id);
      const improvementRate = this.calculateImprovementRate(playerMatches, player.id);
      const preferredArchetypes = this.getPreferredArchetypes(playerMatches, player.id);
      const bestMatchups = this.getBestMatchups(playerMatches, player.id);
      const worstMatchups = this.getWorstMatchups(playerMatches, player.id);
      
      // Store performance data
      performance[player.id] = {
        id: player.id,
        name: player.name,
        matches: playerMatches.length,
        wins,
        losses,
        draws,
        winRate,
        consistency,
        improvementRate,
        preferredArchetypes,
        bestMatchups,
        worstMatchups,
        rating: player.rating,
        uncertainty: player.uncertainty,
        conservativeRating: player.conservativeRating
      };
    });
    
    this.playerPerformance = performance;
    return performance;
  }

  // Calculate player consistency (lower standard deviation = more consistent)
  calculateConsistency(matches, playerId) {
    if (matches.length < 5) return 50; // Default for small sample size
    
    // Extract match results as win (1) or loss (0)
    const results = matches.map(match => {
      if ((match.player1Id === playerId && match.result === 'player1') ||
          (match.player2Id === playerId && match.result === 'player2')) {
        return 1; // Win
      } else if (match.result === 'draw') {
        return 0.5; // Draw
      } else {
        return 0; // Loss
      }
    });
    
    // Calculate standard deviation
    const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
    const squaredDiffs = results.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / results.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to consistency score (0-100, higher is more consistent)
    // Max standard deviation for binary outcomes is 0.5, so normalize
    const consistencyScore = 100 - (stdDev / 0.5) * 100;
    return Math.max(0, Math.min(100, consistencyScore));
  }

  // Calculate improvement rate over time
  calculateImprovementRate(matches, playerId) {
    if (matches.length < 10) return 0; // Not enough data
    
    // Sort matches by date
    const sortedMatches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Split into three segments to analyze trend
    const segmentSize = Math.floor(sortedMatches.length / 3);
    const segments = [
      sortedMatches.slice(0, segmentSize),
      sortedMatches.slice(segmentSize, segmentSize * 2),
      sortedMatches.slice(segmentSize * 2)
    ];
    
    // Calculate win rate for each segment
    const winRates = segments.map(segment => {
      const wins = segment.filter(m => 
        (m.player1Id === playerId && m.result === 'player1') || 
        (m.player2Id === playerId && m.result === 'player2')
      ).length;
      
      return segment.length > 0 ? wins / segment.length : 0;
    });
    
    // Calculate linear regression slope
    const x = [0, 1, 2];
    const y = winRates;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Convert slope to improvement rate (-100 to 100)
    return Math.max(-100, Math.min(100, slope * 200));
  }

  // Get player's preferred archetypes
  getPreferredArchetypes(matches, playerId) {
    const archetypeCounts = {};
    const archetypeWins = {};
    
    matches.forEach(match => {
      let deck = null;
      
      if (match.player1Id === playerId && match.player1Deck) {
        deck = match.player1Deck;
        if (match.result === 'player1') {
          archetypeWins[deck] = (archetypeWins[deck] || 0) + 1;
        }
      } else if (match.player2Id === playerId && match.player2Deck) {
        deck = match.player2Deck;
        if (match.result === 'player2') {
          archetypeWins[deck] = (archetypeWins[deck] || 0) + 1;
        }
      }
      
      if (deck) {
        archetypeCounts[deck] = (archetypeCounts[deck] || 0) + 1;
      }
    });
    
    // Calculate win rates and sort by usage
    const archetypes = Object.keys(archetypeCounts).map(archetype => {
      const count = archetypeCounts[archetype];
      const wins = archetypeWins[archetype] || 0;
      const winRate = count > 0 ? (wins / count) * 100 : 0;
      
      return {
        archetype,
        count,
        percentage: (count / matches.length) * 100,
        wins,
        winRate
      };
    });
    
    // Sort by usage
    archetypes.sort((a, b) => b.count - a.count);
    
    return archetypes.slice(0, 3); // Return top 3
  }

  // Get player's best matchups
  getBestMatchups(matches, playerId) {
    const matchupCounts = {};
    const matchupWins = {};
    
    matches.forEach(match => {
      let opponentDeck = null;
      let playerDeck = null;
      
      if (match.player1Id === playerId) {
        playerDeck = match.player1Deck;
        opponentDeck = match.player2Deck;
        if (match.result === 'player1') {
          matchupWins[opponentDeck] = (matchupWins[opponentDeck] || 0) + 1;
        }
      } else if (match.player2Id === playerId) {
        playerDeck = match.player2Deck;
        opponentDeck = match.player1Deck;
        if (match.result === 'player2') {
          matchupWins[opponentDeck] = (matchupWins[opponentDeck] || 0) + 1;
        }
      }
      
      if (opponentDeck && playerDeck) {
        if (!matchupCounts[opponentDeck]) matchupCounts[opponentDeck] = 0;
        matchupCounts[opponentDeck]++;
      }
    });
    
    // Calculate win rates and sort
    const matchups = Object.keys(matchupCounts)
      .filter(deck => matchupCounts[deck] >= 3) // Minimum sample size
      .map(deck => {
        const count = matchupCounts[deck];
        const wins = matchupWins[deck] || 0;
        const winRate = (wins / count) * 100;
        
        return { deck, count, wins, winRate };
      });
    
    // Sort by win rate
    matchups.sort((a, b) => b.winRate - a.winRate);
    
    return matchups.slice(0, 3); // Return top 3
  }

  // Get player's worst matchups
  getWorstMatchups(matches, playerId) {
    const matchupCounts = {};
    const matchupWins = {};
    
    matches.forEach(match => {
      let opponentDeck = null;
      let playerDeck = null;
      
      if (match.player1Id === playerId) {
        playerDeck = match.player1Deck;
        opponentDeck = match.player2Deck;
        if (match.result === 'player1') {
          matchupWins[opponentDeck] = (matchupWins[opponentDeck] || 0) + 1;
        }
      } else if (match.player2Id === playerId) {
        playerDeck = match.player2Deck;
        opponentDeck = match.player1Deck;
        if (match.result === 'player2') {
          matchupWins[opponentDeck] = (matchupWins[opponentDeck] || 0) + 1;
        }
      }
      
      if (opponentDeck && playerDeck) {
        if (!matchupCounts[opponentDeck]) matchupCounts[opponentDeck] = 0;
        matchupCounts[opponentDeck]++;
      }
    });
    
    // Calculate win rates and sort
    const matchups = Object.keys(matchupCounts)
      .filter(deck => matchupCounts[deck] >= 3) // Minimum sample size
      .map(deck => {
        const count = matchupCounts[deck];
        const wins = matchupWins[deck] || 0;
        const winRate = (wins / count) * 100;
        
        return { deck, count, wins, winRate };
      });
    
    // Sort by win rate (ascending)
    matchups.sort((a, b) => a.winRate - b.winRate);
    
    return matchups.slice(0, 3); // Return bottom 3
  }

  // Predict meta evolution based on current trends
  predictMetaEvolution(currentMeta) {
    if (!currentMeta || currentMeta.length === 0) return [];
    
    // Simple prediction model based on current trends
    const prediction = currentMeta.map(deck => {
      let predictedChange = 0;
      
      // Decks with high win rates tend to increase in popularity
      if (deck.adjustedWinRate > 55) {
        predictedChange += (deck.adjustedWinRate - 55) * 0.2;
      } else if (deck.adjustedWinRate < 45) {
        predictedChange -= (45 - deck.adjustedWinRate) * 0.2;
      }
      
      // Trending decks continue their trend
      if (deck.trend === 'rising') {
        predictedChange += 2;
      } else if (deck.trend === 'falling') {
        predictedChange -= 2;
      }
      
      // Very popular decks tend to attract counter-strategies
      if (deck.metaPercentage > 15) {
        predictedChange -= (deck.metaPercentage - 15) * 0.1;
      }
      
      return {
        archetype: deck.archetype,
        currentPercentage: deck.metaPercentage,
        predictedPercentage: Math.max(0, deck.metaPercentage + predictedChange),
        predictedChange,
        reason: this.getPredictionReason(deck, predictedChange)
      };
    });
    
    // Sort by predicted percentage
    prediction.sort((a, b) => b.predictedPercentage - a.predictedPercentage);
    
    return prediction;
  }

  // Generate explanation for meta prediction
  getPredictionReason(deck, change) {
    if (change > 2) {
      if (deck.adjustedWinRate > 55) {
        return "High win rate driving increased adoption";
      } else if (deck.trend === 'rising') {
        return "Strong recent performance trend continuing";
      } else {
        return "Favorable positioning against popular decks";
      }
    } else if (change < -2) {
      if (deck.adjustedWinRate < 45) {
        return "Poor win rate causing players to switch decks";
      } else if (deck.trend === 'falling') {
        return "Declining performance trend continuing";
      } else if (deck.metaPercentage > 15) {
        return "High meta share attracting counter-strategies";
      } else {
        return "Unfavorable matchups against rising decks";
      }
    } else {
      return "Stable position in the meta";
    }
  }

  // Generate tournament recommendations based on player pool
  generateTournamentRecommendations(players, matches) {
    if (players.length < 4) {
      return {
        recommendedFormat: 'roundRobin',
        reason: 'Small player pool is ideal for round robin format',
        expectedDuration: players.length * 30, // minutes
        optimalRounds: 1
      };
    }
    
    // Calculate skill disparity
    const ratings = players.map(p => p.rating);
    const maxRating = Math.max(...ratings);
    const minRating = Math.min(...ratings);
    const ratingRange = maxRating - minRating;
    
    // Calculate player experience
    const avgMatches = players.reduce((sum, p) => {
      const playerMatches = matches.filter(m => 
        m.player1Id === p.id || m.player2Id === p.id
      ).length;
      return sum + playerMatches;
    }, 0) / players.length;
    
    // Make recommendations
    if (players.length >= 32) {
      return {
        recommendedFormat: 'swiss',
        reason: 'Large player pool ideal for Swiss format',
        expectedDuration: Math.ceil(Math.log2(players.length)) * 45, // minutes per round
        optimalRounds: Math.ceil(Math.log2(players.length))
      };
    } else if (players.length >= 16) {
      if (ratingRange > 300) {
        return {
          recommendedFormat: 'swiss',
          reason: 'Wide skill range benefits from Swiss pairing',
          expectedDuration: Math.ceil(Math.log2(players.length)) * 45,
          optimalRounds: Math.ceil(Math.log2(players.length))
        };
      } else {
        return {
          recommendedFormat: 'doubleElimination',
          reason: 'Competitive field with similar skill levels',
          expectedDuration: Math.ceil(Math.log2(players.length) * 2) * 40,
          optimalRounds: Math.ceil(Math.log2(players.length) * 2)
        };
      }
    } else if (players.length >= 8) {
      if (avgMatches < 10) {
        return {
          recommendedFormat: 'swiss',
          reason: 'Less experienced players benefit from playing more matches',
          expectedDuration: 4 * 40, // 4 rounds
          optimalRounds: 4
        };
      } else {
        return {
          recommendedFormat: 'doubleElimination',
          reason: 'Experienced players in a medium-sized tournament',
          expectedDuration: 6 * 35, // 6 rounds
          optimalRounds: 6
        };
      }
    } else {
      // 4-7 players
      return {
        recommendedFormat: 'roundRobin',
        reason: 'Small player pool allows everyone to play against each other',
        expectedDuration: players.length * 35,
        optimalRounds: players.length - 1
      };
    }
  }
};

const PhysicalMatchmakingContext = createContext();

export const usePhysicalMatchmaking = () => {
  const context = useContext(PhysicalMatchmakingContext);
  if (!context) {
    throw new Error('usePhysicalMatchmaking must be used within a PhysicalMatchmakingProvider');
  }
  return context;
};

export const PhysicalMatchmakingProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const [rankingEngine] = useState(() => new RankingEngine());
  const [analytics] = useState(() => new AdvancedAnalytics());
  const navigate = useNavigate();

  // Load data from localStorage on initial load
  useEffect(() => {
    loadData();
    
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveData();
  }, [players, tournaments, matches]);

  const loadData = () => {
    try {
      const savedPlayers = JSON.parse(localStorage.getItem('konivrer_players') || '[]');
      const savedTournaments = JSON.parse(localStorage.getItem('konivrer_tournaments') || '[]');
      const savedMatches = JSON.parse(localStorage.getItem('konivrer_matches') || '[]');
      
      setPlayers(savedPlayers);
      setTournaments(savedTournaments);
      setMatches(savedMatches);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };

  const saveData = () => {
    try {
      localStorage.setItem('konivrer_players', JSON.stringify(players));
      localStorage.setItem('konivrer_tournaments', JSON.stringify(tournaments));
      localStorage.setItem('konivrer_matches', JSON.stringify(matches));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  // Player management
  const addPlayer = (playerData) => {
    const newPlayer = {
      id: `player_${Date.now()}`,
      ...playerData,
      rating: parseInt(playerData.rating || rankingEngine.bayesianParams.INITIAL_RATING),
      uncertainty: parseInt(playerData.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY),
      conservativeRating: rankingEngine.getConservativeRating(
        parseInt(playerData.rating || rankingEngine.bayesianParams.INITIAL_RATING),
        parseInt(playerData.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY)
      ),
      tier: playerData.tier || 'bronze',
      division: parseInt(playerData.division || 1),
      wins: parseInt(playerData.wins || 0),
      losses: parseInt(playerData.losses || 0),
      draws: parseInt(playerData.draws || 0),
      deckArchetypes: playerData.deckArchetypes || [],
      matchHistory: playerData.matchHistory || [],
      createdAt: new Date()
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    return newPlayer;
  };

  const updatePlayer = (playerId, playerData) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, ...playerData } 
          : player
      )
    );
  };

  const deletePlayer = (playerId) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };
  
  // Bayesian matchmaking functions
  const calculateMatchQuality = (player1Id, player2Id) => {
    const player1 = players.find(p => p.id === player1Id);
    const player2 = players.find(p => p.id === player2Id);
    
    if (!player1 || !player2) return { score: 0, winProbability: 0.5, skillDifference: 0 };
    
    const winProbability = rankingEngine.calculateWinProbability(
      player1.rating, 
      player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY, 
      player2.rating, 
      player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY
    );
    
    const skillDifference = Math.abs(player1.rating - player2.rating);
    const uncertaintyFactor = ((player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY) + 
                              (player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY)) / 2;
    
    // Calculate match quality (1.0 = perfect match, 0.0 = terrible match)
    // Ideal match has similar skill and low uncertainty
    const skillMatchScore = Math.max(0, 1 - (skillDifference / 1000));
    const uncertaintyScore = Math.max(0, 1 - (uncertaintyFactor / 500));
    const balanceScore = 1 - Math.abs(winProbability - 0.5) * 2;
    
    const score = (skillMatchScore * 0.4) + (uncertaintyScore * 0.3) + (balanceScore * 0.3);
    
    return {
      score,
      winProbability,
      skillDifference,
      player1Rating: player1.rating,
      player2Rating: player2.rating,
      player1Uncertainty: player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY,
      player2Uncertainty: player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY
    };
  };
  
  const recordMatchResult = (player1Id, player2Id, result, matchDetails = {}) => {
    const player1 = players.find(p => p.id === player1Id);
    const player2 = players.find(p => p.id === player2Id);
    
    if (!player1 || !player2) return null;
    
    // Calculate rating updates using Bayesian TrueSkill
    const skillUpdate = rankingEngine.calculateTrueSkillUpdate(
      player1.rating,
      player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY,
      player2.rating,
      player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY,
      result === 'player1' ? 'win' : result === 'draw' ? 'draw' : 'loss'
    );
    
    // Update player1
    const updatedPlayer1 = {
      ...player1,
      rating: skillUpdate.player.newRating,
      uncertainty: skillUpdate.player.newUncertainty,
      conservativeRating: rankingEngine.getConservativeRating(
        skillUpdate.player.newRating,
        skillUpdate.player.newUncertainty
      ),
      wins: result === 'player1' ? player1.wins + 1 : player1.wins,
      losses: result === 'player2' ? player1.losses + 1 : player1.losses,
      draws: result === 'draw' ? player1.draws + 1 : player1.draws
    };
    
    // Update player2
    const updatedPlayer2 = {
      ...player2,
      rating: skillUpdate.opponent.newRating,
      uncertainty: skillUpdate.opponent.newUncertainty,
      conservativeRating: rankingEngine.getConservativeRating(
        skillUpdate.opponent.newRating,
        skillUpdate.opponent.newUncertainty
      ),
      wins: result === 'player2' ? player2.wins + 1 : player2.wins,
      losses: result === 'player1' ? player2.losses + 1 : player2.losses,
      draws: result === 'draw' ? player2.draws + 1 : player2.draws
    };
    
    // Update deck archetype performance if available
    if (matchDetails.player1Deck && matchDetails.player2Deck) {
      updatedPlayer1.deckArchetypes = updateDeckArchetype(
        updatedPlayer1.deckArchetypes || [],
        matchDetails.player1Deck,
        result === 'player1' ? 'win' : result === 'draw' ? 'draw' : 'loss'
      );
      
      updatedPlayer2.deckArchetypes = updateDeckArchetype(
        updatedPlayer2.deckArchetypes || [],
        matchDetails.player2Deck,
        result === 'player2' ? 'win' : result === 'draw' ? 'draw' : 'loss'
      );
    }
    
    // Create match record
    const match = {
      id: `match_${Date.now()}`,
      player1Id,
      player2Id,
      result,
      date: new Date().toISOString(),
      player1: {
        name: player1.name,
        oldRating: player1.rating,
        newRating: updatedPlayer1.rating,
        ratingChange: skillUpdate.player.ratingChange
      },
      player2: {
        name: player2.name,
        oldRating: player2.rating,
        newRating: updatedPlayer2.rating,
        ratingChange: skillUpdate.opponent.ratingChange
      },
      winProbability: skillUpdate.winProbability,
      surpriseFactor: skillUpdate.surpriseFactor,
      ...matchDetails
    };
    
    // Update players and add match
    setPlayers(prev => 
      prev.map(p => 
        p.id === player1Id ? updatedPlayer1 : 
        p.id === player2Id ? updatedPlayer2 : p
      )
    );
    
    setMatches(prev => [...prev, match]);
    
    return {
      match,
      player1Update: {
        oldRating: player1.rating,
        newRating: updatedPlayer1.rating,
        ratingChange: skillUpdate.player.ratingChange
      },
      player2Update: {
        oldRating: player2.rating,
        newRating: updatedPlayer2.rating,
        ratingChange: skillUpdate.opponent.ratingChange
      }
    };
  };
  
  const updateDeckArchetype = (deckArchetypes, archetype, result) => {
    const existingDeck = deckArchetypes.find(d => d.archetype === archetype);
    
    if (existingDeck) {
      return deckArchetypes.map(d => {
        if (d.archetype === archetype) {
          return {
            ...d,
            gamesPlayed: (d.gamesPlayed || 0) + 1,
            wins: result === 'win' ? (d.wins || 0) + 1 : (d.wins || 0),
            losses: result === 'loss' ? (d.losses || 0) + 1 : (d.losses || 0),
            draws: result === 'draw' ? (d.draws || 0) + 1 : (d.draws || 0),
            lastPlayed: new Date().toISOString()
          };
        }
        return d;
      });
    } else {
      return [
        ...deckArchetypes,
        {
          archetype,
          gamesPlayed: 1,
          wins: result === 'win' ? 1 : 0,
          losses: result === 'loss' ? 1 : 0,
          draws: result === 'draw' ? 1 : 0,
          lastPlayed: new Date().toISOString()
        }
      ];
    }
  };
  
  const getPlayerTier = (conservativeRating) => {
    const tiers = rankingEngine.tiers;
    for (const [tierKey, tierData] of Object.entries(tiers)) {
      const [min, max] = tierData.skillRange;
      if (conservativeRating >= min && conservativeRating <= max) {
        // Calculate division within tier
        const tierRange = max - min;
        const divisionSize = tierRange / tierData.divisions;
        const division = tierData.divisions - Math.floor((conservativeRating - min) / divisionSize);
        
        return {
          tier: tierKey,
          division: Math.max(1, Math.min(division, tierData.divisions)),
          name: tierData.name,
          color: tierData.color
        };
      }
    }
    
    // Default to bronze if no match
    return { tier: 'bronze', division: 4, name: 'Bronze', color: '#CD7F32' };
  };

  // Tournament management with Bayesian matchmaking
  const createTournament = (tournamentData) => {
    const newTournament = {
      id: `tournament_${Date.now()}`,
      ...tournamentData,
      players: tournamentData.players || [],
      matches: [],
      rounds: [],
      status: tournamentData.status || 'registration',
      createdAt: new Date(),
      useBayesianPairings: tournamentData.useBayesianPairings !== false, // Default to true
      bayesianSettings: {
        prioritizeMatchQuality: tournamentData.bayesianSettings?.prioritizeMatchQuality || 0.7,
        avoidRematches: tournamentData.bayesianSettings?.avoidRematches || 0.9,
        balanceWhiteBlack: tournamentData.bayesianSettings?.balanceWhiteBlack || 0.5
      }
    };
    
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };
  
  // Generate optimal pairings for a tournament round using Bayesian matchmaking
  const generateTournamentPairings = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return null;
    
    // Get tournament players
    const tournamentPlayers = tournament.players.map(playerId => 
      players.find(p => p.id === playerId)
    ).filter(Boolean);
    
    if (tournamentPlayers.length < 2) return [];
    
    // Different pairing strategies based on tournament type
    switch (tournament.format) {
      case 'swiss':
        return generateSwissPairings(tournament, tournamentPlayers);
      case 'singleElimination':
        return generateEliminationPairings(tournament, tournamentPlayers, false);
      case 'doubleElimination':
        return generateEliminationPairings(tournament, tournamentPlayers, true);
      case 'roundRobin':
        return generateRoundRobinPairings(tournament, tournamentPlayers);
      default:
        return generateSwissPairings(tournament, tournamentPlayers);
    }
  };
  
  // Generate Swiss tournament pairings
  const generateSwissPairings = (tournament, tournamentPlayers) => {
    // Sort players by points, then by tiebreakers
    const sortedPlayers = [...tournamentPlayers].sort((a, b) => {
      // First by points
      const aPoints = getPlayerTournamentPoints(a.id, tournament.id);
      const bPoints = getPlayerTournamentPoints(b.id, tournament.id);
      
      if (aPoints !== bPoints) return bPoints - aPoints;
      
      // Then by rating
      return b.rating - a.rating;
    });
    
    const pairings = [];
    const paired = new Set();
    
    // Try to pair players with same points first
    const pointGroups = {};
    sortedPlayers.forEach(player => {
      const points = getPlayerTournamentPoints(player.id, tournament.id);
      if (!pointGroups[points]) pointGroups[points] = [];
      pointGroups[points].push(player);
    });
    
    // For each point group, pair players optimally
    Object.values(pointGroups).forEach(group => {
      // Skip already paired players
      const availablePlayers = group.filter(p => !paired.has(p.id));
      
      // If odd number, move lowest rated player to next group
      if (availablePlayers.length % 2 === 1 && Object.keys(pointGroups).length > 1) {
        const lowestRated = availablePlayers.sort((a, b) => a.rating - b.rating)[0];
        availablePlayers.splice(availablePlayers.indexOf(lowestRated), 1);
      }
      
      // Generate all possible pairings in this group
      const possiblePairings = [];
      for (let i = 0; i < availablePlayers.length; i++) {
        for (let j = i + 1; j < availablePlayers.length; j++) {
          const player1 = availablePlayers[i];
          const player2 = availablePlayers[j];
          
          // Check if they've already played
          const alreadyPlayed = tournament.matches.some(match => 
            (match.player1Id === player1.id && match.player2Id === player2.id) ||
            (match.player1Id === player2.id && match.player2Id === player1.id)
          );
          
          // Calculate match quality
          const quality = calculateMatchQuality(player1.id, player2.id);
          
          // Score this pairing (higher is better)
          let score = quality.score;
          
          // Penalize rematches if tournament settings prioritize avoiding them
          if (alreadyPlayed) {
            score *= (1 - tournament.bayesianSettings.avoidRematches);
          }
          
          possiblePairings.push({
            player1Id: player1.id,
            player2Id: player2.id,
            quality: quality.score,
            score
          });
        }
      }
      
      // Sort by score (best pairings first)
      possiblePairings.sort((a, b) => b.score - a.score);
      
      // Create pairings greedily
      while (possiblePairings.length > 0 && paired.size < sortedPlayers.length) {
        const bestPairing = possiblePairings.shift();
        
        // Skip if either player already paired
        if (paired.has(bestPairing.player1Id) || paired.has(bestPairing.player2Id)) {
          continue;
        }
        
        // Add this pairing
        pairings.push({
          player1Id: bestPairing.player1Id,
          player2Id: bestPairing.player2Id,
          quality: bestPairing.quality,
          round: tournament.rounds.length + 1
        });
        
        paired.add(bestPairing.player1Id);
        paired.add(bestPairing.player2Id);
      }
    });
    
    // Handle odd number of players with a bye
    if (sortedPlayers.length % 2 === 1) {
      // Find player with lowest points who hasn't had a bye yet
      const playersWithoutBye = sortedPlayers
        .filter(p => !paired.has(p.id))
        .filter(p => !tournament.matches.some(m => 
          (m.player1Id === p.id || m.player2Id === p.id) && m.result === 'bye'
        ))
        .sort((a, b) => {
          const aPoints = getPlayerTournamentPoints(a.id, tournament.id);
          const bPoints = getPlayerTournamentPoints(b.id, tournament.id);
          return aPoints - bPoints;
        });
      
      if (playersWithoutBye.length > 0) {
        const byePlayer = playersWithoutBye[0];
        pairings.push({
          player1Id: byePlayer.id,
          result: 'bye',
          round: tournament.rounds.length + 1
        });
        paired.add(byePlayer.id);
      }
    }
    
    return pairings;
  };
  
  // Generate elimination tournament pairings
  const generateEliminationPairings = (tournament, tournamentPlayers, isDouble) => {
    // If this is the first round, seed players by rating
    if (tournament.rounds.length === 0) {
      const seededPlayers = [...tournamentPlayers].sort((a, b) => 
        b.conservativeRating - a.conservativeRating
      );
      
      // Create balanced bracket pairings (1 vs 16, 8 vs 9, etc.)
      const pairings = [];
      const n = seededPlayers.length;
      
      // Calculate number of byes needed to get to next power of 2
      const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(n)));
      const numByes = nextPowerOf2 - n;
      
      // Create first round pairings with byes
      for (let i = 0; i < nextPowerOf2 / 2; i++) {
        const highSeed = i;
        const lowSeed = nextPowerOf2 - 1 - i;
        
        // If lowSeed >= n, highSeed gets a bye
        if (lowSeed >= n) {
          pairings.push({
            player1Id: seededPlayers[highSeed].id,
            result: 'bye',
            round: 1,
            bracket: 'winners'
          });
        } else {
          pairings.push({
            player1Id: seededPlayers[highSeed].id,
            player2Id: seededPlayers[lowSeed].id,
            round: 1,
            bracket: 'winners'
          });
        }
      }
      
      return pairings;
    } else {
      // For subsequent rounds, pair winners against winners
      const pairings = [];
      const lastRound = tournament.rounds[tournament.rounds.length - 1];
      
      // Get winners from last round
      const winners = lastRound
        .filter(match => match.result && match.result !== 'pending')
        .map(match => {
          if (match.result === 'player1') return match.player1Id;
          if (match.result === 'player2') return match.player2Id;
          if (match.result === 'bye') return match.player1Id;
          return null;
        })
        .filter(Boolean);
      
      // Pair winners
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          pairings.push({
            player1Id: winners[i],
            player2Id: winners[i + 1],
            round: tournament.rounds.length + 1,
            bracket: 'winners'
          });
        } else {
          // Odd number of winners, give bye to the last one
          pairings.push({
            player1Id: winners[i],
            result: 'bye',
            round: tournament.rounds.length + 1,
            bracket: 'winners'
          });
        }
      }
      
      // For double elimination, also handle losers bracket
      if (isDouble) {
        // Get losers from last round
        const losers = lastRound
          .filter(match => match.result && match.result !== 'pending' && match.result !== 'bye')
          .map(match => {
            if (match.result === 'player1') return match.player2Id;
            if (match.result === 'player2') return match.player1Id;
            return null;
          })
          .filter(Boolean);
        
        // Pair losers
        for (let i = 0; i < losers.length; i += 2) {
          if (i + 1 < losers.length) {
            pairings.push({
              player1Id: losers[i],
              player2Id: losers[i + 1],
              round: tournament.rounds.length + 1,
              bracket: 'losers'
            });
          } else {
            // Odd number of losers, give bye to the last one
            pairings.push({
              player1Id: losers[i],
              result: 'bye',
              round: tournament.rounds.length + 1,
              bracket: 'losers'
            });
          }
        }
      }
      
      return pairings;
    }
  };
  
  // Generate round robin tournament pairings
  const generateRoundRobinPairings = (tournament, tournamentPlayers) => {
    const n = tournamentPlayers.length;
    const pairings = [];
    
    // Round robin algorithm (circle method)
    // For each round, player 0 stays fixed and others rotate
    const currentRound = tournament.rounds.length + 1;
    
    // Create a copy of players that we can rotate
    let rotatingPlayers = [...tournamentPlayers];
    if (n % 2 === 1) {
      // Add a dummy player for bye if odd number
      rotatingPlayers.push({ id: 'bye' });
    }
    
    // Rotate players for the current round
    // In round 1, no rotation
    // In round 2, rotate once, etc.
    for (let i = 0; i < currentRound - 1; i++) {
      rotatingPlayers = [
        rotatingPlayers[0],
        ...rotatingPlayers.slice(2),
        rotatingPlayers[1]
      ];
    }
    
    // Create pairings for this round
    for (let i = 0; i < rotatingPlayers.length / 2; i++) {
      const player1 = rotatingPlayers[i];
      const player2 = rotatingPlayers[rotatingPlayers.length - 1 - i];
      
      // Skip if either player is the dummy bye player
      if (player1.id === 'bye') {
        pairings.push({
          player1Id: player2.id,
          result: 'bye',
          round: currentRound
        });
      } else if (player2.id === 'bye') {
        pairings.push({
          player1Id: player1.id,
          result: 'bye',
          round: currentRound
        });
      } else {
        // Calculate match quality for these players
        const quality = calculateMatchQuality(player1.id, player2.id);
        
        pairings.push({
          player1Id: player1.id,
          player2Id: player2.id,
          quality: quality.score,
          round: currentRound
        });
      }
    }
    
    return pairings;
  };
  
  // Get player's points in a tournament
  const getPlayerTournamentPoints = (playerId, tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return 0;
    
    let points = 0;
    
    // Count points from matches
    tournament.matches.forEach(match => {
      if (match.player1Id === playerId) {
        if (match.result === 'player1') points += 3; // Win
        else if (match.result === 'draw') points += 1; // Draw
        else if (match.result === 'bye') points += 3; // Bye
      } else if (match.player2Id === playerId) {
        if (match.result === 'player2') points += 3; // Win
        else if (match.result === 'draw') points += 1; // Draw
      }
    });
    
    return points;
  };

  const updateTournament = (tournamentId, tournamentData) => {
    setTournaments(prev => 
      prev.map(tournament => 
        tournament.id === tournamentId 
          ? { ...tournament, ...tournamentData } 
          : tournament
      )
    );
  };

  const deleteTournament = (tournamentId) => {
    setTournaments(prev => prev.filter(tournament => tournament.id !== tournamentId));
  };

  // Match management
  const createMatch = (matchData) => {
    const newMatch = {
      id: `match_${Date.now()}`,
      ...matchData,
      status: matchData.status || 'active',
      startTime: new Date(),
      games: matchData.games || []
    };
    
    setMatches(prev => [...prev, newMatch]);
    return newMatch;
  };

  const updateMatch = (matchId, matchData) => {
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, ...matchData } 
          : match
      )
    );
  };

  const deleteMatch = (matchId) => {
    setMatches(prev => prev.filter(match => match.id !== matchId));
  };

  // QR code generation
  const generateMatchQRData = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;
    
    // Get player information
    const player1 = players.find(p => p.id === match.player1.id);
    const player2 = players.find(p => p.id === match.player2.id);
    
    return {
      type: 'match',
      id: match.id,
      player1: {
        id: match.player1.id,
        name: player1?.name || 'Unknown',
        rating: player1?.rating || 1500
      },
      player2: {
        id: match.player2.id,
        name: player2?.name || 'Unknown',
        rating: player2?.rating || 1500
      },
      format: match.format,
      maxRounds: match.maxRounds,
      status: match.status,
      timestamp: new Date().toISOString(),
      appVersion: '1.0.0'
    };
  };

  const generateTournamentQRData = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return null;
    
    // Get participants information
    const participantDetails = tournament.players?.map(playerId => {
      const player = players.find(p => p.id === playerId);
      return {
        id: playerId,
        name: player?.name || 'Unknown',
        rating: player?.rating || 1500
      };
    }) || [];
    
    return {
      type: 'tournament',
      id: tournament.id,
      name: tournament.name,
      format: tournament.format,
      tournamentType: tournament.type,
      participants: participantDetails,
      rounds: tournament.rounds || 0,
      status: tournament.status || 'registration',
      timestamp: new Date().toISOString(),
      appVersion: '1.0.0'
    };
  };

  // Data import/export
  const exportData = () => {
    const exportData = {
      players,
      tournaments,
      matches,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.players) setPlayers(data.players);
      if (data.tournaments) setTournaments(data.tournaments);
      if (data.matches) setMatches(data.matches);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  // Navigation
  const goToPhysicalMatchmaking = () => {
    navigate('/physical-matchmaking');
  };



  const value = {
    // State
    players,
    tournaments,
    matches,
    isOfflineMode,
    rankingEngine,
    
    // Player methods
    addPlayer,
    updatePlayer,
    deletePlayer,
    
    // Tournament methods
    createTournament,
    updateTournament,
    deleteTournament,
    generateTournamentPairings,
    getPlayerTournamentPoints,
    
    // Match methods
    createMatch,
    updateMatch,
    deleteMatch,
    
    // QR code methods
    generateMatchQRData,
    generateTournamentQRData,
    
    // Data methods
    exportData,
    importData,
    
    // Bayesian matchmaking methods
    calculateMatchQuality,
    recordMatchResult,
    getPlayerTier,
    
    // Navigation
    goToPhysicalMatchmaking
  };

  return (
    <PhysicalMatchmakingContext.Provider value={value}>
      {children}
    </PhysicalMatchmakingContext.Provider>
  );
};