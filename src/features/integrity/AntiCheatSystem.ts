import { GameMove } from '../onboarding/AITrainingPartner';
import { GameReplay } from '../onboarding/ReplaySystem';

export interface CheatDetectionResult {
  playerId: string;
  matchId: string;
  detectionTime: Date;
  cheats: DetectedCheat[];
  confidence: number; // 0-1, higher means more confident
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: Evidence[];
  recommendedAction: RecommendedAction;
}

export interface DetectedCheat {
  type: CheatType;
  description: string;
  timestamp: number;
  gameStateWhenDetected: any;
  analysisData: CheatAnalysisData;
  falsePositiveProbability: number;
}

export type CheatType = 
  | 'impossible-move'
  | 'timing-anomaly'
  | 'card-knowledge'
  | 'perfect-play'
  | 'automation'
  | 'memory-manipulation'
  | 'network-manipulation'
  | 'replay-desync'
  | 'statistical-anomaly';

export interface CheatAnalysisData {
  moveTiming: number[];
  decisionAccuracy: number;
  inhuman_patterns: boolean;
  suspiciousSequences: string[];
  statisticalDeviations: StatisticalDeviation[];
}

export interface StatisticalDeviation {
  metric: string;
  expectedValue: number;
  actualValue: number;
  standardDeviations: number;
  significance: number;
}

export interface Evidence {
  type: 'behavioral' | 'technical' | 'statistical' | 'timing' | 'replay';
  data: any;
  weight: number; // 0-1, importance of this evidence
  description: string;
  collectedAt: Date;
}

export interface RecommendedAction {
  type: 'none' | 'warning' | 'temporary-ban' | 'permanent-ban' | 'investigation';
  duration?: number; // in hours for temporary actions
  reason: string;
  confidence: number;
  reviewRequired: boolean;
}

export interface ReplayValidation {
  replayId: string;
  isValid: boolean;
  issues: ValidationIssue[];
  hashMatches: boolean;
  stateConsistency: boolean;
  timingConsistency: boolean;
  validationTimestamp: Date;
}

export interface ValidationIssue {
  type: 'hash-mismatch' | 'state-inconsistency' | 'impossible-transition' | 'timing-violation';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  affectedTurns: number[];
  evidence: any;
}

export interface PlayerBehaviorProfile {
  playerId: string;
  gamesAnalyzed: number;
  averageDecisionTime: number;
  decisionTimeVariance: number;
  playPatterns: PlayPattern[];
  suspicionFlags: SuspicionFlag[];
  riskScore: number; // 0-100, higher = more suspicious
  lastUpdated: Date;
}

export interface PlayPattern {
  pattern: string;
  frequency: number;
  deviation: number;
  context: string;
}

export interface SuspicionFlag {
  type: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface TournamentSecurity {
  tournamentId: string;
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  lockedRules: GameRule[];
  enforcedRestrictions: SecurityRestriction[];
  monitoring: MonitoringSettings;
  participants: TournamentParticipant[];
}

export interface GameRule {
  id: string;
  name: string;
  description: string;
  enforced: boolean;
  parameters: { [key: string]: any };
}

export interface SecurityRestriction {
  type: 'deck-validation' | 'move-validation' | 'timing-enforcement' | 'communication-control';
  enabled: boolean;
  parameters: { [key: string]: any };
}

export interface MonitoringSettings {
  replayRecording: boolean;
  behaviorAnalysis: boolean;
  realTimeValidation: boolean;
  audienceMode: boolean;
  adminOverrides: boolean;
}

export interface TournamentParticipant {
  playerId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  securityClearance: 'basic' | 'standard' | 'enhanced';
  monitoringLevel: number;
  restrictions: string[];
}

export class AntiCheatSystem {
  private playerProfiles: Map<string, PlayerBehaviorProfile> = new Map();
  private detectionResults: Map<string, CheatDetectionResult[]> = new Map();
  private tournaments: Map<string, TournamentSecurity> = new Map();
  private validationCache: Map<string, ReplayValidation> = new Map();
  
  // Machine learning models (simplified representation)
  private behaviorModel: any = null;
  private timingModel: any = null;
  private moveValidationModel: any = null;

  constructor() {
    this.initializeModels();
  }

  private async initializeModels(): Promise<void> {
    // Initialize ML models for cheat detection
    // In a real implementation, these would be pre-trained models
    this.behaviorModel = {
      predict: (features: number[]) => {
        // Simplified prediction - detect patterns that deviate too much from normal
        const avgFeature = features.reduce((sum, f) => sum + f, 0) / features.length;
        return avgFeature > 0.8 ? 0.9 : Math.random() * 0.3; // High score = suspicious
      }
    };

    this.timingModel = {
      analyze: (timings: number[]) => {
        if (timings.length < 2) return { suspicious: false, score: 0 };
        
        const variance = this.calculateVariance(timings);
        const avgTiming = timings.reduce((sum, t) => sum + t, 0) / timings.length;
        
        // Too consistent timing might indicate automation
        const suspiciouslyConsistent = variance < 100 && avgTiming < 2000; // < 2 seconds consistently
        // Too fast might indicate cheating
        const suspiciouslyFast = avgTiming < 500; // < 0.5 seconds average
        
        return {
          suspicious: suspiciouslyConsistent || suspiciouslyFast,
          score: suspiciouslyConsistent ? 0.8 : suspiciouslyFast ? 0.9 : variance / 10000
        };
      }
    };

    this.moveValidationModel = {
      validateMove: (move: GameMove, gameState: any, playerKnowledge: any) => {
        // Check if move is possible given game state and player knowledge
        const issues: string[] = [];
        
        // Check if player has the card they're trying to play
        if (move.action === 'play-card' && move.cardId) {
          if (!playerKnowledge.hand.includes(move.cardId)) {
            issues.push('Attempted to play card not in hand');
          }
        }
        
        // Check if move violates game rules
        if (move.action === 'attack' && gameState.phase !== 'combat') {
          issues.push('Attempted to attack outside combat phase');
        }
        
        return {
          valid: issues.length === 0,
          issues,
          confidence: issues.length === 0 ? 1.0 : 0.0
        };
      }
    };
  }

