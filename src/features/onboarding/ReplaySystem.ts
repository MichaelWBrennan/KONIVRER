import { Card, Deck } from '../../ai/DeckOptimizer';
import { GameMove } from './AITrainingPartner';
import { MatchAnalytics, AnalyzedMove, GameStateSnapshot } from './PostMatchAnalytics';

export interface GameReplay {
  replayId: string;
  matchId: string;
  playerId: string;
  opponentId: string;
  createdAt: Date;
  metadata: ReplayMetadata;
  timeline: ReplayTimeline;
  tags: ReplayTag[];
  bookmarks: ReplayBookmark[];
  annotations: PlayerAnnotation[];
  hashValidation: ReplayHashValidation;
}

export interface ReplayMetadata {
  gameVersion: string;
  playerDeck: Deck;
  opponentDeck?: Deck;
  gameMode: 'casual' | 'ranked' | 'tournament' | 'training';
  result: 'win' | 'loss' | 'draw';
  duration: number; // in seconds
  totalTurns: number;
  finalScore?: number;
}

export interface ReplayTimeline {
  startState: GameStateSnapshot;
  turns: ReplayTurn[];
  endState: GameStateSnapshot;
  keyMoments: KeyMoment[];
}

export interface ReplayTurn {
  turnNumber: number;
  playerId: string;
  startTime: number;
  endTime: number;
  actions: ReplayAction[];
  gameStateAfter: GameStateSnapshot;
  decisionPoints: DecisionPoint[];
  evaluations: TurnEvaluation;
}

export interface ReplayAction {
  actionId: string;
  type: 'draw-card' | 'play-card' | 'attack' | 'activate-ability' | 'end-turn' | 'mulligan';
  timestamp: number;
  cardId?: string;
  sourceId?: string;
  targetId?: string;
  position?: { x: number; y: number };
  cost?: number;
  effect?: string;
  animationData?: AnimationData;
}

export interface AnimationData {
  duration: number;
  easing: string;
  particles?: boolean;
  soundEffect?: string;
}

export interface DecisionPoint {
  id: string;
  timestamp: number;
  availableOptions: GameOption[];
  chosenOption: string;
  timeSpent: number; // milliseconds
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'game-changing';
}

export interface GameOption {
  id: string;
  type: string;
  description: string;
  cardId?: string;
  targetId?: string;
  expectedOutcome: string;
  riskLevel: 'low' | 'medium' | 'high';
  aiEvaluation?: number; // 0-100 score
}

export interface TurnEvaluation {
  efficiency: number; // 0-100
  strategicValue: number; // 0-100
  riskManagement: number; // 0-100
  optimalPlay: boolean;
  alternativePlays: AlternativePlay[];
  learningOpportunities: string[];
}

export interface AlternativePlay {
  description: string;
  actions: ReplayAction[];
  expectedResult: string;
  whyBetter: string;
  probability: number; // 0-1, likelihood this would be better
}

export interface KeyMoment {
  id: string;
  timestamp: number;
  turnNumber: number;
  type: 'game-changing' | 'mistake' | 'brilliant-play' | 'comeback' | 'missed-opportunity';
  title: string;
  description: string;
  impact: string;
  beforeState: GameStateSnapshot;
  afterState: GameStateSnapshot;
  significance: number; // 0-100
}

export interface ReplayTag {
  id: string;
  name: string;
  category: 'strategy' | 'mistake' | 'combo' | 'interaction' | 'learning';
  color: string;
  timestamp?: number; // Optional - tags can apply to specific moments
  description?: string;
  createdBy: 'system' | 'player' | 'ai';
}

export interface ReplayBookmark {
  id: string;
  name: string;
  description: string;
  timestamp: number;
  turnNumber: number;
  type: 'personal' | 'educational' | 'analysis';
  tags: string[];
  createdAt: Date;
}

