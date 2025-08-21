import { useMemo } from 'react';
import { getCardDatabase, Card } from '../data/cards';
import { CardSearchFilters } from '../stores/appStore';

// Mock pagination structure to match API response
interface PaginatedCards {
  data: Card[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Use local card database instead of API calls
 */
export function useLocalCards(filters: CardSearchFilters): {
  data?: PaginatedCards;
  isLoading: boolean;
  error: null;
} {
  const paginatedData = useMemo(() => {
    const cards = getCardDatabase();
    const itemsPerPage = 20;
    
    // Apply filters
    let filteredCards = cards;
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCards = cards.filter(card => 
        card.name.toLowerCase().includes(searchTerm) ||
        (card.type && card.type.toLowerCase().includes(searchTerm)) ||
        (card.lesserType && card.lesserType.toLowerCase().includes(searchTerm)) ||
        (card.element && card.element.toLowerCase().includes(searchTerm)) ||
        (card.elements?.[0] && card.elements[0].toLowerCase().includes(searchTerm)) ||
        (card.description && card.description.toLowerCase().includes(searchTerm)) ||
        (card.rulesText && card.rulesText.toLowerCase().includes(searchTerm))
      );
    }
    
    // Element filter
    if (filters.element) {
      filteredCards = filteredCards.filter(card => {
        const cardElement = card.element || card.elements?.[0];
        return cardElement && cardElement.toLowerCase() === filters.element?.toLowerCase();
      });
    }
    
    // Type filter
    if (filters.type) {
      filteredCards = filteredCards.filter(card => {
        const cardType = card.type || card.lesserType;
        return cardType && cardType.toLowerCase() === filters.type?.toLowerCase();
      });
    }
    
    // Rarity filter
    if (filters.rarity) {
      filteredCards = filteredCards.filter(card => 
        card.rarity.toLowerCase() === filters.rarity?.toLowerCase()
      );
    }
    
    // Cost filter
    if (filters.minCost !== undefined) {
      filteredCards = filteredCards.filter(card => {
        const cost = card.cost ?? card.azothCost ?? 0;
        return cost >= filters.minCost!;
      });
    }
    if (filters.maxCost !== undefined) {
      filteredCards = filteredCards.filter(card => {
        const cost = card.cost ?? card.azothCost ?? 0;
        return cost <= filters.maxCost!;
      });
    }
    
    // Sorting
    if (filters.sortBy) {
      filteredCards = [...filteredCards].sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'cost':
            aValue = a.cost ?? a.azothCost ?? 0;
            bValue = b.cost ?? b.azothCost ?? 0;
            break;
          case 'type':
            aValue = (a.type ?? a.lesserType ?? '').toLowerCase();
            bValue = (b.type ?? b.lesserType ?? '').toLowerCase();
            break;
          case 'element':
            aValue = (a.element ?? a.elements?.[0] ?? '').toLowerCase();
            bValue = (b.element ?? b.elements?.[0] ?? '').toLowerCase();
            break;
          case 'rarity': {
            const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'mythic': 4 };
            aValue = rarityOrder[a.rarity.toLowerCase() as keyof typeof rarityOrder] || 0;
            bValue = rarityOrder[b.rarity.toLowerCase() as keyof typeof rarityOrder] || 0;
            break;
          }
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }
        
        if (aValue < bValue) return filters.sortOrder === 'DESC' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'DESC' ? -1 : 1;
        return 0;
      });
    }
    
    // Pagination
    const currentPage = filters.page || 1;
    const totalItems = filteredCards.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCards = filteredCards.slice(startIndex, endIndex);
    
    return {
      data: paginatedCards,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage
      }
    };
  }, [filters]);
  
  return {
    data: paginatedData,
    isLoading: false,
    error: null
  };
}

/**
 * Use local card by ID
 */
export function useLocalCard(id: string): {
  data?: Card;
  isLoading: boolean;
  error: null;
} {
  const card = useMemo(() => {
    const cards = getCardDatabase();
    return cards.find(c => c.id === id);
  }, [id]);
  
  return {
    data: card,
    isLoading: false,
    error: null
  };
}

/**
 * Use local card by name
 */
export function useLocalCardByName(name: string): {
  data?: Card;
  isLoading: boolean;
  error: null;
} {
  const card = useMemo(() => {
    const cards = getCardDatabase();
    return cards.find(c => 
      c.name.toLowerCase() === name.toLowerCase()
    );
  }, [name]);
  
  return {
    data: card,
    isLoading: false,
    error: null
  };
}

/**
 * Get card statistics
 */
export function useLocalCardStatistics(): {
  data?: any;
  isLoading: boolean;
  error: null;
} {
  const stats = useMemo(() => {
    const cards = getCardDatabase();
    
    return {
      totalCards: cards.length,
      byElement: cards.reduce((acc, card) => {
        const element = card.element || card.elements?.[0];
        if (element) {
          acc[element] = (acc[element] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      byType: cards.reduce((acc, card) => {
        const type = card.type || card.lesserType;
        if (type) {
          acc[type] = (acc[type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      byRarity: cards.reduce((acc, card) => {
        acc[card.rarity] = (acc[card.rarity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, []);
  
  return {
    data: stats,
    isLoading: false,
    error: null
  };
}