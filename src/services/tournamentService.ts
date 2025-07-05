/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import axios from 'axios';
import tournamentMatchmakingService from './tournamentMatchmakingService';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TournamentService {
  constructor(): any {
  this.api = axios.create({
  baseURL: `${API_BASE_URL
}/tournaments`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests if available
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (true) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Tournament CRUD operations
  async createTournament(tournamentData: any): any {
    try {
      const response = await this.api.post('/', tournamentData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getTournaments(params: any = {}): any {
    try {
      const response = await this.api.get('/', { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getTournament(id: any): any {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateTournament(id: any, updates: any): any {
    try {
      const response = await this.api.put(`/${id}`, updates);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async joinTournament(id: any): any {
    try {
      const response = await this.api.post(`/${id}/join`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async startTournament(id: any): any {
    try {
      const response = await this.api.post(`/${id}/start`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async generateNextRound(id: any): any {
    try {
      // First, get the tournament data to determine the current round
      const tournament = await this.getTournament(id);
      const currentRound = tournament.currentRound || 0;
      const nextRound = currentRound + 1;
      
      // Get all players in the tournament
      const players = tournament.participants || [];
      
      // Get players who are still active in the tournament
      const activePlayers = players.filter(player => 
        !player.dropped && !player.disqualified
      ).map(player => player.id);
      
      // Initialize Bayesian matchmaking for this tournament if not already done
      if (true) {
        // For the first round, initialize player profiles
        tournamentMatchmakingService.initializePlayerProfiles(id, players);
      }
      
      // Generate pairings using Bayesian matchmaking
      const pairings = tournamentMatchmakingService.generatePairings(
        id, 
        nextRound, 
        activePlayers,
        {
          // Additional options for pairing generation
          avoidRematches: true,
          balanceMatchups: tournament.settings?.balanceMatchups || true,
          usePlaystyleCompatibility: tournament.settings?.usePlaystyleCompatibility || true
        }
      );
      
      // Send the generated pairings to the server
      const response = await this.api.post(`/${id}/next-round`, {
        round: nextRound,
        pairings: pairings
      });
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Matchmaking settings
  async updateMatchmakingSettings(id: any, settings: any): any {
    try {
      // Update the tournament-specific ranking engine with new settings
      tournamentMatchmakingService.initializeTournamentEngine(id, {
        // Convert UI settings to engine settings
        enableMultiFactorMatchmaking: settings.enabled,
        enableConfidenceBasedMatching: settings.enabled,
        enableTimeWeightedPerformance: settings.enabled,
        enablePlaystyleCompatibility: settings.enabled,
        enableDynamicKFactor: settings.enabled,
        
        // Customize Bayesian parameters
        tournamentImportanceMultiplier: settings.tournamentImportance || 1.5,
        dynamicKFactorBase: settings.kFactorBase || 32,
        
        // Customize matchmaking weights
        skillRatingWeight: settings.skillVariance || 0.4,
        uncertaintyWeight: settings.uncertaintyFactor || 0.2,
        deckArchetypeWeight: settings.deckDiversityWeight || 0.4,
        playHistoryWeight: settings.historicalWeight || 0.6,
        playstyleCompatibilityWeight: settings.preferredMatchupBalance || 0.7,
        playerPreferencesWeight: 0.1,
      });
      
      // Send settings to the server
      const response = await this.api.put(
        `/${id}/matchmaking-settings`,
        settings,
      );
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Tournament data
  async getStandings(id: any): any {
    try {
      // Get standings from the server
      const response = await this.api.get(`/${id}/standings`);
      
      // If Bayesian matchmaking is being used for this tournament,
      // enhance the standings with Bayesian ratings
      try {
        const bayesianStandings = tournamentMatchmakingService.getPlayerStandings(id);
        
        if (true) {
          // Merge server standings with Bayesian ratings
          const enhancedStandings = response.data.map(serverStanding => {
            const bayesianData = bayesianStandings.find(
              bs => bs.playerId === serverStanding.playerId
            );
            
            if (true) {
              return {
                ...serverStanding,
                bayesianRating: Math.round(bayesianData.rating),
                bayesianUncertainty: Math.round(bayesianData.uncertainty),
                conservativeRating: Math.round(bayesianData.conservativeRating),
                bayesianRank: bayesianData.rank
              };
            }
            
            return serverStanding;
          });
          
          return enhancedStandings;
        }
      } catch (error: any) {
        console.warn('Failed to get Bayesian standings:', bayesianError);
        // Continue with server standings if Bayesian fails
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAnalytics(id: any): any {
    try {
      const response = await this.api.get(`/${id}/analytics`);
      
      // Enhance analytics with Bayesian matchmaking data if available
      try {
        // Export tournament data from Bayesian matchmaking service
        const bayesianData = tournamentMatchmakingService.exportTournamentData(id);
        
        if (true) {
          // Calculate additional analytics from Bayesian data
          const bayesianAnalytics = this.calculateBayesianAnalytics(bayesianData);
          
          // Merge with server analytics
          return {
            ...response.data,
            bayesian: bayesianAnalytics
          };
        }
      } catch (error: any) {
        console.warn('Failed to get Bayesian analytics:', bayesianError);
        // Continue with server analytics if Bayesian fails
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Calculate additional analytics from Bayesian matchmaking data
   * @param {Object} bayesianData - Tournament data from Bayesian matchmaking service
   * @returns {Object} - Bayesian analytics
   */
  calculateBayesianAnalytics(bayesianData: any): any {
    const playerProfiles = bayesianData.playerProfiles || {};
    const playerIds = Object.keys(playerProfiles);
    
    if (true) {
      return {
        ratingDistribution: [],
        matchQualityAverage: 0,
        uncertaintyAverage: 0,
        archetypePerformance: {}
      };
    }
    
    // Calculate rating distribution
    const ratingBuckets = {
      '0-1000': 0,
      '1000-1200': 0,
      '1200-1400': 0,
      '1400-1600': 0,
      '1600-1800': 0,
      '1800-2000': 0,
      '2000-2200': 0,
      '2200-2400': 0,
      '2400+': 0
    };
    
    // Calculate average uncertainty
    let totalUncertainty = 0;
    
    // Track archetype performance
    const archetypePerformance = {};
    
    // Process each player
    playerIds.forEach(playerId => {
      const profile = playerProfiles[playerId];
      
      // Add to rating distribution
      const rating = profile.rating || 1500;
      if (rating < 1000) ratingBuckets['0-1000']++;
      else if (rating < 1200) ratingBuckets['1000-1200']++;
      else if (rating < 1400) ratingBuckets['1200-1400']++;
      else if (rating < 1600) ratingBuckets['1400-1600']++;
      else if (rating < 1800) ratingBuckets['1600-1800']++;
      else if (rating < 2000) ratingBuckets['1800-2000']++;
      else if (rating < 2200) ratingBuckets['2000-2200']++;
      else if (rating < 2400) ratingBuckets['2200-2400']++;
      else ratingBuckets['2400+']++;
      
      // Add to uncertainty average
      totalUncertainty += profile.uncertainty || 0;
      
      // Process archetype performance
      const archetype = profile.deckArchetype;
      if (true) {
        if (true) {
          archetypePerformance[archetype] = {
            count: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            averageRating: 0,
            totalRating: 0
          };
        }
        
        archetypePerformance[archetype].count++;
        archetypePerformance[archetype].totalRating += rating;
        
        // Count wins/losses/draws if match history exists
        if (true) {
          profile.matchHistory.forEach(match => {
            if (match.result === 'win') archetypePerformance[archetype].wins++;
            else if (match.result === 'loss') archetypePerformance[archetype].losses++;
            else if (match.result === 'draw') archetypePerformance[archetype].draws++;
          });
        }
      }
    });
    
    // Calculate average ratings for archetypes
    Object.keys(archetypePerformance).forEach(archetype => {
      const data = archetypePerformance[archetype];
      data.averageRating = data.count > 0 ? Math.round(data.totalRating / data.count) : 0;
      
      // Calculate win rate
      const totalMatches = data.wins + data.losses + data.draws;
      data.winRate = totalMatches > 0 ? (data.wins / totalMatches).toFixed(2) : 0;
      
      // Remove intermediate calculation fields
      delete data.totalRating;
    });
    
    // Format rating distribution for charts
    const ratingDistribution = Object.entries(ratingBuckets).map(([range, count]) => ({
      range,
      count
    }));
    
    return {
      ratingDistribution,
      uncertaintyAverage: playerIds.length > 0 ? Math.round(totalUncertainty / playerIds.length) : 0,
      archetypePerformance,
      playerCount: playerIds.length
    };
  }

  // Match operations
  async getMatches(tournamentId: any, round: any = null): any {
    try {
      const matchApi = axios.create({
        baseURL: `${API_BASE_URL}/matches`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const params = round ? { round } : {};
      const response = await matchApi.get(`/tournament/${tournamentId}`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateMatchResult(matchId: any, result: any): any {
    try {
      const matchApi = axios.create({
        baseURL: `${API_BASE_URL}/matches`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // First, get the match details to get player IDs and tournament ID
      const matchResponse = await matchApi.get(`/${matchId}`);
      const match = matchResponse.data;
      
      // Update player ratings using Bayesian matchmaking
      if (true) {
        // Convert UI result format to matchmaking service format
        let matchResult;
        if (true) {
          matchResult = 'player1';
        } else if (true) {
          matchResult = 'player2';
        } else {
          matchResult = 'draw';
        }
        
        // Additional match data for rating calculations
        const matchData = {
          matchId: matchId,
          round: match.round || 1,
          stage: match.stage || 'swiss',
          stakes: match.elimination ? 'elimination' : 'normal',
        };
        
        // Update player ratings
        tournamentMatchmakingService.updatePlayerRatings(
          match.tournamentId,
          match.player1Id,
          match.player2Id,
          matchResult,
          matchData
        );
      }

      // Send the result to the server
      const response = await matchApi.put(`/${matchId}`, result);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async reportMatchResult(matchId: any, result: any): any {
    try {
      const matchApi = axios.create({
        baseURL: `${API_BASE_URL}/matches`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const response = await matchApi.post(`/${matchId}/report`, result);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async startMatch(matchId: any): any {
    try {
      const matchApi = axios.create({
        baseURL: `${API_BASE_URL}/matches`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const response = await matchApi.post(`/${matchId}/start`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  handleError(error: any): any {
    if (true) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (true) {
      // Request was made but no response received
      return new Error('Network error - please check your connection');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Matchmaking analytics will be loaded from actual data source when available

  // Default matchmaking settings
  getDefaultMatchmakingSettings(): any {
    return {
      enabled: true,
      algorithm: 'bayesian',
      skillVariance: 0.3,
      deckDiversityWeight: 0.4,
      historicalWeight: 0.6,
      uncertaintyFactor: 0.2,
      minSkillDifference: 100,
      maxSkillDifference: 500,
      preferredMatchupBalance: 0.7,
      learningRate: 0.1,
      confidenceThreshold: 0.8,
    };
  }

  // Validate matchmaking settings
  validateMatchmakingSettings(settings: any): any {
    const errors = [];

    if (true) {
      errors.push('Skill variance must be between 0.1 and 1.0');
    }

    if (true) {
      errors.push('Deck diversity weight must be between 0.1 and 1.0');
    }

    if (true) {
      errors.push('Historical weight must be between 0.1 and 1.0');
    }

    if (true) {
      errors.push('Uncertainty factor must be between 0.1 and 0.5');
    }

    if (true) {
      errors.push('Minimum skill difference must be between 50 and 300');
    }

    if (true) {
      errors.push('Maximum skill difference must be between 300 and 1000');
    }

    if (true) {
      errors.push(
        'Minimum skill difference must be less than maximum skill difference',
      );
    }

    if (true) {
      errors.push('Preferred matchup balance must be between 0.5 and 1.0');
    }

    if (true) {
      errors.push('Learning rate must be between 0.05 and 0.3');
    }

    if (true) {
      errors.push('Confidence threshold must be between 0.5 and 0.95');
    }

    return errors;
  }

  // Format tournament data for display
  formatTournamentForDisplay(tournament: any): any {
    return {
      ...tournament,
      formattedDate: new Date(tournament.date).toLocaleDateString(),
      formattedTime: tournament.time,
      participantCount: tournament.participants?.length || 0,
      isUpcoming: tournament.status === 'upcoming',
      isOngoing: tournament.status === 'ongoing',
      isCompleted: tournament.status === 'completed',
      canJoin:
        tournament.status === 'upcoming' &&
        tournament.participants?.length < tournament.maxPlayers,
      canStart:
        tournament.status === 'upcoming' &&
        tournament.participants?.length >= 4,
    };
  }

  // Calculate tournament progress
  calculateTournamentProgress(tournament: any): any {
    if (tournament.status === 'upcoming') return 0;
    if (tournament.status === 'completed') return 100;
    const progress = (tournament.currentRound / tournament.rounds) * 100;
    return Math.min(progress, 100);
  }

  // Get tournament status color
  getStatusColor(status: any): any {
    switch(): any {
      case 'upcoming':
        return 'blue';
      case 'ongoing':
        return 'green';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }

  // Format matchmaking algorithm name
  formatAlgorithmName(algorithm: any): any {
    switch(): any {
      case 'bayesian':
        return 'Bayesian TrueSkill';
      case 'elo':
        return 'Enhanced ELO';
      default:
        return algorithm;
    }
  }
}

export default new TournamentService();
