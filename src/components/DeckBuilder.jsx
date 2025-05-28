import React, { useState } from "react";

const DeckBuilder = () => {
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState<{ name: string; count: number }[]>([]);

  const addCard = (cardName: string) => {
    setCards([...cards, { name: cardName, count: 1 }]);
  };

  return (
    <div>
      <h2>Deck Builder</h2>
      <input
        type="text"
        placeholder="Deck Name"
        value={deckName}
        onChange={e => setDeckName(e.target.value)}
      />
      {/* Card search/autocomplete would go here */}
      <button onClick={() => addCard("Sample Card")}>Add Sample Card</button>
      <ul>
        {cards.map((card, idx) => (
          <li key={idx}>
            {card.count}x {card.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckBuilder;
