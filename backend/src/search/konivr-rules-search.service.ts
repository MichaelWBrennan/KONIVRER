import { Injectable } from "@nestjs/common";

interface KonivrRule {
  id: string;
  title: string;
  text: string;
  keywords: string[];
  elements: string[];
  examples: string[];
  relatedRules: string[];
  category: "core" | "keywords" | "zones" | "phases" | "deck_construction";
}

interface SearchResult {
  rule: KonivrRule;
  relevanceScore: number;
  matchingTerms: string[];
}

interface SearchFilters {
  category?: string[];
  keywords?: string[];
  elements?: string[];
  difficulty?: string[];
}

@Injectable()
export class KonivrRulesSearchService {
  private rulesIndex: Map<string, KonivrRule> = new Map();
  private keywordIndex: Map<string, string[]> = new Map();
  private elementIndex: Map<string, string[]> = new Map();

  constructor() {
    this.initializeKonivrRules();
    this.buildSearchIndex();
  }

  /**
   * Search KONIVRER rules with intelligent ranking
   */
  async searchRules(
    query: string,
    filters?: SearchFilters,
    limit: number = 10
  ): Promise<SearchResult[]> {
    const searchTerms = this.parseQuery(query);
    const results: SearchResult[] = [];

    for (const [ruleId, rule] of this.rulesIndex) {
      // Apply filters first
      if (filters && !this.passesFilters(rule, filters)) {
        continue;
      }

      const relevanceScore = this.calculateRelevance(rule, searchTerms);
      const matchingTerms = this.getMatchingTerms(rule, searchTerms);

      if (relevanceScore > 0) {
        results.push({
          rule,
          relevanceScore,
          matchingTerms,
        });
      }
    }

    // Sort by relevance and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * Get rules by keyword (e.g., "Amalgam", "Brilliance")
   */
  async getRulesByKeyword(keyword: string): Promise<KonivrRule[]> {
    const ruleIds = this.keywordIndex.get(keyword.toLowerCase()) || [];
    return ruleIds
      .map((id) => this.rulesIndex.get(id))
      .filter(Boolean) as KonivrRule[];
  }

  /**
   * Get rules by element (e.g., "Fire", "🜂")
   */
  async getRulesByElement(element: string): Promise<KonivrRule[]> {
    const ruleIds = this.elementIndex.get(element.toLowerCase()) || [];
    return ruleIds
      .map((id) => this.rulesIndex.get(id))
      .filter(Boolean) as KonivrRule[];
  }

  /**
   * Get quick reference for specific scenarios
   */
  async getQuickReference(scenario: string): Promise<KonivrRule[]> {
    const scenarioMap: Record<string, string[]> = {
      damage: ["KR-101.1", "KR-300.1", "KR-700.4"], // Inferno, Life Cards
      combat: ["KR-101.1", "KR-400.1", "KR-800.1"], // Combat phase, zones
      keywords: ["KR-700.1", "KR-700.2", "KR-700.3", "KR-700.4"], // All keywords
      elements: ["KR-500.1", "KR-700.2", "KR-700.3"], // Element system
      deck_building: ["KR-200.1", "KR-200.2"], // Deck construction
      setup: ["KR-300.1", "KR-400.1"], // Game setup and phases
    };

    const ruleIds = scenarioMap[scenario.toLowerCase()] || [];
    return ruleIds
      .map((id) => this.rulesIndex.get(id))
      .filter(Boolean) as KonivrRule[];
  }

  /**
   * Interactive rule explorer for learning
   */
  async exploreRule(ruleId: string): Promise<{
    rule: KonivrRule;
    relatedRules: KonivrRule[];
    examples: string[];
    interactions: string[];
  } | null> {
    const rule = this.rulesIndex.get(ruleId);
    if (!rule) return null;

    const relatedRules = rule.relatedRules
      .map((id) => this.rulesIndex.get(id))
      .filter(Boolean) as KonivrRule[];

    const interactions = this.findRuleInteractions(rule);

    return {
      rule,
      relatedRules,
      examples: rule.examples,
      interactions,
    };
  }

  private initializeKonivrRules(): void {
    const rules: KonivrRule[] = [
      {
        id: "KR-100.1",
        title: "Game Overview",
        text: 'KONIVRER is a strategic, expandable card game where players take on the role of powerful magic users called "Conjurers."',
        keywords: ["conjurer", "strategic", "expandable"],
        elements: [],
        examples: [
          "1v1 battles",
          "2v2 team battles",
          "free-for-all multiplayer",
        ],
        relatedRules: ["KR-101.1", "KR-200.1"],
        category: "core",
      },
      {
        id: "KR-101.1",
        title: "Winning Condition",
        text: "Reduce your opponent's Life Cards to 0 by attacking with Familiars and Spells.",
        keywords: ["winning", "life cards", "familiars", "spells"],
        elements: [],
        examples: ["Direct damage to Life Cards", "Unblocked Familiar attacks"],
        relatedRules: ["KR-300.1", "KR-400.1"],
        category: "core",
      },
      {
        id: "KR-200.1",
        title: "Deck Construction",
        text: "Each deck contains exactly 40 cards plus 1 Flag. Limits: 25 Common (🜠), 13 Uncommon (☽), 2 Rare (☉), 1 copy max per card.",
        keywords: ["deck construction", "flag", "rarity limits"],
        elements: [],
        examples: ["40-card deck", "25 Common cards", "1 Flag"],
        relatedRules: ["KR-200.2"],
        category: "deck_construction",
      },
      {
        id: "KR-300.1",
        title: "Life Cards Setup",
        text: "Place the top 4 cards of your deck face down as Life Cards. These remain hidden until revealed as damage.",
        keywords: ["life cards", "setup", "damage", "hidden"],
        elements: [],
        examples: ["4 Life Cards per player", "Face down until damage"],
        relatedRules: ["KR-600.1", "KR-101.1"],
        category: "core",
      },
      {
        id: "KR-400.1",
        title: "Game Phases",
        text: "Each turn has 5 phases: Start Phase, Main Phase, Combat Phase, Post-Combat Main Phase, Refresh Phase.",
        keywords: [
          "phases",
          "turn structure",
          "start",
          "main",
          "combat",
          "refresh",
        ],
        elements: [],
        examples: [
          "Draw 2 cards first turn",
          "Play cards in Main",
          "Attack in Combat",
        ],
        relatedRules: ["KR-400.2", "KR-400.3"],
        category: "phases",
      },
      {
        id: "KR-500.1",
        title: "Elements System",
        text: "Six elements plus Generic: Fire (🜂), Water (🜄), Earth (🜃), Air (🜁), Aether (⭘), Nether (▢), Generic (✡⃝).",
        keywords: [
          "elements",
          "fire",
          "water",
          "earth",
          "air",
          "aether",
          "nether",
          "generic",
        ],
        elements: ["🜂", "🜄", "🜃", "🜁", "⭘", "▢", "✡⃝"],
        examples: ["Fire Azoth costs", "Elemental immunities"],
        relatedRules: ["KR-700.1", "KR-600.1"],
        category: "core",
      },
      {
        id: "KR-600.1",
        title: "Card Play Modes",
        text: "Cards can be played as: Summon (Familiar), Spell (resolve then bottom deck), Azoth (resource), Tribute (sacrifice), Burst (free from Life Cards).",
        keywords: [
          "play modes",
          "summon",
          "spell",
          "azoth",
          "tribute",
          "burst",
        ],
        elements: [],
        examples: ["Summon with +1 counters", "Spell to bottom deck"],
        relatedRules: ["KR-600.2", "KR-700.1"],
        category: "core",
      },
      {
        id: "KR-700.1",
        title: "Amalgam Keyword",
        text: "Choose one of two options when played. As Summon: choose keyword and element. As Azoth: choose element type.",
        keywords: ["amalgam", "choice", "keyword", "element"],
        elements: [],
        examples: ["Gust or Brilliance choice", "Element choice for Azoth"],
        relatedRules: ["KR-700.2", "KR-700.3"],
        category: "keywords",
      },
      {
        id: "KR-700.2",
        title: "Brilliance Keyword",
        text: "Place target with Strength ≤ ⭘ paid on bottom of owner's life cards. Does not affect ▢ cards.",
        keywords: ["brilliance", "target", "life cards", "aether"],
        elements: ["⭘", "▢"],
        examples: ["Target weak Familiars", "Nether immunity"],
        relatedRules: ["KR-700.3", "KR-500.1"],
        category: "keywords",
      },
      {
        id: "KR-700.3",
        title: "Gust Keyword",
        text: "Return target with Strength ≤ 🜁 paid to owner's hand. Does not affect 🜃 cards.",
        keywords: ["gust", "bounce", "hand", "air"],
        elements: ["🜁", "🜃"],
        examples: ["Return to hand", "Earth immunity"],
        relatedRules: ["KR-700.4", "KR-500.1"],
        category: "keywords",
      },
      {
        id: "KR-700.5",
        title: "Steadfast Keyword",
        text: "Redirect damage ≤ 🜃 used to pay for this card's Strength, that would be done to you or cards you control, to this card. Does not affect 🜂 cards.",
        keywords: ["steadfast", "redirect", "protection", "earth"],
        elements: ["🜃", "🜂"],
        examples: ["Damage redirection", "Fire immunity"],
        relatedRules: ["KR-700.6", "KR-500.1"],
        category: "keywords",
      },
      {
        id: "KR-700.6",
        title: "Submerged Keyword",
        text: "Place target Familiar with +1 Counters or Spell with Strength ≤ 🜄 used to pay for this card's Strength, that many cards below the top of its owner's deck. Does not affect 🜁 cards.",
        keywords: ["submerged", "bury", "deck", "water"],
        elements: ["🜄", "🜁"],
        examples: ["Bury in deck", "Air immunity"],
        relatedRules: ["KR-700.7", "KR-500.1"],
        category: "keywords",
      },
      {
        id: "KR-700.7",
        title: "Quintessence Keyword",
        text: "This card can't be played as a Familiar. While in the Azoth row, it produces any Azoth type.",
        keywords: ["quintessence", "azoth", "universal", "resource"],
        elements: [],
        examples: ["Azoth-only cards", "Universal resource"],
        relatedRules: ["KR-700.8", "KR-600.1"],
        category: "keywords",
      },
      {
        id: "KR-700.8",
        title: "Void Keyword",
        text: "Remove target card from the game. Does not affect ⭘ cards. Removed cards go to Removed from Play zone.",
        keywords: ["void", "remove", "exile", "permanent"],
        elements: ["⭘"],
        examples: ["Permanent removal", "Aether immunity"],
        relatedRules: ["KR-800.1", "KR-500.1"],
        category: "keywords",
      },
      {
        id: "KR-800.1",
        title: "Game Zones",
        text: "Seven zones: Field, Combat Row, Azoth Row, Life Cards, Flag, Deck, Removed from Play.",
        keywords: [
          "zones",
          "field",
          "combat row",
          "azoth row",
          "removed from play",
        ],
        elements: [],
        examples: ["Field for Familiars", "Azoth Row for resources"],
        relatedRules: ["KR-800.2", "KR-700.8"],
        category: "zones",
      },
    ];

    for (const rule of rules) {
      this.rulesIndex.set(rule.id, rule);
    }
  }

  private buildSearchIndex(): void {
    // Build keyword index
    for (const [ruleId, rule] of this.rulesIndex) {
      for (const keyword of rule.keywords) {
        const key = keyword.toLowerCase();
        if (!this.keywordIndex.has(key)) {
          this.keywordIndex.set(key, []);
        }
        this.keywordIndex.get(key)!.push(ruleId);
      }
    }

    // Build element index
    for (const [ruleId, rule] of this.rulesIndex) {
      for (const element of rule.elements) {
        const key = element.toLowerCase();
        if (!this.elementIndex.has(key)) {
          this.elementIndex.set(key, []);
        }
        this.elementIndex.get(key)!.push(ruleId);
      }
    }
  }

  private parseQuery(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 2)
      .map((term) => term.replace(/[^\w]/g, ""));
  }

