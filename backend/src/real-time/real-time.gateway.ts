import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { RealTimeService } from './real-time.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  subscriptions?: Set<string>;
  currentRoom?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/realtime",
})
export class RealTimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealTimeGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();
  private roomSubscriptions = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly realTimeService: RealTimeService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Real-time WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract JWT token from handshake
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;
      client.subscriptions = new Set();

      this.connectedClients.set(client.id, client);

      this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);

      // Send connection confirmation
      client.emit('connected', {
        clientId: client.id,
        userId: client.userId,
        timestamp: new Date(),
      });

      // Send initial data
      await this.sendInitialData(client);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove from all rooms
    if (client.currentRoom) {
      this.leaveRoom(client, client.currentRoom);
    }

    // Clean up subscriptions
    if (client.subscriptions) {
      client.subscriptions.forEach(subscription => {
        this.unsubscribeFromTopic(client, subscription);
      });
    }

    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; roomType: string },
  ) {
    try {
      const { roomId, roomType } = data;

      // Validate room access
      const hasAccess = await this.realTimeService.validateRoomAccess(
        client.userId,
        roomId,
        roomType,
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied to room' });
        return;
      }

      // Leave current room if any
      if (client.currentRoom) {
        this.leaveRoom(client, client.currentRoom);
      }

      // Join new room
      client.join(roomId);
      client.currentRoom = roomId;

      // Track room subscription
      if (!this.roomSubscriptions.has(roomId)) {
        this.roomSubscriptions.set(roomId, new Set());
      }
      this.roomSubscriptions.get(roomId)!.add(client.id);

      client.emit('room_joined', {
        roomId,
        roomType,
        timestamp: new Date(),
      });

      this.logger.log(`Client ${client.id} joined room ${roomId}`);
    } catch (error) {
      this.logger.error(`Join room error: ${error.message}`);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    this.leaveRoom(client, roomId);
  }

  @SubscribeMessage('subscribe_topic')
  async handleSubscribeTopic(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { topic: string },
  ) {
    const { topic } = data;
    this.subscribeToTopic(client, topic);
  }

  @SubscribeMessage('unsubscribe_topic')
  async handleUnsubscribeTopic(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { topic: string },
  ) {
    const { topic } = data;
    this.unsubscribeFromTopic(client, topic);
  }

  @SubscribeMessage('live_game_action')
  async handleLiveGameAction(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { gameId: string; action: any },
  ) {
    try {
      const { gameId, action } = data;

      // Validate game access
      const hasAccess = await this.realTimeService.validateGameAccess(
        client.userId,
        gameId,
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied to game' });
        return;
      }

      // Process game action
      const result = await this.realTimeService.processGameAction(
        gameId,
        action,
        client.userId,
      );

      // Broadcast to room
      this.server.to(`game_${gameId}`).emit('game_action', {
        gameId,
        action,
        result,
        timestamp: new Date(),
      });

      client.emit('action_processed', { success: true, result });
    } catch (error) {
      this.logger.error(`Live game action error: ${error.message}`);
      client.emit('error', { message: 'Failed to process game action' });
    }
  }

  @SubscribeMessage('live_tournament_update')
  async handleLiveTournamentUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { tournamentId: string; update: any },
  ) {
    try {
      const { tournamentId, update } = data;

      // Validate tournament access
      const hasAccess = await this.realTimeService.validateTournamentAccess(
        client.userId,
        tournamentId,
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied to tournament' });
        return;
      }

      // Process tournament update
      const result = await this.realTimeService.processTournamentUpdate(
        tournamentId,
        update,
        client.userId,
      );

      // Broadcast to room
      this.server.to(`tournament_${tournamentId}`).emit('tournament_update', {
        tournamentId,
        update,
        result,
        timestamp: new Date(),
      });

      client.emit('update_processed', { success: true, result });
    } catch (error) {
      this.logger.error(`Live tournament update error: ${error.message}`);
      client.emit('error', { message: 'Failed to process tournament update' });
    }
  }

  @SubscribeMessage('live_chat_message')
  async handleLiveChatMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; message: string; type?: string },
  ) {
    try {
      const { roomId, message, type = 'text' } = data;

      // Validate room access
      const hasAccess = await this.realTimeService.validateRoomAccess(
        client.userId,
        roomId,
        'chat',
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied to chat room' });
        return;
      }

      // Process chat message
      const chatMessage = await this.realTimeService.processChatMessage(
        roomId,
        message,
        type,
        client.userId,
      );

      // Broadcast to room
      this.server.to(roomId).emit('chat_message', {
        roomId,
        message: chatMessage,
        timestamp: new Date(),
      });

      client.emit('message_sent', { success: true });
    } catch (error) {
      this.logger.error(`Live chat message error: ${error.message}`);
      client.emit('error', { message: 'Failed to send chat message' });
    }
  }

  // Helper methods
  private leaveRoom(client: AuthenticatedSocket, roomId: string) {
    client.leave(roomId);
    
    if (client.currentRoom === roomId) {
      client.currentRoom = undefined;
    }

    // Remove from room subscriptions
    if (this.roomSubscriptions.has(roomId)) {
      this.roomSubscriptions.get(roomId)!.delete(client.id);
      if (this.roomSubscriptions.get(roomId)!.size === 0) {
        this.roomSubscriptions.delete(roomId);
      }
    }

    client.emit('room_left', { roomId, timestamp: new Date() });
    this.logger.log(`Client ${client.id} left room ${roomId}`);
  }

  private subscribeToTopic(client: AuthenticatedSocket, topic: string) {
    if (!client.subscriptions) {
      client.subscriptions = new Set();
    }
    client.subscriptions.add(topic);
    client.emit('topic_subscribed', { topic, timestamp: new Date() });
  }

  private unsubscribeFromTopic(client: AuthenticatedSocket, topic: string) {
    if (client.subscriptions) {
      client.subscriptions.delete(topic);
    }
    client.emit('topic_unsubscribed', { topic, timestamp: new Date() });
  }

  private async sendInitialData(client: AuthenticatedSocket) {
    try {
      // Send user's active games
      const activeGames = await this.realTimeService.getUserActiveGames(client.userId);
      client.emit('active_games', activeGames);

      // Send user's tournament updates
      const tournamentUpdates = await this.realTimeService.getUserTournamentUpdates(client.userId);
      client.emit('tournament_updates', tournamentUpdates);

      // Send system status
      const systemStatus = await this.realTimeService.getSystemStatus();
      client.emit('system_status', systemStatus);
    } catch (error) {
      this.logger.error(`Error sending initial data: ${error.message}`);
    }
  }

  // Public methods for broadcasting
  public broadcastToRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
  }

  public broadcastToUser(userId: string, event: string, data: any) {
    const client = Array.from(this.connectedClients.values())
      .find(c => c.userId === userId);
    
    if (client) {
      client.emit(event, data);
    }
  }

  public broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedClients.values())
      .map(client => client.userId)
      .filter(Boolean);
  }

  public getRoomUsers(roomId: string): string[] {
    const room = this.server.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room)
      .map(socketId => this.connectedClients.get(socketId)?.userId)
      .filter(Boolean);
  }
}