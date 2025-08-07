import * as BABYLON from 'babylonjs';

export interface KONIVRERZone {
  id: string;
  name: string;
  position: BABYLON.Vector3;
  size: { width: number; height: number };
  cards: string[];
  maxCards: number;
  type:
    | 'flag'
    | 'life'
    | 'deck'
    | 'removed'
    | 'combat'
    | 'azoth'
    | 'field'
    | 'hand';
  isPlayerOwned: boolean;
  isDropZone: boolean;
  mesh?: BABYLON.Mesh;
  material?: BABYLON.Material;
}

export interface KONIVRERCardPosition {
  cardId: string;
  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;
  scale: BABYLON.Vector3;
  zoneId: string;
  isAnimating: boolean;
}

export interface KONIVRERGameAction {
  type:
    | 'play_card'
    | 'attack'
    | 'end_turn'
    | 'activate_ability'
    | 'draw_card'
    | 'remove_card';
  sourceId: string;
  targetId?: string;
  sourceZone?: string;
  targetZone?: string;
  cost?: number;
  data?: any;
}

export interface KONIVRERBattlefieldState {
  zones: KONIVRERZone[];
  cardPositions: Map<string, KONIVRERCardPosition>;
  currentTurn: 'player' | 'opponent';
  turnPhase: 'start' | 'main' | 'combat' | 'end';
  selectedCard?: string;
  hoveredZone?: string;
  gameActions: KONIVRERGameAction[];
  flagCard: string | null;
  playerHealth: number;
  opponentHealth: number;
  playerAzoth: { current: number; max: number };
  opponentAzoth: { current: number; max: number };
}

export class KONIVRERBattlefieldSystem {
  private scene: BABYLON.Scene;
  private state: KONIVRERBattlefieldState;
  private zoneIndicators: Map<string, BABYLON.Mesh> = new Map();
  private cardMeshes: Map<string, BABYLON.Mesh> = new Map();
  private particleSystems: Map<string, BABYLON.ParticleSystem> = new Map();
  private animationGroups: BABYLON.AnimationGroup[] = [];
  private actionQueue: KONIVRERGameAction[] = [];

  // KONIVRER Zone definitions
  private readonly ZONE_DEFINITIONS = {
    // Player zones
    'player-hand': {
      position: new BABYLON.Vector3(0, 0.1, -10),
      size: { width: 16, height: 3 },
      type: 'hand' as const,
      isPlayerOwned: true,
      isDropZone: false,
      maxCards: 7,
    },
    'player-deck': {
      position: new BABYLON.Vector3(-10, 0.1, -8),
      size: { width: 2, height: 3 },
      type: 'deck' as const,
      isPlayerOwned: true,
      isDropZone: false,
      maxCards: 60,
    },
    'player-life': {
      position: new BABYLON.Vector3(-10, 0.1, -4),
      size: { width: 2, height: 2 },
      type: 'life' as const,
      isPlayerOwned: true,
      isDropZone: false,
      maxCards: 1,
    },
    'player-azoth-row': {
      position: new BABYLON.Vector3(0, 0.1, -6),
      size: { width: 14, height: 2 },
      type: 'azoth' as const,
      isPlayerOwned: true,
      isDropZone: true,
      maxCards: 3,
    },
    'player-combat-row': {
      position: new BABYLON.Vector3(0, 0.1, -3),
      size: { width: 14, height: 2 },
      type: 'combat' as const,
      isPlayerOwned: true,
      isDropZone: true,
      maxCards: 5,
    },
    // Shared zones
    'field-zone': {
      position: new BABYLON.Vector3(0, 0.1, 0),
      size: { width: 14, height: 2 },
      type: 'field' as const,
      isPlayerOwned: false,
      isDropZone: true,
      maxCards: 10,
    },
    'flag-zone': {
      position: new BABYLON.Vector3(0, 0.1, 8),
      size: { width: 4, height: 2 },
      type: 'flag' as const,
      isPlayerOwned: false,
      isDropZone: true,
      maxCards: 1,
    },
    'removed-zone': {
      position: new BABYLON.Vector3(12, 0.1, 0),
      size: { width: 2, height: 6 },
      type: 'removed' as const,
      isPlayerOwned: false,
      isDropZone: false,
      maxCards: 100,
    },
    // Opponent zones
    'opponent-combat-row': {
      position: new BABYLON.Vector3(0, 0.1, 3),
      size: { width: 14, height: 2 },
      type: 'combat' as const,
      isPlayerOwned: false,
      isDropZone: false,
      maxCards: 5,
    },
    'opponent-azoth-row': {
      position: new BABYLON.Vector3(0, 0.1, 6),
      size: { width: 14, height: 2 },
      type: 'azoth' as const,
      isPlayerOwned: false,
      isDropZone: false,
      maxCards: 3,
    },
    'opponent-life': {
      position: new BABYLON.Vector3(10, 0.1, 4),
      size: { width: 2, height: 2 },
      type: 'life' as const,
      isPlayerOwned: false,
      isDropZone: false,
      maxCards: 1,
    },
    'opponent-deck': {
      position: new BABYLON.Vector3(10, 0.1, 8),
      size: { width: 2, height: 3 },
      type: 'deck' as const,
      isPlayerOwned: false,
      isDropZone: false,
      maxCards: 60,
    },
  };

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.state = {
      zones: [],
      cardPositions: new Map(),
      currentTurn: 'player',
      turnPhase: 'main',
      gameActions: [],
      flagCard: null,
      playerHealth: 20,
      opponentHealth: 20,
      playerAzoth: { current: 3, max: 3 },
      opponentAzoth: { current: 2, max: 2 },
    };

