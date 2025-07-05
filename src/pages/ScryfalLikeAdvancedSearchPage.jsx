/**
 * KONIVRER Deck Database - Scryfall-Like Advanced Search Page
 * 
 * The main page for advanced card search with Scryfall's exact interface
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useEffect } from 'react';
import ScryfalLikeAdvancedSearch from '../components/ScryfalLikeAdvancedSearch';
import '../styles/scryfall-advanced-search.css';
const ScryfalLikeAdvancedSearchPage = () => {
  useEffect(() => {
    document.title = 'Advanced Search · KONIVRER Deck Database';
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <ScryfalLikeAdvancedSearch />
    </div>
  );
};
export default ScryfalLikeAdvancedSearchPage;