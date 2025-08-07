import * as BABYLON from 'babylonjs';
import { motion } from 'framer-motion';

export interface PlayerZone {
  id: string;
  name: string;
  type: 'hand' | 'battlefield' | 'deck' | 'discard' | 'exile' | 'graveyard';
  position: BABYLON.Vector3;
  size: BABYLON.Vector2;
  maxCards: number;
  currentCards: GameCard[];
  isVisible: boolean;
  allowDrop: boolean;
  owner: 'player' | 'opponent';
  mesh?: BABYLON.Mesh;
  highlightMesh?: BABYLON.Mesh;
  animations?: BABYLON.AnimationGroup[];
}

export interface GameCard {
  id: string;
  cardId: string;
  name: string;
  cost: number;
  type: string;
  zone: string;
  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;
  mesh?: BABYLON.Mesh;
  isSelected: boolean;
  isDragging: boolean;
  canPlay: boolean;
  animations?: BABYLON.AnimationGroup[];
  owner: 'player' | 'opponent';
}

export interface ZoneLayout {
  player: {
    hand: { x: number; y: number; width: number; height: number };
    battlefield: { x: number; y: number; width: number; height: number };
    deck: { x: number; y: number; width: number; height: number };
    discard: { x: number; y: number; width: number; height: number };
  };
  opponent: {
    hand: { x: number; y: number; width: number; height: number };
    battlefield: { x: number; y: number; width: number; height: number };
    deck: { x: number; y: number; width: number; height: number };
    discard: { x: number; y: number; width: number; height: number };
  };
  central: {
    playmat: { x: number; y: number; width: number; height: number };
  };
}

/**
 * Enhanced Player Zone System for Hearthstone-style battlefield
 * Manages clearly defined player areas with drag-drop support and responsive layout
 */
export class PlayerZoneSystem {
  private scene: BABYLON.Scene;
  private camera: BABYLON.Camera;
  private zones: Map<string, PlayerZone> = new Map();
  private cards: Map<string, GameCard> = new Map();
  private draggedCard: GameCard | null = null;
  private hoverZone: PlayerZone | null = null;
  private layout: ZoneLayout;
  private isMobile: boolean;
  private isTablet: boolean;

  // Zone interaction callbacks
  private onCardDragStart?: (card: GameCard) => void;
  private onCardDragEnd?: (
    card: GameCard,
    targetZone: PlayerZone | null,
  ) => void;
  private onCardHover?: (card: GameCard | null) => void;
  private onZoneHover?: (zone: PlayerZone | null) => void;

  // Materials and effects
  private zoneMaterials: Map<string, BABYLON.Material> = new Map();
  private glowLayer: BABYLON.GlowLayer;
  private particleSystem?: BABYLON.ParticleSystem;

  constructor(scene: BABYLON.Scene, camera: BABYLON.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.glowLayer = new BABYLON.GlowLayer('glow', scene);
    this.glowLayer.intensity = 0.5;

    // Detect device type for responsive layout
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

    // Initialize responsive layout
    this.layout = this.createResponsiveLayout();

    // Initialize zones
    this.initializeZones();
    this.setupInteractionHandlers();
  }