  private calculateVariance(numbers: number[]): number {
    const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - avg, 2));
    return squaredDiffs.reduce((sum, sq) => sum + sq, 0) / numbers.length;
  }

  async analyzeMatch(
    playerId: string,
    matchId: string,
    moves: GameMove[],
    gameStates: any[],
    replay?: GameReplay
  ): Promise<CheatDetectionResult> {
    const profile = this.getOrCreatePlayerProfile(playerId);
    const detectedCheats: DetectedCheat[] = [];
    const evidence: Evidence[] = [];

    // Analyze move timing
    const timingAnalysis = await this.analyzeMoveTiming(moves, profile);
    if (timingAnalysis.suspicious) {
      detectedCheats.push({
        type: 'timing-anomaly',
        description: 'Suspicious move timing patterns detected',
        timestamp: Date.now(),
        gameStateWhenDetected: gameStates[0],
        analysisData: {
          moveTiming: timingAnalysis.timings,
          decisionAccuracy: 0,
          inhuman_patterns: true,
          suspiciousSequences: ['consistent-fast-moves'],
          statisticalDeviations: [{
            metric: 'move-timing-variance',
            expectedValue: profile.decisionTimeVariance,
            actualValue: timingAnalysis.variance,
            standardDeviations: timingAnalysis.deviationScore,
            significance: timingAnalysis.score
          }]
        },
        falsePositiveProbability: 0.1
      });

      evidence.push({
        type: 'timing',
        data: timingAnalysis,
        weight: 0.7,
        description: 'Move timing analysis shows inhuman consistency',
        collectedAt: new Date()
      });
    }

    // Analyze move quality and patterns
    const moveQualityAnalysis = await this.analyzeMoveQuality(moves, gameStates);
    if (moveQualityAnalysis.suspiciouslyPerfect) {
      detectedCheats.push({
        type: 'perfect-play',
        description: 'Impossibly perfect play detected',
        timestamp: Date.now(),
        gameStateWhenDetected: gameStates[0],
        analysisData: {
          moveTiming: [],
          decisionAccuracy: moveQualityAnalysis.accuracy,
          inhuman_patterns: true,
          suspiciousSequences: moveQualityAnalysis.perfectSequences,
          statisticalDeviations: [{
            metric: 'move-accuracy',
            expectedValue: 0.7, // Expected human accuracy
            actualValue: moveQualityAnalysis.accuracy,
            standardDeviations: (moveQualityAnalysis.accuracy - 0.7) / 0.15,
            significance: 0.8
          }]
        },
        falsePositiveProbability: 0.05
      });

      evidence.push({
        type: 'behavioral',
        data: moveQualityAnalysis,
        weight: 0.8,
        description: 'Move quality analysis indicates non-human play',
        collectedAt: new Date()
      });
    }

    // Analyze for impossible moves
    const impossibleMoves = await this.detectImpossibleMoves(moves, gameStates);
    impossibleMoves.forEach(impossibleMove => {
      detectedCheats.push({
        type: 'impossible-move',
        description: `Impossible move detected: ${impossibleMove.description}`,
        timestamp: impossibleMove.timestamp,
        gameStateWhenDetected: impossibleMove.gameState,
        analysisData: {
          moveTiming: [],
          decisionAccuracy: 0,
          inhuman_patterns: true,
          suspiciousSequences: [impossibleMove.moveSequence],
          statisticalDeviations: []
        },
        falsePositiveProbability: 0.01 // Very low - impossible moves are clear cheats
      });

      evidence.push({
        type: 'technical',
        data: impossibleMove,
        weight: 1.0, // Maximum weight for impossible moves
        description: 'Detected move that violates game rules',
        collectedAt: new Date()
      });
    });

    // Validate replay if provided
    if (replay) {
      const replayValidation = await this.validateReplay(replay);
      if (!replayValidation.isValid) {
        detectedCheats.push({
          type: 'replay-desync',
          description: 'Replay validation failed',
          timestamp: Date.now(),
          gameStateWhenDetected: {},
          analysisData: {
            moveTiming: [],
            decisionAccuracy: 0,
            inhuman_patterns: false,
            suspiciousSequences: [],
            statisticalDeviations: []
          },
          falsePositiveProbability: 0.05
        });

        evidence.push({
          type: 'replay',
          data: replayValidation,
          weight: 0.9,
          description: 'Replay integrity check failed',
          collectedAt: new Date()
        });
      }
    }

    // Calculate overall confidence and severity
    const confidence = this.calculateOverallConfidence(detectedCheats, evidence);
    const severity = this.determineSeverity(detectedCheats, confidence);
    const recommendedAction = this.determineRecommendedAction(detectedCheats, confidence, profile);

    const result: CheatDetectionResult = {
      playerId,
      matchId,
      detectionTime: new Date(),
      cheats: detectedCheats,
      confidence,
      severity,
      evidence,
      recommendedAction
    };

    // Store result and update player profile
    this.storeDetectionResult(playerId, result);
    this.updatePlayerProfile(playerId, moves, detectedCheats);

    return result;
  }

  private getOrCreatePlayerProfile(playerId: string): PlayerBehaviorProfile {
    if (!this.playerProfiles.has(playerId)) {
      const newProfile: PlayerBehaviorProfile = {
        playerId,
        gamesAnalyzed: 0,
        averageDecisionTime: 5000, // 5 seconds default
        decisionTimeVariance: 2000,
        playPatterns: [],
        suspicionFlags: [],
        riskScore: 0,
        lastUpdated: new Date()
      };
      this.playerProfiles.set(playerId, newProfile);
    }
    return this.playerProfiles.get(playerId)!;
  }

  private async analyzeMoveTiming(
    moves: GameMove[],
    profile: PlayerBehaviorProfile
  ): Promise<TimingAnalysisResult> {
    const timings: number[] = [];
    
    for (let i = 1; i < moves.length; i++) {
      const timeDiff = moves[i].timestamp - moves[i - 1].timestamp;
      timings.push(timeDiff);
    }

    if (timings.length === 0) {
      return { suspicious: false, score: 0, timings: [], variance: 0, deviationScore: 0 };
    }

    const analysis = this.timingModel.analyze(timings);
    const variance = this.calculateVariance(timings);
    const avgTiming = timings.reduce((sum, t) => sum + t, 0) / timings.length;
    
    // Compare with player's historical data
    const deviationFromProfile = Math.abs(avgTiming - profile.averageDecisionTime) / profile.decisionTimeVariance;
    
    return {
      suspicious: analysis.suspicious || deviationFromProfile > 3,
      score: Math.max(analysis.score, deviationFromProfile / 5),
      timings,
      variance,
      deviationScore: deviationFromProfile
    };
  }

  private async analyzeMoveQuality(moves: GameMove[], gameStates: any[]): Promise<MoveQualityAnalysis> {
    let totalMoves = 0;
    let optimalMoves = 0;
    const perfectSequences: string[] = [];
    let consecutivePerfect = 0;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const gameState = gameStates[i] || {};
      
      // Simplified move quality assessment
      const isOptimal = this.assessMoveOptimality(move, gameState);
      
      if (isOptimal) {
        optimalMoves++;
        consecutivePerfect++;
        
        if (consecutivePerfect >= 10) {
          perfectSequences.push(`Perfect sequence of ${consecutivePerfect} moves starting at move ${i - consecutivePerfect + 1}`);
        }
      } else {
        consecutivePerfect = 0;
      }
      
      totalMoves++;
    }

    const accuracy = totalMoves > 0 ? optimalMoves / totalMoves : 0;
    
    return {
      accuracy,
      suspiciouslyPerfect: accuracy > 0.95 && totalMoves > 20, // 95%+ accuracy over 20+ moves is suspicious
      perfectSequences,
      totalMoves,
      optimalMoves
    };
  }

  private assessMoveOptimality(move: GameMove, gameState: any): boolean {
    // Simplified optimality assessment
    // In a real implementation, this would use game-specific analysis
    
    switch (move.action) {
      case 'play-card':
        // Playing a card is generally optimal if player has mana
        return gameState.playerMana >= 1;
      
      case 'attack':
        // Attacking is optimal if it advances win condition
        return gameState.opponentHealth <= 10 || gameState.playerBoardAdvantage;
      
      case 'end-turn':
        // Ending turn is optimal if no good moves available
        return gameState.playerMana < 1;
      
      default:
        return Math.random() > 0.3; // 70% chance any move is "optimal"
    }
  }

  private async detectImpossibleMoves(moves: GameMove[], gameStates: any[]): Promise<ImpossibleMove[]> {
    const impossibleMoves: ImpossibleMove[] = [];
    
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const gameState = gameStates[i] || {};
      
      // Mock player knowledge (in real game, this would track what player should know)
      const playerKnowledge = {
        hand: ['card1', 'card2', 'card3'], // Simplified
        knownOpponentCards: []
      };
      
      const validation = this.moveValidationModel.validateMove(move, gameState, playerKnowledge);
      
      if (!validation.valid) {
        impossibleMoves.push({
          moveIndex: i,
          move,
          gameState,
          description: validation.issues.join(', '),
          timestamp: move.timestamp,
          moveSequence: `move-${i}:${move.action}`
        });
      }
    }
    
    return impossibleMoves;
  }

  async validateReplay(replay: GameReplay): Promise<ReplayValidation> {
    const replayId = replay.replayId;
    
    // Check if already validated recently
    const cached = this.validationCache.get(replayId);
    if (cached && Date.now() - cached.validationTimestamp.getTime() < 300000) { // 5 minutes
      return cached;
    }

    const issues: ValidationIssue[] = [];
    
    // Validate hash integrity
    const hashMatches = await this.validateReplayHash(replay);
    if (!hashMatches) {
      issues.push({
        type: 'hash-mismatch',
        severity: 'critical',
        description: 'Replay hash does not match original game data',
        affectedTurns: [],
        evidence: { 
          originalHash: replay.hashValidation.moveSequenceHash,
          calculatedHash: 'recalculated-hash'
        }
      });
    }

    // Validate state consistency
    const stateConsistency = this.validateStateConsistency(replay);
    if (!stateConsistency.valid) {
      issues.push(...stateConsistency.issues);
    }

    // Validate timing consistency
    const timingConsistency = this.validateTimingConsistency(replay);
    if (!timingConsistency.valid) {
      issues.push(...timingConsistency.issues);
    }

    const validation: ReplayValidation = {
      replayId,
      isValid: issues.length === 0,
      issues,
      hashMatches,
      stateConsistency: stateConsistency.valid,
      timingConsistency: timingConsistency.valid,
      validationTimestamp: new Date()
    };

    this.validationCache.set(replayId, validation);
    return validation;
  }

  private async validateReplayHash(replay: GameReplay): Promise<boolean> {
    // Recalculate hash from replay data
    const moveData = replay.timeline.turns
      .flatMap(turn => turn.actions)
      .map(action => `${action.type}:${action.cardId}:${action.timestamp}`)
      .join('|');
    
    const recalculatedHash = this.simpleHash(moveData);
    return recalculatedHash === replay.hashValidation.moveSequenceHash;
  }

  private simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  private validateStateConsistency(replay: GameReplay): { valid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    
    for (let i = 1; i < replay.timeline.turns.length; i++) {
      const prevTurn = replay.timeline.turns[i - 1];
      const currTurn = replay.timeline.turns[i];
      
      // Check for impossible state transitions
      const healthDiff = Math.abs(
        currTurn.gameStateAfter.playerHealth - prevTurn.gameStateAfter.playerHealth
      );
      
      if (healthDiff > 20) { // Impossible to lose/gain more than 20 health in one turn
        issues.push({
          type: 'impossible-transition',
          severity: 'major',
          description: `Impossible health change of ${healthDiff} in one turn`,
          affectedTurns: [i - 1, i],
          evidence: {
            prevHealth: prevTurn.gameStateAfter.playerHealth,
            currHealth: currTurn.gameStateAfter.playerHealth
          }
        });
      }
    }
    
    return { valid: issues.length === 0, issues };
  }

  private validateTimingConsistency(replay: GameReplay): { valid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    
    replay.timeline.turns.forEach((turn, turnIndex) => {
      // Check for impossible action timing (actions happening too close together)
      for (let i = 1; i < turn.actions.length; i++) {
        const timeDiff = turn.actions[i].timestamp - turn.actions[i - 1].timestamp;
        
        if (timeDiff < 100) { // Less than 100ms between actions is suspicious
          issues.push({
            type: 'timing-violation',
            severity: 'minor',
            description: `Actions ${i - 1} and ${i} in turn ${turnIndex} are only ${timeDiff}ms apart`,
            affectedTurns: [turnIndex],
            evidence: {
              action1: turn.actions[i - 1],
              action2: turn.actions[i],
              timeDiff
            }
          });
        }
      }
    });
    
    return { valid: issues.length === 0, issues };
  }

  private calculateOverallConfidence(cheats: DetectedCheat[], evidence: Evidence[]): number {
    if (cheats.length === 0) return 0;
    
    // Weight confidence by severity and evidence strength
    let totalWeight = 0;
    let weightedConfidence = 0;
    
    cheats.forEach(cheat => {
      const weight = 1 - cheat.falsePositiveProbability;
      totalWeight += weight;
      weightedConfidence += (1 - cheat.falsePositiveProbability) * weight;
    });
    
    // Factor in evidence quality
    const evidenceWeight = evidence.reduce((sum, e) => sum + e.weight, 0);
    const evidenceBonus = Math.min(0.2, evidenceWeight / 10); // Up to 20% bonus from strong evidence
    
    return Math.min(1, (weightedConfidence / totalWeight) + evidenceBonus);
  }

  private determineSeverity(cheats: DetectedCheat[], confidence: number): 'low' | 'medium' | 'high' | 'critical' {
    const hasImpossibleMoves = cheats.some(c => c.type === 'impossible-move');
    const hasMemoryManipulation = cheats.some(c => c.type === 'memory-manipulation');
    
    if (hasImpossibleMoves || hasMemoryManipulation) return 'critical';
    if (confidence > 0.8) return 'high';
    if (confidence > 0.6) return 'medium';
    return 'low';
  }

  private determineRecommendedAction(
    cheats: DetectedCheat[],
    confidence: number,
    profile: PlayerBehaviorProfile
  ): RecommendedAction {
    const severity = this.determineSeverity(cheats, confidence);
    
    // Consider player history
    const previousFlags = profile.suspicionFlags.length;
    const riskScore = profile.riskScore;
    
    if (severity === 'critical') {
      return {
        type: 'permanent-ban',
        reason: 'Critical cheating violations detected',
        confidence,
        reviewRequired: confidence < 0.95
      };
    }
    
    if (severity === 'high') {
      if (previousFlags > 2 || riskScore > 70) {
        return {
          type: 'permanent-ban',
          reason: 'Repeated high-severity violations',
          confidence,
          reviewRequired: true
        };
      }
      return {
        type: 'temporary-ban',
        duration: 72, // 3 days
        reason: 'High-confidence cheat detection',
        confidence,
        reviewRequired: confidence < 0.9
      };
    }
    
    if (severity === 'medium') {
      return {
        type: 'warning',
        reason: 'Suspicious behavior detected',
        confidence,
        reviewRequired: true
      };
    }
    
    return {
      type: 'none',
      reason: 'Low confidence detection - monitoring',
      confidence,
      reviewRequired: false
    };
  }

  private storeDetectionResult(playerId: string, result: CheatDetectionResult): void {
    if (!this.detectionResults.has(playerId)) {
      this.detectionResults.set(playerId, []);
    }
    this.detectionResults.get(playerId)!.push(result);
    
    // Keep only last 100 results per player
    const results = this.detectionResults.get(playerId)!;
    if (results.length > 100) {
      this.detectionResults.set(playerId, results.slice(-100));
    }
  }

  private updatePlayerProfile(playerId: string, moves: GameMove[], detectedCheats: DetectedCheat[]): void {
    const profile = this.getOrCreatePlayerProfile(playerId);
    
    profile.gamesAnalyzed++;
    profile.lastUpdated = new Date();
    
    // Update timing statistics
    const timings = moves.slice(1).map((move, i) => move.timestamp - moves[i].timestamp);
    if (timings.length > 0) {
      const avgTiming = timings.reduce((sum, t) => sum + t, 0) / timings.length;
      profile.averageDecisionTime = (profile.averageDecisionTime * (profile.gamesAnalyzed - 1) + avgTiming) / profile.gamesAnalyzed;
      profile.decisionTimeVariance = this.calculateVariance(timings);
    }
    
    // Add suspicion flags for detected cheats
    detectedCheats.forEach(cheat => {
      const existingFlag = profile.suspicionFlags.find(flag => flag.type === cheat.type);
      
      if (existingFlag) {
        existingFlag.count++;
        existingFlag.lastSeen = new Date();
      } else {
        profile.suspicionFlags.push({
          type: cheat.type,
          count: 1,
          firstSeen: new Date(),
          lastSeen: new Date(),
          severity: cheat.falsePositiveProbability > 0.3 ? 'low' : 'high',
          description: cheat.description
        });
      }
    });
    
    // Update risk score
    profile.riskScore = this.calculateRiskScore(profile);
  }

  private calculateRiskScore(profile: PlayerBehaviorProfile): number {
    let score = 0;
    
    // Base score from suspicion flags
    profile.suspicionFlags.forEach(flag => {
      const multiplier = flag.severity === 'high' ? 15 : flag.severity === 'medium' ? 10 : 5;
      score += flag.count * multiplier;
    });
    
    // Factor in timing abnormalities
    if (profile.decisionTimeVariance < 500) score += 20; // Too consistent
    if (profile.averageDecisionTime < 1000) score += 15; // Too fast
    
    return Math.min(100, score);
  }

  // Tournament security methods
  createTournamentSecurity(
    tournamentId: string,
    securityLevel: 'standard' | 'enhanced' | 'maximum'
  ): TournamentSecurity {
    const baseRules: GameRule[] = [
      {
        id: 'deck-size-limit',
        name: 'Deck Size Limit',
        description: 'Enforce minimum and maximum deck sizes',
        enforced: true,
        parameters: { minSize: 30, maxSize: 60 }
      },
      {
        id: 'turn-timer',
        name: 'Turn Timer',
        description: 'Enforce maximum time per turn',
        enforced: true,
        parameters: { maxTime: 90000 } // 90 seconds
      }
    ];

    const enhancedRules: GameRule[] = [
      ...baseRules,
      {
        id: 'card-verification',
        name: 'Card Verification',
        description: 'Verify all cards are legal in format',
        enforced: true,
        parameters: { format: 'standard' }
      }
    ];

    const maximumRules: GameRule[] = [
      ...enhancedRules,
      {
        id: 'strict-timing',
        name: 'Strict Timing',
        description: 'Enforce strict timing for all actions',
        enforced: true,
        parameters: { minActionTime: 500, maxActionTime: 30000 }
      }
    ];

    const rules = securityLevel === 'maximum' ? maximumRules :
                  securityLevel === 'enhanced' ? enhancedRules : baseRules;

    const security: TournamentSecurity = {
      tournamentId,
      securityLevel,
      lockedRules: rules,
      enforcedRestrictions: [
        {
          type: 'deck-validation',
          enabled: true,
          parameters: { strictMode: securityLevel === 'maximum' }
        },
        {
          type: 'move-validation',
          enabled: true,
          parameters: { realTimeCheck: securityLevel !== 'standard' }
        },
        {
          type: 'timing-enforcement',
          enabled: securityLevel === 'maximum',
          parameters: { tolerance: 100 } // 100ms tolerance
        }
      ],
      monitoring: {
        replayRecording: true,
        behaviorAnalysis: securityLevel !== 'standard',
        realTimeValidation: securityLevel === 'maximum',
        audienceMode: false,
        adminOverrides: true
      },
      participants: []
    };

    this.tournaments.set(tournamentId, security);
    return security;
  }

  addTournamentParticipant(
    tournamentId: string,
    playerId: string
  ): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    const profile = this.getOrCreatePlayerProfile(playerId);
    const clearance = this.determineClearanceLevel(profile);
    
    if (clearance === 'basic' && tournament.securityLevel === 'maximum') {
      return false; // Not allowed in maximum security tournaments
    }

    const participant: TournamentParticipant = {
      playerId,
      verificationStatus: 'pending',
      securityClearance: clearance,
      monitoringLevel: profile.riskScore > 50 ? 2 : 1,
      restrictions: this.getPlayerRestrictions(profile)
    };

    tournament.participants.push(participant);
    return true;
  }

  private determineClearanceLevel(profile: PlayerBehaviorProfile): 'basic' | 'standard' | 'enhanced' {
    if (profile.riskScore > 70) return 'basic';
    if (profile.riskScore > 30 || profile.suspicionFlags.length > 2) return 'standard';
    return 'enhanced';
  }

  private getPlayerRestrictions(profile: PlayerBehaviorProfile): string[] {
    const restrictions: string[] = [];
    
    if (profile.riskScore > 50) {
      restrictions.push('enhanced-monitoring');
    }
    
    if (profile.suspicionFlags.some(flag => flag.type === 'timing-anomaly')) {
      restrictions.push('strict-timing-enforcement');
    }
    
    if (profile.suspicionFlags.some(flag => flag.type === 'perfect-play')) {
      restrictions.push('move-verification');
    }
    
    return restrictions;
  }

  // Public API methods
  getPlayerDetectionHistory(playerId: string): CheatDetectionResult[] {
    return this.detectionResults.get(playerId) || [];
  }

  getPlayerRiskScore(playerId: string): number {
    const profile = this.playerProfiles.get(playerId);
    return profile ? profile.riskScore : 0;
  }

  getTournamentSecurity(tournamentId: string): TournamentSecurity | undefined {
    return this.tournaments.get(tournamentId);
  }

  flagSuspiciousActivity(
    playerId: string,
    activityType: string,
    description: string,
    evidence: any
  ): void {
    const profile = this.getOrCreatePlayerProfile(playerId);
    
    profile.suspicionFlags.push({
      type: activityType,
      count: 1,
      firstSeen: new Date(),
      lastSeen: new Date(),
      severity: 'medium',
      description
    });
    
    profile.riskScore = this.calculateRiskScore(profile);
  }
}

// Helper interfaces
interface TimingAnalysisResult {
  suspicious: boolean;
  score: number;
  timings: number[];
  variance: number;
  deviationScore: number;
}

interface MoveQualityAnalysis {
  accuracy: number;
  suspiciouslyPerfect: boolean;
  perfectSequences: string[];
  totalMoves: number;
  optimalMoves: number;
}

interface ImpossibleMove {
  moveIndex: number;
  move: GameMove;
  gameState: any;
  description: string;
  timestamp: number;
  moveSequence: string;
}

export const antiCheatSystem = new AntiCheatSystem();