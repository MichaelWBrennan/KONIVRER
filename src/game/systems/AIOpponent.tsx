import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../../data/cards';
import { audioManager } from '../GameEngine';

// AI Difficulty levels with distinct personalities and strategies
export type AIDifficulty = 'beginner' | 'casual' | 'competitive' | 'expert' | 'legendary';

export interface AIPersonality {
  name: string;
  difficulty: AIDifficulty;
  description: string;
  avatar: string;
  playstyle: {
    aggression: number; // 0-1: How aggressively they play
    cardAdvantage: number; // 0-1: How much they value card advantage
    riskTolerance: number; // 0-1: How willing they are to take risks
    planningDepth: number; // 1-5: How many turns ahead they think
    bluffing: number; // 0-1: How often they bluff or feint
    adaptability: number; // 0-1: How well they adapt to player strategies
  };
  strategicWeights: {
    tempo: number; // Fast, immediate board pressure
    control: number; // Long-term card advantage and control
    combo: number; // Setting up powerful combinations
    midrange: number; // Balanced approach
  };
  weaknesses: string[];
  strengths: string[];
  favoriteCards: string[]; // Card IDs they prefer
  deckArchetype: 'aggro' | 'control' | 'midrange' | 'combo' | 'ramp';
}

// AI Opponents with distinct personalities
export const AI_OPPONENTS: AIPersonality[] = [
  {
    name: 'Nova Learner',
    difficulty: 'beginner',
    description: 'A friendly AI perfect for learning the basics. Makes simple plays and occasionally suboptimal choices.',
    avatar: '🤖',
    playstyle: {
      aggression: 0.3,
      cardAdvantage: 0.2,
      riskTolerance: 0.4,
      planningDepth: 1,
      bluffing: 0.1,
      adaptability: 0.2,
    },
    strategicWeights: {
      tempo: 0.4,
      control: 0.2,
      combo: 0.1,
      midrange: 0.3,
    },
    weaknesses: ['Doesn\'t plan ahead', 'Misses complex interactions', 'Poor resource management'],
    strengths: ['Consistent basic plays', 'Good for learning', 'Predictable patterns'],
    favoriteCards: ['ASH', 'DUST', 'FOG', 'FROST'],
    deckArchetype: 'midrange',
  },
  {
    name: 'Casual Challenger',
    difficulty: 'casual',
    description: 'A relaxed opponent who plays for fun. Makes good basic decisions but misses advanced strategies.',
    avatar: '😊',
    playstyle: {
      aggression: 0.5,
      cardAdvantage: 0.4,
      riskTolerance: 0.5,
      planningDepth: 2,
      bluffing: 0.2,
      adaptability: 0.4,
    },
    strategicWeights: {
      tempo: 0.3,
      control: 0.3,
      combo: 0.2,
      midrange: 0.2,
    },
    weaknesses: ['Sometimes plays too conservatively', 'Misses timing windows'],
    strengths: ['Solid fundamentals', 'Good threat assessment', 'Rarely makes major mistakes'],
    favoriteCards: ['SALAMANDER', 'GNOME', 'SYLPH', 'UNDINE'],
    deckArchetype: 'midrange',
  },
  {
    name: 'Ranked Warrior',
    difficulty: 'competitive',
    description: 'A serious competitor who knows the meta. Plays efficiently and recognizes most strategies.',
    avatar: '⚔️',
    playstyle: {
      aggression: 0.7,
      cardAdvantage: 0.6,
      riskTolerance: 0.4,
      planningDepth: 3,
      bluffing: 0.4,
      adaptability: 0.6,
    },
    strategicWeights: {
      tempo: 0.4,
      control: 0.2,
      combo: 0.2,
      midrange: 0.2,
    },
    weaknesses: ['Can be predictable', 'Sometimes overthinks simple situations'],
    strengths: ['Strong fundamental play', 'Good meta knowledge', 'Efficient resource usage'],
    favoriteCards: ['STORM', 'RAINBOW', 'GEODE', 'MIASMA'],
    deckArchetype: 'aggro',
  },
  {
    name: 'Master Strategist',
    difficulty: 'expert',
    description: 'A master-level AI with deep strategic understanding. Calculates multiple lines and adapts quickly.',
    avatar: '🧠',
    playstyle: {
      aggression: 0.6,
      cardAdvantage: 0.8,
      riskTolerance: 0.3,
      planningDepth: 4,
      bluffing: 0.6,
      adaptability: 0.8,
    },
    strategicWeights: {
      tempo: 0.2,
      control: 0.5,
      combo: 0.2,
      midrange: 0.1,
    },
    weaknesses: ['Can be slow in early game', 'Sometimes overly cautious'],
    strengths: ['Excellent long-term planning', 'Strong late game', 'Adapts to player strategy'],
    favoriteCards: ['ANGEL', 'AZOTH', 'AURORA', 'NECROSIS'],
    deckArchetype: 'control',
  },
  {
    name: 'Grandmaster Echo',
    difficulty: 'legendary',
    description: 'A legendary AI with near-perfect play. Calculates complex lines and rarely makes mistakes.',
    avatar: '👑',
    playstyle: {
      aggression: 0.8,
      cardAdvantage: 0.9,
      riskTolerance: 0.2,
      planningDepth: 5,
      bluffing: 0.8,
      adaptability: 0.9,
    },
    strategicWeights: {
      tempo: 0.3,
      control: 0.4,
      combo: 0.2,
      midrange: 0.1,
    },
    weaknesses: ['None apparent', 'May seem unpredictable to beginners'],
    strengths: ['Perfect calculation', 'Adapts instantly', 'Finds optimal plays', 'Master of all strategies'],
    favoriteCards: ['CHAOS', 'BRIGHTLAHAR', 'BRIGHTLAVA', 'BRIGHTLIGHTNING'],
    deckArchetype: 'combo',
  },
];

