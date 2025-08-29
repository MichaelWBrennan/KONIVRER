import { Card } from '../data/cards';

/**
 * Script to generate card data using pattern-based fallback methods
 * This runs in the browser and can be triggered from the dev console or a UI button
 */
export class CardDataGenerator {
  private readonly CARDS_DATA_KEY = 'konivrer-cards-data';

  /**
   * Get list of all card image paths
   */
  private getCardImagePaths(): string[] {
    const cardNames  : any : any : any : any = [
      'ABISS', 'ANGEL', 'ASH', 'AURORA', 'AZOTH', 'BRIGHTDUST', 'BRIGHTFULGURITE',
      'BRIGHTLAHAR', 'BRIGHTLAVA', 'BRIGHTLIGHTNING', 'BRIGHTMUD', 'BRIGHTPERMAFROST',
      'BRIGHTSTEAM', 'BRIGHTTHUNDERSNOW', 'CHAOS', 'CHAOSDUST', 'CHAOSFULGURITE',
      'CHAOSGNOME', 'CHAOSICE', 'CHAOSLAVA', 'CHAOSLIGHTNING', 'CHAOSMIST',
      'CHAOSMUD', 'CHAOSPERMAFROST', 'CHAOSSALAMANDER', 'CHAOSSTEAM', 'CHAOSSYLPH',
      'CHAOSTHUNDERSNOW', 'CHAOSUNDINE', 'DARKDUST', 'DARKFULGURITE', 'DARKICE',
      'DARKLAHAR', 'DARKLAVA', 'DARKLIGHTNING', 'DARKTHUNDERSNOW', 'DARKTYPHOON',
      'DUST', 'EMBERS', 'FLAG', 'FOG', 'FROST', 'GEODE', 'GNOME', 'ICE', 'LAHAR',
      'LIGHTNING', 'LIGHTTYPHOON', 'MAGMA', 'MIASMA', 'MUD', 'NECROSIS',
      'PERMAFROST', 'RAINBOW', 'SALAMANDER', 'SHADE', 'SMOKE', 'SOLAR', 'STEAM',
      'STORM', 'SYLPH', 'TAR', 'TYPHOON', 'UNDINE', 'XAOS'
    ];

    return cardNames.map(name => `/assets/cards/${name}.png`);
  }

  /**
   * Fallback function to determine element from card name patterns
   */
  private getCardElement(name: string): string {
    if (name.startsWith('BRIGHT')) return 'Light';
    if (name.startsWith('CHAOS')) return 'Chaos';
    if (name.startsWith('DARK')) return 'Dark';
    if (name.includes('FIRE') || name.includes('LAVA') || name.includes('EMBER')) return 'Fire';
    if (name.includes('WATER') || name.includes('ICE') || name.includes('STEAM')) return 'Water';
    if (name.includes('EARTH') || name.includes('DUST') || name.includes('MUD')) return 'Earth';
    if (name.includes('AIR') || name.includes('STORM') || name.includes('TYPHOON')) return 'Air';
    return 'Neutral';
  }

  /**
   * Fallback function to determine type from card name patterns
   */
  private getCardType(name: string): string {
    if (name.includes('GNOME') || name.includes('SALAMANDER') || name.includes('SYLPH') || 
        name.includes('UNDINE') || name.includes('ANGEL')) return 'Creature';
    if (name.includes('LIGHTNING') || name.includes('BOLT')) return 'Instant';
    if (name.includes('DUST') || name.includes('GEODE') || name.includes('TAR')) return 'Artifact';
    return 'Spell';
  }

  /**
   * Fallback function to determine rarity from card name patterns
   */
  private getCardRarity(name: string): 'common' | 'uncommon' | 'rare' {
    if (name === 'AZOTH' || name === 'RAINBOW' || name === 'XAOS') return 'rare';
    if (name.includes('CHAOS') || name.includes('BRIGHT')) return 'rare';
    if (name.includes('DARK')) return 'uncommon';
    return 'common';
  }

  /**
   * Generate card data using pattern-based fallbacks
   */
  async generateCardData(): Promise<Card[]> {
    console.log('Starting card data generation...');
    
    const imagePaths  : any : any : any : any = this.getCardImagePaths();
    console.log(`Processing ${imagePaths.length} card images...`);

    const cards: Card[]  : any : any : any : any = [];

    // Generate card data for each image using pattern-based fallbacks
    imagePaths.forEach((imagePath, index) => {
      const cardName  : any : any : any : any = imagePath.split('/').pop()?.replace('.png', '') || '';

      // Use pattern-based data generation
      const displayName  : any : any : any : any = cardName.charAt(0) + cardName.slice(1).toLowerCase().replace(/([A-Z])/g, ' $1');
      const element  : any : any : any : any = this.getCardElement(cardName);
      const type  : any : any : any : any = this.getCardType(cardName);
      const rarity  : any : any : any : any = this.getCardRarity(cardName);
      const cost  : any : any : any : any = 1; // Default cost

      const card: Card  : any : any : any : any = {
        id: `card_${index + 1}`,
        name: displayName,
        elements: [element],
        lesserType: type,
        azothCost: cost,
        setCode: 'DEMO',
        setNumber: index + 1,
        rarity,
        rulesText: `A ${element.toLowerCase()} ${type.toLowerCase()} from the KONIVRER Azoth TCG.`,
        imageUrl: `/assets/cards/${cardName}.png`,
        webpUrl: `/assets/cards/${cardName}.webp`,
        // Legacy compatibility fields
        type,
        element,
        cost,
        description: `A ${element.toLowerCase()} ${type.toLowerCase()} from the KONIVRER Azoth TCG.`,
      };

      cards.push(card);
    });

    // Save to localStorage
    localStorage.setItem(this.CARDS_DATA_KEY, JSON.stringify(cards));
    console.log(`Generated data for ${cards.length} cards`);

    return cards;
  }

  /**
   * Load card data from localStorage
   */
  loadCardData(): Card[] | null {
    try {
      const data  : any : any : any : any = localStorage.getItem(this.CARDS_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load card data:', error);
      return null;
    }
  }

  /**
   * Save card data to downloadable JSON file
   */
  downloadCardData(cards: Card[]): void {
    const dataStr  : any : any : any : any = JSON.stringify(cards, null, 2);
    const dataBlob  : any : any : any : any = new Blob([dataStr], { type: 'application/json' });
    const url  : any : any : any : any = URL.createObjectURL(dataBlob);
    
    const link  : any : any : any : any = document.createElement('a');
    link.href = url;
    link.download = 'cards.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

export const cardDataGenerator  : any : any : any : any = new CardDataGenerator();
