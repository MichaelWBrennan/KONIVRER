import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RealTimeService } from './real-time.service';
import { LiveGameService } from './services/live-game.service';
import { LiveTournamentService } from './services/live-tournament.service';
import { LiveChatService } from './services/live-chat.service';
import { RealTimeController } from './real-time.controller';
import { RealTimeGateway } from './real-time.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    RealTimeService,
    LiveGameService,
    LiveTournamentService,
    LiveChatService,
    RealTimeGateway,
  ],
  controllers: [RealTimeController],
  exports: [RealTimeService],
})
export class RealTimeModule {}