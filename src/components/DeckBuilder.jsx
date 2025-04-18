import React, { useState, useEffect } from 'react';
import cards from '../data/cards.json';

function DeckBuilder() {
  const [deck, setDeck] = useState([]);

  const rarityCount = (rarity) => deck.filter(card => card.rarity === rarity).length;

  const addCard = (card) => {
    const count = rarityCount(card.rarity);
    if ((card.rarity === 'common' && count >= 25) ||
        (card.rarity === 'uncommon' && count >= 13) ||
        (card.rarity === 'rare' && count >= 2)) {
      alert(`Max ${card.rarity} cards reached.`);
      return;
    }
    setDeck([...deck, card]);
  };

  return (
    <div>
      <h2>All Cards</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {cards.map(card => (
          <div key={card.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <strong>{card.name}</strong>
            <p>{card.text}</p>
            <button onClick={() => addCard(card)}>Add to Deck</button>
          </div>
        ))}
      </div>
      <h2>Deck ({deck.length} cards)</h2>
      <ul>
        {deck.map((card, index) => (
          <li key={index}>{card.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DeckBuilder;