/**
 * Utility functions for loading card images with fallbacks
 */

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
  
  // Convert card name to ASCII filename format
  let filename = name
    // Convert Greek letters to ASCII equivalents
    .replace(/Γ/g, 'G')
    .replace(/Φ/g, 'Ph')
    .replace(/Θ/g, 'TH')
    .replace(/Σ/g, 'S')
    // Replace spaces with underscores for variant cards
    .replace(/\s+/g, '_');
  
  // Special case for ΦIVE ELEMENT ΦLAG which uses _face_6.png and Ph format
  if (name === 'ΦIVE ELEMENT ΦLAG') {
    filename = 'PhVE_ELEMENT_PhLAG';
    return `/assets/cards/${filename}_face_6.png?t=${Date.now()}`;
  }
  
  // Handle specific filename corrections for production environment
  if (filename.includes('PERMAPHROST')) {
    filename = filename.replace('PERMAPHROST', 'PERMAPhROST');
  }
  
  if (filename.includes('TIPHOON')) {
    filename = filename.replace('TIPHOON', 'TIPhOON');
  }
  
  if (filename.includes('SILPH')) {
    filename = filename.replace('SILPH', 'SILPh');
  }
  
  // Create the path with the corrected filename
  return `/assets/cards/${filename}_face_1.png?t=${Date.now()}`;
};

/**
 * Get fallback image paths for a card
 * @param {string} imagePath - Original image path that failed to load
 * @returns {Array} - Array of fallback paths to try
 */
export const getFallbackImagePaths = (imagePath) => {
  if (!imagePath) return [];
  
  const fallbacks = [];
  
  // Remove query params
  const cleanPath = imagePath.split('?')[0];
  
  // Extract filename without face number and extension
  const pathParts = cleanPath.split('/');
  const filename = pathParts[pathParts.length - 1].split('_face_')[0];
  
  // Try lowercase version
  const lowercaseFilename = filename.toLowerCase();
  if (filename !== lowercaseFilename) {
    fallbacks.push(`/assets/cards/${lowercaseFilename}_face_1.png?t=${Date.now()}`);
  }
  
  // Try with different face numbers
  for (let i = 1; i <= 6; i++) {
    if (!cleanPath.includes(`_face_${i}.png`)) {
      fallbacks.push(`/assets/cards/${filename}_face_${i}.png?t=${Date.now()}`);
    }
  }
  
  // Try with different case combinations for special characters
  if (filename.includes('Ph')) {
    fallbacks.push(`/assets/cards/${filename.replace('Ph', 'PH')}_face_1.png?t=${Date.now()}`);
    fallbacks.push(`/assets/cards/${filename.replace('Ph', 'ph')}_face_1.png?t=${Date.now()}`);
  }
  
  if (filename.includes('TH')) {
    fallbacks.push(`/assets/cards/${filename.replace('TH', 'Th')}_face_1.png?t=${Date.now()}`);
    fallbacks.push(`/assets/cards/${filename.replace('TH', 'th')}_face_1.png?t=${Date.now()}`);
  }
  
  // Try with PHIVE instead of PhVE for the special flag card
  if (filename.includes('PhVE_ELEMENT_PhLAG')) {
    fallbacks.push(`/assets/cards/PHIVE_ELEMENT_PHLAG_face_1.png?t=${Date.now()}`);
    fallbacks.push(`/assets/cards/PHIVE_ELEMENT_PHLAG_face_6.png?t=${Date.now()}`);
    fallbacks.push(`/assets/cards/phive_element_phlag_face_1.png?t=${Date.now()}`);
    fallbacks.push(`/assets/cards/phive_element_phlag_face_6.png?t=${Date.now()}`);
  }
  
  return fallbacks;
};

export default {
  preloadCardImages,
  getCardImagePath,
  getFallbackImagePaths
};