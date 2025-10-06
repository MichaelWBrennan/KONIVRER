import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Card } from '../cards/entities/card.entity';
import { Deck } from '../decks/entities/deck.entity';
import { User } from '../users/entities/user.entity';
import { AiOpponentService } from './ai-opponent.service';
import { AiStrategyService } from './services/ai-strategy.service';
import { AiDeckbuildingService } from './services/ai-deckbuilding.service';
import { AiGameplayService } from './services/ai-gameplay.service';
import { AiOpponentController } from './ai-opponent.controller';
import { AiGame } from './entities/ai-game.entity';
import { AiOpponent } from './entities/ai-opponent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, Deck, User, AiGame, AiOpponent]),
    HttpModule,
    ConfigModule,
  ],
  providers: [
    AiOpponentService,
    AiStrategyService,
    AiDeckbuildingService,
    AiGameplayService,
  ],
  controllers: [AiOpponentController],
  exports: [AiOpponentService],
})
export class AiOpponentModule {}