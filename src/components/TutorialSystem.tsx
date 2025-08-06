import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tutorial System Types
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'type' | 'wait';
  actionTarget?: string;
  actionValue?: string;
  isOptional: boolean;
  canSkip: boolean;
  nextButton?: string;
  prevButton?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'advanced' | 'deckbuilding' | 'combat' | 'strategy';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  prerequisites: string[]; // other tutorial IDs
  steps: TutorialStep[];
  rewards: {
    experience: number;
    cards?: string[];
    gold?: number;
  };
  isCompleted: boolean;
  completedAt?: Date;
}

// Tutorial definitions
const TUTORIAL_DEFINITIONS: Omit<Tutorial, 'isCompleted' | 'completedAt'>[] = [
  {
    id: 'game_basics',
    title: 'Game Basics',
    description: 'Learn the fundamental mechanics of KONIVRER',
    category: 'basics',
    difficulty: 'beginner',
    estimatedTime: 5,
    prerequisites: [],
    rewards: {
      experience: 100,
      cards: ['ASH', 'DUST'],
      gold: 50,
    },
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to KONIVRER!',
        description: 'Welcome to the mystical world of KONIVRER! This tutorial will teach you everything you need to know to become a skilled duelist.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Let\'s Begin!',
      },
      {
        id: 'game_board',
        title: 'The Game Board',
        description: 'This is the game board where all the action happens. You can see your hand at the bottom, the battlefield in the middle, and your opponent\'s hand at the top.',
        target: '.enhanced-deck-builder, .game-board, .battlefield',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Continue',
      },
      {
        id: 'your_hand',
        title: 'Your Hand',
        description: 'These are the cards in your hand. You can play cards from your hand by clicking on them, as long as you have enough mana.',
        target: '.player-hand, .cards-grid',
        position: 'top',
        isOptional: false,
        canSkip: false,
        nextButton: 'Got it!',
      },
      {
        id: 'mana_system',
        title: 'Mana System',
        description: 'Mana is the resource you use to play cards. Each card has a mana cost shown in the top-right corner. You gain 1 mana each turn.',
        target: '.mana-display, .card-cost',
        position: 'left',
        isOptional: false,
        canSkip: false,
        nextButton: 'Understood',
      },
      {
        id: 'card_types',
        title: 'Card Types',
        description: 'There are two main types of cards: Familiars (creatures) and Flags (support cards). Familiars can attack and defend, while Flags provide ongoing effects.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Continue',
      },
      {
        id: 'playing_cards',
        title: 'Playing Cards',
        description: 'To play a card, simply click on it in your hand. If you have enough mana, the card will be played to the battlefield.',
        target: '.card-item',
        position: 'top',
        action: 'click',
        actionTarget: '.card-item',
        isOptional: false,
        canSkip: true,
        nextButton: 'Try it!',
      },
      {
        id: 'combat_basics',
        title: 'Combat Basics',
        description: 'During your turn, you can attack with your Familiars. Click on a Familiar and then click on your opponent or one of their Familiars to attack.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Ready to fight!',
      },
      {
        id: 'winning_condition',
        title: 'How to Win',
        description: 'Reduce your opponent\'s life to 0 to win the game! You start with 20 life, and taking damage reduces it. Plan your strategy carefully!',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'I\'m ready!',
      },
    ],
  },
  {
    id: 'deck_building',
    title: 'Deck Building Basics',
    description: 'Learn how to create powerful decks',
    category: 'deckbuilding',
    difficulty: 'beginner',
    estimatedTime: 8,
    prerequisites: ['game_basics'],
    rewards: {
      experience: 150,
      cards: ['GEODE', 'STORM', 'SALAMANDER'],
      gold: 100,
    },
    steps: [
      {
        id: 'deck_builder_intro',
        title: 'Welcome to Deck Building',
        description: 'Building a good deck is crucial for success in KONIVRER. Let\'s learn the fundamentals of deck construction.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Let\'s build!',
      },
      {
        id: 'deck_size',
        title: 'Deck Size Requirements',
        description: 'A deck must have at least 60 cards and no more than 4 copies of any single card. This ensures variety and fair play.',
        target: '.deck-stats, .validation-panel',
        position: 'left',
        isOptional: false,
        canSkip: false,
        nextButton: 'Understood',
      },
      {
        id: 'mana_curve',
        title: 'Understanding Mana Curve',
        description: 'The mana curve shows the distribution of card costs in your deck. A balanced curve helps ensure you can play cards at every stage of the game.',
        target: '.mana-curve',
        position: 'right',
        isOptional: false,
        canSkip: false,
        nextButton: 'Makes sense',
      },
      {
        id: 'card_synergy',
        title: 'Card Synergy',
        description: 'Look for cards that work well together. Cards with similar elements or complementary abilities can create powerful combinations.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Continue',
      },
      {
        id: 'adding_cards',
        title: 'Adding Cards to Your Deck',
        description: 'Click on any card in the collection to add it to your deck. Use the filters to find specific types of cards you need.',
        target: '.cards-grid .card-item',
        position: 'top',
        action: 'click',
        actionTarget: '.card-item',
        isOptional: true,
        canSkip: true,
        nextButton: 'Add a card',
      },
      {
        id: 'deck_validation',
        title: 'Deck Validation',
        description: 'The system will validate your deck and show any errors or warnings. Fix all errors before you can save and use your deck.',
        target: '.validation-panel',
        position: 'left',
        isOptional: false,
        canSkip: false,
        nextButton: 'Got it',
      },
      {
        id: 'saving_deck',
        title: 'Saving Your Deck',
        description: 'Once your deck is valid, you can save it and give it a name. You can create multiple decks for different strategies.',
        target: '.action-btn',
        position: 'bottom',
        isOptional: false,
        canSkip: false,
        nextButton: 'Ready to save!',
      },
    ],
  },
  {
    id: 'advanced_combat',
    title: 'Advanced Combat',
    description: 'Master the intricacies of combat',
    category: 'combat',
    difficulty: 'intermediate',
    estimatedTime: 10,
    prerequisites: ['game_basics'],
    rewards: {
      experience: 200,
      cards: ['BRIGHTLAVA', 'CHAOSLIGHTNING'],
      gold: 150,
    },
    steps: [
      {
        id: 'combat_intro',
        title: 'Advanced Combat Tactics',
        description: 'Now that you know the basics, let\'s explore advanced combat mechanics and strategies.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Teach me!',
      },
      {
        id: 'creature_abilities',
        title: 'Creature Abilities',
        description: 'Many creatures have special abilities. Some have keywords like "Flying" or "Defensive" that affect how they fight.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Continue',
      },
      {
        id: 'timing_matters',
        title: 'Timing is Everything',
        description: 'When you play cards and use abilities matters. Sometimes it\'s better to wait for the right moment rather than playing everything immediately.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'I understand',
      },
      {
        id: 'combat_math',
        title: 'Combat Mathematics',
        description: 'Learn to calculate damage and predict combat outcomes. Consider your creature\'s power, the opponent\'s toughness, and any modifiers.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Show me',
      },
      {
        id: 'defensive_play',
        title: 'Playing Defense',
        description: 'Sometimes the best strategy is defense. Use your creatures to block incoming attacks and protect your life total.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Defense noted',
      },
    ],
  },
  {
    id: 'ai_opponents',
    title: 'Facing AI Opponents',
    description: 'Learn to adapt to different AI personalities',
    category: 'strategy',
    difficulty: 'intermediate',
    estimatedTime: 6,
    prerequisites: ['game_basics'],
    rewards: {
      experience: 120,
      gold: 75,
    },
    steps: [
      {
        id: 'ai_intro',
        title: 'Understanding AI Opponents',
        description: 'Each AI opponent has a unique personality and strategy. Learning to recognize and counter their patterns is key to victory.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Tell me more',
      },
      {
        id: 'difficulty_levels',
        title: 'Difficulty Levels',
        description: 'AI opponents range from Beginner to Legendary. Start with easier opponents and work your way up as you improve.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Makes sense',
      },
      {
        id: 'ai_patterns',
        title: 'Recognizing AI Patterns',
        description: 'Pay attention to how each AI plays. Aggressive AIs attack often, while control AIs prefer to play defensively and react to your moves.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'I\'ll watch for that',
      },
      {
        id: 'countering_strategies',
        title: 'Counter-Strategies',
        description: 'Against aggressive AIs, focus on defense and efficient trades. Against control AIs, apply pressure early and force them to react.',
        position: 'center',
        isOptional: false,
        canSkip: false,
        nextButton: 'Good strategy',
      },
    ],
  },
];

// Tutorial Manager
export class TutorialManager {
  private tutorials: Map<string, Tutorial> = new Map();
  private currentTutorial: Tutorial | null = null;
  private currentStepIndex: number = 0;
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeTutorials();
    this.loadProgress();
  }

  private initializeTutorials(): void {
    TUTORIAL_DEFINITIONS.forEach(tutorialDef => {
      const tutorial: Tutorial = {
        ...tutorialDef,
        isCompleted: false,
      };
      this.tutorials.set(tutorial.id, tutorial);
    });
  }

  // Get all available tutorials
  getAvailableTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values()).filter(tutorial => 
      this.arePrerequisitesMet(tutorial.prerequisites)
    );
  }

  // Get completed tutorials
  getCompletedTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values()).filter(tutorial => tutorial.isCompleted);
  }

  // Check if prerequisites are met
  private arePrerequisitesMet(prerequisites: string[]): boolean {
    return prerequisites.every(prereqId => {
      const prereq = this.tutorials.get(prereqId);
      return prereq && prereq.isCompleted;
    });
  }

  // Start a tutorial
  startTutorial(tutorialId: string): boolean {
    const tutorial = this.tutorials.get(tutorialId);
    if (!tutorial || !this.arePrerequisitesMet(tutorial.prerequisites)) {
      return false;
    }

    this.currentTutorial = tutorial;
    this.currentStepIndex = 0;
    this.notifyListeners('tutorial_started', tutorial);
    return true;
  }

  // Get current tutorial
  getCurrentTutorial(): Tutorial | null {
    return this.currentTutorial;
  }

  // Get current step
  getCurrentStep(): TutorialStep | null {
    if (!this.currentTutorial || this.currentStepIndex >= this.currentTutorial.steps.length) {
      return null;
    }
    return this.currentTutorial.steps[this.currentStepIndex];
  }

  // Go to next step
  nextStep(): boolean {
    if (!this.currentTutorial) return false;

    this.currentStepIndex++;
    
    if (this.currentStepIndex >= this.currentTutorial.steps.length) {
      // Tutorial completed
      this.completeTutorial();
      return false;
    }

    this.notifyListeners('tutorial_step_changed', {
      tutorial: this.currentTutorial,
      step: this.getCurrentStep(),
      stepIndex: this.currentStepIndex,
    });
    
    return true;
  }

  // Go to previous step
  previousStep(): boolean {
    if (!this.currentTutorial || this.currentStepIndex <= 0) return false;

    this.currentStepIndex--;
    this.notifyListeners('tutorial_step_changed', {
      tutorial: this.currentTutorial,
      step: this.getCurrentStep(),
      stepIndex: this.currentStepIndex,
    });
    
    return true;
  }

  // Skip current step
  skipStep(): boolean {
    const currentStep = this.getCurrentStep();
    if (!currentStep || !currentStep.canSkip) return false;
    
    return this.nextStep();
  }

  // Complete tutorial
  private completeTutorial(): void {
    if (!this.currentTutorial) return;

    this.currentTutorial.isCompleted = true;
    this.currentTutorial.completedAt = new Date();
    
    // Award rewards
    this.awardTutorialRewards(this.currentTutorial.rewards);
    
    this.notifyListeners('tutorial_completed', this.currentTutorial);
    this.saveProgress();
    
    this.currentTutorial = null;
    this.currentStepIndex = 0;
  }

  // Exit tutorial
  exitTutorial(): void {
    if (this.currentTutorial) {
      this.notifyListeners('tutorial_exited', this.currentTutorial);
      this.currentTutorial = null;
      this.currentStepIndex = 0;
    }
  }

  // Award tutorial rewards
  private awardTutorialRewards(rewards: Tutorial['rewards']): void {
    // In a real game, this would integrate with the progression system
    console.log('Tutorial rewards awarded:', rewards);
    this.notifyListeners('tutorial_rewards_awarded', rewards);
  }

  // Get tutorial progress
  getTutorialProgress(): {
    completed: number;
    total: number;
    percentage: number;
  } {
    const completed = this.getCompletedTutorials().length;
    const total = TUTORIAL_DEFINITIONS.length;
    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  // Add event listener
  addEventListener(listener: (event: string, data: any) => void): void {
    this.listeners.push(listener);
  }

  // Remove event listener
  removeEventListener(listener: (event: string, data: any) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify listeners
  private notifyListeners(event: string, data: any): void {
    this.listeners.forEach(listener => listener(event, data));
  }

  // Save progress
  private saveProgress(): void {
    try {
      const data = {
        tutorials: Array.from(this.tutorials.values()).map(tutorial => ({
          id: tutorial.id,
          isCompleted: tutorial.isCompleted,
          completedAt: tutorial.completedAt,
        })),
      };
      localStorage.setItem('konivrer_tutorials', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save tutorial progress:', error);
    }
  }

  // Load progress
  private loadProgress(): void {
    try {
      const saved = localStorage.getItem('konivrer_tutorials');
      if (saved) {
        const data = JSON.parse(saved);
        data.tutorials?.forEach((tutorialData: any) => {
          const tutorial = this.tutorials.get(tutorialData.id);
          if (tutorial) {
            tutorial.isCompleted = tutorialData.isCompleted;
            if (tutorialData.completedAt) {
              tutorial.completedAt = new Date(tutorialData.completedAt);
            }
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load tutorial progress:', error);
    }
  }
}

// Global tutorial manager
export const tutorialManager = new TutorialManager();

// Tutorial Component
export const TutorialOverlay: React.FC = () => {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateTutorialState = () => {
      setCurrentTutorial(tutorialManager.getCurrentTutorial());
      setCurrentStep(tutorialManager.getCurrentStep());
      setStepIndex(tutorialManager.currentStepIndex);
      setIsVisible(tutorialManager.getCurrentTutorial() !== null);
    };

    const listener = (event: string, data: any) => {
      updateTutorialState();
    };

    tutorialManager.addEventListener(listener);
    updateTutorialState();

    return () => tutorialManager.removeEventListener(listener);
  }, []);

  if (!isVisible || !currentTutorial || !currentStep) {
    return null;
  }

  const progress = ((stepIndex + 1) / currentTutorial.steps.length) * 100;

  return (
    <div className="tutorial-overlay">
      <style>{`
        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10000;
          pointer-events: auto;
        }

        .tutorial-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .tutorial-content {
          position: absolute;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          border: 2px solid rgba(139, 69, 19, 0.5);
          border-radius: 12px;
          padding: 20px;
          max-width: 400px;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .tutorial-content.center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .tutorial-content.top {
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
        }

        .tutorial-content.bottom {
          top: 120%;
          left: 50%;
          transform: translateX(-50%);
        }

        .tutorial-content.left {
          right: 120%;
          top: 50%;
          transform: translateY(-50%);
        }

        .tutorial-content.right {
          left: 120%;
          top: 50%;
          transform: translateY(-50%);
        }

        .tutorial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .tutorial-title {
          font-size: 18px;
          font-weight: bold;
          color: #ffd700;
        }

        .tutorial-close {
          background: rgba(220, 53, 69, 0.3);
          border: 1px solid rgba(220, 53, 69, 0.5);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .tutorial-close:hover {
          background: rgba(220, 53, 69, 0.5);
        }

        .tutorial-description {
          color: #ccc;
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .tutorial-progress {
          background: rgba(0, 0, 0, 0.3);
          height: 4px;
          border-radius: 2px;
          margin-bottom: 15px;
          overflow: hidden;
        }

        .tutorial-progress-fill {
          background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f);
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .tutorial-step-info {
          font-size: 12px;
          color: #888;
          margin-bottom: 15px;
        }

        .tutorial-actions {
          display: flex;
          gap: 10px;
          justify-content: space-between;
          align-items: center;
        }

        .tutorial-nav {
          display: flex;
          gap: 8px;
        }

        .tutorial-btn {
          background: rgba(139, 69, 19, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .tutorial-btn:hover {
          background: rgba(139, 69, 19, 0.5);
        }

        .tutorial-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tutorial-btn.primary {
          background: rgba(0, 123, 255, 0.3);
          border-color: rgba(0, 123, 255, 0.5);
        }

        .tutorial-btn.primary:hover {
          background: rgba(0, 123, 255, 0.5);
        }

        .tutorial-btn.skip {
          background: rgba(108, 117, 125, 0.3);
          border-color: rgba(108, 117, 125, 0.5);
        }

        .tutorial-btn.skip:hover {
          background: rgba(108, 117, 125, 0.5);
        }

        .tutorial-highlight {
          position: absolute;
          border: 3px solid #ffd700;
          border-radius: 8px;
          pointer-events: none;
          animation: tutorialPulse 2s infinite;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        @keyframes tutorialPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }

        .tutorial-arrow {
          position: absolute;
          width: 0;
          height: 0;
        }

        .tutorial-arrow.top {
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid rgba(139, 69, 19, 0.5);
        }

        .tutorial-arrow.bottom {
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid rgba(139, 69, 19, 0.5);
        }

        .tutorial-arrow.left {
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 10px solid rgba(139, 69, 19, 0.5);
        }

        .tutorial-arrow.right {
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid rgba(139, 69, 19, 0.5);
        }
      `}</style>

      <div className="tutorial-backdrop" />
      
      <motion.div
        className={`tutorial-content ${currentStep.position}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep.position !== 'center' && (
          <div className={`tutorial-arrow ${currentStep.position}`} />
        )}
        
        <div className="tutorial-header">
          <div className="tutorial-title">{currentStep.title}</div>
          <button
            className="tutorial-close"
            onClick={() => tutorialManager.exitTutorial()}
          >
            ✕
          </button>
        </div>

        <div className="tutorial-description">{currentStep.description}</div>

        <div className="tutorial-progress">
          <div 
            className="tutorial-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="tutorial-step-info">
          Step {stepIndex + 1} of {currentTutorial.steps.length} • {currentTutorial.title}
        </div>

        <div className="tutorial-actions">
          <div className="tutorial-nav">
            <button
              className="tutorial-btn"
              disabled={stepIndex === 0}
              onClick={() => tutorialManager.previousStep()}
            >
              ← Previous
            </button>
            
            {currentStep.canSkip && (
              <button
                className="tutorial-btn skip"
                onClick={() => tutorialManager.skipStep()}
              >
                Skip
              </button>
            )}
          </div>

          <button
            className="tutorial-btn primary"
            onClick={() => tutorialManager.nextStep()}
          >
            {currentStep.nextButton || 'Next'} →
          </button>
        </div>
      </motion.div>

      {/* Highlight target element */}
      {currentStep.target && (
        <TutorialHighlight target={currentStep.target} />
      )}
    </div>
  );
};

// Tutorial Highlight Component
const TutorialHighlight: React.FC<{ target: string }> = ({ target }) => {
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updateHighlight = () => {
      const element = document.querySelector(target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightStyle({
          position: 'fixed',
          top: rect.top - 5,
          left: rect.left - 5,
          width: rect.width + 10,
          height: rect.height + 10,
          zIndex: 9999,
        });
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight);
    };
  }, [target]);

  return <div className="tutorial-highlight" style={highlightStyle} />;
};

// Tutorial Selection Component
interface TutorialSelectionProps {
  onClose?: () => void;
}

export const TutorialSelection: React.FC<TutorialSelectionProps> = ({ onClose }) => {
  const [availableTutorials, setAvailableTutorials] = useState<Tutorial[]>([]);
  const [completedTutorials, setCompletedTutorials] = useState<Tutorial[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  useEffect(() => {
    setAvailableTutorials(tutorialManager.getAvailableTutorials());
    setCompletedTutorials(tutorialManager.getCompletedTutorials());
  }, []);

  const progress = tutorialManager.getTutorialProgress();

  const getDifficultyColor = (difficulty: Tutorial['difficulty']): string => {
    switch (difficulty) {
      case 'beginner': return '#40c057';
      case 'intermediate': return '#ffd93d';
      case 'advanced': return '#ff6b6b';
      default: return '#868e96';
    }
  };

  const getCategoryIcon = (category: Tutorial['category']): string => {
    switch (category) {
      case 'basics': return '📚';
      case 'deckbuilding': return '🔧';
      case 'combat': return '⚔️';
      case 'strategy': return '🧠';
      case 'advanced': return '🎓';
      default: return '📖';
    }
  };

  return (
    <div className="tutorial-selection-overlay">
      <style>{`
        .tutorial-selection-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .tutorial-selection-modal {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          border-radius: 12px;
          padding: 30px;
          max-width: 800px;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
          position: relative;
          border: 2px solid rgba(139, 69, 19, 0.5);
        }

        .tutorial-selection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .tutorial-selection-title {
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
        }

        .tutorial-progress-summary {
          text-align: center;
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(139, 69, 19, 0.2);
          border-radius: 8px;
        }

        .progress-circle {
          font-size: 32px;
          color: #ffd700;
          margin-bottom: 10px;
        }

        .tutorial-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(139, 69, 19, 0.3);
        }

        .tutorial-tab {
          background: transparent;
          border: none;
          color: #ccc;
          padding: 12px 20px;
          border-radius: 6px 6px 0 0;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .tutorial-tab.active {
          background: rgba(139, 69, 19, 0.3);
          color: #ffd700;
          border-bottom: 2px solid #ffd700;
        }

        .tutorial-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 15px;
        }

        .tutorial-card {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tutorial-card:hover {
          background: rgba(139, 69, 19, 0.3);
          transform: translateY(-2px);
        }

        .tutorial-card.completed {
          background: rgba(40, 167, 69, 0.2);
          border-color: rgba(40, 167, 69, 0.5);
        }

        .tutorial-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .tutorial-card-title {
          font-size: 18px;
          font-weight: bold;
          color: #ffd700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tutorial-difficulty {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: bold;
        }

        .tutorial-card-description {
          color: #ccc;
          font-size: 14px;
          margin-bottom: 15px;
          line-height: 1.4;
        }

        .tutorial-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #888;
        }

        .tutorial-duration {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tutorial-prerequisites {
          font-size: 11px;
          color: #666;
          margin-top: 5px;
        }

        .tutorial-rewards {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .reward-item {
          background: rgba(255, 215, 0, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          color: #ffd700;
        }

        .start-tutorial-btn {
          background: rgba(0, 123, 255, 0.3);
          border: 1px solid rgba(0, 123, 255, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 10px;
          width: 100%;
        }

        .start-tutorial-btn:hover {
          background: rgba(0, 123, 255, 0.5);
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #888;
        }
      `}</style>

      <motion.div
        className="tutorial-selection-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="tutorial-selection-header">
          <h2 className="tutorial-selection-title">📚 Tutorials</h2>
          {onClose && (
            <button className="tutorial-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="tutorial-progress-summary">
          <div className="progress-circle">🎓</div>
          <div>
            <strong>{progress.completed}</strong> of <strong>{progress.total}</strong> tutorials completed
          </div>
          <div style={{ fontSize: '14px', color: '#888', marginTop: '5px' }}>
            {progress.percentage.toFixed(0)}% Progress
          </div>
        </div>

        <div className="tutorial-tabs">
          <button
            className={`tutorial-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available ({availableTutorials.length})
          </button>
          <button
            className={`tutorial-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedTutorials.length})
          </button>
        </div>

        <div className="tutorial-list">
          {activeTab === 'available' ? (
            availableTutorials.length > 0 ? (
              availableTutorials.map(tutorial => (
                <motion.div
                  key={tutorial.id}
                  className="tutorial-card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="tutorial-card-header">
                    <div className="tutorial-card-title">
                      <span>{getCategoryIcon(tutorial.category)}</span>
                      <span>{tutorial.title}</span>
                    </div>
                    <div 
                      className="tutorial-difficulty"
                      style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                    >
                      {tutorial.difficulty}
                    </div>
                  </div>
                  
                  <div className="tutorial-card-description">
                    {tutorial.description}
                  </div>

                  <div className="tutorial-card-meta">
                    <div className="tutorial-duration">
                      <span>⏱️</span>
                      <span>{tutorial.estimatedTime} min</span>
                    </div>
                    <div>{tutorial.steps.length} steps</div>
                  </div>

                  {tutorial.prerequisites.length > 0 && (
                    <div className="tutorial-prerequisites">
                      Prerequisites: {tutorial.prerequisites.join(', ')}
                    </div>
                  )}

                  <div className="tutorial-rewards">
                    <span className="reward-item">🔅 {tutorial.rewards.experience} XP</span>
                    {tutorial.rewards.gold && (
                      <span className="reward-item">💰 {tutorial.rewards.gold} Gold</span>
                    )}
                    {tutorial.rewards.cards && (
                      <span className="reward-item">🃏 {tutorial.rewards.cards.length} Cards</span>
                    )}
                  </div>

                  <button
                    className="start-tutorial-btn"
                    onClick={() => {
                      tutorialManager.startTutorial(tutorial.id);
                      onClose?.();
                    }}
                  >
                    Start Tutorial
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
                <div>All tutorials completed!</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  You've mastered all available tutorials
                </div>
              </div>
            )
          ) : (
            completedTutorials.length > 0 ? (
              completedTutorials.map(tutorial => (
                <motion.div
                  key={tutorial.id}
                  className="tutorial-card completed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="tutorial-card-header">
                    <div className="tutorial-card-title">
                      <span>{getCategoryIcon(tutorial.category)}</span>
                      <span>{tutorial.title}</span>
                      <span>✅</span>
                    </div>
                  </div>
                  
                  <div className="tutorial-card-description">
                    {tutorial.description}
                  </div>

                  <div className="tutorial-card-meta">
                    <div style={{ fontSize: '12px', color: '#40c057' }}>
                      Completed {tutorial.completedAt?.toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📚</div>
                <div>No tutorials completed yet</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  Complete tutorials to see them here
                </div>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialOverlay;