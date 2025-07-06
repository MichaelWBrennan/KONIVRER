import React from 'react';
/**
 * KONIVRER Deck Database - Advanced Card Search Page
 * 
 * Modern advanced search interface for KONIVRER cards
 * This file is deprecated - use CardSearch.jsx instead
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdvancedCardSearchPage = (): any => {
    // Redirect to the new unified search page
  return <Navigate to="/search" replace  / /></Navigate>
  };

export default AdvancedCardSearchPage;