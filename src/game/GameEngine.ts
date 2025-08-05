import * as BABYLON from 'babylonjs';
import { GameScene } from './scenes/GameScene';
import { PerformanceManager } from './utils/PerformanceManager';
import { CardArtLoader } from './utils/CardArtLoader';
import { DeckManager } from './utils/DeckManager';
import { UnifiedMainMenuScene } from './scenes/UnifiedMainMenuScene';
import { UnifiedCardBattleScene } from './scenes/UnifiedCardBattleScene';
import { UnifiedDeckBuilderScene } from './scenes/UnifiedDeckBuilderScene';

export class GameEngine {
  private engine: BABYLON.Engine | null = null;
  private scene: BABYLON.Scene | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    // Game engine initialization
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
    container.appendChild(canvas);

    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);

    window.addEventListener('resize', this.handleResize.bind(this));

    this.initScenes();
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render();
      }
    });
  }

  private handleResize(): void {
    if (this.engine) {
      this.engine.resize();
    }
  }

  public destroy(): void {
    if (this.engine) {
      window.removeEventListener('resize', this.handleResize.bind(this));
      this.engine.dispose();
      this.scene = null;
      this.engine = null;
      CardArtLoader.getInstance().clearCache();
    }
  }

  private initScenes(): void {
    if (this.scene) {
      const performanceManager = PerformanceManager.getInstance();
      const _isLowPerformance = performanceManager.isLowPerformanceDevice();

      // Example: simple camera and light setup for the scene
      const camera = new BABYLON.ArcRotateCamera(
        'Camera',
        Math.PI / 2,
        Math.PI / 4,
        4,
        BABYLON.Vector3.Zero(),
        this.scene,
      );
      camera.attachControl(true);

      const _light = new BABYLON.HemisphericLight(
        'Light',
        new BABYLON.Vector3(1, 1, 0),
        this.scene,
      );

      // To be replaced with actual scene content
      // this.scene.manageScene(); <- Implement your scene management and rendering logic
    }
  }
}

export const gameEngine = new GameEngine();
