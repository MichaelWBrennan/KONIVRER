import { io, Socket } from 'socket.io-client';
import { Card } from '../data/cards';

// Real-time multiplayer system with advanced features
export interface GameState {
  id: string;
  players: Player[];
  currentPlayer: string;
  phase: 'waiting' | 'mulligan' | 'playing' | 'ended';
  turn: number;
  timeRemaining: number;
  board: BoardState;
  spectators: Spectator[];
  tournament?: TournamentInfo;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  deck: Card[];
  hand: Card[];
  health: number;
  mana: number;
  maxMana: number;
  isReady: boolean;
  isConnected: boolean;
  rating: number;
  wins: number;
  losses: number;
}

export interface BoardState {
  playerFields: Map<string, Card[]>;
  graveyard: Map<string, Card[]>;
  effects: ActiveEffect[];
}

export interface ActiveEffect {
  id: string;
  type: string;
  source: Card;
  target?: string;
  duration: number;
  properties: any;
}

export interface Spectator {
  id: string;
  name: string;
  avatar?: string;
}

export interface TournamentInfo {
  id: string;
  name: string;
  round: number;
  bracket: string;
}

export interface MatchmakingPreferences {
  gameMode: 'casual' | 'ranked' | 'tournament';
  skillRange: 'any' | 'similar' | 'exact';
  maxWaitTime: number;
  preferredOpponents: string[];
  blockedOpponents: string[];
}

export class RealtimeMultiplayer {
  private static instance: RealtimeMultiplayer;
  private socket: Socket | null = null;
  private currentGame: GameState | null = null;
  private playerId: string | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private latencyHistory: number[] = [];
  private eventHandlers: Map<string, Function[]> = new Map();

  private constructor() {}

  public static getInstance(): RealtimeMultiplayer {
    if (!RealtimeMultiplayer.instance) {
      RealtimeMultiplayer.instance = new RealtimeMultiplayer();
    }
    return RealtimeMultiplayer.instance;
  }

  // Connect to multiplayer server
  public async connect(serverUrl: string, authToken: string): Promise<void> {
    if (this.socket?.connected) {
      console.log('Already connected to multiplayer server');
      return;
    }

    try {
      this.socket = io(serverUrl, {
        auth: { token: authToken },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 10000,
        forceNew: false,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });

      this.setupEventHandlers();
      this.startHeartbeat();

      return new Promise((resolve, reject) => {
        this.socket!.on('connect', () => {
          console.log('Connected to multiplayer server');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);
      });
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  // Setup event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
      this.emit('disconnected', { reason });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.emit('reconnected', { attemptNumber });
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('connectionLost', { error });
      }
    });

    // Game events
    this.socket.on('gameFound', (gameData: GameState) => {
      console.log('Game found:', gameData);
      this.currentGame = gameData;
      this.emit('gameFound', gameData);
    });

    this.socket.on('gameStateUpdate', (gameState: GameState) => {
      this.currentGame = gameState;
      this.emit('gameStateUpdate', gameState);
    });

    this.socket.on('playerJoined', (player: Player) => {
      console.log('Player joined:', player);
      this.emit('playerJoined', player);
    });

    this.socket.on('playerLeft', (playerId: string) => {
      console.log('Player left:', playerId);
      this.emit('playerLeft', { playerId });
    });

    this.socket.on('cardPlayed', (data: any) => {
      this.emit('cardPlayed', data);
    });

    this.socket.on('turnChanged', (data: any) => {
      this.emit('turnChanged', data);
    });

    this.socket.on('gameEnded', (result: any) => {
      console.log('Game ended:', result);
      this.currentGame = null;
      this.emit('gameEnded', result);
    });

    // Spectator events
    this.socket.on('spectatorJoined', (spectator: Spectator) => {
      this.emit('spectatorJoined', spectator);
    });

    this.socket.on('spectatorLeft', (spectatorId: string) => {
      this.emit('spectatorLeft', { spectatorId });
    });

    // Chat events
    this.socket.on('chatMessage', (message: any) => {
      this.emit('chatMessage', message);
    });

    this.socket.on('emoteReceived', (emote: any) => {
      this.emit('emoteReceived', emote);
    });

    // Tournament events
    this.socket.on('tournamentUpdate', (tournament: any) => {
      this.emit('tournamentUpdate', tournament);
    });

    this.socket.on('bracketUpdate', (bracket: any) => {
      this.emit('bracketUpdate', bracket);
    });

    // Latency measurement
    this.socket.on('pong', (timestamp: number) => {
      const latency = Date.now() - timestamp;
      this.latencyHistory.push(latency);
      if (this.latencyHistory.length > 10) {
        this.latencyHistory.shift();
      }
      this.emit('latencyUpdate', { latency, average: this.getAverageLatency() });
    });

