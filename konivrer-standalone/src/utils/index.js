/**
 * Utility functions for the KONIVRER Physical Matchmaking component
 */

/**
 * Formats a timestamp into a human-readable date and time
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted date and time
 */
export const formatTimestamp = timestamp => {
  if (!timestamp) return 'Unknown';

  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid date';
  }
};

/**
 * Calculates Bayesian rating for a player
 * @param {Object} player - Player object with rating property
 * @param {Array} matches - Array of match objects
 * @param {number} confidenceFactor - Confidence factor for Bayesian adjustment (higher = more weight to default rating)
 * @returns {number} Calculated Bayesian rating
 */
export const calculateBayesianRating = (
  player,
  matches,
  confidenceFactor = 100,
) => {
  if (!player) return 1500;

  const baseRating = player.rating || 1500;

  // Count matches involving this player
  const playerMatches = matches.filter(
    m => m.player1?.id === player.id || m.player2?.id === player.id,
  );

  const totalMatches = playerMatches.length;

  // Apply Bayesian adjustment (more matches = more confidence in rating)
  return Math.round(
    (baseRating * totalMatches + 1500 * confidenceFactor) /
      (totalMatches + confidenceFactor),
  );
};

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Safely stringifies an object to JSON with error handling
 * @param {Object} data - Data to stringify
 * @returns {string} JSON string or error message
 */
export const safeStringify = data => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error stringifying data:', error);
    return '{"error": "Could not stringify data"}';
  }
};

/**
 * Safely parses a JSON string with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {Object} fallback - Fallback value if parsing fails
 * @returns {Object} Parsed object or fallback
 */
export const safeParse = (jsonString, fallback = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, wait = 300) => {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
};

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} True if empty, false otherwise
 */
export const isEmpty = value => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};