// AI Decision Making System
interface GameState {
  player: {
    life: number;
    mana: number;
    handSize: number;
    boardState: Card[];
  };
  ai: {
    life: number;
    mana: number;
    handSize: number;
    boardState: Card[];
    hand: Card[];
  };
  turn: number;
  phase: string;
}

export class AIOpponent {
  personality: AIPersonality;
  gameState: GameState | null = null;
  decisionHistory: string[] = [];
  playerStrategy: 'unknown' | 'aggro' | 'control' | 'midrange' | 'combo' = 'unknown';
  adaptationLevel: number = 0;

  constructor(personality: AIPersonality) {
    this.personality = personality;
  }

  // Main decision-making function
  makeDecision(gameState: GameState): {
    action: string;
    target?: string;
    confidence: number;
    reasoning: string;
  } {
    this.gameState = gameState;
    this.analyzePlayerStrategy();
    
    const possibleActions = this.generatePossibleActions();
    const evaluatedActions = possibleActions.map(action => ({
      ...action,
      score: this.evaluateAction(action, gameState),
    }));

    // Sort by score and apply personality-based selection
    evaluatedActions.sort((a, b) => b.score - a.score);
    const selectedAction = this.selectActionWithPersonality(evaluatedActions);

    // Record decision for learning
    this.decisionHistory.push(`T${gameState.turn}: ${selectedAction.action} (${selectedAction.reasoning})`);

    return selectedAction;
  }

