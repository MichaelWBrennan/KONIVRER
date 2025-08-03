import { io, Socket } from 'socket.io-client';

export interface Player {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  status: 'online' | 'in-game' | 'away';
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  gameMode: 'casual' | 'ranked' | 'tournament';
  status: 'waiting' | 'in-progress' | 'finished';
}

export interface GameAction {
  type: 'play-card' | 'attack' | 'end-turn' | 'surrender' | 'chat';
  playerId: string;
  data: any;
  timestamp: number;
}

export interface MatchState {
  roomId: string;
  players: Player[];
  currentTurn: string;
  turnNumber: number;
  gamePhase: 'mulligan' | 'main' | 'combat' | 'end';
  playerStates: Map<string, PlayerState>;
}

export interface PlayerState {
  health: number;
  mana: number;
  cardsInHand: number;
  cardsInDeck: number;
  boardState: any[];
}

export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emote' | 'system';
}

export class RealtimeMultiplayer {
  private bayesNetwork: BayesianNetwork | null = null;
  private rlAgent = new MatchmakingRLAgent();
  private graphEmbedder = new GraphEmbedder();
  private analytics = new RealTimeAnalytics();

  constructor(private serverUrl: string = 'ws://0.0.0.0:5000') {
    this.initializeBayesianNetwork();
  }

  private initializeBayesianNetwork() {
    // Define and enhance Bayesian network here
  }

  async findMatch(gameMode: 'casual' | 'ranked' | 'tournament' = 'casual'): Promise<void> {
    if (!this.isConnected || !this.socket || !this.bayesNetwork) return;

    const playerSkill = this.estimatePlayerSkill(this.currentPlayer);
    const rlDecision = this.rlAgent.decide(playerSkill, this.matchState);
    const embeddings = this.graphEmbedder.generateEmbeddings(this.currentRoom.players, this.currentRoom);
    const probabilities = this.bayesNetwork.infer({
      player_skill: playerSkill,
      game_mode: gameMode,
    });

    this.socket.emit('find_match', { gameMode, probabilities, embeddings, rlDecision });
    this.analytics.logMatchmakingDecision(gameMode, rlDecision, probabilities, this.currentPlayer.id);

    console.log(`Advanced Matchmaking: Mode: ${gameMode}, PlayerSkill: ${playerSkill}, Probabilities: ${JSON.stringify(probabilities)}`);
  }

  async connect(player: Player): Promise<boolean> {
    try {
      this.socket = io(this.serverUrl, {
        transports: ['websocket'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.currentPlayer = player;
      this.setupEventListeners();

      return new Promise(resolve => {
        this.socket!.on('connect', () => {
          console.log('Connected to multiplayer server');
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Authenticate player
          this.socket!.emit('authenticate', player);
          resolve(true);
        });

        this.socket!.on('connect_error', error => {
          console.error('Connection failed:', error);
          this.isConnected = false;
          resolve(false);
        });
      });
    } catch (error) {
      console.error('Failed to connect to multiplayer server:', error);
      return false;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', reason => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
      this.emit('disconnected', reason);
    });

    this.socket.on('reconnect', attemptNumber => {
      console.log('Reconnected to server after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.emit('reconnected', attemptNumber);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect to server');
      this.emit('reconnect_failed');
    });

    // Authentication events
    this.socket.on('authenticated', playerData => {
      console.log('Player authenticated:', playerData);
      this.currentPlayer = playerData;
      this.emit('authenticated', playerData);
    });

    this.socket.on('authentication_failed', error => {
      console.error('Authentication failed:', error);
      this.emit('authentication_failed', error);
    });

    // Room events
    this.socket.on('room_joined', (room: GameRoom) => {
      console.log('Joined room:', room);
      this.currentRoom = room;
      this.emit('room_joined', room);
    });

    this.socket.on('room_left', (roomId: string) => {
      console.log('Left room:', roomId);
      this.currentRoom = null;
      this.emit('room_left', roomId);
    });

    this.socket.on('room_updated', (room: GameRoom) => {
      console.log('Room updated:', room);
      this.currentRoom = room;
      this.emit('room_updated', room);
    });

    this.socket.on('player_joined', (player: Player) => {
      console.log('Player joined:', player);
      this.emit('player_joined', player);
    });

    this.socket.on('player_left', (playerId: string) => {
      console.log('Player left:', playerId);
      this.emit('player_left', playerId);
    });

    // Game events
    this.socket.on('game_started', (matchState: MatchState) => {
      console.log('Game started:', matchState);
      this.matchState = matchState;
      this.emit('game_started', matchState);
    });

    this.socket.on('game_action', (action: GameAction) => {
      console.log('Game action received:', action);
      this.handleGameAction(action);
      this.emit('game_action', action);
    });

    this.socket.on('game_state_updated', (newState: MatchState) => {
      console.log('Game state updated:', newState);
      this.matchState = newState;
      this.emit('game_state_updated', newState);
    });

    this.socket.on('game_ended', (result: any) => {
      console.log('Game ended:', result);
      this.matchState = null;
      this.emit('game_ended', result);
    });

    // Chat events
    this.socket.on('chat_message', (message: ChatMessage) => {
      console.log('Chat message:', message);
      this.emit('chat_message', message);
    });

    // Spectator events
    this.socket.on('spectator_joined', (spectator: Player) => {
      console.log('Spectator joined:', spectator);
      this.emit('spectator_joined', spectator);
    });

    this.socket.on('spectator_left', (spectatorId: string) => {
      console.log('Spectator left:', spectatorId);
      this.emit('spectator_left', spectatorId);
    });

    // Error events
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });
  }

