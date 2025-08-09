import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';
import { Simulation } from './entities/simulation.entity';
import { DecksModule } from '../decks/decks.module';
import { MatchmakingModule } from '../matchmaking/matchmaking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Simulation]),
    DecksModule,
    MatchmakingModule,
  ],
  controllers: [SimulatorController],
  providers: [SimulatorService],
  exports: [SimulatorService],
})
export class SimulatorModule {}