import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhysicalGameSimulationService } from "./physical-simulation.service";
import { JudgeToolkitService } from "./judge-toolkit.service";
import { PhysicalSimulationController } from "./physical-simulation.controller";
import { Card } from "../cards/entities/card.entity";
import { Deck } from "../decks/entities/deck.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Card, Deck])],
  providers: [PhysicalGameSimulationService, JudgeToolkitService],
  controllers: [PhysicalSimulationController],
  exports: [PhysicalGameSimulationService, JudgeToolkitService],
})
export class PhysicalSimulationModule {}
