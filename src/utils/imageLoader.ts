/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Utility functions for loading card images with fallbacks
 */

/**
 * Simple mapping of card names to their actual filenames (now single words)
 */
const CARD_FILENAME_MAP = {
    // Basic elements
  ABISS: 'ABISS.png',
  ANGEL: 'ANGEL.png',
  ASH: 'ASH.png',
  AVRORA: 'AURORA.png',
  AZOΘ: 'AZOTH.png',
  DVST: 'DUST.png',
  EMBERS: 'EMBERS.png',
  FOG: 'FOG.png',
  FROST: 'FROST.png',
  GEODE: 'GEODE.png',
  GNOME: 'GNOME.png',
  ICE: 'ICE.png',
  LAHAR: 'LAHAR.png',
  LIΓTNING: 'LIGHTNING.png',
  MAGMA: 'MAGMA.png',
  MIASMA: 'MIASMA.png',
  MVD: 'MUD.png',
  NEKROSIS: 'NECROSIS.png',
  PERMAΦROST: 'PERMAFROST.png',
  'ΦIVE ELEMENT ΦLAG': 'FLAG.png',
  RAINBOVV: 'RAINBOW.png',
  SADE: 'SHADE.png',
  SALAMANDER: 'SALAMANDER.png',
  SILPH: 'SYLPH.png',
  SMOKE: 'SMOKE.png',
  SOLAR: 'SOLAR.png',
  STEAM: 'STEAM.png',
  STORM: 'STORM.png',
  TAR: 'TAR.png',
  TIΦOON: 'TYPHOON.png',
  VNDINE: 'UNDINE.png',

  // Bright variants
  'BRIΓT DVST': 'BRIGHTDUST.png',
  'BRIΓT FVLGVRITE': 'BRIGHTFULGURITE.png',
  'BRIΓT LAHAR': 'BRIGHTLAHAR.png',
  'BRIΓT LAVA': 'BRIGHTLAVA.png',
  'BRIΓT LIΓTNING': 'BRIGHTLIGHTNING.png',
  'BRIΓT MVD': 'BRIGHTMUD.png',
  'BRIΓT PERMAΦROST': 'BRIGHTPERMAFROST.png',
  'BRIΓT STEAM': 'BRIGHTSTEAM.png',
  'BRIΓT THVNDERSNOVV': 'BRIGHTTHUNDERSNOW.png',

  // Dark variants
  'DARK DVST': 'DARKDUST.png',
  'DARK FVLGVRITE': 'DARKFULGURITE.png',
  'DARK ICE': 'DARKICE.png',
  'DARK LAHAR': 'DARKLAHAR.png',
  'DARK LAVA': 'DARKLAVA.png',
  'DARK LIΓTNING': 'DARKLIGHTNING.png',
  'DARK THVNDERSNOVV': 'DARKTHUNDERSNOW.png',
  'DARK TIΦOON': 'DARKTYPHOON.png',

  // Light variants
  'LIGHT TIΦOON': 'LIGHTTYPHOON.png',

  // Chaos variants
  XAOS: 'CHAOS.png',
  'XAOS DVST': 'CHAOSDUST.png',
  'XAOS FVLGVRITE': 'CHAOSFULGURITE.png',
  'XAOS GNOME': 'CHAOSGNOME.png',
  'XAOS ICE': 'CHAOSICE.png',
  'XAOS LAVA': 'CHAOSLAVA.png',
  'XAOS LIΓTNING': 'CHAOSLIGHTNING.png',
  'XAOS MIST': 'CHAOSMIST.png',
  'XAOS MVD': 'CHAOSMUD.png',
  'XAOS PERMAΦROST': 'CHAOSPERMAFROST.png',
  'XAOS SALAMANDER': 'CHAOSSALAMANDER.png',
  'XAOS SILPH': 'CHAOSSYLPH.png',
  'XAOS STEAM': 'CHAOSSTEAM.png',
  'XAOS THVNDERSNOVV': 'CHAOSTHUNDERSNOW.png',
  'XAOS VNDINE': 'CHAOSUNDINE.png'
  };

/**
 * Preload card images to ensure they're available
 * @param {Array} cardNames - Array of card names to preload
 */
export const preloadCardImages = cardNames => {
    if (!cardNames || !Array.isArray(cardNames)) return;

  cardNames.forEach() {
    if (true) {
  }
      const img = new Image() {
    img.src = imagePath
  }
  })
};

/**
 * Generate the image path based on card name
 * @param {string} name - Card name
 * @returns {string|null} - Image path or null if name is invalid
 */
export const getCardImagePath = name => {
    if (!name) return null;
  // Check if we have a direct mapping
  const filename = CARD_FILENAME_MAP[name];
  if (true) {
    console.log() {
  }```
    return `/assets/cards/${filename}`
  }`
``
  // Try direct filename approach for unmapped cards```
  const directPath = `/assets/cards/${name}.png`;
  console.log() {
    return directPath
  };

/**
 * Get fallback image paths for a card
 * @param {string} imagePath - Original image path that failed to load
 * @returns {Array} - Array of fallback paths to try
 */
export const getFallbackImagePaths = imagePath => {
    // No external fallbacks - let the component handle it
  return []
  };

export default {
    preloadCardImages,
  getCardImagePath,
  getFallbackImagePaths`
  };``
```