import { Injectable } from '@nestjs/common';

interface RuleQuery {
  keywords: string[];
  scenario?: string;
  cardNames?: string[];
}

interface RuleResult {
  ruleNumber: string;
  title: string;
  text: string;
  examples: string[];
  relatedRules: string[];
  confidence: number;
}

interface JudgeScenario {
  id: string;
  title: string;
  description: string;
  gameState: any;
  question: string;
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
}

interface PenaltyCalculation {
  infraction: string;
  severity: 'warning' | 'game_loss' | 'match_loss' | 'disqualification';
  reasoning: string;
  precedents: string[];
}

@Injectable()
export class JudgeToolkitService {
  private rulesDatabase: Map<string, any>;
  private scenarioLibrary: JudgeScenario[];
  
  constructor() {
    this.initializeRulesDatabase();
    this.initializeScenarioLibrary();
  }

  /**
   * Quick rule lookup with intelligent search
   */
  async searchRules(query: RuleQuery): Promise<RuleResult[]> {
    const results: RuleResult[] = [];
    
    // Search by keywords
    for (const [ruleId, rule] of this.rulesDatabase) {
      let confidence = 0;
      
      // Check keyword matches
      for (const keyword of query.keywords) {
        if (rule.text.toLowerCase().includes(keyword.toLowerCase())) {
          confidence += 0.3;
        }
        if (rule.title.toLowerCase().includes(keyword.toLowerCase())) {
          confidence += 0.5;
        }
        if (rule.tags?.includes(keyword.toLowerCase())) {
          confidence += 0.4;
        }
      }
      
      // Check scenario context
      if (query.scenario) {
        if (rule.scenarios?.some(s => s.includes(query.scenario.toLowerCase()))) {
          confidence += 0.3;
        }
      }
      
      // Check card name references
      if (query.cardNames) {
        for (const cardName of query.cardNames) {
          if (rule.text.includes(cardName) || rule.examples.some(ex => ex.includes(cardName))) {
            confidence += 0.2;
          }
        }
      }
      
      if (confidence > 0.2) {
        results.push({
          ruleNumber: ruleId,
          title: rule.title,
          text: rule.text,
          examples: rule.examples || [],
          relatedRules: rule.relatedRules || [],
          confidence: Math.min(1, confidence),
        });
      }
    }
    
    // Sort by confidence and return top results
    return results
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }

  /**
   * Interactive scenario simulator for judge training
   */
  async simulateScenario(scenarioId: string): Promise<{
    scenario: JudgeScenario;
    interactiveSteps: any[];
    decisionPoints: any[];
  }> {
    const scenario = this.scenarioLibrary.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }
    
    // Create interactive steps based on scenario
    const interactiveSteps = this.generateInteractiveSteps(scenario);
    const decisionPoints = this.identifyDecisionPoints(scenario);
    
    return {
      scenario,
      interactiveSteps,
      decisionPoints,
    };
  }

  /**
   * Calculate penalties based on tournament infractions
   */
  async calculatePenalty(
    infraction: string,
    context: {
      playerHistory?: string[];
      tournamentLevel?: 'regular' | 'competitive' | 'professional';
      intent?: 'accidental' | 'negligent' | 'intentional';
      impact?: 'none' | 'minor' | 'significant' | 'severe';
    }
  ): Promise<PenaltyCalculation> {
    const baseInfractions = this.getBaseInfractions();
    const matchingInfraction = baseInfractions.find(inf => 
      inf.name.toLowerCase().includes(infraction.toLowerCase())
    );
    
    if (!matchingInfraction) {
      return {
        infraction: 'Unknown infraction',
        severity: 'warning',
        reasoning: 'Infraction not found in database',
        precedents: [],
      };
    }
    
    let severity = matchingInfraction.baseSeverity;
    const reasoning = [`Base penalty for ${matchingInfraction.name}: ${severity}`];
    
    // Upgrade based on context
    if (context.intent === 'intentional') {
      severity = this.upgradeSeverity(severity);
      reasoning.push('Upgraded due to intentional nature');
    }
    
    if (context.playerHistory?.length > 0) {
      severity = this.upgradeSeverity(severity);
      reasoning.push('Upgraded due to player history');
    }
    
    if (context.tournamentLevel === 'professional' && severity === 'warning') {
      severity = 'game_loss';
      reasoning.push('Upgraded due to professional REL');
    }
    
    return {
      infraction: matchingInfraction.name,
      severity: severity as any,
      reasoning: reasoning.join('. '),
      precedents: matchingInfraction.precedents || [],
    };
  }

  /**
   * Rules conflict resolver using formal logic
   */
  async resolveRulesConflict(
    conflictDescription: string,
    involvedRules: string[]
  ): Promise<{
    resolution: string;
    priority: string;
    explanation: string;
    precedence: string[];
  }> {
    // Get the involved rules
    const rules = involvedRules.map(ruleId => this.rulesDatabase.get(ruleId)).filter(Boolean);
    
    if (rules.length === 0) {
      return {
        resolution: 'No rules found',
        priority: 'N/A',
        explanation: 'Could not find the specified rules in database',
        precedence: [],
      };
    }
    
    // Apply formal precedence rules
    const precedenceOrder = [
      'layers', // Layer system
      'timestamps', // Timestamp ordering
      'dependency', // Dependency ordering
      'specific_over_general', // More specific rules override general ones
      'later_over_earlier', // Later rules override earlier ones
    ];
    
    // Analyze rule types and determine precedence
    let resolution = 'Apply rules in standard precedence order';
    let priority = 'equal';
    let explanation = 'Standard rules precedence applies';
    
    // Check for layer system conflicts
    if (rules.some(rule => rule.tags?.includes('layer'))) {
      priority = 'layer_system';
      explanation = 'Layer system determines order of effects';
      resolution = 'Apply effects in layer order: characteristic-defining, copy, control, text-changing, type/subtype/supertype, color, ability-adding, ability-removing, power/toughness setting, power/toughness modifying';
    }
    // Check for replacement effects
    else if (rules.some(rule => rule.tags?.includes('replacement'))) {
      priority = 'replacement_effect';
      explanation = 'Replacement effects apply instead of original event';
      resolution = 'Controller of affected object chooses order of replacement effects';
    }
    // Check for triggered abilities
    else if (rules.some(rule => rule.tags?.includes('triggered'))) {
      priority = 'triggered_ability';
      explanation = 'Triggered abilities use stack and timestamp ordering';
      resolution = 'Put triggered abilities on stack in timestamp order, resolve in LIFO order';
    }
    
    return {
      resolution,
      priority,
      explanation,
      precedence: precedenceOrder,
    };
  }

  /**
   * Generate custom scenarios for specific rules testing
   */
  async createCustomScenario(
    title: string,
    gameState: any,
    question: string,
    tags: string[] = []
  ): Promise<JudgeScenario> {
    const scenarioId = `custom_${Date.now()}`;
    
    const scenario: JudgeScenario = {
      id: scenarioId,
      title,
      description: `Custom scenario: ${title}`,
      gameState,
      question,
      correctAnswer: '', // To be filled by judge
      explanation: '', // To be filled by judge
      difficulty: this.assessDifficulty(gameState, question, tags),
      tags: [...tags, 'custom'],
    };
    
    this.scenarioLibrary.push(scenario);
    
    return scenario;
  }

  /**
   * Step-by-step walkthrough generator
   */
  async generateWalkthrough(scenarioId: string): Promise<{
    steps: Array<{
      stepNumber: number;
      description: string;
      gameState: any;
      judgeNotes: string;
      commonMistakes: string[];
    }>;
    summary: string;
  }> {
    const scenario = this.scenarioLibrary.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }
    
    const steps = this.generateStepByStepResolution(scenario);
    const summary = this.generateSummary(scenario, steps);
    
    return { steps, summary };
  }

  private initializeRulesDatabase(): void {
    this.rulesDatabase = new Map();
    
    // Core game rules
    this.rulesDatabase.set('100.1', {
      title: 'Parts of the Game',
      text: 'These Magic rules apply to any Magic game with two or more players, including two-player games and multiplayer games.',
      examples: ['Standard constructed games', 'Limited formats', 'Multiplayer formats'],
      tags: ['fundamental', 'multiplayer'],
      relatedRules: ['100.2', '100.3'],
    });
    
    this.rulesDatabase.set('101.1', {
      title: 'Winning and Losing',
      text: 'A player wins the game if that player\'s opponent concedes or if a spell or ability says that player wins the game.',
      examples: ['Opponent concedes', 'Test of Endurance', 'Coalition Victory'],
      tags: ['winning', 'alternate_win_conditions'],
      relatedRules: ['104.1', '104.2'],
    });
    
    this.rulesDatabase.set('104.3a', {
      title: 'State-Based Actions - Life Total',
      text: 'A player with 0 or less life loses the game.',
      examples: ['Player at -5 life loses', 'Player at 0 life loses'],
      tags: ['state_based_actions', 'life', 'losing'],
      relatedRules: ['104.3', '118.1'],
    });
    
    // Priority and timing rules
    this.rulesDatabase.set('116.1', {
      title: 'Priority',
      text: 'Priority determines when a player may cast spells, activate abilities, and take special actions.',
      examples: ['Casting instants', 'Activating abilities', 'Playing lands'],
      tags: ['priority', 'timing', 'stack'],
      relatedRules: ['116.2', '116.3'],
    });
    
    // Layer system
    this.rulesDatabase.set('613.1', {
      title: 'Layer System',
      text: 'The values of an object\'s characteristics are determined by starting with the actual object and applying continuous effects in a series of layers.',
      examples: ['Characteristic-defining abilities', 'Copy effects', 'Control-changing effects'],
      tags: ['layer', 'continuous_effects', 'timestamps'],
      relatedRules: ['613.2', '613.3'],
    });
    
    // Replacement effects
    this.rulesDatabase.set('614.1', {
      title: 'Replacement Effects',
      text: 'Some continuous effects are replacement effects. Like prevention effects, replacement effects apply continuously as events happen.',
      examples: ['Doubling Season', 'Rest in Peace', 'Leyline of the Void'],
      tags: ['replacement', 'continuous_effects'],
      relatedRules: ['614.2', '614.3'],
    });
  }

  private initializeScenarioLibrary(): void {
    this.scenarioLibrary = [
      {
        id: 'priority_basic_001',
        title: 'Basic Priority Passing',
        description: 'Player A casts Lightning Bolt targeting Player B. When does Player B get priority to respond?',
        gameState: {
          activePlayer: 'A',
          phase: 'main1',
          stack: [{ spell: 'Lightning Bolt', controller: 'A', target: 'Player B' }],
        },
        question: 'When can Player B cast Counterspell?',
        correctAnswer: 'Immediately after Lightning Bolt is placed on the stack',
        explanation: 'After a player casts a spell, priority passes to the next player in turn order, who can respond with instants or abilities.',
        difficulty: 'beginner',
        tags: ['priority', 'stack', 'instants'],
      },
      {
        id: 'layers_complex_001',
        title: 'Complex Layer Interactions',
        description: 'A creature affected by multiple continuous effects with different layer applications.',
        gameState: {
          battlefield: [
            { name: 'Grizzly Bears', power: 2, toughness: 2, controller: 'A' },
            { name: 'Glorious Anthem', controller: 'A' },
            { name: 'Lignify', enchanting: 'Grizzly Bears', controller: 'B' },
          ],
        },
        question: 'What are the final power and toughness of Grizzly Bears?',
        correctAnswer: '1/4',
        explanation: 'Lignify (layer 4) removes abilities and sets P/T to 0/4, then Glorious Anthem (layer 7c) adds +1/+1, resulting in 1/4.',
        difficulty: 'advanced',
        tags: ['layers', 'continuous_effects', 'power_toughness'],
      },
    ];
  }

  private generateInteractiveSteps(scenario: JudgeScenario): any[] {
    return [
      {
        type: 'setup',
        description: 'Set up the initial game state',
        gameState: scenario.gameState,
        action: 'review_state',
      },
      {
        type: 'question',
        description: scenario.question,
        expectedAnswer: scenario.correctAnswer,
        action: 'provide_answer',
      },
      {
        type: 'resolution',
        description: 'Apply the correct ruling',
        explanation: scenario.explanation,
        action: 'apply_ruling',
      },
    ];
  }

  private identifyDecisionPoints(scenario: JudgeScenario): any[] {
    const decisionPoints = [];
    
    // Analyze scenario for key decision points
    if (scenario.tags.includes('priority')) {
      decisionPoints.push({
        point: 'Priority determination',
        options: ['Active player', 'Non-active player', 'APNAP order'],
        correct: 'APNAP order',
      });
    }
    
    if (scenario.tags.includes('stack')) {
      decisionPoints.push({
        point: 'Stack resolution order',
        options: ['FIFO (first in, first out)', 'LIFO (last in, first out)', 'Player choice'],
        correct: 'LIFO (last in, first out)',
      });
    }
    
    return decisionPoints;
  }

  private getBaseInfractions(): any[] {
    return [
      {
        name: 'Game Play Error — Missed Trigger',
        baseSeverity: 'warning',
        precedents: ['IPG 2.1'],
      },
      {
        name: 'Game Play Error — Looking at Extra Cards',
        baseSeverity: 'warning',
        precedents: ['IPG 2.2'],
      },
      {
        name: 'Game Play Error — Hidden Card Error',
        baseSeverity: 'game_loss',
        precedents: ['IPG 2.3'],
      },
      {
        name: 'Tournament Error — Tardiness',
        baseSeverity: 'warning',
        precedents: ['IPG 3.1'],
      },
      {
        name: 'Unsporting Conduct — Minor',
        baseSeverity: 'warning',
        precedents: ['IPG 4.1'],
      },
      {
        name: 'Unsporting Conduct — Major',
        baseSeverity: 'game_loss',
        precedents: ['IPG 4.2'],
      },
    ];
  }

  private upgradeSeverity(severity: string): string {
    const severityOrder = ['warning', 'game_loss', 'match_loss', 'disqualification'];
    const currentIndex = severityOrder.indexOf(severity);
    
    if (currentIndex >= 0 && currentIndex < severityOrder.length - 1) {
      return severityOrder[currentIndex + 1];
    }
    
    return severity;
  }

  private assessDifficulty(gameState: any, question: string, tags: string[]): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    let complexityScore = 0;
    
    // Check for advanced concepts
    if (tags.includes('layers')) complexityScore += 3;
    if (tags.includes('replacement')) complexityScore += 2;
    if (tags.includes('timestamps')) complexityScore += 2;
    if (tags.includes('state_based_actions')) complexityScore += 1;
    
    // Check game state complexity
    if (gameState.stack?.length > 2) complexityScore += 1;
    if (gameState.battlefield?.length > 5) complexityScore += 1;
    
    if (complexityScore >= 5) return 'expert';
    if (complexityScore >= 3) return 'advanced';
    if (complexityScore >= 1) return 'intermediate';
    return 'beginner';
  }

  private generateStepByStepResolution(scenario: JudgeScenario): any[] {
    return [
      {
        stepNumber: 1,
        description: 'Analyze the game state',
        gameState: scenario.gameState,
        judgeNotes: 'Identify all relevant permanents and effects',
        commonMistakes: ['Missing hidden information', 'Overlooking continuous effects'],
      },
      {
        stepNumber: 2,
        description: 'Identify applicable rules',
        gameState: scenario.gameState,
        judgeNotes: 'Reference specific rule numbers and interactions',
        commonMistakes: ['Applying outdated rules', 'Missing rule interactions'],
      },
      {
        stepNumber: 3,
        description: 'Apply resolution',
        gameState: scenario.gameState,
        judgeNotes: scenario.explanation,
        commonMistakes: ['Incorrect precedence order', 'Missing timing restrictions'],
      },
    ];
  }

  private generateSummary(scenario: JudgeScenario, steps: any[]): string {
    return `Scenario: ${scenario.title}\nDifficulty: ${scenario.difficulty}\nKey concepts: ${scenario.tags.join(', ')}\nResolution: ${scenario.correctAnswer}\nExplanation: ${scenario.explanation}`;
  }
}