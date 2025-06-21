import io from 'socket.io-client';

/**
 * Social Engine for KONIVRER
 * Handles friends, spectating, replays, chat, and community features
 */
export class SocialEngine {
  constructor(options = {}) {
    this.options = {
      enableChat: true,
      enableSpectating: true,
      enableReplays: true,
      enableFriends: true,
      chatModeration: true,
      ...options
    };

    // Socket connection
    this.socket = null;
    this.isConnected = false;

    // User data
    this.currentUser = null;
    this.userProfile = null;

    // Friends system
    this.friends = {
      list: new Map(),
      requests: new Map(),
      blocked: new Set(),
      online: new Set()
    };

    // Chat system
    this.chat = {
      channels: new Map(),
      activeChannel: null,
      messageHistory: new Map(),
      moderationFilters: new Set()
    };

    // Spectating system
    this.spectating = {
      currentGame: null,
      spectators: new Set(),
      isSpectating: false,
      spectatorData: null
    };

    // Replay system
    this.replays = {
      recording: false,
      currentReplay: null,
      replayData: [],
      savedReplays: new Map()
    };

    // Community features
    this.community = {
      tournaments: new Map(),
      guilds: new Map(),
      leaderboards: new Map(),
      events: new Map()
    };

    // Notifications
    this.notifications = {
      queue: [],
      settings: {
        friendRequests: true,
        gameInvites: true,
        tournamentUpdates: true,
        achievements: true
      }
    };

    this.init();
  }

  async init() {
    try {
      await this.connectToServer();
      this.setupEventListeners();
      this.loadUserData();
      this.initializeChatModeration();
      
      console.log('Social Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Social Engine:', error);
    }
  }