  // Room management
  async createRoom(roomConfig: {
    name: string;
    maxPlayers: number;
    gameMode: 'casual' | 'ranked' | 'tournament';
    password?: string;
  }): Promise<GameRoom | null> {
    if (!this.isConnected || !this.socket) return null;

    return new Promise(resolve => {
      this.socket!.emit('create_room', roomConfig);

      this.socket!.once('room_created', (room: GameRoom) => {
        resolve(room);
      });

      this.socket!.once('room_creation_failed', (error: any) => {
        console.error('Room creation failed:', error);
        resolve(null);
      });
    });
  }

  async joinRoom(roomId: string, password?: string): Promise<boolean> {
    if (!this.isConnected || !this.socket) return false;

    return new Promise(resolve => {
      this.socket!.emit('join_room', { roomId, password });

      this.socket!.once('room_joined', () => {
        resolve(true);
      });

      this.socket!.once('join_room_failed', (error: any) => {
        console.error('Failed to join room:', error);
        resolve(false);
      });
    });
  }

  async leaveRoom(): Promise<void> {
    if (!this.isConnected || !this.socket || !this.currentRoom) return;

    this.socket.emit('leave_room', this.currentRoom.id);
  }

  async getRoomList(): Promise<GameRoom[]> {
    if (!this.isConnected || !this.socket) return [];

    return new Promise(resolve => {
      this.socket!.emit('get_room_list');

      this.socket!.once('room_list', (rooms: GameRoom[]) => {
        resolve(rooms);
      });
    });
  }

  // Game actions
  async sendGameAction(
    action: Omit<GameAction, 'playerId' | 'timestamp'>,
  ): Promise<void> {
    if (
      !this.isConnected ||
      !this.socket ||
      !this.currentPlayer ||
      !this.matchState
    )
      return;

    const fullAction: GameAction = {
      ...action,
      playerId: this.currentPlayer.id,
      timestamp: Date.now(),
    };

    this.socket.emit('game_action', fullAction);
  }

  async playCard(
    cardId: string,
    targetId?: string,
    position?: { x: number; y: number },
  ): Promise<void> {
    await this.sendGameAction({
      type: 'play-card',
      data: { cardId, targetId, position },
    });
  }

  async attack(attackerId: string, targetId: string): Promise<void> {
    await this.sendGameAction({
      type: 'attack',
      data: { attackerId, targetId },
    });
  }

  async endTurn(): Promise<void> {
    await this.sendGameAction({
      type: 'end-turn',
      data: {},
    });
  }

  async surrender(): Promise<void> {
    await this.sendGameAction({
      type: 'surrender',
      data: {},
    });
  }

  // Chat functionality
  async sendChatMessage(
    message: string,
    type: 'text' | 'emote' = 'text',
  ): Promise<void> {
    if (!this.isConnected || !this.socket || !this.currentPlayer) return;

    const chatMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      playerId: this.currentPlayer.id,
      username: this.currentPlayer.username,
      message,
      type,
    };

    this.socket.emit('chat_message', chatMessage);
  }

  // Spectator functionality
  async spectateRoom(roomId: string): Promise<boolean> {
    if (!this.isConnected || !this.socket) return false;

    return new Promise(resolve => {
      this.socket!.emit('spectate_room', roomId);

      this.socket!.once('spectating_started', () => {
        resolve(true);
      });

      this.socket!.once('spectating_failed', (error: any) => {
        console.error('Failed to spectate room:', error);
        resolve(false);
      });
    });
  }

  async stopSpectating(): Promise<void> {
    if (!this.isConnected || !this.socket) return;

    this.socket.emit('stop_spectating');
  }
}

// Singleton instance
export const multiplayerClient = new RealtimeMultiplayer();
