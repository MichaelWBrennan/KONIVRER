/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Matchmaking API
 *
 * Provides a comprehensive API for matchmaking and tournament management
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Matchmaking API configuration
export interface MatchmakingAPIConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  authToken?: string | null;
}

// Match types
export enum MatchType {
  CASUAL = 'casual',
  RANKED = 'ranked',
  TOURNAMENT = 'tournament',
  FRIENDLY = 'friendly',
  PRACTICE = 'practice'
}

// Match status
export enum MatchStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ABANDONED = 'abandoned'
}

// Queue status
export enum QueueStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  MAINTENANCE = 'maintenance'
}

// Matchmaking region
export enum MatchmakingRegion {
  GLOBAL = 'global',
  NA_EAST = 'na-east',
  NA_WEST = 'na-west',
  EU = 'eu',
  ASIA = 'asia',
  OCEANIA = 'oceania',
  SA = 'sa'
}

// Player skill level
export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  MASTER = 'master',
  GRANDMASTER = 'grandmaster'
}

// Player data
export interface Player {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  rank?: number;
  skillLevel?: SkillLevel;
  region?: MatchmakingRegion;
  wins?: number;
  losses?: number;
  draws?: number;
  rating?: number;
  status?: 'online' | 'offline' | 'in_game' | 'away';
  lastActive?: string;
}

// Deck data
export interface Deck {
  id: string;
  name: string;
  cards: string[];
  mainCard?: string;
  azothCards?: string[];
}

// Match data
export interface Match {
  id: string;
  type: MatchType;
  status: MatchStatus;
  players: Player[];
  winner?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  turns?: number;
  decks?: Record<string, Deck>;
  scores?: Record<string, number>;
  gameState?: any;
  spectators?: number;
  region?: MatchmakingRegion;
  metadata?: Record<string, any>;
}

// Queue data
export interface Queue {
  id: string;
  name: string;
  type: MatchType;
  status: QueueStatus;
  playerCount: number;
  estimatedWaitTime: number;
  region: MatchmakingRegion;
  requirements?: {
    minRank?: number;
    maxRank?: number;
    minRating?: number;
    maxRating?: number;
    allowedDecks?: string[];
  };
}

// Tournament data
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime?: string;
  status: 'upcoming' | 'registration' | 'active' | 'completed' | 'cancelled';
  format: 'single_elimination' | 'double_elimination' | 'swiss' | 'round_robin';
  rounds: number;
  currentRound?: number;
  participants: Player[];
  matches: Match[];
  prizes?: any[];
  rules?: string[];
  organizer?: string;
  region?: MatchmakingRegion;
  metadata?: Record<string, any>;
}

// Matchmaking request
export interface MatchmakingRequest {
  playerId: string;
  deckId: string;
  type: MatchType;
  region?: MatchmakingRegion;
  preferredOpponents?: string[];
  excludedOpponents?: string[];
  timeout?: number;
}

// Matchmaking response
export interface MatchmakingResponse {
  requestId: string;
  status: 'queued' | 'matched' | 'timeout' | 'error';
  estimatedWaitTime?: number;
  position?: number;
  match?: Match;
  error?: string;
}

// Match result
export interface MatchResult {
  matchId: string;
  winnerId: string;
  scores: Record<string, number>;
  gameStats: any;
}

// API response
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * Matchmaking API client
 */
export class MatchmakingAPI {
  private client: AxiosInstance;
  private authToken: string | null;

