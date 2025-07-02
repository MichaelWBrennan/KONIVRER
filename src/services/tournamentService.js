/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TournamentService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/tournaments`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests if available
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Tournament CRUD operations
  async createTournament(tournamentData) {
    try {
      const response = await this.api.post('/', tournamentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTournaments(params = {}) {
    try {
      const response = await this.api.get('/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTournament(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTournament(id, updates) {
    try {
      const response = await this.api.put(`/${id}`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async joinTournament(id) {
    try {
      const response = await this.api.post(`/${id}/join`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async startTournament(id) {
    try {
      const response = await this.api.post(`/${id}/start`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateNextRound(id) {
    try {
      const response = await this.api.post(`/${id}/next-round`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Matchmaking settings
  async updateMatchmakingSettings(id, settings) {
    try {
      const response = await this.api.put(
        `/${id}/matchmaking-settings`,
        settings,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Tournament data
  async getStandings(id) {
    try {
      const response = await this.api.get(`/${id}/standings`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAnalytics(id) {
    try {
      const response = await this.api.get(`/${id}/analytics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Match operations
  async getMatches(tournamentId, round = null) {
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
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMatchResult(matchId, result) {
    try {
      const matchApi = axios.create({
        baseURL: `${API_BASE_URL}/matches`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const response = await matchApi.put(`/${matchId}`, result);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async reportMatchResult(matchId, result) {
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
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async startMatch(matchId) {
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
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error - please check your connection');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Matchmaking simulation methods (for demo purposes)
  simulateMatchmakingAnalytics() {
    return {
      totalMatches: 156,
      averageQualityScore: 94.7,
      averageProcessingTime: 1.2,
      predictionAccuracy: 87.3,
      surpriseFactorAverage: 12.4,
      skillDifferenceAverage: 245,
      deckArchetypeDistribution: {
        Aggro: 32,
        Control: 28,
        Midrange: 25,
        Combo: 15,
      },
      roundAnalytics: [
        { round: 1, averageQuality: 92.1, processingTime: 1.1 },
        { round: 2, averageQuality: 94.3, processingTime: 1.2 },
        { round: 3, averageQuality: 96.2, processingTime: 1.3 },
      ],
    };
  }

  // Default matchmaking settings
  getDefaultMatchmakingSettings() {
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
  validateMatchmakingSettings(settings) {
    const errors = [];

    if (settings.skillVariance < 0.1 || settings.skillVariance > 1.0) {
      errors.push('Skill variance must be between 0.1 and 1.0');
    }

    if (
      settings.deckDiversityWeight < 0.1 ||
      settings.deckDiversityWeight > 1.0
    ) {
      errors.push('Deck diversity weight must be between 0.1 and 1.0');
    }

    if (settings.historicalWeight < 0.1 || settings.historicalWeight > 1.0) {
      errors.push('Historical weight must be between 0.1 and 1.0');
    }

    if (settings.uncertaintyFactor < 0.1 || settings.uncertaintyFactor > 0.5) {
      errors.push('Uncertainty factor must be between 0.1 and 0.5');
    }

    if (settings.minSkillDifference < 50 || settings.minSkillDifference > 300) {
      errors.push('Minimum skill difference must be between 50 and 300');
    }

    if (
      settings.maxSkillDifference < 300 ||
      settings.maxSkillDifference > 1000
    ) {
      errors.push('Maximum skill difference must be between 300 and 1000');
    }

    if (settings.minSkillDifference >= settings.maxSkillDifference) {
      errors.push(
        'Minimum skill difference must be less than maximum skill difference',
      );
    }

    if (
      settings.preferredMatchupBalance < 0.5 ||
      settings.preferredMatchupBalance > 1.0
    ) {
      errors.push('Preferred matchup balance must be between 0.5 and 1.0');
    }

    if (settings.learningRate < 0.05 || settings.learningRate > 0.3) {
      errors.push('Learning rate must be between 0.05 and 0.3');
    }

    if (
      settings.confidenceThreshold < 0.5 ||
      settings.confidenceThreshold > 0.95
    ) {
      errors.push('Confidence threshold must be between 0.5 and 0.95');
    }

    return errors;
  }

  // Format tournament data for display
  formatTournamentForDisplay(tournament) {
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
  calculateTournamentProgress(tournament) {
    if (tournament.status === 'upcoming') return 0;
    if (tournament.status === 'completed') return 100;

    const progress = (tournament.currentRound / tournament.rounds) * 100;
    return Math.min(progress, 100);
  }

  // Get tournament status color
  getStatusColor(status) {
    switch (status) {
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
  formatAlgorithmName(algorithm) {
    switch (algorithm) {
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
