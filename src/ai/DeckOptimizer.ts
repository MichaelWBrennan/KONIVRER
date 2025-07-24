import * as tf from '@tensorflow/tfjs';

export interface Card {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  health?: number;
  type: string;
  rarity: string;
  abilities: string[];
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  winRate?: number;
  synergy?: number;
}

export interface OptimizationResult {
  optimizedDeck: Deck;
  suggestions: string[];
  synergyScore: number;
  predictedWinRate: number;
}

export class DeckOptimizer {
  private model: tf.LayersModel | null = null;
  private cardEmbeddings: Map<string, number[]> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create a neural network for deck optimization
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [100], units: 256, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 128, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 64, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      this.isInitialized = true;
      console.log('DeckOptimizer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DeckOptimizer:', error);
    }
  }

  private generateCardEmbedding(card: Card): number[] {
    // Generate a feature vector for the card
    const embedding = new Array(100).fill(0);
    
    // Basic features
    embedding[0] = card.cost / 10; // Normalized cost
    embedding[1] = (card.attack || 0) / 10; // Normalized attack
    embedding[2] = (card.health || 0) / 10; // Normalized health
    
    // Type encoding (one-hot)
    const types = ['creature', 'spell', 'artifact', 'enchantment'];
    const typeIndex = types.indexOf(card.type.toLowerCase());
    if (typeIndex >= 0) embedding[3 + typeIndex] = 1;
    
    // Rarity encoding
    const rarities = ['common', 'uncommon', 'rare', 'legendary'];
    const rarityIndex = rarities.indexOf(card.rarity.toLowerCase());
    if (rarityIndex >= 0) embedding[7 + rarityIndex] = 1;
    
    // Abilities encoding
    card.abilities.forEach((ability, index) => {
      if (index < 20) embedding[11 + index] = 1;
    });
    
    // Fill remaining with random features for demonstration
    for (let i = 31; i < 100; i++) {
      embedding[i] = Math.random() * 0.1;
    }
    
    return embedding;
  }

  private calculateSynergy(deck: Deck): number {
    let synergyScore = 0;
    const cards = deck.cards;
    
    // Calculate synergy based on card interactions
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const card1 = cards[i];
        const card2 = cards[j];
        
        // Cost curve synergy
        if (Math.abs(card1.cost - card2.cost) === 1) {
          synergyScore += 0.1;
        }
        
        // Type synergy
        if (card1.type === card2.type) {
          synergyScore += 0.2;
        }
        
        // Ability synergy
        const commonAbilities = card1.abilities.filter(a => 
          card2.abilities.includes(a)
        );
        synergyScore += commonAbilities.length * 0.3;
      }
    }
    
    return Math.min(synergyScore / (cards.length * cards.length), 1);
  }

  async optimizeDeck(deck: Deck, availableCards: Card[]): Promise<OptimizationResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Generate embeddings for all cards
      const deckEmbedding = this.generateDeckEmbedding(deck);
      
      // Predict win rate using the neural network
      const prediction = this.model!.predict(tf.tensor2d([deckEmbedding])) as tf.Tensor;
      const predictedWinRate = await prediction.data();
      
      // Calculate current synergy
      const currentSynergy = this.calculateSynergy(deck);
      
      // Generate optimization suggestions
      const suggestions = this.generateSuggestions(deck, availableCards);
      
      // Create optimized deck
      const optimizedDeck = this.applyOptimizations(deck, availableCards);
      
      prediction.dispose();
      
      return {
        optimizedDeck,
        suggestions,
        synergyScore: currentSynergy,
        predictedWinRate: predictedWinRate[0]
      };
    } catch (error) {
      console.error('Deck optimization failed:', error);
      return {
        optimizedDeck: deck,
        suggestions: ['Optimization failed. Please try again.'],
        synergyScore: 0,
        predictedWinRate: 0.5
      };
    }
  }

  private generateDeckEmbedding(deck: Deck): number[] {
    const embedding = new Array(100).fill(0);
    
    // Aggregate card embeddings
    deck.cards.forEach(card => {
      const cardEmb = this.generateCardEmbedding(card);
      cardEmb.forEach((value, index) => {
        embedding[index] += value;
      });
    });
    
    // Normalize by deck size
    const deckSize = deck.cards.length;
    return embedding.map(value => value / deckSize);
  }

  private generateSuggestions(deck: Deck, availableCards: Card[]): string[] {
    const suggestions: string[] = [];
    
    // Analyze cost curve
    const costCounts = new Map<number, number>();
    deck.cards.forEach(card => {
      costCounts.set(card.cost, (costCounts.get(card.cost) || 0) + 1);
    });
    
    // Check for cost curve issues
    if (!costCounts.has(1) && !costCounts.has(2)) {
      suggestions.push('Consider adding more low-cost cards for early game presence');
    }
    
    if ((costCounts.get(7) || 0) + (costCounts.get(8) || 0) + (costCounts.get(9) || 0) > 3) {
      suggestions.push('Too many high-cost cards may slow down your deck');
    }
    
    // Analyze card types
    const typeCounts = new Map<string, number>();
    deck.cards.forEach(card => {
      typeCounts.set(card.type, (typeCounts.get(card.type) || 0) + 1);
    });
    
    if ((typeCounts.get('creature') || 0) < deck.cards.length * 0.4) {
      suggestions.push('Consider adding more creatures for board presence');
    }
    
    // Synergy suggestions
    const synergy = this.calculateSynergy(deck);
    if (synergy < 0.3) {
      suggestions.push('Look for cards with better synergy with your existing cards');
    }
    
    return suggestions;
  }

  private applyOptimizations(deck: Deck, availableCards: Card[]): Deck {
    // Create a copy of the deck
    const optimizedCards = [...deck.cards];
    
    // Simple optimization: replace low-synergy cards
    const synergy = this.calculateSynergy(deck);
    if (synergy < 0.5 && availableCards.length > 0) {
      // Replace the highest cost card with a random available card
      const highestCostIndex = optimizedCards.reduce((maxIndex, card, index) => 
        card.cost > optimizedCards[maxIndex].cost ? index : maxIndex, 0
      );
      
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      optimizedCards[highestCostIndex] = randomCard;
    }
    
    return {
      ...deck,
      name: `${deck.name} (Optimized)`,
      cards: optimizedCards
    };
  }

  async trainModel(trainingData: { deck: Deck; winRate: number }[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const inputs: number[][] = [];
      const outputs: number[] = [];
      
      trainingData.forEach(data => {
        inputs.push(this.generateDeckEmbedding(data.deck));
        outputs.push(data.winRate);
      });
      
      const xs = tf.tensor2d(inputs);
      const ys = tf.tensor2d(outputs, [outputs.length, 1]);
      
      await this.model!.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss?.toFixed(4)}`);
          }
        }
      });
      
      xs.dispose();
      ys.dispose();
      
      console.log('Model training completed');
    } catch (error) {
      console.error('Model training failed:', error);
    }
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isInitialized = false;
  }
}

// Singleton instance
export const deckOptimizer = new DeckOptimizer();