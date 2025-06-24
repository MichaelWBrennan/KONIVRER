import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Eye } from 'lucide-react';
import { getCardDetailUrl, hasCardData, getCardDisplayName } from '../../utils/cardArtMapping';
import { getCardImagePath, getFallbackImagePaths } from '../../utils/imageLoader';

/**
 * CardArtDisplay - Component to display KONIVRER card arts
 * 
 * This component demonstrates how to use the card art assets
 * that were added to public/assets/cards/
 */
const CardArtDisplay = ({ 
  cardName, 
  className = '', 
  showFallback = true, 
  clickable = true,
  showCardInfo = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  // Get card information
  const detailUrl = getCardDetailUrl(cardName);
  const hasData = hasCardData(cardName);
  const displayName = getCardDisplayName(cardName);
  
  // Set up the image source when the component mounts or cardName changes
  useEffect(() => {
    if (cardName) {
      setImageSrc(getCardImagePath(cardName));
      setImageError(false);
      setImageLoaded(false);
      setFallbackAttempted(false);
    }
  }, [cardName]);

  const handleImageError = (e) => {
    console.error(`CardArtDisplay: Image failed to load for ${cardName}:`, e.target.src);
    
    // Try to fetch the image directly to get more error information
    fetch(e.target.src)
      .then(response => {
        if (!response.ok) {
          console.error(`Image fetch failed with status: ${response.status} ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error('Image fetch error:', error);
      });
    
    // Try alternative paths if this is the first error
    if (!fallbackAttempted) {
      setFallbackAttempted(true);
      
      // Get all fallback paths to try
      const fallbackPaths = getFallbackImagePaths(e.target.src);
      
      if (fallbackPaths.length > 0) {
        // Try the first fallback path
        const fallbackPath = fallbackPaths[0];
        console.log(`Trying fallback: ${fallbackPath}`);
        
        // Store the remaining fallbacks in a data attribute for future attempts
        e.target.dataset.fallbacks = JSON.stringify(fallbackPaths.slice(1));
        
        setImageSrc(fallbackPath);
        return;
      }
      
      // Special case for ΦIVE ELEMENT ΦLAG
      if (cardName === 'ΦIVE ELEMENT ΦLAG') {
        const specialFallback = `/assets/cards/PHIVE_ELEMENT_PHLAG_face_6.png?t=${Date.now()}`;
        console.log(`Trying special fallback for ΦIVE ELEMENT ΦLAG: ${specialFallback}`);
        setImageSrc(specialFallback);
        return;
      }
    } else {
      // Check if we have more fallbacks to try
      try {
        const remainingFallbacks = JSON.parse(e.target.dataset.fallbacks || '[]');
        
        if (remainingFallbacks.length > 0) {
          // Try the next fallback
          const nextFallback = remainingFallbacks.shift();
          console.log(`Trying next fallback: ${nextFallback}`);
          
          // Update the remaining fallbacks
          e.target.dataset.fallbacks = JSON.stringify(remainingFallbacks);
          
          setImageSrc(nextFallback);
          return;
        }
      } catch (error) {
        console.error('Error parsing fallbacks:', error);
      }
    }
    
    // If we've exhausted all fallbacks, show the error state
    setImageError(true);
  };

  const handleImageLoad = (e) => {
    setImageLoaded(true);
  };

  // Fallback placeholder when image fails to load
  const FallbackCard = () => (
    <div className={`bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-center p-4 ${className}`}>
      <div>
        <div className="text-lg mb-2">KONIVRER</div>
        <div className="text-sm opacity-75">{displayName}</div>
      </div>
    </div>
  );

  if (imageError && !showFallback) {
    return null;
  }

  if (imageError) {
    return clickable && hasData && detailUrl ? (
      <Link to={detailUrl}>
        <FallbackCard />
      </Link>
    ) : (
      <FallbackCard />
    );
  }

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: imageLoaded ? 1 : 0.5, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-lg ${className} ${
        clickable && hasData ? 'cursor-pointer' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageSrc}
        alt={`${displayName} card art`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className="w-full h-full object-cover transition-transform duration-300"
        loading="lazy"
      />
      
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
      )}

      {/* Hover overlay for clickable cards */}
      {clickable && hasData && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <div className="text-white text-center">
            <Eye className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">View Details</div>
          </div>
        </motion.div>
      )}

      {/* Card info overlay */}
      {showCardInfo && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="text-white">
            <div className="font-bold text-sm">{displayName}</div>
            {hasData && (
              <div className="flex items-center space-x-1 text-xs text-green-400">
                <ExternalLink className="w-3 h-3" />
                <span>View Details</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Indicator for cards without data */}
      {!hasData && showCardInfo && (
        <div className="absolute top-2 right-2">
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
            Art Only
          </div>
        </div>
      )}
    </motion.div>
  );

  // Wrap with Link if clickable and has data
  if (clickable && hasData && detailUrl) {
    return (
      <Link to={detailUrl} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

/**
 * CardArtGallery - Component to display multiple card arts
 */
export const CardArtGallery = ({ 
  cards = [], 
  columns = 4, 
  showCardInfo = false,
  clickable = true 
}) => {
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
      {cardsToDisplay.map((cardName, index) => {
        const displayName = getCardDisplayName(cardName);
        const hasData = hasCardData(cardName);
        
        return (
          <motion.div
            key={cardName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <CardArtDisplay
              cardName={cardName}
              className="aspect-[3/4] group-hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
              showCardInfo={showCardInfo}
              clickable={clickable}
            />
            <div className="mt-2 text-center">
              <div className={`text-sm transition-colors ${
                hasData && clickable 
                  ? 'text-gray-300 group-hover:text-white' 
                  : 'text-gray-400'
              }`}>
                {displayName}
              </div>
              {hasData && (
                <div className="text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view details
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * CardArtPreview - Component for previewing a single card with details
 */
export const CardArtPreview = ({ cardName, showDetails = true, clickable = true }) => {
  const displayName = getCardDisplayName(cardName);
  const hasData = hasCardData(cardName);
  const detailUrl = getCardDetailUrl(cardName);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
      <CardArtDisplay
        cardName={cardName}
        className="aspect-[3/4] mb-4 shadow-2xl"
        clickable={clickable}
        showCardInfo={false}
      />
      
      {showDetails && (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            {displayName}
          </h3>
          <div className="text-sm text-gray-400 mb-3">
            KONIVRER Card Art
          </div>
          
          {hasData && clickable && detailUrl && (
            <Link 
              to={detailUrl}
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Card Details</span>
            </Link>
          )}
          
          {!hasData && (
            <div className="text-yellow-400 text-sm">
              Card art only - No database entry available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardArtDisplay;