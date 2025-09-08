import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiDeckbuildingService } from "./ai-deckbuilding.service";
import { AiDeckbuildingController } from "./ai-deckbuilding.controller";
import { User } from "../users/entities/user.entity";
import { Deck } from "../decks/entities/deck.entity";
import { Card } from "../cards/entities/card.entity";
import { MatchmakingModule } from "../matchmaking/matchmaking.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Deck, Card]), MatchmakingModule],
  providers: [AiDeckbuildingService],
  controllers: [AiDeckbuildingController],
  exports: [AiDeckbuildingService],
})
export class AiDeckbuildingModule {}
