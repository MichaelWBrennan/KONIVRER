// Enhanced core types and event system for OpenHands AI-level Copilot

export interface Goal {
  id: string;
  type: 'optimize_deck' | 'analyze_game' | 'assist_player' | 'learn_strategy';
  description: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  subGoals?: Goal[];
  context?: Record<string, any>;
  expectedOutcome?: string;
  progress?: number;
}

export interface Action {
  type: string;
  payload?: unknown;
  reasoning?: string;
  confidence?: number;
  timestamp: Date;
  goalId?: string;
  expectedResult?: string;
}

export interface Observation {
  type: 'user_input' | 'game_state' | 'environment' | 'feedback' | 'error';
  message: string;
  data?: unknown;
  timestamp: Date;
  source?: string;
  relevance?: number;
}

export interface Memory {
  shortTerm: Array<Action | Observation>;
  longTerm: Map<string, any>;
  patterns: Map<string, number>;
  learnings: Array<{
    situation: string;
    action: string;
    outcome: string;
    success: boolean;
    timestamp: Date;
  }>;
}

export interface Context {
  gameState?: unknown;
  playerProfile?: unknown;
  currentDeck?: unknown;
  recentActions?: Action[];
  environment?: Record<string, any>;
}

export interface State {
  done: boolean;
  history: Array<Action | Observation>;
  currentGoals: Goal[];
  memory: Memory;
  context: Context;
  capabilities: string[];
  confidence: number;
  lastUpdate: Date;
}

export class EventStream {
  private events: Array<Action | Observation> = [];
  private memory: Memory = {
    shortTerm: [],
    longTerm: new Map(),
    patterns: new Map(),
    learnings: [],
  };
  private context: Context = {};
  private goals: Goal[] = [];

  public publish(event: Action | Observation): void {
    this.events.push(event);
    this.memory.shortTerm.push(event);

    // Keep short-term memory manageable
    if (this.memory.shortTerm.length > 100) {
      this.memory.shortTerm = this.memory.shortTerm.slice(-50);
    }

    // Learn from patterns
    this.updatePatterns(event);
  }

  public updateContext(newContext: Partial<Context>): void {
    this.context = { ...this.context, ...newContext };
  }

  public addGoal(goal: Goal): void {
    this.goals.push(goal);
    this.goals.sort((a, b) => b.priority - a.priority);
  }

  public updateGoal(goalId: string, updates: Partial<Goal>): void {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      Object.assign(goal, updates);
    }
  }

  public getMemory(): Memory {
    return this.memory;
  }

  public async observe(): Promise<State> {
    return {
      done: this.checkIfDone(),
      history: [...this.events],
      currentGoals: [...this.goals],
      memory: this.memory,
      context: this.context,
      capabilities: this.getCapabilities(),
      confidence: this.calculateConfidence(),
      lastUpdate: new Date(),
    };
  }

  private updatePatterns(event: Action | Observation): void {
    const pattern = `${event.type}`;
    this.memory.patterns.set(
      pattern,
      (this.memory.patterns.get(pattern) || 0) + 1,
    );
  }

  private checkIfDone(): boolean {
    return this.goals.every(
      goal => goal.status === 'completed' || goal.status === 'failed',
    );
  }

  private getCapabilities(): string[] {
    return [
      'deck_optimization',
      'natural_language_processing',
      'sentiment_analysis',
      'strategic_planning',
      'pattern_recognition',
      'adaptive_learning',
      'context_awareness',
      'goal_decomposition',
      'self_reflection',
    ];
  }

  private calculateConfidence(): number {
    const completedGoals = this.goals.filter(
      g => g.status === 'completed',
    ).length;
    const totalGoals = this.goals.length;
    const successRate = totalGoals > 0 ? completedGoals / totalGoals : 0.5;

    const recentSuccesses = this.memory.learnings
      .slice(-10)
      .filter(l => l.success).length;

    return Math.min(
      0.95,
      Math.max(0.1, (successRate + recentSuccesses / 10) / 2),
    );
  }
}
