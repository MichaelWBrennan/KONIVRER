import * as BABYLON from 'babylonjs';
import * as GUI from '@babylonjs/gui';

export type RenderingTechnique = '2d' | '2.5d' | 'isometric' | 'mode7' | '3d';

export interface GameZone {
  id: string;
  name: string;
  technique: RenderingTechnique;
  position: BABYLON.Vector3;
  bounds: BABYLON.Vector3; // width, height, depth
  active: boolean;
  priority: number; // Higher priority zones render last (on top)
}

export interface GameZonezConfig {
  enableParallax: boolean;
  mode7Speed: number;
  isometricAngle: number;
  sprite2DScale: number;
  maxZones: number;
}

/**
 * GameZonez - A pseudo-3D environment system that combines multiple rendering techniques
 * to create a layered, immersive game environment mixing 2D, 2.5D, isometric, 
 * mode7, and full 3D elements.
 */
export class GameZonez {
  private scene: BABYLON.Scene;
  private config: GameZonezConfig;
  private zones: Map<string, GameZone> = new Map();
  private renderNodes: Map<string, BABYLON.Node[]> = new Map();
  private materials: Map<string, BABYLON.Material> = new Map();
  private textures: Map<string, BABYLON.Texture> = new Map();
  
  // Mode7 specific
  private mode7Plane: BABYLON.Mesh | null = null;
  private mode7Material: BABYLON.Material | null = null;
  private mode7Time: number = 0;
  
  // Isometric specific
  private isometricCamera: BABYLON.Camera | null = null;
  
  // 2.5D sprite system
  private spriteManagers: Map<string, BABYLON.SpriteManager> = new Map();
  
  // Parallax layers for depth
  private parallaxLayers: BABYLON.Mesh[] = [];

  constructor(scene: BABYLON.Scene, config?: Partial<GameZonezConfig>) {
    this.scene = scene;
    this.config = {
      enableParallax: true,
      mode7Speed: 0.02,
      isometricAngle: Math.PI / 6, // 30 degrees
      sprite2DScale: 1.0,
      maxZones: 10,
      ...config,
    };

    console.log('[GameZonez] Initializing pseudo-3D environment system');
  }

  public async initialize(): Promise<void> {
    console.log('[GameZonez] Setting up multi-technique rendering system...');

    // Initialize core rendering systems
    await this.setupMode7Background();
    await this.setupIsometricZone();
    await this.setup2DOverlays();
    await this.setupParallaxLayers();
    await this.createDefaultZones();

    // Start animation loops
    this.startAnimationLoop();

    console.log('[GameZonez] Pseudo-3D environment initialized successfully');
  }

  /**
   * Create default zones that showcase different rendering techniques
   */
  private async createDefaultZones(): Promise<void> {
    // Background Mode7 zone for distant landscapes
    this.createZone({
      id: 'mode7_background',
      name: 'Mode7 Background',
      technique: 'mode7',
      position: new BABYLON.Vector3(0, -2, -20),
      bounds: new BABYLON.Vector3(40, 1, 40),
      active: true,
      priority: 0, // Lowest priority - renders first
    });

    // Isometric battlefield zone
    this.createZone({
      id: 'isometric_battlefield',
      name: 'Isometric Battlefield',
      technique: 'isometric',
      position: new BABYLON.Vector3(0, 0, 0),
      bounds: new BABYLON.Vector3(16, 8, 16),
      active: true,
      priority: 2,
    });

    // 2.5D sprite zone for characters and cards
    this.createZone({
      id: 'sprite_characters',
      name: '2.5D Characters',
      technique: '2.5d',
      position: new BABYLON.Vector3(0, 1, 2),
      bounds: new BABYLON.Vector3(12, 6, 8),
      active: true,
      priority: 3,
    });

    // 2D HUD and UI overlay zone
    this.createZone({
      id: 'ui_overlay',
      name: '2D UI Overlay',
      technique: '2d',
      position: new BABYLON.Vector3(0, 0, 5),
      bounds: new BABYLON.Vector3(20, 12, 1),
      active: true,
      priority: 10, // Highest priority - renders last
    });

    // Full 3D zone for special effects
    this.createZone({
      id: '3d_effects',
      name: '3D Effects',
      technique: '3d',
      position: new BABYLON.Vector3(0, 2, 0),
      bounds: new BABYLON.Vector3(8, 4, 8),
      active: true,
      priority: 5,
    });
  }

