import * as BABYLON from 'babylonjs';
import { GameScene } from './scenes/GameScene';
import { PerformanceManager } from './utils/PerformanceManager';
import { CardArtLoader } from './utils/CardArtLoader';
import { DeckManager } from './utils/DeckManager';
import { UnifiedMainMenuScene } from './scenes/UnifiedMainMenuScene';
import { UnifiedCardBattleScene } from './scenes/UnifiedCardBattleScene';
import { UnifiedDeckBuilderScene } from './scenes/UnifiedDeckBuilderScene';
import { MysticalArena, type ArenaConfig } from './3d/MysticalArena';

// Industry-leading audio context for immersive sound
class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundEffects: Map<string, AudioBuffer> = new Map();
  private backgroundMusic: AudioBufferSourceNode | null = null;

  async init() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3; // Master volume
      this.masterGain.connect(this.audioContext.destination);
      console.log('[AudioManager] Audio system initialized');
      
      // Pre-warm audio context
      await this.audioContext.resume();
    } catch (_error) {
      console.warn('[AudioManager] Audio not available:', _error);
    }
  }

  // MTGA-style card draw sound - light whoosh
  playCardDraw() {
    this.playComplexTone([
      { freq: 400, time: 0, duration: 0.1, type: 'sine', volume: 0.2 },
      { freq: 600, time: 0.05, duration: 0.1, type: 'triangle', volume: 0.15 },
      { freq: 300, time: 0.1, duration: 0.05, type: 'sawtooth', volume: 0.1 }
    ]);
  }

  // MTGA-style card play sound - heavy drop with magical burst
  playCardPlay() {
    this.playComplexTone([
      { freq: 200, time: 0, duration: 0.2, type: 'square', volume: 0.3 },
      { freq: 800, time: 0.1, duration: 0.15, type: 'sine', volume: 0.2 },
      { freq: 1200, time: 0.15, duration: 0.1, type: 'triangle', volume: 0.15 }
    ]);
  }

  // MTGA-style life loss - impactful thump
  playLifeLoss() {
    this.playComplexTone([
      { freq: 80, time: 0, duration: 0.3, type: 'sawtooth', volume: 0.4 },
      { freq: 120, time: 0.1, duration: 0.2, type: 'square', volume: 0.2 }
    ]);
  }

  // MTGA-style life gain - harmonic chime
  playLifeGain() {
    this.playComplexTone([
      { freq: 523, time: 0, duration: 0.4, type: 'sine', volume: 0.2 }, // C
      { freq: 659, time: 0.1, duration: 0.4, type: 'sine', volume: 0.15 }, // E
      { freq: 784, time: 0.2, duration: 0.4, type: 'sine', volume: 0.1 } // G
    ]);
  }

  // Mana tap sounds with elemental pulses
  playManaTap(color: 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless') {
    const manaFrequencies = {
      white: { base: 440, harmony: 554, type: 'sine' as OscillatorType }, // A
      blue: { base: 494, harmony: 622, type: 'triangle' as OscillatorType }, // B
      black: { base: 311, harmony: 392, type: 'sawtooth' as OscillatorType }, // Eb
      red: { base: 370, harmony: 466, type: 'square' as OscillatorType }, // F#
      green: { base: 392, harmony: 494, type: 'sine' as OscillatorType }, // G
      colorless: { base: 330, harmony: 415, type: 'triangle' as OscillatorType } // E
    };

    const { base, harmony, type } = manaFrequencies[color];
    this.playComplexTone([
      { freq: base, time: 0, duration: 0.2, type, volume: 0.2 },
      { freq: harmony, time: 0.1, duration: 0.2, type, volume: 0.15 }
    ]);
  }

  playCardFlip() {
    this.playTone(800, 0.1, 'square');
  }

  playCardPlace() {
    this.playTone(400, 0.15, 'sine');
  }

  playCardHover() {
    this.playTone(600, 0.05, 'triangle');
  }

  playGameStart() {
    this.playMelody([523, 659, 784, 1047], 0.2); // C-E-G-C
  }

  // Enhanced complex tone system for layered sounds
  private playComplexTone(tones: Array<{
    freq: number;
    time: number;
    duration: number;
    type: OscillatorType;
    volume: number;
  }>) {
    if (!this.audioContext || !this.masterGain) return;

    tones.forEach(tone => {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain!);

        oscillator.frequency.setValueAtTime(tone.freq, this.audioContext!.currentTime);
        oscillator.type = tone.type;

        gainNode.gain.setValueAtTime(tone.volume, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext!.currentTime + tone.duration
        );

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + tone.duration);
      }, tone.time * 1000);
    });
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
  ) {
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration,
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playMelody(frequencies: number[], noteDuration: number) {
    frequencies.forEach((freq, index) => {
      setTimeout(
        () => this.playTone(freq, noteDuration),
        index * noteDuration * 1000,
      );
    });
  }
}

