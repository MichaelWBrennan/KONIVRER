import { Module } from "@nestjs/common";
import { MigrationService } from "./migration.service";
import { MigrationController } from "./migration.controller";
import { CardsModule } from "../cards/cards.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TournamentProfile } from "../progression/entities/tournament-profile.entity";
import { PointHistory } from "../progression/entities/point-history.entity";

@Module({
  imports: [
    CardsModule,
    TypeOrmModule.forFeature([TournamentProfile, PointHistory]),
  ],
  providers: [MigrationService],
  controllers: [MigrationController],
  exports: [MigrationService],
})
export class MigrationModule {}
