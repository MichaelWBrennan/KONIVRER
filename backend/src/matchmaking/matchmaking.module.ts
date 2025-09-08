import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchmakingService } from "./matchmaking.service";
import { MatchmakingController } from "./matchmaking.controller";
import { BayesianMatchmakingService } from "./bayesian-matchmaking.service";
import { TelemetryService } from "./telemetry-integration.service";
import { PlayerRating } from "./entities/player-rating.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerRating, User])],
  controllers: [MatchmakingController],
  providers: [MatchmakingService, BayesianMatchmakingService, TelemetryService],
  exports: [MatchmakingService, BayesianMatchmakingService, TelemetryService],
})
export class MatchmakingModule {}