  private createResponsiveLayout(): ZoneLayout {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = screenWidth / screenHeight;

    if (this.isMobile) {
      // Mobile layout - vertical stacking
      return {
        player: {
          hand: { x: 0.05, y: 0.8, width: 0.9, height: 0.15 },
          battlefield: { x: 0.05, y: 0.6, width: 0.9, height: 0.15 },
          deck: { x: 0.8, y: 0.05, width: 0.15, height: 0.1 },
          discard: { x: 0.05, y: 0.05, width: 0.15, height: 0.1 },
        },
        opponent: {
          hand: { x: 0.05, y: 0.05, width: 0.9, height: 0.1 },
          battlefield: { x: 0.05, y: 0.2, width: 0.9, height: 0.15 },
          deck: { x: 0.05, y: 0.35, width: 0.15, height: 0.1 },
          discard: { x: 0.8, y: 0.35, width: 0.15, height: 0.1 },
        },
        central: {
          playmat: { x: 0.25, y: 0.35, width: 0.5, height: 0.2 },
        },
      };
    } else if (this.isTablet) {
      // Tablet layout - hybrid approach
      return {
        player: {
          hand: { x: 0.1, y: 0.75, width: 0.8, height: 0.2 },
          battlefield: { x: 0.1, y: 0.55, width: 0.8, height: 0.15 },
          deck: { x: 0.85, y: 0.1, width: 0.12, height: 0.15 },
          discard: { x: 0.03, y: 0.1, width: 0.12, height: 0.15 },
        },
        opponent: {
          hand: { x: 0.1, y: 0.05, width: 0.8, height: 0.15 },
          battlefield: { x: 0.1, y: 0.25, width: 0.8, height: 0.15 },
          deck: { x: 0.03, y: 0.75, width: 0.12, height: 0.15 },
          discard: { x: 0.85, y: 0.75, width: 0.12, height: 0.15 },
        },
        central: {
          playmat: { x: 0.2, y: 0.4, width: 0.6, height: 0.15 },
        },
      };
    } else {
      // Desktop layout - traditional MTG Arena style
      return {
        player: {
          hand: { x: 0.15, y: 0.8, width: 0.7, height: 0.18 },
          battlefield: { x: 0.15, y: 0.55, width: 0.7, height: 0.2 },
          deck: { x: 0.87, y: 0.1, width: 0.1, height: 0.15 },
          discard: { x: 0.03, y: 0.1, width: 0.1, height: 0.15 },
        },
        opponent: {
          hand: { x: 0.15, y: 0.02, width: 0.7, height: 0.15 },
          battlefield: { x: 0.15, y: 0.25, width: 0.7, height: 0.2 },
          deck: { x: 0.03, y: 0.75, width: 0.1, height: 0.15 },
          discard: { x: 0.87, y: 0.75, width: 0.1, height: 0.15 },
        },
        central: {
          playmat: { x: 0.2, y: 0.45, width: 0.6, height: 0.1 },
        },
      };
    }
  }

  private initializeZones(): void {
    // Create player zones
    this.createZone('player-hand', 'hand', 'player', this.layout.player.hand);
    this.createZone(
      'player-battlefield',
      'battlefield',
      'player',
      this.layout.player.battlefield,
    );
    this.createZone('player-deck', 'deck', 'player', this.layout.player.deck);
    this.createZone(
      'player-discard',
      'discard',
      'player',
      this.layout.player.discard,
    );

    // Create opponent zones
    this.createZone(
      'opponent-hand',
      'hand',
      'opponent',
      this.layout.opponent.hand,
    );
    this.createZone(
      'opponent-battlefield',
      'battlefield',
      'opponent',
      this.layout.opponent.battlefield,
    );
    this.createZone(
      'opponent-deck',
      'deck',
      'opponent',
      this.layout.opponent.deck,
    );
    this.createZone(
      'opponent-discard',
      'discard',
      'opponent',
      this.layout.opponent.discard,
    );

    // Create central playmat
    this.createCentralPlaymat();
  }

  private createZone(
    id: string,
    type: PlayerZone['type'],
    owner: 'player' | 'opponent',
    layout: { x: number; y: number; width: number; height: number },
  ): void {
    // Convert normalized coordinates to world space
    const worldX = (layout.x - 0.5) * 20; // Spread across 20 world units
    const worldZ = (layout.y - 0.5) * 15; // Spread across 15 world units
    const worldWidth = layout.width * 20;
    const worldHeight = layout.height * 15;

    // Create zone mesh
    const zoneMesh = BABYLON.MeshBuilder.CreateGround(
      `${id}-mesh`,
      { width: worldWidth, height: worldHeight },
      this.scene,
    );
    zoneMesh.position.set(worldX, 0.01, worldZ);

    // Create zone material with subtle transparency
    const material = this.createZoneMaterial(id, type, owner);
    zoneMesh.material = material;
    this.zoneMaterials.set(id, material);

    // Create highlight mesh (initially invisible)
    const highlightMesh = BABYLON.MeshBuilder.CreateGround(
      `${id}-highlight`,
      { width: worldWidth + 0.2, height: worldHeight + 0.2 },
      this.scene,
    );
    highlightMesh.position.set(worldX, 0.02, worldZ);
    highlightMesh.material = this.createHighlightMaterial(type);
    highlightMesh.isVisible = false;

    const zone: PlayerZone = {
      id,
      name: this.getZoneDisplayName(type, owner),
      type,
      position: new BABYLON.Vector3(worldX, 0, worldZ),
      size: new BABYLON.Vector2(worldWidth, worldHeight),
      maxCards: this.getMaxCards(type),
      currentCards: [],
      isVisible: true,
      allowDrop: this.canDropInZone(type, owner),
      owner,
      mesh: zoneMesh,
      highlightMesh,
    };

    this.zones.set(id, zone);
  }

