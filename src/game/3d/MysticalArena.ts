import * as BABYLON from 'babylonjs';

export interface ArenaConfig {
  theme: 'mystical' | 'ancient' | 'ethereal' | 'cosmic' | 'hearthstone';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  enableParticles: boolean;
  enableLighting: boolean;
  enablePostProcessing: boolean;
  isMobile: boolean;
}

export class MysticalArena {
  private scene: BABYLON.Scene;
  private config: ArenaConfig;
  private materials: Map<string, BABYLON.Material> = new Map();
  private meshes: Map<string, BABYLON.Mesh> = new Map();
  private lights: BABYLON.Light[] = [];
  private particleSystems: BABYLON.ParticleSystem[] = [];
  private animationGroups: BABYLON.AnimationGroup[] = [];

  constructor(scene: BABYLON.Scene, config: ArenaConfig) {
    this.scene = scene;
    this.config = config;
  }

  public async initialize(): Promise<void> {
    console.log('[MysticalArena] Initializing arena with theme:', this.config.theme);
    
    // Initialize components progressively based on performance
    await this.createSkybox();
    await this.createArenaFloor();
    await this.createArenaWalls();
    
    if (this.config.enableLighting) {
      await this.setupMysticalLighting();
    }
    
    if (this.config.enableParticles && this.config.quality !== 'low') {
      await this.createParticleEffects();
    }
    
    await this.addEnvironmentalDetails();
    
    if (this.config.enablePostProcessing && this.config.quality === 'ultra') {
      await this.setupPostProcessing();
    }
    
    this.startAnimations();
    
    console.log('[MysticalArena] Arena initialization complete');
  }

