import * as BABYLON from 'babylonjs';
import { Card } from '../../data/cards';

export interface Card3DOptions {
  scene: BABYLON.Scene;
  card: Card;
  position?: BABYLON.Vector3;
  scale?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
}

export class Card3D {
  private scene: BABYLON.Scene;
  private card: Card;
  private mesh: BABYLON.Mesh;
  private material: BABYLON.PBRMaterial;
  private cardTexture: BABYLON.DynamicTexture;
  private glowMaterial?: BABYLON.PBRMaterial;
  private glowMesh?: BABYLON.Mesh;
  private isDragging = false;
  private isHovered = false;
  private originalPosition: BABYLON.Vector3;
  private quality: string;

  // Animation properties
  private hoverAnimation?: BABYLON.Animation;
  private floatAnimation?: BABYLON.Animation;

  constructor(options: Card3DOptions) {
    this.scene = options.scene;
    this.card = options.card;
    this.quality = options.quality || 'medium';
    this.originalPosition = options.position || new BABYLON.Vector3(0, 0, 0);

    this.createCard3D(options);
    this.setupInteractions();
  }

  private createCard3D(options: Card3DOptions): void {
    // Create card mesh (standard trading card proportions: 2.5" x 3.5")
    const cardWidth = 2.5;
    const cardHeight = 3.5;
    const cardDepth = 0.1;

    this.mesh = BABYLON.MeshBuilder.CreateBox(
      `card_${this.card.id}`,
      {
        width: cardWidth,
        height: cardHeight,
        depth: cardDepth,
      },
      this.scene,
    );

    // Position the card
    this.mesh.position = this.originalPosition.clone();
    this.mesh.scaling = new BABYLON.Vector3(
      options.scale || 1,
      options.scale || 1,
      options.scale || 1,
    );

    // Create card material and texture
    this.createCardMaterial();
    this.createCardTexture();

    // Add glow effect for higher quality
    if (this.quality !== 'low') {
      this.createGlowEffect();
    }

    // Enable physics
    this.setupPhysics();

    // Add floating animation
    this.startFloatingAnimation();
  }

  private createCardMaterial(): void {
    this.material = new BABYLON.PBRMaterial(`cardMaterial_${this.card.id}`, this.scene);
    
    // Base material properties for a premium card feel
    this.material.metallicFactor = 0.1;
    this.material.roughnessFactor = 0.3;
    this.material.baseColor = this.getCardColor();
    
    // Add subtle subsurface scattering for paper-like appearance
    this.material.subSurface.isScatteringEnabled = true;
    this.material.subSurface.scatteringStrength = 0.2;
    
    this.mesh.material = this.material;
  }

  private createCardTexture(): void {
    // Create high-resolution texture for the card
    const textureSize = this.quality === 'ultra' ? 1024 : this.quality === 'high' ? 512 : 256;
    
    this.cardTexture = new BABYLON.DynamicTexture(
      `cardTexture_${this.card.id}`,
      { width: textureSize, height: Math.floor(textureSize * 1.4) }, // 3.5:2.5 ratio
      this.scene,
      false,
    );

    this.renderCardContent();
    
    this.material.baseTexture = this.cardTexture;
    this.material.emissiveTexture = this.cardTexture;
    this.material.emissiveIntensity = 0.1;
  }

