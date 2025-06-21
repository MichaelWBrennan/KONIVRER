/**
 * KONIVRER Network Manager
 *
 * This class handles network communication for multiplayer games.
 * It manages WebSocket connections, game state synchronization, and player matchmaking.
 */

class NetworkManager {
  constructor() {
    this.socket = null;
    this.gameId = null;
    this.playerId = null;
    this.eventListeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second delay
  }

  /**
   * Connect to the game server
   * @param {string} serverUrl WebSocket server URL
   * @param {string} playerName Player's name
   * @returns {Promise} Promise that resolves when connected
   */
  connect(serverUrl, playerName) {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(serverUrl);

        this.socket.onopen = () => {
          console.log('Connected to game server');

          // Send player info
          this.send('player_connect', {
            name: playerName,
          });

          resolve();
        };

        this.socket.onmessage = event => {
          this.handleMessage(event.data);
        };

        this.socket.onclose = event => {
          console.log(
            'Disconnected from game server',
            event.code,
            event.reason,
          );

          // Attempt to reconnect if not a clean close
          if (
            !event.wasClean &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.attemptReconnect(serverUrl, playerName);
          }

          this.emitEvent('disconnected', {
            code: event.code,
            reason: event.reason,
          });
        };

        this.socket.onerror = error => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        console.error('Failed to connect to game server:', error);
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect to the server
   * @param {string} serverUrl WebSocket server URL
   * @param {string} playerName Player's name
   */
  attemptReconnect(serverUrl, playerName) {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`,
    );

    setTimeout(() => {
      this.connect(serverUrl, playerName)
        .then(() => {
          // If we have a game ID, try to rejoin
          if (this.gameId) {
            this.send('rejoin_game', {
              gameId: this.gameId,
              playerId: this.playerId,
            });
          }

          this.reconnectAttempts = 0;
          this.emitEvent('reconnected', {});
        })
        .catch(() => {
          // Connection failed, will retry if attempts remain
        });
    }, delay);
  }

  /**
   * Disconnect from the game server
   */
  disconnect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  /**
   * Send a message to the server
   * @param {string} type Message type
   * @param {Object} data Message data
   */
  send(type, data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message, socket is not open');
      return;
    }

    const message = JSON.stringify({
      type,
      data,
    });

    this.socket.send(message);
  }

  /**
   * Handle incoming messages from the server
   * @param {string} messageData Raw message data
   */
  handleMessage(messageData) {
    try {
      const message = JSON.parse(messageData);
      const { type, data } = message;

      console.log('Received message:', type, data);

      switch (type) {
        case 'player_connected':
          this.playerId = data.playerId;
          this.emitEvent('playerConnected', data);
          break;

        case 'game_created':
          this.gameId = data.gameId;
          this.emitEvent('gameCreated', data);
          break;

        case 'game_joined':
          this.gameId = data.gameId;
          this.emitEvent('gameJoined', data);
          break;

        case 'game_state_update':
          this.emitEvent('gameStateUpdate', data);
          break;

        case 'player_action':
          this.emitEvent('playerAction', data);
          break;

        case 'chat_message':
          this.emitEvent('chatMessage', data);
          break;

        case 'error':
          console.error('Server error:', data.message);
          this.emitEvent('error', data);
          break;

        default:
          console.warn('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * Create a new multiplayer game
   * @param {Object} options Game options
   */
  createGame(options) {
    this.send('create_game', options);
  }

  /**
   * Join an existing game
   * @param {string} gameId Game ID to join
   * @param {Object} options Join options
   */
  joinGame(gameId, options = {}) {
    this.send('join_game', {
      gameId,
      ...options,
    });
  }

  /**
   * Send a game action to the server
   * @param {string} actionType Type of action
   * @param {Object} actionData Action data
   */
  sendGameAction(actionType, actionData) {
    this.send('game_action', {
      gameId: this.gameId,
      playerId: this.playerId,
      actionType,
      actionData,
    });
  }

  /**
   * Send a chat message
   * @param {string} message Chat message
   */
  sendChatMessage(message) {
    this.send('chat_message', {
      gameId: this.gameId,
      playerId: this.playerId,
      message,
    });
  }

  /**
   * Register an event listener
   * @param {string} event Event name
   * @param {Function} callback Callback function
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Emit an event
   * @param {string} event Event name
   * @param {*} data Event data
   */
  emitEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Check if connected to the server
   * @returns {boolean} True if connected
   */
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get the current player ID
   * @returns {string} Player ID
   */
  getPlayerId() {
    return this.playerId;
  }

  /**
   * Get the current game ID
   * @returns {string} Game ID
   */
  getGameId() {
    return this.gameId;
  }
}

export default NetworkManager;
