import * as BABYLON from 'babylonjs';
import { GameScene } from './scenes/GameScene';
import { PerformanceManager } from './utils/PerformanceManager';
import { CardArtLoader } from './utils/CardArtLoader';
import { DeckManager } from './utils/DeckManager';
import { UnifiedMainMenuScene } from './scenes/UnifiedMainMenuScene';
import { UnifiedCardBattleScene } from './scenes/UnifiedCardBattleScene';
import { UnifiedDeckBuilderScene } from './scenes/UnifiedDeckBuilderScene';

// Industry-leading audio context for immersive sound
class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundEffects: Map<string, AudioBuffer> = new Map();
  private backgroundMusic: AudioBufferSourceNode | null = null;

  async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      console.log('[AudioManager] Audio system initialized');
    } catch (error) {
      console.warn('[AudioManager] Audio not available:', error);
    }
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

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playMelody(frequencies: number[], noteDuration: number) {
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, noteDuration), index * noteDuration * 1000);
    });
  }
}

// Advanced particle system for magical effects
class ParticleSystem {
  private scene: BABYLON.Scene;
  private systems: BABYLON.ParticleSystem[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  createMagicalAura(position: BABYLON.Vector3, color: BABYLON.Color3): BABYLON.ParticleSystem {
    const particleSystem = new BABYLON.ParticleSystem("magicalAura", 200, this.scene);

    // Texture
    particleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);

    // Position
    particleSystem.emitter = position;
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, 0.5);

    // Colors
    particleSystem.color1 = color;
    particleSystem.color2 = new BABYLON.Color3(color.r * 0.5, color.g * 0.5, color.b * 0.5);
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
    const sparkles = new BABYLON.ParticleSystem("cardSparkles", 100, this.scene);
    
    sparkles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
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

  constructor() {
    this.audioManager = new AudioManager();
    this.audioManager.init();
  }