  private createCentralPlaymat(): void {
    const layout = this.layout.central.playmat;
    const worldX = (layout.x - 0.5) * 20;
    const worldZ = (layout.y - 0.5) * 15;
    const worldWidth = layout.width * 20;
    const worldHeight = layout.height * 15;

    // Create ornate playmat with mystical designs
    const playmatMesh = BABYLON.MeshBuilder.CreateGround(
      'central-playmat',
      { width: worldWidth, height: worldHeight },
      this.scene,
    );
    playmatMesh.position.set(worldX, 0.01, worldZ);

    // Special material for the central playmat
    const playmatMaterial = new BABYLON.PBRMaterial(
      'playmat-material',
      this.scene,
    );
    playmatMaterial.baseColor = new BABYLON.Color3(0.2, 0.15, 0.1);
    playmatMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.08, 0.05);
    playmatMaterial.roughness = 0.8;
    playmatMaterial.metallic = 0.1;

    // Add mystical texture pattern (we'll enhance this later)
    playmatMaterial.bumpTexture = new BABYLON.Texture(
      'data:image/svg+xml;base64,' +
        btoa(`
        <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mysticalPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
              <circle cx="16" cy="16" r="6" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="256" height="256" fill="url(#mysticalPattern)"/>
        </svg>
      `),
      this.scene,
    );

