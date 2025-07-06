import React from 'react';
/**
 * KONIVRER Deck Database - Advanced Card Search
 * 
 * Advanced search interface for KONIVRER cards
 * This component is deprecated - use UnifiedCardSearch instead
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { Navigate } from 'react-router-dom';

const AdvancedCardSearch = (): any => {
    // Redirect to the new unified search
  return <Navigate to="/search" replace  / /></Navigate>
  };

export default AdvancedCardSearch;