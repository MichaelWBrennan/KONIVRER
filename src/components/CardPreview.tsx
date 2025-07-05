import React from 'react';
import '../styles/cardPreview.css';
import { ELEMENT_SYMBOLS } from '../engine/elementalSystem';

const CardPreview = ({ card, onClose }): any => {
  if (!card) return null;
  return (
    <div className="card-preview-overlay" onClick={onClose} />
      <div className="card-preview-container" onClick={(e) => e.stopPropagation()}>
        <div className={`card-preview ${card.type.toLowerCase()}`} />
          {/* Card header */}
          <div className="card-preview-header" />
            <div className="card-preview-name">{card.name}
            <div className="card-preview-type">{card.type}
          </div>
          
          {/* Card image placeholder */}
          <div className="card-preview-image" />
            {/* In a real implementation, this would be an actual card image */}
            <div className="card-preview-image-placeholder" />
              {card.type === 'Familiar' && (
                <div className="familiar-symbol">⚔</div>
              )}
              {card.type === 'Spell' && (
                <div className="spell-symbol">✧</div>
              )}
              {card.type === 'Flag' && (
                <div className="flag-symbol">⚑</div>
              )}
          </div>
          
          {/* Element costs */}
          <div className="card-preview-elements" />
            {Object.entries(card.elements || {}).map(([element, count]) => (
              count > 0 && (
                <div key={element} className={`element-cost ${element}`} />
                  {ELEMENT_SYMBOLS[element]} {count}
              )
            ))}
          </div>
          
          {/* Card abilities */}
          <div className="card-preview-abilities" />
            {card.abilities && card.abilities.map((ability, index) => (
              <div key={index} className="card-preview-ability" />
                {ability.effect}
            ))}
          </div>
          
          {/* Flavor text */}
          {card.flavorText && (
            <div className="card-preview-flavor">{card.flavorText}
          )}
          {/* Card footer */}
          <div className="card-preview-footer" />
            <div className="card-preview-set-info" />
              {card.set && card.rarity && `${card.set} • ${getRaritySymbol(card.rarity)}`}
            </div>
            
            {card.type === 'Familiar' && (
              <div className="card-preview-stats" />
                <span className="card-preview-strength">{card.strength}
                <span className="card-preview-separator">/</span>
                <span className="card-preview-health">{card.health}
              </div>
            )}
          </div>
        
        <button className="card-preview-close" onClick={onClose}>Close</button>
    </div>
  );
};

// Helper to get rarity symbol
function getRaritySymbol(): any {
  const symbols = {
    common: '🜠',
    uncommon: '☽',
    rare: '☉'
  };
  
  return symbols[rarity] || '';
}

export default CardPreview;