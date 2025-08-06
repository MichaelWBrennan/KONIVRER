import * as BABYLON from 'babylonjs';
import {
  realTimeEnvironmentService,
  type TimeData,
  type WeatherData,
} from '../../services/RealTimeEnvironmentService';

export interface InteractiveElement {
  id: string;
  mesh: BABYLON.AbstractMesh;
  type: 'torch' | 'waterfall' | 'crystal' | 'rune' | 'campfire' | 'geyser';
  isActive: boolean;
  audioSource?: BABYLON.Sound;
  particleSystem?: BABYLON.ParticleSystem;
  animations?: BABYLON.AnimationGroup[];
  onHover?: () => void;
  onClick?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export interface BattlefieldState {
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  weather: 'clear' | 'rain' | 'storm' | 'fog' | 'snow';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  activeEffects: string[];
  playerMood: 'calm' | 'excited' | 'tense' | 'victorious';
}

/**
 * Manages interactive elements and battlefield state synchronization
 * Provides event hooks for UI/UX interactions and dynamic environment changes
 */
export class BattlefieldInteractionSystem {
  private scene: BABYLON.Scene;
  private interactiveElements: Map<string, InteractiveElement> = new Map();
  private battlefieldState: BattlefieldState;
  private stateChangeCallbacks: ((state: BattlefieldState) => void)[] = [];
  private hoverHighlight?: BABYLON.GlowLayer;
  private audioManager?: any;
  private currentTheme: string = 'mystical';

  constructor(scene: BABYLON.Scene, audioManager?: any) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.battlefieldState = {
      timeOfDay: 'day',
      weather: 'clear',
      season: 'summer',
      activeEffects: [],
      playerMood: 'calm',
    };

    this.setupInteractionSystem();
    this.initializeRealTimeEnvironment();
  }

  private async initializeRealTimeEnvironment(): Promise<void> {
    try {
      console.log(
        '[BattlefieldInteractionSystem] Initializing real-time environment...',
      );

      // Initialize the real-time environment service
      await realTimeEnvironmentService.initialize();

      // Get initial real-time data
      await this.updateEnvironmentFromRealTime();

      // Start automatic updates
      realTimeEnvironmentService.startAutomaticUpdates(
        (timeData, weatherData) => {
          this.updateBattlefieldFromRealTime(timeData, weatherData);
        },
      );

      console.log(
        '[BattlefieldInteractionSystem] Real-time environment initialized',
      );
    } catch (error) {
      console.warn(
        '[BattlefieldInteractionSystem] Failed to initialize real-time environment, using defaults:',
        error,
      );
    }
  }

  private async updateEnvironmentFromRealTime(): Promise<void> {
    try {
      const timeData = realTimeEnvironmentService.getCurrentTimeOfDay();
      const weatherData = await realTimeEnvironmentService.getCurrentWeather();

      this.updateBattlefieldFromRealTime(timeData, weatherData);
    } catch (error) {
      console.warn(
        '[BattlefieldInteractionSystem] Failed to update from real-time data:',
        error,
      );
    }
  }

  private updateBattlefieldFromRealTime(
    timeData: TimeData,
    weatherData: WeatherData,
  ): void {
    const locationData = realTimeEnvironmentService.getLocationData();

    console.log('[BattlefieldInteractionSystem] Updating environment:', {
      time: timeData.timeOfDay,
      weather: weatherData.condition,
      location: locationData?.city,
      temperature: weatherData.temperature,
    });

    // Update battlefield state with real-time data
    const newState = {
      timeOfDay: timeData.timeOfDay,
      weather: weatherData.condition,
      season: this.getCurrentSeason(timeData.localTime),
      activeEffects: [...this.battlefieldState.activeEffects],
      playerMood: this.battlefieldState.playerMood,
    };

    this.updateBattlefieldState(newState);
  }

