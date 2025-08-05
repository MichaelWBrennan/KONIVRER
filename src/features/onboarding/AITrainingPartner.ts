import * as tf from '@tensorflow/tfjs';
import { Card, Deck } from '../../ai/DeckOptimizer';

export interface TrainingSession {
  id: string;
  playerId: string;
  aiDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  archetype: string;
  startTime: Date;
  endTime?: Date;
  moves: GameMove[];
  result: 'win' | 'loss' | 'draw' | 'ongoing';
  performanceMetrics: PerformanceMetrics;
}

export interface GameMove {
  playerId: string;
  action: 'play-card' | 'attack' | 'end-turn' | 'activate-ability';
  cardId?: string;
  targetId?: string;
  timestamp: number;
  gameState: any; // Simplified game state snapshot
}

export interface PerformanceMetrics {
  averageDecisionTime: number;
  optimalPlayPercentage: number;
  mistakeCount: number;
  strategicAccuracy: number;
  improvementSuggestions: string[];
}

export interface AIPersonality {
  id: string;
  name: string;
  playStyle: 'aggressive' | 'defensive' | 'balanced' | 'reactive';
  riskTolerance: number; // 0-1, low to high risk
  preferredArchetypes: string[];
  adaptationRate: number; // How quickly AI adapts to player
}

export class AITrainingPartner {
  private model: tf.LayersModel | null = null;
  private gameHistory: TrainingSession[] = [];
  private aiPersonalities: Map<string, AIPersonality> = new Map();
  private playerProfiles: Map<string, PlayerProfile> = new Map();

  constructor() {
    this.initializeAIPersonalities();
    this.initializeModel();
  }

  private initializeAIPersonalities(): void {
    const personalities: AIPersonality[] = [
      {
        id: 'rusher',
        name: 'Storm Rusher',
        playStyle: 'aggressive',
        riskTolerance: 0.8,
        preferredArchetypes: ['aggro', 'burn'],
        adaptationRate: 0.3
      },
      {
        id: 'guardian',
        name: 'Mystic Guardian',
        playStyle: 'defensive',
        riskTolerance: 0.2,
        preferredArchetypes: ['control', 'midrange'],
        adaptationRate: 0.5
      },
      {
        id: 'tactician',
        name: 'Shadow Tactician',
        playStyle: 'balanced',
        riskTolerance: 0.5,
        preferredArchetypes: ['midrange', 'combo'],
        adaptationRate: 0.7
      },
      {
        id: 'reactor',
        name: 'Void Reactor',
        playStyle: 'reactive',
        riskTolerance: 0.4,
        preferredArchetypes: ['control', 'combo'],
        adaptationRate: 0.9
      }
    ];

    personalities.forEach(personality => {
      this.aiPersonalities.set(personality.id, personality);
    });
  }

