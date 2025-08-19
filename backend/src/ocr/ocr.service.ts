import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { CreateCardDto } from '../cards/dto/card.dto';
import { CardElement, CardRarity, CardType } from '../cards/entities/card.entity';

@Injectable()
export class OcrService {
  constructor(private readonly cardsService: CardsService) {}

  async extractCardData(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    let ocrResult: string;
    try {
      const scribe = (await import('scribe.js-ocr')).default;
      ocrResult = await scribe.extractText(file.buffer);
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new InternalServerErrorException('OCR processing failed.');
    }

    const lines = ocrResult.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 3) {
      throw new BadRequestException('Could not parse card data from image. OCR result was too short.');
    }

    const name = lines[0].trim();
    const lesser_type = lines[1].trim();

    const setAndNumberRegex = /([A-Z\d-]+[-•♀-][A-Z\d-]*)\s+(\d+\/\d+)/;
    let set_and_rarity_symbol: string | null = null;
    let set_number: string | null = null;
    let flavor_text: string | null = null;
    const abilities: string[] = [];

    const setLineIndex = lines.findIndex(line => setAndNumberRegex.test(line));
    if (setLineIndex !== -1) {
      const match = lines[setLineIndex].match(setAndNumberRegex);
      if (match) {
        set_and_rarity_symbol = match[1];
        set_number = match[2];
      }
    }

    const flavorTextStartIndex = lines.findIndex(line => line.includes('~') || line.startsWith('“'));
    if (flavorTextStartIndex !== -1) {
      const endOfFlavor = setLineIndex !== -1 ? setLineIndex : lines.length;
      flavor_text = lines.slice(flavorTextStartIndex, endOfFlavor).join('\n').trim();
    }

    const abilitiesStartIndex = 2;
    const abilitiesEndIndex = flavorTextStartIndex !== -1 ? flavorTextStartIndex : (setLineIndex !== -1 ? setLineIndex : lines.length);

    for (let i = abilitiesStartIndex; i < abilitiesEndIndex; i++) {
      abilities.push(...lines[i].split(/, |\. /).map(s => s.trim()).filter(Boolean));
    }

    // This is a heuristic and would need to be improved for a real system
    const element = this.mapTextToElement(abilities[0] || lesser_type);

    const createCardDto: CreateCardDto = {
      name,
      type: this.mapTextToCardType(lesser_type),
      element,
      rarity: CardRarity.COMMON, // Heuristic, would need symbol recognition
      cost: 0, // Not available on the card
      description: abilities.join(', '),
      flavorText: flavor_text,
      keywords: abilities,
      imageUrl: `uploads/${file.originalname}`,
      metadata: {
        set_and_rarity_symbol,
        set_number,
        image_path: `uploads/${file.originalname}`,
        raw_ocr: ocrResult,
      },
    };

    const createdCard = await this.cardsService.create(createCardDto);

    // Return the JSON in the format requested by the user
    return {
      element: createdCard.element,
      name: createdCard.name,
      lesser_type: lesser_type, // Return the parsed type string
      abilities: createdCard.keywords,
      flavor_text: createdCard.flavorText,
      set_and_rarity_symbol: set_and_rarity_symbol,
      set_number: set_number,
      image_path: `uploads/${file.originalname}`,
    };
  }

  private mapTextToCardType(text: string): CardType {
    const upperText = text.toUpperCase();
    if (upperText.includes('FAMILIAR') || upperText.includes('CREATURE')) {
      return CardType.FAMILIAR;
    }
    if (upperText.includes('SPELL')) {
      return CardType.SPELL;
    }
    if (upperText.includes('FLAG')) {
        return CardType.FLAG;
    }
    return CardType.SPELL; // Default
  }

  private mapTextToElement(text: string): CardElement {
    const upperText = text.toUpperCase();
    if (upperText.includes('FIRE')) return CardElement.FIRE;
    if (upperText.includes('WATER')) return CardElement.WATER;
    if (upperText.includes('EARTH')) return CardElement.EARTH;
    if (upperText.includes('AIR')) return CardElement.AIR;
    if (upperText.includes('AETHER')) return CardElement.AETHER;
    if (upperText.includes('NETHER')) return CardElement.NETHER;
    if (upperText.includes('VOID')) return CardElement.NETHER; // Mapping 'VOID' to 'NETHER' as per example
    return CardElement.GENERIC;
  }
}
