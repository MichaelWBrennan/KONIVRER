import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Tournament, TournamentMatch, TournamentStanding } from './entities/tournament.entity';
import { User } from '../users/entities/user.entity';
import { Deck } from '../decks/entities/deck.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, TournamentMatch, TournamentStanding, User, Deck]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}