/**
 * KONIVRER Deck Database - Unified Search Store
 * Modern state management for all search functionality
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useSearchStore = create()(
  devtools(
    persist(
      (set, get) => ({
    // Search state
        query: '',
        filters: {
  }
          type: '',
          element: '',
          strength: { min: '', max: '' },
          cost: { min: '', max: '' },
          rarity: '',
          set: '',
          format: '',
          keywords: [
    ,
          mechanics: [
  ]
        },
        sortBy: 'name',
        sortOrder: 'asc',
        viewMode: 'grid',
        resultsPerPage: 20,
        currentPage: 1,
        
        // Search results
        results: [
    ,
        totalResults: 0,
        isLoading: false,
        error: null,
        
        // Search history
        searchHistory: [
  ],
        savedSearches: [
    ,
        
        // Actions
        setQuery: (query) => set({ query, currentPage: 1 }),
        
        setFilter: (filterKey, value) => set((state) => ({
    filters: { ...state.filters, [filterKey
  ]: value 
  },
          currentPage: 1
        })),
        
        clearFilters: () => set({
    filters: {
  }
            type: '',
            element: '',
            strength: { min: '', max: '' },
            cost: { min: '', max: '' },
            rarity: '',
            set: '',
            format: '',
            keywords: [
    ,
            mechanics: [
  ]
          },
          currentPage: 1
        }),
        
        setSorting: (sortBy, sortOrder = 'asc') => set({ sortBy, sortOrder }),
        
        setViewMode: (viewMode) => set({ viewMode }),
        
        setPage: (page) => set({ currentPage: page }),
        
        setResults: (results, totalResults) => set({
    results, 
          totalResults, 
          isLoading: false, 
          error: null 
  }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error, isLoading: false }),
        
        addToHistory: (searchTerm) => set((state) => ({
    searchHistory: [
    searchTerm,
            ...state.searchHistory.filter(term => term !== searchTerm)
  ].slice(0, 10) // Keep only last 10 searches
  })),
        
        saveSearch: (name, searchConfig) => set((state) => ({
    savedSearches: [
    ...state.savedSearches,
            {
  }
              id: Date.now(),
              name,
              query: searchConfig.query,
              filters: searchConfig.filters,
              sortBy: searchConfig.sortBy,
              sortOrder: searchConfig.sortOrder,
              createdAt: new Date().toISOString()}
  ]
        })),
        
        loadSavedSearch: (savedSearch) => set({
    query: savedSearch.query,
          filters: savedSearch.filters,
          sortBy: savedSearch.sortBy,
          sortOrder: savedSearch.sortOrder,
          currentPage: 1
  }),
        
        deleteSavedSearch: (id) => set((state) => ({
    savedSearches: state.savedSearches.filter(search => search.id !== id)
  }))
      }),
      {
    name: 'konivrer-search-store',
        partialize: (state) => ({
    searchHistory: state.searchHistory,
          savedSearches: state.savedSearches,
          viewMode: state.viewMode,
          resultsPerPage: state.resultsPerPage
  
  })}
    ),
    { name: 'SearchStore' }
  )
);

export default useSearchStore;