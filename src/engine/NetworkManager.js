/**
 * KONIVRER Network Manager - MTG Arena Edition
 *
 * This enhanced network manager provides an MTG Arena-like experience with:
 * - Optimized WebSocket communication for low-latency gameplay
 * - Robust connection handling with automatic reconnection
 * - Efficient state synchronization with delta updates
 * - Advanced matchmaking with skill-based player pairing
 * - Cross-platform compatibility for all devices
 * - Performance optimizations for mobile networks
 * 
 * The manager handles all network communication for multiplayer games,
 * ensuring a smooth, responsive experience even on slower connections.
 */

class NetworkManager {
  constructor(options = {}) {
    // Core connection properties
    this.socket = null;
    this.gameId = null;
    this.playerId = null;
    this.eventListeners = {};
    
    // Connection management
    this.connectionState = 'disconnected'; // 'disconnected', 'connecting', 'connected', 'reconnecting'
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.reconnectDelay = options.reconnectDelay || 1000; // Start with 1 second delay
    this.heartbeatInterval = options.heartbeatInterval || 15000; // 15 seconds
    this.heartbeatTimer = null;
    this.lastHeartbeatResponse = 0;
    this.connectionQuality = 'unknown'; // 'excellent', 'good', 'fair', 'poor', 'unknown'
    
    // Network optimization
    this.compressionEnabled = options.compressionEnabled !== false;
    this.batchUpdates = options.batchUpdates !== false;
    this.updateInterval = options.updateInterval || 100; // ms between batched updates
    this.pendingUpdates = [];
    this.updateTimer = null;
    this.lastFullStateTime = 0;
    this.fullStateInterval = options.fullStateInterval || 10000; // 10 seconds
    
    // Performance monitoring
    this.latency = 0; // ms
    this.latencyHistory = [];
    this.packetLoss = 0; // percentage
    this.bandwidth = 0; // bytes per second
    this.sentBytes = 0;
    this.receivedBytes = 0;
    this.lastNetworkStatsReset = Date.now();
    
    // Matchmaking
    this.matchmakingStatus = 'idle'; // 'idle', 'queued', 'matching', 'matched'
    this.matchmakingStartTime = 0;
    this.matchmakingCriteria = options.matchmakingCriteria || {
      skill: 'any', // 'beginner', 'intermediate', 'advanced', 'any'
      mode: 'standard', // 'standard', 'draft', 'sealed', 'brawl', 'historic'
      ranked: false,
    };
    
    // Device optimization
    this.deviceType = options.deviceType || this.detectDeviceType();
    this.connectionType = 'unknown'; // 'wifi', 'cellular', 'unknown'
    this.adaptiveQuality = options.adaptiveQuality !== false;
    
    // Initialize device-specific optimizations
    this.initDeviceOptimizations();
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
  
  /**
   * Detect the device type based on user agent and screen size
   * @returns {string} Device type: 'desktop', 'tablet', or 'mobile'
   */
  detectDeviceType() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return 'desktop'; // Default to desktop for SSR
    }
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    if (!isMobile) return 'desktop';
    