  private calculateRelevance(rule: KonivrRule, searchTerms: string[]): number {
    let score = 0;

    for (const term of searchTerms) {
      // Title matches (highest weight)
      if (rule.title.toLowerCase().includes(term)) {
        score += 10;
      }

      // Keyword matches (high weight)
      if (rule.keywords.some((k) => k.toLowerCase().includes(term))) {
        score += 8;
      }

      // Text content matches (medium weight)
      if (rule.text.toLowerCase().includes(term)) {
        score += 5;
      }

      // Example matches (lower weight)
      if (rule.examples.some((e) => e.toLowerCase().includes(term))) {
        score += 3;
      }

      // Element matches (special case)
      if (
        rule.elements.some(
          (e) => e.includes(term) || e.toLowerCase().includes(term)
        )
      ) {
        score += 7;
      }
    }

    return score;
  }

  private getMatchingTerms(rule: KonivrRule, searchTerms: string[]): string[] {
    const matches: string[] = [];
    const searchableText = [
      rule.title,
      rule.text,
      ...rule.keywords,
      ...rule.examples,
      ...rule.elements,
    ]
      .join(" ")
      .toLowerCase();

    for (const term of searchTerms) {
      if (searchableText.includes(term)) {
        matches.push(term);
      }
    }

    return matches;
  }

