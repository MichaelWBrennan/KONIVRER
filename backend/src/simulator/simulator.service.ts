import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Simulation } from "./entities/simulation.entity";
import {
  SimulationConfigDto,
  SimulationResponseDto,
} from "./dto/simulation.dto";
import { DecksService } from "../decks/decks.service";
import { GameSimulatorService } from "../matchmaking/game-simulator.service";

@Injectable()
export class SimulatorService {
  constructor(
    @InjectRepository(Simulation)
    private simulationRepository: Repository<Simulation>,
    private decksService: DecksService,
    private gameSimulator: GameSimulatorService,
    private eventEmitter: EventEmitter2
  ) {}

  async runSimulation(
    config: SimulationConfigDto,
    userId: string
  ): Promise<SimulationResponseDto> {
    // Validate decks exist
    await this.decksService.findOne(config.deckA.deckId, userId);
    await this.decksService.findOne(config.deckB.deckId, userId);

    // Create simulation record
    const simulation = this.simulationRepository.create({
      config,
      status: "queued",
      userId,
    });

    const savedSimulation = await this.simulationRepository.save(simulation);

    // Start simulation asynchronously
    this.processSimulation(savedSimulation.id);

    return {
      simId: savedSimulation.id,
      status: savedSimulation.status,
    };
  }

  async getSimulation(
    simId: string,
    userId: string
  ): Promise<SimulationResponseDto> {
    const simulation = await this.simulationRepository.findOne({
      where: { id: simId, userId },
    });

    if (!simulation) {
      throw new NotFoundException("Simulation not found");
    }

    const response: SimulationResponseDto = {
      simId: simulation.id,
      status: simulation.status,
    };

    if (simulation.result) {
      response.summary = simulation.result;
    }

    return response;
  }

  private async processSimulation(simId: string): Promise<void> {
    try {
      const simulation = await this.simulationRepository.findOne({
        where: { id: simId },
      });

      if (!simulation) {
        return;
      }

      // Update status to running
      await this.simulationRepository.update(simId, { status: "running" });

      // Emit progress event
      this.eventEmitter.emit("simulation.progress", {
        simId,
        status: "running",
        progress: 0,
      });

      // Simulate progress updates
      for (let progress = 25; progress <= 75; progress += 25) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate work
        this.eventEmitter.emit("simulation.progress", {
          simId,
          status: "running",
          progress,
        });
      }

      // Simulate the match (simplified implementation)
      const result = {
        iterations: simulation.config.iterations,
        winRateA: 0.5 + (Math.random() - 0.5) * 0.4, // Random win rate between 30-70%
        avgTurnLength: 6 + Math.random() * 4, // 6-10 turns average
        statBreakdown: {
          deckA_consistency: Math.random(),
          deckB_consistency: Math.random(),
          avgGameDuration: 8 + Math.random() * 10, // 8-18 minutes
        },
      };

      // Update simulation with results
      await this.simulationRepository.update(simId, {
        status: "completed" as any,
        result: result as any,
        completedAt: new Date(),
      });

      // Emit completion event
      this.eventEmitter.emit("simulation.completed", {
        simId,
        status: "completed",
        result,
      });
    } catch (error) {
      await this.simulationRepository.update(simId, {
        status: "failed",
        logs: error.message,
      });
    }
  }
}
