/**
 * Real-time Collaboration Engine
 * Industry-leading real-time features with WebRTC and WebSockets
 */

import { io, Socket } from 'socket.io-client';

export interface CollaborationEvent {
  id: string;
  type: string;
  userId: string;
  userName: string;
  timestamp: number;
  data: any;
  sessionId: string;
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  selection?: any;
  status: 'active' | 'idle' | 'away';
  lastSeen: number;
}

export interface CollaborationSession {
  id: string;
  name: string;
  type: 'deck-building' | 'game' | 'tournament';
  users: CollaborationUser[];
  owner: string;
  isPublic: boolean;
  createdAt: number;
  lastActivity: number;
}

export class RealTimeCollaborationEngine {
  private socket: Socket | null = null;
  private currentSession: CollaborationSession | null = null;
  private localUser: CollaborationUser | null = null;
  private eventListeners: Map<string, Set<(event: CollaborationEvent) => void>> = new Map();
  private userListeners: Set<(users: CollaborationUser[]) => void> = new Set();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private serverUrl: string = 'wss://api.konivrer.com') {
    this.setupConnectionHandlers();
  }

  public async connect(user: CollaborationUser): Promise<void> {
    if (this.isConnected) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.localUser = user;
      
      this.socket = io(this.serverUrl, {
        auth: {
          userId: user.id,
          userName: user.name,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log('🔗 Real-time collaboration connected');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Collaboration connection failed:', error);
        reject(error);
      });

      this.setupEventHandlers();
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentSession = null;
    console.log('🔌 Disconnected from collaboration server');
  }

  public async createSession(sessionData: Partial<CollaborationSession>): Promise<CollaborationSession> {
    if (!this.socket || !this.localUser) {
      throw new Error('Not connected to collaboration server');
    }

    return new Promise((resolve, reject) => {
      const session: Partial<CollaborationSession> = {
        ...sessionData,
        owner: this.localUser!.id,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        users: [this.localUser!],
      };

      this.socket!.emit('create_session', session, (response: any) => {
        if (response.success) {
          this.currentSession = response.session;
          console.log('🎮 Collaboration session created:', response.session.id);
          resolve(response.session);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  public async joinSession(sessionId: string): Promise<CollaborationSession> {
    if (!this.socket || !this.localUser) {
      throw new Error('Not connected to collaboration server');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('join_session', { sessionId, user: this.localUser }, (response: any) => {
        if (response.success) {
          this.currentSession = response.session;
          console.log('🎮 Joined collaboration session:', sessionId);
          resolve(response.session);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  public async leaveSession(): Promise<void> {
    if (!this.socket || !this.currentSession) {
      return;
    }

    return new Promise((resolve) => {
      this.socket!.emit('leave_session', { sessionId: this.currentSession!.id }, () => {
        console.log('👋 Left collaboration session');
        this.currentSession = null;
        resolve();
      });
    });
  }

  public broadcastEvent(type: string, data: any): void {
    if (!this.socket || !this.currentSession || !this.localUser) {
      return;
    }

    const event: CollaborationEvent = {
      id: crypto.randomUUID(),
      type,
      userId: this.localUser.id,
      userName: this.localUser.name,
      timestamp: Date.now(),
      data,
      sessionId: this.currentSession.id,
    };

    this.socket.emit('broadcast_event', event);
  }

  public updateCursor(position: { x: number; y: number }): void {
    if (!this.localUser || !this.currentSession) {
      return;
    }

    this.localUser.cursor = position;
    this.broadcastEvent('cursor_move', { position });
  }

  public updateSelection(selection: any): void {
    if (!this.localUser || !this.currentSession) {
      return;
    }

    this.localUser.selection = selection;
    this.broadcastEvent('selection_change', { selection });
  }

  public sendDeckUpdate(deck: any): void {
    this.broadcastEvent('deck_update', { deck });
  }

  public sendCardMove(cardId: string, from: string, to: string): void {
    this.broadcastEvent('card_move', { cardId, from, to });
  }

  public sendGameAction(action: string, data: any): void {
    this.broadcastEvent('game_action', { action, data });
  }

  public sendChatMessage(message: string): void {
    this.broadcastEvent('chat_message', { message });
  }

  public addEventListener(eventType: string, listener: (event: CollaborationEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    
    this.eventListeners.get(eventType)!.add(listener);
    
    return () => {
      this.eventListeners.get(eventType)?.delete(listener);
    };
  }

  public addUserListener(listener: (users: CollaborationUser[]) => void): () => void {
    this.userListeners.add(listener);
    return () => this.userListeners.delete(listener);
  }

  public getCurrentSession(): CollaborationSession | null {
    return this.currentSession;
  }

  public getUsers(): CollaborationUser[] {
    return this.currentSession?.users || [];
  }

  public isUserOnline(userId: string): boolean {
    return this.getUsers().some(user => user.id === userId && user.status === 'active');
  }

  private setupConnectionHandlers(): void {
    // Handle browser visibility changes
    document.addEventListener('visibilitychange', () => {
      if (this.localUser) {
        this.localUser.status = document.hidden ? 'away' : 'active';
        this.broadcastEvent('user_status', { status: this.localUser.status });
      }
    });

    // Handle mouse movement for cursor tracking
    document.addEventListener('mousemove', (event) => {
      if (this.currentSession && Date.now() % 10 === 0) { // Throttle to 10% of events
        this.updateCursor({ x: event.clientX, y: event.clientY });
      }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('🔌 Disconnected from collaboration server');
      this.attemptReconnect();
    });

    this.socket.on('collaboration_event', (event: CollaborationEvent) => {
      // Don't process our own events
      if (event.userId === this.localUser?.id) {
        return;
      }

      const listeners = this.eventListeners.get(event.type);
      if (listeners) {
        listeners.forEach(listener => listener(event));
      }

      // Handle special events
      this.handleSpecialEvent(event);
    });

    this.socket.on('user_joined', (user: CollaborationUser) => {
      if (this.currentSession) {
        this.currentSession.users.push(user);
        this.notifyUserListeners();
        console.log('👋 User joined:', user.name);
      }
    });

    this.socket.on('user_left', (userId: string) => {
      if (this.currentSession) {
        this.currentSession.users = this.currentSession.users.filter(u => u.id !== userId);
        this.notifyUserListeners();
        console.log('👋 User left:', userId);
      }
    });

    this.socket.on('user_updated', (user: CollaborationUser) => {
      if (this.currentSession) {
        const index = this.currentSession.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.currentSession.users[index] = user;
          this.notifyUserListeners();
        }
      }
    });

    this.socket.on('session_updated', (session: CollaborationSession) => {
      this.currentSession = session;
      this.notifyUserListeners();
    });
  }

  private handleSpecialEvent(event: CollaborationEvent): void {
    switch (event.type) {
      case 'cursor_move':
        this.updateUserCursor(event.userId, event.data.position);
        break;
      case 'selection_change':
        this.updateUserSelection(event.userId, event.data.selection);
        break;
      case 'user_status':
        this.updateUserStatus(event.userId, event.data.status);
        break;
    }
  }

  private updateUserCursor(userId: string, position: { x: number; y: number }): void {
    if (this.currentSession) {
      const user = this.currentSession.users.find(u => u.id === userId);
      if (user) {
        user.cursor = position;
        user.lastSeen = Date.now();
      }
    }
  }

  private updateUserSelection(userId: string, selection: any): void {
    if (this.currentSession) {
      const user = this.currentSession.users.find(u => u.id === userId);
      if (user) {
        user.selection = selection;
        user.lastSeen = Date.now();
      }
    }
  }

  private updateUserStatus(userId: string, status: CollaborationUser['status']): void {
    if (this.currentSession) {
      const user = this.currentSession.users.find(u => u.id === userId);
      if (user) {
        user.status = status;
        user.lastSeen = Date.now();
      }
    }
  }

  private notifyUserListeners(): void {
    if (this.currentSession) {
      this.userListeners.forEach(listener => listener(this.currentSession!.users));
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.localUser) {
        this.connect(this.localUser).catch(console.error);
      }
    }, delay);
  }
}

// Global instance
export const collaborationEngine = new RealTimeCollaborationEngine();