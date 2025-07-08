import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Card {
  id: string; name: string; cost: number; type: 'Familiar' | 'Flag';
  description: string; rarity: 'Common' | 'Uncommon' | 'Rare';
  elements: string[]; keywords: string[]; strength?: number; artist?: string;
}

interface SyntaxAdvancedSearchProps {
  cards: Card[];
  onSearchResults: (results: Card[]) => void;
}

const SyntaxAdvancedSearch: React.FC<SyntaxAdvancedSearchProps> = ({ cards, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  // Parse search syntax and filter cards
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return cards;
    }

    const query = searchQuery.toLowerCase().trim();
    
    // Split by spaces but keep quoted strings together
    const tokens = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    
    return cards.filter(card => {
      return tokens.every(token => {
        // Remove quotes if present
        const cleanToken = token.replace(/"/g, '');
        
        // Check for syntax patterns
        if (cleanToken.includes(':')) {
          const [field, value] = cleanToken.split(':', 2);
          
          switch (field) {
            case 'name':
            case 'n':
              return card.name.toLowerCase().includes(value);
            
            case 'cost':
            case 'c':
              if (value.startsWith('>=')) return card.cost >= parseInt(value.slice(2));
              if (value.startsWith('<=')) return card.cost <= parseInt(value.slice(2));
              if (value.startsWith('>')) return card.cost > parseInt(value.slice(1));
              if (value.startsWith('<')) return card.cost < parseInt(value.slice(1));
              return card.cost === parseInt(value);
            
            case 'type':
            case 't':
              return card.type.toLowerCase().includes(value);
            
            case 'rarity':
            case 'r':
              return card.rarity.toLowerCase().includes(value);
            
            case 'element':
            case 'e':
              return card.elements.some(el => el.toLowerCase().includes(value));
            
            case 'keyword':
            case 'k':
              return card.keywords.some(kw => kw.toLowerCase().includes(value));
            
            case 'artist':
            case 'a':
              return card.artist?.toLowerCase().includes(value) || false;
            
            case 'description':
            case 'desc':
            case 'd':
              return card.description.toLowerCase().includes(value);
            
            default:
              return false;
          }
        } else {
          // General search across name, description, and keywords
          return (
            card.name.toLowerCase().includes(cleanToken) ||
            card.description.toLowerCase().includes(cleanToken) ||
            card.keywords.some(kw => kw.toLowerCase().includes(cleanToken)) ||
            card.elements.some(el => el.toLowerCase().includes(cleanToken))
          );
        }
      });
    });
  }, [cards, searchQuery]);

  // Update results when search changes
  React.useEffect(() => {
    onSearchResults(searchResults);
  }, [searchResults, onSearchResults]);

  const syntaxGuide = [
    { syntax: 'name:dragon', description: 'Cards with "dragon" in the name' },
    { syntax: 'n:fire', description: 'Short form: cards with "fire" in name' },
    { syntax: 'cost:3', description: 'Cards with cost exactly 3' },
    { syntax: 'c:>=5', description: 'Cards with cost 5 or higher' },
    { syntax: 'c:<4', description: 'Cards with cost less than 4' },
    { syntax: 'type:familiar', description: 'Only Familiar cards' },
    { syntax: 't:flag', description: 'Only Flag cards' },
    { syntax: 'rarity:rare', description: 'Only Rare cards' },
    { syntax: 'r:common', description: 'Only Common cards' },
    { syntax: 'element:fire', description: 'Cards with Fire element' },
    { syntax: 'e:water', description: 'Cards with Water element' },
    { syntax: 'keyword:flying', description: 'Cards with Flying keyword' },
    { syntax: 'k:defensive', description: 'Cards with Defensive keyword' },
    { syntax: 'artist:elena', description: 'Cards by artist Elena' },
    { syntax: 'desc:mystical', description: 'Cards with "mystical" in description' },
    { syntax: 'flying fire', description: 'Cards containing both "flying" and "fire"' },
    { syntax: '"fire drake"', description: 'Exact phrase search' }
  ];

  return (
    <div className="syntax-search-container">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '20px' }}
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards... (e.g., name:dragon cost:>=3 element:fire)"
            style={{
              width: '100%',
              padding: '15px 50px 15px 20px',
              fontSize: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '12px',
              color: '#fff',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
          
          {/* Help Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGuide(!showGuide)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#d4af37',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ?
          </motion.button>
        </div>
        
        {/* Results Count */}
        <div style={{ 
          color: '#ccc', 
          fontSize: '14px', 
          marginTop: '10px',
          textAlign: 'center'
        }}>
          Showing {searchResults.length} of {cards.length} cards
        </div>
      </motion.div>

      {/* Syntax Guide */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ color: '#d4af37', margin: '0 0 15px 0', fontSize: '18px' }}>
            Search Syntax Guide
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '10px' 
          }}>
            {syntaxGuide.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: index < syntaxGuide.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}>
                <code style={{ 
                  color: '#d4af37', 
                  background: 'rgba(212, 175, 55, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}>
                  {item.syntax}
                </code>
                <span style={{ color: '#ccc', fontSize: '13px', marginLeft: '10px' }}>
                  {item.description}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#ccc'
          }}>
            <strong style={{ color: '#d4af37' }}>Tips:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px', listStyle: 'none' }}>
              <li>• Combine multiple criteria with spaces</li>
              <li>• Use quotes for exact phrases</li>
              <li>• Use comparison operators: &gt;, &lt;, &gt;=, &lt;=</li>
              <li>• Short forms available: n: (name), c: (cost), t: (type), r: (rarity), e: (element), k: (keyword)</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Cards Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px' 
        }}
      >
        {searchResults.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3 style={{ color: '#d4af37', margin: 0, fontSize: '18px' }}>{card.name}</h3>
              <span style={{ 
                color: card.rarity === 'Rare' ? '#3a86ff' : 
                       card.rarity === 'Uncommon' ? '#9d4edd' : '#ccc',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {card.rarity}
              </span>
            </div>
            
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>
              {card.type} • Cost: {card.cost} {card.strength !== undefined && `• Strength: ${card.strength}`}
            </div>
            
            <div style={{ color: '#ccc', fontSize: '13px', marginBottom: '10px', lineHeight: '1.4' }}>
              {card.description}
            </div>
            
            {/* Elements */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {card.elements.map(element => (
                <span 
                  key={element}
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}
                >
                  {element === 'Fire' && '🜂'} 
                  {element === 'Water' && '🜄'} 
                  {element === 'Earth' && '🜃'} 
                  {element === 'Air' && '🜁'} 
                  {element === 'Nether' && '□'} 
                  {element === 'Aether' && '○'} 
                  {element}
                </span>
              ))}
            </div>

            {/* Keywords */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {card.keywords.map(keyword => (
                <span 
                  key={keyword}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ccc',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Artist */}
            {card.artist && (
              <div style={{ color: '#666', fontSize: '11px', marginTop: '8px', fontStyle: 'italic' }}>
                Art by {card.artist}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SyntaxAdvancedSearch;