  private async initializeModel(): Promise<void> {
    try {
      // Create neural network for move evaluation and player modeling
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [200], // Game state + player profile features
            units: 512,
            activation: 'relu'
          }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 256, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 128, activation: 'relu' }),
          tf.layers.dense({ units: 64, activation: 'relu' }),
          tf.layers.dense({ 
            units: 10, // Move quality scores for different action types
            activation: 'softmax' 
          })
        ]
      });

      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      console.log('AI Training Partner model initialized');
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
    }
  }

  async startTrainingSession(
    playerId: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive',
    archetype?: string
  ): Promise<TrainingSession> {
    const playerProfile = this.getOrCreatePlayerProfile(playerId);
    
    // Select appropriate AI personality based on difficulty and player profile
    const aiPersonality = this.selectAIPersonality(difficulty, playerProfile, archetype);
    
    const session: TrainingSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      aiDifficulty: difficulty,
      archetype: archetype || 'balanced',
      startTime: new Date(),
      moves: [],
      result: 'ongoing',
      performanceMetrics: {
        averageDecisionTime: 0,
        optimalPlayPercentage: 0,
        mistakeCount: 0,
        strategicAccuracy: 0,
        improvementSuggestions: []
      }
    };

    this.gameHistory.push(session);
    return session;
  }

  private getOrCreatePlayerProfile(playerId: string): PlayerProfile {
    if (!this.playerProfiles.has(playerId)) {
      const newProfile: PlayerProfile = {
        playerId,
        skillLevel: 'beginner',
        preferredArchetypes: [],
        weaknesses: [],
        strengths: [],
        improvementAreas: [],
        gamesPlayed: 0,
        winRate: 0,
        averageGameLength: 0,
        commonMistakes: []
      };
      this.playerProfiles.set(playerId, newProfile);
    }
    return this.playerProfiles.get(playerId)!;
  }

  private selectAIPersonality(
    difficulty: string,
    playerProfile: PlayerProfile,
    archetype?: string
  ): AIPersonality {
    const personalities = Array.from(this.aiPersonalities.values());
    
    if (difficulty === 'adaptive') {
      // Select personality that challenges player's weaknesses
      const adaptive = personalities.find(p => 
        p.adaptationRate > 0.6 && 
        (archetype ? p.preferredArchetypes.includes(archetype) : true)
      );
      return adaptive || personalities[0];
    }
    
    // Filter by difficulty
    const suitablePersonalities = personalities.filter(p => {
      switch (difficulty) {
        case 'beginner':
          return p.riskTolerance < 0.5;
        case 'intermediate':
          return p.riskTolerance >= 0.4 && p.riskTolerance <= 0.7;
        case 'advanced':
          return p.riskTolerance > 0.6;
        default:
          return true;
      }
    });

    return suitablePersonalities[0] || personalities[0];
  }

  async makeAIMove(
    sessionId: string,
    gameState: any,
    availableMoves: any[]
  ): Promise<any> {
    const session = this.gameHistory.find(s => s.id === sessionId);
    if (!session || !this.model) {
      return this.makeRandomMove(availableMoves);
    }

    try {
      const playerProfile = this.getOrCreatePlayerProfile(session.playerId);
      const features = this.extractFeatures(gameState, playerProfile, session);
      
      const prediction = this.model.predict(tf.tensor2d([features])) as tf.Tensor;
      const moveScores = await prediction.data();
      
      // Select move based on AI personality and predicted scores
      const selectedMove = this.selectMoveBasedOnPersonality(
        availableMoves,
        Array.from(moveScores),
        session.aiDifficulty
      );

      // Record the AI move
      this.recordMove(sessionId, {
        playerId: 'ai',
        action: selectedMove.action,
        cardId: selectedMove.cardId,
        targetId: selectedMove.targetId,
        timestamp: Date.now(),
        gameState: this.simplifyGameState(gameState)
      });

      prediction.dispose();
      return selectedMove;
    } catch (error) {
      console.error('AI move generation failed:', error);
      return this.makeRandomMove(availableMoves);
    }
  }

  private extractFeatures(
    gameState: any,
    playerProfile: PlayerProfile,
    session: TrainingSession
  ): number[] {
    const features = new Array(200).fill(0);
    
    // Game state features (first 100)
    features[0] = gameState.currentTurn || 0;
    features[1] = gameState.playerHealth || 20;
    features[2] = gameState.aiHealth || 20;
    features[3] = gameState.playerMana || 0;
    features[4] = gameState.aiMana || 0;
    features[5] = gameState.playerCardsInHand || 0;
    features[6] = gameState.aiCardsInHand || 0;
    features[7] = gameState.boardSize || 0;
    
    // Player profile features (next 50)
    features[100] = playerProfile.gamesPlayed / 100; // Normalized
    features[101] = playerProfile.winRate;
    features[102] = playerProfile.averageGameLength / 20; // Normalized
    features[103] = playerProfile.skillLevel === 'beginner' ? 1 : 0;
    features[104] = playerProfile.skillLevel === 'intermediate' ? 1 : 0;
    features[105] = playerProfile.skillLevel === 'advanced' ? 1 : 0;
    
    // Session context features (next 50)
    features[150] = session.moves.length / 50; // Normalized move count
    features[151] = session.aiDifficulty === 'beginner' ? 1 : 0;
    features[152] = session.aiDifficulty === 'intermediate' ? 1 : 0;
    features[153] = session.aiDifficulty === 'advanced' ? 1 : 0;
    features[154] = session.aiDifficulty === 'adaptive' ? 1 : 0;
    
    // Fill remaining features with game-specific data
    return features;
  }

  private selectMoveBasedOnPersonality(
    availableMoves: any[],
    moveScores: number[],
    difficulty: string
  ): any {
    if (availableMoves.length === 0) {
      return { action: 'end-turn' };
    }

    // Add some randomness for lower difficulties
    const randomnessFactor = difficulty === 'beginner' ? 0.3 : 
                             difficulty === 'intermediate' ? 0.15 : 0.05;

    const scoredMoves = availableMoves.map((move, index) => ({
      move,
      score: moveScores[index % moveScores.length] + Math.random() * randomnessFactor
    }));

    scoredMoves.sort((a, b) => b.score - a.score);
    return scoredMoves[0].move;
  }

  private makeRandomMove(availableMoves: any[]): any {
    if (availableMoves.length === 0) {
      return { action: 'end-turn' };
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  recordMove(sessionId: string, move: GameMove): void {
    const session = this.gameHistory.find(s => s.id === sessionId);
    if (session) {
      session.moves.push(move);
    }
  }

  async endTrainingSession(
    sessionId: string,
    result: 'win' | 'loss' | 'draw'
  ): Promise<PerformanceMetrics> {
    const session = this.gameHistory.find(s => s.id === sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.endTime = new Date();
    session.result = result;

    // Calculate performance metrics
    const metrics = await this.calculatePerformanceMetrics(session);
    session.performanceMetrics = metrics;

    // Update player profile
    this.updatePlayerProfile(session);

    // Train model with session data
    if (session.moves.length > 10) {
      this.trainModelWithSession(session);
    }

    return metrics;
  }

  private async calculatePerformanceMetrics(session: TrainingSession): Promise<PerformanceMetrics> {
    const playerMoves = session.moves.filter(m => m.playerId !== 'ai');
    
    const averageDecisionTime = playerMoves.length > 0 
      ? playerMoves.reduce((sum, move, index) => {
          if (index === 0) return 0;
          return sum + (move.timestamp - session.moves[index - 1].timestamp);
        }, 0) / (playerMoves.length - 1)
      : 0;

    // Analyze move quality (simplified)
    const optimalMoves = playerMoves.filter(this.isOptimalMove).length;
    const optimalPlayPercentage = playerMoves.length > 0 
      ? optimalMoves / playerMoves.length 
      : 0;

    const mistakeCount = this.countMistakes(playerMoves);
    const strategicAccuracy = this.calculateStrategicAccuracy(session);
    const improvementSuggestions = this.generateImprovementSuggestions(session);

    return {
      averageDecisionTime,
      optimalPlayPercentage,
      mistakeCount,
      strategicAccuracy,
      improvementSuggestions
    };
  }

  private isOptimalMove(move: GameMove): boolean {
    // Simplified optimal move detection
    // In a real implementation, this would use game-specific logic
    return Math.random() > 0.3; // Placeholder
  }

  private countMistakes(moves: GameMove[]): number {
    // Simplified mistake counting
    return moves.filter(move => !this.isOptimalMove(move)).length;
  }

  private calculateStrategicAccuracy(session: TrainingSession): number {
    // Analyze if player's moves align with their archetype strategy
    const playerMoves = session.moves.filter(m => m.playerId !== 'ai');
    if (playerMoves.length === 0) return 0;

    // Simplified strategic accuracy calculation
    const strategicMoves = playerMoves.filter(move => 
      this.isStrategicallySound(move, session.archetype)
    ).length;

    return strategicMoves / playerMoves.length;
  }

  private isStrategicallySound(move: GameMove, archetype: string): boolean {
    // Simplified strategic soundness check
    // Would check if move aligns with archetype strategy
    return Math.random() > 0.25; // Placeholder
  }

  private generateImprovementSuggestions(session: TrainingSession): string[] {
    const suggestions: string[] = [];
    const metrics = session.performanceMetrics;

    if (metrics.averageDecisionTime > 30000) { // 30 seconds
      suggestions.push('Try to make decisions more quickly. Overthinking can lead to missed opportunities.');
    }

    if (metrics.optimalPlayPercentage < 0.6) {
      suggestions.push('Focus on making more optimal plays. Consider all available options before acting.');
    }

    if (metrics.mistakeCount > 5) {
      suggestions.push('Review your moves to identify common mistakes and avoid them in future games.');
    }

    if (metrics.strategicAccuracy < 0.5) {
      suggestions.push(`Improve your understanding of ${session.archetype} strategy. Consider reviewing archetype guides.`);
    }

    return suggestions;
  }

  private updatePlayerProfile(session: TrainingSession): void {
    const profile = this.getOrCreatePlayerProfile(session.playerId);
    
    profile.gamesPlayed++;
    
    // Update win rate
    const wins = session.result === 'win' ? 1 : 0;
    profile.winRate = (profile.winRate * (profile.gamesPlayed - 1) + wins) / profile.gamesPlayed;
    
    // Update average game length
    const gameLength = session.endTime && session.startTime 
      ? (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60 // minutes
      : 0;
    profile.averageGameLength = (profile.averageGameLength * (profile.gamesPlayed - 1) + gameLength) / profile.gamesPlayed;

    // Update skill level based on performance
    this.updateSkillLevel(profile, session);
  }

  private updateSkillLevel(profile: PlayerProfile, session: TrainingSession): void {
    const metrics = session.performanceMetrics;
    const overallScore = (
      metrics.optimalPlayPercentage * 0.4 +
      metrics.strategicAccuracy * 0.4 +
      (1 - metrics.mistakeCount / Math.max(session.moves.length, 1)) * 0.2
    );

    if (overallScore > 0.8 && profile.winRate > 0.7) {
      profile.skillLevel = 'advanced';
    } else if (overallScore > 0.6 && profile.winRate > 0.5) {
      profile.skillLevel = 'intermediate';
    } else {
      profile.skillLevel = 'beginner';
    }
  }

  private async trainModelWithSession(session: TrainingSession): Promise<void> {
    if (!this.model) return;

    try {
      // Prepare training data from session moves
      const inputs: number[][] = [];
      const outputs: number[][] = [];

      session.moves.forEach(move => {
        if (move.playerId !== 'ai') {
          const features = this.extractFeaturesFromMove(move, session);
          const target = this.createTargetVector(move);
          inputs.push(features);
          outputs.push(target);
        }
      });

      if (inputs.length > 0) {
        const xs = tf.tensor2d(inputs);
        const ys = tf.tensor2d(outputs);

        await this.model.fit(xs, ys, {
          epochs: 5,
          batchSize: Math.min(32, inputs.length),
          verbose: 0
        });

        xs.dispose();
        ys.dispose();
      }
    } catch (error) {
      console.error('Model training failed:', error);
    }
  }

  private extractFeaturesFromMove(move: GameMove, session: TrainingSession): number[] {
    const playerProfile = this.getOrCreatePlayerProfile(session.playerId);
    return this.extractFeatures(move.gameState, playerProfile, session);
  }

  private createTargetVector(move: GameMove): number[] {
    const target = new Array(10).fill(0);
    
    // Map action types to target indices
    const actionMap: { [key: string]: number } = {
      'play-card': 0,
      'attack': 1,
      'end-turn': 2,
      'activate-ability': 3
    };

    const actionIndex = actionMap[move.action] || 9; // Default to last index
    target[actionIndex] = 1;

    return target;
  }

  private simplifyGameState(gameState: any): any {
    // Simplify game state for storage
    return {
      turn: gameState.currentTurn,
      playerHealth: gameState.playerHealth,
      aiHealth: gameState.aiHealth,
      boardSize: gameState.boardSize
    };
  }

  getPlayerProgress(playerId: string): PlayerProfile | null {
    return this.playerProfiles.get(playerId) || null;
  }

  getTrainingHistory(playerId: string): TrainingSession[] {
    return this.gameHistory.filter(session => session.playerId === playerId);
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

interface PlayerProfile {
  playerId: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredArchetypes: string[];
  weaknesses: string[];
  strengths: string[];
  improvementAreas: string[];
  gamesPlayed: number;
  winRate: number;
  averageGameLength: number;
  commonMistakes: string[];
}

export const aiTrainingPartner = new AITrainingPartner();