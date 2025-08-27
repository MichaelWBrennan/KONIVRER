import { Injectable } from "@nestjs/common";
import { CardsService } from "../cards/cards.service";
import { CreateCardDto } from "../cards/dto/card.dto";
import {
  CardType,
  CardElement,
  CardRarity,
} from "../cards/entities/card.entity";

interface LegacyCard {
  id: string;
  name: string;
  type: string;
  element: string;
  rarity: string;
  cost: number;
  power?: number;
  toughness?: number;
  description: string;
  imageUrl: string;
  webpUrl: string;
}

@Injectable()
export class MigrationService {
  constructor(private cardsService: CardsService) {}

  /**
   * Migrate legacy card data from the existing React frontend format
   */
  async migrateLegacyCards(
    legacyCards: LegacyCard[]
  ): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;

    for (const legacyCard of legacyCards) {
      try {
        const cardDto = this.transformLegacyCard(legacyCard);
        await this.cardsService.create(cardDto);
        successCount++;
      } catch (error) {
        errors.push(
          `Failed to migrate card "${legacyCard.name}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    return { success: successCount, errors };
  }

  /**
   * Transform legacy card format to new canonical format
   */
  private transformLegacyCard(legacyCard: LegacyCard): CreateCardDto {
    return {
      name: this.cleanCardName(legacyCard.name),
      type: this.mapCardType(legacyCard.type),
      element: this.mapCardElement(legacyCard.element),
      rarity: this.mapCardRarity(legacyCard.rarity),
      cost: Math.max(0, Math.min(20, legacyCard.cost)), // Clamp to valid range
      power:
        legacyCard.power !== undefined
          ? Math.max(0, Math.min(20, legacyCard.power))
          : undefined,
      toughness:
        legacyCard.toughness !== undefined
          ? Math.max(0, Math.min(20, legacyCard.toughness))
          : undefined,
      description:
        legacyCard.description ||
        `A ${legacyCard.element?.toLowerCase()} ${legacyCard.type?.toLowerCase()} from the KONIVRER Azoth TCG.`,
      imageUrl: legacyCard.imageUrl,
      webpUrl: legacyCard.webpUrl,
      keywords: this.extractKeywords(legacyCard.description),
      isLegal: true,
    };
  }

  private cleanCardName(name: string): string {
    // Convert from format like "Chaos dust" to "Chaosdust"
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  private mapCardType(type: string): CardType {
    const typeMap: Record<string, CardType> = {
      Creature: CardType.CREATURE,
      Spell: CardType.SPELL,
      Artifact: CardType.ARTIFACT,
      Instant: CardType.INSTANT,
      Enchantment: CardType.ENCHANTMENT,
    };
    return typeMap[type] || CardType.SPELL;
  }

  private mapCardElement(element: string): CardElement {
    const elementMap: Record<string, CardElement> = {
      Fire: CardElement.FIRE,
      Water: CardElement.WATER,
      Earth: CardElement.EARTH,
      Air: CardElement.AIR,
      Light: CardElement.LIGHT,
      Dark: CardElement.DARK,
      Chaos: CardElement.CHAOS,
      Neutral: CardElement.NEUTRAL,
    };
    return elementMap[element] || CardElement.NEUTRAL;
  }

  private mapCardRarity(rarity: string): CardRarity {
    const rarityMap: Record<string, CardRarity> = {
      Common: CardRarity.COMMON,
      Uncommon: CardRarity.UNCOMMON,
      Rare: CardRarity.RARE,
      Mythic: CardRarity.MYTHIC,
    };
    return rarityMap[rarity] || CardRarity.COMMON;
  }

  private extractKeywords(description: string): string[] {
    // Simple keyword extraction - can be improved
    const keywords: string[] = [];
    const text = description.toLowerCase();

    if (text.includes("flying")) keywords.push("Flying");
    if (text.includes("haste")) keywords.push("Haste");
    if (text.includes("vigilance")) keywords.push("Vigilance");
    if (text.includes("trample")) keywords.push("Trample");
    if (text.includes("flash")) keywords.push("Flash");

    return keywords;
  }

  /**
   * Generate sample cards from KONIVRER asset names
   */
  generateKonivrrerCards(): CreateCardDto[] {
    const cardNames = [
      "ABISS",
      "ANGEL",
      "ASH",
      "AURORA",
      "AZOTH",
      "BRIGHTDUST",
      "BRIGHTFULGURITE",
      "BRIGHTLAHAR",
      "BRIGHTLAVA",
      "BRIGHTLIGHTNING",
      "BRIGHTMUD",
      "BRIGHTPERMAFROST",
      "BRIGHTSTEAM",
      "BRIGHTTHUNDERSNOW",
      "CHAOS",
      "CHAOSDUST",
      "CHAOSFULGURITE",
      "CHAOSGNOME",
      "CHAOSICE",
      "CHAOSLAVA",
      "CHAOSLIGHTNING",
      "CHAOSMIST",
      "CHAOSMUD",
      "CHAOSPERMAFROST",
      "CHAOSSALAMANDER",
      "CHAOSSTEAM",
      "CHAOSSYLPH",
      "CHAOSTHUNDERSNOW",
      "CHAOSUNDINE",
      "DARKDUST",
      "DARKFULGURITE",
      "DARKICE",
      "DARKLAHAR",
      "DARKLAVA",
      "DARKLIGHTNING",
      "DARKTHUNDERSNOW",
      "DARKTYPHOON",
      "DUST",
      "EMBERS",
      "FLAG",
      "FOG",
      "FROST",
      "GEODE",
      "GNOME",
      "ICE",
      "LAHAR",
      "LIGHTNING",
      "LIGHTTYPHOON",
      "MAGMA",
      "MIASMA",
      "MUD",
      "NECROSIS",
      "PERMAFROST",
      "RAINBOW",
      "SALAMANDER",
      "SHADE",
      "SMOKE",
      "SOLAR",
      "STEAM",
      "STORM",
      "SYLPH",
      "TAR",
      "TYPHOON",
      "UNDINE",
      "XAOS",
    ];

    return cardNames.map((name) => ({
      name: this.formatCardName(name),
      type: this.inferCardType(name),
      element: this.inferCardElement(name),
      rarity: this.inferCardRarity(name),
      cost: Math.floor(Math.random() * 8) + 1,
      power:
        this.inferCardType(name) === CardType.CREATURE
          ? Math.floor(Math.random() * 8) + 1
          : undefined,
      toughness:
        this.inferCardType(name) === CardType.CREATURE
          ? Math.floor(Math.random() * 8) + 1
          : undefined,
      description: `A powerful ${this.inferCardElement(
        name
      ).toLowerCase()} ${this.inferCardType(
        name
      ).toLowerCase()} from the KONIVRER Azoth TCG.`,
      imageUrl: `/assets/cards/${name}.png`,
      webpUrl: `/assets/cards/${name}.webp`,
      isLegal: true,
    }));
  }

  private formatCardName(name: string): string {
    return (
      name.charAt(0) +
      name
        .slice(1)
        .toLowerCase()
        .replace(/([A-Z])/g, " $1")
    );
  }

  private inferCardType(name: string): CardType {
    if (
      name.includes("GNOME") ||
      name.includes("SALAMANDER") ||
      name.includes("SYLPH") ||
      name.includes("UNDINE") ||
      name.includes("ANGEL")
    )
      return CardType.CREATURE;
    if (name.includes("LIGHTNING") || name.includes("BOLT"))
      return CardType.INSTANT;
    if (name.includes("DUST") || name.includes("GEODE") || name.includes("TAR"))
      return CardType.ARTIFACT;
    return CardType.SPELL;
  }

  private inferCardElement(name: string): CardElement {
    if (name.startsWith("BRIGHT")) return CardElement.LIGHT;
    if (name.startsWith("CHAOS")) return CardElement.CHAOS;
    if (name.startsWith("DARK")) return CardElement.DARK;
    if (
      name.includes("FIRE") ||
      name.includes("LAVA") ||
      name.includes("EMBER")
    )
      return CardElement.FIRE;
    if (
      name.includes("WATER") ||
      name.includes("ICE") ||
      name.includes("STEAM")
    )
      return CardElement.WATER;
    if (name.includes("EARTH") || name.includes("DUST") || name.includes("MUD"))
      return CardElement.EARTH;
    if (
      name.includes("AIR") ||
      name.includes("STORM") ||
      name.includes("TYPHOON")
    )
      return CardElement.AIR;
    return CardElement.NEUTRAL;
  }

  private inferCardRarity(name: string): CardRarity {
    if (name === "AZOTH" || name === "RAINBOW" || name === "XAOS")
      return CardRarity.MYTHIC;
    if (name.includes("CHAOS") || name.includes("BRIGHT"))
      return CardRarity.RARE;
    if (name.includes("DARK")) return CardRarity.UNCOMMON;
    return CardRarity.COMMON;
  }
}
