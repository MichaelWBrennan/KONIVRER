import cardsData from '../data/cards.json';

/**
 * Utility functions for mapping card art names to database entries
 */

// Create a mapping from card names to their database IDs
const createCardNameToIdMap = () => {
  const nameToIdMap = new Map();
  
  cardsData.forEach(card => {
    // Map by exact name
    nameToIdMap.set(card.name, card.id);
    
    // Map by normalized name (uppercase, no spaces)
    const normalizedName = card.name.toUpperCase().replace(/\s+/g, '_');
    nameToIdMap.set(normalizedName, card.id);
    
    // Map by name without special characters
    const cleanName = card.name.replace(/[^\w\s]/g, '').toUpperCase().replace(/\s+/g, '_');
    nameToIdMap.set(cleanName, card.id);
  });
  
  return nameToIdMap;
};

// Create the mapping once
const CARD_NAME_TO_ID_MAP = createCardNameToIdMap();

/**
 * Convert card art filename to card database ID
 * @param {string} cardArtName - The card art name (e.g., "ABISS", "XAOS_LAVA")
 * @returns {string|null} - The card database ID or null if not found
 */
export const getCardIdFromArtName = (cardArtName) => {
  if (!cardArtName) return null;
  
  // Remove file extension and face notation if present
  const cleanName = cardArtName
    .replace(/\[face,\d+\]\.png$/i, '')
    .replace(/_face_\d+\.png$/i, '')  // Handle old _face_1.png format (legacy)
    .replace(/_face_\d+$/i, '')  // Handle _face_6 without .png (legacy)
    .replace(/\.png$/i, '')
    .replace(/_+$/, '');  // Remove trailing underscores
  
  // Try direct lookup first
  if (CARD_NAME_TO_ID_MAP.has(cleanName)) {
    return CARD_NAME_TO_ID_MAP.get(cleanName);
  }
  
  // Try with underscores replaced by spaces
  const spacedName = cleanName.replace(/_/g, ' ');
  if (CARD_NAME_TO_ID_MAP.has(spacedName)) {
    return CARD_NAME_TO_ID_MAP.get(spacedName);
  }
  
  // Try with special character handling for specific cases
  const specialMappings = {
    'PhVE_ELEMENT_PhLAG': 'ΦIVE ELEMENT ΦLAG',
    'FIVE_ELEMENT_FLAG': 'ΦIVE ELEMENT ΦLAG',
    'AZOTH': 'AZOΘ',
    'SOLAR': 'SOLAR ☉',
  };
  
  if (specialMappings[cleanName]) {
    const mappedName = specialMappings[cleanName];
    return CARD_NAME_TO_ID_MAP.get(mappedName);
  }
  
  // Try converting art name back to database format with Greek letters
  const greekConversion = cleanName
    .replace(/Ph/g, 'Φ')
    .replace(/TH/g, 'Θ')
    .replace(/BRIGT/g, 'BRIΓT')  // Handle BRIGT -> BRIΓT
    .replace(/LIGTNING/g, 'LIΓTNING')  // Handle LIGTNING -> LIΓTNING specifically
    .replace(/THVNDERSNOVV/g, 'THVNDERSNOVV')  // Keep THVNDERSNOVV as is
    .replace(/_/g, ' ');
  
  if (CARD_NAME_TO_ID_MAP.has(greekConversion)) {
    return CARD_NAME_TO_ID_MAP.get(greekConversion);
  }
  
  // For variant cards (BRIGT_, DARK_, XAOS_), try to find the base card
  if (cleanName.includes('_')) {
    const parts = cleanName.split('_');
    if (parts.length >= 2) {
      const prefix = parts[0];
      const baseCardName = parts.slice(1).join('_'); // Remove prefix
      
      // Convert prefix to Greek letters and try with space
      const greekPrefix = prefix
        .replace(/Ph/g, 'Φ')
        .replace(/TH/g, 'Θ')
        .replace(/BRIGT/g, 'BRIΓT');
      
      const greekBaseCard = baseCardName
        .replace(/Ph/g, 'Φ')
        .replace(/LIGTNING/g, 'LIΓTNING')
        .replace(/_/g, ' ');
      
      // Don't convert TH to Θ in THVNDERSNOVV - it stays as TH
      
      const fullGreekName = `${greekPrefix} ${greekBaseCard}`;
      
      if (CARD_NAME_TO_ID_MAP.has(fullGreekName)) {
        return CARD_NAME_TO_ID_MAP.get(fullGreekName);
      }
      
      // Try just the base card name
      if (CARD_NAME_TO_ID_MAP.has(baseCardName)) {
        return CARD_NAME_TO_ID_MAP.get(baseCardName);
      }
      
      if (CARD_NAME_TO_ID_MAP.has(greekBaseCard)) {
        return CARD_NAME_TO_ID_MAP.get(greekBaseCard);
      }
    }
  }
  
  return null;
};

/**
 * Get card data from art name
 * @param {string} cardArtName - The card art name
 * @returns {object|null} - The card data object or null if not found
 */
export const getCardDataFromArtName = (cardArtName) => {
  const cardId = getCardIdFromArtName(cardArtName);
  if (!cardId) return null;
  
  return cardsData.find(card => card.id === cardId) || null;
};

/**
 * Check if a card art has a corresponding database entry
 * @param {string} cardArtName - The card art name
 * @returns {boolean} - True if the card exists in the database
 */
export const hasCardData = (cardArtName) => {
  return getCardIdFromArtName(cardArtName) !== null;
};

/**
 * Get the card detail page URL for a card art
 * @param {string} cardArtName - The card art name
 * @returns {string|null} - The URL path or null if no card data exists
 */
export const getCardDetailUrl = (cardArtName) => {
  const cardId = getCardIdFromArtName(cardArtName);
  return cardId ? `/card/${cardId}` : null;
};

/**
 * Get display name for card art (formatted for UI)
 * @param {string} cardArtName - The card art name
 * @returns {string} - Formatted display name
 */
export const getCardDisplayName = (cardArtName) => {
  const cardData = getCardDataFromArtName(cardArtName);
  if (cardData) {
    return cardData.name;
  }
  
  // Fallback to formatted art name
  return cardArtName
    .replace(/\[face,\d+\]\.png$/i, '')
    .replace(/\.png$/i, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};



/**
 * Get all available card arts with their database status
 * @returns {Array} - Array of card art objects with metadata
 */
export const getAllCardArtsWithData = () => {
  const cardArts = [
    'ABISS', 'ANGEL', 'ASH', 'AURORA', 'AZOTH',
    'BRIGHTDUST', 'BRIGHTFULGURITE', 'BRIGHTLAHAR', 'BRIGHTLAVA', 'BRIGHTLIGHTNING',
    'BRIGHTMUD', 'BRIGHTPERMAFROST', 'BRIGHTSTEAM', 'BRIGHTTHUNDERSNOW',
    'DARKDUST', 'DARKFULGURITE', 'DARKICE', 'DARKLAHAR', 'DARKLAVA',
    'DARKLIGHTNING', 'DARKTHUNDERSNOW', 'DARKTYPHOON',
    'DUST', 'EMBERS', 'FOG', 'FROST', 'GEODE', 'GNOME', 'ICE', 'LAHAR',
    'LIGHTTYPHOON', 'LIGHTNING', 'MAGMA', 'MIASMA', 'MUD', 'NECROSIS',
    'PERMAFROST', 'RAINBOW', 'SALAMANDER', 'SYLPH', 'SMOKE', 'SOLAR',
    'STEAM', 'STORM', 'TAR', 'TYPHOON', 'UNDINE', 'CHAOS',
    'CHAOSDUST', 'CHAOSFULGURITE', 'CHAOSGNOME', 'CHAOSICE', 'CHAOSLAVA',
    'CHAOSLIGHTNING', 'CHAOSMIST', 'CHAOSMUD', 'CHAOSPERMAFROST',
    'CHAOSSALAMANDER', 'CHAOSSYLPH', 'CHAOSSTEAM', 'CHAOSTHUNDERSNOW',
    'CHAOSUNDINE', 'SHADE', 'FLAG'
  ];
  
  return cardArts.map(artName => ({
    artName,
    displayName: getCardDisplayName(artName),
    cardId: getCardIdFromArtName(artName),
    cardData: getCardDataFromArtName(artName),
    hasData: hasCardData(artName),
    detailUrl: getCardDetailUrl(artName)
  }));
};

/**
 * Get card art name from card data (reverse mapping)
 * @param {object} cardData - The card data object
 * @returns {string|null} - The card art name or null if not found
 */
export const getArtNameFromCardData = (cardData) => {
  if (!cardData || !cardData.name) return null;
  
  // Convert database name to URL-safe filename format
  return cardData.name
    .replace(/Θ/g, 'TH')   // Theta
    .replace(/Γ/g, 'G')    // Gamma  
    .replace(/Φ/g, 'PH')   // Phi
    .replace(/Σ/g, 'S')    // Sigma
    .replace(/ /g, '_');   // Spaces to underscores
};

/**
 * Get card art path from card data
 * @param {object} cardData - The card data object
 * @returns {string|null} - The card art path or null if not found
 */
export const getCardArtPathFromData = (cardData) => {
  if (!cardData || !cardData.name) return null;
  
  // Special case for ΦIVE ELEMENT ΦLAG
  if (cardData.name === 'ΦIVE ELEMENT ΦLAG') {
    return '/assets/cards/FLAG.png?t=' + Date.now();
  }
  
  // Convert database name to single-word filename format
  let filename = cardData.name
    .replace(/Γ/g, 'G')     // Gamma
    .replace(/Φ/g, 'PH')    // Phi (uppercase to match new format)
    .replace(/Θ/g, 'TH')    // Theta
    .replace(/Σ/g, 'S')     // Sigma
    .replace(/\s+/g, '');   // Remove spaces (combine words)
  
  // Handle specific mappings for compound words
  const compoundMappings = {
    'BRIGTDVST': 'BRIGHTDUST',
    'BRIGTFVLGVRITE': 'BRIGHTFULGURITE',
    'BRIGTLAHAR': 'BRIGHTLAHAR',
    'BRIGTLAVA': 'BRIGHTLAVA',
    'BRIGTLIGTNING': 'BRIGHTLIGHTNING',
    'BRIGTMVD': 'BRIGHTMUD',
    'BRIGTPERMAPHROST': 'BRIGHTPERMAFROST',
    'BRIGTSTEAM': 'BRIGHTSTEAM',
    'BRIGTTHVNDERSNOVV': 'BRIGHTTHUNDERSNOW',
    'DARKDVST': 'DARKDUST',
    'DARKFVLGVRITE': 'DARKFULGURITE',
    'DARKICE': 'DARKICE',
    'DARKLAHAR': 'DARKLAHAR',
    'DARKLAVA': 'DARKLAVA',
    'DARKLIGTNING': 'DARKLIGHTNING',
    'DARKTHVNDERSNOVV': 'DARKTHUNDERSNOW',
    'DARKTIPHOON': 'DARKTYPHOON',
    'LIGHTTIPHOON': 'LIGHTTYPHOON',
    'XAOSDVST': 'CHAOSDUST',
    'XAOSFVLGVRITE': 'CHAOSFULGURITE',
    'XAOSGNOME': 'CHAOSGNOME',
    'XAOSICE': 'CHAOSICE',
    'XAOSLAVA': 'CHAOSLAVA',
    'XAOSLIGTNING': 'CHAOSLIGHTNING',
    'XAOSMIST': 'CHAOSMIST',
    'XAOSMVD': 'CHAOSMUD',
    'XAOSPERMAPHROST': 'CHAOSPERMAFROST',
    'XAOSSALAMANDER': 'CHAOSSALAMANDER',
    'XAOSSILPH': 'CHAOSSYLPH',
    'XAOSSTEAM': 'CHAOSSTEAM',
    'XAOSTHVNDERSNOVV': 'CHAOSTHUNDERSNOW',
    'XAOSVNDINE': 'CHAOSUNDINE',
    'XAOS': 'CHAOS',
    'AVRORA': 'AURORA',
    'AZOTH': 'AZOTH',
    'DVST': 'DUST',
    'LIGTNING': 'LIGHTNING',
    'MVD': 'MUD',
    'NEKROSIS': 'NECROSIS',
    'PERMAPHROST': 'PERMAFROST',
    'RAINBOVV': 'RAINBOW',
    'SADE': 'SHADE',
    'SILPH': 'SYLPH',
    'TIPHOON': 'TYPHOON',
    'VNDINE': 'UNDINE'
  };
  
  // Apply compound mapping if exists
  if (compoundMappings[filename]) {
    filename = compoundMappings[filename];
  }
  
  // Add a timestamp to prevent caching issues
  return `/assets/cards/${filename}.png?t=${Date.now()}`;
};

/**
 * Check if card data has corresponding art
 * @param {object} cardData - The card data object
 * @returns {boolean} - True if art is available
 */
export const cardDataHasArt = (cardData) => {
  return getArtNameFromCardData(cardData) !== null;
};

export default {
  getCardIdFromArtName,
  getCardDataFromArtName,
  hasCardData,
  getCardDetailUrl,
  getCardDisplayName,
  getAllCardArtsWithData,
  getArtNameFromCardData,
  getCardArtPathFromData,
  cardDataHasArt
};