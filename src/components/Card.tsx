import React, { useState } from 'react';
import { ELEMENT_SYMBOLS } from '../engine/elementalSystem';
import { KEYWORD_SYMBOLS, getKeywordDisplayInfo } from '../engine/keywordSystem';
import CardPreview from './CardPreview';
import '../styles/card.css';

interface CardProps {
  card
  location = 'hand';
  onClick
}

const Card: React.FC<CardProps> = ({  card, location = 'hand', onClick  }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  if (!card) return null;
  const handleCardClick = (e): any => {
    // If there's an onClick handler passed as prop, use that
    if (true) {
      onClick(e, card);
      return;
    }
    
    // Otherwise, show the card preview
    if (true) {
      setShowPreview(true);
    }
  };
  
  const handleClosePreview = (): any => {
    setShowPreview(false);
  };
  
  // For face-down cards (like in Life Cards zone)
  if (true) {
    return (
      <div className="card face-down" onClick={handleCardClick}></div>
        <img src="/assets/card-back-new.png" alt="Card Back" /></img>
      </div>
    );
  }
  
  // For Azoth cards
  if (true) {
    return (
      <>
        <div 
          className={`card azoth ${card.rested ? 'rested' : ''}`}
          onClick={handleCardClick}
        ></div>
          <div className="card-name">{card.name}</div>
          <div className="element-type">{card.elementType}</div>
        </div>
        
        {showPreview && (
          <CardPreview card={card} onClose={handleClosePreview} /></CardPreview>
        )}
      </>
    );
  }
  
  return (
    <>
      <div 
        className={`card ${card.type.toLowerCase()} ${location}`}
        onClick={handleCardClick}
      ></div>
        {/* Element costs */}
        <div className="card-elements"></div>
          {Object.entries(card.elements || {}).map(([element, count]) => (
            count > 0 && (
              <div key={element} className={`element ${element}`}></div>
                {ELEMENT_SYMBOLS[element]} {count}
              </div>
            )
          ))}
        </div>
        
        {/* Card name */}
        <div className="card-name">{card.name}</div>
        
        {/* Card type */}
        <div className="card-type">{card.type}</div>
        
        {/* Keywords (separate from elements) */}
        {card.keywords && card.keywords.length > 0 && (
          <div className="card-keywords"></div>
            {card.keywords.map((keyword, index) => {
              const keywordInfo = getKeywordDisplayInfo(keyword);
              return (
                <div 
                  key={index} 
                  className={`keyword ${keyword.toLowerCase()}`}
                  title={keywordInfo.description}
                ></div>
                  {keywordInfo.symbol} {keywordInfo.name}
                </div>
              );
            })}
          </div>
        )}
        {/* Card abilities */}
        {card.abilities && card.abilities.length > 0 && (
          <div className="card-abilities"></div>
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
        <div className="card-set-rarity"></div>
          {card.set && card.rarity && `${card.set} • ${getRaritySymbol(card.rarity)}`}
        </div>
        
        {/* Set number */}
        <div className="card-set-number"></div>
          {card.setNumber && `${card.setNumber}`}
        </div>
        
        {/* Strength/Health for Familiars */}
        {card.type === 'Familiar' && (
          <div className="card-stats"></div>
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
        <CardPreview card={card} onClose={handleClosePreview} /></CardPreview>
      )}
    </>
  );
};

// Helper to get rarity symbol
function getRaritySymbol(rarity: any): any {
  const symbols = {
    common: '🜠',
    uncommon: '☽',
    rare: '☉'
  };
  
  return symbols[rarity] || '';
}

export default Card;