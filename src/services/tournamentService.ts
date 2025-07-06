/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import tournamentMatchmakingService from './tournamentMatchmakingService';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Tournament types
export enum TournamentFormat {
  SINGLE_ELIMINATION = 'single-elimination',
  DOUBLE_ELIMINATION = 'double-elimination',
  SWISS = 'swiss',
  ROUND_ROBIN = 'round-robin',
  CUSTOM = 'custom'
}

export enum TournamentStatus {
  DRAFT = 'draft',
  REGISTRATION = 'registration',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MatchStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  player1Id: string;
  player2Id?: string;
  player1Name: string;
  player2Name?: string;
  player1Score: number;
  player2Score: number;
  winnerId?: string;
  status: MatchStatus;
  startTime?: Date;
  endTime?: Date;
  tableNumber?: number;
  isBye?: boolean;
  notes?: string;
  [key: string]: any;
}

export interface TournamentPlayer {
  id: string;
  userId: string;
  tournamentId: string;
  name: string;
  email?: string;
  deckId?: string;
  deckName?: string;
  seed?: number;
  status: 'registered' | 'checked-in' | 'dropped' | 'disqualified';
  wins: number;
  losses: number;
  draws: number;
  matchPoints: number;
  opponentMatchWinPercentage: number;
  gameWinPercentage: number;
  opponentGameWinPercentage: number;
  rank?: number;
  [key: string]: any;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate: Date;
  endDate?: Date;
  location?: string;
  maxPlayers?: number;
  currentRound: number;
  totalRounds: number;
  organizerId: string;
  organizerName: string;
  registrationDeadline?: Date;
  isPublic: boolean;
  entryFee?: number;
  prizes?: string;
  rules?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

export interface TournamentRound {
  id: string;
  tournamentId: string;
  roundNumber: number;
  startTime?: Date;
  endTime?: Date;
  status: 'pending' | 'active' | 'completed';
  matches: TournamentMatch[];
  [key: string]: any;
}

export interface TournamentSearchParams {
  status?: TournamentStatus | TournamentStatus[];
  format?: TournamentFormat | TournamentFormat[];
  startDate?: Date | string;
  endDate?: Date | string;
  location?: string;
  organizerId?: string;
  isPublic?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  [key: string]: any;
}

export interface TournamentRegistrationParams {
  tournamentId: string;
  userId: string;
  name: string;
  email?: string;
  deckId?: string;
  deckName?: string;
  [key: string]: any;
}

export interface TournamentMatchResult {
  player1Score: number;
  player2Score: number;
  draws?: number;
  winnerId?: string;
  notes?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  [key: string]: any;
}

class TournamentService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/tournaments`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth token to requests if available
    this.api.interceptors.request.use((config: AxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Create a new tournament
   * @param tournamentData - Tournament data
   * @returns Created tournament
   */
  async createTournament(tournamentData: Partial<Tournament>): Promise<Tournament> {
    try {
      const response = await this.api.post<ApiResponse<Tournament>>('', tournamentData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tournaments with optional filtering
   * @param params - Search parameters
   * @returns List of tournaments
   */
  async getTournaments(params: TournamentSearchParams = {}): Promise<Tournament[]> {
    try {
      const response = await this.api.get<ApiResponse<Tournament[]>>('', { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a tournament by ID
   * @param id - Tournament ID
   * @returns Tournament details
   */
  async getTournamentById(id: string): Promise<Tournament> {
    try {
      const response = await this.api.get<ApiResponse<Tournament>>(`/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a tournament
   * @param id - Tournament ID
   * @param tournamentData - Updated tournament data
   * @returns Updated tournament
   */
  async updateTournament(id: string, tournamentData: Partial<Tournament>): Promise<Tournament> {
    try {
      const response = await this.api.put<ApiResponse<Tournament>>(`/${id}`, tournamentData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a tournament
   * @param id - Tournament ID
   * @returns Success message
   */
  async deleteTournament(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.delete<ApiResponse<{ success: boolean; message: string }>>(`/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register a player for a tournament
   * @param registrationData - Registration data
   * @returns Registration confirmation
   */
  async registerPlayer(registrationData: TournamentRegistrationParams): Promise<TournamentPlayer> {
    try {
      const response = await this.api.post<ApiResponse<TournamentPlayer>>(
        `/${registrationData.tournamentId}/players`,
        registrationData
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Unregister a player from a tournament
   * @param tournamentId - Tournament ID
   * @param playerId - Player ID
   * @returns Success message
   */
  async unregisterPlayer(tournamentId: string, playerId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.delete<ApiResponse<{ success: boolean; message: string }>>(
        `/${tournamentId}/players/${playerId}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get players registered for a tournament
   * @param tournamentId - Tournament ID
   * @returns List of registered players
   */
  async getTournamentPlayers(tournamentId: string): Promise<TournamentPlayer[]> {
    try {
      const response = await this.api.get<ApiResponse<TournamentPlayer[]>>(`/${tournamentId}/players`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a player's status or information
   * @param tournamentId - Tournament ID
   * @param playerId - Player ID
   * @param playerData - Updated player data
   * @returns Updated player
   */
  async updatePlayer(
    tournamentId: string,
    playerId: string,
    playerData: Partial<TournamentPlayer>
  ): Promise<TournamentPlayer> {
    try {
      const response = await this.api.put<ApiResponse<TournamentPlayer>>(
        `/${tournamentId}/players/${playerId}`,
        playerData
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start a tournament
   * @param tournamentId - Tournament ID
   * @returns Updated tournament
   */
  async startTournament(tournamentId: string): Promise<Tournament> {
    try {
      const response = await this.api.post<ApiResponse<Tournament>>(`/${tournamentId}/start`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * End a tournament
   * @param tournamentId - Tournament ID
   * @returns Updated tournament
   */
  async endTournament(tournamentId: string): Promise<Tournament> {
    try {
      const response = await this.api.post<ApiResponse<Tournament>>(`/${tournamentId}/end`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancel a tournament
   * @param tournamentId - Tournament ID
   * @param reason - Cancellation reason
   * @returns Updated tournament
   */
  async cancelTournament(tournamentId: string, reason?: string): Promise<Tournament> {
    try {
      const response = await this.api.post<ApiResponse<Tournament>>(`/${tournamentId}/cancel`, { reason });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create pairings for the next round
   * @param tournamentId - Tournament ID
   * @returns Created round with matches
   */
  async createPairings(tournamentId: string): Promise<TournamentRound> {
    try {
      const response = await this.api.post<ApiResponse<TournamentRound>>(`/${tournamentId}/pairings`);
      
      // Integrate with matchmaking service for better pairings
      const tournament = await this.getTournamentById(tournamentId);
      const players = await this.getTournamentPlayers(tournamentId);
      
      // Initialize tournament engine if needed
      tournamentMatchmakingService.initializeTournamentEngine(tournamentId, {
        eliminationFormat: tournament.format === TournamentFormat.DOUBLE_ELIMINATION ? 'double' : 'single',
        swissRounds: tournament.totalRounds
      });
      
      // Register players with the matchmaking service
      players.forEach(player => {
        tournamentMatchmakingService.registerPlayer(tournamentId, {
          id: player.userId,
          name: player.name
        });
      });
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get rounds for a tournament
   * @param tournamentId - Tournament ID
   * @returns List of rounds
   */
  async getTournamentRounds(tournamentId: string): Promise<TournamentRound[]> {
    try {
      const response = await this.api.get<ApiResponse<TournamentRound[]>>(`/${tournamentId}/rounds`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific round
   * @param tournamentId - Tournament ID
   * @param roundNumber - Round number
   * @returns Round details
   */
  async getRound(tournamentId: string, roundNumber: number): Promise<TournamentRound> {
    try {
      const response = await this.api.get<ApiResponse<TournamentRound>>(
        `/${tournamentId}/rounds/${roundNumber}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get matches for a tournament
   * @param tournamentId - Tournament ID
   * @param roundNumber - Optional round number filter
   * @returns List of matches
   */
  async getTournamentMatches(tournamentId: string, roundNumber?: number): Promise<TournamentMatch[]> {
    try {
      let url = `/${tournamentId}/matches`;
      if (roundNumber !== undefined) {
        url = `/${tournamentId}/rounds/${roundNumber}/matches`;
      }
      
      const response = await this.api.get<ApiResponse<TournamentMatch[]>>(url);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific match
   * @param tournamentId - Tournament ID
   * @param matchId - Match ID
   * @returns Match details
   */
  async getMatch(tournamentId: string, matchId: string): Promise<TournamentMatch> {
    try {
      const response = await this.api.get<ApiResponse<TournamentMatch>>(
        `/${tournamentId}/matches/${matchId}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a match result
   * @param tournamentId - Tournament ID
   * @param matchId - Match ID
   * @param result - Match result
   * @returns Updated match
   */
  async submitMatchResult(
    tournamentId: string,
    matchId: string,
    result: TournamentMatchResult
  ): Promise<TournamentMatch> {
    try {
      const response = await this.api.post<ApiResponse<TournamentMatch>>(
        `/${tournamentId}/matches/${matchId}/result`,
        result
      );
      
      // Update matchmaking service with result
      const match = response.data.data;
      
      if (match.player1Id && match.player2Id) {
        tournamentMatchmakingService.recordMatchResult(
          tournamentId,
          matchId,
          {
            player1Score: result.player1Score,
            player2Score: result.player2Score,
            draws: result.draws || 0
          }
        );
      }
      
      return match;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tournament standings
   * @param tournamentId - Tournament ID
   * @returns List of players with standings
   */
  async getTournamentStandings(tournamentId: string): Promise<TournamentPlayer[]> {
    try {
      const response = await this.api.get<ApiResponse<TournamentPlayer[]>>(`/${tournamentId}/standings`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Drop a player from a tournament
   * @param tournamentId - Tournament ID
   * @param playerId - Player ID
   * @param reason - Drop reason
   * @returns Updated player
   */
  async dropPlayer(tournamentId: string, playerId: string, reason?: string): Promise<TournamentPlayer> {
    try {
      const response = await this.api.post<ApiResponse<TournamentPlayer>>(
        `/${tournamentId}/players/${playerId}/drop`,
        { reason }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Disqualify a player from a tournament
   * @param tournamentId - Tournament ID
   * @param playerId - Player ID
   * @param reason - Disqualification reason
   * @returns Updated player
   */
  async disqualifyPlayer(tournamentId: string, playerId: string, reason: string): Promise<TournamentPlayer> {
    try {
      const response = await this.api.post<ApiResponse<TournamentPlayer>>(
        `/${tournamentId}/players/${playerId}/disqualify`,
        { reason }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tournaments organized by a user
   * @param userId - User ID
   * @returns List of tournaments
   */
  async getUserTournaments(userId: string): Promise<Tournament[]> {
    try {
      const response = await this.api.get<ApiResponse<Tournament[]>>('/user/organized', {
        params: { userId }
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tournaments a user is registered for
   * @param userId - User ID
   * @returns List of tournaments
   */
  async getUserRegisteredTournaments(userId: string): Promise<Tournament[]> {
    try {
      const response = await this.api.get<ApiResponse<Tournament[]>>('/user/registered', {
        params: { userId }
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Export tournament data
   * @param tournamentId - Tournament ID
   * @param format - Export format (json, csv, pdf)
   * @returns Export data or download URL
   */
  async exportTournament(
    tournamentId: string,
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<string | Blob | object> {
    try {
      const response = await this.api.get<any>(`/${tournamentId}/export`, {
        params: { format },
        responseType: format === 'json' ? 'json' : 'blob'
      });
      
      if (format === 'json') {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Import tournament data
   * @param data - Tournament data to import
   * @returns Created tournament
   */
  async importTournament(data: any): Promise<Tournament> {
    try {
      const response = await this.api.post<ApiResponse<Tournament>>('/import', data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param error - Error object
   * @returns Standardized error
   */
  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<any>>;
      
      if (axiosError.response) {
        // The request was made and the server responded with an error status
        const errorData = axiosError.response.data as any;
        
        return {
          message: errorData.message || 'An error occurred',
          code: errorData.code,
          status: axiosError.response.status,
          details: errorData.details
        };
      } else if (axiosError.request) {
        // The request was made but no response was received
        return {
          message: 'No response received from server',
          code: 'NO_RESPONSE',
          status: 0
        };
      } else {
        // Something happened in setting up the request
        return {
          message: axiosError.message || 'Request setup error',
          code: 'REQUEST_SETUP_ERROR'
        };
      }
    }
    
    // Generic error handling
    return {
      message: error.message || 'An unknown error occurred',
      code: 'UNKNOWN_ERROR'
    };
  }
}

// Create singleton instance
const tournamentService = new TournamentService();

export default tournamentService;