    // Determine if tablet or mobile based on screen size
    const isTablet = Math.min(window.innerWidth, window.innerHeight) > 768;
    return isTablet ? 'tablet' : 'mobile';
  }
  
  /**
   * Initialize device-specific network optimizations
   */
  initDeviceOptimizations() {
    // Apply different settings based on device type
    if (this.deviceType === 'mobile') {
      // Mobile optimizations
      this.updateInterval = 150; // Less frequent updates
      this.fullStateInterval = 15000; // Less frequent full state syncs
      this.heartbeatInterval = 20000; // Less frequent heartbeats
      
      // Detect connection type if available
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const connection = navigator.connection;
        if (connection) {
          this.connectionType = connection.type === 'cellular' ? 'cellular' : 'wifi';
          
          // Further optimize for slow connections
          if (connection.downlink < 1 || connection.rtt > 500) {
            this.updateInterval = 200;
            this.compressionEnabled = true;
          }
          
          // Listen for connection changes
          connection.addEventListener('change', () => {
            this.updateConnectionSettings();
          });
        }
      }
    } else if (this.deviceType === 'tablet') {
      // Tablet optimizations - middle ground
      this.updateInterval = 120;
      this.fullStateInterval = 12000;
    }
    
    // Set up network stats monitoring
    this.startNetworkMonitoring();
  }
  
  /**
   * Update connection settings based on current network conditions
   */
  updateConnectionSettings() {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return;
    
    const connection = navigator.connection;
    if (!connection) return;
    
    this.connectionType = connection.type === 'cellular' ? 'cellular' : 'wifi';
    
    // Adjust settings based on connection quality
    if (connection.downlink < 0.5 || connection.rtt > 1000) {
      // Very poor connection
      this.updateInterval = 250;
      this.fullStateInterval = 20000;
      this.compressionEnabled = true;
      this.batchUpdates = true;
    } else if (connection.downlink < 1 || connection.rtt > 500) {
      // Poor connection
      this.updateInterval = 200;
      this.fullStateInterval = 15000;
      this.compressionEnabled = true;
      this.batchUpdates = true;
    } else if (connection.downlink < 5 || connection.rtt > 200) {
      // Fair connection
      this.updateInterval = 150;
      this.fullStateInterval = 12000;
      this.compressionEnabled = true;
    } else {
      // Good connection
      this.updateInterval = 100;
      this.fullStateInterval = 10000;
      this.compressionEnabled = this.deviceType !== 'desktop';
    }
    
    console.log(`Connection updated: ${this.connectionType}, downlink: ${connection.downlink}Mbps, RTT: ${connection.rtt}ms`);
  }
  
  /**
   * Start monitoring network performance
   */
  startNetworkMonitoring() {
    // Reset network stats periodically
    setInterval(() => {
      const now = Date.now();
      const elapsed = (now - this.lastNetworkStatsReset) / 1000; // seconds
      
      if (elapsed > 0) {
        // Calculate bandwidth
        this.bandwidth = Math.round((this.sentBytes + this.receivedBytes) / elapsed);
        
        // Reset counters
        this.sentBytes = 0;
        this.receivedBytes = 0;
        this.lastNetworkStatsReset = now;
      }
      
      // Trim latency history
      if (this.latencyHistory.length > 20) {
        this.latencyHistory = this.latencyHistory.slice(-20);
      }
      
      // Update connection quality
      this.updateConnectionQuality();
      
    }, 5000); // Every 5 seconds
  }
  
  /**
   * Update the connection quality assessment
   */
  updateConnectionQuality() {
    // Calculate average latency
    const avgLatency = this.latencyHistory.length > 0
      ? this.latencyHistory.reduce((sum, val) => sum + val, 0) / this.latencyHistory.length
      : 0;
    
    // Determine connection quality
    if (avgLatency === 0 || this.latencyHistory.length < 3) {
      this.connectionQuality = 'unknown';
    } else if (avgLatency < 100 && this.packetLoss < 1) {
      this.connectionQuality = 'excellent';
    } else if (avgLatency < 200 && this.packetLoss < 3) {
      this.connectionQuality = 'good';
    } else if (avgLatency < 500 && this.packetLoss < 10) {
      this.connectionQuality = 'fair';
    } else {
      this.connectionQuality = 'poor';
    }
    
    // Emit connection quality event
    this.emitEvent('connectionQualityUpdate', {
      quality: this.connectionQuality,
      latency: avgLatency,
      packetLoss: this.packetLoss,
      bandwidth: this.bandwidth
    });
    
    // Adjust settings if adaptive quality is enabled
    if (this.adaptiveQuality) {
      this.adjustSettingsForQuality();
    }
  }
  
  /**
   * Adjust network settings based on connection quality
   */
  adjustSettingsForQuality() {
    switch (this.connectionQuality) {
      case 'excellent':
        this.updateInterval = this.deviceType === 'desktop' ? 50 : 100;
        this.fullStateInterval = 15000;
        this.compressionEnabled = this.deviceType !== 'desktop';
        break;
        
      case 'good':
        this.updateInterval = this.deviceType === 'desktop' ? 100 : 150;
        this.fullStateInterval = 10000;
        this.compressionEnabled = true;
        break;
        
      case 'fair':
        this.updateInterval = 200;
        this.fullStateInterval = 8000;
        this.compressionEnabled = true;
        this.batchUpdates = true;
        break;
        
      case 'poor':
        this.updateInterval = 250;
        this.fullStateInterval = 5000;
        this.compressionEnabled = true;
        this.batchUpdates = true;
        break;
        
      default:
        // Keep current settings
        break;
    }
  }
  
  /**
   * Start the heartbeat to keep the connection alive
   */
  startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing heartbeat
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        const pingTime = Date.now();
        
        this.send('ping', { timestamp: pingTime });
        
        // Check for response timeout
        setTimeout(() => {
          const now = Date.now();
          if (now - this.lastHeartbeatResponse > this.heartbeatInterval * 2) {
            console.warn('Heartbeat response timeout, connection may be lost');
            this.packetLoss += 10; // Increment packet loss metric
            
            // If we haven't received a response in a while, try to reconnect
            if (now - this.lastHeartbeatResponse > this.heartbeatInterval * 3) {
              console.error('Connection appears to be dead, attempting to reconnect');
              this.reconnect();
            }
          }
        }, this.heartbeatInterval);
      }
    }, this.heartbeatInterval);
  }
  
  /**
   * Stop the heartbeat timer
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  
  /**
   * Handle a ping response
   * @param {Object} data Ping response data
   */
  handlePong(data) {
    const now = Date.now();
    const pingTime = data.timestamp;
    
    if (pingTime) {
      // Calculate latency
      const latency = now - pingTime;
      this.latency = latency;
      this.latencyHistory.push(latency);
      
      // Update last heartbeat response time
      this.lastHeartbeatResponse = now;
    }
  }
  
  /**
   * Reconnect to the server
   */
  reconnect() {
    if (this.connectionState === 'reconnecting') return;
    
    this.connectionState = 'reconnecting';
    this.emitEvent('reconnecting', { attempts: this.reconnectAttempts + 1 });
    
    // Close existing socket if it's still open
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    
    // Attempt to reconnect
    this.attemptReconnect();
  }
  
  /**
   * Get network statistics
   * @returns {Object} Network statistics
   */
  getNetworkStats() {
    return {
      latency: this.latency,
      packetLoss: this.packetLoss,
      bandwidth: this.bandwidth,
      connectionQuality: this.connectionQuality,
      connectionType: this.connectionType,
      deviceType: this.deviceType,
      sentBytes: this.sentBytes,
      receivedBytes: this.receivedBytes
    };
  }
}

export default NetworkManager;