    // Error handling
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    this.socket.on('gameError', (error: any) => {
      console.error('Game error:', error);
      this.emit('gameError', error);
    });
  }

  // Start matchmaking
  public async startMatchmaking(preferences: MatchmakingPreferences): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('startMatchmaking', preferences, (response: any) => {
        if (response.success) {
          console.log('Matchmaking started');
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Cancel matchmaking
  public cancelMatchmaking(): void {
    if (this.socket?.connected) {
      this.socket.emit('cancelMatchmaking');
    }
  }

  // Join game as spectator
  public async spectateGame(gameId: string): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('spectateGame', { gameId }, (response: any) => {
        if (response.success) {
          this.currentGame = response.gameState;
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Play a card
  public async playCard(cardId: string, target?: string, position?: { x: number; y: number }): Promise<void> {
    if (!this.socket?.connected || !this.currentGame) {
      throw new Error('Not in a game');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('playCard', {
        gameId: this.currentGame!.id,
        cardId,
        target,
        position
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // End turn
  public async endTurn(): Promise<void> {
    if (!this.socket?.connected || !this.currentGame) {
      throw new Error('Not in a game');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('endTurn', {
        gameId: this.currentGame!.id
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Mulligan cards
  public async mulligan(cardsToReplace: string[]): Promise<void> {
    if (!this.socket?.connected || !this.currentGame) {
      throw new Error('Not in a game');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('mulligan', {
        gameId: this.currentGame!.id,
        cardsToReplace
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Send chat message
  public sendChatMessage(message: string, type: 'all' | 'team' | 'spectators' = 'all'): void {
    if (this.socket?.connected && this.currentGame) {
      this.socket.emit('chatMessage', {
        gameId: this.currentGame.id,
        message,
        type
      });
    }
  }

  // Send emote
  public sendEmote(emoteId: string, target?: string): void {
    if (this.socket?.connected && this.currentGame) {
      this.socket.emit('sendEmote', {
        gameId: this.currentGame.id,
        emoteId,
        target
      });
    }
  }

  // Concede game
  public async concede(): Promise<void> {
    if (!this.socket?.connected || !this.currentGame) {
      throw new Error('Not in a game');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('concede', {
        gameId: this.currentGame!.id
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Request game pause
  public async requestPause(): Promise<void> {
    if (!this.socket?.connected || !this.currentGame) {
      throw new Error('Not in a game');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('requestPause', {
        gameId: this.currentGame!.id
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Join tournament
  public async joinTournament(tournamentId: string, deckId: string): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('joinTournament', {
        tournamentId,
        deckId
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Leave tournament
  public async leaveTournament(tournamentId: string): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('leaveTournament', {
        tournamentId
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Get tournament brackets
  public async getTournamentBrackets(tournamentId: string): Promise<any> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('getTournamentBrackets', {
        tournamentId
      }, (response: any) => {
        if (response.success) {
          resolve(response.brackets);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Get player statistics
  public async getPlayerStats(playerId?: string): Promise<any> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('getPlayerStats', {
        playerId: playerId || this.playerId
      }, (response: any) => {
        if (response.success) {
          resolve(response.stats);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Get leaderboard
  public async getLeaderboard(type: 'global' | 'friends' | 'tournament' = 'global'): Promise<any> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('getLeaderboard', { type }, (response: any) => {
        if (response.success) {
          resolve(response.leaderboard);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Start heartbeat to maintain connection
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping', Date.now());
      }
    }, 30000); // Every 30 seconds
  }

  // Get current latency
  public getCurrentLatency(): number {
    return this.latencyHistory.length > 0 ? 
           this.latencyHistory[this.latencyHistory.length - 1] : 0;
  }

  // Get average latency
  public getAverageLatency(): number {
    if (this.latencyHistory.length === 0) return 0;
    return this.latencyHistory.reduce((sum, lat) => sum + lat, 0) / this.latencyHistory.length;
  }

  // Event system
  public on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  // Get connection status
  public isConnectedToServer(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get current game
  public getCurrentGame(): GameState | null {
    return this.currentGame;
  }

  // Get player ID
  public getPlayerId(): string | null {
    return this.playerId;
  }

  // Disconnect from server
  public disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
    this.currentGame = null;
    this.playerId = null;
    this.eventHandlers.clear();
  }

  // Cleanup
  public dispose(): void {
    this.disconnect();
  }
}

// Export singleton instance
export const multiplayerSystem = RealtimeMultiplayer.getInstance();