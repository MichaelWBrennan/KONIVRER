import * as BABYLON from 'babylonjs';
import { Card3D } from './Card3D';

export interface CardZone {
  name: string;
  bounds: BABYLON.BoundingBox;
  mesh: BABYLON.Mesh;
  acceptsCards: boolean;
  maxCards?: number;
  currentCards: Card3D[];
}

export interface PhysicsConfig {
  gravity: BABYLON.Vector3;
  enableCardCollisions: boolean;
  tableHeight: number;
  dragSmoothing: number;
}

export class CardPhysicsSystem {
  private scene: BABYLON.Scene;
  private physicsEngine: BABYLON.PhysicsEngine;
  private cardZones: Map<string, CardZone> = new Map();
  private config: PhysicsConfig;
  private draggedCard: Card3D | null = null;
  private dropZones: BABYLON.Mesh[] = [];

  constructor(scene: BABYLON.Scene, config?: Partial<PhysicsConfig>) {
    this.scene = scene;

    // Default physics configuration
    this.config = {
      gravity: new BABYLON.Vector3(0, -9.81, 0),
      enableCardCollisions: true,
      tableHeight: 0,
      dragSmoothing: 0.1,
      ...config,
    };

    this.initializePhysics();
    this.createGameZones();
  }

  private initializePhysics(): void {
    // Enable physics in the scene if not already enabled
    if (!this.scene.isPhysicsEnabled()) {
      this.scene.enablePhysics(
        this.config.gravity,
        new BABYLON.CannonJSPlugin(),
      );
    }

    this.physicsEngine = this.scene.getPhysicsEngine()!;
    console.log('[CardPhysics] Physics system initialized');
  }

  private createGameZones(): void {
    // Create invisible zones for different game areas
    this.createZone(
      'playerHand',
      new BABYLON.Vector3(0, 0.1, 6),
      new BABYLON.Vector3(12, 0.2, 3),
      true,
    );
    this.createZone(
      'playerBoard',
      new BABYLON.Vector3(0, 0.1, 2),
      new BABYLON.Vector3(12, 0.2, 3),
      true,
    );
    this.createZone(
      'opponentBoard',
      new BABYLON.Vector3(0, 0.1, -2),
      new BABYLON.Vector3(12, 0.2, 3),
      true,
    );
    this.createZone(
      'battlefield',
      new BABYLON.Vector3(0, 0.1, 0),
      new BABYLON.Vector3(8, 0.2, 2),
      true,
    );
    this.createZone(
      'discard',
      new BABYLON.Vector3(8, 0.1, 0),
      new BABYLON.Vector3(2, 0.2, 2),
      true,
    );
  }

  private createZone(
    name: string,
    center: BABYLON.Vector3,
    size: BABYLON.Vector3,
    acceptsCards: boolean,
  ): void {
    // Create invisible mesh for the zone
    const zoneMesh = BABYLON.MeshBuilder.CreateBox(
      `zone_${name}`,
      { width: size.x, height: size.y, depth: size.z },
      this.scene,
    );

    zoneMesh.position = center;
    zoneMesh.isVisible = false; // Make zone invisible
    zoneMesh.checkCollisions = false;

    // Create visual indicator for the zone (optional, can be toggled)
    const zoneMaterial = new BABYLON.StandardMaterial(
      `zoneMaterial_${name}`,
      this.scene,
    );
    zoneMaterial.diffuseColor = this.getZoneColor(name);
    zoneMaterial.alpha = 0.1;
    zoneMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

    const zoneIndicator = BABYLON.MeshBuilder.CreatePlane(
      `zoneIndicator_${name}`,
      { width: size.x, height: size.z },
      this.scene,
    );
    zoneIndicator.position = new BABYLON.Vector3(center.x, center.y, center.z);
    zoneIndicator.rotation.x = Math.PI / 2;
    zoneIndicator.material = zoneMaterial;

    // Create bounding box for zone detection
    const min = center.subtract(size.scale(0.5));
    const max = center.add(size.scale(0.5));
    const boundingBox = new BABYLON.BoundingBox(min, max);

    const zone: CardZone = {
      name,
      bounds: boundingBox,
      mesh: zoneMesh,
      acceptsCards,
      currentCards: [],
    };

    this.cardZones.set(name, zone);
    this.dropZones.push(zoneMesh);

    console.log(`[CardPhysics] Created zone: ${name}`);
  }

