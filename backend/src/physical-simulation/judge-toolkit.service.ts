import { Injectable } from "@nestjs/common";

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
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
}

interface PenaltyCalculation {
  infraction: string;
  severity: "warning" | "game_loss" | "match_loss" | "disqualification";
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
        if (
          rule.scenarios?.some((s) => s.includes(query.scenario.toLowerCase()))
        ) {
          confidence += 0.3;
        }
      }

      // Check card name references
      if (query.cardNames) {
        for (const cardName of query.cardNames) {
          if (
            rule.text.includes(cardName) ||
            rule.examples.some((ex) => ex.includes(cardName))
          ) {
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
    return results.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  }

  /**
   * Interactive scenario simulator for judge training
   */
  async simulateScenario(scenarioId: string): Promise<{
    scenario: JudgeScenario;
    interactiveSteps: any[];
    decisionPoints: any[];
  }> {
    const scenario = this.scenarioLibrary.find((s) => s.id === scenarioId);
    if (!scenario) {
      throw new Error("Scenario not found");
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
      tournamentLevel?: "regular" | "competitive" | "professional";
      intent?: "accidental" | "negligent" | "intentional";
      impact?: "none" | "minor" | "significant" | "severe";
    }
  ): Promise<PenaltyCalculation> {
    const baseInfractions = this.getBaseInfractions();
    const matchingInfraction = baseInfractions.find((inf) =>
      inf.name.toLowerCase().includes(infraction.toLowerCase())
    );

    if (!matchingInfraction) {
      return {
        infraction: "Unknown infraction",
        severity: "warning",
        reasoning: "Infraction not found in database",
        precedents: [],
      };
    }

    let severity = matchingInfraction.baseSeverity;
    const reasoning = [
      `Base penalty for ${matchingInfraction.name}: ${severity}`,
    ];

    // Upgrade based on context
    if (context.intent === "intentional") {
      severity = this.upgradeSeverity(severity);
      reasoning.push("Upgraded due to intentional nature");
    }

    if (context.playerHistory?.length > 0) {
      severity = this.upgradeSeverity(severity);
      reasoning.push("Upgraded due to player history");
    }

    if (context.tournamentLevel === "professional" && severity === "warning") {
      severity = "game_loss";
      reasoning.push("Upgraded due to professional REL");
    }

    return {
      infraction: matchingInfraction.name,
      severity: severity as any,
      reasoning: reasoning.join(". "),
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
    const rules = involvedRules
      .map((ruleId) => this.rulesDatabase.get(ruleId))
      .filter(Boolean);

    if (rules.length === 0) {
      return {
        resolution: "No rules found",
        priority: "N/A",
        explanation: "Could not find the specified rules in database",
        precedence: [],
      };
    }

    // Apply formal precedence rules
    const precedenceOrder = [
      "layers", // Layer system
      "timestamps", // Timestamp ordering
      "dependency", // Dependency ordering
      "specific_over_general", // More specific rules override general ones
      "later_over_earlier", // Later rules override earlier ones
    ];

    // Analyze rule types and determine precedence
    let resolution = "Apply rules in standard precedence order";
    let priority = "equal";
    let explanation = "Standard rules precedence applies";

    // Check for layer system conflicts
    if (rules.some((rule) => rule.tags?.includes("layer"))) {
      priority = "layer_system";
      explanation = "Layer system determines order of effects";
      resolution =
        "Apply effects in layer order: characteristic-defining, copy, control, text-changing, type/subtype/supertype, color, ability-adding, ability-removing, power/toughness setting, power/toughness modifying";
    }
    // Check for replacement effects
    else if (rules.some((rule) => rule.tags?.includes("replacement"))) {
      priority = "replacement_effect";
      explanation = "Replacement effects apply instead of original event";
      resolution =
        "Controller of affected object chooses order of replacement effects";
    }
    // Check for triggered abilities
    else if (rules.some((rule) => rule.tags?.includes("triggered"))) {
      priority = "triggered_ability";
      explanation = "Triggered abilities use stack and timestamp ordering";
      resolution =
        "Put triggered abilities on stack in timestamp order, resolve in LIFO order";
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
      correctAnswer: "", // To be filled by judge
      explanation: "", // To be filled by judge
      difficulty: this.assessDifficulty(gameState, question, tags),
      tags: [...tags, "custom"],
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
    const scenario = this.scenarioLibrary.find((s) => s.id === scenarioId);
    if (!scenario) {
      throw new Error("Scenario not found");
    }

    const steps = this.generateStepByStepResolution(scenario);
    const summary = this.generateSummary(scenario, steps);

    return { steps, summary };
  }

  private initializeRulesDatabase(): void {
    this.rulesDatabase = new Map();

    // KONIVRER Core Game Rules
    this.rulesDatabase.set("KR-100.1", {
      title: "Game Overview",
      text: 'KONIVRER is a strategic, expandable card game where players take on the role of powerful magic users called "Conjurers."',
      examples: [
        "1v1 battles",
        "2v2 team battles",
        "3v3 group battles",
        "free-for-all multiplayer",
      ],
      tags: ["fundamental", "multiplayer"],
      relatedRules: ["KR-100.2", "KR-200.1"],
    });

    this.rulesDatabase.set("KR-101.1", {
      title: "Winning Condition",
      text: "Reduce your opponent's Life Cards to 0 by attacking with Familiars and Spells. Players can defend with their own Familiars.",
      examples: [
        "Direct damage to Life Cards",
        "Unblocked Familiar attacks",
        "Spell damage",
      ],
      tags: ["winning", "life_cards", "combat"],
      relatedRules: ["KR-300.1", "KR-400.1"],
    });

    this.rulesDatabase.set("KR-200.1", {
      title: "Deck Construction",
      text: "Each deck contains exactly 40 cards plus 1 Flag. Deck limits: 25 Common (🜠), 13 Uncommon (☽), 2 Rare (☉), 1 copy maximum per card.",
      examples: [
        "Standard 40-card deck",
        "Flag anchors deck identity",
        "Rarity distribution enforced",
      ],
      tags: ["deck_construction", "flags", "rarity"],
      relatedRules: ["KR-200.2", "KR-200.3"],
    });

    this.rulesDatabase.set("KR-300.1", {
      title: "Game Setup - Life Cards",
      text: "Before the game, place the top 4 cards of your deck face down as Life Cards. These remain hidden until revealed as damage.",
      examples: [
        "4 Life Cards per player",
        "Face down until damage taken",
        "Burst abilities can trigger",
      ],
      tags: ["setup", "life_cards", "burst"],
      relatedRules: ["KR-300.2", "KR-600.1"],
    });

    this.rulesDatabase.set("KR-400.1", {
      title: "Game Phases",
      text: "Each turn has 5 phases: Start Phase, Main Phase, Combat Phase, Post-Combat Main Phase, Refresh Phase.",
      examples: [
        "Start: Draw 2 (first turn), place Azoth",
        "Main: Play cards, resolve keywords",
        "Combat: Attack with Familiars",
      ],
      tags: ["phases", "turn_structure"],
      relatedRules: ["KR-400.2", "KR-400.3", "KR-400.4"],
    });

    this.rulesDatabase.set("KR-500.1", {
      title: "Elements System",
      text: "Six elements plus Generic: Fire (🜂), Water (🜄), Earth (🜃), Air (🜁), Aether (⭘), Nether (▢), Generic (✡⃝).",
      examples: [
        "Elemental Azoth costs",
        "Keyword interactions",
        "Flag alignment bonuses",
      ],
      tags: ["elements", "azoth", "mana"],
      relatedRules: ["KR-500.2", "KR-700.1"],
    });

    this.rulesDatabase.set("KR-600.1", {
      title: "Card Play Modes",
      text: "Cards can be played in multiple ways: Summon (as Familiar), Spell (resolve then bottom deck), Azoth (as resource), Tribute (sacrifice for cost), Burst (free from Life Cards).",
      examples: [
        "Summon with +1 counters",
        "Spell to bottom of deck",
        "Azoth generates elements",
      ],
      tags: ["play_modes", "summon", "spell", "azoth", "tribute", "burst"],
      relatedRules: ["KR-600.2", "KR-600.3"],
    });

    // KONIVRER Keyword Rules
    this.rulesDatabase.set("KR-700.1", {
      title: "Amalgam Keyword",
      text: "Choose one of two options when played. As Summon: choose keyword and element. As Azoth: choose element type to generate.",
      examples: ["Gust or Brilliance choice", "Elemental choice for Azoth"],
      tags: ["amalgam", "keywords", "choice"],
      relatedRules: ["KR-700.2", "KR-700.3"],
    });

    this.rulesDatabase.set("KR-700.2", {
      title: "Brilliance Keyword",
      text: "Place target Familiar with +1 Counters or Spell with Strength ≤ ⭘ used to pay for this card's Strength on the bottom of its owner's life cards. Does not affect ▢ cards.",
      examples: [
        "Target low-strength Familiars",
        "Affects Spells with low Strength",
        "Nether cards immune",
      ],
      tags: ["brilliance", "targeting", "life_cards", "aether"],
      relatedRules: ["KR-700.3", "KR-700.4"],
    });

    this.rulesDatabase.set("KR-700.3", {
      title: "Gust Keyword",
      text: "Return target Familiar with +1 Counters or Spell with Strength ≤ 🜁 used to pay for this card's Strength to its owner's hand. Does not affect 🜃 cards.",
      examples: [
        "Bounce effect to hand",
        "Air strength limitation",
        "Earth cards immune",
      ],
      tags: ["gust", "bounce", "hand", "air"],
      relatedRules: ["KR-700.4", "KR-700.5"],
    });

    this.rulesDatabase.set("KR-700.4", {
      title: "Inferno Keyword",
      text: "After damage is dealt to the target card, add damage ≤ 🜂 used to pay for this card's Strength. Does not affect 🜄 cards.",
      examples: [
        "Extra damage after initial damage",
        "Fire strength bonus",
        "Water cards immune",
      ],
      tags: ["inferno", "damage", "fire"],
      relatedRules: ["KR-700.5", "KR-700.6"],
    });

    this.rulesDatabase.set("KR-700.5", {
      title: "Steadfast Keyword",
      text: "Redirect damage ≤ 🜃 used to pay for this card's Strength, that would be done to you or cards you control, to this card. Does not affect 🜂 cards.",
      examples: [
        "Damage redirection",
        "Protection effect",
        "Fire cards immune",
      ],
      tags: ["steadfast", "protection", "redirection", "earth"],
      relatedRules: ["KR-700.6", "KR-700.7"],
    });

    this.rulesDatabase.set("KR-700.6", {
      title: "Submerged Keyword",
      text: "Place target Familiar with +1 Counters or Spell with Strength ≤ 🜄 used to pay for this card's Strength, that many cards below the top of its owner's deck. Does not affect 🜁 cards.",
      examples: [
        "Bury cards in deck",
        "Water strength depth",
        "Air cards immune",
      ],
      tags: ["submerged", "deck", "bury", "water"],
      relatedRules: ["KR-700.7", "KR-700.8"],
    });

    this.rulesDatabase.set("KR-700.7", {
      title: "Quintessence Keyword",
      text: "This card can't be played as a Familiar. While in the Azoth row, it produces any Azoth type.",
      examples: [
        "Azoth-only cards",
        "Universal Azoth generation",
        "Flexible resource",
      ],
      tags: ["quintessence", "azoth", "universal"],
      relatedRules: ["KR-700.8", "KR-500.1"],
    });

    this.rulesDatabase.set("KR-700.8", {
      title: "Void Keyword",
      text: "Remove target card from the game. Does not affect ⭘ cards. Removed cards go to the Removed from Play zone.",
      examples: [
        "Permanent removal",
        "Aether cards immune",
        "Removed from Play zone",
      ],
      tags: ["void", "removal", "exile", "aether"],
      relatedRules: ["KR-800.1"],
    });

    // KONIVRER Zone Rules
    this.rulesDatabase.set("KR-800.1", {
      title: "Game Zones",
      text: "Seven zones: Field (main battlefield), Combat Row (combat area), Azoth Row (resources), Life Cards, Flag, Deck, Removed from Play.",
      examples: [
        "Field for Familiars",
        "Combat Row for battles",
        "Azoth Row for resources",
      ],
      tags: ["zones", "field", "combat_row", "azoth_row"],
      relatedRules: ["KR-800.2", "KR-800.3"],
    });

    // Add MTG compatibility rules for reference
    this.rulesDatabase.set("MTG-100.1", {
      title: "Parts of the Game (MTG Reference)",
      text: "These Magic rules apply to any Magic game with two or more players, including two-player games and multiplayer games.",
      examples: [
        "Standard constructed games",
        "Limited formats",
        "Multiplayer formats",
      ],
      tags: ["fundamental", "multiplayer", "mtg_reference"],
      relatedRules: ["MTG-100.2", "MTG-100.3"],
    });
  }

  private initializeScenarioLibrary(): void {
    this.scenarioLibrary = [
      // KONIVRER-specific scenarios
      {
        id: "konivr_amalgam_001",
        title: "Amalgam Choice Resolution",
        description:
          'Player A plays an Amalgam card with "Gust or Brilliance". Which keyword is chosen and how does it affect the game?',
        gameState: {
          activePlayer: "A",
          phase: "main",
          field: [{ name: "Enemy Familiar", strength: 2, controller: "B" }],
          hand: [
            {
              name: "Amalgam Familiar",
              keywords: ["Gust or Brilliance"],
              controller: "A",
            },
          ],
        },
        question:
          "Player A chooses Brilliance. What happens to the Enemy Familiar?",
        correctAnswer:
          "If Player A pays ⭘ for Brilliance strength ≥ 2, Enemy Familiar goes to bottom of Player B's Life Cards",
        explanation:
          "Amalgam allows choosing Brilliance, which can target Familiars with strength ≤ ⭘ paid and places them on bottom of owner's Life Cards.",
        difficulty: "intermediate",
        tags: ["amalgam", "brilliance", "targeting", "konivrer"],
      },
      {
        id: "konivr_burst_001",
        title: "Burst Ability Timing",
        description:
          "Player B takes damage and reveals a card with Burst from their Life Cards. When can they play it?",
        gameState: {
          activePlayer: "A",
          phase: "combat",
          lifeCards: [
            { name: "Burst Spell", keywords: ["Burst"], controller: "B" },
          ],
          damage: 1,
        },
        question: "When can Player B play the Burst Spell for free?",
        correctAnswer:
          "Immediately when drawn from Life Cards as damage, before further game actions",
        explanation:
          "Burst allows playing the card for free when drawn from Life Cards, with ✡⃝ = remaining Life Cards.",
        difficulty: "beginner",
        tags: ["burst", "timing", "life_cards", "konivrer"],
      },
      {
        id: "konivr_zones_001",
        title: "Combat Row vs Field Placement",
        description:
          "Player A has Familiars in both Field and Combat Row. Which can attack?",
        gameState: {
          activePlayer: "A",
          phase: "combat",
          field: [{ name: "Field Familiar", controller: "A" }],
          combatRow: [{ name: "Combat Familiar", controller: "A" }],
        },
        question: "Which Familiars can attack this turn?",
        correctAnswer: "Both Field and Combat Row Familiars can attack",
        explanation:
          "KONIVRER allows Familiars from both Field and Combat Row to participate in combat.",
        difficulty: "beginner",
        tags: ["zones", "combat", "field", "combat_row", "konivrer"],
      },
      {
        id: "konivr_elements_001",
        title: "Element Immunity Interactions",
        description:
          "Player A uses Gust (🜁) targeting Player B's Earth (🜃) Familiar. What happens?",
        gameState: {
          activePlayer: "A",
          phase: "main",
          field: [{ name: "Earth Guardian", element: "🜃", controller: "B" }],
          spells: [{ name: "Gust Effect", element: "🜁", controller: "A" }],
        },
        question: "Does Gust affect the Earth Familiar?",
        correctAnswer:
          "No, Earth cards (🜃) are immune to Air effects like Gust",
        explanation:
          "Each KONIVRER keyword has elemental immunities: Gust does not affect Earth cards.",
        difficulty: "intermediate",
        tags: ["elements", "immunity", "gust", "earth", "konivrer"],
      },
      {
        id: "konivr_azoth_001",
        title: "Azoth Generation and Usage",
        description:
          "Player has 3 cards in Azoth Row during Refresh Phase. How much Azoth is available?",
        gameState: {
          activePlayer: "A",
          phase: "refresh",
          azothRow: [
            { name: "Fire Azoth", element: "🜂" },
            { name: "Water Azoth", element: "🜄" },
            { name: "Generic Azoth", element: "✡⃝" },
          ],
        },
        question: "What Azoth is generated this turn?",
        correctAnswer: "1 Fire, 1 Water, 1 Generic Azoth",
        explanation:
          "Each card in Azoth Row generates 1 Azoth of its element type during Refresh Phase.",
        difficulty: "beginner",
        tags: ["azoth", "resources", "generation", "konivrer"],
      },

      // Legacy MTG scenarios for compatibility
      {
        id: "priority_basic_001",
        title: "Basic Priority Passing (MTG)",
        description:
          "Player A casts Lightning Bolt targeting Player B. When does Player B get priority to respond?",
        gameState: {
          activePlayer: "A",
          phase: "main1",
          stack: [
            { spell: "Lightning Bolt", controller: "A", target: "Player B" },
          ],
        },
        question: "When can Player B cast Counterspell?",
        correctAnswer:
          "Immediately after Lightning Bolt is placed on the stack",
        explanation:
          "After a player casts a spell, priority passes to the next player in turn order, who can respond with instants or abilities.",
        difficulty: "beginner",
        tags: ["priority", "stack", "instants", "mtg"],
      },
    ];
  }

  private generateInteractiveSteps(scenario: JudgeScenario): any[] {
    return [
      {
        type: "setup",
        description: "Set up the initial game state",
        gameState: scenario.gameState,
        action: "review_state",
      },
      {
        type: "question",
        description: scenario.question,
        expectedAnswer: scenario.correctAnswer,
        action: "provide_answer",
      },
      {
        type: "resolution",
        description: "Apply the correct ruling",
        explanation: scenario.explanation,
        action: "apply_ruling",
      },
    ];
  }

  private identifyDecisionPoints(scenario: JudgeScenario): any[] {
    const decisionPoints = [];

    // Analyze scenario for key decision points
    if (scenario.tags.includes("priority")) {
      decisionPoints.push({
        point: "Priority determination",
        options: ["Active player", "Non-active player", "APNAP order"],
        correct: "APNAP order",
      });
    }

    if (scenario.tags.includes("stack")) {
      decisionPoints.push({
        point: "Stack resolution order",
        options: [
          "FIFO (first in, first out)",
          "LIFO (last in, first out)",
          "Player choice",
        ],
        correct: "LIFO (last in, first out)",
      });
    }

    return decisionPoints;
  }

  private getBaseInfractions(): any[] {
    return [
      {
        name: "Game Play Error — Missed Trigger",
        baseSeverity: "warning",
        precedents: ["IPG 2.1"],
      },
      {
        name: "Game Play Error — Looking at Extra Cards",
        baseSeverity: "warning",
        precedents: ["IPG 2.2"],
      },
      {
        name: "Game Play Error — Hidden Card Error",
        baseSeverity: "game_loss",
        precedents: ["IPG 2.3"],
      },
      {
        name: "Tournament Error — Tardiness",
        baseSeverity: "warning",
        precedents: ["IPG 3.1"],
      },
      {
        name: "Unsporting Conduct — Minor",
        baseSeverity: "warning",
        precedents: ["IPG 4.1"],
      },
      {
        name: "Unsporting Conduct — Major",
        baseSeverity: "game_loss",
        precedents: ["IPG 4.2"],
      },
    ];
  }

  private upgradeSeverity(severity: string): string {
    const severityOrder = [
      "warning",
      "game_loss",
      "match_loss",
      "disqualification",
    ];
    const currentIndex = severityOrder.indexOf(severity);

    if (currentIndex >= 0 && currentIndex < severityOrder.length - 1) {
      return severityOrder[currentIndex + 1];
    }

    return severity;
  }

  private assessDifficulty(
    gameState: any,
    question: string,
    tags: string[]
  ): "beginner" | "intermediate" | "advanced" | "expert" {
    let complexityScore = 0;

    // Check for advanced concepts
    if (tags.includes("layers")) complexityScore += 3;
    if (tags.includes("replacement")) complexityScore += 2;
    if (tags.includes("timestamps")) complexityScore += 2;
    if (tags.includes("state_based_actions")) complexityScore += 1;

    // Check game state complexity
    if (gameState.stack?.length > 2) complexityScore += 1;
    if (gameState.battlefield?.length > 5) complexityScore += 1;

    if (complexityScore >= 5) return "expert";
    if (complexityScore >= 3) return "advanced";
    if (complexityScore >= 1) return "intermediate";
    return "beginner";
  }

  private generateStepByStepResolution(scenario: JudgeScenario): any[] {
    return [
      {
        stepNumber: 1,
        description: "Analyze the game state",
        gameState: scenario.gameState,
        judgeNotes: "Identify all relevant permanents and effects",
        commonMistakes: [
          "Missing hidden information",
          "Overlooking continuous effects",
        ],
      },
      {
        stepNumber: 2,
        description: "Identify applicable rules",
        gameState: scenario.gameState,
        judgeNotes: "Reference specific rule numbers and interactions",
        commonMistakes: [
          "Applying outdated rules",
          "Missing rule interactions",
        ],
      },
      {
        stepNumber: 3,
        description: "Apply resolution",
        gameState: scenario.gameState,
        judgeNotes: scenario.explanation,
        commonMistakes: [
          "Incorrect precedence order",
          "Missing timing restrictions",
        ],
      },
    ];
  }

  private generateSummary(scenario: JudgeScenario, steps: any[]): string {
    return `Scenario: ${scenario.title}\nDifficulty: ${
      scenario.difficulty
    }\nKey concepts: ${scenario.tags.join(", ")}\nResolution: ${
      scenario.correctAnswer
    }\nExplanation: ${scenario.explanation}`;
  }
}
