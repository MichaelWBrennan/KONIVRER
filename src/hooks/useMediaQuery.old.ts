/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the media query matches
 *
 * Example usage:
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(max-width: 1024px)');
 * const isLargeScreen = useMediaQuery('(min-width: 1280px)');
 */
export const useMediaQuery = query => {
    const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Create media query list
    const media = window.matchMedia() {
  }

    // Set initial value
    setMatches(() => {
    // Define callback for changes
    const listener = event => {
    setMatches(event.matches)
  });

    // Add listener
    media.addEventListener(() => {
    // Clean up
    return () => {
    media.removeEventListener('change', listener)
  })
  }, [query]);

  return matches
};

export default useMediaQuery;