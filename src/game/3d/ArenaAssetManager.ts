import * as BABYLON from 'babylonjs';

export interface AssetManifest {
  theme: string;
  totalSize: number; // in MB
  assets: AssetInfo[];
}

export interface AssetInfo {
  name: string;
  url: string;
  type: 'texture' | 'mesh' | 'sound' | 'animation';
  size: number; // in KB
  priority: 'high' | 'medium' | 'low';
  compressed?: boolean;
}

/**
 * Manages efficient loading and streaming of arena assets
 * Optimized for <100MB total asset footprint per battlefield
 */
export class ArenaAssetManager {
  private scene: BABYLON.Scene;
  private loadedAssets: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  private textureAtlases: Map<string, BABYLON.Texture> = new Map();
  private totalMemoryUsage: number = 0;
  private maxMemoryLimit: number = 100 * 1024 * 1024; // 100MB in bytes

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.setupMemoryOptimizations();
  }

  private setupMemoryOptimizations(): void {
    // Enable texture compression if available
    if (this.scene.getEngine().getCaps().s3tc) {
      console.log('[ArenaAssetManager] S3TC texture compression available');
    }

    // Set up texture atlas optimization
    this.scene
      .getEngine()
      .setHardwareScalingLevel(1 / window.devicePixelRatio || 1);

    // Enable mesh optimization
    this.scene.skipPointerMovePicking = true;
    this.scene.autoClear = false;
    this.scene.autoClearDepthAndStencil = false;
  }

  /**
   * Load assets for a specific theme with progressive streaming
   */
  public async loadThemeAssets(
    theme: string,
    quality: 'low' | 'medium' | 'high' | 'ultra',
  ): Promise<void> {
    console.log(
      `[ArenaAssetManager] Loading assets for theme: ${theme}, quality: ${quality}`,
    );

    const manifest = await this.getAssetManifest(theme, quality);

    // Check memory constraints
    if (manifest.totalSize > this.maxMemoryLimit / (1024 * 1024)) {
      console.warn(
        `[ArenaAssetManager] Theme ${theme} exceeds memory limit, reducing quality`,
      );
      return this.loadThemeAssets(theme, this.getReducedQuality(quality));
    }

    // Load high-priority assets first
    const highPriorityAssets = manifest.assets.filter(
      asset => asset.priority === 'high',
    );
    await this.loadAssetBatch(highPriorityAssets);

    // Stream medium and low priority assets
    const mediumPriorityAssets = manifest.assets.filter(
      asset => asset.priority === 'medium',
    );
    const lowPriorityAssets = manifest.assets.filter(
      asset => asset.priority === 'low',
    );

    // Load medium priority in background
    setTimeout(() => this.loadAssetBatch(mediumPriorityAssets), 100);

    // Load low priority when system is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.loadAssetBatch(lowPriorityAssets));
    } else {
      setTimeout(() => this.loadAssetBatch(lowPriorityAssets), 1000);
    }
  }

  private async getAssetManifest(
    theme: string,
    quality: string,
  ): Promise<AssetManifest> {
    // Generate dynamic asset manifest based on theme and quality
    const baseAssets = this.getBaseAssetList(theme);
    const qualityMultiplier = this.getQualityMultiplier(quality);

    return {
      theme,
      totalSize:
        baseAssets.reduce(
          (total, asset) => total + asset.size * qualityMultiplier,
          0,
        ) / 1024, // Convert to MB
      assets: baseAssets.map(asset => ({
        ...asset,
        size: asset.size * qualityMultiplier,
      })),
    };
  }

  private getBaseAssetList(theme: string): AssetInfo[] {
    const commonAssets: AssetInfo[] = [
      {
        name: 'skybox_texture',
        url: `/assets/themes/${theme}/skybox.webp`,
        type: 'texture',
        size: 512, // KB
        priority: 'high',
        compressed: true,
      },
      {
        name: 'floor_texture',
        url: `/assets/themes/${theme}/floor.webp`,
        type: 'texture',
        size: 256,
        priority: 'high',
        compressed: true,
      },
      {
        name: 'floor_normal',
        url: `/assets/themes/${theme}/floor_normal.webp`,
        type: 'texture',
        size: 256,
        priority: 'medium',
        compressed: true,
      },
    ];

    // Add theme-specific assets
    switch (theme) {
      case 'forest':
        return [...commonAssets, ...this.getForestAssets()];
      case 'desert':
        return [...commonAssets, ...this.getDesertAssets()];
      case 'volcano':
        return [...commonAssets, ...this.getVolcanoAssets()];
      case 'hearthstone':
        return [...commonAssets, ...this.getHearthstoneAssets()];
      default:
        return commonAssets;
    }
  }

  private getForestAssets(): AssetInfo[] {
    return [
      {
        name: 'tree_mesh',
        url: '/assets/themes/forest/tree.babylon',
        type: 'mesh',
        size: 1024,
        priority: 'medium',
        compressed: true,
      },
      {
        name: 'waterfall_texture',
        url: '/assets/themes/forest/waterfall.webp',
        type: 'texture',
        size: 512,
        priority: 'low',
        compressed: true,
      },
      {
        name: 'leaves_particle',
        url: '/assets/themes/forest/leaves.webp',
        type: 'texture',
        size: 128,
        priority: 'low',
        compressed: true,
      },
    ];
  }

  private getDesertAssets(): AssetInfo[] {
    return [
      {
        name: 'pyramid_mesh',
        url: '/assets/themes/desert/pyramid.babylon',
        type: 'mesh',
        size: 800,
        priority: 'medium',
        compressed: true,
      },
      {
        name: 'sand_dune_texture',
        url: '/assets/themes/desert/sand_dunes.webp',
        type: 'texture',
        size: 384,
        priority: 'medium',
        compressed: true,
      },
      {
        name: 'mirage_effect',
        url: '/assets/themes/desert/heat_shimmer.webp',
        type: 'texture',
        size: 256,
        priority: 'low',
        compressed: true,
      },
    ];
  }

  private getVolcanoAssets(): AssetInfo[] {
    return [
      {
        name: 'lava_texture',
        url: '/assets/themes/volcano/lava.webp',
        type: 'texture',
        size: 768,
        priority: 'high',
        compressed: true,
      },
      {
        name: 'rock_formation',
        url: '/assets/themes/volcano/rocks.babylon',
        type: 'mesh',
        size: 1200,
        priority: 'medium',
        compressed: true,
      },
      {
        name: 'smoke_particle',
        url: '/assets/themes/volcano/smoke.webp',
        type: 'texture',
        size: 256,
        priority: 'low',
        compressed: true,
      },
    ];
  }

  private getHearthstoneAssets(): AssetInfo[] {
    return [
      {
        name: 'tavern_interior',
        url: '/assets/themes/hearthstone/tavern.babylon',
        type: 'mesh',
        size: 1500,
        priority: 'high',
        compressed: true,
      },
      {
        name: 'fireplace_texture',
        url: '/assets/themes/hearthstone/fireplace.webp',
        type: 'texture',
        size: 512,
        priority: 'high',
        compressed: true,
      },
      {
        name: 'torch_flame',
        url: '/assets/themes/hearthstone/torch.webp',
        type: 'texture',
        size: 128,
        priority: 'medium',
        compressed: true,
      },
    ];
  }

  private async loadAssetBatch(assets: AssetInfo[]): Promise<void> {
    const loadPromises = assets.map(asset => this.loadAsset(asset));
    await Promise.allSettled(loadPromises);
  }

  private async loadAsset(asset: AssetInfo): Promise<any> {
    // Check if already loading
    if (this.loadingPromises.has(asset.name)) {
      return this.loadingPromises.get(asset.name);
    }

    // Check if already loaded
    if (this.loadedAssets.has(asset.name)) {
      return this.loadedAssets.get(asset.name);
    }

    const loadPromise = this.performAssetLoad(asset);
    this.loadingPromises.set(asset.name, loadPromise);

    try {
      const loadedAsset = await loadPromise;
      this.loadedAssets.set(asset.name, loadedAsset);
      this.totalMemoryUsage += asset.size * 1024; // Convert KB to bytes
      this.loadingPromises.delete(asset.name);
      return loadedAsset;
    } catch (error) {
      console.warn(
        `[ArenaAssetManager] Failed to load asset ${asset.name}:`,
        error,
      );
      this.loadingPromises.delete(asset.name);
      return this.createFallbackAsset(asset);
    }
  }

  private async performAssetLoad(asset: AssetInfo): Promise<any> {
    switch (asset.type) {
      case 'texture':
        return this.loadTexture(asset);
      case 'mesh':
        return this.loadMesh(asset);
      case 'sound':
        return this.loadSound(asset);
      case 'animation':
        return this.loadAnimation(asset);
      default:
        throw new Error(`Unsupported asset type: ${asset.type}`);
    }
  }

  private async loadTexture(asset: AssetInfo): Promise<BABYLON.Texture> {
    // Try to load from texture atlas first
    const atlasTexture = this.getFromTextureAtlas(asset.name);
    if (atlasTexture) {
      return atlasTexture;
    }

    // Create texture with optimizations
    const texture = new BABYLON.Texture(asset.url, this.scene, false, true);

    // Apply compression if supported
    if (asset.compressed && this.scene.getEngine().getCaps().s3tc) {
      texture.format = BABYLON.Engine.TEXTUREFORMAT_COMPRESSED_RGBA_S3TC_DXT5;
    }

    // Set optimization flags
    texture.generateMipMaps = true;
    texture.anisotropicFilteringLevel = 2;

    return texture;
  }

  private async loadMesh(asset: AssetInfo): Promise<BABYLON.AbstractMesh[]> {
    return new Promise((resolve, reject) => {
      BABYLON.SceneLoader.LoadAssetContainer(
        asset.url,
        '',
        this.scene,
        container => {
          // Optimize meshes for performance
          container.meshes.forEach(mesh => {
            if (mesh instanceof BABYLON.Mesh) {
              // Enable mesh optimization
              mesh.simplify([
                { quality: 0.9, distance: 100 },
                { quality: 0.7, distance: 200 },
                { quality: 0.5, distance: 300 },
              ]);

              // Enable GPU instancing for repeated objects
              mesh.createInstance = mesh.createInstance || (() => mesh.clone());
            }
          });

          container.addAllToScene();
          resolve(container.meshes);
        },
        null,
        (scene, message, exception) => {
          reject(new Error(`Failed to load mesh: ${message}`));
        },
      );
    });
  }

  private async loadSound(asset: AssetInfo): Promise<BABYLON.Sound> {
    return new BABYLON.Sound(asset.name, asset.url, this.scene, null, {
      loop: false,
      autoplay: false,
      volume: 0.5,
      spatialSound: true,
      maxDistance: 100,
    });
  }

  private async loadAnimation(
    asset: AssetInfo,
  ): Promise<BABYLON.AnimationGroup> {
    // Placeholder for animation loading
    return new BABYLON.AnimationGroup(asset.name, this.scene);
  }

  private createFallbackAsset(asset: AssetInfo): any {
    console.log(`[ArenaAssetManager] Creating fallback for ${asset.name}`);

    switch (asset.type) {
      case 'texture':
        return this.createProceduralTexture(asset.name);
      case 'mesh':
        return [
          BABYLON.MeshBuilder.CreateBox(asset.name, { size: 1 }, this.scene),
        ];
      default:
        return null;
    }
  }

  private createProceduralTexture(name: string): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture(name, 256, this.scene);
    const context = texture.getContext();

    // Create a simple procedural pattern
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#444444');
    gradient.addColorStop(1, '#888888');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    texture.update();

    return texture;
  }

  private getFromTextureAtlas(name: string): BABYLON.Texture | null {
    // Implementation for texture atlas system
    return null;
  }

  private getQualityMultiplier(quality: string): number {
    switch (quality) {
      case 'low':
        return 0.5;
      case 'medium':
        return 0.75;
      case 'high':
        return 1.0;
      case 'ultra':
        return 1.5;
      default:
        return 1.0;
    }
  }

  private getReducedQuality(
    quality: string,
  ): 'low' | 'medium' | 'high' | 'ultra' {
    switch (quality) {
      case 'ultra':
        return 'high';
      case 'high':
        return 'medium';
      case 'medium':
        return 'low';
      default:
        return 'low';
    }
  }

  /**
   * Get memory usage statistics
   */
  public getMemoryStats(): { used: number; limit: number; percentage: number } {
    return {
      used: this.totalMemoryUsage,
      limit: this.maxMemoryLimit,
      percentage: (this.totalMemoryUsage / this.maxMemoryLimit) * 100,
    };
  }

  /**
   * Clean up unused assets to free memory
   */
  public cleanup(): void {
    console.log('[ArenaAssetManager] Cleaning up assets');

    // Dispose of loaded assets
    this.loadedAssets.forEach((asset, name) => {
      if (asset && typeof asset.dispose === 'function') {
        asset.dispose();
      }
    });

    this.loadedAssets.clear();
    this.loadingPromises.clear();
    this.textureAtlases.clear();
    this.totalMemoryUsage = 0;
  }

  /**
   * Check if an asset is loaded
   */
  public isAssetLoaded(name: string): boolean {
    return this.loadedAssets.has(name);
  }

  /**
   * Get a loaded asset
   */
  public getAsset(name: string): any {
    return this.loadedAssets.get(name);
  }
}
