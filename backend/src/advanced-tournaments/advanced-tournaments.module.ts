import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TournamentOrganizer } from '../tournament-organizers/entities/tournament-organizer.entity';
import { AdvancedTournament } from './entities/advanced-tournament.entity';
import { TournamentBracket } from './entities/tournament-bracket.entity';
import { TournamentRound } from './entities/tournament-round.entity';
import { TournamentMatch } from './entities/tournament-match.entity';
import { AdvancedTournamentsService } from './advanced-tournaments.service';
import { BracketService } from './services/bracket.service';
import { SwissService } from './services/swiss.service';
import { EliminationService } from './services/elimination.service';
import { RoundRobinService } from './services/round-robin.service';
import { AdvancedTournamentsController } from './advanced-tournaments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      TournamentOrganizer,
      AdvancedTournament,
      TournamentBracket,
      TournamentRound,
      TournamentMatch,
    ]),
  ],
  providers: [
    AdvancedTournamentsService,
    BracketService,
    SwissService,
    EliminationService,
    RoundRobinService,
  ],
  controllers: [AdvancedTournamentsController],
  exports: [AdvancedTournamentsService],
})
export class AdvancedTournamentsModule {}