export interface PlayerAnnotation {
  id: string;
  timestamp: number;
  turnNumber: number;
  type: 'note' | 'question' | 'insight' | 'reminder';
  content: string;
  visibility: 'private' | 'public' | 'friends';
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReplayHashValidation {
  moveSequenceHash: string;
  gameStateHash: string;
  validationTimestamp: Date;
  isValid: boolean;
  checksumValidation: boolean;
  tamperDetection: boolean;
}

export interface ReplaySearchFilter {
  playerId?: string;
  opponentId?: string;
  gameMode?: string;
  result?: 'win' | 'loss' | 'draw';
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  duration?: { min: number; max: number };
  hasBookmarks?: boolean;
  hasAnnotations?: boolean;
}

export class ReplaySystem {
  private replays: Map<string, GameReplay> = new Map();
  private replaysByPlayer: Map<string, Set<string>> = new Map();
  private tagLibrary: Map<string, ReplayTag> = new Map();
  private currentPlayback: ReplayPlayback | null = null;

  constructor() {
    this.initializeTagLibrary();
  }

  private initializeTagLibrary(): void {
    const standardTags: ReplayTag[] = [
      {
        id: 'excellent-play',
        name: 'Excellent Play',
        category: 'strategy',
        color: '#4CAF50',
        createdBy: 'system'
      },
      {
        id: 'missed-lethal',
        name: 'Missed Lethal',
        category: 'mistake',
        color: '#F44336',
        createdBy: 'system'
      },
      {
        id: 'combo-executed',
        name: 'Combo Executed',
        category: 'combo',
        color: '#9C27B0',
        createdBy: 'system'
      },
      {
        id: 'card-interaction',
        name: 'Card Interaction',
        category: 'interaction',
        color: '#2196F3',
        createdBy: 'system'
      },
      {
        id: 'learning-moment',
        name: 'Learning Moment',
        category: 'learning',
        color: '#FF9800',
        createdBy: 'system'
      }
    ];

    standardTags.forEach(tag => this.tagLibrary.set(tag.id, tag));
  }

  async createReplay(
    matchAnalytics: MatchAnalytics,
    moves: GameMove[]
  ): Promise<GameReplay> {
    const replayId = `replay_${matchAnalytics.matchId}_${Date.now()}`;
    
    // Generate hash for validation
    const hashValidation = await this.generateReplayHash(moves, matchAnalytics);
    
    // Build timeline
    const timeline = await this.buildTimeline(moves, matchAnalytics);
    
    // Auto-generate tags
    const autoTags = this.generateAutoTags(matchAnalytics, timeline);
    
    // Find key moments
    const keyMoments = this.identifyKeyMoments(timeline, matchAnalytics);
    timeline.keyMoments = keyMoments;

    const replay: GameReplay = {
      replayId,
      matchId: matchAnalytics.matchId,
      playerId: matchAnalytics.playerId,
      opponentId: matchAnalytics.opponentId,
      createdAt: new Date(),
      metadata: {
        gameVersion: '1.0.0',
        playerDeck: matchAnalytics.deck,
        opponentDeck: matchAnalytics.opponentDeck,
        gameMode: 'casual', // Would come from match data
        result: matchAnalytics.result,
        duration: matchAnalytics.gameLength * 60,
        totalTurns: matchAnalytics.turnCount
      },
      timeline,
      tags: autoTags,
      bookmarks: [],
      annotations: [],
      hashValidation
    };

    this.replays.set(replayId, replay);
    this.addReplayToPlayerIndex(matchAnalytics.playerId, replayId);
    
    return replay;
  }

  private async generateReplayHash(
    moves: GameMove[],
    analytics: MatchAnalytics
  ): Promise<ReplayHashValidation> {
    // Generate cryptographic hash for replay validation
    const moveData = moves.map(m => `${m.action}:${m.cardId}:${m.timestamp}`).join('|');
    const gameData = `${analytics.matchId}:${analytics.result}:${analytics.turnCount}`;
    
    // Simple hash simulation (in real implementation, use crypto.subtle)
    const combinedData = moveData + gameData;
    const moveSequenceHash = this.simpleHash(moveData);
    const gameStateHash = this.simpleHash(gameData);
    
    return {
      moveSequenceHash,
      gameStateHash,
      validationTimestamp: new Date(),
      isValid: true,
      checksumValidation: true,
      tamperDetection: false
    };
  }