  async connectToServer() {
    const serverUrl = process.env.REACT_APP_SOCKET_URL || 'ws://localhost:3001';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('Connected to social server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected from social server');
      });
    });
  }

  setupEventListeners() {
    // Friends events
    this.socket.on('friend_request', this.handleFriendRequest.bind(this));
    this.socket.on('friend_accepted', this.handleFriendAccepted.bind(this));
    this.socket.on('friend_online', this.handleFriendOnline.bind(this));
    this.socket.on('friend_offline', this.handleFriendOffline.bind(this));
    this.socket.on('game_invite', this.handleGameInvite.bind(this));

    // Chat events
    this.socket.on('chat_message', this.handleChatMessage.bind(this));
    this.socket.on('chat_join', this.handleChatJoin.bind(this));
    this.socket.on('chat_leave', this.handleChatLeave.bind(this));
    this.socket.on('chat_moderation', this.handleChatModeration.bind(this));

    // Spectating events
    this.socket.on('spectate_start', this.handleSpectateStart.bind(this));
    this.socket.on('spectate_update', this.handleSpectateUpdate.bind(this));
    this.socket.on('spectate_end', this.handleSpectateEnd.bind(this));

    // Replay events
    this.socket.on('replay_shared', this.handleReplayShared.bind(this));
    this.socket.on('replay_comment', this.handleReplayComment.bind(this));

    // Community events
    this.socket.on('tournament_update', this.handleTournamentUpdate.bind(this));
    this.socket.on('achievement_unlocked', this.handleAchievementUnlocked.bind(this));
    this.socket.on('leaderboard_update', this.handleLeaderboardUpdate.bind(this));
  }

  /**
   * Friends System
   */
  async sendFriendRequest(username) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('send_friend_request', { username }, (response) => {
        if (response.success) {
          this.addNotification({
            type: 'friend_request_sent',
            message: `Friend request sent to ${username}`,
            timestamp: Date.now()
          });
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async acceptFriendRequest(requestId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('accept_friend_request', { requestId }, (response) => {
        if (response.success) {
          const friend = response.friend;
          this.friends.list.set(friend.id, friend);
          this.friends.requests.delete(requestId);
          
          this.addNotification({
            type: 'friend_added',
            message: `${friend.username} is now your friend!`,
            timestamp: Date.now()
          });
          
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async removeFriend(friendId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('remove_friend', { friendId }, (response) => {
        if (response.success) {
          this.friends.list.delete(friendId);
          this.friends.online.delete(friendId);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async inviteToGame(friendId, gameMode = 'casual') {
    return new Promise((resolve, reject) => {
      this.socket.emit('invite_to_game', { friendId, gameMode }, (response) => {
        if (response.success) {
          this.addNotification({
            type: 'game_invite_sent',
            message: `Game invite sent to ${this.friends.list.get(friendId)?.username}`,
            timestamp: Date.now()
          });
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  handleFriendRequest(data) {
    this.friends.requests.set(data.requestId, data.from);
    
    this.addNotification({
      type: 'friend_request',
      message: `${data.from.username} wants to be your friend`,
      timestamp: Date.now(),
      actions: [
        { label: 'Accept', action: () => this.acceptFriendRequest(data.requestId) },
        { label: 'Decline', action: () => this.declineFriendRequest(data.requestId) }
      ]
    });

    this.dispatchEvent('friendRequestReceived', data);
  }

  handleFriendAccepted(data) {
    this.friends.list.set(data.friend.id, data.friend);
    
    this.addNotification({
      type: 'friend_accepted',
      message: `${data.friend.username} accepted your friend request!`,
      timestamp: Date.now()
    });

    this.dispatchEvent('friendAdded', data.friend);
  }

  handleFriendOnline(data) {
    this.friends.online.add(data.friendId);
    
    const friend = this.friends.list.get(data.friendId);
    if (friend) {
      this.addNotification({
        type: 'friend_online',
        message: `${friend.username} is now online`,
        timestamp: Date.now()
      });
    }

    this.dispatchEvent('friendOnline', data);
  }

  handleFriendOffline(data) {
    this.friends.online.delete(data.friendId);
    this.dispatchEvent('friendOffline', data);
  }

  handleGameInvite(data) {
    this.addNotification({
      type: 'game_invite',
      message: `${data.from.username} invited you to a ${data.gameMode} game`,
      timestamp: Date.now(),
      actions: [
        { label: 'Accept', action: () => this.acceptGameInvite(data.inviteId) },
        { label: 'Decline', action: () => this.declineGameInvite(data.inviteId) }
      ]
    });

    this.dispatchEvent('gameInviteReceived', data);
  }

  /**
   * Chat System
   */
  async joinChatChannel(channelName) {
    if (!this.isConnected) return;

    return new Promise((resolve, reject) => {
      this.socket.emit('join_chat', { channel: channelName }, (response) => {
        if (response.success) {
          this.chat.activeChannel = channelName;
          
          if (!this.chat.channels.has(channelName)) {
            this.chat.channels.set(channelName, {
              name: channelName,
              users: new Set(),
              messages: []
            });
          }

          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async sendChatMessage(message, channel = null) {
    const targetChannel = channel || this.chat.activeChannel;
    
    if (!targetChannel || !this.isConnected) {
      throw new Error('No active chat channel');
    }

    // Apply moderation filters
    const filteredMessage = this.applyChatModeration(message);
    
    return new Promise((resolve, reject) => {
      this.socket.emit('send_chat_message', {
        channel: targetChannel,
        message: filteredMessage
      }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  applyChatModeration(message) {
    if (!this.options.chatModeration) return message;

    let filteredMessage = message;

    // Apply profanity filter
    this.chat.moderationFilters.forEach(filter => {
      const regex = new RegExp(filter, 'gi');
      filteredMessage = filteredMessage.replace(regex, '***');
    });

    // Prevent spam (repeated characters)
    filteredMessage = filteredMessage.replace(/(.)\1{4,}/g, '$1$1$1');

    // Limit message length
    if (filteredMessage.length > 500) {
      filteredMessage = filteredMessage.substring(0, 500) + '...';
    }

    return filteredMessage;
  }

  handleChatMessage(data) {
    const { channel, message, user, timestamp } = data;
    
    if (!this.chat.channels.has(channel)) {
      this.chat.channels.set(channel, {
        name: channel,
        users: new Set(),
        messages: []
      });
    }

    const channelData = this.chat.channels.get(channel);
    channelData.messages.push({
      id: data.messageId,
      user,
      message,
      timestamp
    });

    // Limit message history
    if (channelData.messages.length > 100) {
      channelData.messages.shift();
    }

    this.dispatchEvent('chatMessage', data);
  }

  initializeChatModeration() {
    // Load moderation filters
    this.chat.moderationFilters = new Set([
      'spam', 'toxic', 'inappropriate'
      // Add more filters as needed
    ]);
  }

  /**
   * Spectating System
   */
  async spectateGame(gameId) {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('spectate_game', { gameId }, (response) => {
        if (response.success) {
          this.spectating.isSpectating = true;
          this.spectating.currentGame = gameId;
          this.spectating.spectatorData = response.gameData;
          
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async stopSpectating() {
    if (!this.spectating.isSpectating) return;

    return new Promise((resolve, reject) => {
      this.socket.emit('stop_spectating', {
        gameId: this.spectating.currentGame
      }, (response) => {
        if (response.success) {
          this.spectating.isSpectating = false;
          this.spectating.currentGame = null;
          this.spectating.spectatorData = null;
          
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  handleSpectateStart(data) {
    this.spectating.spectators.add(data.spectator);
    this.dispatchEvent('spectatorJoined', data);
  }

  handleSpectateUpdate(data) {
    if (this.spectating.isSpectating) {
      this.spectating.spectatorData = data.gameState;
      this.dispatchEvent('spectateUpdate', data);
    }
  }

  handleSpectateEnd(data) {
    this.spectating.spectators.delete(data.spectator);
    
    if (this.spectating.isSpectating && data.gameId === this.spectating.currentGame) {
      this.spectating.isSpectating = false;
      this.spectating.currentGame = null;
      this.spectating.spectatorData = null;
    }

    this.dispatchEvent('spectateEnd', data);
  }

  /**
   * Replay System
   */
  startRecording(gameId) {
    this.replays.recording = true;
    this.replays.currentReplay = {
      gameId,
      startTime: Date.now(),
      actions: [],
      metadata: {
        players: [],
        gameMode: '',
        duration: 0
      }
    };
  }

  recordAction(action, gameState) {
    if (!this.replays.recording || !this.replays.currentReplay) return;

    this.replays.currentReplay.actions.push({
      action,
      gameState: this.serializeGameState(gameState),
      timestamp: Date.now() - this.replays.currentReplay.startTime
    });
  }

  async stopRecording(gameResult) {
    if (!this.replays.recording || !this.replays.currentReplay) return;

    this.replays.recording = false;
    
    const replay = this.replays.currentReplay;
    replay.metadata.duration = Date.now() - replay.startTime;
    replay.metadata.result = gameResult;
    
    // Save replay locally
    const replayId = this.generateReplayId();
    this.replays.savedReplays.set(replayId, replay);
    
    // Upload to server if connected
    if (this.isConnected) {
      await this.uploadReplay(replayId, replay);
    }

    this.replays.currentReplay = null;
    
    return replayId;
  }

  async shareReplay(replayId, description = '') {
    const replay = this.replays.savedReplays.get(replayId);
    if (!replay) {
      throw new Error('Replay not found');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('share_replay', {
        replayId,
        replay,
        description
      }, (response) => {
        if (response.success) {
          this.addNotification({
            type: 'replay_shared',
            message: 'Replay shared successfully!',
            timestamp: Date.now()
          });
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async loadReplay(replayId) {
    // Try local storage first
    if (this.replays.savedReplays.has(replayId)) {
      return this.replays.savedReplays.get(replayId);
    }

    // Download from server
    return new Promise((resolve, reject) => {
      this.socket.emit('load_replay', { replayId }, (response) => {
        if (response.success) {
          resolve(response.replay);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * Community Features
   */
  async joinTournament(tournamentId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('join_tournament', { tournamentId }, (response) => {
        if (response.success) {
          this.addNotification({
            type: 'tournament_joined',
            message: `Joined tournament: ${response.tournament.name}`,
            timestamp: Date.now()
          });
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async createTournament(tournamentData) {
    return new Promise((resolve, reject) => {
      this.socket.emit('create_tournament', tournamentData, (response) => {
        if (response.success) {
          this.community.tournaments.set(response.tournament.id, response.tournament);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async getLeaderboard(category = 'overall', timeframe = 'monthly') {
    return new Promise((resolve, reject) => {
      this.socket.emit('get_leaderboard', { category, timeframe }, (response) => {
        if (response.success) {
          this.community.leaderboards.set(`${category}_${timeframe}`, response.leaderboard);
          resolve(response.leaderboard);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  handleTournamentUpdate(data) {
    const tournament = this.community.tournaments.get(data.tournamentId);
    if (tournament) {
      Object.assign(tournament, data.updates);
      
      this.addNotification({
        type: 'tournament_update',
        message: `Tournament update: ${data.message}`,
        timestamp: Date.now()
      });
    }

    this.dispatchEvent('tournamentUpdate', data);
  }

  handleAchievementUnlocked(data) {
    this.addNotification({
      type: 'achievement',
      message: `Achievement unlocked: ${data.achievement.name}!`,
      timestamp: Date.now(),
      achievement: data.achievement
    });

    this.dispatchEvent('achievementUnlocked', data);
  }

  /**
   * Notifications System
   */
  addNotification(notification) {
    const id = Date.now() + Math.random();
    const fullNotification = {
      id,
      ...notification,
      read: false
    };

    this.notifications.queue.push(fullNotification);
    
    // Limit notification queue
    if (this.notifications.queue.length > 50) {
      this.notifications.queue.shift();
    }

    this.dispatchEvent('notification', fullNotification);
    
    return id;
  }

  markNotificationRead(notificationId) {
    const notification = this.notifications.queue.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  clearNotifications() {
    this.notifications.queue = [];
  }

  getUnreadNotifications() {
    return this.notifications.queue.filter(n => !n.read);
  }

  /**
   * Utility Methods
   */
  serializeGameState(gameState) {
    // Create a serializable version of the game state
    return {
      phase: gameState.phase,
      turn: gameState.turn,
      activePlayer: gameState.activePlayer,
      players: gameState.players,
      battlefield: gameState.battlefield,
      // Add other relevant state data
    };
  }

  generateReplayId() {
    return `replay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  dispatchEvent(eventName, data) {
    const event = new CustomEvent(`social:${eventName}`, {
      detail: data,
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  loadUserData() {
    // Load user data from localStorage or server
    const savedData = localStorage.getItem('konivrer_social_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.friends.list = new Map(data.friends || []);
        this.notifications.settings = { ...this.notifications.settings, ...data.notificationSettings };
      } catch (error) {
        console.warn('Failed to load social data:', error);
      }
    }
  }

  saveUserData() {
    const data = {
      friends: Array.from(this.friends.list.entries()),
      notificationSettings: this.notifications.settings
    };
    
    localStorage.setItem('konivrer_social_data', JSON.stringify(data));
  }

  /**
   * Public API
   */
  getFriendsList() {
    return Array.from(this.friends.list.values());
  }

  getOnlineFriends() {
    return this.getFriendsList().filter(friend => 
      this.friends.online.has(friend.id)
    );
  }

  getChatChannels() {
    return Array.from(this.chat.channels.values());
  }

  getActiveSpectators() {
    return Array.from(this.spectating.spectators);
  }

  getSavedReplays() {
    return Array.from(this.replays.savedReplays.entries()).map(([id, replay]) => ({
      id,
      ...replay.metadata
    }));
  }

  isConnected() {
    return this.isConnected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.saveUserData();
  }
}

export default SocialEngine;