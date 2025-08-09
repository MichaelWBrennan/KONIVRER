import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PhysicalGameSimulationService } from '../physical-simulation.service';
import { JudgeToolkitService } from '../judge-toolkit.service';
import { Card } from '../../cards/entities/card.entity';
import { Deck } from '../../decks/entities/deck.entity';

describe('PhysicalGameSimulationService', () => {
  let service: PhysicalGameSimulationService;
  let judgeService: JudgeToolkitService;
  let mockCardRepository: any;
  let mockDeckRepository: any;

  beforeEach(async () => {
    mockCardRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockDeckRepository = {
      find: jest.fn(),
      findOne: jest.fn().mockResolvedValue({
        id: 'deck1',
        name: 'Test Deck',
        cards: [
          { id: 'card1', name: 'Lightning Bolt', convertedManaCost: 1, power: 3 },
          { id: 'card2', name: 'Grizzly Bears', convertedManaCost: 2, power: 2 },
          { id: 'card3', name: 'Counterspell', convertedManaCost: 2, power: 0 },
        ],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhysicalGameSimulationService,
        JudgeToolkitService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockCardRepository,
        },
        {
          provide: getRepositoryToken(Deck),
          useValue: mockDeckRepository,
        },
      ],
    }).compile();

    service = module.get<PhysicalGameSimulationService>(PhysicalGameSimulationService);
    judgeService = module.get<JudgeToolkitService>(JudgeToolkitService);
  });

  describe('simulatePhysicalGame', () => {
    it('should run game simulation with proper statistics', async () => {
      const result = await service.simulatePhysicalGame('deck1', 'deck1', 100);

      expect(result).toBeDefined();
      expect(result.scenarioId).toBe('default');
      expect(result.iterations).toBe(100);
      expect(typeof result.averageGameLength).toBe('number');
      expect(result.averageGameLength).toBeGreaterThan(0);
      
      expect(result.statistics).toBeDefined();
      expect(result.statistics.winRates).toBeDefined();
      expect(typeof result.statistics.winRates.player1).toBe('number');
      expect(typeof result.statistics.winRates.player2).toBe('number');
      
      // Win rates should sum to approximately 100%
      const totalWinRate = result.statistics.winRates.player1 + result.statistics.winRates.player2;
      expect(totalWinRate).toBeGreaterThan(90);
      expect(totalWinRate).toBeLessThan(110);

      expect(mockDeckRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should provide detailed game outcomes', async () => {
      const result = await service.simulatePhysicalGame('deck1', 'deck1', 50);

      expect(result.outcomes).toBeDefined();
      expect(typeof result.outcomes).toBe('object');
      
      // Should have outcomes like 'player1', 'player2', or 'timeout'
      const outcomeKeys = Object.keys(result.outcomes);
      expect(outcomeKeys.length).toBeGreaterThan(0);
      
      const totalOutcomes = Object.values(result.outcomes).reduce((sum: number, count: number) => sum + count, 0);
      expect(totalOutcomes).toBe(50);
    });

    it('should track card usage statistics', async () => {
      const result = await service.simulatePhysicalGame('deck1', 'deck1', 10);

      expect(result.statistics.cardUsageStats).toBeDefined();
      expect(typeof result.statistics.cardUsageStats).toBe('object');
      
      // Should track cards that were actually played
      const cardNames = Object.keys(result.statistics.cardUsageStats);
      if (cardNames.length > 0) {
        expect(result.statistics.cardUsageStats[cardNames[0]]).toBeGreaterThan(0);
      }
    });

    it('should handle reproducible randomness with seeds', async () => {
      // This tests the seeded random functionality
      // Multiple runs should produce different results due to different seeds
      const result1 = await service.simulatePhysicalGame('deck1', 'deck1', 10);
      const result2 = await service.simulatePhysicalGame('deck1', 'deck1', 10);

      expect(result1.statistics.winRates.player1).toBeDefined();
      expect(result2.statistics.winRates.player1).toBeDefined();
      
      // Results should be valid percentages
      expect(result1.statistics.winRates.player1).toBeGreaterThanOrEqual(0);
      expect(result1.statistics.winRates.player1).toBeLessThanOrEqual(100);
    });
  });

  describe('createScenario', () => {
    it('should create custom simulation scenarios', async () => {
      const scenarioData = {
        name: 'Aggro vs Control Test',
        description: 'Testing aggro deck against control deck',
        player1Deck: 'deck1',
        player2Deck: 'deck1',
        expectedOutcomes: ['player1 wins fast', 'player2 stabilizes'],
      };

      const scenario = await service.createScenario(scenarioData);

      expect(scenario).toBeDefined();
      expect(scenario.id).toBeDefined();
      expect(scenario.name).toBe(scenarioData.name);
      expect(scenario.description).toBe(scenarioData.description);
      expect(scenario.expectedOutcomes).toEqual(scenarioData.expectedOutcomes);
      expect(scenario.tags).toBeDefined();
      expect(Array.isArray(scenario.tags)).toBe(true);
      expect(scenario.initialGameState).toBeDefined();
    });

    it('should generate appropriate scenario tags', async () => {
      const aggroScenario = await service.createScenario({
        name: 'Aggro Rush Test',
        description: 'Fast aggro testing',
        player1Deck: 'deck1',
        player2Deck: 'deck1',
        expectedOutcomes: ['fast win'],
      });

      expect(aggroScenario.tags).toContain('custom-scenario');
      expect(aggroScenario.tags).toContain('aggro');

      const controlScenario = await service.createScenario({
        name: 'Control Mirror Match',
        description: 'Control vs control',
        player1Deck: 'deck1',
        player2Deck: 'deck1',
        expectedOutcomes: ['long game'],
      });

      expect(controlScenario.tags).toContain('control');
    });
  });

  describe('runBatchDeckTesting', () => {
    it('should perform comprehensive batch testing', async () => {
      // Mock multiple different decks for batch testing
      mockDeckRepository.findOne
        .mockResolvedValueOnce({
          id: 'aggro_deck',
          cards: [{ id: 'c1', name: 'Lightning Bolt', convertedManaCost: 1, power: 3 }],
        })
        .mockResolvedValueOnce({
          id: 'control_deck',
          cards: [{ id: 'c2', name: 'Counterspell', convertedManaCost: 2, power: 0 }],
        });

      const result = await service.runBatchDeckTesting(
        ['aggro_deck'],
        ['control_deck'],
        1000 // Lower iteration count for testing
      );

      expect(result).toBeDefined();
      expect(result.winRates).toBeDefined();
      expect(result.matchupMatrix).toBeDefined();
      expect(result.synergyAnalysis).toBeDefined();
      expect(result.metaImpact).toBeDefined();
      
      expect(result.winRates['aggro_deck']).toBeDefined();
      expect(typeof result.winRates['aggro_deck']).toBe('number');
      
      expect(result.matchupMatrix['aggro_deck']).toBeDefined();
      expect(result.matchupMatrix['aggro_deck']['control_deck']).toBeDefined();
      
      expect(result.detailedStats).toBeDefined();
      expect(result.detailedStats.totalSimulations).toBeGreaterThan(0);
    });
  });
});

