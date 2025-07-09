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
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize sentiment analysis pipeline
      this.sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );

      // Initialize text embedding pipeline
      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );

      this.isInitialized = true;
      console.log('NLPProcessor initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NLPProcessor:', error);
    }
  }

  async searchCards(query: SearchQuery, cardDatabase: any[]): Promise<SearchResult[]> {
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
          cardEmbedding.data
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
            explanation: this.generateExplanation(query.text, card, similarity)
          });
        }
      }
      
      // Sort by relevance score
      return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error('Card search failed:', error);
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
        confidence: prediction.score
      };
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return { sentiment: 'neutral', confidence: 0.5 };
    }
  }

  async moderateChat(message: string): Promise<{
    isAppropriate: boolean;
    toxicity: number;
    reasons: string[];
  }> {
    const sentiment = await this.analyzeSentiment(message);
    
    // Simple toxicity detection based on keywords and sentiment
    const toxicKeywords = [
      'hate', 'stupid', 'idiot', 'noob', 'trash', 'garbage',
      'kill yourself', 'die', 'cancer', 'toxic'
    ];
    
    let toxicity = 0;
    const reasons: string[] = [];
    
    // Check for toxic keywords
    const lowerMessage = message.toLowerCase();
    toxicKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        toxicity += 0.3;
        reasons.push(`Contains inappropriate language: "${keyword}"`);
      }
    });
    
    // Factor in sentiment
    if (sentiment.sentiment === 'negative' && sentiment.confidence > 0.8) {
      toxicity += 0.2;
      reasons.push('Highly negative sentiment detected');
    }
    
    // Check for excessive caps (shouting)
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capsRatio > 0.7 && message.length > 10) {
      toxicity += 0.1;
      reasons.push('Excessive use of capital letters');
    }
    
    return {
      isAppropriate: toxicity < 0.5,
      toxicity: Math.min(toxicity, 1),
      reasons
    };
  }

  async generateDeckName(cards: any[]): Promise<string> {
    if (!cards.length) return 'Empty Deck';
    
    // Analyze card themes and types
    const themes = new Map<string, number>();
    const types = new Map<string, number>();
    
    cards.forEach(card => {
      // Count card types
      types.set(card.type, (types.get(card.type) || 0) + 1);
      
      // Extract themes from card names and abilities
      const words = `${card.name} ${card.abilities?.join(' ') || ''}`.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) {
          themes.set(word, (themes.get(word) || 0) + 1);
        }
      });
    });
    
    // Find dominant type
    const dominantType = Array.from(types.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';
    
    // Find dominant theme
    const dominantTheme = Array.from(themes.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Strategy';
    
    // Generate creative names based on patterns
    const namePatterns = [
      `${this.capitalize(dominantTheme)} ${this.capitalize(dominantType)}s`,
      `${this.capitalize(dominantType)} ${this.capitalize(dominantTheme)}`,
      `The ${this.capitalize(dominantTheme)} Legion`,
      `${this.capitalize(dominantTheme)} Storm`,
      `Elite ${this.capitalize(dominantType)} Force`
    ];
    
    return namePatterns[Math.floor(Math.random() * namePatterns.length)];
  }

  async explainRule(ruleText: string): Promise<string> {
    // Simple rule explanation system
    const explanations = new Map([
      ['flying', 'This creature can only be blocked by creatures with flying or reach.'],
      ['trample', 'Excess combat damage is dealt to the defending player.'],
      ['haste', 'This creature can attack immediately without summoning sickness.'],
      ['vigilance', 'This creature does not tap when attacking.'],
      ['lifelink', 'Damage dealt by this creature also heals you for that amount.'],
      ['deathtouch', 'Any damage dealt by this creature destroys the target.'],
      ['first strike', 'This creature deals combat damage before creatures without first strike.'],
      ['double strike', 'This creature deals first strike and regular combat damage.']
    ]);
    
    const lowerRule = ruleText.toLowerCase();
    
    for (const [keyword, explanation] of explanations) {
      if (lowerRule.includes(keyword)) {
        return `${keyword.toUpperCase()}: ${explanation}`;
      }
    }
    
    return `Rule explanation for "${ruleText}" is not available. Please consult the official rulebook.`;
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

  private generateExplanation(query: string, card: any, similarity: number): string {
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
    this.sentimentPipeline = null;
    this.embeddingPipeline = null;
    this.isInitialized = false;
  }
}

// Singleton instance
export const nlpProcessor = new NLPProcessor();