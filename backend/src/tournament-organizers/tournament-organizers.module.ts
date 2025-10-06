import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TournamentOrganizer } from './entities/tournament-organizer.entity';
import { TournamentOrganizerService } from './tournament-organizer.service';
import { TournamentOrganizerController } from './tournament-organizer.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TournamentOrganizer]),
  ],
  providers: [TournamentOrganizerService],
  controllers: [TournamentOrganizerController],
  exports: [TournamentOrganizerService],
})
export class TournamentOrganizerModule {}