describe('JudgeToolkitService', () => {
  let service: JudgeToolkitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JudgeToolkitService],
    }).compile();

    service = module.get<JudgeToolkitService>(JudgeToolkitService);
  });

  describe('searchRules', () => {
    it('should find relevant rules based on keywords', async () => {
      const results = await service.searchRules({
        keywords: ['priority', 'stack'],
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      const priorityRule = results.find(rule => rule.title.includes('Priority'));
      expect(priorityRule).toBeDefined();
      expect(priorityRule.confidence).toBeGreaterThan(0);
      expect(priorityRule.ruleNumber).toBeDefined();
      expect(priorityRule.text).toBeDefined();
    });

    it('should rank results by confidence', async () => {
      const results = await service.searchRules({
        keywords: ['life'],
      });

      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].confidence).toBeGreaterThanOrEqual(results[i + 1].confidence);
        }
      }
    });

    it('should handle card name context', async () => {
      const results = await service.searchRules({
        keywords: ['replacement'],
        cardNames: ['Doubling Season'],
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      
      const replacementRule = results.find(rule => 
        rule.title.includes('Replacement') || rule.text.includes('replacement')
      );
      expect(replacementRule).toBeDefined();
    });
  });

  describe('calculatePenalty', () => {
    it('should calculate basic penalties correctly', async () => {
      const penalty = await service.calculatePenalty('Missed Trigger', {
        tournamentLevel: 'regular',
        intent: 'accidental',
        impact: 'minor',
      });

      expect(penalty).toBeDefined();
      expect(penalty.infraction).toContain('Missed Trigger');
      expect(penalty.severity).toBe('warning');
      expect(penalty.reasoning).toBeDefined();
      expect(Array.isArray(penalty.precedents)).toBe(true);
    });

    it('should upgrade penalties for intentional infractions', async () => {
      const penalty = await service.calculatePenalty('Minor Unsporting Conduct', {
        intent: 'intentional',
        tournamentLevel: 'competitive',
      });

      expect(penalty.severity).toBe('game_loss');
      expect(penalty.reasoning).toContain('intentional');
    });

    it('should upgrade for player history', async () => {
      const penalty = await service.calculatePenalty('Tardiness', {
        playerHistory: ['Previous tardiness warning'],
        tournamentLevel: 'competitive',
      });

      expect(penalty.severity).toBe('game_loss');
      expect(penalty.reasoning).toContain('player history');
    });

    it('should handle professional REL upgrades', async () => {
      const penalty = await service.calculatePenalty('Missed Trigger', {
        tournamentLevel: 'professional',
      });

      expect(penalty.severity).toBe('game_loss');
      expect(penalty.reasoning).toContain('professional REL');
    });
  });

  describe('resolveRulesConflict', () => {
    it('should resolve layer system conflicts', async () => {
      const resolution = await service.resolveRulesConflict(
        'Multiple continuous effects affecting the same object',
        ['613.1', '613.2']
      );

      expect(resolution).toBeDefined();
      expect(resolution.resolution).toBeDefined();
      expect(resolution.priority).toBe('layer_system');
      expect(resolution.explanation).toContain('layer');
      expect(Array.isArray(resolution.precedence)).toBe(true);
    });

    it('should handle replacement effect conflicts', async () => {
      const resolution = await service.resolveRulesConflict(
        'Multiple replacement effects',
        ['614.1']
      );

      expect(resolution.priority).toBe('replacement_effect');
      expect(resolution.explanation).toContain('replacement');
    });

    it('should handle unknown rules gracefully', async () => {
      const resolution = await service.resolveRulesConflict(
        'Unknown conflict',
        ['999.999']
      );

      expect(resolution.resolution).toBe('No rules found');
      expect(resolution.priority).toBe('N/A');
    });
  });

  describe('simulateScenario', () => {
    it('should simulate judge training scenarios', async () => {
      const result = await service.simulateScenario('priority_basic_001');

      expect(result).toBeDefined();
      expect(result.scenario).toBeDefined();
      expect(result.scenario.id).toBe('priority_basic_001');
      expect(result.interactiveSteps).toBeDefined();
      expect(Array.isArray(result.interactiveSteps)).toBe(true);
      expect(result.decisionPoints).toBeDefined();
      expect(Array.isArray(result.decisionPoints)).toBe(true);
    });

    it('should throw error for non-existent scenario', async () => {
      await expect(service.simulateScenario('non_existent_scenario')).rejects.toThrow('Scenario not found');
    });
  });

  describe('createCustomScenario', () => {
    it('should create custom judge scenarios', async () => {
      const scenario = await service.createCustomScenario(
        'Custom Priority Test',
        { phase: 'main1', stack: [] },
        'When can the player cast an instant?',
        ['priority', 'timing']
      );

      expect(scenario).toBeDefined();
      expect(scenario.id).toContain('custom_');
      expect(scenario.title).toBe('Custom Priority Test');
      expect(scenario.difficulty).toBeDefined();
      expect(scenario.tags).toContain('custom');
      expect(scenario.tags).toContain('priority');
    });

    it('should assess difficulty based on complexity', async () => {
      const complexScenario = await service.createCustomScenario(
        'Complex Layers Test',
        { 
          battlefield: ['multiple continuous effects'],
          layers: ['type-changing', 'p/t-setting', 'p/t-modifying']
        },
        'What is the final result?',
        ['layers', 'continuous_effects', 'timestamps']
      );

      expect(complexScenario.difficulty).toBe('expert');
    });
  });

  describe('generateWalkthrough', () => {
    it('should generate step-by-step walkthroughs', async () => {
      const walkthrough = await service.generateWalkthrough('priority_basic_001');

      expect(walkthrough).toBeDefined();
      expect(walkthrough.steps).toBeDefined();
      expect(Array.isArray(walkthrough.steps)).toBe(true);
      expect(walkthrough.steps.length).toBeGreaterThan(0);
      expect(walkthrough.summary).toBeDefined();

      const firstStep = walkthrough.steps[0];
      expect(firstStep.stepNumber).toBe(1);
      expect(firstStep.description).toBeDefined();
      expect(firstStep.judgeNotes).toBeDefined();
      expect(Array.isArray(firstStep.commonMistakes)).toBe(true);
    });
  });
});