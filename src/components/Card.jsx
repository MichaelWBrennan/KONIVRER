import React, { useState } from 'react';
import { ELEMENT_SYMBOLS } from '../engine/elementalSystem';
import CardPreview from './CardPreview';
import '../styles/card.css';

const Card = ({ card, location = 'hand', onClick }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  if (!card) return null;
  
  const handleCardClick = (e) => {
    // If there's an onClick handler passed as prop, use that
    if (onClick) {
      onClick(e, card);
      return;
    }
    
    // Otherwise, show the card preview
    if (location !== 'lifeCards' && !card.faceDown) {
      setShowPreview(true);
    }
  };
  
  const handleClosePreview = () => {
    setShowPreview(false);
  };
  
  // For face-down cards (like in Life Cards zone)
  if (location === 'lifeCards' || card.faceDown) {
    return (
      <div className="card face-down" onClick={handleCardClick}>
        <img src="/assets/card-back-new.png" alt="Card Back" />
      </div>
    );
  }
  
  // For Azoth cards
  if (location === 'azoth') {
    return (
      <>
        <div 
          className={`card azoth ${card.rested ? 'rested' : ''}`}
          onClick={handleCardClick}
        >
          <div className="card-name">{card.name}</div>
          <div className="element-type">{card.elementType}</div>
        </div>
        
        {showPreview && (
          <CardPreview card={card} onClose={handleClosePreview} />
        )}
      </>
    );
  }
  
  return (
    <>
      <div 
        className={`card ${card.type.toLowerCase()} ${location}`}
        onClick={handleCardClick}
      >
        {/* Element costs */}
        <div className="card-elements">
          {Object.entries(card.elements || {}).map(([element, count]) => (
            count > 0 && (
              <div key={element} className={`element ${element}`}>
                {ELEMENT_SYMBOLS[element]} {count}
              </div>
            )
          ))}
        </div>
        
        {/* Card name */}
        <div className="card-name">{card.name}</div>
        
        {/* Card type */}
        <div className="card-type">{card.type}</div>
        
        {/* Card abilities */}
        {card.abilities && card.abilities.length > 0 && (
          <div className="card-abilities">
            {card.abilities.map((ability, index) => (
              <div key={index} className="ability">{ability.effect}</div>
            ))}
          </div>
        )}
        
        {/* Flavor text */}
        {card.flavorText && (
          <div className="flavor-text">{card.flavorText}</div>
        )}
        
        {/* Set and rarity */}
        <div className="card-set-rarity">
          {card.set && card.rarity && `${card.set} • ${getRaritySymbol(card.rarity)}`}
        </div>
        
        {/* Set number */}
        <div className="card-set-number">
          {card.setNumber && `${card.setNumber}`}
        </div>
        
        {/* Strength/Health for Familiars */}
        {card.type === 'Familiar' && (
          <div className="card-stats">
            <span className="strength">{card.strength}</span>
            <span className="separator">/</span>
            <span className="health">{card.health}</span>
          </div>
        )}
        
        {/* Status indicators */}
        {card.summoningSickness && location === 'field' && (
          <div className="status-indicator summoning-sickness">New</div>
        )}
        
        {card.tapped && location === 'field' && (
          <div className="status-indicator tapped">Tapped</div>
        )}
        
        {card.counters > 0 && location === 'field' && (
          <div className="counter-indicator">+{card.counters}</div>
        )}
      </div>
      
      {showPreview && (
        <CardPreview card={card} onClose={handleClosePreview} />
      )}
    </>
  );
};

// Helper to get rarity symbol
function getRaritySymbol(rarity) {
  const symbols = {
    common: '🜠',
    uncommon: '☽',
    rare: '☉'
  };
  
  return symbols[rarity] || '';
}

export default Card;