/**
 * KONIVRER Deck Database - Comprehensive Search Engine
 * Advanced search functionality with all Scryfall-inspired features
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Comprehensive search engine for KONIVRER cards
 * @param {Array} cards - Array of card objects
 * @param {Object} criteria - Search criteria object
 * @returns {Array} Filtered and sorted cards
 */
export const searchCards = (cards, criteria) => {
  if (!cards || !Array.isArray(cards)) return [];
  if (!criteria || Object.keys(criteria).length === 0) return cards;

  let results = [...cards];

  // Apply filters based on search mode (AND/OR)
  if (criteria.searchMode === 'or') {
    results = searchWithOrMode(cards, criteria);
  } else {
    results = searchWithAndMode(cards, criteria);
  }

  // Sort results
  results = sortResults(results, criteria);

  // Group results if specified
  if (criteria.groupBy && criteria.groupBy !== 'none') {
    results = groupResults(results, criteria.groupBy);
  }

  return results;
};

/**
 * Search with AND mode - all criteria must match
 */
const searchWithAndMode = (cards, criteria) => {
  return cards.filter(card => {
    return Object.entries(criteria).every(([key, value]) => {
      return matchesCriteria(card, key, value, criteria);
    });
  });
};

/**
 * Search with OR mode - any criteria can match
 */
const searchWithOrMode = (cards, criteria) => {
  return cards.filter(card => {
    return Object.entries(criteria).some(([key, value]) => {
      return matchesCriteria(card, key, value, criteria);
    });
  });
};

/**
 * Check if a card matches specific criteria
 */
const matchesCriteria = (card, key, value, allCriteria) => {
  // Skip empty or default values
  if (!value || value === '' || 
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.values(value).every(v => !v || v === ''))) {
    return true;
  }

  switch (key) {
    case 'cardName':
      return matchesName(card, value, allCriteria.nameComparison, allCriteria.caseSensitive);
    
    case 'text':
      return matchesText(card, value, allCriteria.textComparison, allCriteria.caseSensitive);
    
    case 'typeLine':
      return matchesTypeLine(card, value, allCriteria.typeComparison, allCriteria.allowPartialTypes, allCriteria.caseSensitive);
    
    case 'selectedTypes':
      return matchesTypes(card, value, allCriteria.typeComparison);
    
    case 'elements':
      return matchesElements(card, value, allCriteria.elementComparison);
    
    case 'elementIdentity':
      return matchesElementIdentity(card, value);
    
    case 'keywords':
      return matchesKeywords(card, value, allCriteria.keywordComparison);
    
    case 'manaCost':
      return matchesManaCost(card, value, allCriteria.manaCostComparison);
    
    case 'convertedManaCost':
      return matchesConvertedManaCost(card, value);
    
    case 'attack':
      return matchesStat(card, 'attack', value);
    
    case 'defense':
      return matchesStat(card, 'defense', value);
    
    case 'strength':
      return matchesStrength(card, value);
    
    case 'sets':
      return matchesSets(card, value, allCriteria.setComparison);
    
    case 'rarity':
      return matchesRarity(card, value, allCriteria.rarityComparison);
    
    case 'collectorNumber':
      return matchesCollectorNumber(card, value, allCriteria.collectorComparison, allCriteria.collectorRange);
    
    case 'priceRange':
      return matchesPriceRange(card, value, allCriteria.priceComparison);
    
    case 'artist':
      return matchesArtist(card, value, allCriteria.artistComparison, allCriteria.caseSensitive);
    
    case 'flavorText':
      return matchesFlavorText(card, value, allCriteria.flavorComparison, allCriteria.caseSensitive);
    

    case 'formats':
      return matchesFormats(card, value, allCriteria.formatStatus);
    
    case 'language':
      return matchesLanguage(card, value, allCriteria.includeTranslations);
    
    case 'criteria':
      return matchesCustomCriteria(card, value, allCriteria.criteriaComparison);
    
    case 'includeTokens':
      return value || !isToken(card);
    
    case 'includeExtras':
      return value || !isExtra(card);
    
    default:
      return true;
  }
};

/**
 * Name matching with different comparison modes
 */
