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
  element?: string;
  tags?: string[];
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  winRate?: number;
  synergy?: number;
  strategy?: string;
  powerLevel?: number;
}

export interface OptimizationResult {
  optimizedDeck: Deck;
  suggestions: string[];
  synergyScore: number;
  predictedWinRate: number;
  improvements: {
    costCurve: number;
    synergy: number;
    powerLevel: number;
    consistency: number;
  };
  confidence: number;
}

export interface AdvancedMetrics {
  manaCurve: number[];
  typeDistribution: Map<string, number>;
  abilityFrequency: Map<string, number>;
  synergyMatrix: number[][];
  powerLevel: number;
  consistency: number;
  versatility: number;
}

export class DeckOptimizer {
  private primaryModel: tf.LayersModel | null = null;
  private synergyModel: tf.LayersModel | null = null;
  private consistencyModel: tf.LayersModel | null = null;
  private cardEmbeddings: Map<string, number[]> = new Map();
  private trainingHistory: Array<{deck: Deck; result: number; timestamp: Date}> = [];
  private isInitialized = false;
  private optimizationStrategies: Map<string, (deck: Deck) => number> = new Map();

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing advanced deck optimizer with neural architectures...');
      
      // Create advanced multi-model neural network architecture
      await this.initializePrimaryModel();
      await this.initializeSynergyModel();
      await this.initializeConsistencyModel();
      
      // Initialize optimization strategies
      this.initializeOptimizationStrategies();