    this.initializeZones();
    this.setupInteractionSystem();
  }

  private initializeZones(): void {
    console.log('[KONIVRERBattlefieldSystem] Initializing KONIVRER zones');

    Object.entries(this.ZONE_DEFINITIONS).forEach(([zoneId, zoneDef]) => {
      // Create zone mesh
      const zoneMesh = BABYLON.MeshBuilder.CreatePlane(
        `zone_${zoneId}`,
        { width: zoneDef.size.width, height: zoneDef.size.height },
        this.scene,
      );

      zoneMesh.position = zoneDef.position.clone();
      zoneMesh.rotation.x = -Math.PI / 2; // Lay flat on ground

      // Create zone material with KONIVRER-specific colors
      const zoneMaterial = new BABYLON.PBRMaterial(
        `zoneMaterial_${zoneId}`,
        this.scene,
      );

      // Zone-specific colors
      const zoneColors = this.getZoneColor(zoneDef.type);
      zoneMaterial.baseColor = zoneColors.base;
      zoneMaterial.alpha = 0.3;
      zoneMaterial.transparencyMode =
        BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;

      // Add glow for interactive zones
      if (zoneDef.isDropZone) {
        zoneMaterial.emissiveColor = zoneColors.emissive;
        zoneMaterial.emissiveIntensity = 0.2;
      }

      zoneMesh.material = zoneMaterial;
      zoneMesh.setEnabled(false); // Hidden by default

      // Create KONIVRER zone data
      const konivrierZone: KONIVRERZone = {
        id: zoneId,
        name: this.getZoneDisplayName(zoneId),
        position: zoneDef.position.clone(),
        size: zoneDef.size,
        cards: [],
        maxCards: zoneDef.maxCards,
        type: zoneDef.type,
        isPlayerOwned: zoneDef.isPlayerOwned,
        isDropZone: zoneDef.isDropZone,
        mesh: zoneMesh,
        material: zoneMaterial,
      };

      this.state.zones.push(konivrierZone);
      this.zoneIndicators.set(zoneId, zoneMesh);
    });
  }

  private getZoneColor(zoneType: string) {
    const colors = {
      flag: {
        base: new BABYLON.Color3(1.0, 0.84, 0.0), // Gold
        emissive: new BABYLON.Color3(1.0, 0.84, 0.0),
      },
      life: {
        base: new BABYLON.Color3(0.86, 0.08, 0.24), // Crimson
        emissive: new BABYLON.Color3(0.86, 0.08, 0.24),
      },
      deck: {
        base: new BABYLON.Color3(0.27, 0.51, 0.71), // Steel Blue
        emissive: new BABYLON.Color3(0.27, 0.51, 0.71),
      },
      removed: {
        base: new BABYLON.Color3(0.5, 0.5, 0.5), // Gray
        emissive: new BABYLON.Color3(0.3, 0.3, 0.3),
      },
      combat: {
        base: new BABYLON.Color3(0.86, 0.27, 0.07), // Orange Red
        emissive: new BABYLON.Color3(0.5, 0.15, 0.0),
      },
      azoth: {
        base: new BABYLON.Color3(0.54, 0.17, 0.89), // Blue Violet
        emissive: new BABYLON.Color3(0.3, 0.1, 0.5),
      },
      field: {
        base: new BABYLON.Color3(0.13, 0.55, 0.13), // Forest Green
        emissive: new BABYLON.Color3(0.1, 0.3, 0.1),
      },
      hand: {
        base: new BABYLON.Color3(0.1, 0.1, 0.44), // Navy Blue
        emissive: new BABYLON.Color3(0.05, 0.05, 0.25),
      },
    };

    return colors[zoneType] || colors.field;
  }

  private getZoneDisplayName(zoneId: string): string {
    const nameMap: Record<string, string> = {
      'player-hand': 'Hand',
      'player-deck': 'Deck',
      'player-life': 'Life',
      'player-azoth-row': 'Azoth Row',
      'player-combat-row': 'Combat Row',
      'field-zone': 'Field',
      'flag-zone': 'Flag',
      'removed-zone': 'Removed from Play',
      'opponent-combat-row': 'Opponent Combat',
      'opponent-azoth-row': 'Opponent Azoth',
      'opponent-life': 'Opponent Life',
      'opponent-deck': 'Opponent Deck',
    };
    return nameMap[zoneId] || zoneId;
  }

  private setupInteractionSystem(): void {
    // Setup pointer and drag interaction handling
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
  }

  private handlePointerDown(pointerInfo: BABYLON.PointerInfo): void {
    const pickInfo = pointerInfo.pickInfo;
    if (!pickInfo?.hit) return;

    const pickedMesh = pickInfo.pickedMesh;
    if (!pickedMesh) return;

    // Check if a card was clicked
    const cardId = this.getCardIdFromMesh(pickedMesh);
    if (cardId) {
      this.selectCard(cardId);
      return;
    }

    // Check if a zone was clicked
    const zoneId = this.getZoneIdFromMesh(pickedMesh);
    if (zoneId) {
      this.onZoneClicked(zoneId);
      return;
    }
  }

  private handlePointerMove(pointerInfo: BABYLON.PointerInfo): void {
    const pickInfo = pointerInfo.pickInfo;
    if (!pickInfo?.hit) {
      this.clearZoneHover();
      return;
    }

    const pickedMesh = pickInfo.pickedMesh;
    if (!pickedMesh) {
      this.clearZoneHover();
      return;
    }

    // Check for zone hover
    const zoneId = this.getZoneIdFromMesh(pickedMesh);
    if (zoneId) {
      this.setZoneHover(zoneId);
    } else {
      this.clearZoneHover();
    }
  }

  private handlePointerUp(pointerInfo: BABYLON.PointerInfo): void {
    // Handle card drops and other pointer up events
    if (this.state.selectedCard) {
      const pickInfo = pointerInfo.pickInfo;
      if (pickInfo?.hit && pickInfo.pickedMesh) {
        const zoneId = this.getZoneIdFromMesh(pickInfo.pickedMesh);
        if (zoneId) {
          this.attemptCardDrop(this.state.selectedCard, zoneId);
        }
      }
    }
  }

  private getCardIdFromMesh(mesh: BABYLON.Mesh): string | null {
    if (mesh.name.startsWith('card_')) {
      return mesh.name.replace('card_', '');
    }
    return mesh.metadata?.cardId || null;
  }

  private getZoneIdFromMesh(mesh: BABYLON.Mesh): string | null {
    if (mesh.name.startsWith('zone_')) {
      return mesh.name.replace('zone_', '');
    }
    return mesh.metadata?.zoneId || null;
  }

  public selectCard(cardId: string): void {
    console.log(`[KONIVRERBattlefieldSystem] Card selected: ${cardId}`);

    // Deselect previous card
    if (this.state.selectedCard) {
      this.deselectCard(this.state.selectedCard);
    }

    this.state.selectedCard = cardId;

    // Visual feedback for selected card
    const cardMesh = this.cardMeshes.get(cardId);
    if (cardMesh) {
      this.animateCardSelection(cardMesh, true);
    }

    // Show drop zones if applicable
    this.showDropZonesForCard(cardId);
  }

  private deselectCard(cardId: string): void {
    const cardMesh = this.cardMeshes.get(cardId);
    if (cardMesh) {
      this.animateCardSelection(cardMesh, false);
    }
    this.hideDropZones();
  }

  private animateCardSelection(
    cardMesh: BABYLON.Mesh,
    selected: boolean,
  ): void {
    const targetY = selected
      ? cardMesh.position.y + 0.5
      : cardMesh.position.y - 0.5;
    const targetScale = selected ? 1.1 : 1.0;

    // Create selection animation
    BABYLON.Animation.CreateAndStartAnimation(
      `selectCard_${cardMesh.name}`,
      cardMesh.position,
      'y',
      30,
      15,
      cardMesh.position.y,
      targetY,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    BABYLON.Animation.CreateAndStartAnimation(
      `scaleCard_${cardMesh.name}`,
      cardMesh.scaling,
      'x',
      30,
      15,
      cardMesh.scaling.x,
      targetScale,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
  }

  private showDropZonesForCard(cardId: string): void {
    const validZones = this.getValidDropZones(cardId);

    validZones.forEach(zoneId => {
      const zoneMesh = this.zoneIndicators.get(zoneId);
      if (zoneMesh) {
        zoneMesh.setEnabled(true);
        this.animateZoneHighlight(zoneMesh, true);
      }
    });
  }

  private hideDropZones(): void {
    this.zoneIndicators.forEach(zoneMesh => {
      zoneMesh.setEnabled(false);
    });
  }

  private getValidDropZones(cardId: string): string[] {
    const cardPosition = this.state.cardPositions.get(cardId);
    if (!cardPosition) return [];

    // KONIVRER specific rules for valid drops
    if (cardPosition.zoneId === 'player-hand') {
      // Cards from hand can be played to specific zones based on card type
      return [
        'player-combat-row',
        'player-azoth-row',
        'field-zone',
        'flag-zone',
      ];
    }

    return [];
  }

  private setZoneHover(zoneId: string): void {
    if (this.state.hoveredZone === zoneId) return;

    this.clearZoneHover();
    this.state.hoveredZone = zoneId;
    const zoneMesh = this.zoneIndicators.get(zoneId);
    if (zoneMesh && zoneMesh.isEnabled()) {
      this.animateZoneHighlight(zoneMesh, true, 'hover');
    }
  }

  private clearZoneHover(): void {
    if (!this.state.hoveredZone) return;

    const zoneMesh = this.zoneIndicators.get(this.state.hoveredZone);
    if (zoneMesh) {
      this.animateZoneHighlight(zoneMesh, false, 'hover');
    }

    this.state.hoveredZone = undefined;
  }

  private animateZoneHighlight(
    zoneMesh: BABYLON.Mesh,
    highlight: boolean,
    type: 'selection' | 'hover' = 'selection',
  ): void {
    const material = zoneMesh.material as BABYLON.PBRMaterial;
    if (!material) return;

    let targetEmissive: BABYLON.Color3;
    let targetAlpha: number;

    if (highlight) {
      if (type === 'hover') {
        targetEmissive = new BABYLON.Color3(0.4, 0.4, 0.1);
        targetAlpha = 0.5;
      } else {
        targetEmissive = new BABYLON.Color3(0.2, 0.6, 0.2);
        targetAlpha = 0.6;
      }
    } else {
      targetEmissive = material.emissiveColor.clone();
      targetAlpha = 0.3;
    }

    // Animate material properties
    BABYLON.Animation.CreateAndStartAnimation(
      `zoneHighlight_${zoneMesh.name}`,
      material,
      'alpha',
      30,
      15,
      material.alpha,
      targetAlpha,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
  }

  private onZoneClicked(zoneId: string): void {
    console.log(`[KONIVRERBattlefieldSystem] Zone clicked: ${zoneId}`);

    const zone = this.state.zones.find(z => z.id === zoneId);
    if (!zone) return;

    if (zone.type === 'deck' && zone.isPlayerOwned) {
      this.triggerDrawCard();
    }
  }

  private attemptCardDrop(cardId: string, targetZoneId: string): void {
    console.log(
      `[KONIVRERBattlefieldSystem] Attempting to drop card ${cardId} in zone ${targetZoneId}`,
    );

    const validZones = this.getValidDropZones(cardId);
    if (!validZones.includes(targetZoneId)) {
      console.log(
        `[KONIVRERBattlefieldSystem] Invalid drop zone: ${targetZoneId}`,
      );
      this.state.selectedCard = undefined;
      this.hideDropZones();
      return;
    }

    this.playCard(cardId, targetZoneId);
    this.state.selectedCard = undefined;
    this.hideDropZones();
  }

  public playCard(cardId: string, targetZoneId: string): void {
    const cardPosition = this.state.cardPositions.get(cardId);
    if (!cardPosition) return;

    const sourceZone = this.state.zones.find(z => z.id === cardPosition.zoneId);
    const targetZone = this.state.zones.find(z => z.id === targetZoneId);

    if (!sourceZone || !targetZone) return;

    // Remove card from source zone
    sourceZone.cards = sourceZone.cards.filter(id => id !== cardId);

    // Add card to target zone
    if (targetZone.cards.length < targetZone.maxCards) {
      targetZone.cards.push(cardId);

      // Update card position
      const newPosition = this.calculateCardPositionInZone(
        cardId,
        targetZoneId,
      );
      this.animateCardToPosition(cardId, newPosition, targetZoneId);

      // Create game action
      const action: KONIVRERGameAction = {
        type: 'play_card',
        sourceId: cardId,
        sourceZone: cardPosition.zoneId,
        targetZone: targetZoneId,
      };

      this.state.gameActions.push(action);
      this.processGameAction(action);

      console.log(
        `[KONIVRERBattlefieldSystem] Card ${cardId} played from ${cardPosition.zoneId} to ${targetZoneId}`,
      );
    }
  }

  private calculateCardPositionInZone(
    cardId: string,
    zoneId: string,
  ): BABYLON.Vector3 {
    const zone = this.state.zones.find(z => z.id === zoneId);
    if (!zone) return new BABYLON.Vector3(0, 0, 0);

    const cardIndex = zone.cards.indexOf(cardId);
    const cardCount = zone.cards.length;

    // Calculate position based on zone type and card index
    let x = zone.position.x;
    let z = zone.position.z;

    if (zone.type === 'hand') {
      const cardSpacing = Math.min(
        2.0,
        zone.size.width / Math.max(cardCount, 1),
      );
      const startX = zone.position.x - ((cardCount - 1) * cardSpacing) / 2;
      x = startX + cardIndex * cardSpacing;
    } else {
      const cardsPerRow = Math.min(cardCount, 5);
      const cardSpacing = zone.size.width / Math.max(cardsPerRow, 1);
      const startX = zone.position.x - zone.size.width / 2 + cardSpacing / 2;
      x = startX + (cardIndex % cardsPerRow) * cardSpacing;

      if (cardIndex >= 5) {
        z += 1.0; // Second row for zones with many cards
      }
    }

    return new BABYLON.Vector3(x, 0.1, z);
  }

  private animateCardToPosition(
    cardId: string,
    targetPosition: BABYLON.Vector3,
    targetZoneId: string,
  ): void {
    const cardMesh = this.cardMeshes.get(cardId);
    if (!cardMesh) return;

    // Create smooth movement animation
    BABYLON.Animation.CreateAndStartAnimation(
      `moveCard_${cardId}`,
      cardMesh.position,
      'x',
      30,
      30,
      cardMesh.position.x,
      targetPosition.x,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    BABYLON.Animation.CreateAndStartAnimation(
      `moveCardZ_${cardId}`,
      cardMesh.position,
      'z',
      30,
      30,
      cardMesh.position.z,
      targetPosition.z,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    // Update card position data
    const cardPosition = this.state.cardPositions.get(cardId);
    if (cardPosition) {
      cardPosition.position = targetPosition;
      cardPosition.zoneId = targetZoneId;
      cardPosition.isAnimating = true;

      setTimeout(() => {
        cardPosition.isAnimating = false;
      }, 1000);
    }

    // Add KONIVRER-specific particle effect
    this.createKONIVRERCardPlayEffect(targetPosition);
  }

  private createKONIVRERCardPlayEffect(position: BABYLON.Vector3): void {
    // Create mystical energy effect when card is played
    const particles = new BABYLON.ParticleSystem(
      'konivrierCardEffect',
      30,
      this.scene,
    );

    const emitter = BABYLON.MeshBuilder.CreateSphere(
      'emitter',
      { diameter: 0.1 },
      this.scene,
    );
    emitter.position = position.clone();
    emitter.position.y += 0.5;
    emitter.setEnabled(false);

    particles.particleTexture = new BABYLON.Texture(
      '/images/particles/energy.png',
      this.scene,
    );
    particles.emitter = emitter;

    particles.color1 = new BABYLON.Color4(0.54, 0.17, 0.89, 1); // Purple
    particles.color2 = new BABYLON.Color4(1.0, 0.84, 0.0, 1); // Gold
    particles.colorDead = new BABYLON.Color4(0, 0, 0, 0);

    particles.minSize = 0.1;
    particles.maxSize = 0.4;
    particles.minLifeTime = 0.3;
    particles.maxLifeTime = 1.0;
    particles.emitRate = 50;

    particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particles.direction1 = new BABYLON.Vector3(-1, 2, -1);
    particles.direction2 = new BABYLON.Vector3(1, 3, 1);
    particles.minEmitPower = 2;
    particles.maxEmitPower = 4;

    particles.start();

    // Clean up after effect
    setTimeout(() => {
      particles.stop();
      setTimeout(() => {
        particles.dispose();
        emitter.dispose();
      }, 1500);
    }, 800);
  }

  private triggerDrawCard(): void {
    console.log('[KONIVRERBattlefieldSystem] Drawing card from deck');
    // Implementation for drawing a card in KONIVRER
  }

  private processGameAction(action: KONIVRERGameAction): void {
    console.log(
      `[KONIVRERBattlefieldSystem] Processing action: ${action.type}`,
    );

    this.actionQueue.push(action);

    if (this.actionQueue.length === 1) {
      setTimeout(() => this.processActionQueue(), 0);
    }
  }

  private processActionQueue(): void {
    while (this.actionQueue.length > 0) {
      const action = this.actionQueue.shift();
      if (action) {
        this.dispatchAction(action);
      }
    }
  }

  private dispatchAction(action: KONIVRERGameAction): void {
    // Dispatch action to external game logic
    const event = new CustomEvent('konivrierBattlefieldAction', {
      detail: action,
    });
    document.dispatchEvent(event);
  }

  // Public API Methods

  public addCard(
    cardId: string,
    zoneId: string,
    position?: BABYLON.Vector3,
  ): void {
    const zone = this.state.zones.find(z => z.id === zoneId);
    if (!zone) return;

    if (zone.cards.length >= zone.maxCards) {
      console.warn(`[KONIVRERBattlefieldSystem] Zone ${zoneId} is full`);
      return;
    }

    zone.cards.push(cardId);

    const cardPosition =
      position || this.calculateCardPositionInZone(cardId, zoneId);

    this.state.cardPositions.set(cardId, {
      cardId,
      position: cardPosition,
      rotation: new BABYLON.Vector3(0, 0, 0),
      scale: new BABYLON.Vector3(1, 1, 1),
      zoneId,
      isAnimating: false,
    });

    console.log(
      `[KONIVRERBattlefieldSystem] Added card ${cardId} to zone ${zoneId}`,
    );
  }

  public removeCard(cardId: string): void {
    const cardPosition = this.state.cardPositions.get(cardId);
    if (!cardPosition) return;

    const zone = this.state.zones.find(z => z.id === cardPosition.zoneId);
    if (zone) {
      zone.cards = zone.cards.filter(id => id !== cardId);
    }

    this.state.cardPositions.delete(cardId);

    const cardMesh = this.cardMeshes.get(cardId);
    if (cardMesh) {
      cardMesh.dispose();
      this.cardMeshes.delete(cardId);
    }

    console.log(`[KONIVRERBattlefieldSystem] Removed card ${cardId}`);
  }

  public updateBattlefieldState(
    updates: Partial<KONIVRERBattlefieldState>,
  ): void {
    Object.assign(this.state, updates);
  }

  public getBattlefieldState(): KONIVRERBattlefieldState {
    return { ...this.state };
  }

  public getZoneByType(
    zoneType: string,
    isPlayerOwned: boolean,
  ): KONIVRERZone | undefined {
    return this.state.zones.find(
      z => z.type === zoneType && z.isPlayerOwned === isPlayerOwned,
    );
  }

  public dispose(): void {
    console.log(
      '[KONIVRERBattlefieldSystem] Disposing KONIVRER battlefield system',
    );

    // Clean up meshes
    this.zoneIndicators.forEach(mesh => mesh.dispose());
    this.zoneIndicators.clear();

    this.cardMeshes.forEach(mesh => mesh.dispose());
    this.cardMeshes.clear();

    // Clean up particle systems
    this.particleSystems.forEach(particles => particles.dispose());
    this.particleSystems.clear();

    // Clean up animations
    this.animationGroups.forEach(group => group.dispose());
    this.animationGroups = [];

    // Clear state
    this.state.cardPositions.clear();
    this.state.zones = [];
    this.state.gameActions = [];
    this.actionQueue = [];
  }
}
