import * as BABYLON from 'babylonjs';

export interface PlayerZone {
  id: string;
  name: string;
  position: BABYLON.Vector3;
  size: { width: number; height: number };
  cards: string[];
  maxCards: number;
  type: 'hand' | 'battlefield' | 'deck' | 'discard';
  isPlayerOwned: boolean;
  isDropZone: boolean;
  mesh?: BABYLON.Mesh;
  material?: BABYLON.Material;
}

export interface CardPosition {
  cardId: string;
  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;
  scale: BABYLON.Vector3;
  zoneId: string;
  isAnimating: boolean;
}

export interface GameAction {
  type: 'play_card' | 'attack' | 'end_turn' | 'activate_ability';
  sourceId: string;
  targetId?: string;
  data?: any;
}

export interface BattlefieldState {
  playerZones: PlayerZone[];
  cardPositions: Map<string, CardPosition>;
  currentTurn: 'player' | 'opponent';
  turnPhase: 'start' | 'main' | 'end';
  selectedCard?: string;
  hoveredZone?: string;
  gameActions: GameAction[];
}

export class EnhancedBattlefieldSystem {
  private scene: BABYLON.Scene;
  private state: BattlefieldState;
  private zoneIndicators: Map<string, BABYLON.Mesh> = new Map();
  private cardMeshes: Map<string, BABYLON.Mesh> = new Map();
  private particleSystems: Map<string, BABYLON.ParticleSystem> = new Map();
  private animationGroups: BABYLON.AnimationGroup[] = [];
  private actionQueue: GameAction[] = [];

  // Zone definitions for Hearthstone-style layout
  private readonly ZONE_DEFINITIONS = {
    'player-hand': {
      position: new BABYLON.Vector3(0, 0.1, -8),
      size: { width: 12, height: 2 },
      type: 'hand' as const,
      isPlayerOwned: true,
      isDropZone: false,
      maxCards: 10,
    },
    'player-battlefield': {
      position: new BABYLON.Vector3(0, 0.1, -4),
      size: { width: 14, height: 3 },
      type: 'battlefield' as const,
      isPlayerOwned: true,
      isDropZone: true,
      maxCards: 7,
    },
    'opponent-battlefield': {
      position: new BABYLON.Vector3(0, 0.1, 4),
      size: { width: 14, height: 3 },
      type: 'battlefield' as const,
      isPlayerOwned: false,
      isDropZone: false,
      maxCards: 7,
    },
    'player-deck': {
      position: new BABYLON.Vector3(8, 0.1, -8),
      size: { width: 2, height: 2 },
      type: 'deck' as const,
      isPlayerOwned: true,
      isDropZone: false,
      maxCards: 30,
    },
    'opponent-deck': {
      position: new BABYLON.Vector3(-8, 0.1, 8),
      size: { width: 2, height: 2 },
      type: 'deck' as const,
      isPlayerOwned: false,
      isDropZone: false,
      maxCards: 30,
    },
  };

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.state = {
      playerZones: [],
      cardPositions: new Map(),
      currentTurn: 'player',
      turnPhase: 'main',
      gameActions: [],
    };