    playmatMesh.material = playmatMaterial;
  }

  private createZoneMaterial(
    id: string,
    type: PlayerZone['type'],
    owner: 'player' | 'opponent',
  ): BABYLON.Material {
    const material = new BABYLON.PBRMaterial(`${id}-material`, this.scene);

    // Color coding based on zone type and owner
    const colors = {
      hand:
        owner === 'player'
          ? new BABYLON.Color3(0.1, 0.3, 0.1)
          : new BABYLON.Color3(0.3, 0.1, 0.1),
      battlefield: new BABYLON.Color3(0.2, 0.2, 0.3),
      deck: new BABYLON.Color3(0.15, 0.15, 0.15),
      discard: new BABYLON.Color3(0.2, 0.1, 0.2),
      exile: new BABYLON.Color3(0.3, 0.3, 0.1),
      graveyard: new BABYLON.Color3(0.1, 0.1, 0.1),
    };

    material.baseColor = colors[type];
    material.alpha = 0.3;
    material.roughness = 0.9;
    material.metallic = 0.0;
    material.emissiveColor = colors[type].scale(0.2);

    return material;
  }

  private createHighlightMaterial(type: PlayerZone['type']): BABYLON.Material {
    const material = new BABYLON.PBRMaterial(`${type}-highlight`, this.scene);
    material.baseColor = new BABYLON.Color3(1, 0.8, 0.2); // Golden highlight
    material.emissiveColor = new BABYLON.Color3(0.8, 0.6, 0.1);
    material.alpha = 0.6;
    material.roughness = 0.3;
    material.metallic = 0.2;
    return material;
  }

  private getZoneDisplayName(
    type: PlayerZone['type'],
    owner: 'player' | 'opponent',
  ): string {
    const prefix = owner === 'player' ? 'Your' : "Opponent's";
    const names = {
      hand: 'Hand',
      battlefield: 'Battlefield',
      deck: 'Library',
      discard: 'Graveyard',
      exile: 'Exile',
      graveyard: 'Graveyard',
    };
    return `${prefix} ${names[type]}`;
  }

  private getMaxCards(type: PlayerZone['type']): number {
    const limits = {
      hand: 7,
      battlefield: 20,
      deck: 60,
      discard: 100,
      exile: 100,
      graveyard: 100,
    };
    return limits[type];
  }

  private canDropInZone(
    type: PlayerZone['type'],
    owner: 'player' | 'opponent',
  ): boolean {
    // Player can only drop cards in their own zones (except battlefield which is shared)
    if (type === 'battlefield') return true;
    return owner === 'player';
  }

  private setupInteractionHandlers(): void {
    // Set up pointer events for zones and cards
    this.scene.onPointerObservable.add(pointerInfo => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          this.handlePointerDown(pointerInfo);
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          this.handlePointerMove(pointerInfo);
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          this.handlePointerUp(pointerInfo);
          break;
      }
    });

    // Handle window resize for responsive layout
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handlePointerDown(pointerInfo: BABYLON.PointerInfo): void {
    const pickInfo = pointerInfo.pickInfo;
    if (!pickInfo?.hit) return;

    const pickedMesh = pickInfo.pickedMesh;
    if (!pickedMesh) return;

    // Check if a card was picked
    const card = Array.from(this.cards.values()).find(
      c => c.mesh === pickedMesh,
    );
    if (card && card.canPlay && card.owner === 'player') {
      this.startCardDrag(card);
    }
  }

  private handlePointerMove(pointerInfo: BABYLON.PointerInfo): void {
    if (this.draggedCard) {
      this.updateCardDrag(pointerInfo);
    } else {
      this.updateHoverEffects(pointerInfo);
    }
  }

  private handlePointerUp(pointerInfo: BABYLON.PointerInfo): void {
    if (this.draggedCard) {
      this.endCardDrag(pointerInfo);
    }
  }

  private handleResize(): void {
    const wasTablet = this.isTablet;
    const wasMobile = this.isMobile;

    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

    // Only recreate layout if device category changed
    if (this.isMobile !== wasMobile || this.isTablet !== wasTablet) {
      this.layout = this.createResponsiveLayout();
      this.repositionZones();
    }
  }

  private repositionZones(): void {
    // Update zone positions based on new layout
    const layouts = {
      'player-hand': this.layout.player.hand,
      'player-battlefield': this.layout.player.battlefield,
      'player-deck': this.layout.player.deck,
      'player-discard': this.layout.player.discard,
      'opponent-hand': this.layout.opponent.hand,
      'opponent-battlefield': this.layout.opponent.battlefield,
      'opponent-deck': this.layout.opponent.deck,
      'opponent-discard': this.layout.opponent.discard,
    };

    for (const [zoneId, layout] of Object.entries(layouts)) {
      const zone = this.zones.get(zoneId);
      if (zone && zone.mesh) {
        const worldX = (layout.x - 0.5) * 20;
        const worldZ = (layout.y - 0.5) * 15;

        // Animate the transition
        BABYLON.Animation.CreateAndStartAnimation(
          `${zoneId}-reposition`,
          zone.mesh,
          'position',
          30, // fps
          15, // frames (0.5 seconds)
          zone.mesh.position,
          new BABYLON.Vector3(worldX, 0.01, worldZ),
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        );

        zone.position.set(worldX, 0, worldZ);
      }
    }
  }

  private startCardDrag(card: GameCard): void {
    this.draggedCard = card;
    card.isDragging = true;
    card.isSelected = true;

    // Visual feedback
    if (card.mesh) {
      card.mesh.position.y += 0.5; // Lift card
      this.glowLayer.addIncludedOnlyMesh(card.mesh);
    }

    this.onCardDragStart?.(card);
  }

  private updateCardDrag(pointerInfo: BABYLON.PointerInfo): void {
    if (!this.draggedCard || !pointerInfo.pickInfo) return;

    const pickInfo = pointerInfo.pickInfo;
    if (pickInfo.ray) {
      // Project ray to ground plane
      const groundPlane = BABYLON.Plane.FromPositionAndNormal(
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Up(),
      );

      const distance = pickInfo.ray.intersectsPlane(groundPlane);
      if (distance !== null) {
        const point = pickInfo.ray.origin.add(
          pickInfo.ray.direction.scale(distance),
        );

        if (this.draggedCard.mesh) {
          this.draggedCard.mesh.position.x = point.x;
          this.draggedCard.mesh.position.z = point.z;
        }
      }
    }

    // Check for zone hover
    this.updateZoneHover();
  }

  private endCardDrag(pointerInfo: BABYLON.PointerInfo): void {
    if (!this.draggedCard) return;

    const card = this.draggedCard;
    const targetZone = this.getZoneUnderCard(card);

    // Reset card visual state
    card.isDragging = false;
    card.isSelected = false;

    if (card.mesh) {
      card.mesh.position.y -= 0.5; // Lower card
      this.glowLayer.removeIncludedOnlyMesh(card.mesh);
    }

    // Clear zone highlights
    this.clearZoneHighlights();

    this.onCardDragEnd?.(card, targetZone);
    this.draggedCard = null;
    this.hoverZone = null;
  }

  private updateHoverEffects(pointerInfo: BABYLON.PointerInfo): void {
    const pickInfo = pointerInfo.pickInfo;
    if (!pickInfo?.hit || !pickInfo.pickedMesh) {
      this.onCardHover?.(null);
      return;
    }

    // Check for card hover
    const card = Array.from(this.cards.values()).find(
      c => c.mesh === pickInfo.pickedMesh,
    );
    if (card) {
      this.onCardHover?.(card);
    }
  }

  private updateZoneHover(): void {
    if (!this.draggedCard) return;

    const newHoverZone = this.getZoneUnderCard(this.draggedCard);

    if (newHoverZone !== this.hoverZone) {
      // Clear previous highlight
      if (this.hoverZone?.highlightMesh) {
        this.hoverZone.highlightMesh.isVisible = false;
      }

      // Show new highlight
      if (newHoverZone?.highlightMesh && newHoverZone.allowDrop) {
        newHoverZone.highlightMesh.isVisible = true;
      }

      this.hoverZone = newHoverZone;
      this.onZoneHover?.(newHoverZone);
    }
  }

  private getZoneUnderCard(card: GameCard): PlayerZone | null {
    if (!card.mesh) return null;

    for (const zone of this.zones.values()) {
      if (this.isPointInZone(card.mesh.position, zone)) {
        return zone;
      }
    }
    return null;
  }

  private isPointInZone(point: BABYLON.Vector3, zone: PlayerZone): boolean {
    const halfWidth = zone.size.x / 2;
    const halfHeight = zone.size.y / 2;

    return (
      point.x >= zone.position.x - halfWidth &&
      point.x <= zone.position.x + halfWidth &&
      point.z >= zone.position.z - halfHeight &&
      point.z <= zone.position.z + halfHeight
    );
  }

  private clearZoneHighlights(): void {
    for (const zone of this.zones.values()) {
      if (zone.highlightMesh) {
        zone.highlightMesh.isVisible = false;
      }
    }
  }

  // Public API methods

  public addCard(card: GameCard): void {
    this.cards.set(card.id, card);
    const zone = this.zones.get(`${card.owner}-${card.zone}`);
    if (zone) {
      zone.currentCards.push(card);
      this.arrangeCardsInZone(zone);
    }
  }

  public removeCard(cardId: string): void {
    const card = this.cards.get(cardId);
    if (!card) return;

    this.cards.delete(cardId);

    // Remove from zone
    const zone = this.zones.get(`${card.owner}-${card.zone}`);
    if (zone) {
      zone.currentCards = zone.currentCards.filter(c => c.id !== cardId);
      this.arrangeCardsInZone(zone);
    }

    // Dispose mesh
    if (card.mesh) {
      card.mesh.dispose();
    }
  }

  public moveCard(cardId: string, targetZoneId: string): void {
    const card = this.cards.get(cardId);
    if (!card) return;

    const currentZone = this.zones.get(`${card.owner}-${card.zone}`);
    const targetZone = this.zones.get(targetZoneId);

    if (!currentZone || !targetZone) return;

    // Remove from current zone
    currentZone.currentCards = currentZone.currentCards.filter(
      c => c.id !== cardId,
    );

    // Add to target zone
    card.zone = targetZone.type;
    targetZone.currentCards.push(card);

    // Rearrange both zones
    this.arrangeCardsInZone(currentZone);
    this.arrangeCardsInZone(targetZone);
  }

  private arrangeCardsInZone(zone: PlayerZone): void {
    const cards = zone.currentCards;
    if (cards.length === 0) return;

    const spacing = Math.min(zone.size.x / Math.max(cards.length, 1), 2.0);
    const startX = zone.position.x - ((cards.length - 1) * spacing) / 2;

    cards.forEach((card, index) => {
      if (card.mesh && !card.isDragging) {
        const targetPosition = new BABYLON.Vector3(
          startX + index * spacing,
          0.1,
          zone.position.z,
        );

        // Animate to position
        BABYLON.Animation.CreateAndStartAnimation(
          `card-${card.id}-arrange`,
          card.mesh,
          'position',
          30, // fps
          15, // frames (0.5 seconds)
          card.mesh.position,
          targetPosition,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        );

        card.position = targetPosition;
      }
    });
  }

  public setEventHandlers(handlers: {
    onCardDragStart?: (card: GameCard) => void;
    onCardDragEnd?: (card: GameCard, targetZone: PlayerZone | null) => void;
    onCardHover?: (card: GameCard | null) => void;
    onZoneHover?: (zone: PlayerZone | null) => void;
  }): void {
    this.onCardDragStart = handlers.onCardDragStart;
    this.onCardDragEnd = handlers.onCardDragEnd;
    this.onCardHover = handlers.onCardHover;
    this.onZoneHover = handlers.onZoneHover;
  }

  public getZone(zoneId: string): PlayerZone | null {
    return this.zones.get(zoneId) || null;
  }

  public getCard(cardId: string): GameCard | null {
    return this.cards.get(cardId) || null;
  }

  public getAllZones(): PlayerZone[] {
    return Array.from(this.zones.values());
  }

  public getAllCards(): GameCard[] {
    return Array.from(this.cards.values());
  }

  public dispose(): void {
    // Dispose all meshes and materials
    for (const zone of this.zones.values()) {
      zone.mesh?.dispose();
      zone.highlightMesh?.dispose();
    }

    for (const card of this.cards.values()) {
      card.mesh?.dispose();
    }

    for (const material of this.zoneMaterials.values()) {
      material.dispose();
    }

    this.glowLayer.dispose();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}
