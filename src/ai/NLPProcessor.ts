import { pipeline, Pipeline } from '@xenova/transformers';

export interface SearchQuery {
  text: string;
  filters?: {
    cost?: number;
    type?: string;
    rarity?: string;
  };
}

export interface SearchResult {
  cardId: string;
  relevanceScore: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  toxicity: number;
  timestamp: Date;
}

export class NLPProcessor {
  private sentimentPipeline: Pipeline | null = null;
  private embeddingPipeline: Pipeline | null = null;
  private questionAnsweringPipeline: Pipeline | null = null;
  private textGenerationPipeline: Pipeline | null = null;
  private toxicityDetectionPipeline: Pipeline | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing upgraded NLP processor with latest models...');
      
      // Initialize advanced sentiment analysis pipeline (upgraded model)
      this.sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'Xenova/cardiffnlp-twitter-roberta-base-sentiment-latest',
      );

      // Initialize advanced text embedding pipeline (upgraded model)
      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-mpnet-base-v2',
      );

      // Initialize question-answering for rule explanations
      this.questionAnsweringPipeline = await pipeline(
        'question-answering',
        'Xenova/distilbert-base-uncased-distilled-squad',
      );

      // Initialize text generation for creative content
      this.textGenerationPipeline = await pipeline(
        'text-generation',
        'Xenova/gpt2',
      );

      // Initialize toxicity detection for enhanced moderation
      this.toxicityDetectionPipeline = await pipeline(
        'text-classification',
        'Xenova/toxic-bert',
      );

      this.isInitialized = true;
      console.log('✅ Upgraded NLP processor initialized with advanced capabilities');
      console.log('🎯 New features: Enhanced sentiment analysis, advanced embeddings, Q&A, text generation, toxicity detection');
    } catch (_error) {
      console.error('Failed to initialize upgraded NLPProcessor:', _error);
      // Fallback to basic models if advanced ones fail
      await this.initializeFallbackModels();
    }
  }

  private async initializeFallbackModels(): Promise<void> {
    try {
      console.log('⚠️ Initializing fallback models...');
      
      this.sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      );

      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
      );

      this.isInitialized = true;
      console.log('✅ Fallback NLP models initialized successfully');
    } catch (_error) {
      console.error('❌ Failed to initialize fallback models:', _error);
    }
  }

  async searchCards(
    query: SearchQuery,
    cardDatabase: any[],
  ): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Generate embedding for the search query
      const queryEmbedding = await this.embeddingPipeline!(query.text);

      const results: SearchResult[] = [];

      for (const card of cardDatabase) {
        // Generate embedding for card text (name + description)
        const cardText = `${card.name} ${card.description || ''}`;
        const cardEmbedding = await this.embeddingPipeline!(cardText);

        // Calculate cosine similarity
        const similarity = this.cosineSimilarity(
          queryEmbedding.data,
          cardEmbedding.data,
        );

        // Apply filters
        let passesFilters = true;
        if (query.filters) {
          if (query.filters.cost && card.cost !== query.filters.cost) {
            passesFilters = false;
          }
          if (query.filters.type && card.type !== query.filters.type) {
            passesFilters = false;
          }
          if (query.filters.rarity && card.rarity !== query.filters.rarity) {
            passesFilters = false;
          }
        }

        if (passesFilters && similarity > 0.3) {
          results.push({
            cardId: card.id,
            relevanceScore: similarity,
            explanation: this.generateExplanation(query.text, card, similarity),
          });
        }
      }

      // Sort by relevance score
      return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (_error) {
      console.error('Card search failed:', _error);
      return [];
    }
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const result = await this.sentimentPipeline!(text);
      const prediction = Array.isArray(result) ? result[0] : result;

      return {
        sentiment: prediction.label.toLowerCase() as 'positive' | 'negative',
        confidence: prediction.score,
      };
    } catch (_error) {
      console.error('Sentiment analysis failed:', _error);
      return { sentiment: 'neutral', confidence: 0.5 };
    }
  }

  async moderateChat(message: string): Promise<{
    isAppropriate: boolean;
    toxicity: number;
    reasons: string[];
    advancedAnalysis?: {
      toxicityScore: number;
      categories: string[];
      confidence: number;
    };
  }> {
    const sentiment = await this.analyzeSentiment(message);
    
    // Advanced toxicity detection using ML model
    let advancedAnalysis;
    if (this.toxicityDetectionPipeline) {
      try {
        const toxicityResult = await this.toxicityDetectionPipeline(message);
        const result = Array.isArray(toxicityResult) ? toxicityResult[0] : toxicityResult;
        
        advancedAnalysis = {
          toxicityScore: result.label === 'TOXIC' ? result.score : 1 - result.score,
          categories: [result.label],
          confidence: result.score,
        };
      } catch (_error) {
        console.error('Advanced toxicity detection failed:', _error);
      }
    }

    // Enhanced toxicity detection with more sophisticated patterns
    const toxicKeywords = [
      'hate', 'stupid', 'idiot', 'noob', 'trash', 'garbage',
      'kill yourself', 'die', 'cancer', 'toxic', 'loser',
      'pathetic', 'worthless', 'waste', 'disgusting', 'horrible'
    ];

    let toxicity = 0;
    const reasons: string[] = [];

    // Check for toxic keywords with severity weighting
    const lowerMessage = message.toLowerCase();
    toxicKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        const severity = this.getKeywordSeverity(keyword);
        toxicity += severity;
        reasons.push(`Contains inappropriate language: "${keyword}" (severity: ${severity})`);
      }
    });

    // Factor in sentiment with improved weighting
    if (sentiment.sentiment === 'negative' && sentiment.confidence > 0.8) {
      toxicity += 0.15;
      reasons.push('Highly negative sentiment detected');
    }

    // Enhanced caps detection
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capsRatio > 0.7 && message.length > 10) {
      toxicity += 0.08;
      reasons.push('Excessive use of capital letters');
    }

    // Check for repeated characters (spam-like behavior)
    const repeatedChars = message.match(/(.)\1{3,}/g);
    if (repeatedChars && repeatedChars.length > 0) {
      toxicity += 0.05;
      reasons.push('Excessive character repetition detected');
    }

    // Factor in advanced ML analysis if available
    if (advancedAnalysis && advancedAnalysis.toxicityScore > 0.6) {
      toxicity += advancedAnalysis.toxicityScore * 0.4;
      reasons.push(`ML toxicity detection: ${(advancedAnalysis.toxicityScore * 100).toFixed(1)}% confidence`);
    }

    return {
      isAppropriate: toxicity < 0.4, // Lowered threshold for better moderation
      toxicity: Math.min(toxicity, 1),
      reasons,
      advancedAnalysis,
    };
  }

  private getKeywordSeverity(keyword: string): number {
    const severityMap: Record<string, number> = {
      'kill yourself': 0.9,
      'die': 0.8,
      'cancer': 0.7,
      'hate': 0.6,
      'disgusting': 0.5,
      'horrible': 0.5,
      'pathetic': 0.4,
      'worthless': 0.4,
      'stupid': 0.3,
      'idiot': 0.3,
      'trash': 0.3,
      'garbage': 0.3,
      'noob': 0.2,
      'loser': 0.3,
      'toxic': 0.4,
      'waste': 0.3,
    };
    
    return severityMap[keyword] || 0.25;
  }

  async generateSmartDeckName(cards: any[]): Promise<string> {
    if (!cards.length) return 'Empty Deck';

    try {
      // Advanced deck analysis with AI-generated names
      const deckAnalysis = this.analyzeDeckComposition(cards);
      
      if (this.textGenerationPipeline) {
        // Use AI to generate creative deck names
        const prompt = `Generate a creative deck name for a card game deck with these characteristics: ${deckAnalysis.dominantType} type, ${deckAnalysis.dominantTheme} theme, ${deckAnalysis.strategy} strategy. Name:`;
        
        try {
          const generated = await this.textGenerationPipeline(prompt, {
            max_length: 50,
            num_return_sequences: 1,
            temperature: 0.8,
          });
          
          if (Array.isArray(generated) && generated[0]?.generated_text) {
            const generatedName = generated[0].generated_text
              .replace(prompt, '')
              .trim()
              .split('\n')[0]
              .substring(0, 50);
            
            if (generatedName.length > 3) {
              return this.cleanGeneratedName(generatedName);
            }
          }
        } catch (_error) {
          console.error('AI deck name generation failed:', _error);
        }
      }
      
      // Fallback to enhanced algorithmic generation
      return this.generateAlgorithmicDeckName(deckAnalysis);
    } catch (_error) {
      console.error('Deck name generation failed:', _error);
      return this.generateDeckName(cards); // Fallback to original method
    }
  }

  private analyzeDeckComposition(cards: any[]): {
    dominantType: string;
    dominantTheme: string;
    strategy: string;
    powerLevel: string;
    synergies: string[];
  } {
    const themes = new Map<string, number>();
    const types = new Map<string, number>();
    const costs = new Map<number, number>();
    let totalPower = 0;

    cards.forEach(card => {
      // Count card types
      types.set(card.type, (types.get(card.type) || 0) + 1);
      
      // Count costs for curve analysis
      if (card.cost !== undefined) {
        costs.set(card.cost, (costs.get(card.cost) || 0) + 1);
      }
      
      // Sum power for power level analysis
      if (card.attack !== undefined) totalPower += card.attack;
      if (card.defense !== undefined) totalPower += card.defense;

      // Extract themes from card names and abilities
      const words = `${card.name} ${card.abilities?.join(' ') || ''} ${card.description || ''}`
        .toLowerCase()
        .split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) {
          themes.set(word, (themes.get(word) || 0) + 1);
        }
      });
    });

    const dominantType = Array.from(types.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';
    const dominantTheme = Array.from(themes.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Strategy';
    
    // Determine strategy based on cost curve
    const avgCost = Array.from(costs.entries()).reduce((sum, [cost, count]) => sum + cost * count, 0) / cards.length;
    let strategy = 'Balanced';
    if (avgCost <= 2) strategy = 'Aggro';
    else if (avgCost >= 5) strategy = 'Control';
    else if (avgCost >= 3.5) strategy = 'Midrange';

    const avgPower = totalPower / cards.length;
    const powerLevel = avgPower > 6 ? 'High Power' : avgPower > 3 ? 'Medium Power' : 'Low Power';

    return {
      dominantType: this.capitalize(dominantType),
      dominantTheme: this.capitalize(dominantTheme),
      strategy,
      powerLevel,
      synergies: Array.from(themes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([theme]) => this.capitalize(theme)),
    };
  }

  private generateAlgorithmicDeckName(analysis: any): string {
    const creativeTemplates = [
      `${analysis.dominantTheme} ${analysis.dominantType} ${analysis.strategy}`,
      `The ${analysis.dominantTheme} ${analysis.strategy}`,
      `${analysis.powerLevel} ${analysis.dominantType}s`,
      `${analysis.dominantTheme} Storm`,
      `Elite ${analysis.dominantType} Force`,
      `${analysis.strategy} ${analysis.dominantTheme} Battalion`,
      `The ${analysis.dominantTheme} Vanguard`,
      `${analysis.dominantType} ${analysis.dominantTheme} Alliance`,
      `Legendary ${analysis.dominantTheme} Deck`,
      `${analysis.powerLevel} ${analysis.dominantTheme} Guild`,
    ];

    return creativeTemplates[Math.floor(Math.random() * creativeTemplates.length)];
  }

  private cleanGeneratedName(name: string): string {
    return name
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
      .split(' ')
      .slice(0, 4) // Limit to 4 words
      .map(word => this.capitalize(word))
      .join(' ');
  }

  async explainRuleAdvanced(ruleText: string, context?: any): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Use question-answering model for intelligent rule explanations
      if (this.questionAnsweringPipeline && context?.rulebook) {
        try {
          const question = `What does "${ruleText}" mean?`;
          const qaResult = await this.questionAnsweringPipeline({
            question,
            context: context.rulebook,
          });
          
          if (qaResult.answer && qaResult.score > 0.5) {
            return `ADVANCED: ${qaResult.answer} (Confidence: ${(qaResult.score * 100).toFixed(1)}%)`;
          }
        } catch (_error) {
          console.error('Q&A rule explanation failed:', _error);
        }
      }

      // Enhanced rule explanations with more comprehensive coverage
      const advancedExplanations = new Map([
        ['flying', 'This creature can only be blocked by creatures with flying or reach. It soars above ground-based defenses.'],
        ['trample', 'Excess combat damage is dealt to the defending player. If blocked, leftover damage carries through.'],
        ['haste', 'This creature can attack immediately without summoning sickness. It charges into battle right away.'],
        ['vigilance', 'This creature does not tap when attacking. It remains alert for defense while on offense.'],
        ['lifelink', 'Damage dealt by this creature also heals you for that amount. Combat becomes sustaining.'],
        ['deathtouch', 'Any damage dealt by this creature destroys the target. Even 1 damage is lethal.'],
        ['first strike', 'This creature deals combat damage before creatures without first strike. It strikes first in combat.'],
        ['double strike', 'This creature deals first strike and regular combat damage. It gets two chances to hit.'],
        ['hexproof', 'This creature cannot be targeted by spells or abilities opponents control. It has magical protection.'],
        ['indestructible', 'This creature cannot be destroyed by damage or effects that say "destroy." It persists through destruction.'],
        ['menace', 'This creature can only be blocked by two or more creatures. It threatens multiple defenders.'],
        ['reach', 'This creature can block flying creatures. It can reach high targets.'],
        ['defender', 'This creature cannot attack. It is purely defensive.'],
        ['flash', 'You can cast this spell at instant speed. It can be played at unexpected times.'],
        ['ward', 'Opponents must pay an additional cost to target this with spells or abilities. It has protective magic.'],
      ]);

      const lowerRule = ruleText.toLowerCase();

      for (const [keyword, explanation] of advancedExplanations) {
        if (lowerRule.includes(keyword)) {
          return `${keyword.toUpperCase()}: ${explanation}`;
        }
      }

      // Fallback with context-aware explanation
      return `Rule explanation for "${ruleText}" is not available in the current database. This may be a custom or advanced rule. ${context?.suggestion || 'Please consult the official rulebook or game guide.'}`;
    } catch (_error) {
      console.error('Advanced rule explanation failed:', _error);
      return this.explainRule(ruleText); // Fallback to original method
    }
  }

  async generateDeckName(cards: any[]): Promise<string> {
    // Legacy method - redirects to smart generation
    return this.generateSmartDeckName(cards);
  }

  async explainRule(ruleText: string): Promise<string> {
    // Legacy method - redirects to advanced explanation
    return this.explainRuleAdvanced(ruleText);
  }

  // New advanced capabilities

  async semanticSimilarity(text1: string, text2: string): Promise<number> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (!this.embeddingPipeline) return 0;

      const embedding1 = await this.embeddingPipeline(text1);
      const embedding2 = await this.embeddingPipeline(text2);

      return this.cosineSimilarity(embedding1.data, embedding2.data);
    } catch (_error) {
      console.error('Semantic similarity calculation failed:', _error);
      return 0;
    }
  }

  async generateCardSuggestions(userInput: string, availableCards: any[]): Promise<{
    cards: any[];
    reasoning: string;
    confidence: number;
  }> {
    if (!availableCards.length) {
      return { cards: [], reasoning: 'No cards available', confidence: 0 };
    }

    try {
      const suggestions = [];
      const inputEmbedding = await this.embeddingPipeline!(userInput);

      for (const card of availableCards) {
        const cardText = `${card.name} ${card.description || ''} ${card.type || ''} ${card.abilities?.join(' ') || ''}`;
        const cardEmbedding = await this.embeddingPipeline!(cardText);
        const similarity = this.cosineSimilarity(inputEmbedding.data, cardEmbedding.data);

        if (similarity > 0.4) {
          suggestions.push({
            card,
            similarity,
            reasoning: this.generateSuggestionReasoning(userInput, card, similarity),
          });
        }
      }

      suggestions.sort((a, b) => b.similarity - a.similarity);
      const topSuggestions = suggestions.slice(0, 5);

      const avgConfidence = topSuggestions.length > 0 
        ? topSuggestions.reduce((sum, s) => sum + s.similarity, 0) / topSuggestions.length
        : 0;

      return {
        cards: topSuggestions.map(s => s.card),
        reasoning: topSuggestions.length > 0 
          ? `Found ${topSuggestions.length} relevant cards based on semantic analysis`
          : 'No strongly matching cards found',
        confidence: avgConfidence,
      };
    } catch (_error) {
      console.error('Card suggestions generation failed:', _error);
      return { cards: [], reasoning: 'Error generating suggestions', confidence: 0 };
    }
  }

  private generateSuggestionReasoning(input: string, card: any, similarity: number): string {
    const reasons = [];
    
    if (card.name.toLowerCase().includes(input.toLowerCase())) {
      reasons.push('name match');
    }
    
    if (card.description?.toLowerCase().includes(input.toLowerCase())) {
      reasons.push('description match');
    }
    
    if (similarity > 0.8) {
      reasons.push('high semantic similarity');
    } else if (similarity > 0.6) {
      reasons.push('good semantic similarity');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'semantic analysis match';
  }

  async analyzeGameplayContext(gameState: any): Promise<{
    phase: string;
    recommendations: string[];
    threats: string[];
    opportunities: string[];
    confidence: number;
  }> {
    try {
      const analysis = {
        phase: this.identifyGamePhase(gameState),
        recommendations: [],
        threats: [],
        opportunities: [],
        confidence: 0.8,
      };

      // Analyze current game state
      if (gameState.playerHealth < 10) {
        analysis.threats.push('Low health - defensive play recommended');
      }

      if (gameState.opponentHealth < 10) {
        analysis.opportunities.push('Opponent low on health - consider aggressive plays');
      }

      if (gameState.handSize > 6) {
        analysis.recommendations.push('Large hand - consider card advantage strategies');
      }

      if (gameState.mana >= 5) {
        analysis.recommendations.push('High mana available - powerful plays possible');
      }

      return analysis;
    } catch (_error) {
      console.error('Gameplay context analysis failed:', _error);
      return {
        phase: 'unknown',
        recommendations: [],
        threats: [],
        opportunities: [],
        confidence: 0,
      };
    }
  }

  private identifyGamePhase(gameState: any): string {
    if (gameState.turn <= 3) return 'early-game';
    if (gameState.turn <= 7) return 'mid-game';
    return 'late-game';
  }

  async getCachedPipelineStatus(): Promise<{
    sentiment: boolean;
    embedding: boolean;
    questionAnswering: boolean;
    textGeneration: boolean;
    toxicityDetection: boolean;
    totalCapabilities: number;
  }> {
    return {
      sentiment: this.sentimentPipeline !== null,
      embedding: this.embeddingPipeline !== null,
      questionAnswering: this.questionAnsweringPipeline !== null,
      textGeneration: this.textGenerationPipeline !== null,
      toxicityDetection: this.toxicityDetectionPipeline !== null,
      totalCapabilities: [
        this.sentimentPipeline,
        this.embeddingPipeline,
        this.questionAnsweringPipeline,
        this.textGenerationPipeline,
        this.toxicityDetectionPipeline,
      ].filter(pipeline => pipeline !== null).length,
    };
  }

  private cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private generateExplanation(
    query: string,
    card: any,
    similarity: number,
  ): string {
    const reasons = [];

    if (card.name.toLowerCase().includes(query.toLowerCase())) {
      reasons.push('name match');
    }

    if (card.description?.toLowerCase().includes(query.toLowerCase())) {
      reasons.push('description match');
    }

    if (similarity > 0.8) {
      reasons.push('high semantic similarity');
    } else if (similarity > 0.6) {
      reasons.push('moderate semantic similarity');
    }

    return reasons.length > 0
      ? `Matched due to: ${reasons.join(', ')}`
      : 'Semantic similarity match';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  dispose(): void {
    console.log('🧹 Disposing NLP processor and cleaning up pipelines...');
    this.sentimentPipeline = null;
    this.embeddingPipeline = null;
    this.questionAnsweringPipeline = null;
    this.textGenerationPipeline = null;
    this.toxicityDetectionPipeline = null;
    this.isInitialized = false;
    console.log('✅ NLP processor disposed successfully');
  }
}

// Singleton instance
export const nlpProcessor = new NLPProcessor();