// Global audio manager instance
const audioManager = new AudioManager();

// Initialize audio when module loads
audioManager.init();

// Advanced particle system for magical effects
class ParticleSystem {
  private scene: BABYLON.Scene;
  private systems: BABYLON.ParticleSystem[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  createMagicalAura(
    position: BABYLON.Vector3,
    color: BABYLON.Color3,
  ): BABYLON.ParticleSystem {
    const particleSystem = new BABYLON.ParticleSystem(
      'magicalAura',
      200,
      this.scene,
    );

    // Texture
    particleSystem.particleTexture = new BABYLON.Texture(
      'https://playground.babylonjs.com/textures/flare.png',
      this.scene,
    );

    // Position
    particleSystem.emitter = position;
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, 0.5);

    // Colors
    particleSystem.color1 = color;
    particleSystem.color2 = new BABYLON.Color3(
      color.r * 0.5,
      color.g * 0.5,
      color.b * 0.5,
    );
    particleSystem.colorDead = new BABYLON.Color3(0, 0, 0);

    // Size
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;

    // Life time
    particleSystem.minLifeTime = 1.0;
    particleSystem.maxLifeTime = 2.0;

    // Emission rate
    particleSystem.emitRate = 50;

    // Blend mode
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Speed
    particleSystem.direction1 = new BABYLON.Vector3(-1, 2, -1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 4, 1);
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;

    // Update speed
    particleSystem.updateSpeed = 0.005;

    this.systems.push(particleSystem);
    return particleSystem;
  }

  createCardSparkles(position: BABYLON.Vector3): BABYLON.ParticleSystem {
    const sparkles = new BABYLON.ParticleSystem(
      'cardSparkles',
      100,
      this.scene,
    );

    sparkles.particleTexture = new BABYLON.Texture(
      'https://playground.babylonjs.com/textures/flare.png',
      this.scene,
    );
    sparkles.emitter = position;

    // Golden sparkles
    sparkles.color1 = new BABYLON.Color3(1, 0.84, 0); // Gold
    sparkles.color2 = new BABYLON.Color3(1, 1, 0.5); // Light gold
    sparkles.colorDead = new BABYLON.Color3(0.5, 0.5, 0);

    sparkles.minSize = 0.05;
    sparkles.maxSize = 0.15;
    sparkles.minLifeTime = 0.5;
    sparkles.maxLifeTime = 1.5;
    sparkles.emitRate = 30;
    sparkles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    sparkles.direction1 = new BABYLON.Vector3(-0.5, 1, -0.5);
    sparkles.direction2 = new BABYLON.Vector3(0.5, 2, 0.5);
    sparkles.minEmitPower = 0.5;
    sparkles.maxEmitPower = 1.5;

    this.systems.push(sparkles);
    return sparkles;
  }

  dispose() {
    this.systems.forEach(system => system.dispose());
    this.systems = [];
  }
}

