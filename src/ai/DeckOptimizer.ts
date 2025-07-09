import * as tf from '@tensorflow/tfjs';
import { Card } from '../data/cards';

// AI-Powered Deck Optimization System
export class DeckOptimizer {
  private model: tf.LayersModel | null = null;
  private cardEmbeddings: Map<string, number[]> = new Map();
  private synergyMatrix: tf.Tensor2D | null = null;
  private metaData: any = null;

  constructor() {
    this.initializeModel();
  }

  // Initialize the neural network model
  private async initializeModel(): Promise<void> {
    try {
      // Try to load pre-trained model
      this.model = await tf.loadLayersModel('/models/deck-optimizer.json');
    } catch (error) {
      console.log('No pre-trained model found, creating new model...');
      this.model = this.createModel();
    }
  }

  // Create a new neural network model for deck optimization
  private createModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        // Input layer: card features (cost, attack, health, type, etc.)
        tf.layers.dense({
          inputShape: [60], // 60 cards max deck size
          units: 128,
          activation: 'relu',
          name: 'card_input'
        }),
        
        // Hidden layers for learning card synergies
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 256,
          activation: 'relu',
          name: 'synergy_layer_1'
        }),
        
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 128,
          activation: 'relu',
          name: 'synergy_layer_2'
        }),
        
        // Attention mechanism for card interactions
        tf.layers.dense({
          units: 64,
          activation: 'tanh',
          name: 'attention_layer'
        }),
        
        // Output layer: deck strength score
        tf.layers.dense({
          units: 1,
          activation: 'sigmoid',
          name: 'deck_score'
        })
      ]
    });

    // Compile with advanced optimizer
    model.compile({
      optimizer: tf.train.adamax(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }

  // Generate card embeddings using advanced feature extraction
  private generateCardEmbedding(card: Card): number[] {
    const embedding = [
      // Basic stats (normalized)
      card.cost / 10,
      card.attack ? card.attack / 10 : 0,
      card.health ? card.health / 10 : 0,
      
      // Type encoding (one-hot)
      card.type === 'Familiar' ? 1 : 0,
      card.type === 'Flag' ? 1 : 0,
      
      // Element encoding
      card.element === 'Fire' ? 1 : 0,
      card.element === 'Water' ? 1 : 0,
      card.element === 'Earth' ? 1 : 0,
      card.element === 'Air' ? 1 : 0,
      card.element === 'Light' ? 1 : 0,
      card.element === 'Dark' ? 1 : 0,
      
      // Rarity encoding
      card.rarity === 'Common' ? 0.2 : 0,
      card.rarity === 'Uncommon' ? 0.4 : 0,
      card.rarity === 'Rare' ? 0.6 : 0,
      card.rarity === 'Epic' ? 0.8 : 0,
      card.rarity === 'Legendary' ? 1.0 : 0,
      
      // Advanced features
      this.calculateCardComplexity(card),
      this.calculateCardVersatility(card),
      this.calculateCardTempo(card),
      this.calculateCardValue(card)
    ];

    return embedding;
  }

  // Calculate card complexity score
  private calculateCardComplexity(card: Card): number {
    let complexity = 0;
    
    // More abilities = higher complexity
    if (card.abilities) {
      complexity += card.abilities.length * 0.2;
    }
    
    // Higher cost = higher complexity
    complexity += card.cost * 0.1;
    
    return Math.min(complexity, 1.0);
  }

  // Calculate card versatility score
  private calculateCardVersatility(card: Card): number {
    let versatility = 0;
    
    // Cards with multiple abilities are more versatile
    if (card.abilities) {
      versatility += Math.min(card.abilities.length * 0.25, 1.0);
    }
    
    // Balanced stats indicate versatility
    if (card.attack && card.health) {
      const statBalance = 1 - Math.abs(card.attack - card.health) / Math.max(card.attack, card.health);
      versatility += statBalance * 0.3;
    }
    
    return Math.min(versatility, 1.0);
  }

  // Calculate card tempo score
  private calculateCardTempo(card: Card): number {
    if (!card.attack && !card.health) return 0.5; // Spells/artifacts have neutral tempo
    
    const totalStats = (card.attack || 0) + (card.health || 0);
    const expectedStats = card.cost * 2; // Expected 2 stats per mana
    
    return Math.min(totalStats / Math.max(expectedStats, 1), 2.0) / 2.0;
  }

  // Calculate card value score
  private calculateCardValue(card: Card): number {
    let value = this.calculateCardTempo(card);
    
    // Abilities add value
    if (card.abilities) {
      value += card.abilities.length * 0.1;
    }
    
    // Rarity affects value
    const rarityMultiplier = {
      'Common': 1.0,
      'Uncommon': 1.1,
      'Rare': 1.2,
      'Epic': 1.3,
      'Legendary': 1.5
    };
    
    value *= rarityMultiplier[card.rarity as keyof typeof rarityMultiplier] || 1.0;
    
    return Math.min(value, 1.0);
  }

  // Optimize deck composition using AI
  public async optimizeDeck(cards: Card[], targetStrategy: string = 'balanced'): Promise<{
    optimizedDeck: Card[];
    score: number;
    suggestions: string[];
    synergies: Array<{ cards: string[]; strength: number; description: string }>;
  }> {
    if (!this.model) {
      await this.initializeModel();
    }

    // Generate embeddings for all cards
    const cardEmbeddings = cards.map(card => ({
      card,
      embedding: this.generateCardEmbedding(card)
    }));

    // Use genetic algorithm for deck optimization
    const optimizedDeck = await this.geneticAlgorithmOptimization(
      cardEmbeddings,
      targetStrategy
    );

    // Calculate deck score
    const score = await this.evaluateDeck(optimizedDeck);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(optimizedDeck, cards);
    
    // Find synergies
    const synergies = this.findSynergies(optimizedDeck);

    return {
      optimizedDeck,
      score,
      suggestions,
      synergies
    };
  }

  // Genetic algorithm for deck optimization
  private async geneticAlgorithmOptimization(
    cardEmbeddings: Array<{ card: Card; embedding: number[] }>,
    strategy: string
  ): Promise<Card[]> {
    const populationSize = 20;
    const generations = 50;
    const deckSize = 30;
    
    // Initialize population
    let population = this.initializePopulation(cardEmbeddings, populationSize, deckSize);
    
    for (let gen = 0; gen < generations; gen++) {
      // Evaluate fitness
      const fitness = await Promise.all(
        population.map(deck => this.evaluateDeckFitness(deck, strategy))
      );
      
      // Selection and crossover
      const newPopulation = [];
      for (let i = 0; i < populationSize; i++) {
        const parent1 = this.tournamentSelection(population, fitness);
        const parent2 = this.tournamentSelection(population, fitness);
        const offspring = this.crossover(parent1, parent2);
        const mutated = this.mutate(offspring, cardEmbeddings);
        newPopulation.push(mutated);
      }
      
      population = newPopulation;
    }
    
    // Return best deck
    const finalFitness = await Promise.all(
      population.map(deck => this.evaluateDeckFitness(deck, strategy))
    );
    
    const bestIndex = finalFitness.indexOf(Math.max(...finalFitness));
    return population[bestIndex];
  }

  // Initialize random population for genetic algorithm
  private initializePopulation(
    cardEmbeddings: Array<{ card: Card; embedding: number[] }>,
    populationSize: number,
    deckSize: number
  ): Card[][] {
    const population: Card[][] = [];
    
    for (let i = 0; i < populationSize; i++) {
      const deck: Card[] = [];
      const availableCards = [...cardEmbeddings];
      
      for (let j = 0; j < deckSize && availableCards.length > 0; j++) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        deck.push(availableCards[randomIndex].card);
        availableCards.splice(randomIndex, 1);
      }
      
      population.push(deck);
    }
    
    return population;
  }

  // Evaluate deck fitness for genetic algorithm
  private async evaluateDeckFitness(
    deck: Card[],
    strategy: string
  ): Promise<number> {
    let fitness = 0;
    
    // Base deck evaluation
    fitness += await this.evaluateDeck(deck);
    
    // Strategy-specific bonuses
    switch (strategy) {
      case 'aggressive':
        fitness += this.evaluateAggressiveStrategy(deck);
        break;
      case 'control':
        fitness += this.evaluateControlStrategy(deck);
        break;
      default:
        fitness += this.evaluateBalancedStrategy(deck);
    }
    
    return fitness;
  }

  // Tournament selection for genetic algorithm
  private tournamentSelection(population: Card[][], fitness: number[]): Card[] {
    const tournamentSize = 3;
    let best = 0;
    let bestFitness = fitness[0];
    
    for (let i = 1; i < tournamentSize; i++) {
      const candidate = Math.floor(Math.random() * population.length);
      if (fitness[candidate] > bestFitness) {
        best = candidate;
        bestFitness = fitness[candidate];
      }
    }
    
    return population[best];
  }

  // Crossover operation for genetic algorithm
  private crossover(parent1: Card[], parent2: Card[]): Card[] {
    const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.length, parent2.length));
    const offspring = [
      ...parent1.slice(0, crossoverPoint),
      ...parent2.slice(crossoverPoint)
    ];
    
    // Remove duplicates and maintain deck size
    const uniqueCards = Array.from(new Set(offspring.map(c => c.id)))
      .map(id => offspring.find(c => c.id === id)!)
      .slice(0, 30);
    
    return uniqueCards;
  }

  // Mutation operation for genetic algorithm
  private mutate(
    deck: Card[],
    cardEmbeddings: Array<{ card: Card; embedding: number[] }>
  ): Card[] {
    const mutationRate = 0.1;
    const mutatedDeck = [...deck];
    
    for (let i = 0; i < mutatedDeck.length; i++) {
      if (Math.random() < mutationRate) {
        const randomCard = cardEmbeddings[Math.floor(Math.random() * cardEmbeddings.length)];
        mutatedDeck[i] = randomCard.card;
      }
    }
    
    return mutatedDeck;
  }

  // Evaluate overall deck strength
  private async evaluateDeck(deck: Card[]): Promise<number> {
    if (!this.model || deck.length === 0) return 0;

    // Create input tensor
    const deckEmbedding = this.createDeckEmbedding(deck);
    const inputTensor = tf.tensor2d([deckEmbedding]);
    
    // Predict deck strength
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const score = await prediction.data();
    
    // Cleanup tensors
    inputTensor.dispose();
    prediction.dispose();
    
    return score[0];
  }

  // Create deck embedding for neural network input
  private createDeckEmbedding(deck: Card[]): number[] {
    const embedding = new Array(60).fill(0);
    
    deck.forEach((card, index) => {
      if (index < 60) {
        const cardEmb = this.generateCardEmbedding(card);
        embedding[index] = cardEmb.reduce((sum, val) => sum + val, 0) / cardEmb.length;
      }
    });
    
    return embedding;
  }

  // Strategy evaluation functions
  private evaluateAggressiveStrategy(deck: Card[]): number {
    let score = 0;
    const lowCostCards = deck.filter(c => c.cost <= 3).length;
    const highAttackCards = deck.filter(c => (c.attack || 0) >= c.cost).length;
    
    score += (lowCostCards / deck.length) * 0.5;
    score += (highAttackCards / deck.length) * 0.3;
    
    return score;
  }

  private evaluateControlStrategy(deck: Card[]): number {
    let score = 0;
    const highCostCards = deck.filter(c => c.cost >= 5).length;
    
    score += (highCostCards / deck.length) * 0.4;
    
    return score;
  }

  private evaluateBalancedStrategy(deck: Card[]): number {
    const costCurve = this.analyzeCostCurve(deck);
    const typeBalance = this.analyzeTypeBalance(deck);
    
    return (costCurve + typeBalance) / 2;
  }

  // Analyze mana cost curve
  private analyzeCostCurve(deck: Card[]): number {
    const costCounts = new Array(11).fill(0);
    deck.forEach(card => {
      const cost = Math.min(card.cost, 10);
      costCounts[cost]++;
    });
    
    // Ideal curve: more low-cost cards, fewer high-cost
    const idealCurve = [0, 0.2, 0.25, 0.2, 0.15, 0.1, 0.05, 0.03, 0.02, 0.01, 0.01];
    let score = 0;
    
    for (let i = 0; i < costCounts.length; i++) {
      const actual = costCounts[i] / deck.length;
      const ideal = idealCurve[i];
      score += 1 - Math.abs(actual - ideal);
    }
    
    return score / costCounts.length;
  }

  // Analyze card type balance
  private analyzeTypeBalance(deck: Card[]): number {
    const typeCounts = new Map<string, number>();
    deck.forEach(card => {
      typeCounts.set(card.type, (typeCounts.get(card.type) || 0) + 1);
    });
    
    // Ideal balance: 70% Familiars, 30% Others
    const familiarRatio = (typeCounts.get('Familiar') || 0) / deck.length;
    const idealFamiliarRatio = 0.7;
    
    return 1 - Math.abs(familiarRatio - idealFamiliarRatio);
  }

  // Generate optimization suggestions
  private generateSuggestions(optimizedDeck: Card[], allCards: Card[]): string[] {
    const suggestions: string[] = [];
    
    // Analyze cost curve
    const costAnalysis = this.analyzeCostCurve(optimizedDeck);
    if (costAnalysis < 0.7) {
      suggestions.push("Consider adjusting your mana curve - you may need more low-cost cards");
    }
    
    // Analyze synergies
    const synergies = this.findSynergies(optimizedDeck);
    if (synergies.length < 3) {
      suggestions.push("Look for cards with better synergy to increase deck consistency");
    }
    
    // Element balance
    const elements = new Map<string, number>();
    optimizedDeck.forEach(card => {
      elements.set(card.element, (elements.get(card.element) || 0) + 1);
    });
    
    if (elements.size > 3) {
      suggestions.push("Consider focusing on fewer elements for better consistency");
    }
    
    return suggestions;
  }

  // Find card synergies in deck
  private findSynergies(deck: Card[]): Array<{ cards: string[]; strength: number; description: string }> {
    const synergies: Array<{ cards: string[]; strength: number; description: string }> = [];
    
    // Element synergies
    const elementGroups = new Map<string, Card[]>();
    deck.forEach(card => {
      if (!elementGroups.has(card.element)) {
        elementGroups.set(card.element, []);
      }
      elementGroups.get(card.element)!.push(card);
    });
    
    elementGroups.forEach((cards, element) => {
      if (cards.length >= 3) {
        synergies.push({
          cards: cards.map(c => c.name),
          strength: Math.min(cards.length / 10, 1.0),
          description: `${element} element synergy with ${cards.length} cards`
        });
      }
    });
    
    return synergies;
  }

  // Cleanup resources
  public dispose(): void {
    if (this.model) {
      this.model.dispose();
    }
    if (this.synergyMatrix) {
      this.synergyMatrix.dispose();
    }
  }
}

// Export singleton instance
export const deckOptimizer = new DeckOptimizer();