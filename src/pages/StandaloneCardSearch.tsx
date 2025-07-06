import React, { useState, useEffect } from 'react';
import UnifiedLayout from '../components/UnifiedLayout';

interface Card {
  id: string;
  name: string;
  type: string;
  elements: string[];
  cost: string[];
  attack?: number;
  defense?: number;
  text: string;
  rarity: string;
  set: string;
}

const StandaloneCardSearch: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const cardsPerPage = 12;

  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch('/src/data/konivrer-cards.json');
        const data = await response.json();
        setCards(data.cards || []);
        setFilteredCards(data.cards || []);
      } catch (error) {
        console.error('Error loading cards:', error);
        // Fallback data
        const fallbackCards: Card[] = [
          {
            id: '1',
            name: 'Lightning Bolt',
            type: 'Spell',
            elements: ['Lightning'],
            cost: ['1'],
            text: 'Deal 3 damage to any target.',
            rarity: 'Common',
            set: 'Core'
          },
          {
            id: '2',
            name: 'Fire Elemental',
            type: 'Creature',
            elements: ['Fire'],
            cost: ['2'],
            attack: 3,
            defense: 2,
            text: 'When Fire Elemental enters play, deal 1 damage to target creature.',
            rarity: 'Uncommon',
            set: 'Core'
          }
        ];
        setCards(fallbackCards);
        setFilteredCards(fallbackCards);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  useEffect(() => {
    let filtered = cards;

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(card => card.type === selectedType);
    }

    if (selectedElement) {
      filtered = filtered.filter(card => card.elements.includes(selectedElement));
    }

    if (selectedRarity) {
      filtered = filtered.filter(card => card.rarity === selectedRarity);
    }

    setFilteredCards(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedElement, selectedRarity, cards]);

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = filteredCards.slice(startIndex, startIndex + cardsPerPage);

  const uniqueTypes = [...new Set(cards.map(card => card.type))];
  const uniqueElements = [...new Set(cards.flatMap(card => card.elements))];
  const uniqueRarities = [...new Set(cards.map(card => card.rarity))];

  if (loading) {
    return (
      <UnifiedLayout currentPage="Card Search">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div>Loading cards...</div>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout currentPage="Card Search">
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Search and Filters */}
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 'bold' }}>
            Card Search
          </h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Elements</option>
              {uniqueElements.map(element => (
                <option key={element} value={element}>{element}</option>
              ))}
            </select>
            
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Rarities</option>
              {uniqueRarities.map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Showing {filteredCards.length} of {cards.length} cards
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {currentCards.map(card => (
            <div
              key={card.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#212529'
                }}>
                  {card.name}
                </h3>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>
                  {card.type} • {card.elements.join(', ')} • {card.rarity}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#495057',
                  fontWeight: '500'
                }}>
                  Cost: {card.cost.join(', ')}
                </div>
              </div>
              
              {(card.attack !== undefined || card.defense !== undefined) && (
                <div style={{ 
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: '#495057'
                }}>
                  {card.attack !== undefined && `Attack: ${card.attack}`}
                  {card.attack !== undefined && card.defense !== undefined && ' • '}
                  {card.defense !== undefined && `Defense: ${card.defense}`}
                </div>
              )}
              
              <div style={{ 
                fontSize: '0.875rem', 
                lineHeight: '1.4',
                color: '#495057'
              }}>
                {card.text}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginTop: '2rem'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                backgroundColor: currentPage === 1 ? '#f8f9fa' : '#ffffff',
                color: currentPage === 1 ? '#6c757d' : '#495057',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            
            <span style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              color: '#6c757d'
            }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#ffffff',
                color: currentPage === totalPages ? '#6c757d' : '#495057',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </UnifiedLayout>
  );
};

export default StandaloneCardSearch;