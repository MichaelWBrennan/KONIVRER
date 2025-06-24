import React from 'react';

const ImageTest = () => {
  const testCards = [
    "ΦIVE ELEMENT ΦLAG",
    "ABISS", 
    "AZOΘ",
    "BRIΓT DVST",
    "BRIΓT FVLGVRITE"
  ];

  const getCardImagePath = (name) => {
    if (!name) return null;
    
    let filename = name
      .replace(/Γ/g, 'G')
      .replace(/Φ/g, 'Ph')
      .replace(/Θ/g, 'TH')
      .replace(/Σ/g, 'S')
      .replace(/\s+/g, '_');
    
    if (name === 'ΦIVE ELEMENT ΦLAG') {
      filename = 'PhVE_ELEMENT_PhLAG';
      return `/assets/cards/${filename}_face_6.png`;
    }
    
    return `/assets/cards/${filename}_face_1.png`;
  };

  return (
    <div className="p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      <p className="mb-4">Deployment timestamp: {new Date().toISOString()}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testCards.map((cardName) => {
          const imagePath = getCardImagePath(cardName);
          return (
            <div key={cardName} className="border border-gray-600 p-4 rounded">
              <h3 className="font-bold mb-2">{cardName}</h3>
              <p className="text-sm text-gray-400 mb-2">Path: {imagePath}</p>
              <img 
                src={imagePath}
                alt={cardName}
                className="w-full h-48 object-cover rounded"
                onLoad={() => console.log(`✅ Loaded: ${cardName} -> ${imagePath}`)}
                onError={(e) => console.error(`❌ Failed: ${cardName} -> ${imagePath}`, e)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageTest;