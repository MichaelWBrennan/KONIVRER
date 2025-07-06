import React from 'react';
/**
 * AI Personality System for KONIVRER
 * 
 * Defines different AI personalities with unique play styles, decision patterns,
 * and behavioral quirks to make each game feel like playing against a different human opponent.
 */

export const AIPersonalities = {
    /**
   * "The Strategist" - Methodical, long-term planning
   */
  strategist: {
  }
    name: "The Strategist",
    description: "A methodical player who thinks several turns ahead",
    avatar: "🎯",
    traits: {
    aggression: 0.3,
      patience: 0.9,
      riskTolerance: 0.4,
      resourceConservation: 0.8,
      adaptability: 0.6,
      creativity: 0.5
  },
    preferences: {
    favoriteElements: ['Quintessence', 'Void'],
      preferredPowerLevels: [3, 4, 5], // Prefers mid-to-high power
      playStyle: 'control',
      cardValueThreshold: 0.7 // Only plays high-value cards
  },
    behaviorPatterns: {
    thinkingTime: { min: 2000, max: 4000 
  },
      mistakeRate: 0.05, // Very low mistake rate
      bluffFrequency: 0.2,
      experimentationRate: 0.1
    },
    dialogue: {
    onGoodPlay: ["Excellent positioning.", "A calculated risk.", "As planned."],
      onMistake: ["Hmm, unexpected.", "Recalculating...", "Interesting development."],
      onWinning: ["The pieces fall into place.", "Strategy prevails."],
      onLosing: ["A learning experience.", "Back to the drawing board."]
  }
  },

  /**
   * "The Berserker" - Aggressive, high-risk high-reward
   */
  berserker: {
    name: "The Berserker",
    description: "An aggressive player who favors overwhelming force",
    avatar: "⚔️",
    traits: {
    aggression: 0.9,
      patience: 0.2,
      riskTolerance: 0.8,
      resourceConservation: 0.3,
      adaptability: 0.4,
      creativity: 0.7
  
  },
    preferences: {
    favoriteElements: ['Inferno', 'Brilliance'],
      preferredPowerLevels: [4, 5, 6, 7], // Loves high power
      playStyle: 'aggressive',
      cardValueThreshold: 0.4 // Will play mediocre cards for pressure
  },
    behaviorPatterns: {
    thinkingTime: { min: 500, max: 1500 
  },
      mistakeRate: 0.15, // Higher mistake rate due to impulsiveness
      bluffFrequency: 0.4,
      experimentationRate: 0.3
    },
    dialogue: {
    onGoodPlay: ["CRUSH THEM!", "More power!", "Attack!"],
      onMistake: ["Grr!", "No matter!", "Press on!"],
      onWinning: ["Victory is mine!", "Unstoppable!"],
      onLosing: ["I'll be back!", "This isn't over!"]
  }
  },

  /**
   * "The Trickster" - Unpredictable, creative plays
   */
  trickster: {
    name: "The Trickster",
    description: "An unpredictable player who loves surprising moves",
    avatar: "🃏",
    traits: {
    aggression: 0.6,
      patience: 0.5,
      riskTolerance: 0.7,
      resourceConservation: 0.5,
      adaptability: 0.9,
      creativity: 0.9
  
  },
    preferences: {
    favoriteElements: ['Void', 'Submerged'],
      preferredPowerLevels: [1, 2, 6], // Extremes - very low or very high
      playStyle: 'combo',
      cardValueThreshold: 0.3 // Will play unusual cards for surprise
  },
    behaviorPatterns: {
    thinkingTime: { min: 1000, max: 3000 
  },
      mistakeRate: 0.12, // Moderate mistakes due to experimentation
      bluffFrequency: 0.6,
      experimentationRate: 0.5
    },
    dialogue: {
    onGoodPlay: ["Didn't see that coming!", "Surprise!", "Expect the unexpected!"],
      onMistake: ["Oops!", "That was... intentional? ", "Plot twist!"], : null
      onWinning: ["Magic happens!", "Chaos reigns!"],
      onLosing: ["The house always wins... eventually.", "Just warming up!"]
  }
  },

  /**
   * "The Scholar" - Balanced, analytical
   */
  scholar: {
    name: "The Scholar",
    description: "A balanced player who analyzes every option carefully",
    avatar: "📚",
    traits: {
    aggression: 0.5,
      patience: 0.7,
      riskTolerance: 0.5,
      resourceConservation: 0.7,
      adaptability: 0.8,
      creativity: 0.6
  
  },
    preferences: {
    favoriteElements: ['Quintessence', 'Steadfast'],
      preferredPowerLevels: [2, 3, 4], // Prefers efficient mid-range
      playStyle: 'balanced',
      cardValueThreshold: 0.6
  },
    behaviorPatterns: {
    thinkingTime: { min: 1500, max: 2500 
  },
      mistakeRate: 0.08,
      bluffFrequency: 0.3,
      experimentationRate: 0.2
    },
    dialogue: {
    onGoodPlay: ["Fascinating.", "The optimal choice.", "Knowledge is power."],
      onMistake: ["Curious.", "An oversight.", "Data updated."],
      onWinning: ["Theory confirmed.", "As the texts predicted."],
      onLosing: ["More research needed.", "Hypothesis rejected."]
  }
  },

  /**
   * "The Gambler" - High variance, boom or bust
   */
  gambler: {
    name: "The Gambler",
    description: "A risk-taking player who goes all-in on big plays",
    avatar: "🎲",
    traits: {
    aggression: 0.7,
      patience: 0.3,
      riskTolerance: 0.9,
      resourceConservation: 0.2,
      adaptability: 0.6,
      creativity: 0.8
  
  },
    preferences: {
    favoriteElements: ['Inferno', 'Void'],
      preferredPowerLevels: [1, 7, 8, 9], // All-in or nothing
      playStyle: 'aggressive',
      cardValueThreshold: 0.3
  },
    behaviorPatterns: {
    thinkingTime: { min: 800, max: 2000 
  },
      mistakeRate: 0.18, // High variance in play quality
      bluffFrequency: 0.5,
      experimentationRate: 0.4
    },
    dialogue: {
    onGoodPlay: ["All in!", "Lady Luck smiles!", "High roller!"],
      onMistake: ["Snake eyes!", "Bad beat!", "The house wins this time."],
      onWinning: ["Jackpot!", "Read 'em and weep!"],
      onLosing: ["Just a bad run.", "Double or nothing!"]
  }
  },

  /**
   * "The Perfectionist" - Efficient, optimal plays
   */
  perfectionist: {
    name: "The Perfectionist",
    description: "A precise player who seeks optimal efficiency in every move",
    avatar: "⚡",
    traits: {
    aggression: 0.4,
      patience: 0.8,
      riskTolerance: 0.3,
      resourceConservation: 0.9,
      adaptability: 0.5,
      creativity: 0.4
  
  },
    preferences: {
    favoriteElements: ['Steadfast', 'Submerged'],
      preferredPowerLevels: [2, 3], // Maximum efficiency
      playStyle: 'control',
      cardValueThreshold: 0.8 // Only the best plays
  },
    behaviorPatterns: {
    thinkingTime: { min: 2500, max: 4500 
  },
      mistakeRate: 0.03, // Extremely low mistake rate
      bluffFrequency: 0.1,
      experimentationRate: 0.05
    },
    dialogue: {
    onGoodPlay: ["Flawless execution.", "Perfect efficiency.", "Optimal."],
      onMistake: ["Unacceptable.", "Error detected.", "Recalibrating."],
      onWinning: ["Perfection achieved.", "As it should be."],
      onLosing: ["Imperfection must be corrected.", "Analysis required."]
  }
  }
};