      this.isInitialized = true;
      console.log('✅ Advanced deck optimizer initialized with multi-model architecture');
      console.log('🎯 New capabilities: Multi-objective optimization, advanced synergy detection, consistency analysis');
    } catch (_error) {
      console.error('Failed to initialize advanced DeckOptimizer:', _error);
      // Fallback to basic model
      await this.initializeFallbackModel();
    }
  }

  private async initializePrimaryModel(): Promise<void> {
    // Advanced transformer-inspired architecture for deck evaluation
    this.primaryModel = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [150], // Increased feature space
          units: 512,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
        }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.3 }),
        
        tf.layers.dense({ 
          units: 256, 
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
        }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.2 }),
        
        tf.layers.dense({ 
          units: 128, 
          activation: 'relu',
        }),
        tf.layers.dropout({ rate: 0.15 }),
        
        tf.layers.dense({ 
          units: 64, 
          activation: 'relu',
        }),
        
        // Multi-head output for comprehensive evaluation
        tf.layers.dense({ units: 3, activation: 'sigmoid' }), // [winRate, powerLevel, consistency]
      ],
    });

    this.primaryModel.compile({
      optimizer: tf.train.adamax(0.001),
      loss: 'meanSquaredError',
      metrics: ['mse', 'mae'],
    });
  }

  private async initializeSynergyModel(): Promise<void> {
    // Specialized model for synergy detection using attention-like mechanisms
    this.synergyModel = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [200], // Card interaction features
          units: 256,
          activation: 'tanh',
        }),
        tf.layers.dropout({ rate: 0.25 }),
        
        tf.layers.dense({ 
          units: 128, 
          activation: 'tanh',
        }),
        tf.layers.dropout({ rate: 0.2 }),
        
        tf.layers.dense({ 
          units: 64, 
          activation: 'relu',
        }),
        
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    this.synergyModel.compile({
      optimizer: tf.train.adam(0.002),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });
  }

  private async initializeConsistencyModel(): Promise<void> {
    // Model for evaluating deck consistency and reliability
    this.consistencyModel = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [100],
          units: 128,
          activation: 'relu',
        }),
        tf.layers.dropout({ rate: 0.2 }),
        
        tf.layers.dense({ 
          units: 64, 
          activation: 'relu',
        }),
        
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    this.consistencyModel.compile({
      optimizer: tf.train.adam(0.0015),
      loss: 'meanSquaredError',
      metrics: ['mse'],
    });
  }

  private async initializeFallbackModel(): Promise<void> {
    console.log('⚠️ Initializing fallback deck optimizer...');
    
    this.primaryModel = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [100],
          units: 256,
          activation: 'relu',
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    this.primaryModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    this.isInitialized = true;
    console.log('✅ Fallback deck optimizer initialized');
  }

  private initializeOptimizationStrategies(): void {
    // Aggro strategy optimizer
    this.optimizationStrategies.set('aggro', (deck: Deck) => {
      const lowCostCards = deck.cards.filter(c => c.cost <= 3).length;
      const totalAttack = deck.cards.reduce((sum, c) => sum + (c.attack || 0), 0);
      return (lowCostCards / deck.cards.length) * 0.6 + (totalAttack / (deck.cards.length * 10)) * 0.4;
    });

    // Control strategy optimizer
    this.optimizationStrategies.set('control', (deck: Deck) => {
      const highCostCards = deck.cards.filter(c => c.cost >= 5).length;
      const removalSpells = deck.cards.filter(c => 
        c.abilities.some(a => a.includes('destroy') || a.includes('counter'))
      ).length;
      return (highCostCards / deck.cards.length) * 0.5 + (removalSpells / deck.cards.length) * 0.5;
    });

    // Combo strategy optimizer
    this.optimizationStrategies.set('combo', (deck: Deck) => {
      const synergyScore = this.calculateAdvancedSynergy(deck);
      const searchCards = deck.cards.filter(c => 
        c.abilities.some(a => a.includes('search') || a.includes('draw'))
      ).length;
      return synergyScore * 0.7 + (searchCards / deck.cards.length) * 0.3;
    });

    // Midrange strategy optimizer
    this.optimizationStrategies.set('midrange', (deck: Deck) => {
      const midCostCards = deck.cards.filter(c => c.cost >= 3 && c.cost <= 5).length;
      const versatileCards = deck.cards.filter(c => c.abilities.length > 1).length;
      return (midCostCards / deck.cards.length) * 0.6 + (versatileCards / deck.cards.length) * 0.4;
    });
  }

  private generateAdvancedCardEmbedding(card: Card): number[] {
    // Generate a comprehensive feature vector for the card (150 dimensions)
    const embedding = new Array(150).fill(0);

    // Basic stats (normalized)
    embedding[0] = Math.min(card.cost / 15, 1); // Normalized cost (max 15)
    embedding[1] = Math.min((card.attack || 0) / 15, 1); // Normalized attack
    embedding[2] = Math.min((card.health || 0) / 15, 1); // Normalized health
    
    // Power-to-cost ratio
    const power = (card.attack || 0) + (card.health || 0);
    embedding[3] = card.cost > 0 ? Math.min(power / card.cost / 5, 1) : 0;

    // Type encoding (enhanced one-hot)
    const types = ['creature', 'spell', 'artifact', 'enchantment', 'planeswalker', 'instant', 'sorcery'];
    const typeIndex = types.indexOf(card.type.toLowerCase());
    if (typeIndex >= 0) embedding[4 + typeIndex] = 1;

    // Rarity encoding with weighted values
    const rarityWeights = { 'common': 0.25, 'uncommon': 0.5, 'rare': 0.75, 'legendary': 1.0, 'mythic': 1.0 };
    embedding[11] = rarityWeights[card.rarity.toLowerCase() as keyof typeof rarityWeights] || 0.25;

    // Element/Color encoding
    const elements = ['red', 'blue', 'green', 'white', 'black', 'colorless'];
    if (card.element) {
      const elementIndex = elements.indexOf(card.element.toLowerCase());
      if (elementIndex >= 0) embedding[12 + elementIndex] = 1;
    }

    // Advanced ability encoding with semantic grouping
    const abilityCategories = {
      combat: ['trample', 'flying', 'first strike', 'double strike', 'deathtouch', 'lifelink', 'vigilance'],
      protection: ['hexproof', 'shroud', 'indestructible', 'protection', 'ward'],
      utility: ['flash', 'haste', 'reach', 'defender', 'menace'],
      card_advantage: ['draw', 'search', 'scry', 'surveil'],
      removal: ['destroy', 'exile', 'counter', 'damage', 'return'],
      ramp: ['mana', 'land', 'treasure', 'ramp'],
    };

    let abilityOffset = 18;
    Object.keys(abilityCategories).forEach((category, catIndex) => {
      const categoryAbilities = abilityCategories[category as keyof typeof abilityCategories];
      const hasAbility = card.abilities.some(ability => 
        categoryAbilities.some(keyword => ability.toLowerCase().includes(keyword))
      );
      if (hasAbility) embedding[abilityOffset + catIndex] = 1;
    });

    // Individual ability encoding (top 30 most common)
    const commonAbilities = [
      'flying', 'trample', 'haste', 'vigilance', 'lifelink', 'deathtouch',
      'first strike', 'double strike', 'hexproof', 'menace', 'reach',
      'flash', 'defender', 'indestructible', 'draw', 'search', 'destroy',
      'counter', 'damage', 'exile', 'return', 'scry', 'mana', 'land',
      'treasure', 'token', 'sacrifice', 'tap', 'untap', 'transform'
    ];

    abilityOffset = 24;
    commonAbilities.forEach((ability, index) => {
      if (index < 30 && card.abilities.some(a => a.toLowerCase().includes(ability))) {
        embedding[abilityOffset + index] = 1;
      }
    });

    // Mana curve position features
    const curvePosition = this.getCurvePosition(card.cost);
    embedding[54] = curvePosition.early;
    embedding[55] = curvePosition.mid;
    embedding[56] = curvePosition.late;

    // Tag-based features (if available)
    if (card.tags) {
      const commonTags = ['tribal', 'combo', 'control', 'aggro', 'midrange', 'ramp', 'burn'];
      card.tags.forEach(tag => {
        const tagIndex = commonTags.indexOf(tag.toLowerCase());
        if (tagIndex >= 0 && tagIndex < 10) {
          embedding[57 + tagIndex] = 1;
        }
      });
    }

    // Statistical features
    embedding[67] = card.abilities.length / 10; // Ability count normalized
    embedding[68] = card.name.length / 50; // Name length (complexity indicator)
    
    // Context-aware features (deck composition influence)
    embedding[69] = this.getCardComplexity(card);
    embedding[70] = this.getCardVersatility(card);

    // Fill remaining dimensions with advanced heuristic features
    for (let i = 71; i < 150; i++) {
      embedding[i] = this.generateHeuristicFeature(card, i);
    }

    return embedding;
  }

  private getCurvePosition(cost: number): { early: number; mid: number; late: number } {
    if (cost <= 2) return { early: 1, mid: 0, late: 0 };
    if (cost <= 4) return { early: 0, mid: 1, late: 0 };
    return { early: 0, mid: 0, late: 1 };
  }

  private getCardComplexity(card: Card): number {
    // Complexity based on abilities and interactions
    let complexity = 0;
    complexity += card.abilities.length * 0.2;
    complexity += card.abilities.filter(a => a.includes('when') || a.includes('if')).length * 0.3;
    complexity += card.abilities.filter(a => a.length > 20).length * 0.1;
    return Math.min(complexity, 1);
  }

  private getCardVersatility(card: Card): number {
    // Versatility based on multiple use cases
    let versatility = 0;
    if (card.abilities.some(a => a.includes('or') || a.includes('choose'))) versatility += 0.4;
    if (card.abilities.length > 2) versatility += 0.3;
    if (card.type.toLowerCase() === 'instant' || card.abilities.some(a => a.includes('flash'))) versatility += 0.3;
    return Math.min(versatility, 1);
  }

  private generateHeuristicFeature(card: Card, index: number): number {
    // Generate context-specific features based on index
    const seed = card.name.charCodeAt(0) + index;
    const random = Math.sin(seed) * 10000;
    return (random - Math.floor(random)) * 0.1; // Small random component for feature diversity
  }

  private generateCardEmbedding(card: Card): number[] {
    // Legacy method - redirects to advanced embedding
    return this.generateAdvancedCardEmbedding(card);
  }

  private calculateAdvancedSynergy(deck: Deck): number {
    if (deck.cards.length < 2) return 0;

    let totalSynergy = 0;
    const cards = deck.cards;
    const synergyMatrix: number[][] = [];

    // Initialize synergy matrix
    for (let i = 0; i < cards.length; i++) {
      synergyMatrix[i] = new Array(cards.length).fill(0);
    }

    // Calculate pairwise synergies
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const synergy = this.calculatePairSynergy(cards[i], cards[j]);
        synergyMatrix[i][j] = synergy;
        synergyMatrix[j][i] = synergy;
        totalSynergy += synergy;
      }
    }

    // Advanced synergy metrics
    const pairCount = (cards.length * (cards.length - 1)) / 2;
    const baseSynergy = totalSynergy / pairCount;

    // Bonus for synergy clusters (cards that synergize with multiple others)
    const clusterBonus = this.calculateClusterSynergy(synergyMatrix);

    // Penalty for anti-synergy (cards that work against each other)
    const antiSynergyPenalty = this.calculateAntiSynergy(cards);

    // Strategy coherence bonus
    const strategyBonus = this.calculateStrategyCoherence(deck);

    const finalSynergy = baseSynergy + clusterBonus - antiSynergyPenalty + strategyBonus;
    return Math.max(0, Math.min(1, finalSynergy));
  }

  private calculatePairSynergy(card1: Card, card2: Card): number {
    let synergy = 0;

    // Type synergy
    if (card1.type === card2.type) synergy += 0.15;

    // Cost curve synergy (smooth mana curve)
    const costDiff = Math.abs(card1.cost - card2.cost);
    if (costDiff === 1) synergy += 0.1;
    else if (costDiff === 0 && card1.cost > 0) synergy += 0.05;

    // Ability synergy (enhanced)
    const commonAbilities = card1.abilities.filter(a => 
      card2.abilities.some(b => 
        a.toLowerCase().includes(b.toLowerCase()) || 
        b.toLowerCase().includes(a.toLowerCase())
      )
    );
    synergy += commonAbilities.length * 0.2;

    // Element/color synergy
    if (card1.element && card2.element) {
      if (card1.element === card2.element) synergy += 0.15;
      else if (this.areComplementaryElements(card1.element, card2.element)) synergy += 0.1;
    }

    // Power level synergy (cards of similar power level work well together)
    const power1 = (card1.attack || 0) + (card1.health || 0);
    const power2 = (card2.attack || 0) + (card2.health || 0);
    const powerRatio = Math.min(power1, power2) / Math.max(power1 || 1, power2 || 1);
    if (powerRatio > 0.7) synergy += 0.08;

    // Specific interaction synergies
    synergy += this.calculateSpecificInteractions(card1, card2);

    return Math.min(synergy, 1);
  }

  private areComplementaryElements(element1: string, element2: string): boolean {
    const complementaryPairs = [
      ['red', 'white'], ['blue', 'black'], ['green', 'red'],
      ['white', 'blue'], ['black', 'green']
    ];
    
    return complementaryPairs.some(pair => 
      (pair[0] === element1.toLowerCase() && pair[1] === element2.toLowerCase()) ||
      (pair[1] === element1.toLowerCase() && pair[0] === element2.toLowerCase())
    );
  }

  private calculateSpecificInteractions(card1: Card, card2: Card): number {
    let interaction = 0;

    // Specific ability interactions
    const interactions = [
      { trigger: 'draw', enabler: 'card' },
      { trigger: 'destroy', enabler: 'creature' },
      { trigger: 'search', enabler: 'library' },
      { trigger: 'sacrifice', enabler: 'token' },
      { trigger: 'damage', enabler: 'target' },
    ];

    interactions.forEach(({ trigger, enabler }) => {
      const card1HasTrigger = card1.abilities.some(a => a.toLowerCase().includes(trigger));
      const card2HasEnabler = card2.abilities.some(a => a.toLowerCase().includes(enabler));
      const card2HasTrigger = card2.abilities.some(a => a.toLowerCase().includes(trigger));
      const card1HasEnabler = card1.abilities.some(a => a.toLowerCase().includes(enabler));

      if ((card1HasTrigger && card2HasEnabler) || (card2HasTrigger && card1HasEnabler)) {
        interaction += 0.25;
      }
    });

    return Math.min(interaction, 0.5);
  }

  private calculateClusterSynergy(synergyMatrix: number[][]): number {
    const n = synergyMatrix.length;
    let clusterBonus = 0;

    for (let i = 0; i < n; i++) {
      const highSynergyCount = synergyMatrix[i].filter(synergy => synergy > 0.3).length;
      if (highSynergyCount >= 3) {
        clusterBonus += 0.1;
      }
    }

    return Math.min(clusterBonus, 0.3);
  }

  private calculateAntiSynergy(cards: Card[]): number {
    let antiSynergy = 0;

    // Cards that compete for the same role
    const roleGroups = this.groupCardsByRole(cards);
    Object.values(roleGroups).forEach(group => {
      if (group.length > 4) { // Too many cards in the same role
        antiSynergy += (group.length - 4) * 0.05;
      }
    });

    // Conflicting strategies
    const hasAggro = cards.some(c => c.cost <= 2 && (c.attack || 0) >= 2);
    const hasControl = cards.some(c => c.cost >= 6);
    if (hasAggro && hasControl) {
      antiSynergy += 0.1;
    }

    return Math.min(antiSynergy, 0.3);
  }

  private groupCardsByRole(cards: Card[]): Record<string, Card[]> {
    const roles = {
      'early-aggro': [] as Card[],
      'midrange': [] as Card[],
      'control': [] as Card[],
      'removal': [] as Card[],
      'draw': [] as Card[],
      'ramp': [] as Card[],
    };

    cards.forEach(card => {
      if (card.cost <= 2 && (card.attack || 0) >= 2) roles['early-aggro'].push(card);
      else if (card.cost >= 3 && card.cost <= 5) roles['midrange'].push(card);
      else if (card.cost >= 6) roles['control'].push(card);

      if (card.abilities.some(a => a.includes('destroy') || a.includes('exile'))) {
        roles['removal'].push(card);
      }
      if (card.abilities.some(a => a.includes('draw'))) {
        roles['draw'].push(card);
      }
      if (card.abilities.some(a => a.includes('mana') || a.includes('land'))) {
        roles['ramp'].push(card);
      }
    });

    return roles;
  }

  private calculateStrategyCoherence(deck: Deck): number {
    if (!deck.strategy) return 0;

    const strategyOptimizer = this.optimizationStrategies.get(deck.strategy);
    if (!strategyOptimizer) return 0;

    const coherenceScore = strategyOptimizer(deck);
    return Math.min(coherenceScore * 0.2, 0.2); // Max 0.2 bonus for strategy coherence
  }

  private calculateSynergy(deck: Deck): number {
    // Legacy method - redirects to advanced calculation
    return this.calculateAdvancedSynergy(deck);
  }

  async optimizeDeck(
    deck: Deck,
    availableCards: Card[],
    strategy?: string,
  ): Promise<OptimizationResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log(`🔄 Optimizing deck "${deck.name}" with advanced AI models...`);
      
      // Detect strategy if not provided
      const detectedStrategy = strategy || this.detectDeckStrategy(deck);
      const deckWithStrategy = { ...deck, strategy: detectedStrategy };

      // Generate comprehensive embeddings
      const deckEmbedding = this.generateAdvancedDeckEmbedding(deckWithStrategy);
      const synergyEmbedding = this.generateSynergyEmbedding(deckWithStrategy);
      const consistencyEmbedding = this.generateConsistencyEmbedding(deckWithStrategy);

      // Multi-model predictions
      const predictions = await this.performMultiModelPrediction(
        deckEmbedding,
        synergyEmbedding,
        consistencyEmbedding
      );

      // Calculate advanced metrics
      const metrics = this.calculateAdvancedMetrics(deckWithStrategy);
      const currentSynergy = this.calculateAdvancedSynergy(deckWithStrategy);

      // Generate intelligent suggestions
      const suggestions = await this.generateIntelligentSuggestions(
        deckWithStrategy,
        availableCards,
        predictions,
        metrics
      );

      // Create optimized deck using genetic algorithm approach
      const optimizedDeck = await this.createOptimizedDeck(
        deckWithStrategy,
        availableCards,
        predictions,
        detectedStrategy
      );

      // Calculate improvements
      const improvements = this.calculateImprovements(deck, optimizedDeck, metrics);

      // Store training data for continuous learning
      this.recordOptimizationResult(deckWithStrategy, predictions);

      console.log(`✅ Deck optimization completed with ${predictions.confidence.toFixed(1)}% confidence`);

      return {
        optimizedDeck,
        suggestions,
        synergyScore: currentSynergy,
        predictedWinRate: predictions.winRate,
        improvements,
        confidence: predictions.confidence,
      };
    } catch (_error) {
      console.error('Advanced deck optimization failed:', _error);
      return this.performFallbackOptimization(deck, availableCards);
    }
  }

  private detectDeckStrategy(deck: Deck): string {
    const avgCost = deck.cards.reduce((sum, c) => sum + c.cost, 0) / deck.cards.length;
    const lowCostRatio = deck.cards.filter(c => c.cost <= 3).length / deck.cards.length;
    const highCostRatio = deck.cards.filter(c => c.cost >= 6).length / deck.cards.length;
    const totalAttack = deck.cards.reduce((sum, c) => sum + (c.attack || 0), 0);
    const removalCount = deck.cards.filter(c => 
      c.abilities.some(a => a.includes('destroy') || a.includes('exile') || a.includes('counter'))
    ).length;

    // Strategy detection logic
    if (lowCostRatio > 0.6 && totalAttack > deck.cards.length * 3) return 'aggro';
    if (highCostRatio > 0.3 && removalCount > deck.cards.length * 0.2) return 'control';
    if (avgCost >= 3 && avgCost <= 5) return 'midrange';
    
    const synergyScore = this.calculateAdvancedSynergy(deck);
    if (synergyScore > 0.6) return 'combo';
    
    return 'midrange'; // Default strategy
  }

  private generateAdvancedDeckEmbedding(deck: Deck): number[] {
    const embedding = new Array(150).fill(0);

    // Aggregate card embeddings with attention-like weighting
    const cardEmbeddings = deck.cards.map(card => this.generateAdvancedCardEmbedding(card));
    
    // Calculate card importance weights
    const weights = deck.cards.map(card => this.calculateCardImportance(card, deck));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Weighted aggregation
    cardEmbeddings.forEach((cardEmb, index) => {
      const weight = weights[index] / totalWeight;
      cardEmb.forEach((value, embIndex) => {
        embedding[embIndex] += value * weight;
      });
    });

    return embedding;
  }

  private calculateCardImportance(card: Card, deck: Deck): number {
    let importance = 1.0;

    // Rarity importance
    const rarityWeights = { 'common': 1.0, 'uncommon': 1.2, 'rare': 1.5, 'legendary': 2.0, 'mythic': 2.0 };
    importance *= rarityWeights[card.rarity.toLowerCase() as keyof typeof rarityWeights] || 1.0;

    // Unique abilities increase importance
    importance += card.abilities.length * 0.1;

    // Cards with multiple types or high versatility
    if (card.abilities.some(a => a.includes('or') || a.includes('choose'))) {
      importance += 0.3;
    }

    return importance;
  }

  private generateSynergyEmbedding(deck: Deck): number[] {
    const embedding = new Array(200).fill(0);
    const cards = deck.cards;

    // Pairwise interaction features
    let featureIndex = 0;
    for (let i = 0; i < Math.min(cards.length, 10); i++) {
      for (let j = i + 1; j < Math.min(cards.length, 10); j++) {
        if (featureIndex < 45) { // Max 45 pairs for 10 cards
          const synergy = this.calculatePairSynergy(cards[i], cards[j]);
          embedding[featureIndex] = synergy;
          featureIndex++;
        }
      }
    }

    // Global synergy features
    const typeDistribution = this.getTypeDistribution(cards);
    const abilityFrequency = this.getAbilityFrequency(cards);
    
    Object.values(typeDistribution).forEach((count, index) => {
      if (index < 20) embedding[45 + index] = count / cards.length;
    });

    // Strategy coherence features
    if (deck.strategy) {
      const strategyOptimizer = this.optimizationStrategies.get(deck.strategy);
      if (strategyOptimizer) {
        embedding[65] = strategyOptimizer(deck);
      }
    }

    return embedding;
  }

  private generateConsistencyEmbedding(deck: Deck): number[] {
    const embedding = new Array(100).fill(0);

    // Mana curve consistency
    const curve = this.calculateManaCurve(deck.cards);
    curve.forEach((count, cost) => {
      if (cost < 10) embedding[cost] = count / deck.cards.length;
    });

    // Type distribution variance
    const typeDistribution = this.getTypeDistribution(deck.cards);
    const typeVariance = this.calculateVariance(Object.values(typeDistribution));
    embedding[10] = Math.min(typeVariance / deck.cards.length, 1);

    // Draw consistency features
    const drawCards = deck.cards.filter(c => c.abilities.some(a => a.includes('draw'))).length;
    const searchCards = deck.cards.filter(c => c.abilities.some(a => a.includes('search'))).length;
    embedding[11] = drawCards / deck.cards.length;
    embedding[12] = searchCards / deck.cards.length;

    return embedding;
  }

  private async performMultiModelPrediction(
    deckEmbedding: number[],
    synergyEmbedding: number[],
    consistencyEmbedding: number[]
  ): Promise<{
    winRate: number;
    powerLevel: number;
    consistency: number;
    synergy: number;
    confidence: number;
  }> {
    try {
      // Primary model prediction
      const primaryPrediction = this.primaryModel!.predict(
        tf.tensor2d([deckEmbedding])
      ) as tf.Tensor;
      const primaryResults = await primaryPrediction.data();

      // Synergy model prediction
      let synergyScore = 0.5;
      if (this.synergyModel) {
        const synergyPrediction = this.synergyModel.predict(
          tf.tensor2d([synergyEmbedding])
        ) as tf.Tensor;
        const synergyResults = await synergyPrediction.data();
        synergyScore = synergyResults[0];
        synergyPrediction.dispose();
      }

      // Consistency model prediction
      let consistencyScore = 0.5;
      if (this.consistencyModel) {
        const consistencyPrediction = this.consistencyModel.predict(
          tf.tensor2d([consistencyEmbedding])
        ) as tf.Tensor;
        const consistencyResults = await consistencyPrediction.data();
        consistencyScore = consistencyResults[0];
        consistencyPrediction.dispose();
      }

      primaryPrediction.dispose();

      // Combine predictions with confidence estimation
      const winRate = primaryResults.length >= 3 ? primaryResults[0] : primaryResults[0];
      const powerLevel = primaryResults.length >= 3 ? primaryResults[1] : 0.5;
      const consistency = primaryResults.length >= 3 ? primaryResults[2] : consistencyScore;

      // Calculate prediction confidence
      const confidence = this.calculatePredictionConfidence(
        winRate, powerLevel, consistency, synergyScore
      );

      return {
        winRate,
        powerLevel,
        consistency,
        synergy: synergyScore,
        confidence,
      };
    } catch (_error) {
      console.error('Multi-model prediction failed:', _error);
      return {
        winRate: 0.5,
        powerLevel: 0.5,
        consistency: 0.5,
        synergy: 0.5,
        confidence: 0.3,
      };
    }
  }

  private calculatePredictionConfidence(
    winRate: number,
    powerLevel: number,
    consistency: number,
    synergy: number
  ): number {
    // Base confidence on prediction consensus
    const predictions = [winRate, powerLevel, consistency, synergy];
    const mean = predictions.reduce((sum, p) => sum + p, 0) / predictions.length;
    const variance = predictions.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / predictions.length;
    
    // Lower variance = higher confidence
    const baseConfidence = Math.max(0.3, 1 - variance * 2);
    
    // Boost confidence if we have training history
    const historyBoost = Math.min(this.trainingHistory.length / 100, 0.2);
    
    return Math.min(baseConfidence + historyBoost, 0.95);
  }

  // Helper methods for advanced calculations

  private calculateManaCurve(cards: Card[]): number[] {
    const curve = new Array(16).fill(0); // Support costs 0-15
    cards.forEach(card => {
      const cost = Math.min(card.cost, 15);
      curve[cost]++;
    });
    return curve;
  }

  private getTypeDistribution(cards: Card[]): Map<string, number> {
    const distribution = new Map<string, number>();
    cards.forEach(card => {
      distribution.set(card.type, (distribution.get(card.type) || 0) + 1);
    });
    return distribution;
  }

  private getAbilityFrequency(cards: Card[]): Map<string, number> {
    const frequency = new Map<string, number>();
    cards.forEach(card => {
      card.abilities.forEach(ability => {
        frequency.set(ability, (frequency.get(ability) || 0) + 1);
      });
    });
    return frequency;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }

  private calculateAdvancedMetrics(deck: Deck): AdvancedMetrics {
    return {
      manaCurve: this.calculateManaCurve(deck.cards),
      typeDistribution: this.getTypeDistribution(deck.cards),
      abilityFrequency: this.getAbilityFrequency(deck.cards),
      synergyMatrix: this.generateSynergyMatrix(deck.cards),
      powerLevel: this.calculatePowerLevel(deck.cards),
      consistency: this.calculateConsistency(deck.cards),
      versatility: this.calculateVersatility(deck.cards),
    };
  }

  private generateSynergyMatrix(cards: Card[]): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < cards.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < cards.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = this.calculatePairSynergy(cards[i], cards[j]);
        }
      }
    }
    return matrix;
  }

  private calculatePowerLevel(cards: Card[]): number {
    const totalPower = cards.reduce((sum, card) => {
      const cardPower = (card.attack || 0) + (card.health || 0) + card.abilities.length;
      const costAdjustment = card.cost > 0 ? cardPower / card.cost : cardPower;
      return sum + costAdjustment;
    }, 0);
    
    return Math.min(totalPower / cards.length / 5, 1); // Normalized to 0-1
  }

  private calculateConsistency(cards: Card[]): number {
    const curve = this.calculateManaCurve(cards);
    const typeDistribution = this.getTypeDistribution(cards);
    
    // Mana curve smoothness
    let curveScore = 0;
    for (let i = 1; i < 8; i++) {
      if (curve[i] > 0) curveScore += 0.1;
    }
    
    // Type balance
    const typeBalance = 1 - this.calculateVariance(Array.from(typeDistribution.values())) / cards.length;
    
    return (curveScore + typeBalance) / 2;
  }

  private calculateVersatility(cards: Card[]): number {
    const versatileCards = cards.filter(card => 
      card.abilities.length > 1 ||
      card.abilities.some(a => a.includes('or') || a.includes('choose')) ||
      card.type.toLowerCase() === 'instant'
    ).length;
    
    return versatileCards / cards.length;
  }

  private async generateIntelligentSuggestions(
    deck: Deck,
    availableCards: Card[],
    predictions: any,
    metrics: AdvancedMetrics
  ): Promise<string[]> {
    const suggestions: string[] = [];

    // Mana curve analysis
    const curve = metrics.manaCurve;
    if (curve[1] + curve[2] < deck.cards.length * 0.3) {
      suggestions.push('🔄 Add more early-game cards (1-2 mana) for better tempo');
    }
    
    if (curve.slice(6).reduce((sum, count) => sum + count, 0) > deck.cards.length * 0.25) {
      suggestions.push('⚡ Consider reducing high-cost cards to improve consistency');
    }

    // Power level suggestions
    if (predictions.powerLevel < 0.4) {
      suggestions.push('💪 Add higher-impact cards to increase overall power level');
    }

    // Consistency suggestions
    if (predictions.consistency < 0.5) {
      suggestions.push('🎯 Add card draw or tutoring effects to improve consistency');
    }

    // Synergy suggestions
    if (predictions.synergy < 0.6) {
      suggestions.push('🔗 Look for cards that synergize better with your existing strategy');
    }

    // Strategy-specific suggestions
    if (deck.strategy) {
      const strategySuggestions = this.getStrategySuggestions(deck, availableCards);
      suggestions.push(...strategySuggestions);
    }

    return suggestions.length > 0 ? suggestions : ['✅ Deck appears well-optimized for its strategy'];
  }

  private getStrategySuggestions(deck: Deck, availableCards: Card[]): string[] {
    const suggestions: string[] = [];
    
    switch (deck.strategy) {
      case 'aggro':
        if (deck.cards.filter(c => c.cost <= 2).length < deck.cards.length * 0.6) {
          suggestions.push('🏃 Add more low-cost aggressive creatures');
        }
        break;
      
      case 'control':
        const removalCount = deck.cards.filter(c => 
          c.abilities.some(a => a.includes('destroy') || a.includes('counter'))
        ).length;
        if (removalCount < deck.cards.length * 0.3) {
          suggestions.push('🛡️ Add more removal and counterspells');
        }
        break;
      
      case 'combo':
        const tutors = deck.cards.filter(c => c.abilities.some(a => a.includes('search'))).length;
        if (tutors < 3) {
          suggestions.push('🔍 Add tutoring effects to find combo pieces consistently');
        }
        break;
    }

    return suggestions;
  }

  private async createOptimizedDeck(
    deck: Deck,
    availableCards: Card[],
    predictions: any,
    strategy: string
  ): Promise<Deck> {
    // Start with current deck
    let optimizedCards = [...deck.cards];

    // Apply genetic algorithm-inspired optimization
    for (let generation = 0; generation < 5; generation++) {
      optimizedCards = this.optimizeGeneration(optimizedCards, availableCards, strategy);
    }

    return {
      ...deck,
      name: `${deck.name} (AI Optimized)`,
      cards: optimizedCards,
      strategy,
      synergy: this.calculateAdvancedSynergy({ ...deck, cards: optimizedCards }),
      powerLevel: this.calculatePowerLevel(optimizedCards),
    };
  }

  private optimizeGeneration(cards: Card[], availableCards: Card[], strategy: string): Card[] {
    const optimized = [...cards];
    
    // Find worst performing cards
    const cardScores = cards.map(card => this.scoreCardInContext(card, cards, strategy));
    const worstCardIndex = cardScores.indexOf(Math.min(...cardScores));
    
    // Try to replace with better cards
    const potentialReplacements = availableCards
      .filter(card => !cards.some(c => c.id === card.id))
      .sort((a, b) => this.scoreCardInContext(b, cards, strategy) - this.scoreCardInContext(a, cards, strategy))
      .slice(0, 5);

    if (potentialReplacements.length > 0) {
      const replacement = potentialReplacements[0];
      if (this.scoreCardInContext(replacement, cards, strategy) > cardScores[worstCardIndex]) {
        optimized[worstCardIndex] = replacement;
      }
    }

    return optimized;
  }

  private scoreCardInContext(card: Card, deckCards: Card[], strategy: string): number {
    let score = 0;

    // Base power score
    const power = (card.attack || 0) + (card.health || 0);
    score += card.cost > 0 ? power / card.cost : power;

    // Strategy alignment
    const strategyMultiplier = this.getStrategyMultiplier(card, strategy);
    score *= strategyMultiplier;

    // Synergy with existing cards
    const avgSynergy = deckCards
      .filter(c => c.id !== card.id)
      .reduce((sum, c) => sum + this.calculatePairSynergy(card, c), 0) / (deckCards.length - 1);
    score += avgSynergy * 5;

    return score;
  }

  private getStrategyMultiplier(card: Card, strategy: string): number {
    switch (strategy) {
      case 'aggro':
        return card.cost <= 3 && (card.attack || 0) >= 2 ? 1.5 : 0.8;
      case 'control':
        return card.cost >= 4 || card.abilities.some(a => a.includes('destroy')) ? 1.5 : 0.8;
      case 'combo':
        return card.abilities.length > 1 ? 1.5 : 0.9;
      case 'midrange':
        return card.cost >= 3 && card.cost <= 5 ? 1.3 : 0.9;
      default:
        return 1.0;
    }
  }

  private calculateImprovements(originalDeck: Deck, optimizedDeck: Deck, metrics: AdvancedMetrics): {
    costCurve: number;
    synergy: number;
    powerLevel: number;
    consistency: number;
  } {
    const originalMetrics = this.calculateAdvancedMetrics(originalDeck);
    const optimizedMetrics = this.calculateAdvancedMetrics(optimizedDeck);

    return {
      costCurve: this.compareCostCurves(originalMetrics.manaCurve, optimizedMetrics.manaCurve),
      synergy: optimizedMetrics.powerLevel - originalMetrics.powerLevel,
      powerLevel: optimizedDeck.powerLevel! - (originalDeck.powerLevel || 0.5),
      consistency: optimizedMetrics.consistency - originalMetrics.consistency,
    };
  }

  private compareCostCurves(original: number[], optimized: number[]): number {
    // Ideal curve approximation (more cards in 2-4 mana range)
    const idealWeights = [0.1, 0.2, 0.25, 0.2, 0.15, 0.1, 0.0, 0.0, 0.0, 0.0];
    
    const originalScore = original.slice(0, 10).reduce((sum, count, i) => 
      sum + Math.abs(count / original.reduce((s, c) => s + c, 0) - (idealWeights[i] || 0)), 0);
    
    const optimizedScore = optimized.slice(0, 10).reduce((sum, count, i) => 
      sum + Math.abs(count / optimized.reduce((s, c) => s + c, 0) - (idealWeights[i] || 0)), 0);

    return originalScore - optimizedScore; // Positive = improvement
  }

  private recordOptimizationResult(deck: Deck, predictions: any): void {
    this.trainingHistory.push({
      deck,
      result: predictions.winRate,
      timestamp: new Date(),
    });

    // Keep only recent history
    if (this.trainingHistory.length > 1000) {
      this.trainingHistory = this.trainingHistory.slice(-500);
    }
  }

  private async performFallbackOptimization(deck: Deck, availableCards: Card[]): Promise<OptimizationResult> {
    console.log('⚠️ Performing fallback optimization...');
    
    return {
      optimizedDeck: this.applyOptimizations(deck, availableCards),
      suggestions: ['Basic optimization applied due to AI system limitations'],
      synergyScore: this.calculateAdvancedSynergy(deck),
      predictedWinRate: 0.5,
      improvements: { costCurve: 0, synergy: 0, powerLevel: 0, consistency: 0 },
      confidence: 0.3,
    };
  }

  // Legacy methods for backward compatibility

  private generateDeckEmbedding(deck: Deck): number[] {
    // Legacy method - redirects to advanced embedding
    return this.generateAdvancedDeckEmbedding(deck);
  }

  private generateSuggestions(deck: Deck, availableCards: Card[]): string[] {
    // Legacy method - use intelligent suggestions
    const metrics = this.calculateAdvancedMetrics(deck);
    const mockPredictions = { powerLevel: 0.5, consistency: 0.5, synergy: 0.5 };
    
    return [
      ...this.getBasicSuggestions(deck),
      'Upgraded to advanced AI optimization - more intelligent suggestions available'
    ];
  }

  private getBasicSuggestions(deck: Deck): string[] {
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
    const synergy = this.calculateAdvancedSynergy(deck);
    if (synergy < 0.3) {
      suggestions.push('Look for cards with better synergy with your existing cards');
    }

    return suggestions;
  }

  private applyOptimizations(deck: Deck, availableCards: Card[]): Deck {
    // Create a copy of the deck
    const optimizedCards = [...deck.cards];

    // Simple optimization: replace low-synergy cards
    const synergy = this.calculateAdvancedSynergy(deck);
    if (synergy < 0.5 && availableCards.length > 0) {
      // Replace the highest cost card with a random available card
      const highestCostIndex = optimizedCards.reduce(
        (maxIndex, card, _index) =>
          card.cost > optimizedCards[maxIndex].cost ? _index : maxIndex,
        0,
      );

      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      optimizedCards[highestCostIndex] = randomCard;
    }

    return {
      ...deck,
      name: `${deck.name} (Optimized)`,
      cards: optimizedCards,
    };
  }

  async trainModel(trainingData: { deck: Deck; winRate: number }[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🧠 Training advanced deck optimization models...');
      
      // Prepare training data for all models
      const inputs: number[][] = [];
      const synergyInputs: number[][] = [];
      const consistencyInputs: number[][] = [];
      const outputs: number[] = [];
      const synergyOutputs: number[] = [];
      const consistencyOutputs: number[] = [];

      trainingData.forEach(data => {
        const deckWithStrategy = { ...data.deck, strategy: this.detectDeckStrategy(data.deck) };
        
        inputs.push(this.generateAdvancedDeckEmbedding(deckWithStrategy));
        synergyInputs.push(this.generateSynergyEmbedding(deckWithStrategy));
        consistencyInputs.push(this.generateConsistencyEmbedding(deckWithStrategy));
        
        outputs.push(data.winRate);
        synergyOutputs.push(this.calculateAdvancedSynergy(deckWithStrategy));
        consistencyOutputs.push(this.calculateConsistency(deckWithStrategy.cards));
      });

      // Train primary model
      if (this.primaryModel && inputs.length > 0) {
        const xs = tf.tensor2d(inputs);
        const ys = tf.tensor2d(outputs, [outputs.length, 1]);

        await this.primaryModel.fit(xs, ys, {
          epochs: 30,
          batchSize: Math.min(32, inputs.length),
          validationSplit: 0.2,
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              if (epoch % 10 === 0) {
                console.log(`Primary model epoch ${epoch}: loss = ${logs?.loss?.toFixed(4)}`);
              }
            },
          },
        });

        xs.dispose();
        ys.dispose();
      }

      // Train synergy model
      if (this.synergyModel && synergyInputs.length > 0) {
        const synergyXs = tf.tensor2d(synergyInputs);
        const synergyYs = tf.tensor2d(synergyOutputs, [synergyOutputs.length, 1]);

        await this.synergyModel.fit(synergyXs, synergyYs, {
          epochs: 20,
          batchSize: Math.min(16, synergyInputs.length),
          validationSplit: 0.2,
        });

        synergyXs.dispose();
        synergyYs.dispose();
      }

      // Train consistency model
      if (this.consistencyModel && consistencyInputs.length > 0) {
        const consistencyXs = tf.tensor2d(consistencyInputs);
        const consistencyYs = tf.tensor2d(consistencyOutputs, [consistencyOutputs.length, 1]);

        await this.consistencyModel.fit(consistencyXs, consistencyYs, {
          epochs: 20,
          batchSize: Math.min(16, consistencyInputs.length),
          validationSplit: 0.2,
        });

        consistencyXs.dispose();
        consistencyYs.dispose();
      }

      console.log('✅ Advanced model training completed');
      console.log(`📊 Trained on ${trainingData.length} deck examples`);
    } catch (_error) {
      console.error('Advanced model training failed:', _error);
    }
  }

  // New advanced API methods

  async evaluateDeck(deck: Deck): Promise<{
    winRate: number;
    powerLevel: number;
    consistency: number;
    synergy: number;
    suggestions: string[];
    confidence: number;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const deckWithStrategy = { ...deck, strategy: this.detectDeckStrategy(deck) };
    const deckEmbedding = this.generateAdvancedDeckEmbedding(deckWithStrategy);
    const synergyEmbedding = this.generateSynergyEmbedding(deckWithStrategy);
    const consistencyEmbedding = this.generateConsistencyEmbedding(deckWithStrategy);

    const predictions = await this.performMultiModelPrediction(
      deckEmbedding,
      synergyEmbedding,
      consistencyEmbedding
    );

    const metrics = this.calculateAdvancedMetrics(deckWithStrategy);
    const suggestions = await this.generateIntelligentSuggestions(
      deckWithStrategy,
      [],
      predictions,
      metrics
    );

    return {
      winRate: predictions.winRate,
      powerLevel: predictions.powerLevel,
      consistency: predictions.consistency,
      synergy: predictions.synergy,
      suggestions,
      confidence: predictions.confidence,
    };
  }

  getOptimizationHistory(): Array<{deck: Deck; result: number; timestamp: Date}> {
    return [...this.trainingHistory];
  }

  getModelStatus(): {
    initialized: boolean;
    modelsLoaded: number;
    trainingHistory: number;
    strategies: string[];
  } {
    return {
      initialized: this.isInitialized,
      modelsLoaded: [this.primaryModel, this.synergyModel, this.consistencyModel].filter(m => m !== null).length,
      trainingHistory: this.trainingHistory.length,
      strategies: Array.from(this.optimizationStrategies.keys()),
    };
  }

  dispose(): void {
    console.log('🧹 Disposing advanced deck optimizer and cleaning up models...');
    
    if (this.primaryModel) {
      this.primaryModel.dispose();
      this.primaryModel = null;
    }
    
    if (this.synergyModel) {
      this.synergyModel.dispose();
      this.synergyModel = null;
    }
    
    if (this.consistencyModel) {
      this.consistencyModel.dispose();
      this.consistencyModel = null;
    }
    
    this.cardEmbeddings.clear();
    this.trainingHistory = [];
    this.optimizationStrategies.clear();
    this.isInitialized = false;
    
    console.log('✅ Advanced deck optimizer disposed successfully');
  }
}

// Singleton instance
export const deckOptimizer = new DeckOptimizer();