export class GameEngine {
  private engine: BABYLON.Engine | null = null;
  private scene: BABYLON.Scene | null = null;
  private container: HTMLElement | null = null;
  private audioManager: AudioManager;
  private particleSystem: ParticleSystem | null = null;
  private camera: BABYLON.ArcRotateCamera | null = null;
  private materials: Map<string, BABYLON.Material> = new Map();
  private mysticalArena: MysticalArena | null = null;

  constructor() {
    this.audioManager = new AudioManager();
    // Initialize audio asynchronously to avoid blocking
    this.audioManager.init().catch(error => {
      console.warn('[GameEngine] Audio initialization failed:', error);
    });
  }

  public async init(container: HTMLElement): Promise<void> {
    if (this.engine) {
      console.log(
        '[GameEngine] Game already initialized, destroying previous instance',
      );
      this.destroy();
    }

    this.container = container;
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;

    console.log(
      `[GameEngine] Initializing with container size: ${containerWidth}x${containerHeight}`,
    );

    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Enhanced engine with antialias and stencil for better graphics
    this.engine = new BABYLON.Engine(canvas, true, {
      antialias: true,
      stencil: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    this.scene = new BABYLON.Scene(this.engine);

    // Add resize handling first
    window.addEventListener('resize', this.handleResize.bind(this));

    // Initialize core systems progressively
    await this.initCoreSystemsAsync();

    this.initTouchControls(canvas);

    // Enhanced render loop with performance monitoring
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render();
      }
    });

