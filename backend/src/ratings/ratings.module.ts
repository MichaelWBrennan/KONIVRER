import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { RatingsController } from "./ratings.controller";
import { RatingsService } from "./ratings.service";
import { PlayerRating } from "./entities/rating.entity";
import { RatingHistory } from "./entities/rating-history.entity";
import { MatchmakingModule } from "../matchmaking/matchmaking.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerRating, RatingHistory]),
    MatchmakingModule,
    EventEmitterModule,
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
