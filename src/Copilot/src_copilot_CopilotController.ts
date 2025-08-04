import { State, Action, EventStream, Goal } from './src_copilot_core';
import { deckOptimizer } from '../ai/DeckOptimizer';
import { nlpProcessor } from '../ai/NLPProcessor';

/**
 * CopilotController - Enhanced coordination system that orchestrates the AI agent,
 * manages state, integrates with AI services, and provides intelligent automation.
 */
export class CopilotController {
  private eventStream: EventStream;
  private aiServices: Map<string, any> = new Map();
  private isRunning = false;
  private performanceMetrics = {
    actionsExecuted: 0,
    goalsCompleted: 0,
    averageConfidence: 0.5,
    errorRate: 0,
    responseTime: [],
  };

  constructor(eventStream: EventStream) {
    this.eventStream = eventStream;
    this.initializeAIServices();
  }

  /**
   * Enhanced main loop with intelligent coordination and error handling
   */
  public async run(initialState: State): Promise<void> {
    if (this.isRunning) {
      console.warn('CopilotController is already running');
      return;
    }

    this.isRunning = true;
    let state = initialState;
    let iterationCount = 0;
    const maxIterations = 1000; // Increased for complex tasks

    try {
      console.log('🚀 Starting OpenHands AI-level Copilot...');

      while (this.isRunning && iterationCount < maxIterations) {
        const startTime = Date.now();

        try {
          // Get next intelligent action
          const action = await this.decideNextAction(state);

          // Execute the action
          await this.executeAction(action, state);

          // Publish the action to event stream
          this.eventStream.publish(action);

          // Get updated state
          state = await this.eventStream.observe();

          // Update performance metrics
          this.updateMetrics(action, Date.now() - startTime);

          // Check if we should continue
          if (state.done || this.shouldPause(state)) {
            break;
          }

          // Adaptive delay based on situation complexity
          await this.adaptiveDelay(state);
        } catch (error) {
          console.error(`Error in iteration ${iterationCount}:`, error);
          this.performanceMetrics.errorRate += 1;

          // Publish error observation
          this.eventStream.publish({
            type: 'error',
            message: `Iteration error: ${error.message}`,
            timestamp: new Date(),
            source: 'controller',
          });

          // Continue with error recovery
          await this.recoverFromError(error, state);
        }

        iterationCount++;
      }
    } finally {
      this.isRunning = false;
      console.log(`🏁 Copilot completed after ${iterationCount} iterations`);
      this.logPerformanceReport();
    }
  }

  /**
   * Advanced decision making with AI service integration
   */
  public async decideNextAction(state: State): Promise<Action> {
    const startTime = Date.now();

    try {
      // Analyze the current situation
      const analysis = await this.analyzeState(state);

      // Get current goals or create new ones
      const activeGoals = await this.manageGoals(state);

      // Use AI services for decision support
      const aiInsights = await this.gatherAIInsights(state);

      // Generate action based on comprehensive analysis
      const action = await this.generateIntelligentAction(
        state,
        analysis,
        activeGoals,
        aiInsights,
      );

      // Add decision metadata
      action.reasoning = `Decision time: ${Date.now() - startTime}ms. ${action.reasoning}`;
      action.confidence = this.calculateDecisionConfidence(state, analysis);

      return action;
    } catch (error) {
      console.error('Error in decision making:', error);
      return this.createEmergencyAction(state);
    }
  }

  /**
   * Execute action with appropriate AI service integration
   */
  private async executeAction(action: Action, state: State): Promise<void> {
    const startTime = Date.now();

    try {
      switch (action.type) {
        case 'optimize_deck':
          await this.executeDeckOptimization(action, state);
          break;

        case 'analyze_game_state':
        case 'analyze_board_state':
          await this.executeGameAnalysis(action, state);
          break;

        case 'provide_strategy_advice':
          await this.executeStrategyAdvice(action, state);
          break;

        case 'communicate':
          await this.executeCommunication(action, state);
          break;

        case 'provide_learning_content':
          await this.executeLearningDelivery(action, state);
          break;

        case 'observe_environment':
          await this.executeObservation(action, state);
          break;

        default:
          console.log(`Executing generic action: ${action.type}`);
      }

      this.performanceMetrics.actionsExecuted++;
      console.log(`✅ Executed ${action.type} in ${Date.now() - startTime}ms`);
    } catch (error) {
      console.error(`❌ Failed to execute ${action.type}:`, error);
      throw error;
    }
  }