const matchesName = (card, searchValue, comparison, caseSensitive) => {
  const cardName = caseSensitive ? card.name : card.name?.toLowerCase();
  const searchName = caseSensitive ? searchValue : searchValue.toLowerCase();

  switch (comparison) {
    case 'exact':
      return cardName === searchName;
    case 'starts':
      return cardName?.startsWith(searchName);
    case 'ends':
      return cardName?.endsWith(searchName);
    case 'contains':
    default:
      return cardName?.includes(searchName);
  }
};

/**
 * Text matching with different comparison modes
 */
const matchesText = (card, searchValue, comparison, caseSensitive) => {
  const cardText = caseSensitive ? card.description : card.description?.toLowerCase();
  const searchText = caseSensitive ? searchValue : searchValue.toLowerCase();

  // Handle ~ placeholder for card name
  const processedSearchText = searchText?.replace(/~/g, caseSensitive ? card.name : card.name?.toLowerCase());

  switch (comparison) {
    case 'exact':
      return cardText === processedSearchText;
    case 'word-order-matters':
      return cardText?.includes(processedSearchText);
    case 'contains':
    default:
      // Split into words and check if all words are present
      const words = processedSearchText?.split(/\s+/) || [];
      return words.every(word => cardText?.includes(word));
  }
};

/**
 * Type line matching
 */
const matchesTypeLine = (card, searchValue, comparison, allowPartial, caseSensitive) => {
  const cardType = caseSensitive ? card.type : card.type?.toLowerCase();
  const searchType = caseSensitive ? searchValue : searchValue.toLowerCase();

  const matches = allowPartial ? 
    cardType?.includes(searchType) : 
    cardType === searchType;

  return comparison === 'excluding' ? !matches : matches;
};

/**
 * Selected types matching
 */
const matchesTypes = (card, selectedTypes, comparison) => {
  if (!selectedTypes || selectedTypes.length === 0) return true;

  const cardType = card.type?.toUpperCase();
  const hasMatch = selectedTypes.some(type => 
    cardType?.includes(type.toUpperCase())
  );

  return comparison === 'excluding' ? !hasMatch : hasMatch;
};

/**
 * Elements matching with different comparison modes
 */
const matchesElements = (card, selectedElements, comparison) => {
  if (!selectedElements || selectedElements.length === 0) return true;

  const cardElements = card.elements || [];
  
  switch (comparison) {
    case 'exactly':
      return arraysEqual(cardElements.sort(), selectedElements.sort());
    case 'at-most':
      return cardElements.every(element => selectedElements.includes(element));
    case 'at-least':
      return selectedElements.every(element => cardElements.includes(element));
    case 'including':
    default:
      return selectedElements.some(element => cardElements.includes(element));
  }
};

/**
 * Element identity matching for deck building
 */
const matchesElementIdentity = (card, identityElements) => {
  if (!identityElements || identityElements.length === 0) return true;

  const cardElements = card.elements || [];
  const cardCost = card.cost || [];
  
  // Check if card can be played in a deck with this element identity
  const allCardElements = [...new Set([...cardElements, ...cardCost])];
  return allCardElements.every(element => 
    identityElements.includes(element) || element === 'Neutral' || element === 'Generic'
  );
};

/**
 * Keywords matching
 */
const matchesKeywords = (card, selectedKeywords, comparison) => {
  if (!selectedKeywords || selectedKeywords.length === 0) return true;

  const cardKeywords = card.keywords || [];
  
  switch (comparison) {
    case 'exactly':
      return arraysEqual(cardKeywords.sort(), selectedKeywords.sort());
    case 'excluding':
      return !selectedKeywords.some(keyword => cardKeywords.includes(keyword));
    case 'including':
    default:
      return selectedKeywords.some(keyword => cardKeywords.includes(keyword));
  }
};

/**
 * Mana cost matching
 */
const matchesManaCost = (card, searchCost, comparison) => {
  const cardCost = card.cost || [];
  const cardCostString = cardCost.join('');
  
  switch (comparison) {
    case 'exact':
      return cardCostString === searchCost;
    case 'less':
      return getConvertedManaCost(cardCost) < getConvertedManaCost(parseCost(searchCost));
    case 'greater':
      return getConvertedManaCost(cardCost) > getConvertedManaCost(parseCost(searchCost));
    case 'less-equal':
      return getConvertedManaCost(cardCost) <= getConvertedManaCost(parseCost(searchCost));
    case 'greater-equal':
      return getConvertedManaCost(cardCost) >= getConvertedManaCost(parseCost(searchCost));
    default:
      return cardCostString.includes(searchCost);
  }
};

