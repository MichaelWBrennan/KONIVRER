/**
 * Card Art Loader Utility
 * Handles loading and caching of KONIVRER card artwork
 */

import { Card } from '../../data/cards';

export class CardArtLoader {
  private static instance: CardArtLoader;
  private loadedImages: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  static getInstance(): CardArtLoader {
    if (!CardArtLoader.instance) {
      CardArtLoader.instance = new CardArtLoader();
    }
    return CardArtLoader.instance;
  }

  /**
   * Get the image path for a card
   */
  getCardImagePath(card: Card): string {
    const cardName = card.name.toUpperCase();
    return `/assets/cards/${cardName}.png`;
  }

  /**
   * Get the WebP image path for a card (if available)
   */
  getCardImagePathWebP(card: Card): string {
    const cardName = card.name.toUpperCase();
    return `/assets/cards/${cardName}.webp`;
  }

  /**
   * Preload a card image
   */
  async preloadCardImage(card: Card): Promise<HTMLImageElement> {
    const imageKey = card.id;

    // Return cached image if available
    if (this.loadedImages.has(imageKey)) {
      return this.loadedImages.get(imageKey)!;
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(imageKey)) {
      return this.loadingPromises.get(imageKey)!;
    }

    // Create new loading promise
    const loadingPromise = this.loadImage(card);
    this.loadingPromises.set(imageKey, loadingPromise);

    try {
      const image = await loadingPromise;
      this.loadedImages.set(imageKey, image);
      this.loadingPromises.delete(imageKey);
      return image;
    } catch (error) {
      this.loadingPromises.delete(imageKey);
      throw error;
    }
  }

  /**
   * Load a single card image with fallback
   */
  private async loadImage(card: Card): Promise<HTMLImageElement> {
    const webpPath = this.getCardImagePathWebP(card);
    const pngPath = this.getCardImagePath(card);

    // Try WebP first (smaller file size)
    try {
      return await this.loadImageFromPath(webpPath);
    } catch (error) {
      // Fallback to PNG
      try {
        return await this.loadImageFromPath(pngPath);
      } catch (pngError) {
        // If both fail, create a placeholder
        return this.createPlaceholderImage(card);
      }
    }
  }

  /**
   * Load image from a specific path
   */
  private loadImageFromPath(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));

      img.src = path;
    });
  }

  /**
   * Create a placeholder image for cards that fail to load
   */
  private createPlaceholderImage(card: Card): HTMLImageElement {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 420;

    const ctx = canvas.getContext('2d')!;

    // Background based on card element
    const elementColors: { [key: string]: string } = {
      Fire: '#ff6b6b',
      Water: '#4ecdc4',
      Earth: '#95a5a6',
      Air: '#f39c12',
      Aether: '#e74c3c',
      Nether: '#9b59b6',
      Chaos: '#2c3e50',
      Neutral: '#7f8c8d',
    };

    const primaryElement = card.elements[0] || 'Neutral';
    const bgColor = elementColors[primaryElement] || '#7f8c8d';

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Draw card name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(card.name, canvas.width / 2, 50);

    // Draw cost
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffe66d';
    ctx.fillText(card.cost.toString(), 50, 50);

    // Draw type and rarity
    ctx.font = '18px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${card.type} - ${card.rarity}`, canvas.width / 2, 100);

    // Draw elements
    ctx.font = '16px Arial';
    ctx.fillText(
      `Elements: ${card.elements.join(', ')}`,
      canvas.width / 2,
      130,
    );

    // Draw strength (if applicable)
    if (card.strength) {
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#ff6b6b';
      ctx.fillText(
        card.strength.toString(),
        canvas.width - 50,
        canvas.height - 50,
      );
    }

    // Convert canvas to image
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  /**
   * Preload multiple card images
   */
  async preloadCards(cards: Card[]): Promise<void> {
    const loadPromises = cards.map(card => this.preloadCardImage(card));
    await Promise.allSettled(loadPromises);
  }

  /**
   * Get a loaded image or placeholder
   */
  getCardImage(card: Card): HTMLImageElement | null {
    return this.loadedImages.get(card.id) || null;
  }

  /**
   * Clear the image cache
   */
  clearCache(): void {
    this.loadedImages.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { loaded: number; loading: number } {
    return {
      loaded: this.loadedImages.size,
      loading: this.loadingPromises.size,
    };
  }
}

// Export singleton instance
export const cardArtLoader = CardArtLoader.getInstance();