  private simpleHash(data: string): string {
    // Simplified hash function for demonstration
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private async buildTimeline(
    moves: GameMove[],
    analytics: MatchAnalytics
  ): Promise<ReplayTimeline> {
    const turns: ReplayTurn[] = [];
    let currentTurn = 0;
    let turnActions: ReplayAction[] = [];
    let turnStartTime = 0;

    // Group moves by turns
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const turnNumber = this.extractTurnNumber(move, i);

      if (turnNumber !== currentTurn) {
        // Finish previous turn
        if (turnActions.length > 0) {
          const turn = await this.buildReplayTurn(
            currentTurn,
            turnActions,
            turnStartTime,
            move.timestamp,
            analytics.moves[i - 1]?.gameState
          );
          turns.push(turn);
        }

        // Start new turn
        currentTurn = turnNumber;
        turnActions = [];
        turnStartTime = move.timestamp;
      }

      // Convert move to replay action
      const action: ReplayAction = {
        actionId: `action_${i}`,
        type: move.action as any,
        timestamp: move.timestamp,
        cardId: move.cardId,
        targetId: move.targetId,
        animationData: {
          duration: 500,
          easing: 'ease-out',
          particles: move.action === 'play-card',
          soundEffect: this.getSoundEffect(move.action)
        }
      };

      turnActions.push(action);
    }

    // Handle final turn
    if (turnActions.length > 0) {
      const finalTurn = await this.buildReplayTurn(
        currentTurn,
        turnActions,
        turnStartTime,
        Date.now(),
        analytics.moves[analytics.moves.length - 1]?.gameState
      );
      turns.push(finalTurn);
    }

    return {
      startState: this.createInitialGameState(),
      turns,
      endState: analytics.moves[analytics.moves.length - 1]?.gameState || this.createInitialGameState(),
      keyMoments: [] // Will be populated separately
    };
  }

  private extractTurnNumber(move: GameMove, moveIndex: number): number {
    // Extract turn number from move or calculate from sequence
    return Math.floor(moveIndex / 3) + 1; // Simplified: ~3 actions per turn
  }

  private getSoundEffect(action: string): string {
    const soundMap: { [key: string]: string } = {
      'play-card': 'card-place.wav',
      'attack': 'sword-clash.wav',
      'end-turn': 'bell-chime.wav',
      'activate-ability': 'magic-cast.wav'
    };
    return soundMap[action] || 'default.wav';
  }

  private async buildReplayTurn(
    turnNumber: number,
    actions: ReplayAction[],
    startTime: number,
    endTime: number,
    gameState?: GameStateSnapshot
  ): Promise<ReplayTurn> {
    const decisionPoints = this.analyzeDecisionPoints(actions, startTime, endTime);
    const evaluations = this.evaluateTurn(actions, gameState);

    return {
      turnNumber,
      playerId: 'player', // Would determine from actions
      startTime,
      endTime,
      actions,
      gameStateAfter: gameState || this.createInitialGameState(),
      decisionPoints,
      evaluations
    };
  }

  private analyzeDecisionPoints(
    actions: ReplayAction[],
    startTime: number,
    endTime: number
  ): DecisionPoint[] {
    const decisionPoints: DecisionPoint[] = [];
    
    actions.forEach((action, index) => {
      if (action.type === 'play-card' || action.type === 'attack') {
        const timeSpent = index > 0 
          ? action.timestamp - actions[index - 1].timestamp 
          : action.timestamp - startTime;

        const difficulty = this.assessDecisionDifficulty(action, timeSpent);
        const impact = this.assessDecisionImpact(action);

        decisionPoints.push({
          id: `decision_${action.actionId}`,
          timestamp: action.timestamp,
          availableOptions: this.generateHypotheticalOptions(action),
          chosenOption: action.actionId,
          timeSpent,
          difficulty,
          impact
        });
      }
    });

    return decisionPoints;
  }

  private assessDecisionDifficulty(action: ReplayAction, timeSpent: number): 'trivial' | 'easy' | 'medium' | 'hard' | 'critical' {
    if (timeSpent < 2000) return 'trivial';
    if (timeSpent < 5000) return 'easy';
    if (timeSpent < 15000) return 'medium';
    if (timeSpent < 30000) return 'hard';
    return 'critical';
  }

  private assessDecisionImpact(action: ReplayAction): 'low' | 'medium' | 'high' | 'game-changing' {
    // Simplified impact assessment
    if (action.type === 'end-turn') return 'low';
    if (action.type === 'play-card') return 'medium';
    if (action.type === 'attack') return 'high';
    return 'medium';
  }