  // Generate all possible actions the AI can take
  private generatePossibleActions(): Array<{
    action: string;
    card?: Card;
    target?: string;
    cost: number;
  }> {
    if (!this.gameState) return [];

    const actions: Array<{
      action: string;
      card?: Card;
      target?: string;
      cost: number;
    }> = [];

    // Pass turn action (always available)
    actions.push({
      action: 'pass',
      cost: 0,
    });

    // Play cards from hand
    this.gameState.ai.hand.forEach(card => {
      if (card.cost <= this.gameState!.ai.mana) {
        actions.push({
          action: 'play_card',
          card,
          cost: card.cost,
        });
      }
    });

    // Attack with creatures
    this.gameState.ai.boardState.forEach(creature => {
      if (creature.type === 'Familiar' && !creature.isTapped) {
        actions.push({
          action: 'attack',
          card: creature,
          target: 'player',
          cost: 0,
        });
      }
    });

    // Use activated abilities (if any)
    this.gameState.ai.boardState.forEach(card => {
      if (card.keywords?.includes('Activated')) {
        actions.push({
          action: 'activate_ability',
          card,
          cost: 1, // Simplified cost
        });
      }
    });

    return actions;
  }

  // Evaluate an action based on AI personality and game state
  private evaluateAction(
    action: {
      action: string;
      card?: Card;
      target?: string;
      cost: number;
    },
    gameState: GameState
  ): number {
    let score = 0;
    const { playstyle, strategicWeights } = this.personality;

    switch (action.action) {
      case 'play_card':
        if (action.card) {
          score += this.evaluateCardPlay(action.card, gameState);
        }
        break;

      case 'attack':
        score += this.evaluateAttack(action.card!, gameState);
        break;

      case 'activate_ability':
        score += this.evaluateAbility(action.card!, gameState);
        break;

      case 'pass':
        score += this.evaluatePass(gameState);
        break;
    }

    // Apply personality weights
    score *= this.getPersonalityMultiplier(action, gameState);

    // Add some randomness based on difficulty
    const randomFactor = (1 - playstyle.planningDepth / 5) * 0.2;
    score += (Math.random() - 0.5) * randomFactor * score;

    return score;
  }

  // Evaluate playing a specific card
  private evaluateCardPlay(card: Card, gameState: GameState): number {
    let score = 0;

    // Base value of the card
    score += card.strength || 3;

    // Mana efficiency
    const manaCostRatio = (card.strength || 3) / Math.max(card.cost, 1);
    score += manaCostRatio * 2;

    // Board state considerations
    const aiBoard = gameState.ai.boardState.length;
    const playerBoard = gameState.player.boardState.length;

    if (playerBoard > aiBoard) {
      // Behind on board, prioritize defensive cards
      if (card.keywords?.includes('Defensive')) {
        score += 3;
      }
    } else {
      // Ahead on board, prioritize aggressive cards
      if (card.keywords?.includes('Aggressive')) {
        score += 3;
      }
    }

    // Life totals consideration
    if (gameState.player.life <= 5) {
      // Player is low, prioritize damage
      if (card.type === 'Familiar') {
        score += 5;
      }
    }

    if (gameState.ai.life <= 5) {
      // AI is low, prioritize defense
      if (card.keywords?.includes('Defensive') || card.type === 'Flag') {
        score += 5;
      }
    }

    // Favorite cards bonus
    if (this.personality.favoriteCards.includes(card.id)) {
      score += 2;
    }

    return score;
  }

  // Evaluate attacking with a creature
  private evaluateAttack(creature: Card, gameState: GameState): number {
    let score = 0;
    const { playstyle } = this.personality;

    // Base damage value
    score += creature.strength || 2;

    // Aggression personality factor
    score *= (1 + playstyle.aggression);

    // Life pressure consideration
    if (gameState.player.life <= 10) {
      score += 3; // More valuable when opponent is low
    }

    // Board state consideration
    const playerDefenders = gameState.player.boardState.filter(
      c => c.type === 'Familiar'
    ).length;
    
    if (playerDefenders === 0) {
      score += 5; // Free damage
    } else if (playerDefenders < gameState.ai.boardState.length) {
      score += 2; // Favorable board state
    }

    // Risk assessment
    const riskPenalty = (1 - playstyle.riskTolerance) * 2;
    score -= riskPenalty;

    return score;
  }