  public addGoal(goal: Goal): void {
    this.eventStream.addGoal(goal);
    console.log(`🎯 New goal added: ${goal.description}`);
  }

  public updateGoal(goalId: string, updates: Partial<Goal>): void {
    this.eventStream.updateGoal(goalId, updates);
    if (updates.status === 'completed') {
      this.performanceMetrics.goalsCompleted++;
      console.log(`🏆 Goal completed: ${goalId}`);
    }
  }

  public stop(): void {
    this.isRunning = false;
    console.log('🛑 Copilot stop requested');
  }

  public getPerformanceMetrics(): any {
    return { ...this.performanceMetrics };
  }

  // Private methods

  private async initializeAIServices(): Promise<void> {
    try {
      // Initialize AI services
      await deckOptimizer.initialize();
      await nlpProcessor.initialize();

      this.aiServices.set('deckOptimizer', deckOptimizer);
      this.aiServices.set('nlpProcessor', nlpProcessor);

      console.log('🧠 AI services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI services:', error);
    }
  }

  private async analyzeState(state: State): Promise<any> {
    return {
      hasActiveGoals:
        state.currentGoals.filter(g => g.status !== 'completed').length > 0,
      confidence: state.confidence,
      recentActivity: state.memory.shortTerm.slice(-5),
      contextRichness: Object.keys(state.context).length,
      needsAttention:
        state.confidence < 0.4 ||
        state.currentGoals.some(g => g.status === 'failed'),
    };
  }

  private async manageGoals(state: State): Promise<Goal[]> {
    const activeGoals = state.currentGoals.filter(
      g => g.status === 'pending' || g.status === 'in_progress',
    );

    // Create default goals if none exist
    if (activeGoals.length === 0) {
      const defaultGoal: Goal = {
        id: `auto_${Date.now()}`,
        type: 'assist_player',
        description: 'Provide intelligent assistance and optimization',
        priority: 5,
        status: 'pending',
        progress: 0,
      };

      this.addGoal(defaultGoal);
      return [defaultGoal];
    }

    return activeGoals;
  }

  private async gatherAIInsights(state: State): Promise<any> {
    const insights: any = {};

    try {
      // Deck optimization insights
      if (state.context.currentDeck) {
        const optimizer = this.aiServices.get('deckOptimizer');
        if (optimizer) {
          insights.deckAnalysis = await optimizer.optimizeDeck(
            state.context.currentDeck,
            [], // Available cards would be provided by game context
          );
        }
      }

      // NLP insights for communication
      const nlp = this.aiServices.get('nlpProcessor');
      if (nlp && state.memory.shortTerm.length > 0) {
        const recentMessages = state.memory.shortTerm
          .filter(event => event.type === 'user_input')
          .slice(-3);

        for (const message of recentMessages) {
          insights.sentiment = await nlp.analyzeSentiment(message.message);
        }
      }
    } catch (error) {
      console.error('Error gathering AI insights:', error);
      insights.error = error.message;
    }

    return insights;
  }

  private async generateIntelligentAction(
    state: State,
    analysis: any,
    goals: Goal[],
    insights: any,
  ): Promise<Action> {
    // Priority-based action selection
    const priorityGoal = goals.sort((a, b) => b.priority - a.priority)[0];

    if (priorityGoal) {
      switch (priorityGoal.type) {
        case 'optimize_deck':
          if (insights.deckAnalysis) {
            return this.createDeckOptimizationAction(insights.deckAnalysis);
          }
          break;

        case 'assist_player':
          return this.createAssistanceAction(state, insights);

        case 'analyze_game':
          return this.createAnalysisAction(state);

        case 'learn_strategy':
          return this.createLearningAction(state);
      }
    }

    // Fallback to observation
    return this.createObservationAction(state);
  }

  private createDeckOptimizationAction(deckAnalysis: any): Action {
    return {
      type: 'optimize_deck',
      payload: {
        suggestions: deckAnalysis.suggestions,
        synergyScore: deckAnalysis.synergyScore,
        predictedWinRate: deckAnalysis.predictedWinRate,
      },
      reasoning: `Deck optimization recommended. Synergy score: ${deckAnalysis.synergyScore.toFixed(2)}`,
      confidence: 0.85,
      timestamp: new Date(),
      expectedResult: 'Improved deck performance',
    };
  }

  private createAssistanceAction(state: State, insights: any): Action {
    let message = "I'm here to help optimize your gaming experience.";

    if (insights.sentiment?.sentiment === 'negative') {
      message =
        'I notice you might be having some challenges. Let me help improve your strategy.';
    }

    return {
      type: 'communicate',
      payload: { message, type: 'assistance' },
      reasoning: 'Providing proactive assistance based on analysis',
      confidence: 0.7,
      timestamp: new Date(),
      expectedResult: 'Enhanced user support',
    };
  }

  private createAnalysisAction(state: State): Action {
    return {
      type: 'analyze_game_state',
      payload: { gameState: state.context.gameState },
      reasoning: 'Analyzing current game state for strategic insights',
      confidence: 0.9,
      timestamp: new Date(),
      expectedResult: 'Strategic insights gained',
    };
  }

  private createLearningAction(state: State): Action {
    return {
      type: 'provide_learning_content',
      payload: {
        topic: 'strategy_improvement',
        level: state.context.playerProfile?.level || 'intermediate',
      },
      reasoning: 'Delivering educational content for skill improvement',
      confidence: 0.75,
      timestamp: new Date(),
      expectedResult: 'Player skill enhancement',
    };
  }

  private createObservationAction(state: State): Action {
    return {
      type: 'observe_environment',
      payload: { focus: 'general_assessment' },
      reasoning: 'Maintaining situational awareness',
      confidence: 0.95,
      timestamp: new Date(),
      expectedResult: 'Updated environmental understanding',
    };
  }

  private createEmergencyAction(state: State): Action {
    return {
      type: 'emergency_fallback',
      payload: { reason: 'decision_error' },
      reasoning: 'Emergency fallback due to decision error',
      confidence: 0.2,
      timestamp: new Date(),
      expectedResult: 'System stability maintained',
    };
  }

  // Action execution methods

  private async executeDeckOptimization(
    action: Action,
    state: State,
  ): Promise<void> {
    const optimizer = this.aiServices.get('deckOptimizer');
    if (optimizer && state.context.currentDeck) {
      const result = await optimizer.optimizeDeck(
        state.context.currentDeck,
        [],
      );

      this.eventStream.publish({
        type: 'environment',
        message: `Deck optimization completed. Synergy: ${result.synergyScore.toFixed(2)}, Predicted win rate: ${(result.predictedWinRate * 100).toFixed(1)}%`,
        data: result,
        timestamp: new Date(),
        source: 'deck_optimizer',
      });
    }
  }

  private async executeGameAnalysis(
    action: Action,
    state: State,
  ): Promise<void> {
    // Analyze game state and publish insights
    const analysis = {
      phase: this.determineGamePhase(state),
      opportunities: this.identifyOpportunities(state),
      threats: this.identifyThreats(state),
      recommendations: this.generateRecommendations(state),
    };

    this.eventStream.publish({
      type: 'environment',
      message: `Game analysis completed: ${analysis.phase} phase, ${analysis.recommendations.length} recommendations`,
      data: analysis,
      timestamp: new Date(),
      source: 'game_analyzer',
    });
  }

  private async executeStrategyAdvice(
    action: Action,
    state: State,
  ): Promise<void> {
    const advice = {
      situation: this.describeSituation(state),
      recommendations: this.generateStrategicAdvice(state),
      confidence: action.confidence,
    };

    this.eventStream.publish({
      type: 'environment',
      message: `Strategic advice provided: ${advice.recommendations.length} recommendations`,
      data: advice,
      timestamp: new Date(),
      source: 'strategy_advisor',
    });
  }

  private async executeCommunication(
    action: Action,
    state: State,
  ): Promise<void> {
    const nlp = this.aiServices.get('nlpProcessor');
    let message = action.payload.message;

    // Enhance message with NLP if available
    if (nlp) {
      const sentiment = await nlp.analyzeSentiment(message);
      // Adjust message tone based on context
    }

    this.eventStream.publish({
      type: 'environment',
      message: `Communication sent: ${message}`,
      data: { message, type: action.payload.type },
      timestamp: new Date(),
      source: 'communicator',
    });
  }

  private async executeLearningDelivery(
    action: Action,
    state: State,
  ): Promise<void> {
    const content = {
      topic: action.payload.topic,
      level: action.payload.level,
      content: this.generateLearningContent(
        action.payload.topic,
        action.payload.level,
      ),
    };

    this.eventStream.publish({
      type: 'environment',
      message: `Learning content delivered: ${content.topic} for ${content.level} level`,
      data: content,
      timestamp: new Date(),
      source: 'learning_system',
    });
  }

