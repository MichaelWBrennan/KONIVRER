/**
 * MTG Arena Stack System - Handles spell/ability resolution, priority, and timing
 */

export interface StackObject {
  id: string;
  sourceId: string;
  controller: 'player' | 'opponent';
  name: string;
  description: string;
  type: 'spell' | 'ability' | 'triggered_ability' | 'activated_ability';
  manaCost?: number;
  targets?: string[];
  choices?: { [key: string]: any };
  timestamp: number;
  resolve: (gameState: any) => any;
  canBeCountered: boolean;
  isModal?: boolean;
  modes?: string[];
}

export interface Priority {
  activePlayer: 'player' | 'opponent';
  hasPassedPriority: boolean;
  consecutivePasses: number;
  fullControlMode: boolean;
  autoPassSettings: {
    enabled: boolean;
    passOnEmpty: boolean;
    passOnNoInstants: boolean;
    passOnCombat: boolean;
  };
}

export interface GameTiming {
  turn: number;
  activePlayer: 'player' | 'opponent';
  phase:
    | 'beginning'
    | 'precombat_main'
    | 'combat'
    | 'postcombat_main'
    | 'ending';
  step: string;
  canPlaySorceries: boolean;
  canPlayInstants: boolean;
  canActivateAbilities: boolean;
}

export class MTGStackSystem {
  private stack: StackObject[] = [];
  private priority: Priority;
  private timing: GameTiming;
  private triggers: StackObject[] = [];
  private stateBasedEffects: (() => boolean)[] = [];

  constructor() {
    this.priority = {
      activePlayer: 'player',
      hasPassedPriority: false,
      consecutivePasses: 0,
      fullControlMode: false,
      autoPassSettings: {
        enabled: true,
        passOnEmpty: true,
        passOnNoInstants: false,
        passOnCombat: false,
      },
    };

    this.timing = {
      turn: 1,
      activePlayer: 'player',
      phase: 'precombat_main',
      step: 'main',
      canPlaySorceries: true,
      canPlayInstants: true,
      canActivateAbilities: true,
    };
  }

  /**
   * Add a spell or ability to the stack
   */
  addToStack(stackObject: StackObject): void {
    // Assign stack order (higher numbers resolve first)
    const stackOrder = this.stack.length;
    const objectWithOrder = { ...stackObject, stackOrder };

    this.stack.push(objectWithOrder);

    // Reset priority passes
    this.priority.consecutivePasses = 0;
    this.priority.hasPassedPriority = false;

    // Active player gets priority first
    this.priority.activePlayer = stackObject.controller;

    console.log(
      `[Stack] Added ${stackObject.name} to stack (position ${stackOrder})`,
    );
    this.logStackState();
  }

  /**
   * Pass priority to the next player
   */
  passPriority(): 'continue' | 'resolve' | 'advance_phase' {
    this.priority.hasPassedPriority = true;
    this.priority.consecutivePasses++;

    console.log(`[Priority] ${this.priority.activePlayer} passed priority`);

    // Check if both players have passed
    if (this.priority.consecutivePasses >= 2) {
      if (this.stack.length > 0) {
        // Both players passed with spells on stack - resolve top
        return this.resolveTop();
      } else {
        // Both players passed with empty stack - advance phase/step
        return 'advance_phase';
      }
    } else {
      // Switch priority to other player
      this.priority.activePlayer =
        this.priority.activePlayer === 'player' ? 'opponent' : 'player';
      this.priority.hasPassedPriority = false;
      return 'continue';
    }
  }

  /**
   * Resolve the top object on the stack
   */
  private resolveTop(): 'continue' | 'resolve' {
    if (this.stack.length === 0) {
      console.log('[Stack] Cannot resolve - stack is empty');
      return 'continue';
    }

    const topObject = this.stack.pop()!;
    console.log(`[Stack] Resolving ${topObject.name}`);

    try {
      // Execute the spell/ability effect
      topObject.resolve(this.getCurrentGameState());

      // Reset priority passes and give priority to active player
      this.priority.consecutivePasses = 0;
      this.priority.hasPassedPriority = false;
      this.priority.activePlayer = this.timing.activePlayer;

      // Check for triggered abilities after resolution
      this.checkForTriggers();

      // Put any triggered abilities on the stack
      this.processTriggers();

      this.logStackState();
      return 'resolve';
    } catch (error) {
      console.error(`[Stack] Error resolving ${topObject.name}:`, error);
      return 'continue';
    }
  }

  /**
   * Check if auto-pass should be applied
   */
  shouldAutoPass(playerHand: any[]): boolean {
    if (!this.priority.autoPassSettings.enabled) return false;
    if (this.priority.fullControlMode) return false;

    const settings = this.priority.autoPassSettings;

    // Don't auto-pass if there are spells on the stack
    if (this.stack.length > 0 && !settings.passOnEmpty) return false;

    // Check if player has instant-speed responses
    if (!settings.passOnNoInstants) {
      const hasInstants = playerHand.some(
        card =>
          card.cardTypes.includes('Instant') ||
          card.abilities?.some((ability: string) => ability.includes('Flash')),
      );
      if (hasInstants) return false;
    }

    // Check combat auto-pass settings
    if (this.timing.phase === 'combat' && !settings.passOnCombat) return false;

    return true;
  }

  /**
   * Handle triggered abilities
   */
  private checkForTriggers(): void {
    // This would be expanded to check for actual triggered abilities
    // For now, it's a placeholder for the trigger system
    console.log('[Triggers] Checking for triggered abilities...');
  }

