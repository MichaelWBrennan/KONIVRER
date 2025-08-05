import { Card, Deck } from '../../ai/DeckOptimizer';

export interface ArchetypeGuide {
  id: string;
  name: string;
  description: string;
  keyCards: Card[];
  strategy: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  synergies: string[];
  counters: string[];
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  interactiveElement?: string;
  requiredAction?: string;
  tips: string[];
}

export interface Tutorial {
  id: string;
  archetype: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  completionRewards: string[];
}

export class PlayerOnboardingSystem {
  private tutorials: Map<string, Tutorial> = new Map();
  private archetypes: Map<string, ArchetypeGuide> = new Map();
  private playerProgress: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeArchetypes();
    this.initializeTutorials();
  }

  private initializeArchetypes(): void {
    const aggro: ArchetypeGuide = {
      id: 'aggro',
      name: 'Aggressive Rush',
      description: 'Fast-paced deck focused on dealing quick damage with low-cost creatures and spells.',
      keyCards: [
        {
          id: 'lightning-bolt',
          name: 'Lightning Bolt',
          cost: 1,
          attack: 3,
          type: 'spell',
          rarity: 'common',
          abilities: ['instant', 'damage']
        },
        {
          id: 'storm-warrior',
          name: 'Storm Warrior',
          cost: 2,
          attack: 3,
          health: 2,
          type: 'creature',
          rarity: 'common',
          abilities: ['haste']
        }
      ],
      strategy: 'Play low-cost cards early, maintain board presence, finish opponent quickly',
      difficulty: 'beginner',
      synergies: ['Low mana curve', 'Direct damage', 'Quick creatures'],
      counters: ['Board clears', 'Lifegain', 'High-toughness blockers']
    };

    const control: ArchetypeGuide = {
      id: 'control',
      name: 'Control Master',
      description: 'Patient deck that counters threats and wins with powerful late-game cards.',
      keyCards: [
        {
          id: 'counterspell',
          name: 'Counterspell',
          cost: 2,
          type: 'spell',
          rarity: 'common',
          abilities: ['counter', 'instant']
        },
        {
          id: 'ancient-dragon',
          name: 'Ancient Dragon',
          cost: 8,
          attack: 8,
          health: 8,
          type: 'creature',
          rarity: 'legendary',
          abilities: ['flying', 'legendary']
        }
      ],
      strategy: 'Control the game tempo, remove threats, win with few powerful cards',
      difficulty: 'advanced',
      synergies: ['Card draw', 'Removal spells', 'Win conditions'],
      counters: ['Fast aggro', 'Uncounterable threats', 'Resource denial']
    };

    const combo: ArchetypeGuide = {
      id: 'combo',
      name: 'Combo Synergy',
      description: 'Deck built around specific card combinations that create powerful synergistic effects.',
      keyCards: [
        {
          id: 'mystic-engine',
          name: 'Mystic Engine',
          cost: 4,
          type: 'artifact',
          rarity: 'rare',
          abilities: ['draw', 'combo']
        },
        {
          id: 'spell-cascade',
          name: 'Spell Cascade',
          cost: 3,
          type: 'enchantment',
          rarity: 'rare',
          abilities: ['cascade', 'trigger']
        }
      ],
      strategy: 'Assemble key pieces, protect combo, execute for game-winning effect',
      difficulty: 'intermediate',
      synergies: ['Card selection', 'Protection', 'Tutors'],
      counters: ['Disruption', 'Fast pressure', 'Graveyard hate']
    };

    this.archetypes.set('aggro', aggro);
    this.archetypes.set('control', control);
    this.archetypes.set('combo', combo);
  }

  private initializeTutorials(): void {
    // Aggro tutorial
    const aggroTutorial: Tutorial = {
      id: 'aggro-basics',
      archetype: 'aggro',
      title: 'Mastering Aggressive Strategies',
      description: 'Learn the fundamentals of playing aggressive decks effectively.',
      steps: [
        {
          id: 'mulligan-guide',
          title: 'Aggressive Mulligan',
          description: 'Learn what cards to keep and what to mulligan in your opening hand.',
          tips: [
            'Keep 1-2 mana creatures',
            'Look for a smooth mana curve',
            'Mulligan hands with too many high-cost cards',
            'Prioritize cards that deal immediate damage'
          ]
        },
        {
          id: 'early-game',
          title: 'Early Game Pressure',
          description: 'Establish board control and apply immediate pressure.',
          requiredAction: 'Play a 1-mana creature on turn 1',
          tips: [
            'Always use your mana efficiently',
            'Prioritize board presence over card advantage',
            'Attack when beneficial, even for small damage'
          ]
        },
        {
          id: 'mid-game',
          title: 'Maintaining Momentum',
          description: 'Keep the pressure up and push for victory.',
          tips: [
            'Continue playing threats each turn',
            'Use removal on key blockers',
            'Calculate lethal damage opportunities'
          ]
        },
        {
          id: 'closing-game',
          title: 'Finishing the Game',
          description: 'Recognize when to go all-in for the win.',
          tips: [
            'Switch focus from board to face when close to lethal',
            'Use direct damage spells to finish opponent',
            'Don\'t be afraid to trade creatures for face damage'
          ]
        }
      ],
      completionRewards: ['Aggro Mastery Badge', 'Lightning Border Frame']
    };

    // Control tutorial
    const controlTutorial: Tutorial = {
      id: 'control-basics',
      archetype: 'control',
      title: 'Control Fundamentals',
      description: 'Master the art of controlling the game and winning with superior card quality.',
      steps: [
        {
          id: 'resource-management',
          title: 'Resource Management',
          description: 'Learn to manage your hand size and mana efficiently.',
          tips: [
            'Card advantage is more important than tempo',
            'Don\'t waste removal on small threats',
            'Plan several turns ahead'
          ]
        },
        {
          id: 'threat-assessment',
          title: 'Threat Assessment',
          description: 'Identify which threats require immediate answers.',
          requiredAction: 'Counter or remove a high-priority threat',
          tips: [
            'Evaluate threats based on their long-term impact',
            'Sometimes letting small threats through is correct',
            'Save answers for the most dangerous cards'
          ]
        },
        {
          id: 'win-condition',
          title: 'Win Condition Timing',
          description: 'Know when to deploy your win conditions safely.',
          tips: [
            'Ensure you can protect your win condition',
            'Wait for the right moment to commit',
            'Have backup plans if your first win condition fails'
          ]
        }
      ],
      completionRewards: ['Control Mastery Badge', 'Mystic Aura Effect']
    };

    this.tutorials.set('aggro-basics', aggroTutorial);
    this.tutorials.set('control-basics', controlTutorial);
  }

  getArchetypes(): ArchetypeGuide[] {
    return Array.from(this.archetypes.values());
  }

  getArchetype(id: string): ArchetypeGuide | undefined {
    return this.archetypes.get(id);
  }

  getTutorialsForArchetype(archetypeId: string): Tutorial[] {
    return Array.from(this.tutorials.values()).filter(
      tutorial => tutorial.archetype === archetypeId
    );
  }

  getTutorial(id: string): Tutorial | undefined {
    return this.tutorials.get(id);
  }

  markStepCompleted(playerId: string, tutorialId: string, stepId: string): void {
    if (!this.playerProgress.has(playerId)) {
      this.playerProgress.set(playerId, new Set());
    }
    this.playerProgress.get(playerId)!.add(`${tutorialId}:${stepId}`);
  }

  isStepCompleted(playerId: string, tutorialId: string, stepId: string): boolean {
    const progress = this.playerProgress.get(playerId);
    return progress ? progress.has(`${tutorialId}:${stepId}`) : false;
  }

  getTutorialProgress(playerId: string, tutorialId: string): number {
    const tutorial = this.getTutorial(tutorialId);
    if (!tutorial) return 0;

    const completedSteps = tutorial.steps.filter(step =>
      this.isStepCompleted(playerId, tutorialId, step.id)
    ).length;

    return completedSteps / tutorial.steps.length;
  }

  getRecommendedTutorial(playerSkillLevel: 'beginner' | 'intermediate' | 'advanced'): Tutorial | null {
    const tutorials = Array.from(this.tutorials.values());
    const matchingTutorials = tutorials.filter(tutorial => {
      const archetype = this.getArchetype(tutorial.archetype);
      return archetype?.difficulty === playerSkillLevel;
    });

    return matchingTutorials.length > 0 ? matchingTutorials[0] : null;
  }

  generatePersonalizedTips(deck: Deck): string[] {
    const tips: string[] = [];
    
    // Analyze deck composition
    const avgCost = deck.cards.reduce((sum, card) => sum + card.cost, 0) / deck.cards.length;
    const creatureCount = deck.cards.filter(card => card.type === 'creature').length;
    const spellCount = deck.cards.filter(card => card.type === 'spell').length;

    if (avgCost > 4) {
      tips.push('Your deck has a high mana curve. Consider adding more low-cost cards for early game stability.');
    }

    if (creatureCount < deck.cards.length * 0.3) {
      tips.push('Your deck may need more creatures for board presence. Consider adding creature cards.');
    }

    if (spellCount > deck.cards.length * 0.7) {
      tips.push('High spell count detected. Ensure you have win conditions that don\'t rely solely on spells.');
    }

    // Add archetype-specific tips
    if (avgCost <= 3 && creatureCount >= deck.cards.length * 0.6) {
      tips.push('Your deck appears aggressive. Focus on early pressure and closing games quickly.');
    } else if (avgCost >= 4 && spellCount >= deck.cards.length * 0.4) {
      tips.push('Your deck appears control-oriented. Focus on card advantage and late-game power.');
    }

    return tips;
  }
}

export const playerOnboardingSystem = new PlayerOnboardingSystem();