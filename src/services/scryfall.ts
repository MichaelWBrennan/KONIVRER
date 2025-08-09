import { ScryfallCard, ScryfallSearchResponse } from '../types';
import { searchMockCards, autocompleteMockCards } from './mockCards';

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

// Rate limiting for Scryfall API (50-100ms between requests)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return fetch(url);
}

export async function searchCards(query: string, page = 1): Promise<ScryfallSearchResponse> {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      format: 'json',
      order: 'name',
      dir: 'asc'
    });

    const response = await rateLimitedFetch(
      `${SCRYFALL_API_BASE}/cards/search?${params}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        // No cards found
        return {
          object: 'list',
          total_cards: 0,
          has_more: false,
          data: []
        };
      }
      throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Scryfall API not available, using mock data:', error);
    // Fall back to mock data when API is not available
    const mockCards = await searchMockCards(query);
    return {
      object: 'list',
      total_cards: mockCards.length,
      has_more: false,
      data: mockCards
    };
  }
}

export async function getCardById(id: string): Promise<ScryfallCard> {
  try {
    const response = await rateLimitedFetch(`${SCRYFALL_API_BASE}/cards/${id}`);
    
    if (!response.ok) {
      throw new Error(`Card not found: ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Scryfall API not available for card lookup:', error);
    // Fall back to mock data
    const mockCards = await searchMockCards(id);
    if (mockCards.length > 0) {
      return mockCards[0];
    }
    throw error;
  }
}

export async function getRandomCard(): Promise<ScryfallCard> {
  try {
    const response = await rateLimitedFetch(`${SCRYFALL_API_BASE}/cards/random`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch random card');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Scryfall API not available for random card:', error);
    // Fall back to mock data
    const mockCards = await searchMockCards('');
    const randomIndex = Math.floor(Math.random() * mockCards.length);
    return mockCards[randomIndex];
  }
}

export async function autocompleteCardName(query: string): Promise<string[]> {
  try {
    const response = await rateLimitedFetch(
      `${SCRYFALL_API_BASE}/cards/autocomplete?q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.warn('Scryfall API not available for autocomplete, using mock data:', error);
    // Fall back to mock data
    return await autocompleteMockCards(query);
  }
}