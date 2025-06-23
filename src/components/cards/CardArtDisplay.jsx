import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * CardArtDisplay - Component to display KONIVRER card arts
 * 
 * This component demonstrates how to use the card art assets
 * that were added to public/assets/cards/
 */
const CardArtDisplay = ({ cardName, className = '', showFallback = true }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate the image path based on card name
  const getCardImagePath = (name) => {
    // Most cards follow the pattern: CARDNAME[face,1].png
    // Special case for the flag card which is [face,6]
    const suffix = name === 'PhVE_ELEMENT_PhLAG' ? '[face,6].png' : '[face,1].png';
    return `/assets/cards/${name}${suffix}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Fallback placeholder when image fails to load
  const FallbackCard = () => (
    <div className={`bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-center p-4 ${className}`}>
      <div>
        <div className="text-lg mb-2">KONIVRER</div>
        <div className="text-sm opacity-75">{cardName}</div>
      </div>
    </div>
  );

  if (imageError && !showFallback) {
    return null;
  }

  if (imageError) {
    return <FallbackCard />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: imageLoaded ? 1 : 0.5, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      <img
        src={getCardImagePath(cardName)}
        alt={`${cardName} card art`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
      )}
    </motion.div>
  );
};

/**
 * CardArtGallery - Component to display multiple card arts
 */
export const CardArtGallery = ({ cards = [], columns = 4 }) => {
  // Available card names from the extracted assets
  const availableCards = [
    'ABISS', 'ANGEL', 'ASH', 'AVRORA', 'AZOTH',
    'BRIGT_DVST', 'BRIGT_FVLGVRITE', 'BRIGT_LAHAR', 'BRIGT_LAVA', 'BRIGT_LIGTNING',
    'BRIGT_MVD', 'BRIGT_PERMAPhROST', 'BRIGT_STEAM', 'BRIGT_THVNDERSNOVV',
    'DARK_DVST', 'DARK_FVLGVRITE', 'DARK_ICE', 'DARK_LAHAR', 'DARK_LAVA',
    'DARK_LIGTNING', 'DARK_THVNDERSNOVV', 'DARK_TIPhOON',
    'DVST', 'EMBERS', 'FOG', 'FROST', 'GEODE', 'GNOME', 'ICE', 'LAHAR',
    'LIGHT_TIPhOON', 'LIGTNING', 'MAGMA', 'MIASMA', 'MVD', 'NEKROSIS',
    'PERMAPhROST', 'RAINBOVV', 'SALAMANDER', 'SILPh', 'SMOKE', 'SOLAR_',
    'STEAM', 'STORM', 'TAR', 'TIPhOON', 'VNDINE', 'XAOS',
    'XAOS_DVST', 'XAOS_FVLGVRITE', 'XAOS_GNOME', 'XAOS_ICE', 'XAOS_LAVA',
    'XAOS_LIGTNING', 'XAOS_MIST', 'XAOS_MVD', 'XAOS_PERMAPhROST',
    'XAOS_SALAMANDER', 'XAOS_SILPh', 'XAOS_STEAM', 'XAOS_THVNDERSNOVV',
    'XAOS_VNDINE', 'SADE', 'PhVE_ELEMENT_PhLAG'
  ];

  const cardsToDisplay = cards.length > 0 ? cards : availableCards.slice(0, 12);

  return (
    <div className={`grid grid-cols-${columns} gap-4 p-4`}>
      {cardsToDisplay.map((cardName, index) => (
        <motion.div
          key={cardName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="group cursor-pointer"
        >
          <CardArtDisplay
            cardName={cardName}
            className="aspect-[3/4] group-hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
          />
          <div className="mt-2 text-center text-sm text-gray-300 group-hover:text-white transition-colors">
            {cardName.replace(/_/g, ' ')}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * CardArtPreview - Component for previewing a single card with details
 */
export const CardArtPreview = ({ cardName, showDetails = true }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
      <CardArtDisplay
        cardName={cardName}
        className="aspect-[3/4] mb-4 shadow-2xl"
      />
      
      {showDetails && (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            {cardName.replace(/_/g, ' ')}
          </h3>
          <div className="text-sm text-gray-400">
            KONIVRER Card Art
          </div>
        </div>
      )}
    </div>
  );
};

export default CardArtDisplay;