import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgressionService } from "./progression.service";
import { ProgressionController } from "./progression.controller";
import { TournamentProfile } from "./entities/tournament-profile.entity";
import { PointHistory } from "./entities/point-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TournamentProfile, PointHistory])],
  providers: [ProgressionService],
  controllers: [ProgressionController],
  exports: [ProgressionService],
})
export class ProgressionModule {}