  /**
   * Process pending triggered abilities
   */
  private processTriggers(): void {
    if (this.triggers.length === 0) return;

    // Sort triggers by timestamp (APNAP order would be implemented here)
    this.triggers.sort((a, b) => a.timestamp - b.timestamp);

    // Add triggers to stack in order
    for (const trigger of this.triggers) {
      this.addToStack(trigger);
    }

    this.triggers = [];
  }

  /**
   * Check state-based effects
   */
  checkStateBasedEffects(): boolean {
    let effectsProcessed = false;

    for (const effect of this.stateBasedEffects) {
      if (effect()) {
        effectsProcessed = true;
      }
    }

    if (effectsProcessed) {
      console.log('[SBE] State-based effects processed');
      // Check for more triggers after SBEs
      this.checkForTriggers();
    }

    return effectsProcessed;
  }

  /**
   * Update timing restrictions
   */
  updateTiming(
    phase: string,
    step: string,
    activePlayer: 'player' | 'opponent',
  ): void {
    this.timing.phase = phase as any;
    this.timing.step = step;
    this.timing.activePlayer = activePlayer;

    // Update what can be played
    this.timing.canPlaySorceries =
      (phase === 'precombat_main' || phase === 'postcombat_main') &&
      this.stack.length === 0 &&
      this.timing.activePlayer === activePlayer;

    this.timing.canPlayInstants = true; // Can always play instants (with priority)
    this.timing.canActivateAbilities = true; // Can always activate abilities (with priority)

    console.log(`[Timing] Updated to ${phase} phase, ${step} step`);
  }

  /**
   * Toggle full control mode
   */
  toggleFullControl(): boolean {
    this.priority.fullControlMode = !this.priority.fullControlMode;
    console.log(
      `[Priority] Full control mode: ${this.priority.fullControlMode ? 'ON' : 'OFF'}`,
    );
    return this.priority.fullControlMode;
  }

  /**
   * Update auto-pass settings
   */
  updateAutoPassSettings(
    settings: Partial<Priority['autoPassSettings']>,
  ): void {
    this.priority.autoPassSettings = {
      ...this.priority.autoPassSettings,
      ...settings,
    };
    console.log(
      '[Priority] Auto-pass settings updated:',
      this.priority.autoPassSettings,
    );
  }

  /**
   * Get current stack state
   */
  getStackState(): StackObject[] {
    return [...this.stack];
  }

  /**
   * Get current priority holder
   */
  getPriorityPlayer(): 'player' | 'opponent' {
    return this.priority.activePlayer;
  }

  /**
   * Get timing information
   */
  getTiming(): GameTiming {
    return { ...this.timing };
  }

  /**
   * Check if a spell/ability can be played
   */
  canPlay(
    type: 'sorcery' | 'instant' | 'ability',
    controller: 'player' | 'opponent',
  ): boolean {
    // Must have priority
    if (this.priority.activePlayer !== controller) return false;

    // Check timing restrictions
    if (type === 'sorcery' && !this.timing.canPlaySorceries) return false;
    if (type === 'instant' && !this.timing.canPlayInstants) return false;
    if (type === 'ability' && !this.timing.canActivateAbilities) return false;

    return true;
  }

  /**
   * Add a triggered ability to pending triggers
   */
  addTrigger(trigger: StackObject): void {
    this.triggers.push(trigger);
    console.log(`[Triggers] Added triggered ability: ${trigger.name}`);
  }

  /**
   * Register a state-based effect
   */
  addStateBasedEffect(effect: () => boolean): void {
    this.stateBasedEffects.push(effect);
  }

  /**
   * Clear all state (for testing)
   */
  reset(): void {
    this.stack = [];
    this.triggers = [];
    this.priority.consecutivePasses = 0;
    this.priority.hasPassedPriority = false;
    this.priority.activePlayer = 'player';
  }

  /**
   * Log current stack state for debugging
   */
  private logStackState(): void {
    if (this.stack.length === 0) {
      console.log('[Stack] Empty');
    } else {
      console.log('[Stack] Current stack:');
      this.stack.forEach((obj, index) => {
        console.log(`  ${index}: ${obj.name} (${obj.controller})`);
      });
    }
  }

  /**
   * Get current game state (placeholder)
   */
  private getCurrentGameState(): any {
    // This would return the actual game state
    return {};
  }
}

/**
 * Factory functions for creating common stack objects
 */
export const StackObjectFactory = {
  createSpell(
    id: string,
    sourceId: string,
    controller: 'player' | 'opponent',
    name: string,
    description: string,
    manaCost: number,
    resolve: (gameState: any) => any,
    targets: string[] = [],
  ): StackObject {
    return {
      id,
      sourceId,
      controller,
      name,
      description,
      type: 'spell',
      manaCost,
      targets,
      timestamp: Date.now(),
      resolve,
      canBeCountered: true,
    };
  },

  createActivatedAbility(
    id: string,
    sourceId: string,
    controller: 'player' | 'opponent',
    name: string,
    description: string,
    resolve: (gameState: any) => any,
    targets: string[] = [],
  ): StackObject {
    return {
      id,
      sourceId,
      controller,
      name,
      description,
      type: 'activated_ability',
      targets,
      timestamp: Date.now(),
      resolve,
      canBeCountered: false,
    };
  },

  createTriggeredAbility(
    id: string,
    sourceId: string,
    controller: 'player' | 'opponent',
    name: string,
    description: string,
    resolve: (gameState: any) => any,
    targets: string[] = [],
  ): StackObject {
    return {
      id,
      sourceId,
      controller,
      name,
      description,
      type: 'triggered_ability',
      targets,
      timestamp: Date.now(),
      resolve,
      canBeCountered: false,
    };
  },
};
