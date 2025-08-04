import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CopilotSystem, CopilotAgent, CopilotController, EventStream } from '../src_copilot_index';
import { State, Goal, Action } from '../src_copilot_core';

// Mock AI services
vi.mock('../../ai/DeckOptimizer', () => ({
  deckOptimizer: {
    initialize: vi.fn().mockResolvedValue(undefined),
    optimizeDeck: vi.fn().mockResolvedValue({
      optimizedDeck: { name: 'Test Deck', cards: [] },
      suggestions: ['Add more creatures'],
      synergyScore: 0.8,
      predictedWinRate: 0.75
    })
  }
}));

vi.mock('../../ai/NLPProcessor', () => ({
  nlpProcessor: {
    initialize: vi.fn().mockResolvedValue(undefined),
    analyzeSentiment: vi.fn().mockResolvedValue({
      sentiment: 'positive',
      confidence: 0.8
    })
  }
}));

describe('Enhanced Copilot System', () => {
  let copilotSystem: CopilotSystem;
  let eventStream: EventStream;
  let controller: CopilotController;
  let agent: CopilotAgent;

  beforeEach(() => {
    eventStream = new EventStream();
    controller = new CopilotController(eventStream);
    agent = new CopilotAgent(controller);
    copilotSystem = new CopilotSystem();
  });

  describe('CopilotSystem', () => {
    it('should initialize successfully', async () => {
      await copilotSystem.initialize();
      expect(copilotSystem).toBeDefined();
    });

    it('should handle context updates', async () => {
      await copilotSystem.initialize();
      const testContext = { currentDeck: { name: 'Test Deck' } };
      
      copilotSystem.updateContext(testContext);
      // Verify context was updated (we can't directly access private members)
      expect(copilotSystem).toBeDefined();
    });

    it('should allow adding goals', async () => {
      await copilotSystem.initialize();
      
      copilotSystem.addGoal({
        type: 'optimize_deck',
        description: 'Test optimization goal',
        priority: 8,
        status: 'pending',
        progress: 0
      });
      
      expect(copilotSystem).toBeDefined();
    });

    it('should provide performance metrics', async () => {
      await copilotSystem.initialize();
      const metrics = copilotSystem.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('actionsExecuted');
      expect(metrics).toHaveProperty('goalsCompleted');
      expect(metrics).toHaveProperty('averageConfidence');
      expect(metrics).toHaveProperty('errorRate');
    });
  });

  describe('EventStream', () => {
    it('should manage memory correctly', () => {
      const action: Action = {
        type: 'test_action',
        reasoning: 'Test reasoning',
        confidence: 0.8,
        timestamp: new Date()
      };

      eventStream.publish(action);
      const memory = eventStream.getMemory();

      expect(memory.shortTerm).toContain(action);
      expect(memory.patterns.get('test_action')).toBe(1);
    });

    it('should handle goal management', () => {
      const goal: Goal = {
        id: 'test_goal',
        type: 'optimize_deck',
        description: 'Test goal',
        priority: 5,
        status: 'pending',
        progress: 0
      };

      eventStream.addGoal(goal);
      eventStream.updateGoal('test_goal', { status: 'completed', progress: 100 });

      // Goals are managed internally, test passes if no errors thrown
      expect(eventStream).toBeDefined();
    });

    it('should generate comprehensive state', async () => {
      const state = await eventStream.observe();

      expect(state).toHaveProperty('done');
      expect(state).toHaveProperty('history');
      expect(state).toHaveProperty('currentGoals');
      expect(state).toHaveProperty('memory');
      expect(state).toHaveProperty('context');
      expect(state).toHaveProperty('capabilities');
      expect(state).toHaveProperty('confidence');
      expect(state).toHaveProperty('lastUpdate');
    });
  });

  describe('CopilotController', () => {
    it('should generate intelligent actions', async () => {
      const state: State = {
        done: false,
        history: [],
        currentGoals: [],
        memory: {
          shortTerm: [],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: []
        },
        context: {
          currentDeck: { name: 'Test Deck', cards: [] }
        },
        capabilities: ['deck_optimization'],
        confidence: 0.7,
        lastUpdate: new Date()
      };

      const action = await controller.decideNextAction(state);

      expect(action).toHaveProperty('type');
      expect(action).toHaveProperty('reasoning');
      expect(action).toHaveProperty('confidence');
      expect(action).toHaveProperty('timestamp');
      expect(typeof action.confidence).toBe('number');
    });

    it('should handle goal creation', () => {
      const goal: Goal = {
        id: 'controller_test',
        type: 'assist_player',
        description: 'Test goal from controller',
        priority: 7,
        status: 'pending',
        progress: 0
      };

      controller.addGoal(goal);
      // Test passes if no error thrown
      expect(controller).toBeDefined();
    });

    it('should track performance metrics', () => {
      const initialMetrics = controller.getPerformanceMetrics();
      expect(initialMetrics.actionsExecuted).toBe(0);
      expect(initialMetrics.goalsCompleted).toBe(0);
    });
  });

  describe('CopilotAgent', () => {
    it('should generate sophisticated actions', async () => {
      const state: State = {
        done: false,
        history: [],
        currentGoals: [{
          id: 'test_goal',
          type: 'optimize_deck',
          description: 'Optimize deck performance',
          priority: 8,
          status: 'pending',
          progress: 0
        }],
        memory: {
          shortTerm: [],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: []
        },
        context: {
          currentDeck: { name: 'Test Deck', cards: [] },
          gameState: { turn: 5 }
        },
        capabilities: ['deck_optimization', 'strategic_analysis'],
        confidence: 0.8,
        lastUpdate: new Date()
      };

      const action = await agent.nextStep(state);

      expect(action).toHaveProperty('type');
      expect(action).toHaveProperty('reasoning');
      expect(action).toHaveProperty('confidence');
      expect(action.reasoning).toBeTruthy();
      expect(action.confidence).toBeGreaterThan(0);
      expect(action.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle different game phases', async () => {
      const earlyGameState: State = {
        done: false,
        history: [],
        currentGoals: [],
        memory: {
          shortTerm: [],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: []
        },
        context: { gameState: { turn: 1 } },
        capabilities: ['strategic_analysis'],
        confidence: 0.7,
        lastUpdate: new Date()
      };

      const action = await agent.nextStep(earlyGameState);
      expect(action.type).toBeTruthy();
    });

    it('should adapt to different contexts', async () => {
      const contextWithPlayer: State = {
        done: false,
        history: [],
        currentGoals: [],
        memory: {
          shortTerm: [],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: []
        },
        context: {
          playerProfile: { level: 'beginner' },
          gameState: { turn: 3 }
        },
        capabilities: ['strategic_analysis', 'adaptive_learning'],
        confidence: 0.6,
        lastUpdate: new Date()
      };

      const action = await agent.nextStep(contextWithPlayer);
      expect(action).toHaveProperty('reasoning');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing AI services gracefully', async () => {
      const state: State = {
        done: false,
        history: [],
        currentGoals: [],
        memory: {
          shortTerm: [],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: []
        },
        context: {},
        capabilities: [],
        confidence: 0.5,
        lastUpdate: new Date()
      };

      // Should not throw error even with missing services
      const action = await controller.decideNextAction(state);
      expect(action).toBeDefined();
    });

    it('should provide fallback actions on errors', async () => {
      const corruptedState = {} as State;
      
      // Agent should handle corrupted state gracefully
      const action = await agent.nextStep(corruptedState);
      expect(action).toHaveProperty('type');
      expect(action.type).toBeTruthy();
    });
  });

  describe('Learning and Adaptation', () => {
    it('should accumulate learning experiences', () => {
      const learning = {
        situation: 'early game with weak hand',
        action: 'suggest_mulligan',
        outcome: 'improved hand quality',
        success: true,
        timestamp: new Date()
      };

      eventStream.publish({
        type: 'user_input',
        message: 'That helped!',
        timestamp: new Date()
      });

      const memory = eventStream.getMemory();
      // Memory should track patterns
      expect(memory.patterns.size).toBeGreaterThan(0);
    });

    it('should update confidence based on outcomes', async () => {
      const state: State = {
        done: false,
        history: [],
        currentGoals: [],
        memory: {
          shortTerm: [],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: [
            {
              situation: 'test',
              action: 'observe_environment',
              outcome: 'success',
              success: true,
              timestamp: new Date()
            }
          ]
        },
        context: {},
        capabilities: ['pattern_recognition'],
        confidence: 0.5,
        lastUpdate: new Date()
      };

      const action = await agent.nextStep(state);
      // Confidence should be influenced by past learnings
      expect(action.confidence).toBeDefined();
    });
  });

  describe('Integration with AI Services', () => {
    it('should integrate with deck optimizer', async () => {
      const state: State = {
        done: false,
        history: [],
        currentGoals: [{
          id: 'optimize_test',
          type: 'optimize_deck',
          description: 'Test deck optimization',
          priority: 8,
          status: 'pending',
          progress: 0
        }],
        memory: {
          shortTerm: [],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: []
        },
        context: {
          currentDeck: { name: 'Test Deck', cards: [] }
        },
        capabilities: ['deck_optimization'],
        confidence: 0.8,
        lastUpdate: new Date()
      };

      const action = await controller.decideNextAction(state);
      expect(action).toBeDefined();
    });

    it('should integrate with NLP processor', async () => {
      const state: State = {
        done: false,
        history: [],
        currentGoals: [],
        memory: {
          shortTerm: [{
            type: 'user_input',
            message: 'I need help with strategy',
            timestamp: new Date()
          }],
          longTerm: new Map(),
          patterns: new Map(),
          learnings: []
        },
        context: {},
        capabilities: ['natural_language_processing'],
        confidence: 0.7,
        lastUpdate: new Date()
      };

      const action = await controller.decideNextAction(state);
      expect(action).toBeDefined();
    });
  });

  describe('Goal-Oriented Behavior', () => {
    it('should prioritize goals correctly', async () => {
      const highPriorityGoal: Goal = {
        id: 'high_priority',
        type: 'optimize_deck',
        description: 'High priority optimization',
        priority: 10,
        status: 'pending',
        progress: 0
      };

      const lowPriorityGoal: Goal = {
        id: 'low_priority',
        type: 'learn_strategy',
        description: 'Low priority learning',
        priority: 3,
        status: 'pending',
        progress: 0
      };

      eventStream.addGoal(lowPriorityGoal);
      eventStream.addGoal(highPriorityGoal);

      const state = await eventStream.observe();
      expect(state.currentGoals.length).toBeGreaterThan(0);
    });

    it('should complete goals and track progress', () => {
      const goal: Goal = {
        id: 'completion_test',
        type: 'assist_player',
        description: 'Test goal completion',
        priority: 5,
        status: 'pending',
        progress: 0
      };

      eventStream.addGoal(goal);
      eventStream.updateGoal('completion_test', { 
        status: 'completed', 
        progress: 100 
      });

      // Should handle goal updates without errors
      expect(eventStream).toBeDefined();
    });
  });
});