  private getCurrentSeason(date: Date): BattlefieldState['season'] {
    const month = date.getMonth();

    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  private setupInteractionSystem(): void {
    // Setup glow layer for hover effects
    this.hoverHighlight = new BABYLON.GlowLayer('hoverGlow', this.scene);
    this.hoverHighlight.intensity = 0.5;

    // Setup pointer event handling
    this.scene.onPointerObservable.add(pointerInfo => {
      this.handlePointerEvent(pointerInfo);
    });

    console.log(
      '[BattlefieldInteractionSystem] Interaction system initialized',
    );
  }

  private handlePointerEvent(pointerInfo: BABYLON.PointerInfo): void {
    if (!pointerInfo.pickInfo?.hit) return;

    const pickedMesh = pointerInfo.pickInfo.pickedMesh;
    if (!pickedMesh) return;

    // Find interactive element
    const element = this.findInteractiveElement(pickedMesh);
    if (!element) return;

    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERMOVE:
        this.handleElementHover(element);
        break;
      case BABYLON.PointerEventTypes.POINTERDOWN:
        this.handleElementClick(element);
        break;
    }
  }

  private findInteractiveElement(
    mesh: BABYLON.AbstractMesh,
  ): InteractiveElement | null {
    for (const element of this.interactiveElements.values()) {
      if (
        element.mesh === mesh ||
        element.mesh.getChildMeshes().includes(mesh as BABYLON.Mesh)
      ) {
        return element;
      }
    }
    return null;
  }

  private handleElementHover(element: InteractiveElement): void {
    // Add glow effect
    if (this.hoverHighlight) {
      this.hoverHighlight.addIncludedOnlyMesh(element.mesh as BABYLON.Mesh);
    }

    // Play hover sound
    if (this.audioManager?.playCardHover) {
      this.audioManager.playCardHover();
    }

    // Call custom hover callback
    if (element.onHover) {
      element.onHover();
    }

    console.log(
      `[BattlefieldInteractionSystem] Hovering over ${element.type}: ${element.id}`,
    );
  }

  private handleElementClick(element: InteractiveElement): void {
    // Play click sound
    if (this.audioManager?.playCardPlace) {
      this.audioManager.playCardPlace();
    }

    // Toggle activation
    this.toggleElement(element.id);

    // Call custom click callback
    if (element.onClick) {
      element.onClick();
    }

    console.log(
      `[BattlefieldInteractionSystem] Clicked ${element.type}: ${element.id}`,
    );
  }

  /**
   * Add an interactive element to the battlefield
   */
  public addInteractiveElement(
    config: Partial<InteractiveElement> & {
      id: string;
      mesh: BABYLON.AbstractMesh;
      type: InteractiveElement['type'];
    },
  ): void {
    const element: InteractiveElement = {
      isActive: true,
      onHover: () => this.defaultHoverBehavior(config.type),
      onClick: () => this.defaultClickBehavior(config.type),
      onActivate: () => this.defaultActivateBehavior(config.type),
      onDeactivate: () => this.defaultDeactivateBehavior(config.type),
      ...config,
    };

    // Setup element-specific features
    this.setupElementFeatures(element);

    this.interactiveElements.set(element.id, element);
    console.log(
      `[BattlefieldInteractionSystem] Added interactive element: ${element.id}`,
    );
  }

  private setupElementFeatures(element: InteractiveElement): void {
    switch (element.type) {
      case 'torch':
        this.setupTorchFeatures(element);
        break;
      case 'waterfall':
        this.setupWaterfallFeatures(element);
        break;
      case 'crystal':
        this.setupCrystalFeatures(element);
        break;
      case 'campfire':
        this.setupCampfireFeatures(element);
        break;
      case 'geyser':
        this.setupGeyserFeatures(element);
        break;
    }
  }