  // Evaluate using an activated ability
  private evaluateAbility(card: Card, gameState: GameState): number {
    let score = 3; // Base utility value

    // Card advantage abilities are valued by control-oriented AIs
    if (this.personality.strategicWeights.control > 0.5) {
      score += 2;
    }

    return score;
  }

  // Evaluate passing the turn
  private evaluatePass(gameState: GameState): number {
    let score = 1; // Base pass value

    // If no good plays available, passing might be optimal
    if (gameState.ai.mana < 3) {
      score += 2;
    }

    // Control decks like to pass with open mana
    if (this.personality.deckArchetype === 'control') {
      score += 1;
    }

    return score;
  }

  // Apply personality-based multipliers to actions
  private getPersonalityMultiplier(
    action: { action: string; card?: Card },
    gameState: GameState
  ): number {
    const { playstyle, strategicWeights, deckArchetype } = this.personality;
    let multiplier = 1;

    // Archetype-based preferences
    switch (deckArchetype) {
      case 'aggro':
        if (action.action === 'attack' || 
            (action.action === 'play_card' && action.card?.type === 'Familiar')) {
          multiplier += 0.3;
        }
        break;

      case 'control':
        if (action.action === 'pass' || 
            (action.action === 'play_card' && action.card?.type === 'Flag')) {
          multiplier += 0.3;
        }
        break;

      case 'midrange':
        // Balanced approach, no specific bonuses
        break;

      case 'combo':
        if (action.action === 'play_card' && 
            action.card?.keywords?.includes('Combo')) {
          multiplier += 0.5;
        }
        break;

      case 'ramp':
        if (action.action === 'play_card' && action.card?.cost && action.card.cost >= 5) {
          multiplier += 0.3;
        }
        break;
    }

    // Turn-based strategy adjustments
    const earlyGame = gameState.turn <= 3;
    const midGame = gameState.turn > 3 && gameState.turn <= 7;
    const lateGame = gameState.turn > 7;

    if (earlyGame) {
      multiplier *= (1 + strategicWeights.tempo * 0.3);
    } else if (midGame) {
      multiplier *= (1 + strategicWeights.midrange * 0.3);
    } else if (lateGame) {
      multiplier *= (1 + strategicWeights.control * 0.3);
    }

    return multiplier;
  }

  // Select action with personality-based decision making
  private selectActionWithPersonality(
    evaluatedActions: Array<{
      action: string;
      card?: Card;
      target?: string;
      cost: number;
      score: number;
    }>
  ): {
    action: string;
    target?: string;
    confidence: number;
    reasoning: string;
  } {
    const { playstyle } = this.personality;
    
    // Higher difficulty AIs are more likely to pick the best action
    const skillLevel = playstyle.planningDepth / 5;
    const topChoices = Math.ceil(evaluatedActions.length * (1 - skillLevel + 0.2));
    const candidateActions = evaluatedActions.slice(0, Math.max(1, topChoices));

    // Select from candidates with weighted randomness
    const totalScore = candidateActions.reduce((sum, action) => sum + Math.max(0, action.score), 0);
    let randomValue = Math.random() * totalScore;
    
    let selectedAction = candidateActions[0];
    for (const action of candidateActions) {
      randomValue -= Math.max(0, action.score);
      if (randomValue <= 0) {
        selectedAction = action;
        break;
      }
    }

    // Generate reasoning
    let reasoning = this.generateReasoning(selectedAction);

    // Calculate confidence based on score difference and planning depth
    const bestScore = evaluatedActions[0]?.score || 0;
    const confidence = Math.min(
      1,
      (selectedAction.score / Math.max(bestScore, 1)) * (playstyle.planningDepth / 5)
    );

    return {
      action: selectedAction.action,
      target: selectedAction.target,
      confidence,
      reasoning,
    };
  }

  // Generate human-readable reasoning for AI decisions
  private generateReasoning(action: {
    action: string;
    card?: Card;
    score: number;
  }): string {
    const reasons: string[] = [];

    switch (action.action) {
      case 'play_card':
        if (action.card) {
          reasons.push(`Playing ${action.card.name} for board presence`);
          if (action.card.strength && action.card.strength >= 5) {
            reasons.push('High-impact creature');
          }
          if (this.personality.favoriteCards.includes(action.card.id)) {
            reasons.push('Favored card choice');
          }
        }
        break;

      case 'attack':
        reasons.push('Applying pressure');
        if (this.gameState?.player.life && this.gameState.player.life <= 10) {
          reasons.push('Opponent in danger zone');
        }
        break;

      case 'activate_ability':
        reasons.push('Using available ability');
        break;

      case 'pass':
        reasons.push('Conserving resources');
        if (this.personality.deckArchetype === 'control') {
          reasons.push('Control strategy');
        }
        break;
    }

    return reasons.join(', ') || 'Calculated optimal play';
  }

  // Analyze player's strategy over time
  private analyzePlayerStrategy(): void {
    if (!this.gameState || this.decisionHistory.length < 3) return;

    // Simple strategy detection based on recent plays
    const recentActions = this.decisionHistory.slice(-5);
    
    let aggroScore = 0;
    let controlScore = 0;
    let midrangeScore = 0;

    recentActions.forEach(action => {
      if (action.includes('attack')) aggroScore++;
      if (action.includes('pass')) controlScore++;
      if (action.includes('play_card')) midrangeScore++;
    });

    if (aggroScore > controlScore && aggroScore > midrangeScore) {
      this.playerStrategy = 'aggro';
    } else if (controlScore > aggroScore && controlScore > midrangeScore) {
      this.playerStrategy = 'control';
    } else {
      this.playerStrategy = 'midrange';
    }

    // Increase adaptation level
    this.adaptationLevel = Math.min(1, this.adaptationLevel + 0.1);
  }

  // Get AI's response to player strategy
  getCounterStrategy(): string {
    switch (this.playerStrategy) {
      case 'aggro':
        return 'Adapting defensive strategy';
      case 'control':
        return 'Increasing pressure';
      case 'midrange':
        return 'Matching pace';
      default:
        return 'Analyzing opponent';
    }
  }

  // Get AI's current thoughts for display
  getCurrentThoughts(): string[] {
    const thoughts: string[] = [];
    
    if (this.gameState) {
      if (this.gameState.ai.life <= 5) {
        thoughts.push('Need to stabilize quickly');
      }
      
      if (this.gameState.player.life <= 10) {
        thoughts.push('Opponent is vulnerable');
      }

      if (this.adaptationLevel > 0.5) {
        thoughts.push(`Adapted to ${this.playerStrategy} strategy`);
      }

      if (this.personality.playstyle.planningDepth >= 4) {
        thoughts.push('Calculating multiple turns ahead');
      }
    }

    return thoughts.length > 0 ? thoughts : ['Considering options...'];
  }

  // Reset AI state for new game
  reset(): void {
    this.gameState = null;
    this.decisionHistory = [];
    this.playerStrategy = 'unknown';
    this.adaptationLevel = 0;
  }
}

// AI Opponent Selection Component
interface AIOpponentSelectorProps {
  onSelectOpponent: (opponent: AIPersonality) => void;
  currentOpponent?: AIPersonality;
}