  private async createSkybox(): Promise<void> {
    const skyboxSize = this.config.isMobile ? 80 : 100;
    const skybox = BABYLON.MeshBuilder.CreateSphere(
      'arenaSkybox',
      { diameter: skyboxSize },
      this.scene
    );

    const skyboxMaterial = new BABYLON.PBRMaterial('skyboxMaterial', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    
    // Create mystical gradient based on theme
    const colors = this.getThemeColors();
    skyboxMaterial.emissiveColor = colors.skybox;
    skyboxMaterial.alpha = 1.0;
    
    // Add subtle texture variation for high quality
    if (this.config.quality === 'ultra' || this.config.quality === 'high') {
      const noiseTexture = new BABYLON.NoiseProceduralTexture('skyboxNoise', 256, this.scene);
      noiseTexture.octaves = 4;
      noiseTexture.persistence = 0.8;
      noiseTexture.animationSpeedFactor = 0.1;
      skyboxMaterial.emissiveTexture = noiseTexture;
      skyboxMaterial.emissiveTexture.level = 0.3;
    }
    
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skybox.setEnabled(true);
    
    this.materials.set('skybox', skyboxMaterial);
    this.meshes.set('skybox', skybox);
  }

  private async createArenaFloor(): Promise<void> {
    const floorSize = this.config.isMobile ? 16 : 20;
    const floor = BABYLON.MeshBuilder.CreateGround(
      'arenaFloor',
      { width: floorSize, height: floorSize, subdivisions: this.config.quality === 'low' ? 1 : 4 },
      this.scene
    );

    const floorMaterial = new BABYLON.PBRMaterial('floorMaterial', this.scene);
    const colors = this.getThemeColors();
    
    // Base material properties
    floorMaterial.baseColor = colors.floor;
    floorMaterial.metallicFactor = 0.1;
    floorMaterial.roughnessFactor = 0.8;
    
    // Add mystical glow effect
    floorMaterial.emissiveColor = colors.floorGlow;
    floorMaterial.emissiveIntensity = 0.3;
    
    // Enhanced materials for higher quality
    if (this.config.quality !== 'low') {
      // Add geometric pattern
      const patternTexture = this.createMysticalPattern();
      floorMaterial.baseTexture = patternTexture;
      
      // Add normal mapping for depth
      if (this.config.quality === 'high' || this.config.quality === 'ultra') {
        const normalTexture = this.createNormalPattern();
        floorMaterial.bumpTexture = normalTexture;
        floorMaterial.bumpTexture.level = 0.5;
      }
      
      // Add Fresnel effect for mystical glow
      floorMaterial.emissiveFresnelParameters = new BABYLON.FresnelParameters();
      floorMaterial.emissiveFresnelParameters.bias = 0.1;
      floorMaterial.emissiveFresnelParameters.power = 1.5;
      floorMaterial.emissiveFresnelParameters.leftColor = BABYLON.Color3.Black();
      floorMaterial.emissiveFresnelParameters.rightColor = colors.floorGlow;
    }
    
    floor.material = floorMaterial;
    floor.receiveShadows = true;
    
    this.materials.set('floor', floorMaterial);
    this.meshes.set('floor', floor);
  }

  private async createArenaWalls(): Promise<void> {
    const wallHeight = this.config.isMobile ? 6 : 8;
    const wallDistance = this.config.isMobile ? 12 : 15;
    const colors = this.getThemeColors();
    
    // Create four mystical barriers/walls
    const wallPositions = [
      { name: 'north', position: new BABYLON.Vector3(0, wallHeight/2, wallDistance), rotation: 0 },
      { name: 'south', position: new BABYLON.Vector3(0, wallHeight/2, -wallDistance), rotation: Math.PI },
      { name: 'east', position: new BABYLON.Vector3(wallDistance, wallHeight/2, 0), rotation: Math.PI/2 },
      { name: 'west', position: new BABYLON.Vector3(-wallDistance, wallHeight/2, 0), rotation: -Math.PI/2 }
    ];

    for (const wallInfo of wallPositions) {
      const wall = BABYLON.MeshBuilder.CreatePlane(
        `arenaWall_${wallInfo.name}`,
        { width: wallDistance * 2, height: wallHeight },
        this.scene
      );
      
      wall.position = wallInfo.position;
      wall.rotation.y = wallInfo.rotation;
      
      const wallMaterial = new BABYLON.PBRMaterial(`wallMaterial_${wallInfo.name}`, this.scene);
      
      // Make walls semi-transparent with mystical glow
      wallMaterial.baseColor = colors.wall;
      wallMaterial.alpha = 0.3;
      wallMaterial.emissiveColor = colors.wallGlow;
      wallMaterial.emissiveIntensity = 0.5;
      wallMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
      
      // Add energy field effect for higher quality
      if (this.config.quality !== 'low') {
        const energyTexture = this.createEnergyFieldTexture();
        wallMaterial.emissiveTexture = energyTexture;
        
        // Animate the energy field
        this.animateEnergyField(energyTexture);
      }
      
      wall.material = wallMaterial;
      
      this.materials.set(`wall_${wallInfo.name}`, wallMaterial);
      this.meshes.set(`wall_${wallInfo.name}`, wall);
    }
  }

  private async setupMysticalLighting(): Promise<void> {
    // Clear existing lights
    this.lights.forEach(light => light.dispose());
    this.lights = [];
    
    const colors = this.getThemeColors();
    
    // Main ambient light
    const ambientLight = new BABYLON.HemisphericLight(
      'arenaAmbient',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.4;
    ambientLight.diffuse = colors.ambient;
    this.lights.push(ambientLight);
    
    // Dynamic mystical lights
    const lightPositions = [
      { pos: new BABYLON.Vector3(8, 4, 8), color: colors.light1, intensity: 0.8 },
      { pos: new BABYLON.Vector3(-8, 4, 8), color: colors.light2, intensity: 0.8 },
      { pos: new BABYLON.Vector3(8, 4, -8), color: colors.light3, intensity: 0.8 },
      { pos: new BABYLON.Vector3(-8, 4, -8), color: colors.light4, intensity: 0.8 }
    ];
    
    lightPositions.forEach((lightInfo, index) => {
      const pointLight = new BABYLON.PointLight(
        `mysticalLight_${index}`,
        lightInfo.pos,
        this.scene
      );
      pointLight.diffuse = lightInfo.color;
      pointLight.intensity = lightInfo.intensity;
      pointLight.range = this.config.isMobile ? 12 : 16;
      pointLight.falloffType = BABYLON.Light.FALLOFF_GLTF;
      
      this.lights.push(pointLight);
      
      // Animate lights for mystical effect
      if (this.config.quality !== 'low') {
        this.animateLight(pointLight, index);
      }
    });
    
    // Central dramatic light
    const centralLight = new BABYLON.SpotLight(
      'centralSpotlight',
      new BABYLON.Vector3(0, 10, 0),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 3,
      2,
      this.scene
    );
    centralLight.diffuse = colors.central;
    centralLight.intensity = 1.2;
    centralLight.range = 20;
    this.lights.push(centralLight);
  }

  private async createParticleEffects(): Promise<void> {
    if (!this.config.enableParticles) return;
    
    const colors = this.getThemeColors();
    
    // Floating mystical orbs
    const orbEmitter = BABYLON.MeshBuilder.CreateSphere('orbEmitter', {diameter: 0.1}, this.scene);
    orbEmitter.position = new BABYLON.Vector3(0, 8, 0);
    orbEmitter.setEnabled(false);
    
    const orbParticles = new BABYLON.ParticleSystem('mysticalOrbs', 50, this.scene);
    orbParticles.particleTexture = this.createOrbTexture();
    orbParticles.emitter = orbEmitter;
    
    orbParticles.minEmitBox = new BABYLON.Vector3(-8, 0, -8);
    orbParticles.maxEmitBox = new BABYLON.Vector3(8, 0, 8);
    
    orbParticles.color1 = new BABYLON.Color4(colors.particle1.r, colors.particle1.g, colors.particle1.b, 0.8);
    orbParticles.color2 = new BABYLON.Color4(colors.particle2.r, colors.particle2.g, colors.particle2.b, 0.4);
    orbParticles.colorDead = new BABYLON.Color4(0, 0, 0, 0);
    
    orbParticles.minSize = 0.1;
    orbParticles.maxSize = 0.3;
    orbParticles.minLifeTime = 3;
    orbParticles.maxLifeTime = 6;
    orbParticles.emitRate = this.config.isMobile ? 8 : 15;
    
    orbParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    orbParticles.direction1 = new BABYLON.Vector3(-0.5, 0.5, -0.5);
    orbParticles.direction2 = new BABYLON.Vector3(0.5, 1.5, 0.5);
    orbParticles.minEmitPower = 0.2;
    orbParticles.maxEmitPower = 0.5;
    orbParticles.updateSpeed = 0.01;
    
    orbParticles.start();
    this.particleSystems.push(orbParticles);
    
    // Add energy wisps for higher quality
    if (this.config.quality === 'high' || this.config.quality === 'ultra') {
      await this.createEnergyWisps(colors);
    }
  }

  private async createEnergyWisps(colors: any): Promise<void> {
    // Create mystical energy wisps that flow around the arena
    const wispCount = this.config.isMobile ? 3 : 6;
    
    for (let i = 0; i < wispCount; i++) {
      const wispEmitter = BABYLON.MeshBuilder.CreateSphere(`wispEmitter_${i}`, {diameter: 0.05}, this.scene);
      const angle = (i / wispCount) * Math.PI * 2;
      wispEmitter.position = new BABYLON.Vector3(Math.cos(angle) * 6, 2, Math.sin(angle) * 6);
      wispEmitter.setEnabled(false);
      
      const wispParticles = new BABYLON.ParticleSystem(`energyWisps_${i}`, 30, this.scene);
      wispParticles.particleTexture = this.createWispTexture();
      wispParticles.emitter = wispEmitter;
      
      wispParticles.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, -0.2);
      wispParticles.maxEmitBox = new BABYLON.Vector3(0.2, 0.2, 0.2);
      
      const colorVariant = i % 2 === 0 ? colors.particle1 : colors.particle2;
      wispParticles.color1 = new BABYLON.Color4(colorVariant.r, colorVariant.g, colorVariant.b, 0.9);
      wispParticles.color2 = new BABYLON.Color4(colorVariant.r * 0.5, colorVariant.g * 0.5, colorVariant.b * 0.5, 0.3);
      wispParticles.colorDead = new BABYLON.Color4(0, 0, 0, 0);
      
      wispParticles.minSize = 0.05;
      wispParticles.maxSize = 0.15;
      wispParticles.minLifeTime = 2;
      wispParticles.maxLifeTime = 4;
      wispParticles.emitRate = 8;
      
      wispParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
      wispParticles.direction1 = new BABYLON.Vector3(-0.1, 0.1, -0.1);
      wispParticles.direction2 = new BABYLON.Vector3(0.1, 0.3, 0.1);
      wispParticles.minEmitPower = 0.1;
      wispParticles.maxEmitPower = 0.3;
      
      wispParticles.start();
      this.particleSystems.push(wispParticles);
      
      // Animate wisp emitter in circular pattern
      this.animateWispEmitter(wispEmitter, i, wispCount);
    }
  }

  private async addEnvironmentalDetails(): Promise<void> {
    if (this.config.quality === 'low') return;
    
    if (this.config.theme === 'hearthstone') {
      // Add Hearthstone-style tavern buildings and furniture
      await this.createTavernBuildings();
      await this.createWoodenFurniture();
      await this.createStoneArchitecture();
      
      // Add floating runes for ultra quality
      if (this.config.quality === 'ultra') {
        await this.createTavernDecorations();
      }
    } else {
      // Add mystical pillars at corners for other themes
      await this.createMysticalPillars();
      
      // Add floating runes for ultra quality
      if (this.config.quality === 'ultra') {
        await this.createFloatingRunes();
      }
    }
  }

  private async createMysticalPillars(): Promise<void> {
    const pillarPositions = [
      new BABYLON.Vector3(10, 0, 10),
      new BABYLON.Vector3(-10, 0, 10),
      new BABYLON.Vector3(10, 0, -10),
      new BABYLON.Vector3(-10, 0, -10)
    ];
    
    const colors = this.getThemeColors();
    
    pillarPositions.forEach((position, index) => {
      const pillar = BABYLON.MeshBuilder.CreateCylinder(
        `pillar_${index}`,
        { height: 6, diameterTop: 0.5, diameterBottom: 0.8, tessellation: 8 },
        this.scene
      );
      
      pillar.position = position;
      pillar.position.y = 3; // Half height to center on ground
      
      const pillarMaterial = new BABYLON.PBRMaterial(`pillarMaterial_${index}`, this.scene);
      pillarMaterial.baseColor = colors.pillar;
      pillarMaterial.emissiveColor = colors.pillarGlow;
      pillarMaterial.emissiveIntensity = 0.4;
      pillarMaterial.metallicFactor = 0.3;
      pillarMaterial.roughnessFactor = 0.6;
      
      pillar.material = pillarMaterial;
      
      this.materials.set(`pillar_${index}`, pillarMaterial);
      this.meshes.set(`pillar_${index}`, pillar);
      
      // Add pulsing animation
      this.animatePillar(pillar, index);
    });
  }

  private async createFloatingRunes(): Promise<void> {
    const runeCount = 6;
    const colors = this.getThemeColors();
    
    for (let i = 0; i < runeCount; i++) {
      const rune = BABYLON.MeshBuilder.CreatePlane(
        `rune_${i}`,
        { width: 1, height: 1 },
        this.scene
      );
      
      const angle = (i / runeCount) * Math.PI * 2;
      rune.position = new BABYLON.Vector3(
        Math.cos(angle) * 8,
        4 + Math.sin(i) * 2,
        Math.sin(angle) * 8
      );
      
      rune.lookAt(BABYLON.Vector3.Zero());
      
      const runeMaterial = new BABYLON.PBRMaterial(`runeMaterial_${i}`, this.scene);
      runeMaterial.emissiveColor = colors.rune;
      runeMaterial.emissiveIntensity = 0.8;
      runeMaterial.alpha = 0.7;
      runeMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
      
      // Add rune texture
      const runeTexture = this.createRuneTexture(i);
      runeMaterial.emissiveTexture = runeTexture;
      
      rune.material = runeMaterial;
      
      this.materials.set(`rune_${i}`, runeMaterial);
      this.meshes.set(`rune_${i}`, rune);
      
      // Animate floating motion
      this.animateFloatingRune(rune, i);
    }
  }

  private async createTavernBuildings(): Promise<void> {
    const colors = this.getThemeColors();
    
    // Main tavern building in the background
    const tavernMain = BABYLON.MeshBuilder.CreateBox(
      'tavernMain',
      { width: 8, height: 6, depth: 4 },
      this.scene
    );
    tavernMain.position = new BABYLON.Vector3(0, 3, -12);
    
    const tavernMaterial = new BABYLON.PBRMaterial('tavernMaterial', this.scene);
    tavernMaterial.baseColor = new BABYLON.Color3(0.4, 0.3, 0.2); // Dark wood
    tavernMaterial.metallicFactor = 0.1;
    tavernMaterial.roughnessFactor = 0.9;
    tavernMaterial.emissiveColor = colors.pillarGlow;
    tavernMaterial.emissiveIntensity = 0.2;
    
    tavernMain.material = tavernMaterial;
    this.meshes.set('tavernMain', tavernMain);
    this.materials.set('tavernMain', tavernMaterial);
    
    // Tavern roof
    const roof = BABYLON.MeshBuilder.CreateCylinder(
      'tavernRoof',
      { height: 4, diameterTop: 0, diameterBottom: 10, tessellation: 4 },
      this.scene
    );
    roof.position = new BABYLON.Vector3(0, 7.5, -12);
    roof.rotation.y = Math.PI / 4; // Diamond shape
    
    const roofMaterial = new BABYLON.PBRMaterial('roofMaterial', this.scene);
    roofMaterial.baseColor = new BABYLON.Color3(0.3, 0.2, 0.15); // Dark brown roof
    roofMaterial.metallicFactor = 0.05;
    roofMaterial.roughnessFactor = 0.95;
    
    roof.material = roofMaterial;
    this.meshes.set('tavernRoof', roof);
    this.materials.set('tavernRoof', roofMaterial);
    
    // Side buildings
    const sideBuilding1 = BABYLON.MeshBuilder.CreateBox(
      'sideBuilding1',
      { width: 4, height: 4, depth: 3 },
      this.scene
    );
    sideBuilding1.position = new BABYLON.Vector3(-8, 2, -10);
    sideBuilding1.material = tavernMaterial;
    this.meshes.set('sideBuilding1', sideBuilding1);
    
    const sideBuilding2 = BABYLON.MeshBuilder.CreateBox(
      'sideBuilding2',
      { width: 4, height: 4, depth: 3 },
      this.scene
    );
    sideBuilding2.position = new BABYLON.Vector3(8, 2, -10);
    sideBuilding2.material = tavernMaterial;
    this.meshes.set('sideBuilding2', sideBuilding2);
    
    // Tavern entrance pillars
    const pillar1 = BABYLON.MeshBuilder.CreateCylinder(
      'entrancePillar1',
      { height: 5, diameter: 0.8 },
      this.scene
    );
    pillar1.position = new BABYLON.Vector3(-2, 2.5, -8);
    
    const pillar2 = BABYLON.MeshBuilder.CreateCylinder(
      'entrancePillar2',
      { height: 5, diameter: 0.8 },
      this.scene
    );
    pillar2.position = new BABYLON.Vector3(2, 2.5, -8);
    
    const stoneMaterial = new BABYLON.PBRMaterial('stonePillarMaterial', this.scene);
    stoneMaterial.baseColor = new BABYLON.Color3(0.35, 0.3, 0.25); // Stone color
    stoneMaterial.metallicFactor = 0.0;
    stoneMaterial.roughnessFactor = 0.8;
    stoneMaterial.emissiveColor = colors.wallGlow;
    stoneMaterial.emissiveIntensity = 0.15;
    
    pillar1.material = stoneMaterial;
    pillar2.material = stoneMaterial;
    this.meshes.set('entrancePillar1', pillar1);
    this.meshes.set('entrancePillar2', pillar2);
    this.materials.set('stonePillarMaterial', stoneMaterial);
  }

  private async createWoodenFurniture(): Promise<void> {
    const colors = this.getThemeColors();
    
    // Create wooden material
    const woodMaterial = new BABYLON.PBRMaterial('woodMaterial', this.scene);
    woodMaterial.baseColor = new BABYLON.Color3(0.4, 0.25, 0.15); // Rich brown wood
    woodMaterial.metallicFactor = 0.0;
    woodMaterial.roughnessFactor = 0.7;
    woodMaterial.emissiveColor = colors.pillarGlow;
    woodMaterial.emissiveIntensity = 0.1;
    
    // Tavern tables
    const tablePositions = [
      new BABYLON.Vector3(-4, 0, -2),
      new BABYLON.Vector3(4, 0, -2),
      new BABYLON.Vector3(-4, 0, 2),
      new BABYLON.Vector3(4, 0, 2)
    ];
    
    tablePositions.forEach((position, index) => {
      // Table top
      const tableTop = BABYLON.MeshBuilder.CreateCylinder(
        `tableTop_${index}`,
        { height: 0.2, diameter: 2 },
        this.scene
      );
      tableTop.position = position.clone();
      tableTop.position.y = 1.5;
      tableTop.material = woodMaterial;
      this.meshes.set(`tableTop_${index}`, tableTop);
      
      // Table leg
      const tableLeg = BABYLON.MeshBuilder.CreateCylinder(
        `tableLeg_${index}`,
        { height: 1.5, diameter: 0.2 },
        this.scene
      );
      tableLeg.position = position.clone();
      tableLeg.position.y = 0.75;
      tableLeg.material = woodMaterial;
      this.meshes.set(`tableLeg_${index}`, tableLeg);
    });
    
    // Wooden barrels around the area
    const barrelPositions = [
      new BABYLON.Vector3(-6, 0, -6),
      new BABYLON.Vector3(6, 0, -6),
      new BABYLON.Vector3(-6, 0, 6),
      new BABYLON.Vector3(6, 0, 6),
      new BABYLON.Vector3(0, 0, 8)
    ];
    
    barrelPositions.forEach((position, index) => {
      const barrel = BABYLON.MeshBuilder.CreateCylinder(
        `barrel_${index}`,
        { height: 1.5, diameter: 1.2 },
        this.scene
      );
      barrel.position = position.clone();
      barrel.position.y = 0.75;
      
      const barrelMaterial = new BABYLON.PBRMaterial(`barrelMaterial_${index}`, this.scene);
      barrelMaterial.baseColor = new BABYLON.Color3(0.5, 0.3, 0.2); // Barrel wood
      barrelMaterial.metallicFactor = 0.1;
      barrelMaterial.roughnessFactor = 0.8;
      
      barrel.material = barrelMaterial;
      this.meshes.set(`barrel_${index}`, barrel);
      this.materials.set(`barrelMaterial_${index}`, barrelMaterial);
    });
    
    // Wooden crates
    const cratePositions = [
      new BABYLON.Vector3(-8, 0, 0),
      new BABYLON.Vector3(8, 0, 0),
      new BABYLON.Vector3(0, 0, -6)
    ];
    
    cratePositions.forEach((position, index) => {
      const crate = BABYLON.MeshBuilder.CreateBox(
        `crate_${index}`,
        { width: 1, height: 1, depth: 1 },
        this.scene
      );
      crate.position = position.clone();
      crate.position.y = 0.5;
      crate.material = woodMaterial;
      this.meshes.set(`crate_${index}`, crate);
    });
    
    this.materials.set('woodMaterial', woodMaterial);
  }

  private async createStoneArchitecture(): Promise<void> {
    const colors = this.getThemeColors();
    
    // Stone archway in the background
    const archLeft = BABYLON.MeshBuilder.CreateCylinder(
      'archLeft',
      { height: 6, diameter: 1 },
      this.scene
    );
    archLeft.position = new BABYLON.Vector3(-3, 3, -15);
    
    const archRight = BABYLON.MeshBuilder.CreateCylinder(
      'archRight',
      { height: 6, diameter: 1 },
      this.scene
    );
    archRight.position = new BABYLON.Vector3(3, 3, -15);
    
    const archTop = BABYLON.MeshBuilder.CreateTorus(
      'archTop',
      { diameter: 6, thickness: 0.5, tessellation: 16 },
      this.scene
    );
    archTop.position = new BABYLON.Vector3(0, 6, -15);
    archTop.rotation.x = Math.PI / 2;
    archTop.scaling.x = 1;
    archTop.scaling.z = 0.5;
    
    const stoneMaterial = new BABYLON.PBRMaterial('archStoneMaterial', this.scene);
    stoneMaterial.baseColor = new BABYLON.Color3(0.4, 0.35, 0.3); // Weathered stone
    stoneMaterial.metallicFactor = 0.0;
    stoneMaterial.roughnessFactor = 0.9;
    stoneMaterial.emissiveColor = colors.wallGlow;
    stoneMaterial.emissiveIntensity = 0.1;
    
    archLeft.material = stoneMaterial;
    archRight.material = stoneMaterial;
    archTop.material = stoneMaterial;
    
    this.meshes.set('archLeft', archLeft);
    this.meshes.set('archRight', archRight);
    this.meshes.set('archTop', archTop);
    this.materials.set('archStoneMaterial', stoneMaterial);
    
    // Stone wall segments for atmosphere
    const wallSegments = [
      { pos: new BABYLON.Vector3(-10, 2, -8), size: { w: 2, h: 4, d: 1 } },
      { pos: new BABYLON.Vector3(10, 2, -8), size: { w: 2, h: 4, d: 1 } },
      { pos: new BABYLON.Vector3(-12, 1.5, 0), size: { w: 1, h: 3, d: 4 } },
      { pos: new BABYLON.Vector3(12, 1.5, 0), size: { w: 1, h: 3, d: 4 } }
    ];
    
    wallSegments.forEach((segment, index) => {
      const wall = BABYLON.MeshBuilder.CreateBox(
        `stoneWall_${index}`,
        { width: segment.size.w, height: segment.size.h, depth: segment.size.d },
        this.scene
      );
      wall.position = segment.pos;
      wall.material = stoneMaterial;
      this.meshes.set(`stoneWall_${index}`, wall);
    });
  }

  private async createTavernDecorations(): Promise<void> {
    const colors = this.getThemeColors();
    
    // Hanging lanterns
    const lanternPositions = [
      new BABYLON.Vector3(-3, 4, -3),
      new BABYLON.Vector3(3, 4, -3),
      new BABYLON.Vector3(-3, 4, 3),
      new BABYLON.Vector3(3, 4, 3)
    ];
    
    lanternPositions.forEach((position, index) => {
      const lantern = BABYLON.MeshBuilder.CreateSphere(
        `lantern_${index}`,
        { diameter: 0.8 },
        this.scene
      );
      lantern.position = position;
      
      const lanternMaterial = new BABYLON.PBRMaterial(`lanternMaterial_${index}`, this.scene);
      lanternMaterial.baseColor = new BABYLON.Color3(0.6, 0.4, 0.2); // Brass lantern
      lanternMaterial.metallicFactor = 0.8;
      lanternMaterial.roughnessFactor = 0.3;
      lanternMaterial.emissiveColor = colors.light1;
      lanternMaterial.emissiveIntensity = 0.6;
      lanternMaterial.alpha = 0.8;
      lanternMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
      
      lantern.material = lanternMaterial;
      this.meshes.set(`lantern_${index}`, lantern);
      this.materials.set(`lanternMaterial_${index}`, lanternMaterial);
      
      // Add gentle swaying animation
      this.animateLantern(lantern, index);
    });
    
    // Wall banners
    const bannerPositions = [
      { pos: new BABYLON.Vector3(-6, 3, -7.5), rot: 0 },
      { pos: new BABYLON.Vector3(6, 3, -7.5), rot: 0 },
      { pos: new BABYLON.Vector3(-11.5, 3, 0), rot: Math.PI / 2 },
      { pos: new BABYLON.Vector3(11.5, 3, 0), rot: -Math.PI / 2 }
    ];
    
    bannerPositions.forEach((banner, index) => {
      const bannerMesh = BABYLON.MeshBuilder.CreatePlane(
        `banner_${index}`,
        { width: 1.5, height: 2 },
        this.scene
      );
      bannerMesh.position = banner.pos;
      bannerMesh.rotation.y = banner.rot;
      
      const bannerMaterial = new BABYLON.PBRMaterial(`bannerMaterial_${index}`, this.scene);
      bannerMaterial.baseColor = new BABYLON.Color3(0.6, 0.1, 0.1); // Red banner
      bannerMaterial.metallicFactor = 0.0;
      bannerMaterial.roughnessFactor = 0.8;
      bannerMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.05, 0.05);
      bannerMaterial.emissiveIntensity = 0.2;
      
      bannerMesh.material = bannerMaterial;
      this.meshes.set(`banner_${index}`, bannerMesh);
      this.materials.set(`bannerMaterial_${index}`, bannerMaterial);
      
      // Add subtle flag movement
      this.animateBanner(bannerMesh, index);
    });
  }

