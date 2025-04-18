import React from 'react';

function CardViewer({ card }) {
  if (!card) return <div>Select a card to view details.</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h3>{card.name}</h3>
      <p><strong>Elements:</strong> {card.elements.join(', ')}</p>
      <p><strong>Keywords:</strong> {card.keywords.join(', ')}</p>
      <p><strong>Cost:</strong> {card.cost}</p>
      <p><strong>Power:</strong> {card.power}</p>
      <p><strong>Rarity:</strong> {card.rarity}</p>
      <p>{card.text}</p>
    </div>
  );
}

export default CardViewer;