/**
 * Converted cost matching
 */
const matchesConvertedManaCost = (card, criteria) => {
  if (!criteria.value) return true;

  const cardCMC = getConvertedManaCost(card.cost || []);
  const targetCMC = parseInt(criteria.value);

  return compareNumbers(cardCMC, targetCMC, criteria.operator);
};

/**
 * Stat matching (attack/defense)
 */
const matchesStat = (card, statName, criteria) => {
  if (!criteria.value) return true;

  const cardStat = card[statName];
  if (cardStat === null || cardStat === undefined) return false;

  // Handle special values like *, X
  if (criteria.value === '*' || criteria.value === 'X') {
    return cardStat === criteria.value;
  }

  const targetValue = parseInt(criteria.value);
  if (isNaN(targetValue)) return false;

  const cardValue = parseInt(cardStat);
  if (isNaN(cardValue)) return false;

  return compareNumbers(cardValue, targetValue, criteria.operator);
};

/**
 * Strength matching (KONIVRER combined stat)
 */
const matchesStrength = (card, criteria) => {
  if (!criteria.value) return true;

  // Calculate strength as attack + defense
  const attack = parseInt(card.attack) || 0;
  const defense = parseInt(card.defense) || 0;
  const strength = attack + defense;

  const targetValue = parseInt(criteria.value);
  if (isNaN(targetValue)) return false;

  return compareNumbers(strength, targetValue, criteria.operator);
};

/**
 * Sets matching
 */
const matchesSets = (card, selectedSets, comparison) => {
  if (!selectedSets || selectedSets.length === 0) return true;

  const hasMatch = selectedSets.includes(card.set);
  return comparison === 'excluding' ? !hasMatch : hasMatch;
};

/**
 * Rarity matching
 */
const matchesRarity = (card, selectedRarities, comparison) => {
  if (!selectedRarities || selectedRarities.length === 0) return true;

  const hasMatch = selectedRarities.includes(card.rarity);
  return comparison === 'excluding' ? !hasMatch : hasMatch;
};

/**
 * Collector number matching
 */
const matchesCollectorNumber = (card, searchNumber, comparison, range) => {
  if (!searchNumber && (!range || (!range.min && !range.max))) return true;

  const cardNumber = card.collectorNumber;
  if (!cardNumber) return false;

  if (comparison === 'exact') {
    return cardNumber === searchNumber;
  } else if (comparison === 'range' && range) {
    const cardNum = extractNumberFromCollector(cardNumber);
    const minNum = range.min ? parseInt(range.min) : 0;
    const maxNum = range.max ? parseInt(range.max) : Infinity;
    
    return cardNum >= minNum && cardNum <= maxNum;
  }

  return false;
};

/**
 * Price range matching
 */
const matchesPriceRange = (card, priceRange, comparison) => {
  if (!priceRange || (!priceRange.min && !priceRange.max)) return true;

  // This would need to be implemented with actual price data
  // For now, return true as price data isn't available in the current card structure
  return true;
};

/**
 * Artist matching
 */
const matchesArtist = (card, searchArtist, comparison, caseSensitive) => {
  const cardArtist = caseSensitive ? card.artist : card.artist?.toLowerCase();
  const searchValue = caseSensitive ? searchArtist : searchArtist.toLowerCase();

  switch (comparison) {
    case 'exact':
      return cardArtist === searchValue;
    case 'contains':
    default:
      return cardArtist?.includes(searchValue);
  }
};

/**
 * Flavor text matching
 */
const matchesFlavorText = (card, searchFlavor, comparison, caseSensitive) => {
  const cardFlavor = caseSensitive ? card.flavorText : card.flavorText?.toLowerCase();
  const searchValue = caseSensitive ? searchFlavor : searchFlavor.toLowerCase();

  switch (comparison) {
    case 'exact':
      return cardFlavor === searchValue;
    case 'word-order-matters':
      return cardFlavor?.includes(searchValue);
    case 'contains':
    default:
      const words = searchValue?.split(/\s+/) || [];
      return words.every(word => cardFlavor?.includes(word));
  }
};