  /**
   * Create a new MatchmakingAPI instance
   * @param config - API configuration
   */
  constructor(config: MatchmakingAPIConfig = {}) {
    const {
      baseURL = '/api',
      timeout = 10000,
      headers = {},
      authToken = null
    } = config;

    this.authToken = authToken;

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle API errors
        if (error.response) {
          // Server responded with a status code outside of 2xx range
          console.error('API Error:', error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('Network Error:', error.request);
          return Promise.reject({
            success: false,
            error: 'Network error',
            message: 'No response received from server'
          });
        } else {
          // Something else happened while setting up the request
          console.error('Request Error:', error.message);
          return Promise.reject({
            success: false,
            error: 'Request error',
            message: error.message
          });
        }
      }
    );
  }

  /**
   * Set authentication token
   * @param token - Authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Get authentication token
   * @returns Current authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Get available queues
   * @param region - Optional region filter
   * @returns Promise with queue data
   */
  async getQueues(region?: MatchmakingRegion): Promise<APIResponse<Queue[]>> {
    try {
      const params: Record<string, string> = {};
      if (region) {
        params.region = region;
      }

      const response = await this.client.get<APIResponse<Queue[]>>('/matchmaking/queues', { params });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get queue status
   * @param queueId - Queue ID
   * @returns Promise with queue data
   */
  async getQueueStatus(queueId: string): Promise<APIResponse<Queue>> {
    try {
      const response = await this.client.get<APIResponse<Queue>>(`/matchmaking/queues/${queueId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Join matchmaking queue
   * @param request - Matchmaking request
   * @returns Promise with matchmaking response
   */
  async joinQueue(request: MatchmakingRequest): Promise<APIResponse<MatchmakingResponse>> {
    try {
      const response = await this.client.post<APIResponse<MatchmakingResponse>>(
        '/matchmaking/queue',
        request
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Leave matchmaking queue
   * @param requestId - Request ID
   * @returns Promise with success status
   */
  async leaveQueue(requestId: string): Promise<APIResponse<null>> {
    try {
      const response = await this.client.delete<APIResponse<null>>(
        `/matchmaking/queue/${requestId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Check matchmaking status
   * @param requestId - Request ID
   * @returns Promise with matchmaking response
   */
  async checkMatchmakingStatus(requestId: string): Promise<APIResponse<MatchmakingResponse>> {
    try {
      const response = await this.client.get<APIResponse<MatchmakingResponse>>(
        `/matchmaking/status/${requestId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create a match directly (for friendly matches)
   * @param players - Player IDs
   * @param type - Match type
   * @param options - Additional options
   * @returns Promise with match data
   */
  async createMatch(
    players: string[],
    type: MatchType = MatchType.FRIENDLY,
    options: {
      region?: MatchmakingRegion;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<APIResponse<Match>> {
    try {
      const response = await this.client.post<APIResponse<Match>>('/matchmaking/matches', {
        players,
        type,
        ...options
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get match details
   * @param matchId - Match ID
   * @returns Promise with match data
   */
  async getMatch(matchId: string): Promise<APIResponse<Match>> {
    try {
      const response = await this.client.get<APIResponse<Match>>(
        `/matchmaking/matches/${matchId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get player's active match
   * @param playerId - Player ID
   * @returns Promise with match data
   */
  async getActiveMatch(playerId: string): Promise<APIResponse<Match>> {
    try {
      const response = await this.client.get<APIResponse<Match>>(
        `/matchmaking/players/${playerId}/active-match`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get player's match history
   * @param playerId - Player ID
   * @param options - Pagination and filter options
   * @returns Promise with match data
   */
  async getMatchHistory(
    playerId: string,
    options: {
      page?: number;
      limit?: number;
      type?: MatchType;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<APIResponse<{ matches: Match[]; total: number; page: number; limit: number }>> {
    try {
      const response = await this.client.get<
        APIResponse<{ matches: Match[]; total: number; page: number; limit: number }>
      >(`/matchmaking/players/${playerId}/history`, {
        params: options
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Submit match result
   * @param result - Match result
   * @returns Promise with updated match data
   */
  async submitMatchResult(result: MatchResult): Promise<APIResponse<Match>> {
    try {
      const response = await this.client.post<APIResponse<Match>>(
        `/matchmaking/matches/${result.matchId}/result`,
        result
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Cancel a match
   * @param matchId - Match ID
   * @param reason - Cancellation reason
   * @returns Promise with success status
   */
  async cancelMatch(matchId: string, reason?: string): Promise<APIResponse<null>> {
    try {
      const response = await this.client.post<APIResponse<null>>(
        `/matchmaking/matches/${matchId}/cancel`,
        { reason }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get available tournaments
   * @param options - Filter options
   * @returns Promise with tournament data
   */
  async getTournaments(
    options: {
      status?: 'upcoming' | 'registration' | 'active' | 'completed';
      region?: MatchmakingRegion;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<APIResponse<{ tournaments: Tournament[]; total: number; page: number; limit: number }>> {
    try {
      const response = await this.client.get<
        APIResponse<{ tournaments: Tournament[]; total: number; page: number; limit: number }>
      >('/matchmaking/tournaments', {
        params: options
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tournament details
   * @param tournamentId - Tournament ID
   * @returns Promise with tournament data
   */
  async getTournament(tournamentId: string): Promise<APIResponse<Tournament>> {
    try {
      const response = await this.client.get<APIResponse<Tournament>>(
        `/matchmaking/tournaments/${tournamentId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Register for a tournament
   * @param tournamentId - Tournament ID
   * @param playerId - Player ID
   * @param deckId - Deck ID
   * @returns Promise with registration status
   */
  async registerForTournament(
    tournamentId: string,
    playerId: string,
    deckId: string
  ): Promise<APIResponse<{ registered: boolean; message?: string }>> {
    try {
      const response = await this.client.post<APIResponse<{ registered: boolean; message?: string }>>(
        `/matchmaking/tournaments/${tournamentId}/register`,
        { playerId, deckId }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Unregister from a tournament
   * @param tournamentId - Tournament ID
   * @param playerId - Player ID
   * @returns Promise with success status
   */
  async unregisterFromTournament(
    tournamentId: string,
    playerId: string
  ): Promise<APIResponse<null>> {
    try {
      const response = await this.client.delete<APIResponse<null>>(
        `/matchmaking/tournaments/${tournamentId}/register/${playerId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tournament matches
   * @param tournamentId - Tournament ID
   * @param round - Optional round number
   * @returns Promise with match data
   */
  async getTournamentMatches(
    tournamentId: string,
    round?: number
  ): Promise<APIResponse<Match[]>> {
    try {
      const params: Record<string, string | number> = {};
      if (round !== undefined) {
        params.round = round;
      }

      const response = await this.client.get<APIResponse<Match[]>>(
        `/matchmaking/tournaments/${tournamentId}/matches`,
        { params }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tournament standings
   * @param tournamentId - Tournament ID
   * @returns Promise with standings data
   */
  async getTournamentStandings(
    tournamentId: string
  ): Promise<APIResponse<{ player: Player; wins: number; losses: number; draws: number; points: number }[]>> {
    try {
      const response = await this.client.get<
        APIResponse<{ player: Player; wins: number; losses: number; draws: number; points: number }[]>
      >(`/matchmaking/tournaments/${tournamentId}/standings`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get player rankings
   * @param options - Filter and pagination options
   * @returns Promise with rankings data
   */
  async getPlayerRankings(
    options: {
      region?: MatchmakingRegion;
      timeframe?: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'all-time';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<
    APIResponse<{
      rankings: { player: Player; rank: number; rating: number; wins: number; losses: number }[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    try {
      const response = await this.client.get<
        APIResponse<{
          rankings: { player: Player; rank: number; rating: number; wins: number; losses: number }[];
          total: number;
          page: number;
          limit: number;
        }>
      >('/matchmaking/rankings', {
        params: options
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get player stats
   * @param playerId - Player ID
   * @returns Promise with player stats
   */
  async getPlayerStats(
    playerId: string
  ): Promise<
    APIResponse<{
      player: Player;
      stats: {
        totalMatches: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        averageMatchDuration: number;
        favoriteDecks: { deckId: string; name: string; matches: number }[];
        recentPerformance: { date: string; wins: number; losses: number }[];
        tournamentStats: {
          participated: number;
          won: number;
          topThree: number;
        };
      };
    }>
  > {
    try {
      const response = await this.client.get<
        APIResponse<{
          player: Player;
          stats: {
            totalMatches: number;
            wins: number;
            losses: number;
            draws: number;
            winRate: number;
            averageMatchDuration: number;
            favoriteDecks: { deckId: string; name: string; matches: number }[];
            recentPerformance: { date: string; wins: number; losses: number }[];
            tournamentStats: {
              participated: number;
              won: number;
              topThree: number;
            };
          };
        }>
      >(`/matchmaking/players/${playerId}/stats`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Report a player
   * @param matchId - Match ID
   * @param reportedPlayerId - Reported player ID
   * @param reportingPlayerId - Reporting player ID
   * @param reason - Report reason
   * @param details - Additional details
   * @returns Promise with success status
   */
  async reportPlayer(
    matchId: string,
    reportedPlayerId: string,
    reportingPlayerId: string,
    reason: string,
    details?: string
  ): Promise<APIResponse<{ reportId: string }>> {
    try {
      const response = await this.client.post<APIResponse<{ reportId: string }>>(
        '/matchmaking/reports',
        {
          matchId,
          reportedPlayerId,
          reportingPlayerId,
          reason,
          details
        }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create a tournament (admin only)
   * @param tournament - Tournament data
   * @returns Promise with created tournament
   */
  async createTournament(
    tournament: Omit<Tournament, 'id' | 'matches'>
  ): Promise<APIResponse<Tournament>> {
    try {
      const response = await this.client.post<APIResponse<Tournament>>(
        '/matchmaking/tournaments',
        tournament
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update a tournament (admin only)
   * @param tournamentId - Tournament ID
   * @param updates - Tournament updates
   * @returns Promise with updated tournament
   */
  async updateTournament(
    tournamentId: string,
    updates: Partial<Tournament>
  ): Promise<APIResponse<Tournament>> {
    try {
      const response = await this.client.put<APIResponse<Tournament>>(
        `/matchmaking/tournaments/${tournamentId}`,
        updates
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete a tournament (admin only)
   * @param tournamentId - Tournament ID
   * @returns Promise with success status
   */
  async deleteTournament(tournamentId: string): Promise<APIResponse<null>> {
    try {
      const response = await this.client.delete<APIResponse<null>>(
        `/matchmaking/tournaments/${tournamentId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Start a tournament (admin only)
   * @param tournamentId - Tournament ID
   * @returns Promise with updated tournament
   */
  async startTournament(tournamentId: string): Promise<APIResponse<Tournament>> {
    try {
      const response = await this.client.post<APIResponse<Tournament>>(
        `/matchmaking/tournaments/${tournamentId}/start`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * End a tournament (admin only)
   * @param tournamentId - Tournament ID
   * @returns Promise with updated tournament
   */
  async endTournament(tournamentId: string): Promise<APIResponse<Tournament>> {
    try {
      const response = await this.client.post<APIResponse<Tournament>>(
        `/matchmaking/tournaments/${tournamentId}/end`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get server status
   * @returns Promise with server status
   */
  async getServerStatus(): Promise<
    APIResponse<{
      status: 'online' | 'maintenance' | 'offline';
      activeMatches: number;
      queuedPlayers: number;
      activeTournaments: number;
      regions: { region: MatchmakingRegion; status: 'online' | 'maintenance' | 'offline' }[];
      maintenanceScheduled?: string;
      message?: string;
    }>
  > {
    try {
      const response = await this.client.get<
        APIResponse<{
          status: 'online' | 'maintenance' | 'offline';
          activeMatches: number;
          queuedPlayers: number;
          activeTournaments: number;
          regions: { region: MatchmakingRegion; status: 'online' | 'maintenance' | 'offline' }[];
          maintenanceScheduled?: string;
          message?: string;
        }>
      >('/matchmaking/status');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param error - Error object
   * @returns Standardized error response
   */
  private handleError<T>(error: any): APIResponse<T> {
    if (error.success === false) {
      // Already formatted error from interceptor
      return error as APIResponse<T>;
    }

    return {
      success: false,
      error: 'Unknown error',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    };
  }
}

// Create default instance
const matchmakingAPI = new MatchmakingAPI();

export default matchmakingAPI;