  /**
   * Setup Mode7-style background that can scale and rotate like SNES games
   */
  private async setupMode7Background(): Promise<void> {
    console.log('[GameZonez] Setting up Mode7 background system');

    // Create the Mode7 background plane
    this.mode7Plane = BABYLON.MeshBuilder.CreateGround(
      'mode7Background',
      { width: 100, height: 100, subdivisions: 32 },
      this.scene,
    );

    this.mode7Plane.position.y = -5;
    this.mode7Plane.position.z = -30;

    // Create Mode7 material with scrolling texture
    const mode7Material = new BABYLON.StandardMaterial('mode7Material', this.scene);
    
    // Create a procedural texture for the Mode7 background
    const mode7Texture = this.createMode7Texture();
    mode7Material.diffuseTexture = mode7Texture;
    mode7Material.emissiveColor = new BABYLON.Color3(0.3, 0.2, 0.4);
    
    this.mode7Plane.material = mode7Material;
    this.mode7Material = mode7Material;

    this.materials.set('mode7Background', mode7Material);
    this.textures.set('mode7Background', mode7Texture);
  }

  /**
   * Create Mode7-style scrolling texture
   */
  private createMode7Texture(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture(
      'mode7Texture',
      { width: 512, height: 512 },
      this.scene,
      false,
    );

    const context = texture.getContext();

    // Create a pattern that looks like a classic Mode7 racing game road
    context.fillStyle = '#1a1a2e';
    context.fillRect(0, 0, 512, 512);

    // Add horizontal lines for road effect
    context.strokeStyle = '#16213e';
    context.lineWidth = 2;
    
    for (let y = 0; y < 512; y += 16) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(512, y);
      context.stroke();
    }

    // Add vertical perspective lines
    context.strokeStyle = '#0f3460';
    context.lineWidth = 1;
    