  private animateLantern(lantern: BABYLON.Mesh, index: number): void {
    const baseRotation = lantern.rotation.clone();
    
    BABYLON.Animation.CreateAndStartAnimation(
      `lanternSway_${index}`,
      lantern.rotation,
      'z',
      30,
      120 + index * 20,
      baseRotation.z,
      baseRotation.z + (Math.PI / 32), // Gentle sway
      BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
    );
  }

  private animateBanner(banner: BABYLON.Mesh, index: number): void {
    const baseRotation = banner.rotation.clone();
    
    BABYLON.Animation.CreateAndStartAnimation(
      `bannerWave_${index}`,
      banner.rotation,
      'x',
      30,
      100 + index * 15,
      baseRotation.x,
      baseRotation.x + (Math.PI / 16), // Subtle wave
      BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
    );
  }

  private getThemeColors() {
    switch (this.config.theme) {
      case 'mystical':
        return {
          skybox: new BABYLON.Color3(0.05, 0.02, 0.15),
          floor: new BABYLON.Color3(0.1, 0.05, 0.2),
          floorGlow: new BABYLON.Color3(0.3, 0.1, 0.5),
          wall: new BABYLON.Color3(0.2, 0.1, 0.4),
          wallGlow: new BABYLON.Color3(0.5, 0.2, 0.8),
          ambient: new BABYLON.Color3(0.4, 0.3, 0.6),
          light1: new BABYLON.Color3(0.8, 0.2, 1.0),
          light2: new BABYLON.Color3(0.2, 0.8, 1.0),
          light3: new BABYLON.Color3(1.0, 0.2, 0.8),
          light4: new BABYLON.Color3(0.2, 1.0, 0.8),
          central: new BABYLON.Color3(0.9, 0.9, 1.0),
          particle1: new BABYLON.Color3(0.8, 0.3, 1.0),
          particle2: new BABYLON.Color3(0.3, 0.8, 1.0),
          pillar: new BABYLON.Color3(0.15, 0.1, 0.25),
          pillarGlow: new BABYLON.Color3(0.4, 0.2, 0.7),
          rune: new BABYLON.Color3(0.9, 0.7, 1.0)
        };
      case 'ancient':
        return {
          skybox: new BABYLON.Color3(0.1, 0.08, 0.05),
          floor: new BABYLON.Color3(0.2, 0.15, 0.1),
          floorGlow: new BABYLON.Color3(0.8, 0.6, 0.2),
          wall: new BABYLON.Color3(0.3, 0.25, 0.15),
          wallGlow: new BABYLON.Color3(0.9, 0.7, 0.3),
          ambient: new BABYLON.Color3(0.6, 0.5, 0.3),
          light1: new BABYLON.Color3(1.0, 0.8, 0.2),
          light2: new BABYLON.Color3(1.0, 0.6, 0.1),
          light3: new BABYLON.Color3(0.9, 0.7, 0.2),
          light4: new BABYLON.Color3(1.0, 0.8, 0.3),
          central: new BABYLON.Color3(1.0, 0.9, 0.7),
          particle1: new BABYLON.Color3(1.0, 0.8, 0.3),
          particle2: new BABYLON.Color3(0.9, 0.6, 0.2),
          pillar: new BABYLON.Color3(0.25, 0.2, 0.15),
          pillarGlow: new BABYLON.Color3(0.8, 0.6, 0.2),
          rune: new BABYLON.Color3(1.0, 0.9, 0.5)
        };
      case 'ethereal':
        return {
          skybox: new BABYLON.Color3(0.02, 0.1, 0.15),
          floor: new BABYLON.Color3(0.05, 0.15, 0.2),
          floorGlow: new BABYLON.Color3(0.1, 0.5, 0.8),
          wall: new BABYLON.Color3(0.1, 0.2, 0.3),
          wallGlow: new BABYLON.Color3(0.2, 0.6, 0.9),
          ambient: new BABYLON.Color3(0.3, 0.5, 0.7),
          light1: new BABYLON.Color3(0.2, 0.8, 1.0),
          light2: new BABYLON.Color3(0.1, 0.9, 0.8),
          light3: new BABYLON.Color3(0.3, 0.7, 1.0),
          light4: new BABYLON.Color3(0.2, 0.8, 0.9),
          central: new BABYLON.Color3(0.8, 0.95, 1.0),
          particle1: new BABYLON.Color3(0.3, 0.8, 1.0),
          particle2: new BABYLON.Color3(0.2, 0.9, 0.8),
          pillar: new BABYLON.Color3(0.1, 0.2, 0.25),
          pillarGlow: new BABYLON.Color3(0.2, 0.6, 0.8),
          rune: new BABYLON.Color3(0.7, 0.9, 1.0)
        };
      case 'cosmic':
        return {
          skybox: new BABYLON.Color3(0.02, 0.02, 0.1),
          floor: new BABYLON.Color3(0.05, 0.05, 0.2),
          floorGlow: new BABYLON.Color3(0.2, 0.2, 0.8),
          wall: new BABYLON.Color3(0.1, 0.1, 0.3),
          wallGlow: new BABYLON.Color3(0.3, 0.3, 0.9),
          ambient: new BABYLON.Color3(0.3, 0.3, 0.6),
          light1: new BABYLON.Color3(0.8, 0.2, 1.0),
          light2: new BABYLON.Color3(0.2, 0.8, 1.0),
          light3: new BABYLON.Color3(1.0, 0.2, 0.8),
          light4: new BABYLON.Color3(0.2, 1.0, 0.8),
          central: new BABYLON.Color3(0.9, 0.9, 1.0),
          particle1: new BABYLON.Color3(0.8, 0.3, 1.0),
          particle2: new BABYLON.Color3(0.3, 0.8, 1.0),
          pillar: new BABYLON.Color3(0.1, 0.1, 0.25),
          pillarGlow: new BABYLON.Color3(0.4, 0.4, 0.9),
          rune: new BABYLON.Color3(0.8, 0.8, 1.0)
        };
      case 'hearthstone':
        return {
          skybox: new BABYLON.Color3(0.15, 0.12, 0.08), // Warm tavern interior
          floor: new BABYLON.Color3(0.25, 0.2, 0.15), // Wooden tavern floor
          floorGlow: new BABYLON.Color3(0.4, 0.3, 0.2), // Warm wood glow
          wall: new BABYLON.Color3(0.3, 0.25, 0.18), // Stone tavern walls
          wallGlow: new BABYLON.Color3(0.5, 0.4, 0.25), // Firelight on walls
          ambient: new BABYLON.Color3(0.6, 0.5, 0.35), // Cozy ambient light
          light1: new BABYLON.Color3(1.0, 0.7, 0.4), // Warm firelight
          light2: new BABYLON.Color3(0.9, 0.6, 0.3), // Lantern light
          light3: new BABYLON.Color3(1.0, 0.8, 0.5), // Hearth glow
          light4: new BABYLON.Color3(0.8, 0.6, 0.4), // Candle light
          central: new BABYLON.Color3(1.0, 0.8, 0.6), // Central hearth
          particle1: new BABYLON.Color3(1.0, 0.6, 0.2), // Fire sparks
          particle2: new BABYLON.Color3(0.9, 0.7, 0.4), // Ember glow
          pillar: new BABYLON.Color3(0.2, 0.15, 0.1), // Dark wood beams
          pillarGlow: new BABYLON.Color3(0.6, 0.4, 0.2), // Wood highlight
          rune: new BABYLON.Color3(1.0, 0.8, 0.5) // Warm runes
        };
      default:
        return this.getThemeColors(); // Default to mystical
    }
  }