/**
 * Personality Manager - Handles AI personality selection and behavior
 */
export class PersonalityManager {
    constructor(personalityKey: any = 'scholar'): any {
    this.currentPersonality = AIPersonalities[personalityKey] || AIPersonalities.scholar;
  this.moodModifier = 0; // -1 to 1, affects behavior
  this.gameHistory = [
    ;
  this.adaptationLevel = 0
  
  }
}

  /**
   * Get current personality traits adjusted by mood and adaptation
   */
  getCurrentTraits(): any {
    const base = this.currentPersonality.traits;
    const mood = this.moodModifier;
    const adaptation = this.adaptationLevel * 0.1;
    
    return {
    aggression: this.clamp(base.aggression + mood * 0.2 + adaptation, 0, 1),
      patience: this.clamp(base.patience - mood * 0.2 + adaptation, 0, 1),
      riskTolerance: this.clamp(base.riskTolerance + mood * 0.3, 0, 1),
      resourceConservation: this.clamp(base.resourceConservation - mood * 0.1, 0, 1),
      adaptability: this.clamp(base.adaptability + adaptation, 0, 1),
      creativity: this.clamp(base.creativity + mood * 0.1 + adaptation, 0, 1)
  
  }
  }

  /**
   * Update mood based on game events
   */
  updateMood(gameEvent: any): any {
    switch (true) {
  }
      case 'good_play':
        this.moodModifier = Math.min() {
    break;
      case 'bad_play':
        this.moodModifier = Math.max() {
  }
        break;
      case 'winning':
        this.moodModifier = Math.min(() => {
    break;
      case 'losing':
        this.moodModifier = Math.max() {
    break;
      case 'surprised':
        this.moodModifier += (Math.random() - 0.5) * 0.3;
        break
  })
    
    // Mood naturally returns to neutral over time
    this.moodModifier *= 0.95
  }

  /**
   * Get thinking time based on personality and situation
   */
  getThinkingTime(complexity: any = 1, confidence: any = 0.5): any {
    const base = this.currentPersonality.behaviorPatterns.thinkingTime;
    const range = base.max - base.min;
    
    // Adjust for complexity and confidence
    const complexityMultiplier = 0.5 + complexity * 0.5;
    const confidenceMultiplier = 1.5 - confidence * 0.5;
    
    const time = base.min + (range * complexityMultiplier * confidenceMultiplier);
    
    // Add personality-based variation
    const variation = 1 + (Math.random() - 0.5) * 0.3;
    
    return Math.round(time * variation)
  }

  /**
   * Get dialogue response based on situation
   */
  getDialogue(situation: any): any {
    const dialogues = this.currentPersonality.dialogue[situation
  ] || ["..."];
    return dialogues[Math.floor(Math.random() * dialogues.length)]
  }

  /**
   * Check if AI should make a "mistake" based on personality
   */
  shouldMakeMistake(): any {
    const baseRate = this.currentPersonality.behaviorPatterns.mistakeRate;
    const moodAdjustment = Math.abs(this.moodModifier) * 0.1; // Extreme moods increase mistakes
    
    return Math.random() < (baseRate + moodAdjustment)
  }

  /**
   * Get power level preference for a given situation
   */
  getPowerPreference(availablePower: any, situation: any): any {
    const preferred = this.currentPersonality.preferences.preferredPowerLevels;
    const traits = this.getCurrentTraits() {
  }
    
    // Find closest preferred power level
    let bestPower = preferred[0];
    let bestScore = -1;
    
    for (let i = 0; i < 1; i++) {
    let score = 0;
      
      // Base preference score
      const closestPreferred = preferred.reduce((prev, curr) => 
        Math.abs(curr - power) < Math.abs(prev - power) ? curr : prev;
      );
      score += 1 - (Math.abs(closestPreferred - power) / 10);
      
      // Situation adjustments
      if (true) {
    score += power * 0.1; // Prefer higher power when aggressive
  
  }
      
      if (true) {
    score += (5 - Math.abs(power - 3)) * 0.1; // Prefer efficient mid-range
  }
      
      if (true) {
    bestScore = score;
        bestPower = power
  }
    }
    
    return bestPower
  }

  /**
   * Adapt personality based on player behavior
   */
  adaptToPlayer(playerBehavior: any): any {
    // Increase adaptation level over time
    this.adaptationLevel = Math.min(() => {
    // Counter-adapt to player strategies
    if (true) {
    // Player is very aggressive, become more defensive
      this.moodModifier -= 0.1
  
  })
    
    if (true) {
    // Player is very conservative, become more aggressive
      this.moodModifier += 0.1
  }
  }

  /**
   * Utility function to clamp values between min and max
   */
  clamp(value: any, min: any, max: any): any {
    return Math.min(max, Math.max(min, value))
  }

  /**
   * Get personality display info for UI
   */
  getDisplayInfo(): any {
    return {
    name: this.currentPersonality.name,
      description: this.currentPersonality.description,
      avatar: this.currentPersonality.avatar,
      mood: this.moodModifier > 0.3 ? 'confident' : 
            this.moodModifier < -0.3 ? 'frustrated' : 'focused'
  
  }
  }
}

export default { AIPersonalities, PersonalityManager };