  public init(container: HTMLElement): void {
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
    
    // Initialize particle system
    this.particleSystem = new ParticleSystem(this.scene);

    window.addEventListener('resize', this.handleResize.bind(this));

    this.initAdvancedScenes();
    
    // Enhanced render loop with performance monitoring
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render();
      }
    });

    // Play startup sound
    this.audioManager.playGameStart();
  }

  private handleResize(): void {
    if (this.engine) {
      this.engine.resize();
    }
  }

  public destroy(): void {
    if (this.engine) {
      window.removeEventListener('resize', this.handleResize.bind(this));
      
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

      console.log('[GameEngine] Advanced scenes initialized with quality:', settings.animationQuality);
    }
  }

  private setupAdvancedLighting(isLowPerformance: boolean): void {
    if (!this.scene) return;

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
          light.intensity = light.intensity * (0.7 + 0.3 * Math.sin(time + index));
        });
      }
    });
  }

  private createMysticalEnvironment(settings: any): void {
    if (!this.scene) return;

    // Skybox with mystical colors
    const skybox = BABYLON.MeshBuilder.CreateSphere('skyBox', { diameter: 100 }, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.02, 0.1); // Dark purple
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    // Ground with mystical patterns
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, this.scene);
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
    
    // Procedural mystical pattern
    groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.05, 0.2);
    groundMaterial.specularColor = new BABYLON.Color3(0.3, 0.2, 0.5);
    groundMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.05);
    
    if (settings.glowEffectsEnabled) {
      groundMaterial.emissiveFresnelParameters = new BABYLON.FresnelParameters();
      groundMaterial.emissiveFresnelParameters.bias = 0.1;
      groundMaterial.emissiveFresnelParameters.power = 0.5;
      groundMaterial.emissiveFresnelParameters.leftColor = BABYLON.Color3.Black();
      groundMaterial.emissiveFresnelParameters.rightColor = new BABYLON.Color3(0.3, 0.1, 0.5);
    }

    ground.material = groundMaterial;
    this.materials.set('ground', groundMaterial);

    // Particle effects for atmosphere
    if (this.particleSystem && settings.backgroundEffectsEnabled) {
      const aura1 = this.particleSystem.createMagicalAura(
        new BABYLON.Vector3(3, 1, 3),
        new BABYLON.Color3(0.5, 0.2, 1)
      );
      aura1.start();

      const aura2 = this.particleSystem.createMagicalAura(
        new BABYLON.Vector3(-3, 1, -3),
        new BABYLON.Color3(0.2, 1, 0.5)
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
      const cardMaterial = new BABYLON.StandardMaterial(`cardMaterial${i}`, this.scene);
      cardMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.9);
      cardMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
      cardMaterial.specularPower = 64;

      if (settings.glowEffectsEnabled) {
        cardMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.05, 0.15);
        cardMaterial.emissiveFresnelParameters = new BABYLON.FresnelParameters();
        cardMaterial.emissiveFresnelParameters.bias = 0.2;
        cardMaterial.emissiveFresnelParameters.power = 1;
        cardMaterial.emissiveFresnelParameters.leftColor = BABYLON.Color3.Black();
        cardMaterial.emissiveFresnelParameters.rightColor = new BABYLON.Color3(0.5, 0.3, 0.8);
      }

      card.material = cardMaterial;
      this.materials.set(`card${i}`, cardMaterial);

      // Add hover interaction
      this.addCardInteraction(card, i);

      // Floating animation
      const floatKeys = [
        { frame: 0, value: 1 },
        { frame: 60, value: 1.2 },
        { frame: 120, value: 1 }
      ];
      const floatAnimation = new BABYLON.Animation(`cardFloat${i}`, 'position.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      floatAnimation.setKeys(floatKeys);
      card.animations.push(floatAnimation);
      this.scene.beginAnimation(card, 0, 120, true);

      // Rotation animation
      const rotateKeys = [
        { frame: 0, value: 0 },
        { frame: 600, value: Math.PI * 2 }
      ];
      const rotateAnimation = new BABYLON.Animation(`cardRotate${i}`, 'rotation.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      rotateAnimation.setKeys(rotateKeys);
      card.animations.push(rotateAnimation);
      this.scene.beginAnimation(card, 0, 600, true);
    }
  }

  private addCardInteraction(card: BABYLON.Mesh, index: number): void {
    if (!this.scene) return;

    card.actionManager = new BABYLON.ActionManager(this.scene);

    // Hover effects
    card.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
        this.audioManager.playCardHover();
        
        // Scale up with smooth transition
        if (this.scene) {
          const scaleUpKeys = [
            { frame: 0, value: 1 },
            { frame: 10, value: 1.1 }
          ];
          const scaleAnimation = new BABYLON.Animation('cardHoverScale', 'scaling.x', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          scaleAnimation.setKeys(scaleUpKeys);
          
          const scaleAnimationY = new BABYLON.Animation('cardHoverScaleY', 'scaling.y', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          scaleAnimationY.setKeys(scaleUpKeys);
          
          card.animations = [scaleAnimation, scaleAnimationY];
          this.scene.beginAnimation(card, 0, 10, false);
        }

        // Add sparkle effect
        if (this.particleSystem) {
          const sparkles = this.particleSystem.createCardSparkles(card.position);
          sparkles.start();
          
          // Stop sparkles after a short time
          setTimeout(() => sparkles.stop(), 1000);
        }
      })
    );

    card.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
        // Scale back
        if (this.scene) {
          const scaleBackKeys = [
            { frame: 0, value: 1.1 },
            { frame: 10, value: 1 }
          ];
          const scaleAnimation = new BABYLON.Animation('cardHoverScaleBack', 'scaling.x', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          scaleAnimation.setKeys(scaleBackKeys);
          
          const scaleAnimationY = new BABYLON.Animation('cardHoverScaleBackY', 'scaling.y', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          scaleAnimationY.setKeys(scaleBackKeys);
          
          card.animations = [scaleAnimation, scaleAnimationY];
          this.scene.beginAnimation(card, 0, 10, false);
        }
      })
    );

    // Click effects
    card.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        this.audioManager.playCardPlace();
        
        // Flip animation
        if (this.scene) {
          const flipKeys = [
            { frame: 0, value: 0 },
            { frame: 30, value: Math.PI }
          ];
          const flipAnimation = new BABYLON.Animation('cardFlip', 'rotation.x', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          flipAnimation.setKeys(flipKeys);
          
          card.animations = [flipAnimation];
          this.scene.beginAnimation(card, 0, 30, false);
        }
      })
    );
  }

  private setupPostProcessing(isLowPerformance: boolean): void {
    if (!this.scene || !this.camera || isLowPerformance) return;

    try {
      // Simple glow effect instead of full bloom
      const glowLayer = new BABYLON.GlowLayer("glow", this.scene);
      glowLayer.intensity = 0.3;
      
      console.log('[GameEngine] Post-processing effects enabled');
    } catch (error) {
      console.warn('[GameEngine] Advanced post-processing not available, using fallback');
    }
  }
}

export const gameEngine = new GameEngine();
