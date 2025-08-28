import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DecksService } from "./decks.service";
import { DecksController } from "./decks.controller";
import { Deck } from "./entities/deck.entity";
import { Card } from "../cards/entities/card.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Deck, Card, User])],
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
