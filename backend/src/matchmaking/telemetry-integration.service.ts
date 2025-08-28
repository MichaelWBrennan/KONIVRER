import { Injectable } from "@nestjs/common";

export interface MatchResultTelemetry {
  format: string;
  playerCount: number;
  averageSkill: number;
  averageUncertainty: number;
  ratingChanges: {
    userId: string;
    skillChange: number;
    uncertaintyChange: number;
  }[];
  timestamp: Date;
}

export interface PairingGenerationTelemetry {
  tournamentId?: string;
  round?: number;
  pairingCount: number;
  overallQuality: number;
  algorithm: string;
  qualityDistribution: number[];
  timestamp: Date;
}

export interface SimulationTelemetry {
  player1Id: string;
  player2Id: string;
  format: string;
  numberOfGames: number;
  predictedWinRate: number;
  actualWinRate: number;
  accuracy: number;
  timestamp: Date;
}

@Injectable()
export class TelemetryService {
  private telemetryBuffer: any[] = [];
  private readonly bufferLimit = 100;
  private readonly flushInterval = 60000; // 1 minute

  constructor() {
    // Start periodic flush
    setInterval(() => this.flushTelemetry(), this.flushInterval);
  }

  async recordMatchResult(data: MatchResultTelemetry): Promise<void> {
    this.addToBuffer("match_result", data);
  }

  async recordPairingGeneration(
    data: PairingGenerationTelemetry
  ): Promise<void> {
    this.addToBuffer("pairing_generation", data);
  }

  async recordSimulation(data: SimulationTelemetry): Promise<void> {
    this.addToBuffer("simulation", data);
  }

  async recordRatingUpdate(data: {
    userId: string;
    format: string;
    oldRating: number;
    newRating: number;
    oldUncertainty: number;
    newUncertainty: number;
    outcome: "win" | "loss" | "draw";
    timestamp: Date;
  }): Promise<void> {
    this.addToBuffer("rating_update", data);
  }

  private addToBuffer(type: string, data: any): void {
    this.telemetryBuffer.push({
      type,
      data,
      timestamp: new Date(),
    });

    if (this.telemetryBuffer.length >= this.bufferLimit) {
      this.flushTelemetry();
    }
  }

  private async flushTelemetry(): Promise<void> {
    if (this.telemetryBuffer.length === 0) return;

    try {
      // In a real implementation, this would send to an analytics service
      console.log(`Flushing ${this.telemetryBuffer.length} telemetry events`);

      // Group by type for batch processing
      const grouped = this.telemetryBuffer.reduce((acc, event) => {
        if (!acc[event.type]) acc[event.type] = [];
        acc[event.type].push(event);
        return acc;
      }, {} as Record<string, any[]>);

      // Process each type
      for (const [type, events] of Object.entries(grouped)) {
        await this.processTelemetryBatch(type, events);
      }

      // Clear buffer
      this.telemetryBuffer = [];
    } catch (error) {
      console.error("Failed to flush telemetry:", error);
    }
  }

  private async processTelemetryBatch(
    type: string,
    events: any[]
  ): Promise<void> {
    switch (type) {
      case "match_result":
        await this.processMatchResults(events);
        break;
      case "pairing_generation":
        await this.processPairingGenerations(events);
        break;
      case "simulation":
        await this.processSimulations(events);
        break;
      case "rating_update":
        await this.processRatingUpdates(events);
        break;
      default:
        console.warn(`Unknown telemetry type: ${type}`);
    }
  }

  private async processMatchResults(events: any[]): Promise<void> {
    // Aggregate match result statistics
    const stats = {
      totalMatches: events.length,
      formatDistribution: events.reduce((acc, e) => {
        acc[e.data.format] = (acc[e.data.format] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageSkillLevel:
        events.reduce((sum, e) => sum + e.data.averageSkill, 0) / events.length,
      averageUncertainty:
        events.reduce((sum, e) => sum + e.data.averageUncertainty, 0) /
        events.length,
    };

    console.log("Match Results Statistics:", stats);
  }

  private async processPairingGenerations(events: any[]): Promise<void> {
    // Aggregate pairing generation statistics
    const stats = {
      totalPairings: events.length,
      averageQuality:
        events.reduce((sum, e) => sum + e.data.overallQuality, 0) /
        events.length,
      algorithmUsage: events.reduce((acc, e) => {
        acc[e.data.algorithm] = (acc[e.data.algorithm] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      qualityDistribution: this.calculateQualityDistribution(events),
    };

    console.log("Pairing Generation Statistics:", stats);
  }

  private async processSimulations(events: any[]): Promise<void> {
    // Aggregate simulation accuracy statistics
    const stats = {
      totalSimulations: events.length,
      averageAccuracy:
        events.reduce((sum, e) => sum + e.data.accuracy, 0) / events.length,
      formatAccuracy: events.reduce((acc, e) => {
        if (!acc[e.data.format]) acc[e.data.format] = { total: 0, accuracy: 0 };
        acc[e.data.format].total++;
        acc[e.data.format].accuracy += e.data.accuracy;
        return acc;
      }, {} as Record<string, { total: number; accuracy: number }>),
    };

    // Calculate format-specific accuracy averages
    Object.keys(stats.formatAccuracy).forEach((format) => {
      const data = stats.formatAccuracy[format];
      data.accuracy = data.accuracy / data.total;
    });

    console.log("Simulation Statistics:", stats);
  }

  private async processRatingUpdates(events: any[]): Promise<void> {
    // Aggregate rating update statistics
    const stats = {
      totalUpdates: events.length,
      averageRatingChange:
        events.reduce((sum, e) => {
          return sum + Math.abs(e.data.newRating - e.data.oldRating);
        }, 0) / events.length,
      outcomeDistribution: events.reduce((acc, e) => {
        acc[e.data.outcome] = (acc[e.data.outcome] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      uncertaintyReduction:
        events.reduce((sum, e) => {
          return sum + (e.data.oldUncertainty - e.data.newUncertainty);
        }, 0) / events.length,
    };

    console.log("Rating Update Statistics:", stats);
  }

  private calculateQualityDistribution(events: any[]): {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  } {
    let excellent = 0,
      good = 0,
      fair = 0,
      poor = 0;

    events.forEach((event) => {
      const avgQuality =
        event.data.qualityDistribution.reduce(
          (sum: number, q: number) => sum + q,
          0
        ) / event.data.qualityDistribution.length;

      if (avgQuality >= 0.8) excellent++;
      else if (avgQuality >= 0.6) good++;
      else if (avgQuality >= 0.4) fair++;
      else poor++;
    });

    return { excellent, good, fair, poor };
  }

  // Public methods for getting telemetry insights
  async getTelemetryInsights(): Promise<{
    matchmaking: {
      averageMatchQuality: number;
      totalPairingsGenerated: number;
      ratingStability: number;
    };
    prediction: {
      simulationAccuracy: number;
      predictionConfidence: number;
    };
    performance: {
      averageRatingUpdateTime: number;
      pairingGenerationTime: number;
    };
  }> {
    // This would query stored telemetry data in a real implementation
    return {
      matchmaking: {
        averageMatchQuality: 0.75,
        totalPairingsGenerated: 1500,
        ratingStability: 0.85,
      },
      prediction: {
        simulationAccuracy: 0.82,
        predictionConfidence: 0.78,
      },
      performance: {
        averageRatingUpdateTime: 15, // milliseconds
        pairingGenerationTime: 45, // milliseconds
      },
    };
  }
}
