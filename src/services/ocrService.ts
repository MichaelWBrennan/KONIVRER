import Tesseract from 'tesseract.js';
import CryptoJS from 'crypto-js';

export interface OcrResult {
  extractedName?: string;
  cost?: string;
  typeLine?: string;
  rulesText?: string;
  stats?: string;
  setCode?: string;
  rawText: string;
  confidence: number;
}

export interface CachedOcrData {
  imageHash: string;
  ocrResult: OcrResult;
  timestamp: number;
}

class OcrService {
  private cache = new Map<string, CachedOcrData>();
  private readonly CACHE_KEY = 'konivrer-ocr-cache';

  constructor() {
    this.loadCache();
  }

  /**
   * Calculate SHA-256 hash of an image for caching
   */
  private async calculateImageHash(imageData: ArrayBuffer): Promise<string> {
    const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(imageData));
    return hash.toString();
  }

  /**
   * Load OCR cache from localStorage
   */
  private loadCache(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        this.cache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load OCR cache:', error);
    }
  }

  /**
   * Save OCR cache to localStorage
   */
  private saveCache(): void {
    try {
      const data = Object.fromEntries(this.cache.entries());
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save OCR cache:', error);
    }
  }

  /**
   * Extract structured data from OCR text
   */
  private parseOcrText(text: string): Partial<OcrResult> {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let extractedName = '';
    let cost = '';
    let typeLine = '';
    let rulesText = '';
    let stats = '';
    let setCode = '';

    // Card name is typically at the top
    if (lines.length > 0) {
      extractedName = lines[0];
    }

    // Look for cost pattern (numbers, symbols)
    const costPattern = /(?:^|\b)(\d+|[WUBRG]+|[X]+)(?:\s*\/\s*(\d+|[WUBRG]+))*(?=\s|$)/;
    for (const line of lines) {
      const costMatch = line.match(costPattern);
      if (costMatch && !cost) {
        cost = costMatch[0];
        break;
      }
    }

    // Look for type line (contains words like "Creature", "Spell", "Artifact", etc.)
    const typeKeywords = ['Creature', 'Spell', 'Artifact', 'Instant', 'Sorcery', 'Enchantment', 'Planeswalker'];
    for (const line of lines) {
      if (typeKeywords.some(keyword => line.includes(keyword)) && !typeLine) {
        typeLine = line;
        break;
      }
    }

    // Look for stats pattern (numbers separated by /, typically at end)
    const statsPattern = /(\d+)\s*\/\s*(\d+)(?:\s*\/\s*(\d+))?$/;
    for (let i = lines.length - 1; i >= 0; i--) {
      const statsMatch = lines[i].match(statsPattern);
      if (statsMatch && !stats) {
        stats = statsMatch[0];
        break;
      }
    }

    // Look for set codes (short alphanumeric sequences)
    const setCodePattern = /\b[A-Z0-9]{2,4}\b/;
    for (const line of lines.slice(-3)) { // Check last 3 lines
      const setMatch = line.match(setCodePattern);
      if (setMatch && !setCode && setMatch[0].length <= 4) {
        setCode = setMatch[0];
        break;
      }
    }

    // Rules text is everything else, preserving line breaks
    const excludeLines = [extractedName, cost, typeLine, stats].filter(Boolean);
    const rulesLines = lines.filter(line => 
      !excludeLines.some(exclude => exclude.includes(line) || line.includes(exclude))
    );
    rulesText = rulesLines.join('\n');

    return {
      extractedName,
      cost,
      typeLine,
      rulesText,
      stats,
      setCode
    };
  }

  /**
   * Process a card image and extract text using OCR
   */
  async processCardImage(imagePath: string): Promise<OcrResult> {
    try {
      // Fetch the image
      const response = await fetch(imagePath);
      const arrayBuffer = await response.arrayBuffer();
      const imageHash = await this.calculateImageHash(arrayBuffer);

      // Check cache first
      const cached = this.cache.get(imagePath);
      if (cached && cached.imageHash === imageHash) {
        console.log(`Using cached OCR result for ${imagePath}`);
        return cached.ocrResult;
      }

      console.log(`Processing OCR for ${imagePath}`);

      // Create blob for Tesseract
      const blob = new Blob([arrayBuffer]);

      // Run OCR with optimized settings for card text
      const result = await Tesseract.recognize(blob, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress for ${imagePath}: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      const rawText = result.data.text;
      const confidence = result.data.confidence;
      
      // Parse the OCR text into structured fields
      const parsed = this.parseOcrText(rawText);

      const ocrResult: OcrResult = {
        ...parsed,
        rawText,
        confidence
      };

      // Cache the result
      this.cache.set(imagePath, {
        imageHash,
        ocrResult,
        timestamp: Date.now()
      });
      this.saveCache();

      return ocrResult;

    } catch (error) {
      console.error(`OCR processing failed for ${imagePath}:`, error);
      return {
        rawText: '',
        confidence: 0
      };
    }
  }

  /**
   * Process multiple card images in parallel (with concurrency limit)
   */
  async processMultipleImages(imagePaths: string[], concurrency = 3): Promise<Map<string, OcrResult>> {
    const results = new Map<string, OcrResult>();
    
    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < imagePaths.length; i += concurrency) {
      const batch = imagePaths.slice(i, i + concurrency);
      const promises = batch.map(async (path) => ({
        path,
        result: await this.processCardImage(path)
      }));

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ path, result }) => {
        results.set(path, result);
      });

      console.log(`Processed batch ${Math.ceil((i + 1) / concurrency)} of ${Math.ceil(imagePaths.length / concurrency)}`);
    }

    return results;
  }

  /**
   * Clear the OCR cache
   */
  clearCache(): void {
    this.cache.clear();
    localStorage.removeItem(this.CACHE_KEY);
  }
}

export const ocrService = new OcrService();