    this.initializeZones();
    this.setupInteractionSystem();
  }

  private initializeZones(): void {
    console.log('[EnhancedBattlefieldSystem] Initializing player zones');

    Object.entries(this.ZONE_DEFINITIONS).forEach(([zoneId, zoneDef]) => {
      // Create zone mesh
      const zoneMesh = BABYLON.MeshBuilder.CreatePlane(
        `zone_${zoneId}`,
        { width: zoneDef.size.width, height: zoneDef.size.height },
        this.scene,
      );

      zoneMesh.position = zoneDef.position.clone();
      zoneMesh.rotation.x = -Math.PI / 2; // Lay flat on ground

      // Create zone material
      const zoneMaterial = new BABYLON.PBRMaterial(
        `zoneMaterial_${zoneId}`,
        this.scene,
      );
      zoneMaterial.baseColor = new BABYLON.Color3(0.2, 0.3, 0.4);
      zoneMaterial.alpha = 0.3;
      zoneMaterial.transparencyMode =
        BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;

      // Add subtle glow for drop zones
      if (zoneDef.isDropZone) {
        zoneMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.3, 0.1);
        zoneMaterial.emissiveIntensity = 0.2;
      }

      zoneMesh.material = zoneMaterial;
      zoneMesh.setEnabled(false); // Hidden by default

      // Create player zone data
      const playerZone: PlayerZone = {
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

      this.state.playerZones.push(playerZone);
      this.zoneIndicators.set(zoneId, zoneMesh);
    });
  }

  private getZoneDisplayName(zoneId: string): string {
    const nameMap: Record<string, string> = {
      'player-hand': 'Your Hand',
      'player-battlefield': 'Your Battlefield',
      'opponent-battlefield': 'Opponent Battlefield',
      'player-deck': 'Your Deck',
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
    // Extract card ID from mesh name or metadata
    if (mesh.name.startsWith('card_')) {
      return mesh.name.replace('card_', '');
    }
    return mesh.metadata?.cardId || null;
  }

  private getZoneIdFromMesh(mesh: BABYLON.Mesh): string | null {
    // Extract zone ID from mesh name or metadata
    if (mesh.name.startsWith('zone_')) {
      return mesh.name.replace('zone_', '');
    }
    return mesh.metadata?.zoneId || null;
  }

  public selectCard(cardId: string): void {
    console.log(`[BattlefieldSystem] Card selected: ${cardId}`);

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

    BABYLON.Animation.CreateAndStartAnimation(
      `scaleCardZ_${cardMesh.name}`,
      cardMesh.scaling,
      'z',
      30,
      15,
      cardMesh.scaling.z,
      targetScale,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
  }

  private showDropZonesForCard(cardId: string): void {
    // Determine valid drop zones for this card
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
    // Logic to determine where a card can be played
    const cardPosition = this.state.cardPositions.get(cardId);
    if (!cardPosition) return [];

    // For now, if card is in hand, it can be played to battlefield
    if (cardPosition.zoneId === 'player-hand') {
      return ['player-battlefield'];
    }

    return [];
  }

  private setZoneHover(zoneId: string): void {
    if (this.state.hoveredZone === zoneId) return;

    // Clear previous hover
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
        targetEmissive = new BABYLON.Color3(0.3, 0.3, 0.1);
        targetAlpha = 0.5;
      } else {
        targetEmissive = new BABYLON.Color3(0.1, 0.5, 0.1);
        targetAlpha = 0.6;
      }
    } else {
      targetEmissive = new BABYLON.Color3(0.1, 0.3, 0.1);
      targetAlpha = 0.3;
    }

    // Animate material properties
    BABYLON.Animation.CreateAndStartAnimation(
      `zoneHighlight_${zoneMesh.name}`,
      material.emissiveColor,
      'r',
      30,
      15,
      material.emissiveColor.r,
      targetEmissive.r,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    BABYLON.Animation.CreateAndStartAnimation(
      `zoneHighlight_g_${zoneMesh.name}`,
      material.emissiveColor,
      'g',
      30,
      15,
      material.emissiveColor.g,
      targetEmissive.g,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    BABYLON.Animation.CreateAndStartAnimation(
      `zoneHighlight_b_${zoneMesh.name}`,
      material.emissiveColor,
      'b',
      30,
      15,
      material.emissiveColor.b,
      targetEmissive.b,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    BABYLON.Animation.CreateAndStartAnimation(
      `zoneAlpha_${zoneMesh.name}`,
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
    console.log(`[BattlefieldSystem] Zone clicked: ${zoneId}`);

    // Handle zone-specific actions
    const zone = this.state.playerZones.find(z => z.id === zoneId);
    if (!zone) return;

    if (zone.type === 'deck' && zone.isPlayerOwned) {
      this.triggerDrawCard();
    }
  }

  private attemptCardDrop(cardId: string, targetZoneId: string): void {
    console.log(
      `[BattlefieldSystem] Attempting to drop card ${cardId} in zone ${targetZoneId}`,
    );

    const validZones = this.getValidDropZones(cardId);
    if (!validZones.includes(targetZoneId)) {
      console.log(`[BattlefieldSystem] Invalid drop zone: ${targetZoneId}`);
      this.state.selectedCard = undefined;
      this.hideDropZones();
      return;
    }

    // Execute the card play
    this.playCard(cardId, targetZoneId);

    this.state.selectedCard = undefined;
    this.hideDropZones();
  }

  public playCard(cardId: string, targetZoneId: string): void {
    const cardPosition = this.state.cardPositions.get(cardId);
    if (!cardPosition) return;

    const sourceZone = this.state.playerZones.find(
      z => z.id === cardPosition.zoneId,
    );
    const targetZone = this.state.playerZones.find(z => z.id === targetZoneId);

    if (!sourceZone || !targetZone) return;

    // Remove card from source zone
    sourceZone.cards = sourceZone.cards.filter(id => id !== cardId);

    // Add card to target zone
    if (targetZone.cards.length < targetZone.maxCards) {
      targetZone.cards.push(cardId);

      // Calculate new position in target zone
      const newPosition = this.calculateCardPositionInZone(
        cardId,
        targetZoneId,
      );

      // Animate card movement
      this.animateCardToPosition(cardId, newPosition, targetZoneId);

      // Create game action
      const action: GameAction = {
        type: 'play_card',
        sourceId: cardId,
        data: { sourceZone: cardPosition.zoneId, targetZone: targetZoneId },
      };

      this.state.gameActions.push(action);
      this.processGameAction(action);

      console.log(
        `[BattlefieldSystem] Card ${cardId} played from ${cardPosition.zoneId} to ${targetZoneId}`,
      );
    }
  }

  private calculateCardPositionInZone(
    cardId: string,
    zoneId: string,
  ): BABYLON.Vector3 {
    const zone = this.state.playerZones.find(z => z.id === zoneId);
    if (!zone) return new BABYLON.Vector3(0, 0, 0);

    const cardIndex = zone.cards.indexOf(cardId);
    const cardCount = zone.cards.length;

    // Calculate position based on zone type and card index
    let x = zone.position.x;
    let z = zone.position.z;

    if (zone.type === 'hand') {
      // Spread cards horizontally in hand
      const cardSpacing = Math.min(
        1.5,
        zone.size.width / Math.max(cardCount, 1),
      );
      const startX = zone.position.x - ((cardCount - 1) * cardSpacing) / 2;
      x = startX + cardIndex * cardSpacing;
    } else if (zone.type === 'battlefield') {
      // Arrange cards in battlefield
      const cardsPerRow = Math.min(cardCount, 7);
      const cardSpacing = zone.size.width / Math.max(cardsPerRow, 1);
      const startX = zone.position.x - zone.size.width / 2 + cardSpacing / 2;
      x = startX + (cardIndex % cardsPerRow) * cardSpacing;

      if (cardIndex >= 7) {
        z += 1.5; // Second row
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
    const moveAnimation = BABYLON.Animation.CreateAndStartAnimation(
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

      // Clear animation flag after animation completes
      setTimeout(() => {
        cardPosition.isAnimating = false;
      }, 1000);
    }

    // Add particle effect for card play
    this.createCardPlayEffect(targetPosition);
  }

  private createCardPlayEffect(position: BABYLON.Vector3): void {
    // Create sparkle effect when card is played
    const particles = new BABYLON.ParticleSystem(
      'cardPlayEffect',
      50,
      this.scene,
    );

    // Create emitter
    const emitter = BABYLON.MeshBuilder.CreateSphere(
      'emitter',
      { diameter: 0.1 },
      this.scene,
    );
    emitter.position = position.clone();
    emitter.position.y += 0.5;
    emitter.setEnabled(false);

    particles.particleTexture = new BABYLON.Texture(
      '/images/particles/sparkle.png',
      this.scene,
    );
    particles.emitter = emitter;

    particles.color1 = new BABYLON.Color4(1, 0.8, 0, 1);
    particles.color2 = new BABYLON.Color4(1, 0.6, 0, 1);
    particles.colorDead = new BABYLON.Color4(0, 0, 0, 0);

    particles.minSize = 0.1;
    particles.maxSize = 0.3;
    particles.minLifeTime = 0.5;
    particles.maxLifeTime = 1.5;
    particles.emitRate = 100;

    particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particles.direction1 = new BABYLON.Vector3(-0.5, 1, -0.5);
    particles.direction2 = new BABYLON.Vector3(0.5, 2, 0.5);
    particles.minEmitPower = 1;
    particles.maxEmitPower = 3;

    particles.start();

    // Clean up after effect
    setTimeout(() => {
      particles.stop();
      setTimeout(() => {
        particles.dispose();
        emitter.dispose();
      }, 2000);
    }, 1000);
  }

  private triggerDrawCard(): void {
    console.log('[BattlefieldSystem] Drawing card from deck');
    // Implementation for drawing a card
    // This would integrate with the game's card system
  }

  private processGameAction(action: GameAction): void {
    // Process the game action through the game engine
    console.log(`[BattlefieldSystem] Processing action: ${action.type}`);

    // Add to action queue for batch processing
    this.actionQueue.push(action);

    // Trigger action processing on next frame
    if (this.actionQueue.length === 1) {
      setTimeout(() => this.processActionQueue(), 0);
    }
  }

  private processActionQueue(): void {
    while (this.actionQueue.length > 0) {
      const action = this.actionQueue.shift();
      if (action) {
        // Send action to game engine or external handler
        this.dispatchAction(action);
      }
    }
  }

  private dispatchAction(action: GameAction): void {
    // Dispatch action to external game logic
    const event = new CustomEvent('battlefieldAction', { detail: action });
    document.dispatchEvent(event);
  }

  // Public API Methods

  public addCard(
    cardId: string,
    zoneId: string,
    position?: BABYLON.Vector3,
  ): void {
    const zone = this.state.playerZones.find(z => z.id === zoneId);
    if (!zone) return;

    if (zone.cards.length >= zone.maxCards) {
      console.warn(`[BattlefieldSystem] Zone ${zoneId} is full`);
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

    console.log(`[BattlefieldSystem] Added card ${cardId} to zone ${zoneId}`);
  }

  public removeCard(cardId: string): void {
    const cardPosition = this.state.cardPositions.get(cardId);
    if (!cardPosition) return;

    const zone = this.state.playerZones.find(z => z.id === cardPosition.zoneId);
    if (zone) {
      zone.cards = zone.cards.filter(id => id !== cardId);
    }

    this.state.cardPositions.delete(cardId);

    const cardMesh = this.cardMeshes.get(cardId);
    if (cardMesh) {
      cardMesh.dispose();
      this.cardMeshes.delete(cardId);
    }

    console.log(`[BattlefieldSystem] Removed card ${cardId}`);
  }

  public updateBattlefieldState(updates: Partial<BattlefieldState>): void {
    Object.assign(this.state, updates);
  }

  public getBattlefieldState(): BattlefieldState {
    return { ...this.state };
  }

  public dispose(): void {
    console.log('[EnhancedBattlefieldSystem] Disposing battlefield system');

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
    this.state.playerZones = [];
    this.state.gameActions = [];
    this.actionQueue = [];
  }
}
