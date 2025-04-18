import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CardViewer from './CardViewer';
import cardData from '../data/cards.json';

const DeckBuilder = () => {
  const [query, setQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState(cardData);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = cardData.filter(
      (card) =>
        card.name.toLowerCase().includes(lowerCaseQuery) ||
        card.type.toLowerCase().includes(lowerCaseQuery) ||
        card.description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCards(filtered);
  }, [query]);

  return (
    <div style={{ padding: '24px' }}>
      <h1>KONIVRER Deck Builder</h1>
      <SearchBar query={query} setQuery={setQuery} />
      <CardViewer cards={filteredCards} />
    </div>
  );
};

export default DeckBuilder;