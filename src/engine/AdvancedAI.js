import * as tf from '@tensorflow/tfjs';

/**
 * Advanced AI System for KONIVRER
 * Handles sophisticated AI opponents, tutorials, and adaptive difficulty
 */
export class AdvancedAI {
  constructor(options = {}) {
    this.options = {
      difficulty: 'intermediate',
      personality: 'balanced',
      learningEnabled: true,
      tutorialMode: false,
      ...options
    };

    // AI Models
    this.models = {
      cardEvaluation: null,
      deckBuilding: null,
      gameStrategy: null,
      playerModeling: null
    };

    // AI Personalities
    this.personalities = {
      aggressive: {
        name: 'Aggressive',
        description: 'Focuses on dealing damage quickly',
        weights: { aggression: 0.9, control: 0.3, value: 0.5, risk: 0.8 }
      },
      control: {
        name: 'Control',
        description: 'Prefers to control the game and win late',
        weights: { aggression: 0.2, control: 0.9, value: 0.8, risk: 0.3 }
      },
      midrange: {
        name: 'Midrange',
        description: 'Balanced approach with good creatures',
        weights: { aggression: 0.6, control: 0.6, value: 0.7, risk: 0.5 }
      },
      combo: {
        name: 'Combo',
        description: 'Seeks powerful card combinations',
        weights: { aggression: 0.4, control: 0.5, value: 0.9, risk: 0.7 }
      },
      tempo: {
        name: 'Tempo',
        description: 'Efficient plays that maintain board presence',
        weights: { aggression: 0.7, control: 0.4, value: 0.6, risk: 0.6 }
      }
    };

    // Difficulty levels
    this.difficultyLevels = {
      beginner: {
        name: 'Beginner',
        thinkTime: 1000,
        mistakeRate: 0.3,
        lookahead: 1,
        cardKnowledge: 0.6
      },
      intermediate: {
        name: 'Intermediate',
        thinkTime: 2000,
        mistakeRate: 0.15,
        lookahead: 2,
        cardKnowledge: 0.8
      },
      advanced: {
        name: 'Advanced',
        thinkTime: 3000,
        mistakeRate: 0.05,
        lookahead: 3,
        cardKnowledge: 0.95
      },
      expert: {
        name: 'Expert',
        thinkTime: 4000,
        mistakeRate: 0.02,
        lookahead: 4,
        cardKnowledge: 1.0
      }
    };

    // Game state analysis
    this.gameAnalysis = {
      boardState: null,
      handAnalysis: null,
      threatAssessment: null,
      winConditions: null
    };

    // Learning system
    this.learning = {
      gameHistory: [],
      playerModel: null,
      adaptations: new Map(),
      performance: { wins: 0, losses: 0, draws: 0 }
    };

    // Tutorial system
    this.tutorial = {
      currentStep: 0,
      steps: [],
      hints: [],
      explanations: []
    };

    this.init();
  }

  async init() {
    try {
      await this.loadModels();
      this.initializePersonality();
      this.initializeDifficulty();
      
      if (this.options.tutorialMode) {
        this.initializeTutorial();
      }

      console.log('Advanced AI System initialized');
    } catch (error) {
      console.error('Failed to initialize AI system:', error);
    }
  }

  async loadModels() {
    try {
      // Load pre-trained models or create new ones
      this.models.cardEvaluation = await this.loadOrCreateCardEvaluationModel();
      this.models.deckBuilding = await this.loadOrCreateDeckBuildingModel();
      this.models.gameStrategy = await this.loadOrCreateGameStrategyModel();
      this.models.playerModeling = await this.loadOrCreatePlayerModelingModel();
    } catch (error) {
      console.warn('Using fallback AI models:', error);
      this.createFallbackModels();
    }
  }

  async loadOrCreateCardEvaluationModel() {
    try {
      // Try to load existing model
      return await tf.loadLayersModel('/models/card_evaluation.json');
    } catch {
      // Create new model
      return this.createCardEvaluationModel();
    }
  }

  createCardEvaluationModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }

  async loadOrCreateGameStrategyModel() {
    try {
      return await tf.loadLayersModel('/models/game_strategy.json');
    } catch {
      return this.createGameStrategyModel();
    }
  }

  createGameStrategyModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [50], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 10, activation: 'softmax' }) // 10 possible actions
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  initializePersonality() {
    const personality = this.personalities[this.options.personality] || this.personalities.balanced;
    this.currentPersonality = { ...personality };
  }

  initializeDifficulty() {
    const difficulty = this.difficultyLevels[this.options.difficulty] || this.difficultyLevels.intermediate;
    this.currentDifficulty = { ...difficulty };
  }

  /**
   * Main AI decision-making function
   */
  async makeDecision(gameState, availableActions) {
    const startTime = Date.now();

    try {
      // Analyze current game state
      await this.analyzeGameState(gameState);

      // Filter legal actions
      const legalActions = this.filterLegalActions(availableActions, gameState);

      if (legalActions.length === 0) {
        return { action: { type: 'pass' }, confidence: 1.0 };
      }

      // Evaluate each action
      const actionEvaluations = await this.evaluateActions(legalActions, gameState);

      // Select best action based on personality and difficulty
      const selectedAction = this.selectAction(actionEvaluations);

      // Add thinking time based on difficulty
      const thinkTime = this.calculateThinkTime(selectedAction);
      await this.simulateThinking(thinkTime);

      // Apply difficulty-based mistakes
      const finalAction = this.applyDifficultyMistakes(selectedAction, actionEvaluations);

      // Learn from this decision
      if (this.options.learningEnabled) {
        this.recordDecision(gameState, finalAction, actionEvaluations);
      }

      const confidence = this.calculateConfidence(finalAction, actionEvaluations);

      return {
        action: finalAction,
        confidence,
        reasoning: this.generateReasoning(finalAction, gameState),
        thinkTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('AI decision error:', error);
      return this.makeFallbackDecision(availableActions);
    }
  }

  async analyzeGameState(gameState) {
    this.gameAnalysis.boardState = this.analyzeBoardState(gameState);
    this.gameAnalysis.handAnalysis = this.analyzeHand(gameState);
    this.gameAnalysis.threatAssessment = this.assessThreats(gameState);
    this.gameAnalysis.winConditions = this.identifyWinConditions(gameState);
  }

  analyzeBoardState(gameState) {
    const { battlefield, players } = gameState;
    
    return {
      myCreatures: this.getMyCreatures(battlefield, gameState.aiPlayer),
      opponentCreatures: this.getOpponentCreatures(battlefield, gameState.aiPlayer),
      myBoardValue: this.calculateBoardValue(battlefield, gameState.aiPlayer),
      opponentBoardValue: this.calculateBoardValue(battlefield, 3 - gameState.aiPlayer),
      boardControl: this.calculateBoardControl(battlefield, gameState.aiPlayer),
      immediateThreats: this.identifyImmediateThreats(battlefield, gameState.aiPlayer)
    };
  }

  analyzeHand(gameState) {
    const hand = gameState.zones[gameState.aiPlayer].hand;
    
    return {
      cardCount: hand.length,
      playableCards: this.getPlayableCards(hand, gameState),
      cardTypes: this.categorizeCards(hand),
      manaCurve: this.calculateManaCurve(hand),
      threats: this.identifyThreatsInHand(hand),
      answers: this.identifyAnswersInHand(hand, gameState)
    };
  }

  assessThreats(gameState) {
    const threats = [];
    const opponentPlayer = 3 - gameState.aiPlayer;
    const opponentCreatures = this.getOpponentCreatures(gameState.battlefield, gameState.aiPlayer);

    // Immediate damage threats
    const immediateLethal = this.calculateImmediateDamage(opponentCreatures, gameState);
    if (immediateLethal >= gameState.players[gameState.aiPlayer].health) {
      threats.push({
        type: 'lethal',
        severity: 'critical',
        source: 'combat',
        damage: immediateLethal
      });
    }

    // Powerful creatures
    opponentCreatures.forEach(creature => {
      if (creature.power >= 4 || creature.hasKeywords(['flying', 'trample'])) {
        threats.push({
          type: 'creature',
          severity: this.calculateThreatSeverity(creature),
          source: creature,
          priority: this.calculateRemovalPriority(creature)
        });
      }
    });

    return threats.sort((a, b) => this.getThreatPriority(b) - this.getThreatPriority(a));
  }

  async evaluateActions(actions, gameState) {
    const evaluations = [];

    for (const action of actions) {
      const evaluation = await this.evaluateAction(action, gameState);
      evaluations.push({
        action,
        score: evaluation.score,
        reasoning: evaluation.reasoning,
        risks: evaluation.risks,
        benefits: evaluation.benefits
      });
    }

    return evaluations.sort((a, b) => b.score - a.score);
  }

  async evaluateAction(action, gameState) {
    const { type } = action;
    let score = 0;
    const reasoning = [];
    const risks = [];
    const benefits = [];

    switch (type) {
      case 'play_card':
        const cardEval = await this.evaluateCardPlay(action, gameState);
        score = cardEval.score;
        reasoning.push(...cardEval.reasoning);
        break;

      case 'attack':
        const attackEval = this.evaluateAttack(action, gameState);
        score = attackEval.score;
        reasoning.push(...attackEval.reasoning);
        break;

      case 'activate_ability':
        const abilityEval = this.evaluateAbilityActivation(action, gameState);
        score = abilityEval.score;
        reasoning.push(...abilityEval.reasoning);
        break;

      case 'pass':
        score = this.evaluatePass(gameState);
        reasoning.push('Passing priority to see opponent\'s actions');
        break;
    }

    // Apply personality modifiers
    score = this.applyPersonalityModifiers(score, action, gameState);

    // Apply situational modifiers
    score = this.applySituationalModifiers(score, action, gameState);

    return { score, reasoning, risks, benefits };
  }

  async evaluateCardPlay(action, gameState) {
    const { card } = action;
    let score = 0;
    const reasoning = [];

    // Base card value
    const cardValue = await this.getCardValue(card, gameState);
    score += cardValue * 10;
    reasoning.push(`Card base value: ${cardValue.toFixed(2)}`);

    // Tempo considerations
    const tempoValue = this.calculateTempoValue(card, gameState);
    score += tempoValue * 5;
    if (tempoValue > 0) {
      reasoning.push(`Positive tempo play: +${tempoValue.toFixed(2)}`);
    }

    // Synergy with board
    const synergyValue = this.calculateSynergyValue(card, gameState);
    score += synergyValue * 3;
    if (synergyValue > 0) {
      reasoning.push(`Synergy bonus: +${synergyValue.toFixed(2)}`);
    }

    // Threat response
    if (this.answersThreats(card, gameState)) {
      score += 15;
      reasoning.push('Answers immediate threats');
    }

    // Mana efficiency
    const manaEfficiency = this.calculateManaEfficiency(card, gameState);
    score += manaEfficiency * 2;

    return { score, reasoning };
  }

  async getCardValue(card, gameState) {
    if (this.models.cardEvaluation) {
      // Use neural network for card evaluation
      const features = this.extractCardFeatures(card, gameState);
      const prediction = this.models.cardEvaluation.predict(tf.tensor2d([features]));
      const value = await prediction.data();
      prediction.dispose();
      return value[0];
    } else {
      // Fallback heuristic evaluation
      return this.heuristicCardEvaluation(card, gameState);
    }
  }

  extractCardFeatures(card, gameState) {
    // Extract 20 features for the neural network
    return [
      card.cost || 0,
      card.power || 0,
      card.toughness || 0,
      card.type === 'creature' ? 1 : 0,
      card.type === 'spell' ? 1 : 0,
      card.rarity === 'common' ? 1 : 0,
      card.rarity === 'rare' ? 1 : 0,
      card.rarity === 'legendary' ? 1 : 0,
      card.abilities ? card.abilities.length : 0,
      this.hasKeyword(card, 'flying') ? 1 : 0,
      this.hasKeyword(card, 'trample') ? 1 : 0,
      this.hasKeyword(card, 'haste') ? 1 : 0,
      gameState.turn / 20, // Normalized turn number
      gameState.players[gameState.aiPlayer].health / 100, // Normalized health
      gameState.zones[gameState.aiPlayer].hand.length / 10, // Normalized hand size
      this.gameAnalysis.boardState?.myBoardValue || 0,
      this.gameAnalysis.boardState?.opponentBoardValue || 0,
      this.gameAnalysis.threatAssessment?.length || 0,
      gameState.players[gameState.aiPlayer].mana.current / 10, // Normalized mana
      Math.random() // Add some randomness
    ];
  }

  selectAction(actionEvaluations) {
    if (actionEvaluations.length === 0) {
      return { type: 'pass' };
    }

    // Apply personality-based selection
    const personality = this.currentPersonality;
    const difficulty = this.currentDifficulty;

    // For higher difficulties, always pick the best action
    if (difficulty.mistakeRate < 0.1) {
      return actionEvaluations[0].action;
    }

    // For lower difficulties, add some randomness
    const topActions = actionEvaluations.slice(0, Math.min(3, actionEvaluations.length));
    const weights = topActions.map((evaluation, index) => {
      return Math.exp(evaluation.score / 10) * Math.pow(0.8, index);
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < topActions.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return topActions[i].action;
      }
    }

    return topActions[0].action;
  }

  applyDifficultyMistakes(action, evaluations) {
    const difficulty = this.currentDifficulty;
    
    if (Math.random() < difficulty.mistakeRate) {
      // Make a suboptimal play
      const worseActions = evaluations.slice(1, Math.min(4, evaluations.length));
      if (worseActions.length > 0) {
        const randomIndex = Math.floor(Math.random() * worseActions.length);
        return worseActions[randomIndex].action;
      }
    }

    return action;
  }

  calculateThinkTime(action) {
    const baseTime = this.currentDifficulty.thinkTime;
    const complexity = this.getActionComplexity(action);
    return baseTime + (complexity * 500);
  }

  async simulateThinking(thinkTime) {
    // Add realistic thinking delay
    await new Promise(resolve => setTimeout(resolve, thinkTime));
  }

  /**
   * Tutorial System
   */
  initializeTutorial() {
    this.tutorial.steps = [
      {
        id: 'basic_play',
        title: 'Playing Your First Card',
        description: 'Learn how to play cards from your hand',
        objective: 'Play a creature card',
        hints: ['Click on a creature card in your hand', 'Make sure you have enough mana'],
        validation: (gameState) => gameState.zones[1].battlefield.length > 0
      },
      {
        id: 'combat_basics',
        title: 'Combat Basics',
        description: 'Learn how to attack with your creatures',
        objective: 'Attack with a creature',
        hints: ['Click on your creature to select it', 'Click the attack button'],
        validation: (gameState) => gameState.combatData?.attackers?.length > 0
      },
      {
        id: 'spell_casting',
        title: 'Casting Spells',
        description: 'Learn how to cast spell cards',
        objective: 'Cast a spell',
        hints: ['Select a spell from your hand', 'Choose targets if required'],
        validation: (gameState) => gameState.lastAction?.type === 'play_card' && gameState.lastAction.card.type === 'spell'
      }
    ];

    this.tutorial.currentStep = 0;
  }

  getTutorialGuidance(gameState) {
    if (!this.options.tutorialMode || this.tutorial.currentStep >= this.tutorial.steps.length) {
      return null;
    }

    const currentStep = this.tutorial.steps[this.tutorial.currentStep];
    
    // Check if current objective is completed
    if (currentStep.validation(gameState)) {
      this.tutorial.currentStep++;
      
      if (this.tutorial.currentStep < this.tutorial.steps.length) {
        const nextStep = this.tutorial.steps[this.tutorial.currentStep];
        return {
          type: 'step_completed',
          completedStep: currentStep,
          nextStep: nextStep,
          progress: this.tutorial.currentStep / this.tutorial.steps.length
        };
      } else {
        return {
          type: 'tutorial_completed',
          completedStep: currentStep
        };
      }
    }

    // Provide guidance for current step
    return {
      type: 'guidance',
      step: currentStep,
      hints: this.generateContextualHints(currentStep, gameState),
      progress: this.tutorial.currentStep / this.tutorial.steps.length
    };
  }

  generateContextualHints(step, gameState) {
    const hints = [...step.hints];
    
    // Add contextual hints based on game state
    switch (step.id) {
      case 'basic_play':
        const playableCreatures = this.getPlayableCreatures(gameState);
        if (playableCreatures.length === 0) {
          hints.push('You need more mana to play creatures. End your turn to get more mana.');
        } else {
          hints.push(`You can play: ${playableCreatures.map(c => c.name).join(', ')}`);
        }
        break;
        
      case 'combat_basics':
        const attackableCreatures = this.getAttackableCreatures(gameState);
        if (attackableCreatures.length === 0) {
          hints.push('You need creatures on the battlefield that can attack.');
        }
        break;
    }

    return hints;
  }

  /**
   * Learning and Adaptation
   */
  recordDecision(gameState, action, evaluations) {
    this.learning.gameHistory.push({
      gameState: this.serializeGameState(gameState),
      action,
      evaluations,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.learning.gameHistory.length > 1000) {
      this.learning.gameHistory.shift();
    }
  }

  async adaptToPlayer(playerActions, gameResults) {
    if (!this.options.learningEnabled) return;

    // Analyze player patterns
    const playerPatterns = this.analyzePlayerPatterns(playerActions);
    
    // Update player model
    await this.updatePlayerModel(playerPatterns);
    
    // Adjust AI strategy
    this.adaptStrategy(playerPatterns, gameResults);
  }

  analyzePlayerPatterns(actions) {
    const patterns = {
      aggression: 0,
      control: 0,
      riskTaking: 0,
      cardPreferences: new Map(),
      timingPatterns: []
    };

    actions.forEach(action => {
      // Analyze aggression
      if (action.type === 'attack') {
        patterns.aggression += 1;
      }

      // Analyze control tendencies
      if (action.type === 'play_card' && action.card.type === 'spell') {
        patterns.control += 1;
      }

      // Track card preferences
      if (action.type === 'play_card') {
        const cardType = action.card.type;
        patterns.cardPreferences.set(cardType, 
          (patterns.cardPreferences.get(cardType) || 0) + 1);
      }
    });

    return patterns;
  }

  adaptStrategy(playerPatterns, gameResults) {
    // Adjust personality weights based on player patterns
    if (playerPatterns.aggression > 0.7) {
      // Player is aggressive, become more defensive
      this.currentPersonality.weights.control += 0.1;
      this.currentPersonality.weights.aggression -= 0.1;
    } else if (playerPatterns.control > 0.7) {
      // Player is controlling, become more aggressive
      this.currentPersonality.weights.aggression += 0.1;
      this.currentPersonality.weights.control -= 0.1;
    }

    // Clamp values
    Object.keys(this.currentPersonality.weights).forEach(key => {
      this.currentPersonality.weights[key] = Math.max(0.1, 
        Math.min(1.0, this.currentPersonality.weights[key]));
    });
  }

  /**
   * Utility Methods
   */
  heuristicCardEvaluation(card, gameState) {
    let value = 0;

    // Base stats value
    if (card.type === 'creature') {
      value += (card.power || 0) * 0.3;
      value += (card.toughness || 0) * 0.2;
    }

    // Mana cost efficiency
    const cost = card.cost || 1;
    value += Math.max(0, 5 - cost) * 0.1;

    // Rarity bonus
    const rarityBonus = {
      common: 0,
      uncommon: 0.1,
      rare: 0.3,
      legendary: 0.5,
      mythic: 0.7
    };
    value += rarityBonus[card.rarity] || 0;

    // Abilities bonus
    if (card.abilities) {
      value += card.abilities.length * 0.2;
    }

    return Math.max(0, Math.min(1, value));
  }

  generateReasoning(action, gameState) {
    const reasoning = [];
    
    switch (action.type) {
      case 'play_card':
        reasoning.push(`Playing ${action.card.name} for board presence`);
        break;
      case 'attack':
        reasoning.push(`Attacking to pressure opponent`);
        break;
      case 'pass':
        reasoning.push(`Passing to see opponent's response`);
        break;
    }

    return reasoning.join('. ');
  }

  calculateConfidence(action, evaluations) {
    if (evaluations.length === 0) return 0.5;
    
    const bestScore = evaluations[0].score;
    const selectedEval = evaluations.find(e => e.action === action);
    
    if (!selectedEval) return 0.5;
    
    return Math.min(1.0, selectedEval.score / Math.max(1, bestScore));
  }

  // Public API
  setDifficulty(difficulty) {
    this.options.difficulty = difficulty;
    this.initializeDifficulty();
  }

  setPersonality(personality) {
    this.options.personality = personality;
    this.initializePersonality();
  }

  enableTutorialMode() {
    this.options.tutorialMode = true;
    this.initializeTutorial();
  }

  disableTutorialMode() {
    this.options.tutorialMode = false;
  }

  getAIStats() {
    return {
      difficulty: this.options.difficulty,
      personality: this.options.personality,
      performance: this.learning.performance,
      gamesPlayed: this.learning.gameHistory.length
    };
  }

  reset() {
    this.learning.gameHistory = [];
    this.learning.performance = { wins: 0, losses: 0, draws: 0 };
    this.tutorial.currentStep = 0;
    this.initializePersonality();
    this.initializeDifficulty();
  }
}

export default AdvancedAI;