  // Texture creation methods
  private createMysticalPattern(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('mysticalPattern', 512, this.scene, false);
    const context = texture.getContext();
    
    // Create a mystical geometric pattern
    context.fillStyle = '#1a0f2e';
    context.fillRect(0, 0, 512, 512);
    
    // Add glowing lines
    context.strokeStyle = '#4a2d5f';
    context.lineWidth = 2;
    context.globalAlpha = 0.7;
    
    // Create pentagram pattern
    const centerX = 256, centerY = 256, radius = 200;
    context.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle1 = (i * 144 - 90) * Math.PI / 180;
      const angle2 = ((i + 2) * 144 - 90) * Math.PI / 180;
      const x1 = centerX + radius * Math.cos(angle1);
      const y1 = centerY + radius * Math.sin(angle1);
      const x2 = centerX + radius * Math.cos(angle2);
      const y2 = centerY + radius * Math.sin(angle2);
      
      if (i === 0) context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    }
    context.stroke();
    
    texture.update();
    return texture;
  }

  private createNormalPattern(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('normalPattern', 256, this.scene, false);
    const context = texture.getContext();
    
    // Create a subtle normal map pattern
    const imageData = context.createImageData(256, 256);
    const data = imageData.data;
    
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const index = (y * 256 + x) * 4;
        const noise = Math.sin(x * 0.1) * Math.sin(y * 0.1) * 0.5 + 0.5;
        data[index] = 128 + noise * 50;     // Red (X normal)
        data[index + 1] = 128 + noise * 50; // Green (Y normal)
        data[index + 2] = 200;              // Blue (Z normal)
        data[index + 3] = 255;              // Alpha
      }
    }
    
    context.putImageData(imageData, 0, 0);
    texture.update();
    return texture;
  }

  private createEnergyFieldTexture(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('energyField', 256, this.scene, false);
    const context = texture.getContext();
    
    // Create flowing energy pattern
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, 256, 256);
    
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, 'rgba(128, 64, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(64, 128, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(128, 64, 255, 0.8)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    texture.update();
    return texture;
  }

  private createOrbTexture(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('orbTexture', 64, this.scene, false);
    const context = texture.getContext();
    
    // Create glowing orb
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(128, 200, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    texture.update();
    return texture;
  }

  private createWispTexture(): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture('wispTexture', 32, this.scene, false);
    const context = texture.getContext();
    
    // Create wispy energy texture
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(200, 150, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    
    texture.update();
    return texture;
  }

  private createRuneTexture(index: number): BABYLON.DynamicTexture {
    const texture = new BABYLON.DynamicTexture(`runeTexture_${index}`, 64, this.scene, false);
    const context = texture.getContext();
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, 64, 64);
    
    context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    context.lineWidth = 2;
    
    // Create different rune symbols based on index
    const centerX = 32, centerY = 32;
    context.beginPath();
    
    switch (index % 6) {
      case 0: // Circle with inner triangle
        context.arc(centerX, centerY, 25, 0, Math.PI * 2);
        context.moveTo(centerX, centerY - 15);
        context.lineTo(centerX - 13, centerY + 10);
        context.lineTo(centerX + 13, centerY + 10);
        context.closePath();
        break;
      case 1: // Diamond with cross
        context.moveTo(centerX, centerY - 20);
        context.lineTo(centerX + 20, centerY);
        context.lineTo(centerX, centerY + 20);
        context.lineTo(centerX - 20, centerY);
        context.closePath();
        context.moveTo(centerX - 15, centerY);
        context.lineTo(centerX + 15, centerY);
        context.moveTo(centerX, centerY - 15);
        context.lineTo(centerX, centerY + 15);
        break;
      case 2: // Hexagon with star
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;
          const x = centerX + 20 * Math.cos(angle);
          const y = centerY + 20 * Math.sin(angle);
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        break;
      case 3: // Spiral
        for (let i = 0; i < 50; i++) {
          const angle = i * 0.3;
          const radius = i * 0.4;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        break;
      case 4: // Celtic knot pattern
        context.arc(centerX - 10, centerY - 10, 8, 0, Math.PI * 2);
        context.moveTo(centerX + 10, centerY - 10);
        context.arc(centerX + 10, centerY - 10, 8, 0, Math.PI * 2);
        context.moveTo(centerX - 10, centerY + 10);
        context.arc(centerX - 10, centerY + 10, 8, 0, Math.PI * 2);
        context.moveTo(centerX + 10, centerY + 10);
        context.arc(centerX + 10, centerY + 10, 8, 0, Math.PI * 2);
        break;
      case 5: // Ancient symbol
        context.moveTo(centerX, centerY - 20);
        context.lineTo(centerX - 10, centerY);
        context.lineTo(centerX + 10, centerY);
        context.closePath();
        context.moveTo(centerX - 15, centerY + 5);
        context.lineTo(centerX + 15, centerY + 5);
        context.moveTo(centerX, centerY + 5);
        context.lineTo(centerX, centerY + 20);
        break;
    }
    
    context.stroke();
    texture.update();
    return texture;
  }

  // Animation methods
  private animateLight(light: BABYLON.PointLight, index: number): void {
    const baseIntensity = light.intensity;
    
    BABYLON.Animation.CreateAndStartAnimation(
      `lightPulse_${index}`,
      light,
      'intensity',
      30,
      120,
      baseIntensity,
      baseIntensity * 1.5,
      BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
    );
    
    // Random color shifting
    setTimeout(() => {
      this.animateLightColor(light, index);
    }, Math.random() * 2000);
  }

  private animateLightColor(light: BABYLON.PointLight, index: number): void {
    const colors = this.getThemeColors();
    const targetColors = [colors.light1, colors.light2, colors.light3, colors.light4];
    const targetColor = targetColors[index % targetColors.length];
    
    BABYLON.Animation.CreateAndStartAnimation(
      `lightColorShift_${index}`,
      light,
      'diffuse',
      30,
      60,
      light.diffuse,
      targetColor,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  private animateEnergyField(texture: BABYLON.DynamicTexture): void {
    let time = 0;
    let isRunning = true;
    
    const updateTexture = () => {
      if (!isRunning) return;
      
      time += 0.05;
      const context = texture.getContext();
      
      // Check if context is still valid
      if (!context) {
        isRunning = false;
        return;
      }
      
      context.clearRect(0, 0, 256, 256);
      
      // Create flowing pattern
      const gradient = context.createLinearGradient(
        Math.sin(time) * 50 + 128,
        Math.cos(time * 0.7) * 50 + 128,
        Math.sin(time + Math.PI) * 50 + 128,
        Math.cos(time * 0.7 + Math.PI) * 50 + 128
      );
      
      gradient.addColorStop(0, `rgba(128, 64, 255, ${0.6 + Math.sin(time * 2) * 0.2})`);
      gradient.addColorStop(0.5, `rgba(64, 128, 255, ${0.3 + Math.cos(time * 1.5) * 0.1})`);
      gradient.addColorStop(1, `rgba(128, 64, 255, ${0.6 + Math.sin(time * 2) * 0.2})`);
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
      
      texture.update();
      
      if (isRunning) {
        setTimeout(updateTexture, 50);
      }
    };
    
    updateTexture();
    
    // Store cleanup function to stop animation
    (texture as any)._stopAnimation = () => {
      isRunning = false;
    };
  }

  private animateWispEmitter(emitter: BABYLON.Mesh, index: number, total: number): void {
    const radius = 6;
    const speed = 0.02;
    const baseAngle = (index / total) * Math.PI * 2;
    
    const animatePosition = () => {
      const time = Date.now() * speed;
      const angle = baseAngle + time;
      
      emitter.position.x = Math.cos(angle) * radius;
      emitter.position.z = Math.sin(angle) * radius;
      emitter.position.y = 2 + Math.sin(time * 2) * 0.5;
      
      setTimeout(animatePosition, 16); // ~60fps
    };
    
    animatePosition();
  }

  private animatePillar(pillar: BABYLON.Mesh, index: number): void {
    const material = pillar.material as BABYLON.PBRMaterial;
    const baseIntensity = material.emissiveIntensity;
    
    BABYLON.Animation.CreateAndStartAnimation(
      `pillarGlow_${index}`,
      material,
      'emissiveIntensity',
      30,
      90 + index * 10, // Slightly different timing for each pillar
      baseIntensity,
      baseIntensity * 2,
      BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
    );
  }

  private animateFloatingRune(rune: BABYLON.Mesh, index: number): void {
    const baseY = rune.position.y;
    const speed = 0.01 + index * 0.002;
    
    BABYLON.Animation.CreateAndStartAnimation(
      `runeFloat_${index}`,
      rune.position,
      'y',
      30,
      180,
      baseY,
      baseY + 1.5,
      BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
    );
    
    BABYLON.Animation.CreateAndStartAnimation(
      `runeRotate_${index}`,
      rune.rotation,
      'z',
      30,
      1800,
      0,
      Math.PI * 2,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  private async setupPostProcessing(): Promise<void> {
    if (!this.scene.activeCamera) return;
    
    // Add bloom effect for mystical glow
    const pipeline = new BABYLON.DefaultRenderingPipeline(
      'defaultPipeline',
      true,
      this.scene,
      [this.scene.activeCamera]
    );
    
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 0.3;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.5;
    
    // Add subtle tone mapping
    pipeline.toneMappingEnabled = true;
    pipeline.toneMappingType = BABYLON.TonemappingOperator.Photographic;
    pipeline.toneMappingExposure = 1.0;
    
    // Add depth of field for ultra quality
    if (this.config.quality === 'ultra' && !this.config.isMobile) {
      pipeline.depthOfFieldEnabled = true;
      pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
      pipeline.depthOfField.focusDistance = 10;
      pipeline.depthOfField.focalLength = 50;
    }
  }

  private startAnimations(): void {
    // Start any additional global animations
    console.log('[MysticalArena] Starting arena animations');
  }

  public dispose(): void {
    console.log('[MysticalArena] Disposing arena resources');
    
    // Stop all animations
    this.animationGroups.forEach(group => group.dispose());
    this.animationGroups = [];
    
    // Dispose particle systems
    this.particleSystems.forEach(system => system.dispose());
    this.particleSystems = [];
    
    // Dispose lights
    this.lights.forEach(light => light.dispose());
    this.lights = [];
    
    // Stop texture animations and dispose materials
    this.materials.forEach(material => {
      if (material instanceof BABYLON.PBRMaterial) {
        // Stop energy field animations
        if (material.emissiveTexture && (material.emissiveTexture as any)._stopAnimation) {
          (material.emissiveTexture as any)._stopAnimation();
        }
      }
      material.dispose();
    });
    this.materials.clear();
    
    // Dispose meshes
    this.meshes.forEach(mesh => mesh.dispose());
    this.meshes.clear();
  }

  public changeTheme(newTheme: ArenaConfig['theme']): void {
    if (this.config.theme === newTheme) return;
    
    console.log('[MysticalArena] Changing theme from', this.config.theme, 'to', newTheme);
    this.config.theme = newTheme;
    
    // Update colors without recreating everything
    const colors = this.getThemeColors();
    
    // Update materials
    this.materials.forEach((material, name) => {
      if (material instanceof BABYLON.PBRMaterial) {
        if (name.includes('floor')) {
          material.baseColor = colors.floor;
          material.emissiveColor = colors.floorGlow;
        } else if (name.includes('wall')) {
          material.baseColor = colors.wall;
          material.emissiveColor = colors.wallGlow;
        }
      }
    });
    
    // Update lights
    this.lights.forEach((light, index) => {
      if (light instanceof BABYLON.PointLight && index < 4) {
        const lightColors = [colors.light1, colors.light2, colors.light3, colors.light4];
        light.diffuse = lightColors[index];
      }
    });
  }

  public updateQuality(newQuality: ArenaConfig['quality']): void {
    if (this.config.quality === newQuality) return;
    
    console.log('[MysticalArena] Updating quality from', this.config.quality, 'to', newQuality);
    const oldQuality = this.config.quality;
    this.config.quality = newQuality;
    
    // Enable/disable features based on quality
    if (oldQuality === 'low' && newQuality !== 'low') {
      // Enable advanced features
      this.enableAdvancedFeatures();
    } else if (oldQuality !== 'low' && newQuality === 'low') {
      // Disable advanced features
      this.disableAdvancedFeatures();
    }
  }

  private enableAdvancedFeatures(): void {
    // Re-enable particles if they were disabled
    this.particleSystems.forEach(system => {
      if (!system.isStarted()) {
        system.start();
      }
    });
  }

  private disableAdvancedFeatures(): void {
    // Disable particles for performance
    this.particleSystems.forEach(system => {
      if (system.isStarted()) {
        system.stop();
      }
    });
  }
}