  private passesFilters(rule: KonivrRule, filters: SearchFilters): boolean {
    if (filters.category && !filters.category.includes(rule.category)) {
      return false;
    }

    if (filters.keywords) {
      const hasMatchingKeyword = filters.keywords.some((k) =>
        rule.keywords.some((rk) => rk.toLowerCase().includes(k.toLowerCase()))
      );
      if (!hasMatchingKeyword) return false;
    }

    if (filters.elements) {
      const hasMatchingElement = filters.elements.some((e) =>
        rule.elements.some((re) => re.includes(e))
      );
      if (!hasMatchingElement) return false;
    }

    return true;
  }

  private findRuleInteractions(rule: KonivrRule): string[] {
    const interactions: string[] = [];

    // Find keyword interactions
    if (rule.keywords.includes("brilliance")) {
      interactions.push(
        "Interacts with Aether (⭘) costs and Life Cards placement"
      );
    }
    if (rule.keywords.includes("gust")) {
      interactions.push(
        "Interacts with Air (🜁) costs and returns cards to hand"
      );
    }
    if (rule.keywords.includes("amalgam")) {
      interactions.push("Allows choice between two keywords or elements");
    }

    // Find elemental interactions
    if (rule.elements.includes("🜂")) {
      interactions.push("Fire immunity: Does not affect Water (🜄) cards");
    }
    if (rule.elements.includes("🜁")) {
      interactions.push("Air immunity: Does not affect Earth (🜃) cards");
    }

    return interactions;
  }
}