  private generateHypotheticalOptions(action: ReplayAction): GameOption[] {
    const options: GameOption[] = [
      {
        id: action.actionId,
        type: action.type,
        description: `${action.type} ${action.cardId || ''}`,
        cardId: action.cardId,
        targetId: action.targetId,
        expectedOutcome: 'Selected action',
        riskLevel: 'medium'
      }
    ];

    // Add alternative options
    if (action.type === 'play-card') {
      options.push({
        id: 'alt-end-turn',
        type: 'end-turn',
        description: 'End turn without playing card',
        expectedOutcome: 'Save mana for next turn',
        riskLevel: 'low'
      });
    }

    return options;
  }

  private evaluateTurn(actions: ReplayAction[], gameState?: GameStateSnapshot): TurnEvaluation {
    const efficiency = this.calculateTurnEfficiency(actions, gameState);
    const strategicValue = this.calculateStrategicValue(actions);
    const riskManagement = this.calculateRiskManagement(actions);
    const optimalPlay = efficiency > 75 && strategicValue > 70;

    return {
      efficiency,
      strategicValue,
      riskManagement,
      optimalPlay,
      alternativePlays: this.generateAlternativePlays(actions),
      learningOpportunities: this.identifyLearningOpportunities(actions, efficiency, strategicValue)
    };
  }

  private calculateTurnEfficiency(actions: ReplayAction[], gameState?: GameStateSnapshot): number {
    // Calculate how efficiently the turn was played
    let efficiency = 50; // Base score

    // Check mana usage
    const cardPlayActions = actions.filter(a => a.type === 'play-card');
    if (cardPlayActions.length > 0) {
      efficiency += 20; // Bonus for playing cards
    }

    // Check if turn ended with unused mana (simplified)
    if (!actions.some(a => a.type === 'end-turn')) {
      efficiency -= 10;
    }

    return Math.max(0, Math.min(100, efficiency));
  }

  private calculateStrategicValue(actions: ReplayAction[]): number {
    // Assess strategic value of actions taken
    let value = 50;

    actions.forEach(action => {
      if (action.type === 'play-card') value += 15;
      if (action.type === 'attack') value += 10;
      if (action.type === 'activate-ability') value += 20;
    });

    return Math.max(0, Math.min(100, value));
  }

  private calculateRiskManagement(actions: ReplayAction[]): number {
    // Assess how well risks were managed
    // Simplified calculation
    const riskScore = actions.length > 5 ? 40 : 60; // Too many actions might be risky
    return Math.max(0, Math.min(100, riskScore));
  }

  private generateAlternativePlays(actions: ReplayAction[]): AlternativePlay[] {
    const alternatives: AlternativePlay[] = [];

    if (actions.length > 3) {
      alternatives.push({
        description: 'More conservative play',
        actions: actions.slice(0, 2), // Fewer actions
        expectedResult: 'Better resource conservation',
        whyBetter: 'Reduces risk of overextending',
        probability: 0.6
      });
    }

    return alternatives;
  }

  private identifyLearningOpportunities(
    actions: ReplayAction[],
    efficiency: number,
    strategicValue: number
  ): string[] {
    const opportunities: string[] = [];

    if (efficiency < 60) {
      opportunities.push('Focus on improving mana efficiency');
    }

    if (strategicValue < 60) {
      opportunities.push('Consider the strategic impact of each action');
    }

    if (actions.length < 2) {
      opportunities.push('Look for more opportunities to develop your board state');
    }

    return opportunities;
  }

  private generateAutoTags(
    analytics: MatchAnalytics,
    timeline: ReplayTimeline
  ): ReplayTag[] {
    const tags: ReplayTag[] = [];

    // Result-based tags
    if (analytics.result === 'win') {
      tags.push({
        id: 'victory',
        name: 'Victory',
        category: 'strategy',
        color: '#4CAF50',
        createdBy: 'system'
      });
    }

    // Performance-based tags
    if (analytics.performance.overallRating > 80) {
      tags.push(this.tagLibrary.get('excellent-play')!);
    }

    // Game length tags
    if (analytics.gameLength < 10) {
      tags.push({
        id: 'quick-game',
        name: 'Quick Game',
        category: 'strategy',
        color: '#FF5722',
        createdBy: 'system'
      });
    }

    return tags;
  }