    for (let x = 0; x < 512; x += 32) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(256 + (x - 256) * 0.5, 512);
      context.stroke();
    }

    texture.update();
    return texture;
  }

  /**
   * Setup isometric zone for classic strategy game perspective
   */
  private async setupIsometricZone(): Promise<void> {
    console.log('[GameZonez] Setting up isometric perspective zone');

    // Create isometric tiles/grid
    const tileCount = 8;
    const tileSize = 2;
    
    for (let x = 0; x < tileCount; x++) {
      for (let z = 0; z < tileCount; z++) {
        const tile = BABYLON.MeshBuilder.CreateBox(
          `isometric_tile_${x}_${z}`,
          { width: tileSize, height: 0.2, depth: tileSize },
          this.scene,
        );

        // Position in isometric grid
        const isoX = (x - z) * tileSize * 0.5;
        const isoZ = (x + z) * tileSize * 0.25;
        
        tile.position.x = isoX;
        tile.position.z = isoZ;
        tile.position.y = 0;

        // Isometric tile material
        const tileMaterial = new BABYLON.StandardMaterial(
          `isoTileMaterial_${x}_${z}`,
          this.scene,
        );
        
        // Checkerboard pattern
        const isLight = (x + z) % 2 === 0;
        tileMaterial.diffuseColor = isLight 
          ? new BABYLON.Color3(0.8, 0.8, 0.9) 
          : new BABYLON.Color3(0.6, 0.6, 0.7);
        tileMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.2);
        
        tile.material = tileMaterial;

        // Store in render nodes
        if (!this.renderNodes.has('isometric_battlefield')) {
          this.renderNodes.set('isometric_battlefield', []);
        }
        this.renderNodes.get('isometric_battlefield')!.push(tile);
      }
    }
  }

  /**
   * Setup 2D overlay system for HUD and UI elements
   */
  private async setup2DOverlays(): Promise<void> {
    console.log('[GameZonez] Setting up 2D overlay system');

    try {
      // Create 2D GUI
      const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('GameZonezUI');

      // Create a semi-transparent background panel
      const panel = new GUI.Rectangle('backgroundPanel');
      panel.widthInPixels = 300;
      panel.heightInPixels = 200;
      panel.cornerRadius = 10;
      panel.color = 'white';
      panel.thickness = 2;
      panel.background = 'rgba(0, 0, 0, 0.3)';
      panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
      panel.top = '20px';
      panel.left = '-20px';

      // Add some 2D UI text
      const header = new GUI.TextBlock('headerText', 'GameZonez Active');
      header.color = 'white';
      header.fontSize = 18;
      header.top = '-60px';
      panel.addControl(header);

      const statusText = new GUI.TextBlock('statusText', 'Multi-layer rendering');
      statusText.color = '#cccccc';
      statusText.fontSize = 12;
      statusText.top = '-30px';
      panel.addControl(statusText);

      const zoneInfo = new GUI.TextBlock('zoneInfo', 'Zones: 2.5D + Isometric + Mode7');
      zoneInfo.color = '#aaaaaa';
      zoneInfo.fontSize = 10;
      zoneInfo.top = '10px';
      panel.addControl(zoneInfo);

      advancedTexture.addControl(panel);

      // Store reference safely
      this.textures.set('gamezonezUI', advancedTexture as any);
    } catch (error) {
      console.warn('[GameZonez] Failed to setup 2D overlay, continuing without UI overlay:', error);
    }
  }

  /**
   * Setup parallax layers for depth effect
   */
  private async setupParallaxLayers(): Promise<void> {
    if (!this.config.enableParallax) return;

    console.log('[GameZonez] Setting up parallax depth layers');

    // Create multiple parallax layers at different depths
    const layerConfigs = [
      { depth: -15, speed: 0.1, color: new BABYLON.Color3(0.2, 0.1, 0.3), alpha: 0.3 },
      { depth: -10, speed: 0.2, color: new BABYLON.Color3(0.3, 0.2, 0.4), alpha: 0.4 },
      { depth: -5, speed: 0.4, color: new BABYLON.Color3(0.4, 0.3, 0.5), alpha: 0.5 },
    ];

    layerConfigs.forEach((config, index) => {
      const layer = BABYLON.MeshBuilder.CreatePlane(
        `parallaxLayer_${index}`,
        { width: 30, height: 20 },
        this.scene,
      );

      layer.position.z = config.depth;
      layer.position.y = 2;

      const material = new BABYLON.StandardMaterial(
        `parallaxMaterial_${index}`,
        this.scene,
      );
      material.diffuseColor = config.color;
      material.emissiveColor = config.color;
      material.alpha = config.alpha;
      material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

      layer.material = material;
      this.parallaxLayers.push(layer);
    });
  }

  /**
   * Create a zone with specific rendering technique
   */
  public createZone(zoneConfig: GameZone): void {
    if (this.zones.size >= this.config.maxZones) {
      console.warn('[GameZonez] Maximum zones reached, cannot create more');
      return;
    }

    console.log(`[GameZonez] Creating ${zoneConfig.technique} zone: ${zoneConfig.name}`);
    
    this.zones.set(zoneConfig.id, zoneConfig);
    this.renderNodes.set(zoneConfig.id, []);

    // Initialize zone-specific rendering
    this.initializeZoneRendering(zoneConfig);
  }

  /**
   * Initialize rendering for a specific zone based on its technique
   */
  private initializeZoneRendering(zone: GameZone): void {
    switch (zone.technique) {
      case '2.5d':
        this.initialize2DSprites(zone);
        break;
      case 'isometric':
        // Already handled in setupIsometricZone
        break;
      case 'mode7':
        // Already handled in setupMode7Background
        break;
      case '2d':
        // Handled by setup2DOverlays
        break;
      case '3d':
        this.initialize3DObjects(zone);
        break;
    }
  }

  /**
   * Initialize 2.5D sprite objects in a zone
   */
  private initialize2DSprites(zone: GameZone): void {
    console.log(`[GameZonez] Initializing 2.5D sprites for zone: ${zone.name}`);

    try {
      // For now, create simple placeholder sprites using planes instead of the sprite system
      // This avoids texture loading issues in the demo
      for (let i = 0; i < 3; i++) {
        const spritePlane = BABYLON.MeshBuilder.CreatePlane(
          `sprite_${zone.id}_${i}`,
          { width: 2, height: 2 },
          this.scene,
        );

        spritePlane.position = new BABYLON.Vector3(
          zone.position.x + (i - 1) * 2,
          zone.position.y + 1,
          zone.position.z,
        );

        // Create a simple colored material as placeholder
        const spriteMaterial = new BABYLON.StandardMaterial(
          `spriteMaterial_${zone.id}_${i}`,
          this.scene,
        );
        
        // Different colors for each sprite
        const colors = [
          new BABYLON.Color3(0.8, 0.2, 0.8), // Purple
          new BABYLON.Color3(0.2, 0.8, 0.2), // Green  
          new BABYLON.Color3(0.8, 0.8, 0.2), // Yellow
        ];
        
        spriteMaterial.emissiveColor = colors[i % colors.length];
        spriteMaterial.diffuseColor = colors[i % colors.length];
        spritePlane.material = spriteMaterial;

        // Make it always face the camera (billboard effect for 2.5D)
        spritePlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        // Add floating animation
        const floatKeys = [
          { frame: 0, value: spritePlane.position.y },
          { frame: 60, value: spritePlane.position.y + 0.5 },
          { frame: 120, value: spritePlane.position.y },
        ];
        const floatAnimation = new BABYLON.Animation(
          `spriteFloat_${zone.id}_${i}`,
          'position.y',
          30,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
        );
        floatAnimation.setKeys(floatKeys);
        spritePlane.animations.push(floatAnimation);
        this.scene.beginAnimation(spritePlane, 0, 120, true);

        // Add to zone render nodes
        if (!this.renderNodes.has(zone.id)) {
          this.renderNodes.set(zone.id, []);
        }
        this.renderNodes.get(zone.id)!.push(spritePlane);
      }
    } catch (error) {
      console.warn(`[GameZonez] Failed to create sprites for zone ${zone.name}:`, error);
    }
  }

  /**
   * Initialize 3D objects in a zone
   */
  private initialize3DObjects(zone: GameZone): void {
    console.log(`[GameZonez] Initializing 3D objects for zone: ${zone.name}`);

    // Create magical floating orbs as 3D objects
    for (let i = 0; i < 2; i++) {
      const orb = BABYLON.MeshBuilder.CreateSphere(
        `3d_orb_${zone.id}_${i}`,
        { diameter: 0.8 },
        this.scene,
      );

      orb.position = new BABYLON.Vector3(
        zone.position.x + (i - 0.5) * 3,
        zone.position.y + 2,
        zone.position.z,
      );

      // Create glowing material
      const orbMaterial = new BABYLON.StandardMaterial(
        `orbMaterial_${zone.id}_${i}`,
        this.scene,
      );
      orbMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.8, 1.0);
      orbMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.6);
      orbMaterial.alpha = 0.8;
      orbMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

      orb.material = orbMaterial;

      // Add to zone render nodes
      if (!this.renderNodes.has(zone.id)) {
        this.renderNodes.set(zone.id, []);
      }
      this.renderNodes.get(zone.id)!.push(orb);
    }
  }

  /**
   * Start the animation loop for dynamic effects
   */
  private startAnimationLoop(): void {
    this.scene.registerBeforeRender(() => {
      this.updateMode7Effects();
      this.updateParallax();
      this.updateZoneEffects();
    });
  }

  /**
   * Update Mode7 background effects
   */
  private updateMode7Effects(): void {
    if (!this.mode7Plane || !this.mode7Material) return;

    this.mode7Time += this.config.mode7Speed;

    // Update Mode7 texture scrolling
    const material = this.mode7Material as BABYLON.StandardMaterial;
    if (material.diffuseTexture) {
      material.diffuseTexture.uOffset = Math.sin(this.mode7Time) * 0.1;
      material.diffuseTexture.vOffset = this.mode7Time * 0.05;
    }

    // Slight rotation for perspective effect
    this.mode7Plane.rotation.y = Math.sin(this.mode7Time * 0.5) * 0.02;
  }

  /**
   * Update parallax layers based on camera movement
   */
  private updateParallax(): void {
    if (!this.config.enableParallax || this.parallaxLayers.length === 0) return;

    const camera = this.scene.activeCamera;
    if (!camera) return;

    // Simple parallax based on camera position
    this.parallaxLayers.forEach((layer, index) => {
      const speed = 0.1 + index * 0.1;
      layer.position.x = camera.position.x * speed * -1;
    });
  }

  /**
   * Update zone-specific effects
   */
  private updateZoneEffects(): void {
    // Update 3D orbs floating animation
    this.renderNodes.forEach((nodes, zoneId) => {
      nodes.forEach((node, index) => {
        if (node instanceof BABYLON.Mesh && node.name.includes('3d_orb')) {
          const time = Date.now() * 0.001 + index;
          node.position.y += Math.sin(time) * 0.002;
          node.rotation.y += 0.01;
        }
      });
    });
  }

  /**
   * Get zone by ID
   */
  public getZone(zoneId: string): GameZone | undefined {
    return this.zones.get(zoneId);
  }

  /**
   * Toggle zone visibility
   */
  public setZoneActive(zoneId: string, active: boolean): void {
    const zone = this.zones.get(zoneId);
    if (zone) {
      zone.active = active;
      
      // Update visibility of zone render nodes
      const nodes = this.renderNodes.get(zoneId);
      if (nodes) {
        nodes.forEach(node => {
          if (node instanceof BABYLON.Mesh) {
            node.setEnabled(active);
          }
        });
      }

      // Handle sprite managers
      const spriteManager = this.spriteManagers.get(zoneId);
      if (spriteManager) {
        spriteManager.isEnabled = active;
      }

      console.log(`[GameZonez] Zone ${zoneId} set to ${active ? 'active' : 'inactive'}`);
    }
  }

  /**
   * Get all active zones sorted by priority
   */
  public getActiveZones(): GameZone[] {
    return Array.from(this.zones.values())
      .filter(zone => zone.active)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Update zone configuration
   */
  public updateZone(zoneId: string, updates: Partial<GameZone>): void {
    const zone = this.zones.get(zoneId);
    if (zone) {
      Object.assign(zone, updates);
      console.log(`[GameZonez] Zone ${zoneId} updated`);
    }
  }

  /**
   * Dispose of all GameZonez resources
   */
  public dispose(): void {
    console.log('[GameZonez] Disposing pseudo-3D environment system');

    // Dispose render nodes
    this.renderNodes.forEach(nodes => {
      nodes.forEach(node => {
        if (node.dispose) {
          node.dispose();
        }
      });
    });

    // Dispose sprite managers
    this.spriteManagers.forEach(manager => manager.dispose());

    // Dispose materials and textures
    this.materials.forEach(material => material.dispose());
    this.textures.forEach(texture => texture.dispose());

    // Dispose parallax layers
    this.parallaxLayers.forEach(layer => layer.dispose());

    // Dispose Mode7 plane
    if (this.mode7Plane) {
      this.mode7Plane.dispose();
    }

    // Dispose UI
    const ui = this.textures.get('gamezonezUI');
    if (ui && (ui as any).dispose) {
      (ui as any).dispose();
    }

    // Clear collections
    this.zones.clear();
    this.renderNodes.clear();
    this.materials.clear();
    this.textures.clear();
    this.spriteManagers.clear();
    this.parallaxLayers = [];
  }
}