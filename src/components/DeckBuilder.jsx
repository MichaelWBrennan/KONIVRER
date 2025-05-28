// This component has been moved to /pages/DeckBuilder.jsx
// This file is kept for backward compatibility but should be removed
import React from 'react';
import { Link } from 'react-router-dom';

const DeckBuilder = () => {
  return (
    <div className="p-4">
      <p>This component has been moved. Please use the new deck builder at:</p>
      <Link to="/deckbuilder" className="btn btn-primary">
        Go to Deck Builder
      </Link>
    </div>
  );
};

export default DeckBuilder;
