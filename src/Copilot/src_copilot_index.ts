import { CopilotAgent } from './src_copilot_CopilotAgent';
import { CopilotController } from './src_copilot_CopilotController';
import { EventStream, State, Goal } from './src_copilot_core';

/**
 * Enhanced Copilot system entry point with OpenHands AI-level intelligence
 */

export interface CopilotConfig {
  autoStart?: boolean;
  debugMode?: boolean;
  maxIterations?: number;
  adaptiveLearning?: boolean;
  aiServicesEnabled?: boolean;
}

export class CopilotSystem {
  private eventStream: EventStream;
  private controller: CopilotController;
  private agent: CopilotAgent;
  private isInitialized = false;

  constructor(config: CopilotConfig = {}) {
    this.eventStream = new EventStream();
    this.controller = new CopilotController(this.eventStream);
    this.agent = new CopilotAgent(this.controller);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🚀 Initializing OpenHands AI-level Copilot...');

    // Set up default goals
    this.controller.addGoal({
      id: 'system_ready',
      type: 'assist_player',
      description: 'Be ready to provide intelligent assistance',
      priority: 10,
      status: 'pending',
      progress: 0,
    });

    this.isInitialized = true;
    console.log('✅ Copilot system initialized');
  }

  async start(initialContext?: unknown): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const initialState: State = {
      done: false,
      history: [],
      currentGoals: [],
      memory: {
        shortTerm: [],
        longTerm: new Map(),
        patterns: new Map(),
        learnings: [],
      },
      context: initialContext || {},
      capabilities: [
        'deck_optimization',
        'strategic_analysis',
        'natural_language_processing',
        'adaptive_learning',
        'goal_oriented_planning',
        'self_reflection',
      ],
      confidence: 0.7,
      lastUpdate: new Date(),
    };

    console.log('🎯 Starting intelligent Copilot run...');
    await this.controller.run(initialState);
  }

  async executeAction(actionType: string, payload?: unknown): Promise<void> {
    const action = {
      type: actionType,
      payload,
      reasoning: 'Manual action request',
      confidence: 0.8,
      timestamp: new Date(),
      expectedResult: 'User-requested action completed',
    };

    this.eventStream.publish(action);
  }

  updateContext(context: unknown): void {
    this.eventStream.updateContext(context);
    console.log('📝 Context updated');
  }

  addGoal(goal: Omit<Goal, 'id'>): void {
    const newGoal: Goal = {
      id: `user_${Date.now()}`,
      ...goal,
    };
    this.controller.addGoal(newGoal);
  }

  getPerformanceMetrics(): any {
    return this.controller.getPerformanceMetrics();
  }

  stop(): void {
    this.controller.stop();
    console.log('🛑 Copilot system stopped');
  }
}

// Legacy function for backward compatibility
export async function runCopilot(initialState?: State): Promise<void> {
  console.log('🔄 Starting legacy Copilot interface...');

  const system = new CopilotSystem();
  await system.initialize();

  if (initialState) {
    await system.start(initialState.context);
  } else {
    await system.start();
  }
}

// Export all components and types
export { CopilotAgent, CopilotController, EventStream };
export type { State, Action, Goal, CopilotConfig };