  private setupTorchFeatures(element: InteractiveElement): void {
    // Create flickering fire particle system
    const particleSystem = new BABYLON.ParticleSystem(
      'torchFlame',
      50,
      this.scene,
    );
    particleSystem.particleTexture = this.createFireTexture();
    particleSystem.emitter = element.mesh;

    particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0.5, -0.1);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.7, 0.1);

    particleSystem.color1 = new BABYLON.Color4(1, 0.6, 0.2, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 0.3, 0.1, 1);
    particleSystem.colorDead = new BABYLON.Color4(0.2, 0.1, 0, 0);

    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.15;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.8;
    particleSystem.emitRate = 30;

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.direction1 = new BABYLON.Vector3(-0.2, 0.8, -0.2);
    particleSystem.direction2 = new BABYLON.Vector3(0.2, 1.2, 0.2);

    // Add flickering animation
    this.addFlickeringAnimation(element);

    element.particleSystem = particleSystem;
    if (element.isActive) {
      particleSystem.start();
    }
  }

  private setupWaterfallFeatures(element: InteractiveElement): void {
    // Create water particle system
    const particleSystem = new BABYLON.ParticleSystem(
      'waterfallDrops',
      100,
      this.scene,
    );
    particleSystem.particleTexture = this.createWaterTexture();
    particleSystem.emitter = element.mesh;

    particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 2, -0.1);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 2.2, 0.1);

    particleSystem.color1 = new BABYLON.Color4(0.7, 0.9, 1, 0.8);
    particleSystem.color2 = new BABYLON.Color4(0.5, 0.8, 1, 0.6);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);

    particleSystem.minSize = 0.02;
    particleSystem.maxSize = 0.05;
    particleSystem.minLifeTime = 1.5;
    particleSystem.maxLifeTime = 2.5;
    particleSystem.emitRate = 60;

    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
    particleSystem.direction1 = new BABYLON.Vector3(-0.1, -1, -0.1);
    particleSystem.direction2 = new BABYLON.Vector3(0.1, -0.8, 0.1);

    element.particleSystem = particleSystem;
    if (element.isActive) {
      particleSystem.start();
    }
  }

  private setupCrystalFeatures(element: InteractiveElement): void {
    // Add pulsing glow animation
    const glowAnimation = new BABYLON.Animation(
      'crystalGlow',
      'material.emissiveColor',
      30,
      BABYLON.Animation.ANIMATIONTYPE_COLOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const keys = [
      { frame: 0, value: new BABYLON.Color3(0.2, 0.5, 1) },
      { frame: 30, value: new BABYLON.Color3(0.5, 0.8, 1) },
      { frame: 60, value: new BABYLON.Color3(0.2, 0.5, 1) },
    ];

    glowAnimation.setKeys(keys);
    element.mesh.animations.push(glowAnimation);

    if (element.isActive) {
      this.scene.beginAnimation(element.mesh, 0, 60, true);
    }
  }

  private setupCampfireFeatures(element: InteractiveElement): void {
    // Similar to torch but larger and with crackling sound
    this.setupTorchFeatures(element);

    // Scale up the particle system
    if (element.particleSystem) {
      element.particleSystem.emitRate = 80;
      element.particleSystem.minSize = 0.1;
      element.particleSystem.maxSize = 0.3;
    }
  }

  private setupGeyserFeatures(element: InteractiveElement): void {
    // Create steam/water eruption
    const particleSystem = new BABYLON.ParticleSystem(
      'geyserSteam',
      150,
      this.scene,
    );
    particleSystem.particleTexture = this.createSteamTexture();
    particleSystem.emitter = element.mesh;

    particleSystem.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2);

    particleSystem.color1 = new BABYLON.Color4(1, 1, 1, 0.8);
    particleSystem.color2 = new BABYLON.Color4(0.9, 0.9, 1, 0.4);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);

    particleSystem.minSize = 0.2;
    particleSystem.maxSize = 0.8;
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 4;
    particleSystem.emitRate = 50;

    particleSystem.direction1 = new BABYLON.Vector3(-0.5, 3, -0.5);
    particleSystem.direction2 = new BABYLON.Vector3(0.5, 5, 0.5);

    // Add periodic eruption
    this.addPeriodicEruption(element);

    element.particleSystem = particleSystem;
  }

  private addFlickeringAnimation(element: InteractiveElement): void {
    // Random flickering effect for torches
    this.scene.registerBeforeRender(() => {
      if (!element.isActive || !element.particleSystem) return;

      const randomFlicker = 0.8 + Math.random() * 0.4;
      element.particleSystem.emitRate = 30 * randomFlicker;
    });
  }

  private addPeriodicEruption(element: InteractiveElement): void {
    // Geyser erupts every 10-15 seconds
    let nextEruption = Date.now() + (10 + Math.random() * 5) * 1000;

    this.scene.registerBeforeRender(() => {
      if (!element.isActive || !element.particleSystem) return;

      const now = Date.now();
      if (now >= nextEruption) {
        // Trigger eruption
        element.particleSystem.emitRate = 200;
        element.particleSystem.minEmitPower = 4;
        element.particleSystem.maxEmitPower = 8;

        // Return to normal after 3 seconds
        setTimeout(() => {
          if (element.particleSystem) {
            element.particleSystem.emitRate = 50;
            element.particleSystem.minEmitPower = 1;
            element.particleSystem.maxEmitPower = 3;
          }
        }, 3000);

        nextEruption = now + (10 + Math.random() * 5) * 1000;
      }
    });
  }

  private createFireTexture(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('fireTexture', 64, this.scene);
    const context = texture.getContext();

    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 200, 100, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 100, 50, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    texture.update();

    return texture;
  }

  private createWaterTexture(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('waterTexture', 32, this.scene);
    const context = texture.getContext();

    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(200, 230, 255, 1)');
    gradient.addColorStop(0.7, 'rgba(150, 200, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    texture.update();

    return texture;
  }

  private createSteamTexture(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('steamTexture', 128, this.scene);
    const context = texture.getContext();

    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(240, 240, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    texture.update();

    return texture;
  }

  private defaultHoverBehavior(type: InteractiveElement['type']): void {
    // Default hover behaviors for different element types
    switch (type) {
      case 'torch':
        console.log('🔥 Torch flickers as you approach');
        break;
      case 'waterfall':
        console.log('💧 You hear the soothing sound of flowing water');
        break;
      case 'crystal':
        console.log('💎 The crystal resonates with magical energy');
        break;
    }
  }

  private defaultClickBehavior(type: InteractiveElement['type']): void {
    // Default click behaviors
    console.log(`Interacting with ${type}`);
  }

  private defaultActivateBehavior(type: InteractiveElement['type']): void {
    console.log(`${type} activated`);
  }

  private defaultDeactivateBehavior(type: InteractiveElement['type']): void {
    console.log(`${type} deactivated`);
  }

  /**
   * Toggle an interactive element on/off
   */
  public toggleElement(elementId: string): void {
    const element = this.interactiveElements.get(elementId);
    if (!element) return;

    element.isActive = !element.isActive;

    if (element.isActive) {
      this.activateElement(element);
    } else {
      this.deactivateElement(element);
    }
  }

  private activateElement(element: InteractiveElement): void {
    if (element.particleSystem) {
      element.particleSystem.start();
    }

    if (element.animations) {
      element.animations.forEach(animation => animation.play());
    }

    if (element.onActivate) {
      element.onActivate();
    }
  }

  private deactivateElement(element: InteractiveElement): void {
    if (element.particleSystem) {
      element.particleSystem.stop();
    }

    if (element.animations) {
      element.animations.forEach(animation => animation.pause());
    }

    if (element.onDeactivate) {
      element.onDeactivate();
    }
  }

  /**
   * Update battlefield state and sync environment
   */
  public updateBattlefieldState(newState: Partial<BattlefieldState>): void {
    const previousState = { ...this.battlefieldState };
    this.battlefieldState = { ...this.battlefieldState, ...newState };

    // Apply environmental changes based on state
    this.syncEnvironmentWithState();

    // Notify callbacks
    this.stateChangeCallbacks.forEach(callback =>
      callback(this.battlefieldState),
    );

    console.log(
      '[BattlefieldInteractionSystem] State updated:',
      this.battlefieldState,
    );
  }

  private syncEnvironmentWithState(): void {
    // Adjust lighting based on time of day
    this.adjustLightingForTimeOfDay();

    // Apply weather effects
    this.applyWeatherEffects();

    // Adjust for season
    this.applySeasonalEffects();

    // Respond to player mood
    this.adjustForPlayerMood();
  }

  private adjustLightingForTimeOfDay(): void {
    const lights = this.scene.lights;
    const timeMultiplier = this.getTimeMultiplier();

    lights.forEach(light => {
      if (
        light instanceof BABYLON.DirectionalLight ||
        light instanceof BABYLON.HemisphericLight
      ) {
        light.intensity = Math.max(0.1, light.intensity * timeMultiplier);
      }
    });
  }

  private getTimeMultiplier(): number {
    switch (this.battlefieldState.timeOfDay) {
      case 'dawn':
        return 0.6;
      case 'day':
        return 1.0;
      case 'dusk':
        return 0.4;
      case 'night':
        return 0.2;
      default:
        return 1.0;
    }
  }

  private applyWeatherEffects(): void {
    // Remove existing weather effects
    this.clearWeatherEffects();

    switch (this.battlefieldState.weather) {
      case 'rain':
        this.createRainEffect();
        break;
      case 'storm':
        this.createStormEffect();
        break;
      case 'fog':
        this.createFogEffect();
        break;
      case 'snow':
        this.createSnowEffect();
        break;
    }
  }

  private clearWeatherEffects(): void {
    // Clear previous weather particle systems
    this.battlefieldState.activeEffects =
      this.battlefieldState.activeEffects.filter(
        effect => !effect.startsWith('weather_'),
      );
  }

  private createRainEffect(): void {
    // Implementation for rain particles
    console.log('🌧️ Rain effect activated');
    this.battlefieldState.activeEffects.push('weather_rain');
  }

  private createStormEffect(): void {
    // Implementation for storm effects
    console.log('⛈️ Storm effect activated');
    this.battlefieldState.activeEffects.push('weather_storm');
  }

  private createFogEffect(): void {
    // Implementation for fog
    console.log('🌫️ Fog effect activated');
    this.battlefieldState.activeEffects.push('weather_fog');
  }

  private createSnowEffect(): void {
    // Implementation for snow
    console.log('❄️ Snow effect activated');
    this.battlefieldState.activeEffects.push('weather_snow');
  }

  private applySeasonalEffects(): void {
    // Apply seasonal color adjustments, foliage changes, etc.
    console.log(`🍃 Applying ${this.battlefieldState.season} seasonal effects`);
  }

  private adjustForPlayerMood(): void {
    // Adjust particle intensity, colors, etc. based on player mood
    const moodIntensity = this.getMoodIntensity();

    this.interactiveElements.forEach(element => {
      if (element.particleSystem) {
        element.particleSystem.emitRate *= moodIntensity;
      }
    });
  }

  private getMoodIntensity(): number {
    switch (this.battlefieldState.playerMood) {
      case 'calm':
        return 0.7;
      case 'excited':
        return 1.3;
      case 'tense':
        return 1.1;
      case 'victorious':
        return 1.5;
      default:
        return 1.0;
    }
  }

  /**
   * Subscribe to battlefield state changes
   */
  public onStateChange(callback: (state: BattlefieldState) => void): void {
    this.stateChangeCallbacks.push(callback);
  }

  /**
   * Get current battlefield state
   */
  public getBattlefieldState(): BattlefieldState {
    return { ...this.battlefieldState };
  }

  /**
   * Get all interactive elements
   */
  public getInteractiveElements(): InteractiveElement[] {
    return Array.from(this.interactiveElements.values());
  }

  /**
   * Remove an interactive element
   */
  public removeInteractiveElement(elementId: string): void {
    const element = this.interactiveElements.get(elementId);
    if (element) {
      // Clean up resources
      if (element.particleSystem) {
        element.particleSystem.dispose();
      }

      if (element.audioSource) {
        element.audioSource.dispose();
      }

      if (element.animations) {
        element.animations.forEach(animation => animation.dispose());
      }

      this.interactiveElements.delete(elementId);
    }
  }

  /**
   * Clean up all resources
   */
  public dispose(): void {
    // Stop real-time environment updates
    realTimeEnvironmentService.stopAutomaticUpdates();

    // Dispose all interactive elements
    this.interactiveElements.forEach((element, id) => {
      this.removeInteractiveElement(id);
    });

    if (this.hoverHighlight) {
      this.hoverHighlight.dispose();
    }

    this.stateChangeCallbacks = [];
    console.log('[BattlefieldInteractionSystem] Disposed');
  }
}