export const AIOpponentSelector: React.FC<AIOpponentSelectorProps> = ({
  onSelectOpponent,
  currentOpponent
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('casual');

  const filteredOpponents = AI_OPPONENTS.filter(
    opponent => opponent.difficulty === selectedDifficulty
  );

  return (
    <div className="ai-opponent-selector">
      <style>{`
        .ai-opponent-selector {
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          color: white;
          max-width: 800px;
          margin: 0 auto;
        }

        .difficulty-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .difficulty-tab {
          background: rgba(139, 69, 19, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .difficulty-tab.active {
          background: rgba(139, 69, 19, 0.6);
          border-color: rgba(139, 69, 19, 0.8);
        }

        .difficulty-tab:hover {
          background: rgba(139, 69, 19, 0.5);
        }

        .opponents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
        }

        .opponent-card {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .opponent-card:hover {
          background: rgba(139, 69, 19, 0.3);
          border-color: rgba(139, 69, 19, 0.7);
          transform: translateY(-2px);
        }

        .opponent-card.selected {
          border-color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
        }

        .opponent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .opponent-avatar {
          font-size: 32px;
        }

        .opponent-name {
          font-size: 18px;
          font-weight: bold;
          color: #ffd700;
        }

        .opponent-difficulty {
          background: rgba(0, 123, 255, 0.3);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: bold;
        }

        .opponent-description {
          color: #ccc;
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .opponent-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }

        .stat-item {
          font-size: 12px;
        }

        .stat-label {
          color: #ccc;
          display: block;
        }

        .stat-bar {
          background: rgba(0, 0, 0, 0.3);
          height: 4px;
          border-radius: 2px;
          margin-top: 4px;
          overflow: hidden;
        }

        .stat-fill {
          background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f);
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .opponent-traits {
          margin-top: 15px;
        }

        .trait-section {
          margin-bottom: 10px;
        }

        .trait-label {
          font-size: 12px;
          color: #ccc;
          margin-bottom: 5px;
        }

        .trait-list {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .trait-tag {
          background: rgba(0, 123, 255, 0.2);
          color: #87ceeb;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
        }

        .strength-tag {
          background: rgba(40, 167, 69, 0.2);
          color: #90ee90;
        }

        .weakness-tag {
          background: rgba(220, 53, 69, 0.2);
          color: #ffa0a0;
        }
      `}</style>

      <h3>Choose Your Opponent</h3>
      
      <div className="difficulty-tabs">
        {(['beginner', 'casual', 'competitive', 'expert', 'legendary'] as AIDifficulty[]).map(difficulty => (
          <button
            key={difficulty}
            className={`difficulty-tab ${selectedDifficulty === difficulty ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      <div className="opponents-grid">
        {filteredOpponents.map(opponent => (
          <motion.div
            key={opponent.name}
            className={`opponent-card ${currentOpponent?.name === opponent.name ? 'selected' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              audioManager.playCardPlace();
              onSelectOpponent(opponent);
            }}
          >
            <div className="opponent-header">
              <div className="opponent-avatar">{opponent.avatar}</div>
              <div>
                <div className="opponent-name">{opponent.name}</div>
                <div className="opponent-difficulty">{opponent.difficulty}</div>
              </div>
            </div>

            <div className="opponent-description">{opponent.description}</div>

            <div className="opponent-stats">
              <div className="stat-item">
                <span className="stat-label">Aggression</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ width: `${opponent.playstyle.aggression * 100}%` }}
                  />
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-label">Strategy</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ width: `${opponent.playstyle.planningDepth * 20}%` }}
                  />
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-label">Risk Taking</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ width: `${opponent.playstyle.riskTolerance * 100}%` }}
                  />
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-label">Adaptability</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill" 
                    style={{ width: `${opponent.playstyle.adaptability * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="opponent-traits">
              <div className="trait-section">
                <div className="trait-label">Strengths</div>
                <div className="trait-list">
                  {opponent.strengths.slice(0, 2).map(strength => (
                    <span key={strength} className="trait-tag strength-tag">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
              <div className="trait-section">
                <div className="trait-label">Weaknesses</div>
                <div className="trait-list">
                  {opponent.weaknesses.slice(0, 2).map(weakness => (
                    <span key={weakness} className="trait-tag weakness-tag">
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIOpponent;