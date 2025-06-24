/**
 * Utility functions for loading card images with fallbacks
 */

/**
 * Simple mapping of card names to their actual filenames
 */
const CARD_FILENAME_MAP = {
  'ΦIVE ELEMENT ΦLAG': 'PHIVE_ELEMENT_PHLAG_face_1.png',
  'ABISS': 'ABISS_face_1.png',
  'ANGEL': 'ANGEL_face_1.png',
  'ASH': 'ASH_face_1.png',
  'AVRORA': 'AVRORA_face_1.png',
  'AZOΘ': 'AZOTH_face_1.png',
  'BRIΓT DVST': 'BRIGT_DVST_face_1.png',
  'BRIΓT FVLGVRITE': 'BRIGT_FVLGVRITE_face_1.png',
  'BRIΓT LAHAR': 'BRIGT_LAHAR_face_1.png',
  'BRIΓT LAVA': 'BRIGT_LAVA_face_1.png',
  'BRIΓT LIΓTNING': 'BRIGT_LIGTNING_face_1.png',
  'BRIΓT MVD': 'BRIGT_MVD_face_1.png',
  'BRIΓT PERMAΦROST': 'BRIGT_PERMAPhROST_face_1.png',
  'BRIΓT STEAM': 'BRIGT_STEAM_face_1.png',
  'BRIΓT THVNDERSNOVV': 'BRIGT_THVNDERSNOVV_face_1.png',
  'DARK DVST': 'DARK_DVST_face_1.png',
  'DARK FVLGVRITE': 'DARK_FVLGVRITE_face_1.png',
  'DARK ICE': 'DARK_ICE_face_1.png',
  'DARK LAHAR': 'DARK_LAHAR_face_1.png',
  'DARK LAVA': 'DARK_LAVA_face_1.png',
  'DARK LIΓTNING': 'DARK_LIGTNING_face_1.png',
  'DARK THVNDERSNOVV': 'DARK_THVNDERSNOVV_face_1.png',
  'FROST': 'FROST_face_1.png'
};

/**
 * Preload card images to ensure they're available
 * @param {Array} cardNames - Array of card names to preload
 */
export const preloadCardImages = (cardNames) => {
  if (!cardNames || !Array.isArray(cardNames)) return;
  
  cardNames.forEach(cardName => {
    const imagePath = getCardImagePath(cardName);
    if (imagePath) {
      const img = new Image();
      img.src = imagePath;
    }
  });
};

/**
 * Generate the image path based on card name
 * @param {string} name - Card name
 * @returns {string|null} - Image path or null if name is invalid
 */
export const getCardImagePath = (name) => {
  if (!name) return null;
  
  // Check if we have a direct mapping
  const filename = CARD_FILENAME_MAP[name];
  if (filename) {
    return `/assets/cards/${filename}`;
  }
  
  // Return null for unmapped cards - let the component handle the fallback
  console.log(`🚫 imageLoader: No mapping found for card: "${name}", will use CSS fallback`);
  return null;
};

/**
 * Get fallback image paths for a card
 * @param {string} imagePath - Original image path that failed to load
 * @returns {Array} - Array of fallback paths to try
 */
export const getFallbackImagePaths = (imagePath) => {
  // No external fallbacks - let the component handle it
  return [];
};

export default {
  preloadCardImages,
  getCardImagePath,
  getFallbackImagePaths
};