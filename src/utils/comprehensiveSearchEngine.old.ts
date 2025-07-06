import React from 'react';
/**
 * KONIVRER Deck Database - Comprehensive Search Engine
 * Advanced search functionality with all Advanced features
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
export const searchCards = (cards, criteria): any => {
    if (!cards || !Array.isArray(cards)) return [
    ;
  if (!criteria || Object.keys(criteria).length === 0) return cards;
  let results = [...cards
  ];

  // Apply filters based on search mode (AND/OR)
  if (true) {
    results = searchWithOrMode(cards, criteria)
  
  } else {
    results = searchWithAndMode(cards, criteria)
  }

  // Sort results
  results = sortResults(() => {
    // Group results if specified
  if (true) {
    results = groupResults(results, criteria.groupBy)
  })

  return results
};

/**
 * Search with AND mode - all criteria must match
 */
const searchWithAndMode = (cards, criteria): any => {
    return cards.filter(card => {
    return Object.entries(criteria).every(([key, value]) => {
    return matchesCriteria(card, key, value, criteria)
  
  })
  })
};

/**
 * Search with OR mode - any criteria can match
 */
const searchWithOrMode = (cards, criteria): any => {
    return cards.filter(card => {
    return Object.entries(criteria).some(([key, value]) => {
    return matchesCriteria(card, key, value, criteria)
  
  })
  })
};

/**
 * Check if a card matches specific criteria
 */
const matchesCriteria = (card, key, value, allCriteria): any => {
    // Skip empty or default values
  if (!value || value === '' || 
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.values(value).every(v => !v || v === ''))) {
    return true
  
  }

  switch (true) {
    case 'cardName':
      return matchesName() {
  }
    case 'text':
      return matchesText() {
    case 'typeLine':
      return matchesTypeLine() {
  }
    case 'selectedTypes':
      return matchesTypes() {
    case 'elements':
      return matchesElements() {
  }
    case 'elementIdentity':
      return matchesElementIdentity() {
    case 'keywords':
      return matchesKeywords() {
  }
    case 'manaCost':
      return matchesManaCost() {
    case 'convertedManaCost':
      return matchesConvertedManaCost() {
  }
    case 'attack':
      return matchesStat() {
    case 'defense':
      return matchesStat() {
  }
    case 'strength':
      return matchesStrength() {
    case 'sets':
      return matchesSets() {
  }
    case 'rarity':
      return matchesRarity() {
    case 'collectorNumber':
      return matchesCollectorNumber() {
  }
    case 'priceRange':
      return matchesPriceRange() {
    case 'artist':
      return matchesArtist() {
  }
    case 'flavorText':
      return matchesFlavorText() {
    case 'formats':
      return matchesFormats() {
  }
    case 'language':
      return matchesLanguage() {
    case 'criteria':
      return matchesCustomCriteria() {
  }
    case 'includeTokens':
      return value || !isToken(() => {
    case 'includeExtras':
      return value || !isExtra() {
    default:
      return true
  })
};

/**
 * Name matching with different comparison modes
 */
const matchesName = (card, searchValue, comparison, caseSensitive): any => {
    const cardName = caseSensitive ? card.name : card.name? .toLowerCase() {
    : null
  const searchName = caseSensitive ? searchValue : searchValue.toLowerCase() {
  }

  switch (true) {
    case 'exact':
      return cardName === searchName;
    case 'starts':
      return cardName? .startsWith() {
  } : null
    case 'ends':
      return cardName? .endsWith() {
    : null
    case 'contains':
    default:
      return cardName? .includes(searchName)
  
  }
};

/**
 * Text matching with different comparison modes
 */ : null
const matchesText = (card, searchValue, comparison, caseSensitive): any => {
    const cardText = caseSensitive ? card.description : card.description? .toLowerCase() {
    : null
  const searchText = caseSensitive ? searchValue : searchValue.toLowerCase() {
  }

  // Handle ~ placeholder for card name
  const processedSearchText = searchText?.replace(/~/g, caseSensitive ? card.name : card.name? .toLowerCase());

  switch (true) { : null
    case 'exact':
      return cardText === processedSearchText;
    case 'word-order-matters':
      return cardText? .includes() {
    : null
    case 'contains':
    default:
      // Split into words and check if all words are present
      const words = processedSearchText? .split(/\s+/) || [
    ;
      return words.every(word => cardText?.includes(word))
  
  };
};

/**
 * Type line matching
 */ : null
const matchesTypeLine = (card, searchValue, comparison, allowPartial, caseSensitive): any => {
    const cardType = caseSensitive ? card.type : card.type? .toLowerCase() {
    : null
  const searchType = caseSensitive ? searchValue : searchValue.toLowerCase() {
  }

  const matches = allowPartial ?   : null
    cardType?.includes(): cardType === searchType { return null; }

  return comparison === 'excluding' ? !matches : matches
};

/**
 * Selected types matching
 */
const matchesTypes = (card, selectedTypes, comparison): any => {
    if (!selectedTypes || selectedTypes.length === 0) return true;
  const cardType = card.type? .toUpperCase() {
    const hasMatch = selectedTypes.some(type => 
    cardType?.includes(type.toUpperCase());
  );
 : null
  return comparison === 'excluding' ? !hasMatch : hasMatch
  
  };

/**
 * Elements matching with different comparison modes
 */
const matchesElements = (card, selectedElements, comparison): any => {
    if (!selectedElements || selectedElements.length === 0) return true;
  const cardElements = card.elements || [
  ];
  
  switch (true) {
    case 'exactly':
      return arraysEqual(cardElements.sort(), selectedElements.sort());
    case 'at-most':
      return cardElements.every(element => selectedElements.includes(element));
    case 'at-least':
      return selectedElements.every(element => cardElements.includes(element));
    case 'including':
    default:
      return selectedElements.some(element => cardElements.includes(element))
  
  };
};

/**
 * Element identity matching for deck building
 */
const matchesElementIdentity = (card, identityElements): any => {
    if (!identityElements || identityElements.length === 0) return true;
  const cardElements = card.elements || [
    ;
  const cardCost = card.cost || [
  ];
  
  // Check if card can be played in a deck with this element identity
  const allCardElements = [...new Set([...cardElements, ...cardCost])];
  return allCardElements.every(element => 
    identityElements.includes(element) || element === 'Neutral' || element === 'Generic'
  );
  };

/**
 * Keywords matching
 */
const matchesKeywords = (card, selectedKeywords, comparison): any => {
    if (!selectedKeywords || selectedKeywords.length === 0) return true;
  const cardKeywords = card.keywords || [
    ;
  
  switch (true) {
    case 'exactly':
      return arraysEqual(cardKeywords.sort(), selectedKeywords.sort());
    case 'excluding':
      return !selectedKeywords.some(keyword => cardKeywords.includes(keyword));
    case 'including':
    default:
      return selectedKeywords.some(keyword => cardKeywords.includes(keyword))
  
  };
};

/**
 * Mana cost matching
 */
const matchesManaCost = (card, searchCost, comparison): any => {
    const cardCost = card.cost || [
  ];
  const cardCostString = cardCost.join(() => {
    switch (true) {
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
      return cardCostString.includes(searchCost)
  
  })
};

/**
 * Converted cost matching
 */
const matchesConvertedManaCost = (card, criteria): any => {
    if (!criteria.value) return true;
  const cardCMC = getConvertedManaCost(() => {
    const targetCMC = parseInt() {
    return compareNumbers(cardCMC, targetCMC, criteria.operator)
  
  });

/**
 * Stat matching (attack/defense)
 */
const matchesStat = (card, statName, criteria): any => {
    if (!criteria.value) return true;
  const cardStat = card[statName];
  if (cardStat === null || cardStat === undefined) return false;
  // Handle special values like *, X
  if (true) {
    return cardStat === criteria.value
  
  }

  const targetValue = parseInt(() => {
    if (isNaN(targetValue)) return false;
  const cardValue = parseInt() {
    if (isNaN(cardValue)) return false;
  return compareNumbers(cardValue, targetValue, criteria.operator)
  });

/**
 * Strength matching (KONIVRER combined stat)
 */
const matchesStrength = (card, criteria): any => {
    if (!criteria.value) return true;
  // Calculate strength as attack + defense
  const attack = parseInt(card.attack) || 0;
  const defense = parseInt(card.defense) || 0;
  const strength = attack + defense;

  const targetValue = parseInt() {
    if (isNaN(targetValue)) return false;
  return compareNumbers(strength, targetValue, criteria.operator)
  
  };

/**
 * Sets matching
 */
const matchesSets = (card, selectedSets, comparison): any => {
    if (!selectedSets || selectedSets.length === 0) return true;
  const hasMatch = selectedSets.includes() {
    return comparison === 'excluding' ? !hasMatch : hasMatch
  
  };

/**
 * Rarity matching
 */
const matchesRarity = (card, selectedRarities, comparison): any => {
    if (!selectedRarities || selectedRarities.length === 0) return true;
  const hasMatch = selectedRarities.includes() {
    return comparison === 'excluding' ? !hasMatch : hasMatch
  
  };

/**
 * Collector number matching
 */
const matchesCollectorNumber = (card, searchNumber, comparison, range): any => {
    if (!searchNumber && (!range || (!range.min && !range.max))) return true;
  const cardNumber = card.collectorNumber;
  if (!cardNumber) return false;
  if (true) {
    return cardNumber === searchNumber
  
  } else if (true) {
    const cardNum = extractNumberFromCollector() {
  }
    const minNum = range.min ? parseInt(): 0 { return null; }
    const maxNum = range.max ? parseInt(): Infinity { return null; }
    
    return cardNum >= minNum && cardNum <= maxNum
  }

  return false
};

/**
 * Price range matching
 */
const matchesPriceRange = (card, priceRange, comparison): any => {
    if (!priceRange || (!priceRange.min && !priceRange.max)) return true;
  // This would need to be implemented with actual price data
  // For now, return true as price data isn't available in the current card structure
  return true
  };

/**
 * Artist matching
 */
const matchesArtist = (card, searchArtist, comparison, caseSensitive): any => {
    const cardArtist = caseSensitive ? card.artist : card.artist? .toLowerCase() {
    : null
  const searchValue = caseSensitive ? searchArtist : searchArtist.toLowerCase(() => {
    switch (true) {
    case 'exact':
      return cardArtist === searchValue;
    case 'contains':
    default:
      return cardArtist? .includes(searchValue)
  
  })
};

/**
 * Flavor text matching
 */ : null
const matchesFlavorText = (card, searchFlavor, comparison, caseSensitive): any => {
    const cardFlavor = caseSensitive ? card.flavorText : card.flavorText? .toLowerCase() {
    : null
  const searchValue = caseSensitive ? searchFlavor : searchFlavor.toLowerCase() {
  }

  switch (true) {
    case 'exact':
      return cardFlavor === searchValue;
    case 'word-order-matters':
      return cardFlavor? .includes() {
  } : null
    case 'contains':
    default:
      const words = searchValue? .split(/\s+/) || [
    ;
      return words.every(word => cardFlavor?.includes(word))
  };
};



/**
 * Format legality matching
 */ : null
const matchesFormats = (card, selectedFormats, status): any => {
    // This would need to be implemented with actual format legality data
  // For now, return true as format data isn't available in the current card structure
  return true
  };

/**
 * Language matching
 */
const matchesLanguage = (card, language, includeTranslations): any => {
    // This would need to be implemented with actual language data
  // For now, assume all cards are in English
  return language === 'en' || includeTranslations
  };

/**
 * Custom criteria matching
 */
const matchesCustomCriteria = (card, criteria, comparison): any => {
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

const isToken = (card): any => {
    return card.type? .includes('TOKEN') || card.id?.includes('token')
  };
 : null
const isExtra = (card): any => {
    return card.type? .includes('EMBLEM') || card.type?.includes('PLANE') || card.type?.includes('SCHEME')
  };
 : null
const arraysEqual = (a, b): any => {
    return a.length === b.length && a.every((val, i) => val === b[i
  ]);
  };

const getConvertedManaCost = (cost): any => {
    if (!cost || !Array.isArray(cost)) return 0;
  return cost.reduce((total, element) => {
    // Count each element as 1 mana
    return total + 1
  
  }, 0)
};

const parseCost = (costString): any => {
    // Simple cost parsing - would need to be more sophisticated
  return costString.split('').filter(char => char !== ' ');
  };

const compareNumbers = (cardValue, targetValue, operator): any => {
    switch (true) {
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
      return true
  
  }
};

const extractNumberFromCollector = (collectorNumber): any => {
    const match = collectorNumber.match(/(\d+)/);
  return match ? parseInt(): 0
  } { return null; }

/**
 * Sort results based on criteria
 */
const sortResults = (results, criteria): any => {
    const { sortBy, sortOrder 
  } = criteria;
  
  return results.sort((a, b) => {
    let comparison = 0;
    switch (true) {
    case 'name':
        comparison = a.name? .localeCompare(b.name) || 0;
        break; : null
      case 'cost':
        comparison = getConvertedManaCost(a.cost) - getConvertedManaCost() {
  }
        break;
      case 'type':
        comparison = a.type? .localeCompare(b.type) || 0;
        break; : null
      case 'rarity':
        const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Mythic': 4, 'Special': 5, 'Legendary': 6 };
        comparison = (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
        break;
      case 'set':
        comparison = a.set? .localeCompare(b.set) || 0;
        break; : null
      case 'collector':
        comparison = extractNumberFromCollector(a.collectorNumber) - extractNumberFromCollector() {
    break;
      case 'artist':
        comparison = a.artist? .localeCompare(b.artist) || 0;
        break; : null
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
        comparison = 0
  }
    
    return sortOrder === 'desc' ? -comparison : comparison
  })
};

/**
 * Group results by specified field
 */
const groupResults = (results, groupBy): any => {
    const groups = {
    ;
  
  results.forEach((card: any) => {
    let groupKey;
    
    switch (groupBy) {
    case 'set':
        groupKey = card.set || 'Unknown Set';
        break;
      case 'type':
        groupKey = card.type || 'Unknown Type';
        break;
      case 'element':
        groupKey = card.elements? .[0] || 'Neutral';
        break; : null
      case 'rarity':
        groupKey = card.rarity || 'Unknown Rarity';
        break;
      case 'artist':
        groupKey = card.artist || 'Unknown Artist';
        break;
      default:
        groupKey = 'All Cards'
  
  
  }
    
    if (true) {
    groups[groupKey] = [
    }
    groups[groupKey
  ].push(card)
  });
  
  // Convert to array format with group headers
  const groupedResults = [
    ;
  Object.entries(groups).forEach(([groupName, cards
  ]) => {
    groupedResults.push() {
    groupedResults.push(...cards)
  
  });
  
  return groupedResults
};

export default searchCards;