  private renderCardContent(): void {
    const context = this.cardTexture.getContext();
    const width = this.cardTexture.getSize().width;
    const height = this.cardTexture.getSize().height;

    // Clear the canvas
    context.clearRect(0, 0, width, height);

    // Card background with gradient
    const bgGradient = context.createLinearGradient(0, 0, 0, height);
    const cardColor = this.getCardColor();
    bgGradient.addColorStop(0, `rgb(${cardColor.r * 255}, ${cardColor.g * 255}, ${cardColor.b * 255})`);
    bgGradient.addColorStop(1, `rgb(${cardColor.r * 180}, ${cardColor.g * 180}, ${cardColor.b * 180})`);
    
    context.fillStyle = bgGradient;
    context.fillRect(0, 0, width, height);

    // Card border
    context.strokeStyle = this.getElementColor();
    context.lineWidth = Math.max(2, width / 128);
    context.strokeRect(0, 0, width, height);

    // Cost circle (top-left)
    const costRadius = width / 12;
    context.beginPath();
    context.arc(costRadius * 1.5, costRadius * 1.5, costRadius, 0, 2 * Math.PI);
    context.fillStyle = '#1f2937';
    context.fill();
    context.strokeStyle = '#d4af37';
    context.lineWidth = Math.max(1, width / 256);
    context.stroke();
    
    // Cost text
    context.fillStyle = '#d4af37';
    context.font = `bold ${Math.floor(costRadius * 1.2)}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.card.cost.toString(), costRadius * 1.5, costRadius * 1.5);

    // Strength circle (top-right) for Familiars
    if (this.card.strength) {
      context.beginPath();
      context.arc(width - costRadius * 1.5, costRadius * 1.5, costRadius, 0, 2 * Math.PI);
      context.fillStyle = '#dc2626';
      context.fill();
      context.strokeStyle = '#ffffff';
      context.stroke();
      
      context.fillStyle = '#ffffff';
      context.fillText(this.card.strength.toString(), width - costRadius * 1.5, costRadius * 1.5);
    }

    // Card name
    context.fillStyle = '#ffffff';
    context.font = `bold ${Math.floor(width / 20)}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.strokeStyle = '#000000';
    context.lineWidth = Math.max(1, width / 512);
    context.strokeText(this.card.name, width / 2, height * 0.15);
    context.fillText(this.card.name, width / 2, height * 0.15);

    // Card type and rarity
    context.fillStyle = '#cccccc';
    context.font = `${Math.floor(width / 28)}px Arial`;
    const typeText = `${this.card.type} • ${this.card.rarity}`;
    context.fillText(typeText, width / 2, height * 0.25);

    // Card description
    context.fillStyle = '#ffffff';
    context.font = `${Math.floor(width / 32)}px Arial`;
    this.wrapText(context, this.card.description, width / 2, height * 0.4, width * 0.9, Math.floor(width / 32) * 1.2);

    // Elements at bottom
    const elementY = height * 0.8;
    const elementSpacing = width / (this.card.elements.length + 1);
    this.card.elements.forEach((element, index) => {
      const x = elementSpacing * (index + 1);
      
      // Element background
      context.fillStyle = this.getElementBackgroundColor(element);
      context.fillRect(x - width / 16, elementY - width / 32, width / 8, width / 16);
      
      // Element text
      context.fillStyle = this.getElementTextColor(element);
      context.font = `bold ${Math.floor(width / 36)}px Arial`;
      context.textAlign = 'center';
      context.fillText(element, x, elementY);
    });

    this.cardTexture.update();
  }

