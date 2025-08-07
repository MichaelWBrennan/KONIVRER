import * as BABYLON from 'babylonjs';
import { motion } from 'framer-motion';

export type GamePhase =
  | 'untap'
  | 'upkeep'
  | 'draw'
  | 'main1'
  | 'combat_begin'
  | 'combat_attackers'
  | 'combat_blockers'
  | 'combat_damage'
  | 'combat_end'
  | 'main2'
  | 'end'
  | 'cleanup';

export type PlayerAction =
  | 'pass_priority'
  | 'play_card'
  | 'activate_ability'
  | 'attack'
  | 'block'
  | 'cast_spell'
  | 'end_turn';

export interface GameState {
  currentPlayer: 'player' | 'opponent';
  activePlayer: 'player' | 'opponent';
  phase: GamePhase;
  turn: number;
  priority: 'player' | 'opponent';
  stack: any[]; // Spells and abilities on the stack
  passedInSuccession: number; // Track consecutive passes
}

export interface ActionIndicator {
  id: string;
  type: 'phase' | 'priority' | 'timer' | 'action_required' | 'waiting';
  position: BABYLON.Vector3;
  mesh?: BABYLON.Mesh;
  text: string;
  color: BABYLON.Color3;
  isVisible: boolean;
  isAnimating: boolean;
  duration?: number; // For timed actions
}

export interface PhaseTransition {
  from: GamePhase;
  to: GamePhase;
  duration: number;
  easing: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  effects?: {
    particles?: boolean;
    glow?: boolean;
    sound?: string;
  };
}

/**
 * Turn-Based Logic System for KONIVRER
 * Manages game phases, priority passing, and visual action indicators
 * Provides smooth transitions and clear visual feedback for game state
 */
export class TurnBasedSystem {
  private scene: BABYLON.Scene;
  private gameState: GameState;
  private indicators: Map<string, ActionIndicator> = new Map();
  private phaseTransitions: Map<string, PhaseTransition> = new Map();

  // Visual elements
  private phaseIndicatorMesh?: BABYLON.Mesh;
  private priorityIndicatorMesh?: BABYLON.Mesh;
  private turnIndicatorMesh?: BABYLON.Mesh;
  private timerMesh?: BABYLON.Mesh;
  private glowLayer: BABYLON.GlowLayer;
  private dynamicTexture: BABYLON.DynamicTexture;

  // Animation and timing
  private currentTransition?: BABYLON.Animation;
  private turnTimer: number = 0;
  private maxTurnTime: number = 300; // 5 minutes in seconds
  private timerInterval?: number;

  // Particle systems for effects
  private phaseParticles?: BABYLON.ParticleSystem;
  private priorityParticles?: BABYLON.ParticleSystem;

  // Event callbacks
  private onPhaseChange?: (from: GamePhase, to: GamePhase) => void;
  private onPriorityChange?: (player: 'player' | 'opponent') => void;
  private onActionRequired?: (action: PlayerAction) => void;
  private onTurnChange?: (player: 'player' | 'opponent', turn: number) => void;
  private onTimeWarning?: (remainingTime: number) => void;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.glowLayer = new BABYLON.GlowLayer('turn-glow', scene);
    this.glowLayer.intensity = 0.7;

    // Initialize game state
    this.gameState = {
      currentPlayer: 'player',
      activePlayer: 'player',
      phase: 'untap',
      turn: 1,
      priority: 'player',
      stack: [],
      passedInSuccession: 0,
    };

    // Create dynamic texture for text rendering
    this.dynamicTexture = new BABYLON.DynamicTexture(
      'turn-text-texture',
      { width: 512, height: 256 },
      scene,
      false,
    );

    this.initializePhaseTransitions();
    this.createVisualIndicators();
    this.startTurnTimer();
  }

  private initializePhaseTransitions(): void {
    const transitions: Array<[GamePhase, GamePhase, Partial<PhaseTransition>]> =
      [
        ['untap', 'upkeep', { duration: 500, easing: 'ease-in-out' }],
        ['upkeep', 'draw', { duration: 300, easing: 'ease-out' }],
        [
          'draw',
          'main1',
          {
            duration: 400,
            easing: 'ease-in-out',
            effects: { particles: true },
          },
        ],
        [
          'main1',
          'combat_begin',
          {
            duration: 600,
            easing: 'ease-in',
            effects: { glow: true, sound: 'combat-start' },
          },
        ],
        [
          'combat_begin',
          'combat_attackers',
          { duration: 300, easing: 'linear' },
        ],
        [
          'combat_attackers',
          'combat_blockers',
          { duration: 400, easing: 'ease-out' },
        ],
        [
          'combat_blockers',
          'combat_damage',
          {
            duration: 500,
            easing: 'ease-in-out',
            effects: { particles: true, sound: 'combat-damage' },
          },
        ],
        ['combat_damage', 'combat_end', { duration: 300, easing: 'ease-out' }],
        ['combat_end', 'main2', { duration: 400, easing: 'ease-in-out' }],
        ['main2', 'end', { duration: 300, easing: 'ease-in' }],
        ['end', 'cleanup', { duration: 200, easing: 'linear' }],
        [
          'cleanup',
          'untap',
          {
            duration: 500,
            easing: 'ease-in-out',
            effects: { glow: true, sound: 'turn-end' },
          },
        ],
      ];

    transitions.forEach(([from, to, config]) => {
      const key = `${from}->${to}`;
      this.phaseTransitions.set(key, {
        from,
        to,
        duration: 400,
        easing: 'ease-in-out',
        ...config,
      } as PhaseTransition);
    });
  }

  private createVisualIndicators(): void {
    this.createPhaseIndicator();
    this.createPriorityIndicator();
    this.createTurnIndicator();
    this.createTimerIndicator();
    this.createActionPrompts();
  }

  private createPhaseIndicator(): void {
    // Create a floating phase indicator
    const phasePanel = BABYLON.MeshBuilder.CreatePlane(
      'phase-indicator',
      { width: 4, height: 1 },
      this.scene,
    );
    phasePanel.position.set(0, 8, -10);

    // Create material with dynamic texture
    const material = new BABYLON.StandardMaterial('phase-material', this.scene);
    const texture = new BABYLON.DynamicTexture(
      'phase-texture',
      { width: 512, height: 128 },
      this.scene,
      false,
    );

    material.diffuseTexture = texture;
    material.hasAlpha = true;
    material.useAlphaFromDiffuseTexture = true;
    phasePanel.material = material;

    this.phaseIndicatorMesh = phasePanel;
    this.updatePhaseIndicatorText();
  }

  private createPriorityIndicator(): void {
    // Create a subtle priority indicator near the active player
    const priorityOrb = BABYLON.MeshBuilder.CreateSphere(
      'priority-orb',
      { diameter: 0.5 },
      this.scene,
    );

    const material = new BABYLON.PBRMaterial('priority-material', this.scene);
    material.baseColor = new BABYLON.Color3(1, 0.8, 0.2); // Golden
    material.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0.1);
    material.roughness = 0.2;
    material.metallic = 0.8;

    priorityOrb.material = material;
    priorityOrb.position.set(
      -8,
      2,
      this.gameState.priority === 'player' ? 8 : -8,
    );

    this.priorityIndicatorMesh = priorityOrb;
    this.glowLayer.addIncludedOnlyMesh(priorityOrb);

    this.animatePriorityOrb();
  }

  private createTurnIndicator(): void {
    // Turn counter display
    const turnPanel = BABYLON.MeshBuilder.CreatePlane(
      'turn-indicator',
      { width: 2, height: 0.8 },
      this.scene,
    );
    turnPanel.position.set(8, 7, -8);

    const material = new BABYLON.StandardMaterial('turn-material', this.scene);
    const texture = new BABYLON.DynamicTexture(
      'turn-texture',
      { width: 256, height: 128 },
      this.scene,
      false,
    );

    material.diffuseTexture = texture;
    material.hasAlpha = true;
    turnPanel.material = material;

    this.turnIndicatorMesh = turnPanel;
    this.updateTurnIndicatorText();
  }

  private createTimerIndicator(): void {
    // Timer arc/circle showing remaining time
    const timerRing = BABYLON.MeshBuilder.CreateTorus(
      'timer-ring',
      { diameter: 2, thickness: 0.1, tessellation: 32 },
      this.scene,
    );
    timerRing.position.set(-8, 6, -8);

    const material = new BABYLON.PBRMaterial('timer-material', this.scene);
    material.baseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Green when time is good
    material.emissiveColor = new BABYLON.Color3(0.1, 0.4, 0.1);

    timerRing.material = material;
    this.timerMesh = timerRing;
  }

  private createActionPrompts(): void {
    // Create floating action prompts that appear when player input is needed
    const promptPositions = [
      new BABYLON.Vector3(0, 3, 6), // Center-bottom for main actions
      new BABYLON.Vector3(-6, 3, 6), // Left for secondary actions
      new BABYLON.Vector3(6, 3, 6), // Right for alternative actions
    ];

    promptPositions.forEach((position, index) => {
      const indicator: ActionIndicator = {
        id: `action-prompt-${index}`,
        type: 'action_required',
        position,
        text: '',
        color: new BABYLON.Color3(1, 1, 0.2),
        isVisible: false,
        isAnimating: false,
      };

      this.indicators.set(indicator.id, indicator);
    });
  }

  private animatePriorityOrb(): void {
    if (!this.priorityIndicatorMesh) return;

    // Gentle floating animation
    const floatAnimation = BABYLON.Animation.CreateAndStartAnimation(
      'priority-float',
      this.priorityIndicatorMesh,
      'position.y',
      30, // fps
      60, // frames (2 seconds)
      this.priorityIndicatorMesh.position.y,
      this.priorityIndicatorMesh.position.y + 0.3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    // Subtle pulse animation
    const pulseAnimation = BABYLON.Animation.CreateAndStartAnimation(
      'priority-pulse',
      this.priorityIndicatorMesh,
      'scaling',
      30, // fps
      30, // frames (1 second)
      BABYLON.Vector3.One(),
      new BABYLON.Vector3(1.1, 1.1, 1.1),
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
  }

  private updatePhaseIndicatorText(): void {
    if (!this.phaseIndicatorMesh?.material) return;

    const material = this.phaseIndicatorMesh
      .material as BABYLON.StandardMaterial;
    const texture = material.diffuseTexture as BABYLON.DynamicTexture;

    texture.clear();
    texture.drawText(
      this.getPhaseDisplayName(this.gameState.phase),
      null,
      null, // Center the text
      'bold 40px Arial',
      '#D4AF37', // Gold
      'rgba(0,0,0,0.8)', // Semi-transparent background
      true, // Invert Y
    );
  }

  private updateTurnIndicatorText(): void {
    if (!this.turnIndicatorMesh?.material) return;

    const material = this.turnIndicatorMesh
      .material as BABYLON.StandardMaterial;
    const texture = material.diffuseTexture as BABYLON.DynamicTexture;

    texture.clear();
    texture.drawText(
      `Turn ${this.gameState.turn}`,
      null,
      null, // Center the text
      'bold 32px Arial',
      '#FFFFFF',
      'rgba(26,26,46,0.9)',
      true,
    );

    // Add current player indicator
    const playerText =
      this.gameState.currentPlayer === 'player'
        ? 'Your Turn'
        : "Opponent's Turn";
    texture.drawText(
      playerText,
      null,
      80, // Below turn number
      '24px Arial',
      this.gameState.currentPlayer === 'player' ? '#4CAF50' : '#F44336',
      'transparent',
      true,
    );
  }

  private getPhaseDisplayName(phase: GamePhase): string {
    const names: Record<GamePhase, string> = {
      untap: 'Untap',
      upkeep: 'Upkeep',
      draw: 'Draw',
      main1: 'Main Phase',
      combat_begin: 'Beginning of Combat',
      combat_attackers: 'Declare Attackers',
      combat_blockers: 'Declare Blockers',
      combat_damage: 'Combat Damage',
      combat_end: 'End of Combat',
      main2: 'Second Main Phase',
      end: 'End Step',
      cleanup: 'Cleanup',
    };
    return names[phase] || phase;
  }

  private startTurnTimer(): void {
    this.turnTimer = this.maxTurnTime;

    this.timerInterval = window.setInterval(() => {
      this.turnTimer -= 1;

      // Update timer visual
      this.updateTimerDisplay();

      // Trigger warnings
      if (this.turnTimer === 60) {
        // 1 minute warning
        this.onTimeWarning?.(60);
      } else if (this.turnTimer === 30) {
        // 30 second warning
        this.onTimeWarning?.(30);
      } else if (this.turnTimer === 10) {
        // Final warning
        this.onTimeWarning?.(10);
      } else if (this.turnTimer <= 0) {
        this.forceEndTurn();
      }
    }, 1000);
  }

  private updateTimerDisplay(): void {
    if (!this.timerMesh?.material) return;

    const material = this.timerMesh.material as BABYLON.PBRMaterial;
    const timePercent = this.turnTimer / this.maxTurnTime;

    // Color coding: Green -> Yellow -> Red
    if (timePercent > 0.5) {
      material.baseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Green
      material.emissiveColor = new BABYLON.Color3(0.1, 0.4, 0.1);
    } else if (timePercent > 0.2) {
      material.baseColor = new BABYLON.Color3(0.8, 0.8, 0.2); // Yellow
      material.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.1);
    } else {
      material.baseColor = new BABYLON.Color3(0.8, 0.2, 0.2); // Red
      material.emissiveColor = new BABYLON.Color3(0.4, 0.1, 0.1);

      // Urgent pulsing when time is critical
      if (this.turnTimer <= 10) {
        this.createUrgentPulse();
      }
    }
  }

  private createUrgentPulse(): void {
    if (!this.timerMesh) return;

    BABYLON.Animation.CreateAndStartAnimation(
      'urgent-pulse',
      this.timerMesh,
      'scaling',
      10, // Fast pulsing
      10, // Short cycle
      BABYLON.Vector3.One(),
      new BABYLON.Vector3(1.2, 1.2, 1.2),
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
  }

  // Public API Methods

  public nextPhase(): void {
    const currentPhase = this.gameState.phase;
    const nextPhase = this.getNextPhase(currentPhase);

    if (nextPhase) {
      this.transitionToPhase(nextPhase);
    }
  }

  public transitionToPhase(newPhase: GamePhase): void {
    const oldPhase = this.gameState.phase;
    if (oldPhase === newPhase) return;

    const transitionKey = `${oldPhase}->${newPhase}`;
    const transition = this.phaseTransitions.get(transitionKey);

    if (transition) {
      this.executePhaseTransition(transition);
    }

    this.gameState.phase = newPhase;
    this.updatePhaseIndicatorText();

    // Handle special phase logic
    this.handlePhaseEntry(newPhase);

    this.onPhaseChange?.(oldPhase, newPhase);
  }

  private getNextPhase(current: GamePhase): GamePhase | null {
    const sequence: GamePhase[] = [
      'untap',
      'upkeep',
      'draw',
      'main1',
      'combat_begin',
      'combat_attackers',
      'combat_blockers',
      'combat_damage',
      'combat_end',
      'main2',
      'end',
      'cleanup',
    ];

    const currentIndex = sequence.indexOf(current);
    if (currentIndex === -1) return null;

    if (currentIndex === sequence.length - 1) {
      // End of turn - switch to next player
      this.endTurn();
      return 'untap';
    }

    return sequence[currentIndex + 1];
  }

  private executePhaseTransition(transition: PhaseTransition): void {
    // Play transition effects
    if (transition.effects?.particles) {
      this.createPhaseParticles();
    }

    if (transition.effects?.glow && this.phaseIndicatorMesh) {
      this.glowLayer.addIncludedOnlyMesh(this.phaseIndicatorMesh);

      // Remove glow after transition
      setTimeout(() => {
        if (this.phaseIndicatorMesh) {
          this.glowLayer.removeIncludedOnlyMesh(this.phaseIndicatorMesh);
        }
      }, transition.duration);
    }

    // TODO: Play sound effect if specified
    // if (transition.effects?.sound) {
    //   this.audioManager.playSound(transition.effects.sound);
    // }
  }

  private createPhaseParticles(): void {
    if (this.phaseParticles) {
      this.phaseParticles.dispose();
    }

    const particles = new BABYLON.ParticleSystem(
      'phase-particles',
      50,
      this.scene,
    );
    particles.particleTexture = new BABYLON.Texture(
      'data:image/svg+xml;base64,' +
        btoa(`
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="rgba(212,175,55,0.8)"/>
        </svg>
      `),
      this.scene,
    );

    particles.emitter = this.phaseIndicatorMesh || BABYLON.Vector3.Zero();
    particles.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
    particles.maxEmitBox = new BABYLON.Vector3(1, 0, 1);

    particles.color1 = new BABYLON.Color4(1, 0.8, 0.2, 1.0);
    particles.color2 = new BABYLON.Color4(1, 1, 0.5, 1.0);
    particles.colorDead = new BABYLON.Color4(1, 1, 0.5, 0.0);

    particles.minSize = 0.1;
    particles.maxSize = 0.3;
    particles.minLifeTime = 0.5;
    particles.maxLifeTime = 1.5;
    particles.emitRate = 30;

    particles.minEmitPower = 1;
    particles.maxEmitPower = 3;
    particles.gravity = new BABYLON.Vector3(0, -2, 0);

    particles.start();

    // Auto-dispose after effect
    setTimeout(() => {
      particles.stop();
      setTimeout(() => particles.dispose(), 2000);
    }, 2000);

    this.phaseParticles = particles;
  }

  private handlePhaseEntry(phase: GamePhase): void {
    switch (phase) {
      case 'untap':
        this.showActionPrompt('Untap your permanents', 'action_required');
        break;
      case 'draw':
        this.showActionPrompt('Draw a card', 'action_required');
        break;
      case 'main1':
        this.showActionPrompt('Play spells and abilities', 'waiting');
        break;
      case 'combat_begin':
        this.showActionPrompt('Enter combat?', 'action_required');
        break;
      case 'combat_attackers':
        this.showActionPrompt('Declare attackers', 'action_required');
        break;
      case 'combat_blockers':
        if (this.gameState.currentPlayer !== this.gameState.activePlayer) {
          this.showActionPrompt('Declare blockers', 'action_required');
        }
        break;
      case 'main2':
        this.showActionPrompt('Second main phase', 'waiting');
        break;
      case 'end':
        this.showActionPrompt('End turn?', 'action_required');
        break;
    }
  }

  public passPriority(): void {
    const currentPriority = this.gameState.priority;
    const newPriority = currentPriority === 'player' ? 'opponent' : 'player';

    this.gameState.priority = newPriority;
    this.gameState.passedInSuccession++;

    // Move priority orb
    if (this.priorityIndicatorMesh) {
      const newZ = newPriority === 'player' ? 8 : -8;
      BABYLON.Animation.CreateAndStartAnimation(
        'priority-move',
        this.priorityIndicatorMesh,
        'position.z',
        30, // fps
        15, // frames (0.5 seconds)
        this.priorityIndicatorMesh.position.z,
        newZ,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      );
    }

    // If both players passed in succession, resolve stack or advance phase
    if (this.gameState.passedInSuccession >= 2) {
      if (this.gameState.stack.length > 0) {
        this.resolveStack();
      } else {
        this.nextPhase();
      }
      this.gameState.passedInSuccession = 0;
    }

    this.onPriorityChange?.(newPriority);
  }

  private resolveStack(): void {
    // Resolve the top item of the stack
    if (this.gameState.stack.length > 0) {
      const topItem = this.gameState.stack.pop();
      console.log('Resolving:', topItem);

      // Visual feedback for resolution
      this.showActionPrompt('Resolving...', 'waiting', 1000);
    }
  }

  public endTurn(): void {
    // Switch to next player
    this.gameState.currentPlayer =
      this.gameState.currentPlayer === 'player' ? 'opponent' : 'player';
    this.gameState.activePlayer = this.gameState.currentPlayer;
    this.gameState.priority = this.gameState.currentPlayer;

    // Increment turn counter on player's turn
    if (this.gameState.currentPlayer === 'player') {
      this.gameState.turn++;
    }

    // Reset timer
    this.turnTimer = this.maxTurnTime;

    // Update visuals
    this.updateTurnIndicatorText();

    this.onTurnChange?.(this.gameState.currentPlayer, this.gameState.turn);
  }

  private forceEndTurn(): void {
    this.showActionPrompt('Time expired!', 'timer', 3000);
    setTimeout(() => {
      this.endTurn();
      this.transitionToPhase('untap');
    }, 1000);
  }

  public showActionPrompt(
    text: string,
    type: ActionIndicator['type'],
    duration?: number,
  ): void {
    const indicator: ActionIndicator = {
      id: `prompt-${Date.now()}`,
      type,
      position: new BABYLON.Vector3(0, 4, 6),
      text,
      color: this.getIndicatorColor(type),
      isVisible: true,
      isAnimating: true,
      duration,
    };

    // Create visual representation
    this.createIndicatorMesh(indicator);

    if (duration) {
      setTimeout(() => {
        this.hideActionPrompt(indicator.id);
      }, duration);
    }

    this.indicators.set(indicator.id, indicator);
  }

  public hideActionPrompt(promptId: string): void {
    const indicator = this.indicators.get(promptId);
    if (indicator && indicator.mesh) {
      // Fade out animation
      BABYLON.Animation.CreateAndStartAnimation(
        `fade-${promptId}`,
        indicator.mesh.material!,
        'alpha',
        30, // fps
        15, // frames
        1.0,
        0.0,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        null,
        () => {
          indicator.mesh?.dispose();
          this.indicators.delete(promptId);
        },
      );
    }
  }

  private createIndicatorMesh(indicator: ActionIndicator): void {
    const panel = BABYLON.MeshBuilder.CreatePlane(
      `indicator-${indicator.id}`,
      { width: 4, height: 1 },
      this.scene,
    );
    panel.position = indicator.position.clone();

    const material = new BABYLON.StandardMaterial(
      `indicator-mat-${indicator.id}`,
      this.scene,
    );
    const texture = new BABYLON.DynamicTexture(
      `indicator-tex-${indicator.id}`,
      { width: 512, height: 128 },
      this.scene,
      false,
    );

    texture.drawText(
      indicator.text,
      null,
      null, // Center text
      'bold 36px Arial',
      `rgb(${Math.floor(indicator.color.r * 255)}, ${Math.floor(indicator.color.g * 255)}, ${Math.floor(indicator.color.b * 255)})`,
      'rgba(0,0,0,0.8)',
      true,
    );

    material.diffuseTexture = texture;
    material.hasAlpha = true;
    material.useAlphaFromDiffuseTexture = true;
    panel.material = material;

    indicator.mesh = panel;

    // Entrance animation
    panel.position.y -= 2;
    BABYLON.Animation.CreateAndStartAnimation(
      `enter-${indicator.id}`,
      panel,
      'position.y',
      30, // fps
      20, // frames
      panel.position.y,
      indicator.position.y,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
  }

  private getIndicatorColor(type: ActionIndicator['type']): BABYLON.Color3 {
    const colors = {
      phase: new BABYLON.Color3(0.8, 0.6, 1.0), // Purple
      priority: new BABYLON.Color3(1.0, 0.8, 0.2), // Gold
      timer: new BABYLON.Color3(1.0, 0.4, 0.4), // Red
      action_required: new BABYLON.Color3(0.2, 0.8, 0.2), // Green
      waiting: new BABYLON.Color3(0.6, 0.6, 0.6), // Gray
    };
    return colors[type] || new BABYLON.Color3(1, 1, 1);
  }

  // Event handler setters
  public setEventHandlers(handlers: {
    onPhaseChange?: (from: GamePhase, to: GamePhase) => void;
    onPriorityChange?: (player: 'player' | 'opponent') => void;
    onActionRequired?: (action: PlayerAction) => void;
    onTurnChange?: (player: 'player' | 'opponent', turn: number) => void;
    onTimeWarning?: (remainingTime: number) => void;
  }): void {
    this.onPhaseChange = handlers.onPhaseChange;
    this.onPriorityChange = handlers.onPriorityChange;
    this.onActionRequired = handlers.onActionRequired;
    this.onTurnChange = handlers.onTurnChange;
    this.onTimeWarning = handlers.onTimeWarning;
  }

  // Getters
  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public getCurrentPhase(): GamePhase {
    return this.gameState.phase;
  }

  public getCurrentPlayer(): 'player' | 'opponent' {
    return this.gameState.currentPlayer;
  }

  public hasPriority(): boolean {
    return this.gameState.priority === 'player';
  }

  public getTurnNumber(): number {
    return this.gameState.turn;
  }

  public getRemainingTime(): number {
    return this.turnTimer;
  }

  public dispose(): void {
    // Clear timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Dispose meshes
    this.phaseIndicatorMesh?.dispose();
    this.priorityIndicatorMesh?.dispose();
    this.turnIndicatorMesh?.dispose();
    this.timerMesh?.dispose();

    // Dispose indicators
    for (const indicator of this.indicators.values()) {
      indicator.mesh?.dispose();
    }

    // Dispose particle systems
    this.phaseParticles?.dispose();
    this.priorityParticles?.dispose();

    // Dispose effects
    this.glowLayer.dispose();
    this.dynamicTexture.dispose();
  }
}