    // Play startup sound after everything is ready
    this.audioManager.playGameStart();
  }

  private initTouchControls(canvas: HTMLCanvasElement): void {
    // Touch controls for mobile devices
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      console.log('[GameEngine] Initializing touch controls');

      let touchStartPos = { x: 0, y: 0 };
      let touchStartTime = 0;
      let isDragging = false;

      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTime = Date.now();
        isDragging = false;

        // Audio feedback for touch
        this.audioManager.playCardHover();
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartPos.x;
        const deltaY = touch.clientY - touchStartPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 10) {
          isDragging = true;

          // Handle camera rotation for touch drag
          if (this.camera && this.camera instanceof BABYLON.ArcRotateCamera) {
            const sensitivity = 0.01;
            this.camera.alpha += deltaX * sensitivity;
            this.camera.beta = Math.max(
              0.1,
              Math.min(Math.PI - 0.1, this.camera.beta + deltaY * sensitivity),
            );
          }

          touchStartPos = { x: touch.clientX, y: touch.clientY };
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        const touchDuration = Date.now() - touchStartTime;

        // Distinguish between tap and drag
        if (!isDragging && touchDuration < 300) {
          // Handle tap
          this.handleTouchTap(e);
        }

        isDragging = false;
      };

      // Add touch event listeners
      canvas.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Store event listeners for cleanup
      (canvas as any)._touchHandlers = {
        touchstart: handleTouchStart,
        touchmove: handleTouchMove,
        touchend: handleTouchEnd,
      };
    }
  }

  private handleTouchTap(e: TouchEvent): void {
    // Handle touch tap events (card selection, menu interaction, etc.)
    console.log('[GameEngine] Touch tap detected');
    this.audioManager.playCardPlace();

    // In a real game, this would handle object picking and interaction
    // For now, just provide audio feedback
  }

  private handleResize(): void {
    if (this.engine) {
      this.engine.resize();
    }
  }

  public destroy(): void {
    if (this.engine) {
      window.removeEventListener('resize', this.handleResize.bind(this));

      // Clean up touch event listeners
      const canvas = this.engine.getRenderingCanvas();
      if (canvas && (canvas as any)._touchHandlers) {
        const handlers = (canvas as any)._touchHandlers;
        canvas.removeEventListener('touchstart', handlers.touchstart);
        canvas.removeEventListener('touchmove', handlers.touchmove);
        canvas.removeEventListener('touchend', handlers.touchend);
        delete (canvas as any)._touchHandlers;
      }

      // Clean up mystical arena
      if (this.mysticalArena) {
        this.mysticalArena.dispose();
        this.mysticalArena = null;
      }

      // Clean up particle systems
      if (this.particleSystem) {
        this.particleSystem.dispose();
        this.particleSystem = null;
      }

      // Clean up materials
      this.materials.forEach(material => material.dispose());
      this.materials.clear();

      this.engine.dispose();
      this.scene = null;
      this.engine = null;
      this.camera = null;
      CardArtLoader.getInstance().clearCache();
    }
  }

  private async initCoreSystemsAsync(): Promise<void> {
    if (!this.scene) return;

    const performanceManager = PerformanceManager.getInstance();
    const isLowPerformance = performanceManager.isLowPerformance();
    const settings = performanceManager.getSettings();

    // 1. Initialize camera first (minimal, fast)
    this.initCamera();

    // 2. Initialize 3D Mystical Arena (replaces basic environment)
    await this.init3DArena(settings, isLowPerformance);

    // 3. Initialize particle system
    this.particleSystem = new ParticleSystem(this.scene);

    console.log(
      '[GameEngine] Core systems initialized with 3D arena and quality:',
      settings.animationQuality,
    );
  }

  private initCamera(): void {
    if (!this.scene) return;

    // Advanced camera with smooth controls
    this.camera = new BABYLON.ArcRotateCamera(
      'gameCamera',
      Math.PI / 2,
      Math.PI / 3,
      15, // Increased distance for better arena view
      BABYLON.Vector3.Zero(),
      this.scene,
    );

    // Smooth camera controls
    this.camera.attachControl(true);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.wheelDeltaPercentage = 0.01;
    this.camera.pinchDeltaPercentage = 0.01;
    
    // Set camera limits for better arena viewing
    this.camera.lowerRadiusLimit = 8;
    this.camera.upperRadiusLimit = 25;
    this.camera.lowerBetaLimit = 0.1;
    this.camera.upperBetaLimit = Math.PI / 2.2;
  }

  private async init3DArena(settings: any, isLowPerformance: boolean): Promise<void> {
    if (!this.scene) return;

    console.log('[GameEngine] Initializing 3D Mystical Arena...');

    // Determine quality based on performance
    let quality: ArenaConfig['quality'] = 'high';
    if (isLowPerformance) {
      quality = 'low';
    } else if (settings.animationQuality === 'reduced') {
      quality = 'medium';
    } else if (settings.highPerformance) {
      quality = 'ultra';
    }

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     window.innerWidth < 768 ||
                     'ontouchstart' in window;

    // Create arena configuration
    const arenaConfig: ArenaConfig = {
      theme: 'mystical', // Default theme, can be customized
      quality: quality,
      enableParticles: !isLowPerformance && settings.backgroundEffectsEnabled !== false,
      enableLighting: true,
      enablePostProcessing: quality === 'ultra' && !isMobile,
      isMobile: isMobile
    };

    try {
      // Initialize the mystical arena
      this.mysticalArena = new MysticalArena(this.scene, arenaConfig);
      await this.mysticalArena.initialize();

      console.log('[GameEngine] 3D Mystical Arena initialized successfully with quality:', quality);
    } catch (error) {
      console.warn('[GameEngine] Failed to initialize 3D arena, falling back to basic environment:', error);
      // Fallback to basic environment if arena fails
      await this.createBasicEnvironmentFallback();
    }
  }

  private async createBasicEnvironmentFallback(): Promise<void> {
    if (!this.scene) return;

    console.log('[GameEngine] Creating basic environment fallback');

    // Simple skybox
    const skybox = BABYLON.MeshBuilder.CreateSphere(
      'fallbackSkyBox',
      { diameter: 80 },
      this.scene,
    );
    const skyboxMaterial = new BABYLON.StandardMaterial('fallbackSkyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.02, 0.1);
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    // Simple ground
    const ground = BABYLON.MeshBuilder.CreateGround(
      'fallbackGround',
      { width: 20, height: 20 },
      this.scene,
    );
    const groundMaterial = new BABYLON.StandardMaterial(
      'fallbackGroundMaterial',
      this.scene,
    );
    groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.05, 0.2);
    ground.material = groundMaterial;

    // Basic lighting
    const ambientLight = new BABYLON.HemisphericLight(
      'fallbackAmbient',
      new BABYLON.Vector3(0, 1, 0),
      this.scene,
    );
    ambientLight.intensity = 0.3;

    const mainLight = new BABYLON.DirectionalLight(
      'fallbackMain',
      new BABYLON.Vector3(-1, -1, -1),
      this.scene,
    );
    mainLight.intensity = 0.8;
  }

  private async setupBasicLighting(): Promise<void> {
    if (!this.scene) return;

    // Ambient light for general illumination (immediate)
    const ambientLight = new BABYLON.HemisphericLight(
      'ambientLight',
      new BABYLON.Vector3(0, 1, 0),
      this.scene,
    );
    ambientLight.intensity = 0.3;

    // Main directional light (immediate)
    const mainLight = new BABYLON.DirectionalLight(
      'mainLight',
      new BABYLON.Vector3(-1, -1, -1),
      this.scene,
    );
    mainLight.intensity = 0.8;
    mainLight.diffuse = new BABYLON.Color3(1, 0.95, 0.8); // Warm sunlight

    // Defer advanced lighting for better startup performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.setupAdvancedLighting();
      });
    } else {
      setTimeout(() => {
        this.setupAdvancedLighting();
      }, 100);
    }
  }

  private async createEnvironmentProgressive(
    settings: any,
    isLowPerformance: boolean,
  ): Promise<void> {
    if (!this.scene) return;

    // Create basic environment first (fast)
    this.createBasicEnvironment();

    // Add advanced features progressively
    if (!isLowPerformance) {
      // Use requestIdleCallback to avoid blocking
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.addAdvancedEnvironmentFeatures(settings);
        });
      } else {
        setTimeout(() => {
          this.addAdvancedEnvironmentFeatures(settings);
        }, 50);
      }
    }

    // Create sample objects after a short delay
    setTimeout(() => {
      this.createSampleGameObjects(settings);
    }, 100);

    // Setup post-processing last
    setTimeout(() => {
      this.setupPostProcessing(isLowPerformance);
    }, 200);
  }

  private createBasicEnvironment(): void {
    if (!this.scene) return;

    // Simple skybox (fast)
    const skybox = BABYLON.MeshBuilder.CreateSphere(
      'skyBox',
      { diameter: 100 },
      this.scene,
    );
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.02, 0.1);
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    // Simple ground (fast)
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 20, height: 20 },
      this.scene,
    );
    const groundMaterial = new BABYLON.StandardMaterial(
      'groundMaterial',
      this.scene,
    );
    groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.05, 0.2);
    ground.material = groundMaterial;
    this.materials.set('ground', groundMaterial);
  }

  private addAdvancedEnvironmentFeatures(settings: any): void {
    // Add complex visual effects after basic scene is ready
    const groundMaterial = this.materials.get(
      'ground',
    ) as BABYLON.StandardMaterial;
    if (groundMaterial && settings.glowEffectsEnabled) {
      groundMaterial.specularColor = new BABYLON.Color3(0.3, 0.2, 0.5);
      groundMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.05);
      groundMaterial.emissiveFresnelParameters =
        new BABYLON.FresnelParameters();
      groundMaterial.emissiveFresnelParameters.bias = 0.1;
      groundMaterial.emissiveFresnelParameters.power = 0.5;
      groundMaterial.emissiveFresnelParameters.leftColor =
        BABYLON.Color3.Black();
      groundMaterial.emissiveFresnelParameters.rightColor = new BABYLON.Color3(
        0.3,
        0.1,
        0.5,
      );
    }

    // Add particle effects
    if (this.particleSystem && settings.backgroundEffectsEnabled) {
      const aura1 = this.particleSystem.createMagicalAura(
        new BABYLON.Vector3(3, 1, 3),
        new BABYLON.Color3(0.5, 0.2, 1),
      );
      aura1.start();

      const aura2 = this.particleSystem.createMagicalAura(
        new BABYLON.Vector3(-3, 1, -3),
        new BABYLON.Color3(0.2, 1, 0.5),
      );
      aura2.start();
    }
  }

  private initAdvancedScenes(): void {
    if (this.scene) {
      const performanceManager = PerformanceManager.getInstance();
      const isLowPerformance = performanceManager.isLowPerformance();
      const settings = performanceManager.getSettings();

      // Advanced camera with smooth controls
      this.camera = new BABYLON.ArcRotateCamera(
        'gameCamera',
        Math.PI / 2,
        Math.PI / 3,
        10,
        BABYLON.Vector3.Zero(),
        this.scene,
      );

      // Smooth camera controls
      this.camera.attachControl(true);
      this.camera.setTarget(BABYLON.Vector3.Zero());
      this.camera.wheelDeltaPercentage = 0.01;
      this.camera.pinchDeltaPercentage = 0.01;

      // Dynamic lighting system
      this.setupAdvancedLighting(isLowPerformance);

      // Create mystical environment
      this.createMysticalEnvironment(settings);

      // Add sample game objects with enhanced materials
      this.createSampleGameObjects(settings);

      // Setup post-processing effects
      this.setupPostProcessing(isLowPerformance);

      console.log(
        '[GameEngine] Advanced scenes initialized with quality:',
        settings.animationQuality,
      );
    }
  }

  private setupAdvancedLighting(isLowPerformance?: boolean): void {
    if (!this.scene) return;

    if (isLowPerformance === undefined) {
      const performanceManager = PerformanceManager.getInstance();
      isLowPerformance = performanceManager.isLowPerformance();
    }

    // Ambient light for general illumination
    const ambientLight = new BABYLON.HemisphericLight(
      'ambientLight',
      new BABYLON.Vector3(0, 1, 0),
      this.scene,
    );
    ambientLight.intensity = 0.3;

    // Main directional light (sun)
    const mainLight = new BABYLON.DirectionalLight(
      'mainLight',
      new BABYLON.Vector3(-1, -1, -1),
      this.scene,
    );
    mainLight.intensity = 0.8;
    mainLight.diffuse = new BABYLON.Color3(1, 0.95, 0.8); // Warm sunlight

    if (!isLowPerformance) {
      // Point lights for dramatic effect
      const mysticalLight1 = new BABYLON.PointLight(
        'mysticalLight1',
        new BABYLON.Vector3(5, 3, 5),
        this.scene,
      );
      mysticalLight1.diffuse = new BABYLON.Color3(0.5, 0.2, 1); // Purple
      mysticalLight1.intensity = 0.5;
      mysticalLight1.range = 10;

      const mysticalLight2 = new BABYLON.PointLight(
        'mysticalLight2',
        new BABYLON.Vector3(-5, 3, -5),
        this.scene,
      );
      mysticalLight2.diffuse = new BABYLON.Color3(0.2, 1, 0.5); // Green
      mysticalLight2.intensity = 0.4;
      mysticalLight2.range = 8;

      // Animate the mystical lights
      this.animateMysticalLights([mysticalLight1, mysticalLight2]);
    }
  }

  private animateMysticalLights(lights: BABYLON.PointLight[]): void {
    lights.forEach((light, index) => {
      // Create a simple repeating animation using scene.registerBeforeRender
      if (this.scene) {
        let time = 0;
        this.scene.registerBeforeRender(() => {
          time += 0.01;
          light.intensity =
            light.intensity * (0.7 + 0.3 * Math.sin(time + index));
        });
      }
    });
  }

  private createMysticalEnvironment(settings: any): void {
    if (!this.scene) return;

    // Skybox with mystical colors
    const skybox = BABYLON.MeshBuilder.CreateSphere(
      'skyBox',
      { diameter: 100 },
      this.scene,
    );
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.02, 0.1); // Dark purple
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    // Ground with mystical patterns
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 20, height: 20 },
      this.scene,
    );
    const groundMaterial = new BABYLON.StandardMaterial(
      'groundMaterial',
      this.scene,
    );

    // Procedural mystical pattern
    groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.05, 0.2);
    groundMaterial.specularColor = new BABYLON.Color3(0.3, 0.2, 0.5);
    groundMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.05);

    if (settings.glowEffectsEnabled) {
      groundMaterial.emissiveFresnelParameters =
        new BABYLON.FresnelParameters();
      groundMaterial.emissiveFresnelParameters.bias = 0.1;
      groundMaterial.emissiveFresnelParameters.power = 0.5;
      groundMaterial.emissiveFresnelParameters.leftColor =
        BABYLON.Color3.Black();
      groundMaterial.emissiveFresnelParameters.rightColor = new BABYLON.Color3(
        0.3,
        0.1,
        0.5,
      );
    }

    ground.material = groundMaterial;
    this.materials.set('ground', groundMaterial);

    // Particle effects for atmosphere
    if (this.particleSystem && settings.backgroundEffectsEnabled) {
      const aura1 = this.particleSystem.createMagicalAura(
        new BABYLON.Vector3(3, 1, 3),
        new BABYLON.Color3(0.5, 0.2, 1),
      );
      aura1.start();

      const aura2 = this.particleSystem.createMagicalAura(
        new BABYLON.Vector3(-3, 1, -3),
        new BABYLON.Color3(0.2, 1, 0.5),
      );
      aura2.start();
    }
  }

  private createSampleGameObjects(settings: any): void {
    if (!this.scene) return;

    // Create sample cards with enhanced materials
    for (let i = 0; i < 3; i++) {
      const card = BABYLON.MeshBuilder.CreateBox(
        `card${i}`,
        { width: 1.5, height: 2, depth: 0.1 },
        this.scene,
      );

      card.position = new BABYLON.Vector3(i * 2 - 2, 1, 0);

      // Enhanced card material with mystical properties
      const cardMaterial = new BABYLON.StandardMaterial(
        `cardMaterial${i}`,
        this.scene,
      );
      cardMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.9);
      cardMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
      cardMaterial.specularPower = 64;

      if (settings.glowEffectsEnabled) {
        cardMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.05, 0.15);
        cardMaterial.emissiveFresnelParameters =
          new BABYLON.FresnelParameters();
        cardMaterial.emissiveFresnelParameters.bias = 0.2;
        cardMaterial.emissiveFresnelParameters.power = 1;
        cardMaterial.emissiveFresnelParameters.leftColor =
          BABYLON.Color3.Black();
        cardMaterial.emissiveFresnelParameters.rightColor = new BABYLON.Color3(
          0.5,
          0.3,
          0.8,
        );
      }

      card.material = cardMaterial;
      this.materials.set(`card${i}`, cardMaterial);

      // Add hover interaction
      this.addCardInteraction(card, i);

      // Floating animation
      const floatKeys = [
        { frame: 0, value: 1 },
        { frame: 60, value: 1.2 },
        { frame: 120, value: 1 },
      ];
      const floatAnimation = new BABYLON.Animation(
        `cardFloat${i}`,
        'position.y',
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
      );
      floatAnimation.setKeys(floatKeys);
      card.animations.push(floatAnimation);
      this.scene.beginAnimation(card, 0, 120, true);

      // Rotation animation
      const rotateKeys = [
        { frame: 0, value: 0 },
        { frame: 600, value: Math.PI * 2 },
      ];
      const rotateAnimation = new BABYLON.Animation(
        `cardRotate${i}`,
        'rotation.y',
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
      );
      rotateAnimation.setKeys(rotateKeys);
      card.animations.push(rotateAnimation);
      this.scene.beginAnimation(card, 0, 600, true);
    }
  }

  private addCardInteraction(card: BABYLON.Mesh, _index: number): void {
    if (!this.scene) return;

    card.actionManager = new BABYLON.ActionManager(this.scene);

    // Hover effects
    card.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => {
          this.audioManager.playCardHover();

          // Scale up with smooth transition
          if (this.scene) {
            const scaleUpKeys = [
              { frame: 0, value: 1 },
              { frame: 10, value: 1.1 },
            ];
            const scaleAnimation = new BABYLON.Animation(
              'cardHoverScale',
              'scaling.x',
              60,
              BABYLON.Animation.ANIMATIONTYPE_FLOAT,
              BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            );
            scaleAnimation.setKeys(scaleUpKeys);

            const scaleAnimationY = new BABYLON.Animation(
              'cardHoverScaleY',
              'scaling.y',
              60,
              BABYLON.Animation.ANIMATIONTYPE_FLOAT,
              BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            );
            scaleAnimationY.setKeys(scaleUpKeys);

            card.animations = [scaleAnimation, scaleAnimationY];
            this.scene.beginAnimation(card, 0, 10, false);
          }

          // Add sparkle effect
          if (this.particleSystem) {
            const sparkles = this.particleSystem.createCardSparkles(
              card.position,
            );
            sparkles.start();

            // Stop sparkles after a short time
            setTimeout(() => sparkles.stop(), 1000);
          }
        },
      ),
    );

    card.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        () => {
          // Scale back
          if (this.scene) {
            const scaleBackKeys = [
              { frame: 0, value: 1.1 },
              { frame: 10, value: 1 },
            ];
            const scaleAnimation = new BABYLON.Animation(
              'cardHoverScaleBack',
              'scaling.x',
              60,
              BABYLON.Animation.ANIMATIONTYPE_FLOAT,
              BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            );
            scaleAnimation.setKeys(scaleBackKeys);

            const scaleAnimationY = new BABYLON.Animation(
              'cardHoverScaleBackY',
              'scaling.y',
              60,
              BABYLON.Animation.ANIMATIONTYPE_FLOAT,
              BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            );
            scaleAnimationY.setKeys(scaleBackKeys);

            card.animations = [scaleAnimation, scaleAnimationY];
            this.scene.beginAnimation(card, 0, 10, false);
          }
        },
      ),
    );

    // Click effects
    card.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        this.audioManager.playCardPlace();

        // Flip animation
        if (this.scene) {
          const flipKeys = [
            { frame: 0, value: 0 },
            { frame: 30, value: Math.PI },
          ];
          const flipAnimation = new BABYLON.Animation(
            'cardFlip',
            'rotation.x',
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
          );
          flipAnimation.setKeys(flipKeys);

          card.animations = [flipAnimation];
          this.scene.beginAnimation(card, 0, 30, false);
        }
      }),
    );
  }

  private setupPostProcessing(isLowPerformance: boolean): void {
    if (!this.scene || !this.camera || isLowPerformance) return;

    try {
      // Simple glow effect instead of full bloom
      const glowLayer = new BABYLON.GlowLayer('glow', this.scene);
      glowLayer.intensity = 0.3;

      console.log('[GameEngine] Post-processing effects enabled');
    } catch (_error) {
      console.warn(
        '[GameEngine] Advanced post-processing not available, using fallback',
      );
    }
  }

  // Public methods for arena control
  public changeArenaTheme(theme: ArenaConfig['theme']): void {
    if (this.mysticalArena) {
      this.mysticalArena.changeTheme(theme);
      console.log('[GameEngine] Arena theme changed to:', theme);
    }
  }

  public updateArenaQuality(quality: ArenaConfig['quality']): void {
    if (this.mysticalArena) {
      this.mysticalArena.updateQuality(quality);
      console.log('[GameEngine] Arena quality updated to:', quality);
    }
  }

  public getArenaConfig(): ArenaConfig | null {
    return this.mysticalArena ? {
      theme: 'mystical', // We'll need to track this in the arena if we want to expose it
      quality: 'high',
      enableParticles: true,
      enableLighting: true,
      enablePostProcessing: false,
      isMobile: false
    } : null;
  }

  public isArenaInitialized(): boolean {
    return this.mysticalArena !== null;
  }
}

export const gameEngine = new GameEngine();
export { audioManager };