/**
 * Format legality matching
 */
const matchesFormats = (card, selectedFormats, status) => {
  // This would need to be implemented with actual format legality data
  // For now, return true as format data isn't available in the current card structure
  return true;
};

/**
 * Language matching
 */
const matchesLanguage = (card, language, includeTranslations) => {
  // This would need to be implemented with actual language data
  // For now, assume all cards are in English
  return language === 'en' || includeTranslations;
};

/**
 * Custom criteria matching
 */
const matchesCustomCriteria = (card, criteria, comparison) => {
  if (!criteria || criteria.length === 0) return true;

  // This would implement custom search syntax
  // For now, treat as additional text search
  return criteria.some(criterion => 
    matchesLoreFinder(card, criterion, false)
  );
};

/**
 * Helper functions
 */

const isToken = (card) => {
  return card.type?.includes('TOKEN') || card.id?.includes('token');
};

const isExtra = (card) => {
  return card.type?.includes('EMBLEM') || card.type?.includes('PLANE') || card.type?.includes('SCHEME');
};

const arraysEqual = (a, b) => {
  return a.length === b.length && a.every((val, i) => val === b[i]);
};

const getConvertedManaCost = (cost) => {
  if (!cost || !Array.isArray(cost)) return 0;
  
  return cost.reduce((total, element) => {
    // Count each element as 1 mana
    return total + 1;
  }, 0);
};

const parseCost = (costString) => {
  // Simple cost parsing - would need to be more sophisticated
  return costString.split('').filter(char => char !== ' ');
};

const compareNumbers = (cardValue, targetValue, operator) => {
  switch (operator) {
    case '=':
      return cardValue === targetValue;
    case '≠':
      return cardValue !== targetValue;
    case '<':
      return cardValue < targetValue;
    case '≤':
      return cardValue <= targetValue;
    case '>':
      return cardValue > targetValue;
    case '≥':
      return cardValue >= targetValue;
    default:
      return true;
  }
};

const extractNumberFromCollector = (collectorNumber) => {
  const match = collectorNumber.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Sort results based on criteria
 */
const sortResults = (results, criteria) => {
  const { sortBy, sortOrder } = criteria;
  
  return results.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name?.localeCompare(b.name) || 0;
        break;
      case 'cost':
        comparison = getConvertedManaCost(a.cost) - getConvertedManaCost(b.cost);
        break;
      case 'type':
        comparison = a.type?.localeCompare(b.type) || 0;
        break;
      case 'rarity':
        const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Mythic': 4, 'Special': 5, 'Legendary': 6 };
        comparison = (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
        break;
      case 'set':
        comparison = a.set?.localeCompare(b.set) || 0;
        break;
      case 'collector':
        comparison = extractNumberFromCollector(a.collectorNumber) - extractNumberFromCollector(b.collectorNumber);
        break;
      case 'artist':
        comparison = a.artist?.localeCompare(b.artist) || 0;
        break;
      case 'power':
        comparison = (parseInt(a.attack) || 0) - (parseInt(b.attack) || 0);
        break;
      case 'toughness':
        comparison = (parseInt(a.defense) || 0) - (parseInt(b.defense) || 0);
        break;
      case 'random':
        comparison = Math.random() - 0.5;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

/**
 * Group results by specified field
 */
const groupResults = (results, groupBy) => {
  const groups = {};
  
  results.forEach(card => {
    let groupKey;
    
    switch (groupBy) {
      case 'set':
        groupKey = card.set || 'Unknown Set';
        break;
      case 'type':
        groupKey = card.type || 'Unknown Type';
        break;
      case 'element':
        groupKey = card.elements?.[0] || 'Neutral';
        break;
      case 'rarity':
        groupKey = card.rarity || 'Unknown Rarity';
        break;
      case 'artist':
        groupKey = card.artist || 'Unknown Artist';
        break;
      default:
        groupKey = 'All Cards';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(card);
  });
  
  // Convert to array format with group headers
  const groupedResults = [];
  Object.entries(groups).forEach(([groupName, cards]) => {
    groupedResults.push({
      isGroupHeader: true,
      groupName,
      count: cards.length
    });
    groupedResults.push(...cards);
  });
  
  return groupedResults;
};

export default searchCards;