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

import axios from 'axios';

/**
 * Matchmaking API client
 */
export class MatchmakingAPI {
  /**
   * Create a new MatchmakingAPI instance
   * @param {Object} config - API configuration
   */
  constructor(config = {}) {
    const {
      baseURL = '/api',
      timeout = 10000,
      headers = {},
      authToken = null
    } = config;
    
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }
  
  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Promise} Rejected promise with error details
   */
  handleError(error) {
    let errorMessage = 'An unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = 500;
    
    if (error.response) {
      // Server responded with error
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || `Server error: ${statusCode}`;
      errorCode = error.response.data?.code || `SERVER_ERROR_${statusCode}`;
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'No response from server';
      errorCode = 'NO_RESPONSE';
      statusCode = 0;
    } else {
      // Request setup error
      errorMessage = error.message || errorMessage;
      errorCode = 'REQUEST_SETUP_ERROR';
    }
    
    return Promise.reject({
      message: errorMessage,
      code: errorCode,
      status: statusCode,
      originalError: error
    });
  }
  
  /**
   * Set authentication token
   * @param {string} token - Authentication token
   */
  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  /**
   * Clear authentication token
   */
  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
  
  /**
   * Get player profile
   * @param {string} playerId - Player ID
   * @returns {Promise<Object>} Player data
   */
  async getPlayer(playerId) {
    const response = await this.client.get(`/players/${playerId}`);
    return response.data;
  }
  
  /**
   * Get current player profile
   * @returns {Promise<Object>} Current player data
   */
  async getCurrentPlayer() {
    const response = await this.client.get('/players/me');
    return response.data;
  }
  
  /**
   * Update player profile
   * @param {string} playerId - Player ID
   * @param {Object} data - Player data to update
   * @returns {Promise<Object>} Updated player data
   */
  async updatePlayer(playerId, data) {
    const response = await this.client.patch(`/players/${playerId}`, data);
    return response.data;
  }
  
  /**
   * Get player match history
   * @param {string} playerId - Player ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Match history
   */
  async getPlayerMatches(playerId, options = {}) {
    const {
      limit = 20,
      offset = 0,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = options;
    
    const response = await this.client.get(`/players/${playerId}/matches`, {
      params: { limit, offset, sortBy, sortOrder }
    });
    
    return response.data;
  }
  
  /**
   * Get player statistics
   * @param {string} playerId - Player ID
   * @returns {Promise<Object>} Player statistics
   */
  async getPlayerStats(playerId) {
    const response = await this.client.get(`/players/${playerId}/stats`);
    return response.data;
  }
  
  /**
   * Find match for player
   * @param {string} playerId - Player ID
   * @param {Object} options - Matchmaking options
   * @returns {Promise<Object>} Match data
   */
  async findMatch(playerId, options = {}) {
    const response = await this.client.post(`/matchmaking/find`, {
      playerId,
      ...options
    });
    
    return response.data;
  }
  
  /**
   * Accept match
   * @param {string} matchId - Match ID
   * @param {string} playerId - Player ID
   * @returns {Promise<Object>} Match data
   */
  async acceptMatch(matchId, playerId) {
    const response = await this.client.post(`/matchmaking/matches/${matchId}/accept`, {
      playerId
    });
    
    return response.data;
  }
  
  /**
   * Decline match
   * @param {string} matchId - Match ID
   * @param {string} playerId - Player ID
   * @returns {Promise<Object>} Result
   */
  async declineMatch(matchId, playerId) {
    const response = await this.client.post(`/matchmaking/matches/${matchId}/decline`, {
      playerId
    });
    
    return response.data;
  }
  
  /**
   * Report match result
   * @param {string} matchId - Match ID
   * @param {Object} result - Match result
   * @returns {Promise<Object>} Updated match data
   */
  async reportMatchResult(matchId, result) {
    const response = await this.client.post(`/matchmaking/matches/${matchId}/result`, result);
    return response.data;
  }
  
  /**
   * Get leaderboard
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Leaderboard data
   */
  async getLeaderboard(options = {}) {
    const {
      limit = 100,
      offset = 0,
      tier = null,
      confidenceBand = null,
      region = null,
      timeFrame = 'season'
    } = options;
    
    const params = { limit, offset, timeFrame };
    if (tier) params.tier = tier;
    if (confidenceBand) params.confidenceBand = confidenceBand;
    if (region) params.region = region;
    
    const response = await this.client.get('/leaderboard', { params });
    return response.data;
  }
  
  /**
   * Get available tournaments
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Tournament data
   */
  async getTournaments(options = {}) {
    const {
      limit = 20,
      offset = 0,
      status = 'active',
      region = null
    } = options;
    
    const params = { limit, offset, status };
    if (region) params.region = region;
    
    const response = await this.client.get('/tournaments', { params });
    return response.data;
  }
  
  /**
   * Get tournament details
   * @param {string} tournamentId - Tournament ID
   * @returns {Promise<Object>} Tournament data
   */
  async getTournament(tournamentId) {
    const response = await this.client.get(`/tournaments/${tournamentId}`);
    return response.data;
  }
  
  /**
   * Register for tournament
   * @param {string} tournamentId - Tournament ID
   * @param {string} playerId - Player ID
   * @param {Object} registrationData - Registration data
   * @returns {Promise<Object>} Registration result
   */
  async registerForTournament(tournamentId, playerId, registrationData = {}) {
    const response = await this.client.post(`/tournaments/${tournamentId}/register`, {
      playerId,
      ...registrationData
    });
    
    return response.data;
  }
  
  /**
   * Get tournament standings
   * @param {string} tournamentId - Tournament ID
   * @returns {Promise<Array>} Tournament standings
   */
  async getTournamentStandings(tournamentId) {
    const response = await this.client.get(`/tournaments/${tournamentId}/standings`);
    return response.data;
  }
  
  /**
   * Get tournament matches
   * @param {string} tournamentId - Tournament ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Tournament matches
   */
  async getTournamentMatches(tournamentId, options = {}) {
    const {
      round = null,
      status = null,
      playerId = null
    } = options;
    
    const params = {};
    if (round !== null) params.round = round;
    if (status) params.status = status;
    if (playerId) params.playerId = playerId;
    
    const response = await this.client.get(`/tournaments/${tournamentId}/matches`, { params });
    return response.data;
  }
  
  /**
   * Create tournament
   * @param {Object} tournamentData - Tournament data
   * @returns {Promise<Object>} Created tournament
   */
  async createTournament(tournamentData) {
    const response = await this.client.post('/tournaments', tournamentData);
    return response.data;
  }
  
  /**
   * Update tournament
   * @param {string} tournamentId - Tournament ID
   * @param {Object} tournamentData - Tournament data to update
   * @returns {Promise<Object>} Updated tournament
   */
  async updateTournament(tournamentId, tournamentData) {
    const response = await this.client.patch(`/tournaments/${tournamentId}`, tournamentData);
    return response.data;
  }
  
  /**
   * Start tournament
   * @param {string} tournamentId - Tournament ID
   * @returns {Promise<Object>} Tournament data
   */
  async startTournament(tournamentId) {
    const response = await this.client.post(`/tournaments/${tournamentId}/start`);
    return response.data;
  }
  
  /**
   * End tournament
   * @param {string} tournamentId - Tournament ID
   * @returns {Promise<Object>} Tournament data
   */
  async endTournament(tournamentId) {
    const response = await this.client.post(`/tournaments/${tournamentId}/end`);
    return response.data;
  }
  
  /**
   * Get meta data
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Meta data
   */
  async getMetaData(options = {}) {
    const {
      timeFrame = 'current',
      region = null
    } = options;
    
    const params = { timeFrame };
    if (region) params.region = region;
    
    const response = await this.client.get('/meta', { params });
    return response.data;
  }
  
  /**
   * Get deck archetypes
   * @returns {Promise<Array>} Deck archetypes
   */
  async getDeckArchetypes() {
    const response = await this.client.get('/decks/archetypes');
    return response.data;
  }
  
  /**
   * Get deck matchups
   * @param {string} archetype - Deck archetype
   * @returns {Promise<Object>} Matchup data
   */
  async getDeckMatchups(archetype) {
    const response = await this.client.get(`/decks/archetypes/${archetype}/matchups`);
    return response.data;
  }
  
  /**
   * Get player deck collection
   * @param {string} playerId - Player ID
   * @returns {Promise<Array>} Deck collection
   */
  async getPlayerDecks(playerId) {
    const response = await this.client.get(`/players/${playerId}/decks`);
    return response.data;
  }
  
  /**
   * Create player deck
   * @param {string} playerId - Player ID
   * @param {Object} deckData - Deck data
   * @returns {Promise<Object>} Created deck
   */
  async createPlayerDeck(playerId, deckData) {
    const response = await this.client.post(`/players/${playerId}/decks`, deckData);
    return response.data;
  }
  
  /**
   * Update player deck
   * @param {string} playerId - Player ID
   * @param {string} deckId - Deck ID
   * @param {Object} deckData - Deck data to update
   * @returns {Promise<Object>} Updated deck
   */
  async updatePlayerDeck(playerId, deckId, deckData) {
    const response = await this.client.patch(`/players/${playerId}/decks/${deckId}`, deckData);
    return response.data;
  }
  
  /**
   * Delete player deck
   * @param {string} playerId - Player ID
   * @param {string} deckId - Deck ID
   * @returns {Promise<Object>} Result
   */
  async deletePlayerDeck(playerId, deckId) {
    const response = await this.client.delete(`/players/${playerId}/decks/${deckId}`);
    return response.data;
  }
  
  /**
   * Get player notifications
   * @param {string} playerId - Player ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Notifications
   */
  async getPlayerNotifications(playerId, options = {}) {
    const {
      limit = 20,
      offset = 0,
      unreadOnly = false
    } = options;
    
    const response = await this.client.get(`/players/${playerId}/notifications`, {
      params: { limit, offset, unreadOnly }
    });
    
    return response.data;
  }
  
  /**
   * Mark notification as read
   * @param {string} playerId - Player ID
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Result
   */
  async markNotificationRead(playerId, notificationId) {
    const response = await this.client.post(`/players/${playerId}/notifications/${notificationId}/read`);
    return response.data;
  }
  
  /**
   * Get player achievements
   * @param {string} playerId - Player ID
   * @returns {Promise<Array>} Achievements
   */
  async getPlayerAchievements(playerId) {
    const response = await this.client.get(`/players/${playerId}/achievements`);
    return response.data;
  }
  
  /**
   * Get player analytics
   * @param {string} playerId - Player ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Analytics data
   */
  async getPlayerAnalytics(playerId, options = {}) {
    const {
      timeFrame = 'season',
      includeMatchups = true,
      includePerformance = true,
      includeSkillDecomposition = true
    } = options;
    
    const params = { 
      timeFrame,
      includeMatchups,
      includePerformance,
      includeSkillDecomposition
    };
    
    const response = await this.client.get(`/players/${playerId}/analytics`, { params });
    return response.data;
  }
  
  /**
   * Get nearby physical events
   * @param {Object} location - Location data
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Events
   */
  async getNearbyEvents(location, options = {}) {
    const {
      radius = 50, // km
      limit = 20,
      offset = 0,
      startDate = null,
      endDate = null
    } = options;
    
    const params = { 
      ...location,
      radius,
      limit,
      offset
    };
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await this.client.get('/events/nearby', { params });
    return response.data;
  }
  
  /**
   * Register for physical event
   * @param {string} eventId - Event ID
   * @param {string} playerId - Player ID
   * @param {Object} registrationData - Registration data
   * @returns {Promise<Object>} Registration result
   */
  async registerForEvent(eventId, playerId, registrationData = {}) {
    const response = await this.client.post(`/events/${eventId}/register`, {
      playerId,
      ...registrationData
    });
    
    return response.data;
  }
}