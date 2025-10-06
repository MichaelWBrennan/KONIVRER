import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { CardsResolver } from "./resolvers/cards.resolver";
import { CardDatabaseService } from "./services/card-database.service";
import { Card } from "./entities/card.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CardsController],
  providers: [CardsService, CardsResolver, CardDatabaseService],
  exports: [CardsService, CardDatabaseService],
})
export class CardsModule {}
