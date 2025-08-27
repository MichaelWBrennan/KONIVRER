import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  eventSubscriptions?: Set<string>;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/events",
})
export class EventWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventWebSocketGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log("WebSocket Gateway initialized");
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
      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.sub;
      client.eventSubscriptions = new Set<string>();

      this.connectedClients.set(client.id, client);
      this.logger.log(
        `Client connected: ${client.id} (User: ${client.userId})`
      );

      // Send initial connection confirmation
      client.emit("connected", {
        clientId: client.id,
        userId: client.userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.warn(
        `Authentication failed for client ${client.id}: ${
          (error as Error).message || "Unknown error"
        }`
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("subscribeToUser")
  handleUserSubscription(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    // Only allow users to subscribe to their own notifications
    if (client.userId !== data.userId) {
      client.emit("error", {
        message: "Cannot subscribe to another user's notifications",
      });
      return;
    }

    client.join(`user:${data.userId}:notifications`);
    client.emit("subscribed", {
      channel: `user:${data.userId}:notifications`,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Client ${client.id} subscribed to user notifications`);
  }

  @SubscribeMessage("subscribeToSim")
  handleSimSubscription(
    @MessageBody() data: { simId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!data.simId) {
      client.emit("error", { message: "Simulation ID is required" });
      return;
    }

    client.join(`sim:${data.simId}`);
    client.emit("subscribed", {
      channel: `sim:${data.simId}`,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Client ${client.id} subscribed to simulation ${data.simId}`
    );
  }

  @SubscribeMessage("subscribeToAuditLogs")
  handleAuditSubscription(
    @MessageBody() data: {},
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    // Would need to verify admin permissions here
    client.join("agent:audits");
    client.emit("subscribed", {
      channel: "agent:audits",
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Client ${client.id} subscribed to audit logs`);
  }

  @SubscribeMessage("subscribeToEvent")
  handleEventSubscription(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!data.eventId) {
      client.emit("error", { message: "Event ID is required" });
      return;
    }

    // Add to event subscription
    client.eventSubscriptions?.add(data.eventId);
    client.join(`event:${data.eventId}`);

    client.emit("subscribed", {
      eventId: data.eventId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Client ${client.id} subscribed to event ${data.eventId}`);
  }

  @SubscribeMessage("unsubscribeFromEvent")
  handleEventUnsubscription(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!data.eventId) {
      client.emit("error", { message: "Event ID is required" });
      return;
    }

    client.eventSubscriptions?.delete(data.eventId);
    client.leave(`event:${data.eventId}`);

    client.emit("unsubscribed", {
      eventId: data.eventId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Client ${client.id} unsubscribed from event ${data.eventId}`
    );
  }

  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit("pong", { timestamp: new Date().toISOString() });
  }

  // Event listeners for real-time updates
  @OnEvent("event.created")
  handleEventCreated(payload: any) {
    this.server.emit("eventCreated", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("event.updated")
  handleEventUpdated(payload: any) {
    this.server.to(`event:${payload.event.id}`).emit("eventUpdated", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("event.registration")
  handleEventRegistration(payload: any) {
    this.server.to(`event:${payload.eventId}`).emit("newRegistration", {
      ...payload,
      timestamp: new Date().toISOString(),
    });

    // Notify waitlisted users
    if (payload.isWaitlisted) {
      this.notifyUser(payload.userId, "waitlisted", {
        eventId: payload.eventId,
        message: "You have been added to the waitlist",
        timestamp: new Date().toISOString(),
      });
    }
  }

  @OnEvent("event.waitlist.activated")
  handleWaitlistActivation(payload: any) {
    this.notifyUser(payload.userId, "waitlistActivated", {
      eventId: payload.eventId,
      message: "You have been moved from waitlist to registered!",
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("event.checkin")
  handlePlayerCheckIn(payload: any) {
    this.server.to(`event:${payload.eventId}`).emit("playerCheckedIn", {
      ...payload,
      timestamp: new Date().toISOString(),
    });

    this.notifyUser(payload.userId, "checkedIn", {
      eventId: payload.eventId,
      message: "You have been checked in successfully",
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("event.pairings.published")
  handlePairingsPublished(payload: any) {
    this.server.to(`event:${payload.eventId}`).emit("pairingsPublished", {
      ...payload,
      timestamp: new Date().toISOString(),
    });

    // Notify individual players about their matches
    for (const pairing of payload.pairings) {
      if (pairing.playerAId) {
        this.notifyUser(pairing.playerAId, "newPairing", {
          eventId: payload.eventId,
          round: payload.round,
          tableNumber: pairing.tableNumber,
          opponentId: pairing.playerBId,
          isBye: pairing.isBye,
          timestamp: new Date().toISOString(),
        });
      }

      if (pairing.playerBId) {
        this.notifyUser(pairing.playerBId, "newPairing", {
          eventId: payload.eventId,
          round: payload.round,
          tableNumber: pairing.tableNumber,
          opponentId: pairing.playerAId,
          isBye: false,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  @OnEvent("event.match.result")
  handleMatchResult(payload: any) {
    this.server.to(`event:${payload.eventId}`).emit("matchResult", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("event.judge.ruling")
  handleJudgeRuling(payload: any) {
    this.server.to(`event:${payload.eventId}`).emit("judgeRuling", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("event.round.completed")
  handleRoundCompleted(payload: any) {
    this.server.to(`event:${payload.eventId}`).emit("roundCompleted", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("simulation.progress")
  handleSimulationProgress(payload: any) {
    this.server.to(`sim:${payload.simId}`).emit("simulationProgress", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("simulation.completed")
  handleSimulationCompleted(payload: any) {
    this.server.to(`sim:${payload.simId}`).emit("simulationCompleted", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("audit.log")
  handleAuditLog(payload: any) {
    // Include provenance field for traceability
    this.server.to("agent:audits").emit("auditLog", {
      ...payload,
      provenance: payload.provenance,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("rating.updated")
  handleRatingUpdate(payload: any) {
    this.notifyUser(payload.userId, "ratingUpdated", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent("event.completed")
  handleEventCompleted(payload: any) {
    this.server.to(`event:${payload.eventId}`).emit("eventCompleted", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  // Utility methods
  private notifyUser(userId: string, event: string, data: any) {
    // Find all sockets for this user
    const userSockets = Array.from(this.connectedClients.values()).filter(
      (socket) => socket.userId === userId
    );

    userSockets.forEach((socket) => {
      socket.emit(event, data);
    });
  }

  // Admin broadcasts
  @SubscribeMessage("adminBroadcast")
  handleAdminBroadcast(
    @MessageBody() data: { eventId?: string; message: string; type: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    // Would need to verify admin permissions here
    const broadcastData = {
      ...data,
      timestamp: new Date().toISOString(),
      from: "admin",
    };

    if (data.eventId) {
      this.server
        .to(`event:${data.eventId}`)
        .emit("adminMessage", broadcastData);
    } else {
      this.server.emit("adminMessage", broadcastData);
    }
  }

  // Get connection statistics
  getConnectionStats() {
    const eventSubscriptions = new Map<string, number>();

    this.connectedClients.forEach((client) => {
      client.eventSubscriptions?.forEach((eventId) => {
        eventSubscriptions.set(
          eventId,
          (eventSubscriptions.get(eventId) || 0) + 1
        );
      });
    });

    return {
      totalConnections: this.connectedClients.size,
      eventSubscriptions: Object.fromEntries(eventSubscriptions),
      timestamp: new Date().toISOString(),
    };
  }
}