  private identifyKeyMoments(
    timeline: ReplayTimeline,
    analytics: MatchAnalytics
  ): KeyMoment[] {
    const keyMoments: KeyMoment[] = [];

    // Find game-changing turns
    timeline.turns.forEach((turn, index) => {
      if (turn.evaluations.optimalPlay && turn.evaluations.strategicValue > 80) {
        keyMoments.push({
          id: `key_moment_${turn.turnNumber}`,
          timestamp: turn.startTime,
          turnNumber: turn.turnNumber,
          type: 'brilliant-play',
          title: `Brilliant Play - Turn ${turn.turnNumber}`,
          description: `Executed an excellent strategic play with high efficiency`,
          impact: `Strategic value: ${turn.evaluations.strategicValue}`,
          beforeState: timeline.turns[index - 1]?.gameStateAfter || timeline.startState,
          afterState: turn.gameStateAfter,
          significance: turn.evaluations.strategicValue
        });
      }

      // Identify mistakes
      if (turn.evaluations.efficiency < 40) {
        keyMoments.push({
          id: `mistake_${turn.turnNumber}`,
          timestamp: turn.startTime,
          turnNumber: turn.turnNumber,
          type: 'mistake',
          title: `Missed Opportunity - Turn ${turn.turnNumber}`,
          description: `Turn played with low efficiency`,
          impact: `Efficiency: ${turn.evaluations.efficiency}%`,
          beforeState: timeline.turns[index - 1]?.gameStateAfter || timeline.startState,
          afterState: turn.gameStateAfter,
          significance: 100 - turn.evaluations.efficiency
        });
      }
    });

    return keyMoments.sort((a, b) => b.significance - a.significance);
  }

  private createInitialGameState(): GameStateSnapshot {
    return {
      playerHealth: 20,
      opponentHealth: 20,
      playerMana: 1,
      opponentMana: 1,
      playerHandSize: 7,
      opponentHandSize: 7,
      playerBoardState: [],
      opponentBoardState: [],
      gamePhase: 'early'
    };
  }

  private addReplayToPlayerIndex(playerId: string, replayId: string): void {
    if (!this.replaysByPlayer.has(playerId)) {
      this.replaysByPlayer.set(playerId, new Set());
    }
    this.replaysByPlayer.get(playerId)!.add(replayId);
  }

  // Public API methods

  getReplay(replayId: string): GameReplay | undefined {
    return this.replays.get(replayId);
  }

  getPlayerReplays(playerId: string, limit?: number): GameReplay[] {
    const replayIds = this.replaysByPlayer.get(playerId) || new Set();
    const replays = Array.from(replayIds)
      .map(id => this.replays.get(id))
      .filter(replay => replay !== undefined) as GameReplay[];
    
    replays.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? replays.slice(0, limit) : replays;
  }

  searchReplays(filter: ReplaySearchFilter): GameReplay[] {
    const allReplays = Array.from(this.replays.values());
    
    return allReplays.filter(replay => {
      if (filter.playerId && replay.playerId !== filter.playerId) return false;
      if (filter.opponentId && replay.opponentId !== filter.opponentId) return false;
      if (filter.gameMode && replay.metadata.gameMode !== filter.gameMode) return false;
      if (filter.result && replay.metadata.result !== filter.result) return false;
      if (filter.hasBookmarks && replay.bookmarks.length === 0) return false;
      if (filter.hasAnnotations && replay.annotations.length === 0) return false;
      
      if (filter.dateRange) {
        const replayDate = replay.createdAt;
        if (replayDate < filter.dateRange.start || replayDate > filter.dateRange.end) {
          return false;
        }
      }
      
      if (filter.duration) {
        if (replay.metadata.duration < filter.duration.min || 
            replay.metadata.duration > filter.duration.max) {
          return false;
        }
      }
      
      if (filter.tags && filter.tags.length > 0) {
        const replayTagIds = replay.tags.map(tag => tag.id);
        if (!filter.tags.some(tagId => replayTagIds.includes(tagId))) {
          return false;
        }
      }
      
      return true;
    });
  }

  addBookmark(
    replayId: string,
    bookmark: Omit<ReplayBookmark, 'id' | 'createdAt'>
  ): boolean {
    const replay = this.replays.get(replayId);
    if (!replay) return false;

    const newBookmark: ReplayBookmark = {
      ...bookmark,
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    replay.bookmarks.push(newBookmark);
    return true;
  }

  addAnnotation(
    replayId: string,
    annotation: Omit<PlayerAnnotation, 'id' | 'createdAt'>
  ): boolean {
    const replay = this.replays.get(replayId);
    if (!replay) return false;

    const newAnnotation: PlayerAnnotation = {
      ...annotation,
      id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    replay.annotations.push(newAnnotation);
    return true;
  }

  addTag(replayId: string, tagId: string, timestamp?: number): boolean {
    const replay = this.replays.get(replayId);
    const tag = this.tagLibrary.get(tagId);
    
    if (!replay || !tag) return false;

    const newTag: ReplayTag = {
      ...tag,
      timestamp,
      createdBy: 'player'
    };

    replay.tags.push(newTag);
    return true;
  }

  async validateReplay(replayId: string): Promise<boolean> {
    const replay = this.replays.get(replayId);
    if (!replay) return false;

    // Recalculate hashes and compare
    const currentHash = this.simpleHash(
      replay.timeline.turns.map(t => 
        t.actions.map(a => `${a.type}:${a.cardId}:${a.timestamp}`).join('|')
      ).join('||')
    );

    return currentHash === replay.hashValidation.moveSequenceHash;
  }

  createPlayback(replayId: string): ReplayPlayback | null {
    const replay = this.replays.get(replayId);
    if (!replay) return null;

    this.currentPlayback = new ReplayPlayback(replay);
    return this.currentPlayback;
  }
}

export class ReplayPlayback {
  private replay: GameReplay;
  private currentTurn: number = 0;
  private currentAction: number = 0;
  private isPlaying: boolean = false;
  private playbackSpeed: number = 1.0;
  private eventCallbacks: Map<string, Function[]> = new Map();

  constructor(replay: GameReplay) {
    this.replay = replay;
  }

  play(): void {
    this.isPlaying = true;
    this.emit('playback-started');
    this.playNextAction();
  }

  pause(): void {
    this.isPlaying = false;
    this.emit('playback-paused');
  }

  stop(): void {
    this.isPlaying = false;
    this.currentTurn = 0;
    this.currentAction = 0;
    this.emit('playback-stopped');
  }

  setSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(4.0, speed));
    this.emit('speed-changed', this.playbackSpeed);
  }

  seekToTurn(turnNumber: number): void {
    if (turnNumber >= 0 && turnNumber < this.replay.timeline.turns.length) {
      this.currentTurn = turnNumber;
      this.currentAction = 0;
      this.emit('seeked', { turn: turnNumber, action: 0 });
    }
  }

  seekToAction(turnNumber: number, actionNumber: number): void {
    const turn = this.replay.timeline.turns[turnNumber];
    if (turn && actionNumber >= 0 && actionNumber < turn.actions.length) {
      this.currentTurn = turnNumber;
      this.currentAction = actionNumber;
      this.emit('seeked', { turn: turnNumber, action: actionNumber });
    }
  }

  private playNextAction(): void {
    if (!this.isPlaying) return;

    const currentTurnData = this.replay.timeline.turns[this.currentTurn];
    if (!currentTurnData) {
      this.stop();
      this.emit('playback-ended');
      return;
    }

    const currentActionData = currentTurnData.actions[this.currentAction];
    if (!currentActionData) {
      // Move to next turn
      this.currentTurn++;
      this.currentAction = 0;
      this.playNextAction();
      return;
    }

    // Emit action event
    this.emit('action-played', {
      turn: this.currentTurn,
      action: this.currentAction,
      actionData: currentActionData,
      gameState: currentTurnData.gameStateAfter
    });

    // Schedule next action
    const delay = (currentActionData.animationData?.duration || 1000) / this.playbackSpeed;
    setTimeout(() => {
      this.currentAction++;
      this.playNextAction();
    }, delay);
  }

  getCurrentPosition(): { turn: number; action: number } {
    return { turn: this.currentTurn, action: this.currentAction };
  }

  getTotalDuration(): number {
    return this.replay.metadata.duration;
  }

  getKeyMoments(): KeyMoment[] {
    return this.replay.timeline.keyMoments;
  }

  on(event: string, callback: Function): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export const replaySystem = new ReplaySystem();