  private wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, currentY);
  }

  private createGlowEffect(): void {
    if (this.quality === 'low') return;

    // Create a slightly larger glow mesh behind the card
    this.glowMesh = BABYLON.MeshBuilder.CreateBox(
      `cardGlow_${this.card.id}`,
      {
        width: 2.6,
        height: 3.6,
        depth: 0.05,
      },
      this.scene,
    );

    this.glowMesh.position = this.mesh.position.clone();
    this.glowMesh.position.z -= 0.05; // Slightly behind the main card

    this.glowMaterial = new BABYLON.PBRMaterial(`cardGlowMaterial_${this.card.id}`, this.scene);
    this.glowMaterial.emissiveColor = this.getCardColor();
    this.glowMaterial.emissiveIntensity = 0.3;
    this.glowMaterial.alpha = 0.6;
    this.glowMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;

    this.glowMesh.material = this.glowMaterial;
    this.glowMesh.setEnabled(false); // Initially disabled
  }

  private setupPhysics(): void {
    // Enable physics for the card
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.mesh,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0.1,
        restitution: 0.3,
        friction: 0.5,
      },
      this.scene,
    );

    // Initially make the card kinematic (not affected by gravity during gameplay)
    this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
  }

  private setupInteractions(): void {
    // Mouse hover detection
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERMOVE:
          this.handlePointerMove(pointerInfo);
          break;
        case BABYLON.PointerEventTypes.POINTERDOWN:
          this.handlePointerDown(pointerInfo);
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          this.handlePointerUp(pointerInfo);
          break;
      }
    });
  }

  private handlePointerMove(pointerInfo: BABYLON.PointerInfo): void {
    const pickResult = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY,
      mesh => mesh === this.mesh,
    );

    const wasHovered = this.isHovered;
    this.isHovered = pickResult.hit;

    if (this.isHovered && !wasHovered) {
      this.onHoverStart();
    } else if (!this.isHovered && wasHovered) {
      this.onHoverEnd();
    }

    if (this.isDragging) {
      this.updateDragPosition(pointerInfo);
    }
  }

  private handlePointerDown(pointerInfo: BABYLON.PointerInfo): void {
    const pickResult = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY,
      mesh => mesh === this.mesh,
    );

    if (pickResult.hit && pickResult.pickedMesh === this.mesh) {
      this.startDrag();
    }
  }

  private handlePointerUp(pointerInfo: BABYLON.PointerInfo): void {
    if (this.isDragging) {
      this.stopDrag();
    }
  }

  private onHoverStart(): void {
    console.log(`[Card3D] Hovering over card: ${this.card.name}`);
    
    // Enable glow effect
    if (this.glowMesh) {
      this.glowMesh.setEnabled(true);
    }

    // Animate hover effect
    this.startHoverAnimation();
  }

  private onHoverEnd(): void {
    // Disable glow effect
    if (this.glowMesh) {
      this.glowMesh.setEnabled(false);
    }

    // Stop hover animation
    this.stopHoverAnimation();
  }

  private startDrag(): void {
    console.log(`[Card3D] Started dragging card: ${this.card.name}`);
    this.isDragging = true;

    // Make the card kinematic during drag
    if (this.mesh.physicsImpostor) {
      this.mesh.physicsImpostor.setMass(0);
    }

    // Enhance glow during drag
    if (this.glowMaterial) {
      this.glowMaterial.emissiveIntensity = 0.8;
    }

    this.stopFloatingAnimation();
  }

  private stopDrag(): void {
    console.log(`[Card3D] Stopped dragging card: ${this.card.name}`);
    this.isDragging = false;

    // Restore physics mass
    if (this.mesh.physicsImpostor) {
      this.mesh.physicsImpostor.setMass(0.1);
    }

    // Reduce glow intensity
    if (this.glowMaterial) {
      this.glowMaterial.emissiveIntensity = 0.3;
    }

    this.startFloatingAnimation();
  }

  private updateDragPosition(pointerInfo: BABYLON.PointerInfo): void {
    // Cast a ray from camera to find the drag position
    const camera = this.scene.activeCamera;
    if (!camera) return;

    const ray = this.scene.createPickingRay(
      this.scene.pointerX,
      this.scene.pointerY,
      null,
      camera,
    );

    // Find intersection with a horizontal plane at the card's current Y position
    const planeY = this.mesh.position.y;
    const t = (planeY - ray.origin.y) / ray.direction.y;
    
    if (t > 0) {
      const newPosition = ray.origin.add(ray.direction.scale(t));
      this.mesh.position.x = newPosition.x;
      this.mesh.position.z = newPosition.z;
      
      // Update glow position if it exists
      if (this.glowMesh) {
        this.glowMesh.position.x = newPosition.x;
        this.glowMesh.position.z = newPosition.z;
      }
    }
  }

  private startHoverAnimation(): void {
    this.stopHoverAnimation();

    // Gentle lift animation
    const targetY = this.originalPosition.y + 0.5;
    
    this.hoverAnimation = BABYLON.Animation.CreateAndStartAnimation(
      `cardHover_${this.card.id}`,
      this.mesh,
      'position.y',
      30,
      15,
      this.mesh.position.y,
      targetY,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
  }

  private stopHoverAnimation(): void {
    if (this.hoverAnimation) {
      this.scene.stopAnimation(this.mesh);
      this.hoverAnimation = undefined;
    }
  }

  private startFloatingAnimation(): void {
    this.stopFloatingAnimation();

    // Subtle floating motion
    const baseY = this.originalPosition.y;
    
    this.floatAnimation = BABYLON.Animation.CreateAndStartAnimation(
      `cardFloat_${this.card.id}`,
      this.mesh,
      'position.y',
      30,
      120,
      baseY,
      baseY + 0.2,
      BABYLON.Animation.ANIMATIONLOOPMODE_YOYO,
    );
  }

  private stopFloatingAnimation(): void {
    if (this.floatAnimation) {
      this.scene.stopAnimation(this.mesh);
      this.floatAnimation = undefined;
    }
  }

  // Helper methods for colors
  private getCardColor(): BABYLON.Color3 {
    const element = this.card.elements[0] || 'Neutral';
    const colors = {
      Fire: new BABYLON.Color3(0.8, 0.2, 0.1),
      Water: new BABYLON.Color3(0.1, 0.4, 0.8),
      Air: new BABYLON.Color3(0.6, 0.3, 0.8),
      Earth: new BABYLON.Color3(0.2, 0.6, 0.2),
      Nether: new BABYLON.Color3(0.4, 0.1, 0.6),
      Aether: new BABYLON.Color3(0.9, 0.7, 0.2),
      Chaos: new BABYLON.Color3(0.8, 0.1, 0.4),
      Neutral: new BABYLON.Color3(0.4, 0.4, 0.4),
    };
    return colors[element as keyof typeof colors] || colors.Neutral;
  }

  private getElementColor(): string {
    const element = this.card.elements[0] || 'Neutral';
    const colors = {
      Fire: '#ef4444',
      Water: '#3b82f6',
      Air: '#8b5cf6',
      Earth: '#22c55e',
      Nether: '#8b5cf6',
      Aether: '#f59e0b',
      Chaos: '#e11d48',
      Neutral: '#6b7280',
    };
    return colors[element as keyof typeof colors] || colors.Neutral;
  }

  private getElementBackgroundColor(element: string): string {
    const colors = {
      Fire: 'rgba(239, 68, 68, 0.3)',
      Water: 'rgba(59, 130, 246, 0.3)',
      Air: 'rgba(139, 92, 246, 0.3)',
      Earth: 'rgba(34, 197, 94, 0.3)',
      Nether: 'rgba(139, 92, 246, 0.3)',
      Aether: 'rgba(245, 158, 11, 0.3)',
      Chaos: 'rgba(225, 29, 72, 0.3)',
      Neutral: 'rgba(107, 114, 128, 0.3)',
    };
    return colors[element as keyof typeof colors] || colors.Neutral;
  }

  private getElementTextColor(element: string): string {
    return '#ffffff';
  }

  // Public methods
  public getMesh(): BABYLON.Mesh {
    return this.mesh;
  }

  public getCard(): Card {
    return this.card;
  }

  public setPosition(position: BABYLON.Vector3): void {
    this.originalPosition = position.clone();
    this.mesh.position = position.clone();
    if (this.glowMesh) {
      this.glowMesh.position = position.clone();
      this.glowMesh.position.z -= 0.05;
    }
  }

  public playCard(): void {
    console.log(`[Card3D] Playing card: ${this.card.name}`);
    // Animation for playing the card
    BABYLON.Animation.CreateAndStartAnimation(
      `cardPlay_${this.card.id}`,
      this.mesh,
      'scaling',
      30,
      30,
      this.mesh.scaling,
      new BABYLON.Vector3(1.2, 1.2, 1.2),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
  }

  public dispose(): void {
    // Clean up resources
    this.stopHoverAnimation();
    this.stopFloatingAnimation();
    
    if (this.cardTexture) {
      this.cardTexture.dispose();
    }
    
    if (this.material) {
      this.material.dispose();
    }
    
    if (this.glowMaterial) {
      this.glowMaterial.dispose();
    }
    
    if (this.glowMesh) {
      this.glowMesh.dispose();
    }
    
    if (this.mesh) {
      this.mesh.dispose();
    }
  }
}