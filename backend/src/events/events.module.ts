import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerModule } from "@nestjs/throttler";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import {
  Event,
  EventRegistration,
  Pairing,
  Match,
  Judging,
  AuditLog,
} from "./entities/event.entity";
import { User } from "../users/entities/user.entity";
import { Deck } from "../decks/entities/deck.entity";
import { MatchmakingModule } from "../matchmaking/matchmaking.module";
import { AuditModule } from "../audit/audit.module";
import { EventWebSocketGateway } from "./event-websocket.gateway";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventRegistration,
      Pairing,
      Match,
      Judging,
      AuditLog,
      User,
      Deck,
    ]),
    MatchmakingModule,
    AuditModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000, // 1 second
        limit: 3,
      },
      {
        name: "medium",
        ttl: 10000, // 10 seconds
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventWebSocketGateway],
  exports: [EventsService],
})
export class EventsModule {}