  private getZoneColor(zoneName: string): BABYLON.Color3 {
    const colors = {
      playerHand: new BABYLON.Color3(0.2, 0.6, 1.0), // Blue
      playerBoard: new BABYLON.Color3(0.2, 0.8, 0.2), // Green
      opponentBoard: new BABYLON.Color3(0.8, 0.2, 0.2), // Red
      battlefield: new BABYLON.Color3(0.8, 0.8, 0.2), // Yellow
      discard: new BABYLON.Color3(0.6, 0.3, 0.8), // Purple
    };
    return (
      colors[zoneName as keyof typeof colors] ||
      new BABYLON.Color3(0.5, 0.5, 0.5)
    );
  }

  public enableCardPhysics(card3D: Card3D): void {
    const mesh = card3D.getMesh();

    if (!mesh.physicsImpostor) {
      // Create physics impostor for the card
      mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        mesh,
        BABYLON.PhysicsImpostor.BoxImpostor,
        {
          mass: 0.1,
          restitution: 0.2,
          friction: 0.8,
        },
        this.scene,
      );
    }

    // Add collision detection with other cards if enabled
    if (this.config.enableCardCollisions) {
      this.setupCardCollisions(card3D);
    }
  }

  private setupCardCollisions(card3D: Card3D): void {
    const mesh = card3D.getMesh();

    // Register collision events
    mesh.physicsImpostor?.registerOnPhysicsCollide(
      this.dropZones,
      (main, collided) => {
        this.handleCardZoneCollision(card3D, collided.object as BABYLON.Mesh);
      },
    );
  }

  private handleCardZoneCollision(
    card3D: Card3D,
    zoneMesh: BABYLON.Mesh,
  ): void {
    // Find which zone was collided with
    for (const [zoneName, zone] of this.cardZones) {
      if (zone.mesh === zoneMesh) {
        console.log(
          `[CardPhysics] Card ${card3D.getCard().name} entered zone: ${zoneName}`,
        );
        this.onCardEnteredZone(card3D, zone);
        break;
      }
    }
  }

  private onCardEnteredZone(card3D: Card3D, zone: CardZone): void {
    if (!zone.acceptsCards) return;

    // Check if zone has space
    if (zone.maxCards && zone.currentCards.length >= zone.maxCards) {
      console.log(`[CardPhysics] Zone ${zone.name} is full`);
      return;
    }

    // Add card to zone if not already there
    if (!zone.currentCards.includes(card3D)) {
      zone.currentCards.push(card3D);
      this.arrangeCardsInZone(zone);
    }
  }

  private arrangeCardsInZone(zone: CardZone): void {
    const cards = zone.currentCards;
    if (cards.length === 0) return;

    const zoneCenter = zone.mesh.position;
    const zoneSize = zone.mesh.scaling;

    // Arrange cards in a row within the zone
    const cardSpacing = Math.min(2.8, (zoneSize.x * 0.8) / cards.length);
    const startX = zoneCenter.x - ((cards.length - 1) * cardSpacing) / 2;

    cards.forEach((card, index) => {
      const targetPosition = new BABYLON.Vector3(
        startX + index * cardSpacing,
        zoneCenter.y + 0.5,
        zoneCenter.z,
      );

      this.smoothMoveCard(card, targetPosition);
    });
  }

  private smoothMoveCard(
    card3D: Card3D,
    targetPosition: BABYLON.Vector3,
  ): void {
    const mesh = card3D.getMesh();
    const currentPosition = mesh.position.clone();

    // Smooth animation to target position
    BABYLON.Animation.CreateAndStartAnimation(
      `cardMove_${card3D.getCard().id}`,
      mesh,
      'position',
      30,
      30,
      currentPosition,
      targetPosition,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
  }

  public startDrag(card3D: Card3D): void {
    this.draggedCard = card3D;
    const mesh = card3D.getMesh();

    // Make card kinematic during drag
    if (mesh.physicsImpostor) {
      mesh.physicsImpostor.setMass(0);
      mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
      mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    }

    // Remove from current zone
    this.removeCardFromZones(card3D);

    console.log(`[CardPhysics] Started dragging: ${card3D.getCard().name}`);
  }

  public updateDrag(worldPosition: BABYLON.Vector3): void {
    if (!this.draggedCard) return;

    const mesh = this.draggedCard.getMesh();
    const currentPos = mesh.position;

    // Smooth drag movement
    const targetPos = new BABYLON.Vector3(
      worldPosition.x,
      Math.max(this.config.tableHeight + 0.5, worldPosition.y),
      worldPosition.z,
    );

    // Apply smoothing
    mesh.position = BABYLON.Vector3.Lerp(
      currentPos,
      targetPos,
      this.config.dragSmoothing,
    );
  }

  public stopDrag(): Card3D | null {
    if (!this.draggedCard) return null;

    const card = this.draggedCard;
    const mesh = card.getMesh();

    // Restore physics mass
    if (mesh.physicsImpostor) {
      mesh.physicsImpostor.setMass(0.1);
    }

    // Check which zone the card is dropped in
    const dropZone = this.getZoneAtPosition(mesh.position);
    if (dropZone) {
      this.onCardEnteredZone(card, dropZone);
    } else {
      // Return card to a valid position
      this.returnCardToValidPosition(card);
    }

    this.draggedCard = null;
    console.log(`[CardPhysics] Stopped dragging: ${card.getCard().name}`);

    return card;
  }

  private getZoneAtPosition(position: BABYLON.Vector3): CardZone | null {
    for (const zone of this.cardZones.values()) {
      if (zone.bounds.intersectsPoint(position)) {
        return zone;
      }
    }
    return null;
  }

  private removeCardFromZones(card3D: Card3D): void {
    for (const zone of this.cardZones.values()) {
      const index = zone.currentCards.indexOf(card3D);
      if (index !== -1) {
        zone.currentCards.splice(index, 1);
        this.arrangeCardsInZone(zone);
        break;
      }
    }
  }

  private returnCardToValidPosition(card3D: Card3D): void {
    // Return to player hand by default
    const handZone = this.cardZones.get('playerHand');
    if (handZone) {
      this.onCardEnteredZone(card3D, handZone);
    }
  }

  public addCardToZone(card3D: Card3D, zoneName: string): boolean {
    const zone = this.cardZones.get(zoneName);
    if (!zone || !zone.acceptsCards) {
      console.warn(`[CardPhysics] Cannot add card to zone: ${zoneName}`);
      return false;
    }

    // Remove from other zones first
    this.removeCardFromZones(card3D);

    // Add to new zone
    this.onCardEnteredZone(card3D, zone);
    return true;
  }

  public getCardsInZone(zoneName: string): Card3D[] {
    const zone = this.cardZones.get(zoneName);
    return zone ? [...zone.currentCards] : [];
  }

  public getZoneNames(): string[] {
    return Array.from(this.cardZones.keys());
  }

  public setZoneVisibility(visible: boolean): void {
    for (const zone of this.cardZones.values()) {
      const indicator = this.scene.getMeshByName(`zoneIndicator_${zone.name}`);
      if (indicator) {
        indicator.setEnabled(visible);
      }
    }
  }

  public createTableSurface(): BABYLON.Mesh {
    // Create a large invisible surface for physics
    const tableSurface = BABYLON.MeshBuilder.CreateGround(
      'tableSurface',
      { width: 30, height: 30 },
      this.scene,
    );

    tableSurface.position.y = this.config.tableHeight;
    tableSurface.isVisible = false;

    // Add physics
    tableSurface.physicsImpostor = new BABYLON.PhysicsImpostor(
      tableSurface,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.1, friction: 0.9 },
      this.scene,
    );

    return tableSurface;
  }

  public enableGravity(enable: boolean): void {
    if (enable) {
      this.physicsEngine.setGravity(this.config.gravity);
    } else {
      this.physicsEngine.setGravity(BABYLON.Vector3.Zero());
    }
  }

  public createCardDropEffect(position: BABYLON.Vector3): void {
    // Create particle effect when card is dropped
    const emitter = BABYLON.MeshBuilder.CreateSphere(
      'dropEffectEmitter',
      { diameter: 0.1 },
      this.scene,
    );
    emitter.position = position;
    emitter.setEnabled(false);

    const particleSystem = new BABYLON.ParticleSystem(
      'cardDropEffect',
      20,
      this.scene,
    );
    particleSystem.particleTexture = new BABYLON.Texture('', this.scene);
    particleSystem.emitter = emitter;

    particleSystem.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2);

    particleSystem.color1 = new BABYLON.Color4(1, 1, 1, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.8, 0.8, 0.8, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.1;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 1.0;
    particleSystem.emitRate = 50;

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.direction1 = new BABYLON.Vector3(-0.5, 1, -0.5);
    particleSystem.direction2 = new BABYLON.Vector3(0.5, 2, 0.5);
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 2;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();

    // Clean up after effect
    setTimeout(() => {
      particleSystem.stop();
      setTimeout(() => {
        particleSystem.dispose();
        emitter.dispose();
      }, 1000);
    }, 500);
  }

  public dispose(): void {
    // Clean up physics system
    this.cardZones.clear();
    this.dropZones = [];
    this.draggedCard = null;

    console.log('[CardPhysics] Physics system disposed');
  }
}