  private async executeObservation(
    action: Action,
    state: State,
  ): Promise<void> {
    const observation = {
      focus: action.payload.focus,
      findings: this.generateObservationFindings(state),
      timestamp: new Date(),
    };

    this.eventStream.publish({
      type: 'environment',
      message: `Environment observation completed: ${observation.findings.length} findings`,
      data: observation,
      timestamp: new Date(),
      source: 'observer',
    });
  }

  // Helper methods

  private calculateDecisionConfidence(state: State, analysis: any): number {
    let confidence = state.confidence;

    if (analysis.contextRichness > 3) confidence += 0.1;
    if (analysis.hasActiveGoals) confidence += 0.1;
    if (analysis.needsAttention) confidence -= 0.2;

    return Math.max(0.1, Math.min(0.95, confidence));
  }

  private shouldPause(state: State): boolean {
    // Pause if all goals completed or confidence too low
    return (
      state.currentGoals.every(g => g.status === 'completed') ||
      state.confidence < 0.1
    );
  }

  private async adaptiveDelay(state: State): Promise<void> {
    // Adaptive delay based on situation complexity
    const baseDelay = 100;
    const complexityFactor =
      state.currentGoals.length + Object.keys(state.context).length;
    const delay = Math.min(1000, baseDelay + complexityFactor * 50);

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async recoverFromError(error: Error, state: State): Promise<void> {
    console.log('🔧 Attempting error recovery...');

    // Simple recovery: reduce confidence and continue
    state.confidence = Math.max(0.1, state.confidence - 0.1);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private updateMetrics(action: Action, responseTime: number): void {
    this.performanceMetrics.responseTime.push(responseTime);

    // Keep only last 100 response times
    if (this.performanceMetrics.responseTime.length > 100) {
      this.performanceMetrics.responseTime =
        this.performanceMetrics.responseTime.slice(-100);
    }

    // Update average confidence
    if (action.confidence) {
      this.performanceMetrics.averageConfidence =
        (this.performanceMetrics.averageConfidence + action.confidence) / 2;
    }
  }

  private logPerformanceReport(): void {
    const avgResponseTime =
      this.performanceMetrics.responseTime.length > 0
        ? this.performanceMetrics.responseTime.reduce((a, b) => a + b, 0) /
          this.performanceMetrics.responseTime.length
        : 0;

    console.log(`
📊 Performance Report:
- Actions Executed: ${this.performanceMetrics.actionsExecuted}
- Goals Completed: ${this.performanceMetrics.goalsCompleted}
- Average Confidence: ${(this.performanceMetrics.averageConfidence * 100).toFixed(1)}%
- Error Rate: ${this.performanceMetrics.errorRate}
- Average Response Time: ${avgResponseTime.toFixed(1)}ms
    `);
  }

  // Additional helper methods for game analysis
  private determineGamePhase(state: State): string {
    // Simple phase determination
    const turn = state.context.gameState?.turn || 1;
    if (turn <= 3) return 'early';
    if (turn <= 7) return 'mid';
    return 'late';
  }

  private identifyOpportunities(state: State): string[] {
    return [
      'deck_optimization',
      'strategic_positioning',
      'resource_management',
    ];
  }

  private identifyThreats(state: State): string[] {
    return ['suboptimal_play', 'resource_shortage', 'positional_weakness'];
  }

  private generateRecommendations(state: State): string[] {
    return [
      'Focus on card synergies',
      'Optimize mana curve',
      'Consider meta-game trends',
    ];
  }

  private describeSituation(state: State): string {
    const phase = this.determineGamePhase(state);
    return `${phase} game phase with ${state.currentGoals.length} active goals`;
  }

  private generateStrategicAdvice(state: State): string[] {
    return [
      'Maintain board presence',
      'Plan for late game',
      'Consider opponent responses',
    ];
  }

  private generateLearningContent(topic: string, level: string): string {
    const content = {
      strategy_improvement: {
        beginner: 'Focus on basic card interactions and mana efficiency',
        intermediate: 'Learn advanced synergies and meta-game adaptation',
        advanced: 'Master complex decision trees and predictive analysis',
      },
    };

    return (
      content[topic]?.[level] ||
      'General strategic principles and improvement techniques'
    );
  }

  private generateObservationFindings(state: State): string[] {
    const findings = [];

    if (state.confidence < 0.5) {
      findings.push('Low confidence detected - needs attention');
    }

    if (state.currentGoals.length === 0) {
      findings.push('No active goals - creating default objectives');
    }

    if (Object.keys(state.context).length < 2) {
      findings.push('Limited context available - seeking more information');
    }

    return findings.length > 0 ? findings : ['System operating normally'];
  }
}
